'use client';

import React, { useState, useEffect } from 'react';
import { useTextSelection } from '../hooks/useTextSelection';
import TranslationPopup from './TranslationPopup';
import { TranslationEntry } from '../types/translation';

interface InteractiveReaderProps {
  title: string;
  content: string;
  articleId: string;
}

const InteractiveReader: React.FC<InteractiveReaderProps> = ({ title, content: initialContent, articleId }) => {
  // Initialize state from localStorage if available
  const [inputText, setInputText] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`inputText-${articleId}`) || '';
    }
    return '';
  });
  
  const [content, setContent] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(`content-${articleId}`) || initialContent;
    }
    return initialContent;
  });
  
  const [isInputMode, setIsInputMode] = useState(false);
  const { selectedText, translationPopup, isLoading, handleClosePopup } = useTextSelection(content);

  // Save to localStorage whenever inputText or content changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`inputText-${articleId}`, inputText);
      localStorage.setItem(`content-${articleId}`, content);
    }
  }, [inputText, content, articleId]);

  const handleStartReading = () => {
    if (inputText.trim()) {
      setContent(inputText.trim());
      setIsInputMode(false);
    }
  };

  const handleReset = () => {
    setContent(initialContent);
    setInputText('');
    setIsInputMode(false);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`inputText-${articleId}`);
      localStorage.removeItem(`content-${articleId}`);
    }
  };

  const handleAddToFlashcards = async (word: string, translation: TranslationEntry) => {
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word,
          translation,
          userId: 'test-user-1' // Replace with actual user ID when auth is implemented
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add flashcard');
      }

      const result = await response.json();
      return result.status as 'added' | 'exists';
    } catch (error) {
      console.error('Error adding flashcard:', error);
      throw error;
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">AIReader+</h2>
      
      {isInputMode ? (
        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste or type your text here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex space-x-4">
            <button
              onClick={handleStartReading}
              disabled={!inputText.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Start Reading
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div 
            className="prose max-w-none p-4 border border-gray-200 rounded-lg"
            style={{ userSelect: 'text' }}
          >
            {content}
          </div>
          <button
            onClick={() => setIsInputMode(true)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Edit Text
          </button>
        </div>
      )}

      {translationPopup && (
        <TranslationPopup
          text={translationPopup.text}
          translation={translationPopup.translation}
          position={translationPopup.position}
          onClose={handleClosePopup}
          onAddToFlashcards={handleAddToFlashcards}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default InteractiveReader; 