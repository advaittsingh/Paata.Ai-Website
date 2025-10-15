"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@material-tailwind/react';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { detectLanguage, getLanguageCode } from '@/utils/languageDetector';

interface SpeechSynthesisProps {
  text: string;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// OpenAI TTS language mapping
const openAILanguageMapping: { [key: string]: string } = {
  'hi': 'hi', // Hindi
  'kn': 'kn', // Kannada
  'ta': 'ta', // Tamil
  'te': 'te', // Telugu
  'bn': 'bn', // Bengali
  'mr': 'mr', // Marathi
  'gu': 'gu', // Gujarati
  'pa': 'pa', // Punjabi
  'ml': 'ml', // Malayalam
  'or': 'or', // Odia
  'as': 'as', // Assamese
  'en': 'en'  // English
};

// Cache for audio URLs to avoid re-generating same content
const audioCache = new Map<string, string>();
const MAX_CACHE_SIZE = 50;

// Helper function to create cache key
function createCacheKey(text: string, languageCode: string): string {
  return `${text.substring(0, 100)}_${languageCode}`;
}

// Helper function to manage cache size
function manageCacheSize() {
  if (audioCache.size > MAX_CACHE_SIZE) {
    const keys = Array.from(audioCache.keys());
    const keysToDelete = keys.slice(0, audioCache.size - MAX_CACHE_SIZE);
    keysToDelete.forEach(key => {
      const url = audioCache.get(key);
      if (url) {
        URL.revokeObjectURL(url);
      }
      audioCache.delete(key);
    });
  }
}

export default function SpeechSynthesis({ 
  text, 
  disabled = false, 
  className = '',
  size = 'md'
}: SpeechSynthesisProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Check if audio is supported
    setIsSupported(true);
  }, []);

  useEffect(() => {
    // Clean up when component unmounts or text changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
        setIsPaused(false);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [text]);

  const speakWithOpenAI = useCallback(async (text: string, languageCode: string) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      
      // Create abort controller for request cancellation
      abortControllerRef.current = new AbortController();
      
      // Check cache first
      const cacheKey = createCacheKey(text, languageCode);
      if (audioCache.has(cacheKey)) {
        console.log('TTS audio cache hit!');
        const cachedUrl = audioCache.get(cacheKey)!;
        playCachedAudio(cachedUrl);
        return;
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: openAILanguageMapping[languageCode] || 'en',
          voice: 'alloy' // You can use 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'
        }),
        signal: abortControllerRef.current.signal,
      });

      clearInterval(progressInterval);
      setLoadingProgress(100);

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the audio URL
      audioCache.set(cacheKey, audioUrl);
      manageCacheSize();
      
      playCachedAudio(audioUrl);
      
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('TTS request aborted');
        return;
      }
      console.error('OpenAI TTS error:', error);
      setIsLoading(false);
      setLoadingProgress(0);
      // Fallback to browser TTS
      fallbackToBrowserTTS(text, languageCode);
    }
  }, []);

  const playCachedAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentAudio(audio);

    audio.onplay = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);
      setLoadingProgress(0);
      console.log('TTS audio started');
    };

    audio.onended = () => {
      setIsPlaying(false);
      setIsPaused(false);
      audioRef.current = null;
      setCurrentAudio(null);
    };

    audio.onerror = () => {
      console.error('Audio playback error');
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
      setLoadingProgress(0);
      audioRef.current = null;
      setCurrentAudio(null);
    };

    audio.onpause = () => {
      setIsPaused(true);
    };

    audio.play().catch(error => {
      console.error('Audio play error:', error);
      setIsLoading(false);
      setLoadingProgress(0);
    });
  };

  const fallbackToBrowserTTS = useCallback((text: string, languageCode: string) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Try to find a voice for the language
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang === languageCode || 
      voice.lang.startsWith(languageCode + '-') ||
      voice.lang.startsWith(languageCode.split('-')[0] + '-')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      console.log(`Browser TTS started in ${languageCode}`);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      console.error('Browser TTS failed');
      setIsPlaying(false);
      setIsPaused(false);
    };

    speechSynthesis.speak(utterance);
  }, []);

  const speak = useCallback(async () => {
    if (disabled || !text.trim()) return;

    // Stop any current speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    speechSynthesis.cancel();

    // Detect the language of the text
    const languageInfo = detectLanguage(text);
    const languageCode = getLanguageCode(languageInfo.language);
    
    console.log(`Detected language: ${languageInfo.language} (${languageCode})`);
    console.log(`Text: ${text.substring(0, 100)}...`);

    // Try OpenAI TTS first for better quality
    await speakWithOpenAI(text, languageCode);
  }, [text, disabled, speakWithOpenAI]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setIsLoading(false);
    setLoadingProgress(0);
    
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      if (isPaused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    } else if (isPlaying) {
      speechSynthesis.pause();
    } else if (isPaused) {
      speechSynthesis.resume();
    }
  }, [isPaused, isPlaying]);

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'p-1.5';
      case 'lg':
        return 'p-3';
      default:
        return 'p-2';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-5 w-5';
    }
  };

  if (!isSupported) {
    return null; // Don't render if not supported
  }

  return (
    <div className={`inline-flex items-center ${className}`}>
      {isLoading ? (
        <Button
          variant="text"
          size="sm"
          className={`${getButtonSize()} text-gray-400 cursor-not-allowed`}
          disabled
          title={`Generating speech... ${loadingProgress}%`}
        >
          <div className={`${getIconSize()} animate-spin`}>
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </Button>
      ) : !isPlaying ? (
        <Button
          variant="text"
          size="sm"
          className={`${getButtonSize()} text-gray-600 hover:text-blue-600 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={speak}
          disabled={disabled || !text.trim()}
          title="Listen to response"
        >
          <SpeakerWaveIcon className={getIconSize()} />
        </Button>
      ) : (
        <div className="flex items-center gap-1">
          <Button
            variant="text"
            size="sm"
            className={`${getButtonSize()} text-gray-600 hover:text-blue-600 transition-colors`}
            onClick={pause}
            title={isPaused ? "Resume" : "Pause"}
          >
            {isPaused ? (
              <SpeakerWaveIcon className={getIconSize()} />
            ) : (
              <SpeakerXMarkIcon className={getIconSize()} />
            )}
          </Button>
          <Button
            variant="text"
            size="sm"
            className={`${getButtonSize()} text-gray-600 hover:text-red-600 transition-colors`}
            onClick={stop}
            title="Stop"
          >
            <SpeakerXMarkIcon className={getIconSize()} />
          </Button>
        </div>
      )}
    </div>
  );
}