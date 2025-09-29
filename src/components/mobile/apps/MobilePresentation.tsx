'use client';

import { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, Download, ExternalLink, FileText } from 'lucide-react';

interface MobilePresentationProps {
  pdfUrl?: string;
  title?: string;
}

export function MobilePresentation({
  pdfUrl = '/AI Delivering Outcomes [CHRO Summit 2025].pdf',
  title = 'Fountain Summit Presentation'
}: MobilePresentationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Download PDF
  const downloadPdf = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'AI Delivering Outcomes [CHRO Summit 2025].pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open PDF in new tab
  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <div
      ref={containerRef}
      className={`h-full flex flex-col bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-white">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Download PDF Button */}
          <button
            onClick={downloadPdf}
            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded flex items-center gap-2 transition-colors"
            title="Download PDF"
          >
            <Download size={14} />
            Download
          </button>

          {/* Open in New Tab */}
          <button
            onClick={openInNewTab}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded flex items-center gap-2 transition-colors"
            title="Open PDF in new tab"
          >
            <ExternalLink size={14} />
            Open
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold rounded flex items-center gap-2 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {isFullscreen ? 'Exit' : 'Full'}
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
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
          src={pdfUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={() => setIsLoading(false)}
          className={`${isLoading ? 'invisible' : 'visible'}`}
          style={{
            background: 'white'
          }}
        />
      </div>

      {/* Status Bar */}
      {!isFullscreen && (
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-2 flex items-center justify-between text-xs text-gray-400">
          <span>PDF Presentation</span>
          <div className="flex items-center gap-4">
            <span>Use mouse wheel to zoom</span>
            <span>Tap buttons above for controls</span>
          </div>
        </div>
      )}
    </div>
  );
}