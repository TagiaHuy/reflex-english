import React from 'react';
import type { HelpContent } from '../types';
import SpeakerIcon from './icons/SpeakerIcon';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: HelpContent | null;
  isLoading: boolean;
  speak: (text: string) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, content, isLoading, speak }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-auto p-6 md:p-8 transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Need a little help?</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {isLoading && <div className="flex justify-center items-center h-48"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>}

        {!isLoading && content && (
          <div className="space-y-6 text-slate-600 dark:text-slate-300">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">✍️ Sample Sentences</h3>
              <ul className="space-y-2">
                {content.sampleSentences.map((sentence, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <p className="flex-1 mr-2">"{sentence}"</p>
                    <button onClick={() => speak(sentence)} className="text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors p-1 rounded-full" aria-label={`Read sentence aloud: ${sentence}`}>
                      <SpeakerIcon className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">💡 Grammar Tip</h3>
              <p className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-800 dark:text-blue-200">{content.grammarTip}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3">🗣️ Pronunciation Focus</h3>
              <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-800 dark:text-green-200">
                <p className="font-medium italic mb-1">"{content.pronunciationFocus.sentence}"</p>
                <p>{content.pronunciationFocus.explanation}</p>
              </div>
            </div>

          </div>
        )}
         {!isLoading && !content && (
            <div className="text-center py-8">
                <p className="text-slate-500">Sorry, I couldn't get any tips right now. Please try again.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HelpModal;