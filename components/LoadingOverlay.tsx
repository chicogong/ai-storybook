import React from 'react';
import { GenerationProgress } from '../types';

interface LoadingOverlayProps {
  progress: GenerationProgress;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ progress }) => {
  const percentage = Math.round((progress.current / progress.total) * 100);

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        
        {/* Magical Icon */}
        <div className="mb-8 relative">
            <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-30 rounded-full animate-pulse"></div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-indigo-600 mx-auto relative z-10 animate-bounce">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
        </div>

        <h3 className="text-2xl font-bold text-stone-800 mb-2">Writing your story...</h3>
        <p className="text-stone-500 mb-6 h-6">{progress.message}</p>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 rounded-full h-4 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-right text-sm font-bold text-indigo-600">
            {percentage}%
        </div>

      </div>
    </div>
  );
};