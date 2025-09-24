'use client';

import React from 'react';

interface DocumentViewerProps {
  title: string;
  documentUrl: string;
}

export function DocumentViewer({ title, documentUrl }: DocumentViewerProps) {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Document toolbar */}
      <div className="bg-gray-200 border-b border-gray-400 p-2 flex items-center gap-2 text-xs">
        <div className="flex gap-1">
          <button className="bg-gray-300 hover:bg-gray-400 px-2 py-1 border border-gray-500 text-xs">
            Zoom In
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 px-2 py-1 border border-gray-500 text-xs">
            Zoom Out
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 px-2 py-1 border border-gray-500 text-xs">
            Print
          </button>
        </div>
        <div className="ml-auto text-gray-600 text-xs">
          {title}
        </div>
      </div>

      {/* Document iframe */}
      <div className="flex-1 bg-gray-100 p-4">
        <iframe
          src={documentUrl}
          className="w-full h-full border border-gray-400 bg-white shadow-sm"
          title={title}
        />
      </div>
    </div>
  );
}