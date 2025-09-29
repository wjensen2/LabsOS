'use client';

import Image from 'next/image';

interface MobileSurveyProps {
  onOpenFullResults?: () => void;
}

export function MobileSurvey({}: MobileSurveyProps) {
  return (
    <div className="h-full flex flex-col bg-gray-100 p-4">
      {/* Title */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-black mb-2">Summit Agentic Survey</h3>
        <p className="text-sm text-gray-700">
          Scan with your phone to participate in the survey
        </p>
      </div>

      {/* QR Code - Centered and Responsive */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white p-6 border-2 border-gray-800 shadow-lg" style={{ borderStyle: 'inset' }}>
          <Image
            src="/survey-qr-code.png"
            alt="Summit Agentic Survey QR Code"
            width={250}
            height={250}
            className="w-full h-auto max-w-xs min-w-40"
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