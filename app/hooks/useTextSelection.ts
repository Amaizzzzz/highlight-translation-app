import { useState, useCallback, useRef, useEffect } from 'react';
import { TranslationEntry } from '../types/translation';
import { useSettings } from '../contexts/SettingsContext';

interface TranslationPopupState {
  text: string;
  position: { x: number; y: number };
  translation: TranslationEntry;
}

export function useTextSelection(content: string) {
  const { settings } = useSettings();
  const [selectedText, setSelectedText] = useState('');
  const [translationPopup, setTranslationPopup] = useState<TranslationPopupState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTranslation, setIsFetchingTranslation] = useState(false);
  const processingTextRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (processingTextRef.current === text && translationPopup) {
      return;
    }
    if (isFetchingTranslation) {
      return;
    }

    if (!text) {
      processingTextRef.current = null;
      setTranslationPopup(null);
      return;
    }

    if (isLoading) {
      return;
    }

    const range = selection?.getRangeAt(0);
    const rect = range?.getBoundingClientRect();
    if (!rect) return;

    processingTextRef.current = text;
    setIsFetchingTranslation(true);
    setIsLoading(true);

    const viewportX = rect.left + (rect.width / 2);
    const viewportY = rect.top - 10;
    const x = viewportX + window.scrollX;
    const y = viewportY + window.scrollY;

    try {
      const position = content.indexOf(text);
      const translationOptions = {
        hintLevel: Math.min(5, Math.max(1, Math.ceil(settings.hintLevel / 20))),
        translationDetail: Math.min(5, Math.max(1, Math.ceil(settings.translationDetail / 20))),
        sourceLang: settings.sourceLanguage || 'English',
        targetLang: settings.targetLanguage || 'English'
      };

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          context: content.slice(Math.max(0, position - 100), Math.min(content.length, position + text.length + 100)),
          ...translationOptions
        }),
      });

      if (!response.ok) {
        throw new Error('Translation request failed');
      }

      const translationResult = await response.json();
      
      if (!translationResult) {
        throw new Error('No translation result received');
      }
      
      setTranslationPopup({
        text,
        translation: translationResult,
        position: { x, y }
      });
    } catch (error: any) {
      console.error('Translation error:', error);
      let errorMessage = 'Translation failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('API key')) {
          errorMessage = 'API configuration error. Please check your settings.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      }
      
      // Create a properly structured error response
      const errorTranslation: TranslationEntry = {
        word: text,
        context: '',
        translation: {
          basic: {
            translation: errorMessage,
            examples: []
          }
        },
        suggestions: {
          vocabulary: [],
          grammar: [],
          usage: [],
          memory: []
        },
        examples: [],
        difficulty: 3,
        contextAnalysis: {
          precedingWords: [],
          followingWords: [],
          isInQuotes: false,
          sentencePosition: 0,
          nearbyKeywords: []
        }
      };
      
      setTranslationPopup({
        text,
        translation: errorTranslation,
        position: { x, y }
      });
      processingTextRef.current = null;
    } finally {
      setIsLoading(false);
      setIsFetchingTranslation(false);
    }
  }, [content, settings, isLoading, isFetchingTranslation, translationPopup]);

  useEffect(() => {
    const debouncedHandler = () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        handleTextSelection();
      }, 250);
    };

    document.addEventListener('mouseup', debouncedHandler);
    return () => {
      document.removeEventListener('mouseup', debouncedHandler);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [handleTextSelection]);

  const handleClosePopup = useCallback(() => {
    processingTextRef.current = null;
    setTranslationPopup(null);
  }, []);

  return {
    selectedText,
    translationPopup,
    isLoading,
    handleClosePopup
  };
} 