import React, { useState, useRef } from 'react';
import { StoryInput } from './components/StoryInput';
import { BookViewer } from './components/BookViewer';
import { LoadingOverlay } from './components/LoadingOverlay';
import { StoryPreview } from './components/StoryPreview';
import { AppState, StoryData, GenerationProgress } from './types';
import { generateStoryText, generateIllustration, generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [story, setStory] = useState<StoryData | null>(null);
  const [progress, setProgress] = useState<GenerationProgress>({ current: 0, total: 100, message: '' });
  const [error, setError] = useState<string | null>(null);

  // Helper to create AudioContext safely
  const getAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  };

  const handleGenerateOutline = async (topic: string, language: string) => {
    setAppState(AppState.GENERATING_TEXT);
    setError(null);
    setProgress({ current: 10, total: 100, message: 'Dreaming up a story...' });

    try {
      // 1. Generate Text Structure
      const storyData = await generateStoryText(topic, language);
      setStory(storyData);
      setAppState(AppState.PREVIEW);
      setProgress({ current: 0, total: 0, message: '' }); // Reset progress
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to create story outline.");
      setAppState(AppState.IDLE);
    }
  };

  const handleConfirmOutline = async () => {
    if (!story) return;

    setAppState(AppState.GENERATING_MEDIA);
    setProgress({ current: 0, total: 100, message: 'Starting illustrations...' });

    try {
      // 2. Generate Media for each page (Sequentially to avoid rate limits and allow progress updates)
      const totalPages = story.pages.length;
      const tempContext = getAudioContext(); // Temporary context for decoding

      const enrichedPages = [];
      
      for (let i = 0; i < totalPages; i++) {
        const page = story.pages[i];
        const stepProgress = Math.round(((i) / totalPages) * 100);
        
        // Update message
        setProgress({ 
            current: stepProgress, 
            total: 100, 
            message: `Painting page ${i + 1} of ${totalPages}...` 
        });

        // Parallelize Image and Audio for this specific page
        const [imageResult, audioResult] = await Promise.allSettled([
            generateIllustration(page.imagePrompt),
            generateSpeech(page.text, tempContext)
        ]);

        let imageData = undefined;
        let audioBuffer = undefined;

        if (imageResult.status === 'fulfilled') {
            imageData = imageResult.value;
        } else {
            console.error(`Failed to generate image for page ${i}`, imageResult.reason);
        }

        if (audioResult.status === 'fulfilled') {
            audioBuffer = audioResult.value;
        } else {
            console.error(`Failed to generate audio for page ${i}`, audioResult.reason);
        }

        enrichedPages.push({
            ...page,
            imageData,
            audioBuffer
        });
      }

      // Clean up temp context
      if (tempContext.state !== 'closed') tempContext.close();

      setStory({ ...story, pages: enrichedPages });
      setProgress({ current: 100, total: 100, message: 'Ready!' });
      
      // Short delay to show 100%
      setTimeout(() => {
        setAppState(AppState.READING);
      }, 500);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while painting the story.");
      setAppState(AppState.PREVIEW); // Go back to preview on error
    }
  };

  const handleCancelPreview = () => {
    setAppState(AppState.IDLE);
    setStory(null);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setStory(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-parchment bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
      
      {(appState === AppState.GENERATING_TEXT || appState === AppState.GENERATING_MEDIA) && (
        <LoadingOverlay progress={progress} />
      )}

      {appState === AppState.IDLE && (
        <div className="w-full flex flex-col items-center animate-fade-in-up">
           {error && (
             <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-md w-full text-center">
               {error}
             </div>
           )}
          <StoryInput onGenerate={handleGenerateOutline} isGenerating={false} />
        </div>
      )}

      {appState === AppState.PREVIEW && story && (
         <div className="w-full flex flex-col items-center animate-fade-in">
             {error && (
             <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg max-w-md w-full text-center">
               {error}
             </div>
           )}
            <StoryPreview 
                story={story} 
                onConfirm={handleConfirmOutline} 
                onCancel={handleCancelPreview} 
            />
         </div>
      )}

      {appState === AppState.READING && story && (
        <BookViewer story={story} onReset={handleReset} />
      )}

      {/* Footer */}
      <footer className="fixed bottom-2 text-stone-400 text-xs text-center w-full no-print">
        Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;