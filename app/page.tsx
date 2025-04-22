'use client';

import React, { useState, useEffect } from 'react';
import { useSettings } from './contexts/SettingsContext';
import InteractiveReader from './components/InteractiveReader';
import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';
import { FlashcardData } from './types/flashcard';
import Link from 'next/link';

export default function Home() {
  const { settings } = useSettings();
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await fetch('/api/flashcards?userId=test-user-1'); 
        if (!response.ok) throw new Error('Failed to fetch flashcards');
        const allFlashcards: FlashcardData[] = await response.json();
        const sortedFlashcards = allFlashcards.sort((a, b) => 
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        setFlashcards(sortedFlashcards.slice(0, 3)); 
      } catch (error) {
        console.error('Error fetching flashcards:', error);
        setFlashcards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleAddToFlashcards = async () => {
    if (!selectedText) return;

    try {
      const response = await fetch(`/api/flashcards/check?word=${encodeURIComponent(selectedText)}&userId=test-user-1`);
      const { exists } = await response.json();

      if (exists) {
        alert('This word is already in your review list!');
        return;
      }

      const addResponse = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: selectedText,
          userId: 'test-user-1',
        }),
      });

      if (!addResponse.ok) throw new Error('Failed to add to flashcards');
      const newFlashcard = await addResponse.json();
      setFlashcards(prev => [...prev, newFlashcard]);
      setSelectedText('');
      setShowTranslation(false);
      alert('Added to review list!');
    } catch (error) {
      console.error('Error adding to flashcards:', error);
      alert('Failed to add to review list. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-[1200px] mx-auto flex min-h-[calc(100vh-120px)]">
        <div className="flex-1 min-w-0 bg-white border-r border-gray-200 p-6">
          <InteractiveReader
            title="Learning Content"
            content="This is a sample text for testing the translation and flashcard features. Select any word or phrase to see its translation and add it to your flashcards. The quick brown fox jumps over the lazy dog."
            articleId="default"
          />
        </div>
        <div className="w-[400px] bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Learning Tools</h3>
              <Link 
                href="/settings" 
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>⚙️</span>
                <span>Settings</span>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mac-card h-full">
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium">AI Language Assistant</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ask me anything about language learning or get help with translations.
                    </p>
                  </div>
                  <div className="flex-1 p-4">
                    <AIAssistant />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 