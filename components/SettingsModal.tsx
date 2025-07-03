import React from 'react';
import SpeakerIcon from './icons/SpeakerIcon';
import { setGeminiModel, getGeminiModel, GEMINI_MODELS, GEMINI_API_KEYS } from '../services/geminiService';
import { geminiService } from '../services/geminiService';

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
  const [model, setModel] = React.useState<string>(getGeminiModel() || GEMINI_MODELS[0].value);
  const [apiKey, setApiKey] = React.useState<string>(geminiService.getApiKey());
  const [customKey, setCustomKey] = React.useState<string>('');
  const [copyMsg, setCopyMsg] = React.useState<string>('');

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel(e.target.value);
    setGeminiModel(e.target.value);
  };

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    geminiService.setApiKey(key);
    setCustomKey('');
  };

  const handleCustomKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomKey(e.target.value);
  };

  const handleCustomKeyApply = () => {
    if (customKey.trim()) {
      handleApiKeyChange(customKey.trim());
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopyMsg('Đã copy!');
    setTimeout(() => setCopyMsg(''), 1000);
  };

  React.useEffect(() => {
    setApiKey(geminiService.getApiKey());
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-0 md:p-0 transform transition-all flex flex-col"
        onClick={e => e.stopPropagation()}
        style={{maxHeight: '90vh'}}
      >
        <div className="flex justify-between items-center mb-6 px-6 pt-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Voice & Model Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pb-2" style={{maxHeight: 'calc(90vh - 120px)'}}>
          <div className="mb-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-2 text-base">Select AI Model</label>
            <div className="flex flex-col gap-2 overflow-y-auto max-h-40">
              {GEMINI_MODELS.map(m => (
                <label key={m.value} className="flex items-center gap-2 text-sm font-medium">
                  <input type="radio" name="gemini-model" value={m.value} checked={model === m.value} onChange={handleModelChange} />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-2 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex-1 min-h-[120px] flex flex-col">
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-2 text-base">Select English Voice</label>
            <div className="space-y-2 overflow-y-auto pr-2 flex-grow max-h-48">
              {voices.length > 0 ? voices.map(voice => (
                <div 
                  key={voice.voiceURI}
                  onClick={() => onSelectVoice(voice.voiceURI)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${selectedVoiceURI === voice.voiceURI ? 'bg-blue-500 text-white' : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                  role="radio"
                  aria-checked={selectedVoiceURI === voice.voiceURI}
                  tabIndex={0}
                  onKeyPress={(e) => e.key === 'Enter' && onSelectVoice(voice.voiceURI)}
                >
                  <div className="flex-1 mr-2">
                    <p className={`font-medium ${selectedVoiceURI === voice.voiceURI ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>{voice.name}</p>
                    <p className={`text-xs ${selectedVoiceURI === voice.voiceURI ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{voice.lang}</p>
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
          </div>
          <div className="mb-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <label className="block text-slate-700 dark:text-slate-200 font-semibold mb-2 text-base">Select or Enter Gemini API Key</label>
            <div className="flex flex-col gap-2 mb-2 w-full overflow-y-auto max-h-32">
              {GEMINI_API_KEYS.map((key, idx) => (
                <label key={key} className="flex items-center gap-2 text-sm font-mono w-full">
                  <input type="radio" name="gemini-api-key" value={key} checked={apiKey === key} onChange={() => handleApiKeyChange(key)} />
                  <span className="break-all flex-1">{key.slice(0, 10)}...{key.slice(-6)}</span>
                  <button type="button" className="ml-2 text-xs text-blue-500 hover:underline whitespace-nowrap" onClick={() => handleCopy(key)}>Copy</button>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-2 w-full">
              <input
                type="text"
                className="flex-1 px-2 py-1 rounded border border-slate-300 dark:bg-slate-800 dark:text-white w-full"
                placeholder="Nhập API Key tuỳ ý..."
                value={customKey}
                onChange={handleCustomKeyInput}
                onKeyDown={e => e.key === 'Enter' && handleCustomKeyApply()}
              />
              <button
                type="button"
                className="px-3 py-1 rounded bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 whitespace-nowrap"
                onClick={handleCustomKeyApply}
                disabled={!customKey.trim()}
              >Dùng key này</button>
            </div>
            {copyMsg && <div className="text-green-600 text-xs mt-1">{copyMsg}</div>}
            <div className="text-xs text-slate-500 mt-2">API Key sẽ được lưu trên trình duyệt của bạn.</div>
          </div>
        </div>
        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700 px-6 pb-4">
            <button onClick={onClose} className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700">Done</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;