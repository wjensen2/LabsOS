'use client';

import Image from 'next/image';

interface SurveyWindowProps {
  onOpenFullResults?: () => void;
}

export function SurveyWindow({ onOpenFullResults }: SurveyWindowProps) {
  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-black mb-2">Summit Agentic Survey</h3>
        <p className="text-sm text-gray-700">
          Scan with your phone to participate in the survey
        </p>
      </div>

      {/* QR Code - Centered and Responsive */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-8 border-2 border-gray-800 shadow-lg" style={{ borderStyle: 'inset' }}>
          <Image
            src="/survey-qr-code.png"
            alt="Summit Agentic Survey QR Code"
            width={300}
            height={300}
            className="w-full h-auto max-w-xs min-w-48"
            style={{
              imageRendering: 'pixelated',
              aspectRatio: '1/1'
            }}
          />
        </div>
      </div>
    </div>
  );
}