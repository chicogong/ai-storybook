import React from 'react';
import { StoryData } from '../types';

interface StoryPreviewProps {
  story: StoryData;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StoryPreview: React.FC<StoryPreviewProps> = ({ story, onConfirm, onCancel }) => {
  return (
    <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-xl border-2 border-stone-100 flex flex-col max-h-[80vh]">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-indigo-900">Story Outline Preview</h2>
        <p className="text-stone-500 text-sm">Review the generated story before creating the book.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-stone-300">
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
            <span className="text-xs uppercase tracking-wider text-indigo-400 font-bold block mb-1">Title</span>
            <h1 className="text-xl font-bold text-indigo-900">{story.title}</h1>
        </div>

        {story.pages.map((page, index) => (
            <div key={page.id} className="border-b border-stone-100 pb-4 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-stone-800 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                        {index + 1}
                    </span>
                    <h3 className="text-stone-400 text-xs uppercase font-bold tracking-wider">Page Text</h3>
                </div>
                <p className="text-stone-800 font-serif leading-relaxed pl-9">
                    {page.text}
                </p>
            </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4 border-t border-stone-100">
        <button
          onClick={onCancel}
          className="flex-1 py-3 px-4 rounded-xl text-stone-600 font-bold border-2 border-stone-200 hover:bg-stone-50 transition-colors"
        >
          Edit / Retry
        </button>
        <button
          onClick={onConfirm}
          className="flex-[2] py-3 px-4 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          Illustrate & Narrate
        </button>
      </div>
    </div>
  );
};