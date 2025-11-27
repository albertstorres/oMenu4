import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

interface UseTextToSpeechReturn {
  isReading: boolean;
  isPaused: boolean;
  currentText: string;
  readingElement: HTMLElement | null;
  read: (text: string, element?: HTMLElement) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
  setVolume: (volume: number) => void;
  rate: number;
  pitch: number;
  volume: number;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn => {
  const {
    rate: initialRate = 1,
    pitch: initialPitch = 1,
    volume: initialVolume = 1,
    lang = 'pt-BR'
  } = options;

  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [readingElement, setReadingElement] = useState<HTMLElement | null>(null);
  const [rate, setRateState] = useState(initialRate);
  const [pitch, setPitchState] = useState(initialPitch);
  const [volume, setVolumeState] = useState(initialVolume);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const queueRef = useRef<string[]>([]);
  const elementsRef = useRef<HTMLElement[]>([]);

  // Limpa highlight quando termina de ler
  const clearHighlights = useCallback(() => {
    document.querySelectorAll('.reading-highlight').forEach((el) => {
      el.classList.remove('reading-highlight');
    });
  }, []);

  // Adiciona highlight no elemento sendo lido
  const highlightElement = useCallback((element: HTMLElement | null) => {
    clearHighlights();
    if (element) {
      element.classList.add('reading-highlight');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [clearHighlights]);

  const read = useCallback((text: string, element?: HTMLElement) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech Synthesis não é suportado neste navegador');
      return;
    }

    // Para qualquer leitura anterior
    window.speechSynthesis.cancel();
    clearHighlights();
    setIsPaused(false);
    setIsReading(true);
    setCurrentText(text);
    setReadingElement(element || null);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => {
      setIsReading(true);
      setIsPaused(false);
      if (element) {
        highlightElement(element);
      }
    };

    utterance.onend = () => {
      setIsReading(false);
      setIsPaused(false);
      setCurrentText('');
      setReadingElement(null);
      clearHighlights();
    };

    utterance.onerror = (event) => {
      console.error('Erro na síntese de voz:', event);
      setIsReading(false);
      setIsPaused(false);
      clearHighlights();
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [lang, rate, pitch, volume, highlightElement, clearHighlights]);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
    setCurrentText('');
    setReadingElement(null);
    clearHighlights();
  }, [clearHighlights]);

  const setRate = useCallback((newRate: number) => {
    setRateState(newRate);
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  }, []);

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(newPitch);
    if (utteranceRef.current) {
      utteranceRef.current.pitch = newPitch;
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
  }, []);

  // Limpa ao desmontar
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      clearHighlights();
    };
  }, [clearHighlights]);

  return {
    isReading,
    isPaused,
    currentText,
    readingElement,
    read,
    pause,
    resume,
    stop,
    setRate,
    setPitch,
    setVolume,
    rate,
    pitch,
    volume
  };
};

