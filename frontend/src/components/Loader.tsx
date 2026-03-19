'use client';

import React from 'react';
import { Zap } from 'lucide-react';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, message = 'Loading...' }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-8 w-full h-full min-h-[200px]';

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Animated Rings */}
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-100"></div>
        <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 shadow-sm"></div>
        
        {/* Center Icon */}
        <div className="absolute">
          <Zap className="h-5 w-5 text-indigo-600 animate-pulse" />
        </div>
      </div>
      
      {message && (
        <p className="mt-4 text-sm font-bold text-gray-500 animate-pulse tracking-widest uppercase">
          {message}
        </p>
      )}
    </div>
  );
};

export default Loader;
