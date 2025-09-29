'use client';

import { useState } from 'react';
import { Globe, RefreshCw, ArrowLeft, ArrowRight, Home } from 'lucide-react';

export function MobileNora() {
  const [currentUrl] = useState('https://fountain-nora-ai.replit.app/');
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    // Force iframe reload by changing src
    const iframe = document.querySelector('iframe[data-mobile-browser]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleHome = () => {
    setIsLoading(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Browser Toolbar */}
      <div className="bg-gray-200 border-b border-gray-300">
        <div className="flex items-center gap-2 p-3">
          {/* Navigation Buttons */}
          <button
            className="bg-gray-100 hover:bg-gray-200 border border-gray-400 p-2 rounded"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 border border-gray-400 p-2 rounded"
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 border border-gray-400 p-2 rounded"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 border border-gray-400 p-2 rounded"
            onClick={handleHome}
            title="Home"
          >
            <Home size={16} />
          </button>

          {/* Address Bar */}
          <div className="flex-1 flex items-center">
            <div className="flex-1 bg-white border border-gray-400 rounded px-3 py-2 flex items-center">
              <Globe size={16} className="text-gray-500 mr-2" />
              <span className="text-sm truncate">{currentUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Website Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw size={20} className="animate-spin" />
              <span>Loading Nora AI...</span>
            </div>
          </div>
        )}
        <iframe
          data-mobile-browser
          src={currentUrl}
          className="w-full h-full border-0"
          title="Nora AI"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}