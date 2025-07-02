import React from 'react';
import SpeakerIcon from './icons/SpeakerIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  onSelectVoice: (uri: string) => void;
  onPreviewVoice: (text: string, uri: string) => void;
}

const PREVIEW_TEXT = "The quick brown fox jumps over the lazy dog.";

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, voices, selectedVoiceURI, onSelectVoice, onPreviewVoice }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 md:p-8 transform transition-all flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{maxHeight: '90vh'}}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Voice Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div className="space-y-2 overflow-y-auto pr-2 flex-grow">
          {voices.length > 0 ? voices.map(voice => (
            <div 
              key={voice.voiceURI}
              onClick={() => onSelectVoice(voice.voiceURI)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedVoiceURI === voice.voiceURI ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
              role="radio"
              aria-checked={selectedVoiceURI === voice.voiceURI}
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && onSelectVoice(voice.voiceURI)}
            >
              <div className="flex-1 mr-2">
                <p className={`font-medium ${selectedVoiceURI === voice.voiceURI ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{voice.name}</p>
                <p className={`text-sm ${selectedVoiceURI === voice.voiceURI ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{voice.lang}</p>
              </div>
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    onPreviewVoice(PREVIEW_TEXT, voice.voiceURI);
                }}
                className={`p-2 rounded-full transition-colors ${selectedVoiceURI === voice.voiceURI ? 'hover:bg-blue-400/50' : 'hover:bg-slate-300 dark:hover:bg-slate-500'}`}
                aria-label={`Preview voice ${voice.name}`}
              >
                <SpeakerIcon className="w-5 h-5" />
              </button>
            </div>
          )) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-4">No English voices found in your browser.</p>
          )}
        </div>

        <div className="mt-6 flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Done</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;