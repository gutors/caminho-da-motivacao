import { useState, useRef, useCallback } from 'react';

export function useSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const speechRef = useRef(null);

  const speak = useCallback((text, options = {}) => {
    // Parar qualquer fala em andamento
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    setIsLoading(true);

    // Verificar se o navegador suporta síntese de voz
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta síntese de voz.');
      setIsLoading(false);
      return;
    }

    // Criar nova instância de SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance(text);
    speechRef.current = utterance;

    // Configurações de voz
    utterance.rate = options.rate || 0.9; // Velocidade um pouco mais lenta para melhor compreensão
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Tentar definir uma voz em português
    const voices = window.speechSynthesis.getVoices();
    const portugueseVoice = voices.find(voice => 
      voice.lang.includes('pt') || voice.lang.includes('PT')
    );
    
    if (portugueseVoice) {
      utterance.voice = portugueseVoice;
    }

    // Event listeners
    utterance.onstart = () => {
      setIsLoading(false);
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      speechRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Erro na síntese de voz:', event.error);
      setIsPlaying(false);
      setIsLoading(false);
      speechRef.current = null;
      alert('Erro ao reproduzir áudio. Tente novamente.');
    };

    // Iniciar a fala
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (speechRef.current) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      speechRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isLoading
  };
}

