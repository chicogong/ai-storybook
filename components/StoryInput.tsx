import React, { useState } from 'react';

interface StoryInputProps {
  onGenerate: (topic: string, language: string) => void;
  isGenerating: boolean;
}

export const StoryInput: React.FC<StoryInputProps> = ({ onGenerate, isGenerating }) => {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Chinese (Simplified)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic, language);
    }
  };

  const suggestions = [
    { emoji: "🚀", text: "勇敢的宇航员猫咪", desc: "太空冒险" },
    { emoji: "🦖", text: "一只想吃冰淇淋的恐龙", desc: "有趣的恐龙" },
    { emoji: "🧚‍♀️", text: "住在花园里的魔法精灵", desc: "奇幻故事" },
    { emoji: "🐢", text: "世界上跑得最快的乌龟", desc: "励志寓言" }
  ];

  const languages = [
    { code: 'Chinese (Simplified)', label: '中文' },
    { code: 'English', label: 'English' },
    { code: 'Japanese', label: '日本語' },
    { code: 'French', label: 'Français' },
    { code: 'Spanish', label: 'Español' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center">
      
      {/* Hero Header */}
      <div className="text-center mb-8 animate-fade-in-down">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 mb-4 shadow-sm border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-950 mb-3 tracking-tight">
          Magic Tales
        </h1>
        <p className="text-lg md:text-xl text-stone-600 font-serif italic max-w-2xl mx-auto">
          让 AI 为你编织绘本故事，开启奇妙旅程。
        </p>
      </div>

      {/* Main Input Card */}
      <div className="w-full bg-white/90 backdrop-blur-md p-6 md:p-8 rounded-[2rem] shadow-2xl border border-white/60 relative overflow-hidden">
        
        {/* Decorative background blobs */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
          
          {/* Topic Input */}
          <div className="flex flex-col gap-2">
             <label htmlFor="topic" className="text-sm font-bold text-stone-500 uppercase tracking-wider ml-2">
              我想听一个关于...的故事
            </label>
            <div className="relative group">
                <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGenerating}
                    placeholder="例如：一只住在云朵上的小猫..."
                    className="w-full px-5 py-4 pl-12 rounded-xl border-2 border-stone-200 bg-stone-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-sans text-lg placeholder:text-stone-400 shadow-sm"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                </div>
            </div>
          </div>

          <div className="flex flex-row gap-3 items-end">
             {/* Language Select - Compact width */}
            <div className="w-[120px] sm:w-[150px]">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider ml-2 mb-2 block truncate">
                    语言
                </label>
                <div className="relative">
                     <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        disabled={isGenerating}
                        className="w-full px-3 py-3.5 rounded-xl border border-stone-200 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-sans text-base appearance-none cursor-pointer hover:border-indigo-300 truncate pr-8"
                    >
                        {languages.map((lang) => (
                            <option key={lang.code} value={lang.code}>{lang.label}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

             {/* Action Button - Flex 1 to fill space */}
            <button
                type="submit"
                disabled={isGenerating || !topic.trim()}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 h-[54px] ${
                    isGenerating || !topic.trim()
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200 text-white'
                }`}
            >
                {isGenerating ? (
                    'Creating...'
                ) : (
                    <>
                        <span>开始生成</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                        </svg>
                    </>
                )}
            </button>
          </div>
        </form>

        {/* Suggestions */}
        <div className="mt-8 pt-6 border-t border-stone-100">
             <p className="text-center text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                或者试试这些灵感
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.map((s) => (
                    <button
                        key={s.text}
                        onClick={() => setTopic(s.text)}
                        disabled={isGenerating}
                        className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-lg hover:shadow-indigo-50 border border-transparent hover:border-indigo-100 transition-all text-left bg-stone-50"
                    >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{s.emoji}</span>
                        <div className="flex flex-col min-w-0">
                            <span className="text-stone-700 font-bold group-hover:text-indigo-700 transition-colors truncate text-sm sm:text-base">{s.text}</span>
                            <span className="text-stone-400 text-xs font-medium truncate">{s.desc}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
