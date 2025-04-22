'use client';

import React from 'react';

interface ReadingContentProps {
  content: string;
  className?: string;
}

export default function ReadingContent({ content, className = '' }: ReadingContentProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert ${className}`}>
      <p className="select-text">{content}</p>
    </div>
  );
} 