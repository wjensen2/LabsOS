'use client';

import React from 'react';

interface MobileDocumentProps {
  documentType: 'document' | 'document2';
}

export function MobileDocument({ documentType }: MobileDocumentProps) {
  const getDocumentConfig = () => {
    if (documentType === 'document') {
      return {
        title: 'Fountain Frontline OS.pdf',
        documentUrl: '/Fountain Frontline OS.pdf'
      };
    } else {
      return {
        title: 'Agentic AI for Frontline Workforces - Fountain.pdf',
        documentUrl: '/Agentic AI for Frontline Workforces - Fountain.pdf'
      };
    }
  };

  const { title, documentUrl } = getDocumentConfig();

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Document toolbar */}
      <div className="bg-gray-200 border-b border-gray-400 p-3 flex items-center gap-2 text-sm">
        <div className="flex gap-2">
          <button className="bg-gray-300 hover:bg-gray-400 px-3 py-2 border border-gray-500 text-sm rounded">
            Zoom In
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 px-3 py-2 border border-gray-500 text-sm rounded">
            Zoom Out
          </button>
          <button className="bg-gray-300 hover:bg-gray-400 px-3 py-2 border border-gray-500 text-sm rounded">
            Print
          </button>
        </div>
        <div className="ml-auto text-gray-600 text-sm truncate">
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