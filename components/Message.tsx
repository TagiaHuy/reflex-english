import React from 'react';
import { MessageSender, type ChatMessage } from '../types';
import SpeakerIcon from './icons/SpeakerIcon';

interface MessageProps {
  message: ChatMessage;
  onSpeak: (text: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onSpeak }) => {
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
          <button 
            onClick={() => onSpeak(message.text)}
            className="mt-2 text-slate-400 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            aria-label="Read message aloud"
          >
            <SpeakerIcon className="w-5 h-5" />
          </button>
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
