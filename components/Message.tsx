import React from 'react';
import { MessageSender, type ChatMessage } from '../types';
import SpeakerIcon from './icons/SpeakerIcon';
import ShowEyeIcon from './icons/ShowEyeIcon';
import HideEyeIcon from './icons/HideEyeIcon';
import TranslateIcon from './icons/TranslateIcon';
import ResetIcon from './icons/ResetIcon';

interface MessageProps {
  message: ChatMessage;
  onSpeak: (text: string) => void;
  onToggleSuggestions?: () => void;
  showSuggestions?: boolean;
  onTranslate?: () => void;
  isTranslating?: boolean;
  isLastUserMessage?: boolean;
  onResendLastUserMessage?: () => void;
  onRequestMoreSuggestions?: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onSpeak, onToggleSuggestions, showSuggestions, onTranslate, isTranslating, isLastUserMessage, onResendLastUserMessage, onRequestMoreSuggestions }) => {
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
      <div className={`relative max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl ${
        isUser
          ? 'bg-blue-500 text-white rounded-br-lg'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-lg'
      }`}>
        <p className="text-base">{message.text}</p>
        {isUser && isLastUserMessage && onResendLastUserMessage && (
          <button
            onClick={onResendLastUserMessage}
            className="absolute bottom-2 right-2 p-1 rounded-full bg-transparent hover:bg-blue-600 text-white opacity-100 hover:opacity-100 transition-colors"
            title="Resend / Reset to previous"
            style={{ boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)' }}
          >
            <ResetIcon className="w-3 h-3 text-white" />
          </button>
        )}
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
              onClick={onTranslate}
              className="text-slate-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label="Dịch sang tiếng Việt"
              title="Dịch sang tiếng Việt"
              type="button"
              disabled={isTranslating}
            >
              <TranslateIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleSuggestions && onToggleSuggestions()}
              className="text-slate-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              aria-label={showSuggestions ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
              title={showSuggestions ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
              type="button"
            >
              {showSuggestions ? <ShowEyeIcon className="w-5 h-5" /> : <HideEyeIcon className="w-5 h-5" />}
            </button>
            {showSuggestions && message.suggestions && message.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                {message.suggestions.map((s, idx) => (
                  <span key={idx} className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-0.5 rounded-full">
                    {s}
                  </span>
                ))}
                {onRequestMoreSuggestions && (
                  <button
                    type="button"
                    className="ml-1 p-1 rounded-full bg-blue-200 dark:bg-blue-800 hover:bg-blue-300 dark:hover:bg-blue-700 text-blue-700 dark:text-blue-200 transition-colors flex items-center justify-center"
                    aria-label="More suggestions"
                    onClick={onRequestMoreSuggestions}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {isAI && message.translation && (
          <div className="mt-2 p-2 rounded bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm">
            <span className="font-semibold">Bản dịch:</span> {message.translation}
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
