import React, { useState } from 'react';

interface StoryInputProps {
  onGenerate: (topic: string, language: string) => void;
  isGenerating: boolean;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('English');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, language);
    }
  };

  const suggestions = [
    "A brave astronaut cat",
    "A lost robot in the forest",
    "A magical cooking pot",
    "The fastest turtle in the world"
  ];

  const languages = [
    { code: 'English', label: 'English 🇺🇸' },
    { code: 'Chinese (Simplified)', label: 'Chinese (中文) 🇨🇳' },
    { code: 'Spanish', label: 'Spanish (Español) 🇪🇸' },
    { code: 'French', label: 'French (Français) 🇫🇷' },
    { code: 'Japanese', label: 'Japanese (日本語) 🇯🇵' },
  ];

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border-2 border-stone-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-serif text-indigo-900 mb-2">Magic Tales</h1>
        <p className="text-stone-500 font-sans">Create your own AI storybook instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
           <label htmlFor="language" className="block text-sm font-bold text-stone-700 mb-2">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isGenerating}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-sans text-lg bg-white"
          >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-bold text-stone-700 mb-2">
            What should the story be about?
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isGenerating}
            placeholder="e.g., A dinosaur who loves ice cream"
            className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-sans text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isGenerating || !topic.trim()}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all transform hover:-translate-y-1 ${
            isGenerating || !topic.trim()
              ? 'bg-stone-300 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200'
          }`}
        >
          {isGenerating ? 'Weaving Magic...' : 'Generate Outline'}
        </button>
      </form>

      <div className="mt-8">
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 text-center">Or try these</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setTopic(s)}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-stone-100 hover:bg-indigo-50 text-stone-600 text-sm rounded-lg transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};