'use client';

import React, { useState, useEffect } from 'react';
import LearningSettings from '../components/LearningSettings';
import Link from 'next/link';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    darkMode: false,
    fontSize: 'medium',
    lineSpacing: 'normal'
  });

  useEffect(() => {
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      // Apply settings immediately
      applySettings(parsedSettings);
    }
  }, []);

  const applySettings = (newSettings: any) => {
    // Apply dark mode
    document.documentElement.classList.toggle('dark', newSettings.darkMode);
    
    // Apply font size
    document.documentElement.classList.remove('text-small', 'text-medium', 'text-large');
    document.documentElement.classList.add(`text-${newSettings.fontSize}`);
    
    // Apply line spacing
    document.documentElement.classList.remove('leading-compact', 'leading-normal', 'leading-relaxed');
    document.documentElement.classList.add(`leading-${newSettings.lineSpacing}`);
  };

  const updateSettings = (newSettings: Partial<typeof settings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('settings', JSON.stringify(updatedSettings));
    applySettings(updatedSettings);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Customize your learning experience and preferences.
            </p>
          </div>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="space-y-6">
          {/* Translation Settings */}
          <div className="mac-card p-6">
            <h2 className="text-lg font-medium text-blue-500 mb-4">Translation Settings</h2>
            <LearningSettings />
          </div>

          {/* Display Settings */}
          <div className="mac-card p-6">
            <h2 className="text-lg font-medium text-blue-500 mb-4">Display Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Dark Mode</span>
                <button
                  onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span className="sr-only">Enable dark mode</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Font Size</span>
                <select
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: e.target.value })}
                  className="rounded border-gray-300 text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Line Spacing</span>
                <select
                  value={settings.lineSpacing}
                  onChange={(e) => updateSettings({ lineSpacing: e.target.value })}
                  className="rounded border-gray-300 text-sm"
                >
                  <option value="compact">Compact</option>
                  <option value="normal">Normal</option>
                  <option value="relaxed">Relaxed</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}