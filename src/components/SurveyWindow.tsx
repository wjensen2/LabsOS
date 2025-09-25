'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SurveyWindowProps {
  onOpenFullResults?: () => void;
}

export function SurveyWindow({ onOpenFullResults }: SurveyWindowProps) {
  // QR code URL for the Google Form - using larger size for better scanning
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent('https://forms.gle/begxtwtxKNJhbmWq8')}`;

  return (
    <div className="h-full flex flex-col bg-gray-100 p-6">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Summit Agentic Survey</h3>
        <p className="text-sm text-gray-700">
          Scan with your phone or visit the link below to participate
        </p>
      </div>

      {/* QR Code - Centered and Responsive */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 border-2 border-gray-800 shadow-lg" style={{ borderStyle: 'inset' }}>
          <img
            src={qrCodeUrl}
            alt="Survey QR Code"
            className="w-full h-auto max-w-xs min-w-48"
            style={{
              imageRendering: 'pixelated',
              aspectRatio: '1/1'
            }}
          />
        </div>
      </div>

      {/* Survey Link - Selectable */}
      <div className="text-center mb-6">
        <div className="text-sm text-gray-700 mb-2">Direct Link:</div>
        <input
          type="text"
          value="https://forms.gle/begxtwtxKNJhbmWq8"
          readOnly
          className="w-full px-3 py-2 text-sm font-mono text-blue-600 bg-white border-2 border-gray-400 text-center cursor-text"
          style={{ borderStyle: 'inset' }}
          onClick={(e) => (e.target as HTMLInputElement).select()}
        />
      </div>

      {/* View Full Results Button */}
      <div className="text-center">
        <button
          onClick={() => {
            window.open('https://docs.google.com/forms/d/18mvxbqknsJ09IFJp6qOyoALNSkP4udISlJVR5ARGDx8/edit#responses', '_blank');
          }}
          className="py-3 px-8 bg-gray-300 border-2 border-gray-800 text-black text-sm font-bold hover:bg-gray-200 active:border-gray-600"
          style={{ borderStyle: 'outset' }}
        >
          View Full Results
        </button>
      </div>
    </div>
  );
}