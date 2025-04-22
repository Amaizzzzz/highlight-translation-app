'use client';

import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

export default function LearningSettings() {
  const { settings, updateSettings } = useSettings();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial load
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSettingChange = async (setting: 'hintLevel' | 'translationDetail', value: number) => {
    try {
      await updateSettings({ [setting]: value });
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  if (isLoading) {
    return <div data-testid="loading-skeleton" className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-2 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-2 bg-gray-200 rounded"></div>
    </div>;
  }

  return (
    <div className="space-y-6 ">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Translation Settings</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Hint Level</span>
              <span className="font-medium text-blue-600">Level {Math.ceil(settings.hintLevel / 25)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={settings.hintLevel}
                onChange={(e) => handleSettingChange('hintLevel', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                aria-label="Hint Level"
              />
              <div className="absolute w-full flex justify-between px-1 top-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < Math.ceil(settings.hintLevel / 25) ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute w-full flex justify-between px-1 top-6 text-xs text-gray-500">
                <span>Basic</span>
                <span>Detailed</span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-2 text-sm text-gray-600">
              <span>Translation Detail</span>
              <span className="font-medium text-blue-600">Level {Math.ceil(settings.translationDetail / 25)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                step="25"
                value={settings.translationDetail}
                onChange={(e) => handleSettingChange('translationDetail', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                aria-label="Translation Detail"
              />
              <div className="absolute w-full flex justify-between px-1 top-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < Math.ceil(settings.translationDetail / 25) ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="absolute w-full flex justify-between px-1 top-6 text-xs text-gray-500">
                <span>Simple</span>
                <span>Comprehensive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 