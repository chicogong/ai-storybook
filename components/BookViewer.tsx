import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { StoryData, StoryPage } from '../types';

interface BookViewerProps {
  story: StoryData;
  onReset: () => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({ story, onReset }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const currentPage: StoryPage = story.pages[currentPageIndex];

  // Initialize AudioContext
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      stopAudio();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, []);

  // Auto-play audio when page changes
  useEffect(() => {
    stopAudio();
    // Small delay to allow transition
    const timer = setTimeout(() => {
        playAudio(currentPage.audioBuffer);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex]);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // ignore if already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudio = (buffer?: AudioBuffer) => {
    if (!buffer || !audioContextRef.current) return;
    
    // Resume context if suspended (browser policy)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    stopAudio();

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => setIsPlaying(false);
    source.start(0);
    sourceNodeRef.current = source;
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (currentPageIndex < story.pages.length - 1) {
      setCurrentPageIndex(p => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(p => p - 1);
    }
  };

  const handleReplay = () => {
    playAudio(currentPage.audioBuffer);
  };

  const handleExportPDF = async () => {
    if (!exportRef.current) return;
    setIsExporting(true);

    try {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pages = exportRef.current.children;
        const totalPages = pages.length;

        for (let i = 0; i < totalPages; i++) {
            const pageElement = pages[i] as HTMLElement;
            
            // Capture the specific export page element
            const canvas = await html2canvas(pageElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Important for images if cross-origin
                logging: false
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.8);
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            if (i > 0) pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
        }

        const filename = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        pdf.save(filename);
    } catch (error) {
        console.error("PDF Export failed:", error);
        alert("Failed to export PDF. Please try again.");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in py-4">
        
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-4 px-4 max-w-xl no-print">
        <button 
            onClick={onReset}
            className="text-stone-500 hover:text-stone-800 font-bold flex items-center gap-2 transition-colors"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span className="hidden sm:inline">New Story</span>
        </button>
        <h2 className="text-xl font-serif font-bold text-indigo-900 text-center truncate px-2">
            {story.title}
        </h2>
        
        <button 
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-2 transition-colors ${isExporting ? 'opacity-50 cursor-wait' : ''}`}
            title="Download PDF"
        >
            {isExporting ? (
                <span className="animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </span>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
            )}
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export PDF'}</span>
        </button>
      </div>

      {/* Book Page Container - Vertical Layout */}
      <div id="book-page" className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl border-4 md:border-8 border-stone-800 flex flex-col overflow-hidden mx-auto print:border-0 print:shadow-none">
        
        {/* Top: Image (Larger Area) */}
        <div className="w-full aspect-square bg-stone-200 relative overflow-hidden group border-b-4 border-stone-800 print:border-b-0">
            {currentPage.imageData ? (
                <img 
                    src={currentPage.imageData} 
                    alt={currentPage.imagePrompt} 
                    className="w-full h-full object-cover animate-scale-in"
                />
            ) : (
                <div className="flex items-center justify-center h-full text-stone-400 bg-stone-100">
                    No Image Available
                </div>
            )}
             {/* Page Number Overlay on Image */}
             <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm no-print">
                {currentPageIndex + 1} / {story.pages.length}
            </div>
        </div>

        {/* Bottom: Subtitle Text Area */}
        <div className="w-full p-6 bg-parchment flex flex-col justify-center items-center text-center relative min-h-[140px]">
            <p className="text-lg md:text-xl font-serif leading-relaxed text-stone-800 max-w-prose">
                {currentPage.text}
            </p>

            {/* Audio Control */}
            <button 
                onClick={handleReplay}
                className={`mt-4 p-2 rounded-full transition-all no-print ${isPlaying ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200' : 'text-stone-400 hover:text-indigo-600 hover:bg-stone-100'}`}
                title="Replay Audio"
            >
                {isPlaying ? (
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 animate-pulse">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                     </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                )}
            </button>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-6 pb-8 no-print">
        <button
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className={`group p-4 rounded-full bg-white shadow-lg border border-stone-200 transition-all active:scale-95 ${currentPageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-indigo-100'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-indigo-900 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>

        <div className="font-serif font-bold text-stone-600 text-lg">
            {currentPageIndex + 1} <span className="text-stone-300 mx-1">/</span> {story.pages.length}
        </div>

        <button
            onClick={handleNext}
            disabled={currentPageIndex === story.pages.length - 1}
            className={`group p-4 rounded-full bg-white shadow-lg border border-stone-200 transition-all active:scale-95 ${currentPageIndex === story.pages.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-50 hover:border-indigo-300 hover:shadow-indigo-100'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 text-indigo-900 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
        </button>
      </div>

        {/* Hidden Container for PDF Generation - Renders all pages in an A4-friendly format */}
        <div 
            ref={exportRef} 
            className="absolute top-0 left-[-9999px] pointer-events-none"
        >
            {story.pages.map((page, index) => (
                <div 
                    key={`export-page-${index}`} 
                    className="w-[794px] h-[1123px] bg-white flex flex-col items-center p-12 border border-gray-100"
                >
                    {/* Page Content */}
                    <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
                        {/* Title on first page */}
                        {index === 0 && (
                            <div className="text-center mb-8">
                                <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">{story.title}</h1>
                                <p className="text-slate-500 font-sans">An AI Generated Story</p>
                            </div>
                        )}

                        {/* Image */}
                        <div className="w-[500px] h-[500px] bg-slate-100 rounded-sm overflow-hidden border-4 border-slate-800 shadow-sm">
                            {page.imageData && (
                                <img src={page.imageData} alt="Story illustration" className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Text */}
                        <div className="w-full max-w-[600px] text-center">
                            <p className="text-2xl font-serif leading-relaxed text-slate-800">
                                {page.text}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="w-full flex justify-center mt-auto pt-8 border-t border-slate-100">
                         <span className="text-slate-400 font-serif text-sm">Page {index + 1}</span>
                    </div>
                </div>
            ))}
        </div>

    </div>
  );
};