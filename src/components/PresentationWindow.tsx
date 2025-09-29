'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Play, ExternalLink, FileText } from 'lucide-react';

interface PresentationWindowProps {
  presentationUrl?: string;
  title?: string;
}

export function PresentationWindow({
  presentationUrl = 'https://docs.google.com/presentation/d/1AWLlADfpqX0AUyehiMFI7TfcWJp60GnmnMxZySfh3mE/embed?start=false&loop=false&delayms=3000',
  title = 'Fountain Summit Presentation'
}: PresentationWindowProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [currentSlide, setCurrentSlide] = useState(1); // Future slide navigation
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert edit URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('/edit')) {
      // Convert edit URL to embed URL
      const presentationId = url.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (presentationId) {
        return `https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=3000`;
      }
    }
    return url;
  };

  const embedUrl = getEmbedUrl(presentationUrl);

  // Handle fullscreen
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Start presentation (opens in presenter mode)
  const startPresentation = () => {
    const presentationId = presentationUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (presentationId) {
      // Open in presenter mode
      window.open(
        `https://docs.google.com/presentation/d/${presentationId}/present`,
        '_blank',
        'width=1200,height=800'
      );
    }
  };

  // Open in new tab for editing
  const openInNewTab = () => {
    const presentationId = presentationUrl.match(/\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    if (presentationId) {
      window.open(
        `https://docs.google.com/presentation/d/${presentationId}/edit`,
        '_blank'
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`h-full flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Start Presentation Button */}
          <button
            onClick={startPresentation}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
            title="Start Presentation (Opens in presenter mode)"
          >
            <Play size={14} />
            Present
          </button>

          {/* Open in New Tab */}
          <button
            onClick={openInNewTab}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
            title="Open in Google Slides"
          >
            <ExternalLink size={14} />
            Edit
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

      {/* Presentation Embed */}
      <div className="flex-1 relative bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4 mx-auto"></div>
              <p className="text-gray-400 text-sm">Loading presentation...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          className={`${isLoading ? 'invisible' : 'visible'}`}
          style={{
            background: 'white'
          }}
        />
      </div>

      {/* Status Bar */}
      {!isFullscreen && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-1 flex items-center justify-between text-xs text-gray-400">
          <span>Google Slides Presentation</span>
          <div className="flex items-center gap-4">
            <span>Use arrow keys to navigate</span>
            <span>Press F to toggle fullscreen</span>
          </div>
        </div>
      )}
    </div>
  );
}