import { useState, useEffect, useRef, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

// Polyfill for cross-browser compatibility.
// Using 'any' to avoid potential conflicts with custom type definitions in some environments.
const WebSpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const PREFERRED_VOICE_KEY = 'reflex-english-preferred-voice';

export const useSpeech = (onTranscriptReady: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // Web voices only
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(localStorage.getItem(PREFERRED_VOICE_KEY));
  const [isSpeaking, setIsSpeaking] = useState(false);

  // --- Web Speech API (browser) ---
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return; // Bỏ qua trên mobile
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;
      const availableVoices = window.speechSynthesis.getVoices()
        .filter(voice => voice.lang.startsWith('en'))
        .sort((a, b) => a.name.localeCompare(b.name));
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        const currentVoiceIsValid = selectedVoiceURI && availableVoices.some(v => v.voiceURI === selectedVoiceURI);
        if (!currentVoiceIsValid) {
          const storedVoiceURI = localStorage.getItem(PREFERRED_VOICE_KEY);
          const storedVoiceIsValid = storedVoiceURI && availableVoices.some(v => v.voiceURI === storedVoiceURI);
          if (storedVoiceIsValid) {
            setSelectedVoiceURI(storedVoiceURI!);
          } else {
            const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
            if (defaultVoice) {
              setSelectedVoiceURI(defaultVoice.voiceURI);
              localStorage.setItem(PREFERRED_VOICE_KEY, defaultVoice.voiceURI);
            }
          }
        }
      }
    };
    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVoiceURI]);

  // --- Speech Recognition (browser) ---
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsSupported(true); // Luôn hỗ trợ trên mobile
      return;
    }
    if (WebSpeechRecognition) {
      setIsSupported(true);
      const recognition = new WebSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim();
        if (transcript) {
          onTranscriptReady(transcript);
        }
        recognition.stop();
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      console.warn("Speech recognition not supported in this browser.");
    }
  }, [onTranscriptReady]);

  // --- Voice selection (web only) ---
  const selectVoice = useCallback((voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    localStorage.setItem(PREFERRED_VOICE_KEY, voiceURI);
  }, []);

  // --- Start/Stop Listening ---
  const startListening = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        const perm = await SpeechRecognition.checkPermissions();
        if (perm.speechRecognition !== 'granted') {
          const req = await SpeechRecognition.requestPermissions();
          if (req.speechRecognition !== 'granted') {
            alert('Microphone permission denied.');
            return;
          }
        }
        setIsListening(true);
        await SpeechRecognition.start({
          language: 'en-US',
          maxResults: 1,
          prompt: '',
          partialResults: true,
          popup: false
        });
        // Kết quả sẽ nhận qua addListener bên dưới
      } catch (err) {
        setIsListening(false);
        alert('Cannot start speech recognition: ' + err);
      }
    } else {
      if (recognitionRef.current && !isListening) {
        try {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          recognitionRef.current.start();
          setIsListening(true);
        } catch (error) {
          console.error("Error starting recognition:", error);
        }
      }
    }
  }, [isListening]);

  // Lắng nghe kết quả speech-to-text native
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    const handler = SpeechRecognition.addListener('partialResults', (data: any) => {
      console.log('partialResults', data);
      setIsListening(false);
      if (data.matches && data.matches.length > 0) {
        onTranscriptReady(data.matches[0]);
      }
    });
    return () => {
      handler.then(h => h.remove());
    };
  }, [onTranscriptReady]);

  const stopListening = useCallback(async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await SpeechRecognition.stop();
        setIsListening(false);
      } catch (err) {
        setIsListening(false);
        alert('Cannot stop recognition: ' + err);
      }
    } else {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }
  }, [isListening]);

  // --- Speak (Text-to-Speech) ---
  const speak = useCallback(async (text: string, voiceURI?: string) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await TextToSpeech.speak({
          text,
          lang: 'en-US',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
          category: 'ambient'
        });
        setIsSpeaking(false);
      } catch (err) {
        setIsSpeaking(false);
        alert('Cannot speak: ' + err);
      }
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        const voiceToUseURI = voiceURI || selectedVoiceURI;
        const selectedVoice = voices.find(v => v.voiceURI === voiceToUseURI);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        } else {
          utterance.lang = 'en-US';
          console.warn(`Voice with URI ${voiceToUseURI} not found. Using browser default for lang ${utterance.lang}.`);
        }
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.error("Speech synthesis error:", e.error);
          }
          setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        console.warn("Speech synthesis not supported in this browser.");
      }
    }
  }, [selectedVoiceURI, voices]);

  // Trên mobile không hỗ trợ chọn voice, trả về mảng rỗng và null
  const mobileVoices = Capacitor.isNativePlatform() ? [] : voices;
  const mobileSelectedVoiceURI = Capacitor.isNativePlatform() ? null : selectedVoiceURI;

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    speak,
    voices: mobileVoices,
    selectedVoiceURI: mobileSelectedVoiceURI,
    selectVoice,
    isSpeaking
  };
};