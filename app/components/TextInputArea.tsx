'use client';

import React from 'react';

interface TextInputAreaProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onStartReading: () => void;
  onReset: () => void;
  hasContent: boolean;
}

export default function TextInputArea({
  inputText,
  onInputChange,
  onStartReading,
  onReset,
  hasContent,
}: TextInputAreaProps) {
  return (
    <div className="space-y-4">
      {hasContent ? (
        <div className="flex justify-between items-center mb-4">
          <button
            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
            onClick={onReset}
          >
            New Text
          </button>
        </div>
      ) : (
        <>
          <textarea
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter or paste your text here..."
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
          />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            onClick={onStartReading}
            disabled={!inputText.trim()}
          >
            Start Reading
          </button>
        </>
      )}
    </div>
  );
} 