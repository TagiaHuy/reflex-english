import React from 'react';

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div
        className="cursor-pointer bg-white dark:bg-slate-800 shadow-xl rounded-2xl p-12 flex flex-col items-center hover:scale-105 transition-transform border border-slate-200 dark:border-slate-700"
        onClick={onStart}
        role="button"
        tabIndex={0}
        onKeyPress={e => { if (e.key === 'Enter') onStart(); }}
        aria-label="Start contextual speaking practice"
      >
        <span className="text-6xl mb-4">🗣️</span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-2 text-center">
          Contextual Speaking Practice
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-xs">
          Practice your English speaking skills in real-life scenarios with AI.
        </p>
      </div>
    </div>
  );
};

export default HomeScreen; 