'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TranslationEntry } from '../types/translation';

interface Position {
  x: number;
  y: number;
}

interface TranslationPopupProps {
  text: string;
  translation: TranslationEntry;
  position: Position;
  onClose: () => void;
  onAddToFlashcards?: (word: string, translation: TranslationEntry) => Promise<'added' | 'exists'>;
  isLoading: boolean;
}

const TranslationPopup: React.FC<TranslationPopupProps> = ({
  text,
  position,
  onClose,
  translation,
  onAddToFlashcards,
  isLoading,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addStatus, setAddStatus] = useState<'idle' | 'adding' | 'added' | 'exists' | 'error'>('idle');

  useEffect(() => {
    const popup = popupRef.current;
    if (!popup) return;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Get popup dimensions
    const rect = popup.getBoundingClientRect();
    const popupWidth = rect.width;
    const popupHeight = rect.height;

    let { x, y } = position;

    // Add scroll offset to position
    x += scrollX;
    y += scrollY;

    // Calculate boundaries
    const minX = 20; // Minimum distance from left edge
    const maxX = viewportWidth - popupWidth - 20; // Maximum x position (20px from right edge)
    const minY = 20; // Minimum distance from top edge
    const maxY = viewportHeight - popupHeight - 20; // Maximum y position (20px from bottom edge)

    // Adjust horizontal position
    x = Math.max(minX, Math.min(x, maxX));

    // Adjust vertical position
    // If popup would go below viewport, position it above the selection
    if (y + popupHeight > viewportHeight + scrollY) {
      y = y - popupHeight - 40; // 40px above selection
    }
    y = Math.max(minY + scrollY, Math.min(y, maxY + scrollY));

    // Apply position
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    popup.style.maxHeight = `${viewportHeight - 40}px`; // Maximum height with 20px padding top and bottom
    popup.style.maxWidth = `${viewportWidth - 40}px`; // Maximum width with 20px padding left and right

    // Handle click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (popup && !popup.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [position, onClose]);

  const handleAddToFlashcards = async () => {
    if (!onAddToFlashcards) return;
    
    // Check if already in process of adding
    if (addStatus === 'adding' || addStatus === 'added') return;

    // If already marked as existing, show feedback
    if (addStatus === 'exists') {
      // Flash the button to provide feedback
      setAddStatus('idle');
      setTimeout(() => setAddStatus('exists'), 100);
      return;
    }

    setAddStatus('adding');
    try {
      const status = await onAddToFlashcards(text, translation);
      setAddStatus(status);
      
      // Only close popup if successfully added
      if (status === 'added') {
        setTimeout(() => {
          onClose();
        }, 1500);
      } else if (status === 'exists') {
        // Provide visual feedback but don't close
        setTimeout(() => {
          setAddStatus('exists');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding to flashcards:', error);
      setAddStatus('error');
      // Reset error state after 2 seconds
      setTimeout(() => {
        setAddStatus('idle');
      }, 2000);
    }
  };

  const getAddButtonText = () => {
    switch (addStatus) {
      case 'adding':
        return 'Adding...';
      case 'added':
        return '✓ Added!';
      case 'exists':
        return 'Already in flashcards';
      case 'error':
        return 'Error adding';
      default:
        return 'Add to Flashcards';
    }
  };

  const getAddButtonClass = () => {
    const baseClass = "mt-2 px-4 py-2 rounded transition-colors duration-200";
    switch (addStatus) {
      case 'added':
        return `${baseClass} bg-green-500 text-white cursor-default`;
      case 'exists':
        return `${baseClass} bg-gray-400 text-white cursor-default hover:bg-gray-500`;
      case 'error':
        return `${baseClass} bg-red-500 text-white hover:bg-red-600`;
      case 'adding':
        return `${baseClass} bg-blue-400 text-white cursor-wait`;
      default:
        return `${baseClass} bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`;
    }
  };

  const renderBasicTranslation = () => {
    const basicTranslation = translation?.translation?.basic;
    if (!basicTranslation) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Translation</h4>
        <p className="text-gray-800">{basicTranslation.translation || 'No translation available'}</p>
        {basicTranslation.examples?.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Examples</h5>
            <ul className="list-disc list-inside text-gray-700">
              {basicTranslation.examples.map((example, index) => (
                <li key={index} className="text-sm">{example}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderDetailedTranslation = () => {
    const detailedTranslation = translation?.translation?.detailed;
    if (!detailedTranslation) return null;

    const notes = detailedTranslation.notes || [];
    const examples = detailedTranslation.examples || [];

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Detailed Translation</h4>
        <p className="text-gray-800">{detailedTranslation.translation}</p>
        {examples.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Examples</h5>
            <ul className="list-disc list-inside text-gray-700">
              {examples.map((example, index) => (
                <li key={index} className="text-sm">{example}</li>
              ))}
            </ul>
          </div>
        )}
        {notes.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Notes</h5>
            <ul className="list-disc list-inside text-gray-700">
              {notes.map((note, index) => (
                <li key={index} className="text-sm">{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderTechnicalTranslation = () => {
    const technicalTranslation = translation?.translation?.technical;
    if (!technicalTranslation) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Technical Translation</h4>
        <p className="text-gray-800">{technicalTranslation.translation}</p>
        {technicalTranslation.domain && (
          <p className="text-sm text-gray-600">Domain: {technicalTranslation.domain}</p>
        )}
        {technicalTranslation.examples?.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Examples</h5>
            <ul className="list-disc list-inside text-gray-700">
              {technicalTranslation.examples.map((example, index) => (
                <li key={index} className="text-sm">{example}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderSuggestions = () => {
    const suggestions = translation?.suggestions;
    if (!suggestions) return null;

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-500 mb-1">Suggestions</h4>
        {suggestions.vocabulary?.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Vocabulary</h5>
            <ul className="list-disc list-inside text-gray-700">
              {suggestions.vocabulary.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        {suggestions.grammar?.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Grammar</h5>
            <ul className="list-disc list-inside text-gray-700">
              {suggestions.grammar.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        {suggestions.usage?.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Usage</h5>
            <ul className="list-disc list-inside text-gray-700">
              {suggestions.usage.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        {suggestions.memory?.length > 0 && (
          <div className="mt-2">
            <h5 className="text-sm font-medium text-gray-500 mb-1">Memory Tips</h5>
            <ul className="list-disc list-inside text-gray-700">
              {suggestions.memory.map((suggestion, index) => (
                <li key={index} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg p-4 max-w-md overflow-auto"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{text}</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {renderBasicTranslation()}
          {renderDetailedTranslation()}
          {renderTechnicalTranslation()}
          {renderSuggestions()}
          {onAddToFlashcards && (
            <button
              onClick={handleAddToFlashcards}
              disabled={addStatus === 'adding' || addStatus === 'added' || addStatus === 'exists'}
              className={getAddButtonClass()}
            >
              {getAddButtonText()}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default TranslationPopup; 