'use client';

import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { settings } = useSettings();

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Quick Stats Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-4">Learning Progress</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Flashcards</span>
            <span className="text-sm font-medium text-blue-600">0/0</span>
          </div>
        </div>
      </div>

      {/* Flashcards Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-4">My Review List</h2>
        <div className="space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
            Your flashcards will appear here. Select text in the reading area to add new words.
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="mac-card p-6">
        <h2 className="text-lg font-medium text-blue-500 mb-4">Quick Actions</h2>
        <div className="flex flex-col space-y-3">
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50">
            <span>⚡️</span>
            <span>Start Practice Session</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50">
            <span>📊</span>
            <span>View Statistics</span>
          </button>
          <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50">
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 