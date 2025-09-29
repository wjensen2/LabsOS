'use client';

import { useState } from 'react';
import { Play, Fullscreen, Download, Share } from 'lucide-react';

export function MobilePresentation() {
  const [isLoading, setIsLoading] = useState(true);

  const handleFullscreen = () => {
    const iframe = document.getElementById('presentation-iframe') as HTMLIFrameElement;
    if (iframe?.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h2 className="font-semibold text-gray-900 mb-2">Fountain Summit 2024</h2>
        <p className="text-sm text-gray-600">AI Innovation & Future of Work</p>
      </div>

      {/* Presentation Viewer */}
      <div className="flex-1 bg-white m-4 rounded-lg shadow-sm overflow-hidden">
        <div className="relative h-full">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading presentation...</p>
              </div>
            </div>
          )}
          <iframe
            id="presentation-iframe"
            src="https://docs.google.com/presentation/d/1AWLlADfpqX0AUyehiMFI7TfcWJp60GnmnMxZySfh3mE/embed?start=false&loop=false&delayms=3000"
            className="w-full h-full border-0"
            onLoad={() => setIsLoading(false)}
            allow="fullscreen"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleFullscreen}
            className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white rounded-lg font-medium"
          >
            <Fullscreen size={16} />
            Fullscreen
          </button>
          <button className="flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium">
            <Share size={16} />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}