import { useState, useEffect, useRef, useCallback } from 'react';

// Polyfill for cross-browser compatibility.
// Using 'any' to avoid potential conflicts with custom type definitions in some environments.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const PREFERRED_VOICE_KEY = 'reflex-english-preferred-voice';

export const useSpeech = (onTranscriptReady: (transcript: string) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // New states for synthesis
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(localStorage.getItem(PREFERRED_VOICE_KEY));
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;
      const availableVoices = window.speechSynthesis.getVoices()
        .filter(voice => voice.lang.startsWith('en'))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setVoices(availableVoices);

      if (availableVoices.length > 0) {
          const currentVoiceIsValid = selectedVoiceURI && availableVoices.some(v => v.voiceURI === selectedVoiceURI);
          if (!currentVoiceIsValid) {
              const defaultVoice = availableVoices.find(v => v.default) || availableVoices[0];
              if (defaultVoice) {
                  const newURI = defaultVoice.voiceURI;
                  setSelectedVoiceURI(newURI);
                  localStorage.setItem(PREFERRED_VOICE_KEY, newURI);
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
    // The empty dependency array is correct here because we want this to run once and set up the listener.
    // The listener will handle subsequent updates to the voice list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
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

  const selectVoice = useCallback((voiceURI: string) => {
    setSelectedVoiceURI(voiceURI);
    localStorage.setItem(PREFERRED_VOICE_KEY, voiceURI);
  }, []);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        // Stop any speech before listening
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
        }
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string, voiceURI?: string) => {
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
        // Don't log an error if speech was simply cancelled or interrupted by another call.
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.error("Speech synthesis error:", e.error);
        }
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  }, [selectedVoiceURI, voices]);

  return { isListening, isSupported, startListening, stopListening, speak, voices, selectedVoiceURI, selectVoice, isSpeaking };
};