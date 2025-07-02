import React from 'react';
import { MessageSender, type ChatMessage } from '../types';
import SpeakerIcon from './icons/SpeakerIcon';
import ShowEyeIcon from './icons/ShowEyeIcon';
import HideEyeIcon from './icons/HideEyeIcon';

interface MessageProps {
  message: ChatMessage;
  onSpeak: (text: string) => void;
  onToggleSuggestions?: () => void;
  showSuggestions?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, onSpeak, onToggleSuggestions, showSuggestions }) => {
  const isUser = message.sender === MessageSender.User;
  const isAI = message.sender === MessageSender.AI;
  const isSystem = message.sender === MessageSender.System;

  if (isSystem) {
    return (
      <div className="my-4 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400 italic">{message.text}</p>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2 my-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center font-bold text-slate-500 dark:text-slate-300 flex-shrink-0">
          AI
        </div>
      )}
      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
        isUser
          ? 'bg-blue-500 text-white rounded-br-lg'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'
      }`}>
        <p className="text-base">{message.text}</p>
        {isAI && (
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={() => onSpeak(message.text)}
              className="text-slate-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="Read message aloud"
            >
              <SpeakerIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleSuggestions && onToggleSuggestions()}
              className="text-slate-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label={showSuggestions ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
              title={showSuggestions ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
              type="button"
            >
              {showSuggestions ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 4.5C7 4.5 2.73 8.11 1 12c1.73 3.89 6 7.5 11 7.5s9.27-3.61 11-7.5C21.27 8.11 17 4.5 12 4.5zm0 13c-3.87 0-7.19-2.54-8.48-6C4.81 8.04 8.13 5.5 12 5.5s7.19 2.54 8.48 6c-1.29 3.46-4.61 6-8.48 6zm0-10a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 6a9.77 9.77 0 018.94 6A9.77 9.77 0 0112 18a9.77 9.77 0 01-8.94-6A9.77 9.77 0 0112 6m0-1.5C7 4.5 2.73 8.11 1 12c.46 1.03 1.09 2 1.86 2.86l1.42-1.42A7.77 7.77 0 013.5 12c1.29-3.46 4.61-6 8.48-6s7.19 2.54 8.48 6c-.46 1.03-1.09 2-1.86 2.86l-1.42-1.42A7.77 7.77 0 0020.5 12c-1.29 3.46-4.61 6-8.48 6s-7.19-2.54-8.48-6c.46-1.03 1.09-2 1.86-2.86l1.42 1.42A7.77 7.77 0 013.5 12c1.29-3.46 4.61-6 8.48-6zM12 8a4 4 0 014 4c0 .88-.36 1.68-.93 2.25l1.42 1.42A5.98 5.98 0 0012 6a5.98 5.98 0 00-4.49 2.67l1.42 1.42A4.01 4.01 0 0112 8zm0 2a2 2 0 110 4 2 2 0 010-4z" />
                </svg>
              )}
            </button>
            {showSuggestions && message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {message.suggestions.map((s, idx) => (
                  <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {isUser && message.pronunciationFeedback && (
          <div className="mt-2 pt-2 border-t border-blue-400/50">
            <p className="text-xs text-blue-100 italic">
              <span className="font-semibold">💡 Tip:</span> {message.pronunciationFeedback}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
