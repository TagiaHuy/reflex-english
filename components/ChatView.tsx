import React, { useState, useRef, useEffect, useCallback } from 'react';
import { geminiService } from '../services/geminiService';
import { useSpeech } from '../hooks/useSpeech';
import type { Scenario, ChatMessage, HelpContent } from '../types';
import { MessageSender } from '../types';
import Message from './Message';
import HelpModal from './HelpModal';
import SettingsModal from './SettingsModal';
import MicrophoneIcon from './icons/MicrophoneIcon';
import HelpIcon from './icons/HelpIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import LoadingSpinner from './icons/LoadingSpinner';
import ShowEyeIcon from './icons/ShowEyeIcon';
import HideEyeIcon from './icons/HideEyeIcon';
import TranslateIcon from './icons/TranslateIcon';

interface ChatViewProps {
  scenario: Scenario;
  onExit: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ scenario, onExit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [helpContent, setHelpContent] = useState<HelpContent | null>(null);
  const [isHelpLoading, setIsHelpLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const hasStarted = useRef(false);
  const [translatingMsgId, setTranslatingMsgId] = useState<string | null>(null);
  const [pendingTranscript, setPendingTranscript] = useState<string | null>(null);

  const handleTranscript = useCallback((transcript: string) => {
    setPendingTranscript(transcript);
  }, []);

  const {
    isListening,
    isSupported,
    startListening,
    stopListening,
    speak,
    voices,
    selectedVoiceURI,
    selectVoice
  } = useSpeech(handleTranscript);

  const handleSendTranscript = useCallback(async () => {
    if (!pendingTranscript) return;
    setPendingTranscript(null);
    if (isAiTyping) return;
    const transcript = pendingTranscript;
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: MessageSender.User,
      text: transcript,
      pronunciationFeedback: null,
    };
    setMessages(prev => [...prev, userMessage]);
    setIsAiTyping(true);

    // Get full AI response (no streaming)
    const aiResult = await geminiService.sendMessage(
      transcript,
      scenario.title,
      messages.concat({ sender: MessageSender.User, text: transcript, id: '', pronunciationFeedback: null }).slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n')
    );
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: MessageSender.AI,
      text: aiResult.reply,
      suggestions: aiResult.suggestions,
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsAiTyping(false);
    speak(aiResult.reply, selectedVoiceURI || undefined);

    // Update user message with feedback when ready
    const feedback = await geminiService.getPronunciationFeedback(transcript);
    setMessages(prev => prev.map(msg =>
      msg.id === userMessage.id ? { ...msg, pronunciationFeedback: feedback } : msg
    ));
  }, [isAiTyping, scenario.title, messages, pendingTranscript, selectedVoiceURI]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    const startConversation = async () => {
      geminiService.startChat(scenario.systemPrompt);
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: MessageSender.System,
        text: `You've started the "${scenario.title}" scenario. The AI will now introduce itself.`,
      };
      setIsAiTyping(true);

      const aiResult = await geminiService.sendMessage(
        "Hello! Please start the conversation by introducing yourself based on your assigned role.",
        scenario.title,
        ''
      );

      const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: MessageSender.AI,
          text: aiResult.reply,
          suggestions: aiResult.suggestions,
      };
      
      setIsAiTyping(false);
      setMessages([welcomeMessage, aiMessage]);
      speak(aiResult.reply, selectedVoiceURI || undefined);
    };

    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleGetHelp = async () => {
    setHelpModalOpen(true);
    setIsHelpLoading(true);
    const history = messages.slice(-4).map(m => `${m.sender}: ${m.text}`).join('\n');
    const content = await geminiService.getHelpContent(history, scenario.title);
    setHelpContent(content);
    setIsHelpLoading(false);
  };

  const handleTranslate = async (msgId: string, text: string) => {
    setTranslatingMsgId(msgId);
    try {
      const translation = await geminiService.translateToVietnamese(text);
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, translation } : m));
    } finally {
      setTranslatingMsgId(null);
    }
  };

  // Hàm xử lý gửi lại (reset)
  const handleResendLastUserMessage = () => {
    setMessages(prev => prev.slice(0, -2));
    setTimeout(() => {
      setPendingTranscript(null);
      startListening();
    }, 0);
  };
  
  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex items-center justify-between z-10">
        <button onClick={onExit} className="text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Scenarios
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-800 dark:text-white">{scenario.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{scenario.emoji}</p>
        </div>
        <div className="w-28 text-right flex items-center justify-end gap-2">
            <button onClick={handleGetHelp} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Get help">
                <HelpIcon className="w-6 h-6"/>
            </button>
            <button onClick={() => setSettingsModalOpen(true)} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" aria-label="Open settings">
                <SettingsIcon className="w-6 h-6"/>
            </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, idx) => (
            <Message
              key={msg.id}
              message={msg}
              onSpeak={speak}
              showSuggestions={showSuggestions}
              onToggleSuggestions={msg.sender === MessageSender.AI ? () => setShowSuggestions(v => !v) : undefined}
              onTranslate={msg.sender === MessageSender.AI ? () => handleTranslate(msg.id, msg.text) : undefined}
              isTranslating={translatingMsgId === msg.id}
              isLastUserMessage={msg.sender === MessageSender.User && idx === messages.length - 2}
              onResendLastUserMessage={handleResendLastUserMessage}
            />
          ))}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          <div className="w-28 hidden md:block"></div> {/* Spacer left, hidden on mobile */}
          {pendingTranscript ? (
            <div className="flex items-center w-full max-w-md mx-auto">
              <div
                className="flex flex-row items-center flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-base cursor-pointer select-none hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                title="Click to re-record or send"
              >
                <span
                  className="flex-1 text-center"
                  onClick={() => {
                    setPendingTranscript(null);
                    startListening();
                  }}
                >
                  "{pendingTranscript}"
                </span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleSendTranscript();
                  }}
                  className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow flex items-center justify-center"
                  title="Send"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!isSupported || isAiTyping}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out text-white shadow-lg
                ${isListening ? 'bg-red-500 animate-pulse' : 'bg-blue-500 hover:bg-blue-600'}
                ${!isSupported || isAiTyping ? 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed' : ''}`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isAiTyping ? <LoadingSpinner className="w-8 h-8" /> : <MicrophoneIcon className="w-8 h-8"/>}
            </button>
          )}
          <div className="w-28 hidden md:block"></div> {/* Spacer right, hidden on mobile */}
        </div>
        {!isSupported && <p className="text-center text-xs text-red-500 mt-2">Speech recognition is not supported by your browser.</p>}
      </footer>
      <HelpModal 
        isOpen={isHelpModalOpen} 
        onClose={() => setHelpModalOpen(false)} 
        content={helpContent} 
        isLoading={isHelpLoading} 
        speak={speak}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        voices={voices}
        selectedVoiceURI={selectedVoiceURI}
        onSelectVoice={selectVoice}
        onPreviewVoice={(text, uri) => speak(text, uri || undefined)}
      />
    </div>
  );
};

export default ChatView;