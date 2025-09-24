'use client';

import { useState } from 'react';
import { Globe, RefreshCw, ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface BrowserWindowProps {
  url: string;
  title?: string;
}

export function BrowserWindow({ url, title }: BrowserWindowProps) {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(true);

  const handleRefresh = () => {
    setIsLoading(true);
    // Force iframe reload by changing src
    const iframe = document.querySelector('iframe[data-browser]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleHome = () => {
    setCurrentUrl(url);
    setIsLoading(true);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Browser Toolbar */}
      <div className="browser-toolbar">
        <div className="flex items-center gap-2 p-2 border-b border-gray-300">
          {/* Navigation Buttons */}
          <button className="browser-nav-button" title="Back">
            <ArrowLeft size={14} />
          </button>
          <button className="browser-nav-button" title="Forward">
            <ArrowRight size={14} />
          </button>
          <button className="browser-nav-button" onClick={handleRefresh} title="Refresh">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button className="browser-nav-button" onClick={handleHome} title="Home">
            <Home size={14} />
          </button>

          {/* Address Bar */}
          <div className="flex-1 flex items-center">
            <div className="browser-address-bar">
              <Globe size={14} className="text-gray-500 mr-2" />
              <span className="text-sm">{currentUrl}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Website Content */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
            <div className="flex items-center gap-2 text-gray-600">
              <RefreshCw size={16} className="animate-spin" />
              <span>Loading {title || 'website'}...</span>
            </div>
          </div>
        )}
        <iframe
          data-browser
          src={currentUrl}
          className="w-full h-full border-0"
          title={title || 'Browser Window'}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
    </div>
  );
}