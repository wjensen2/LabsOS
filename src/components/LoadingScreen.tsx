'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onLoadingComplete(), 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Logo placeholder - will be replaced with Fountain logo */}
        <div className="loading-logo">
          <svg width="120" height="120" viewBox="0 0 120 120" className="pixelated">
            {/* 16-bit style Fountain logo placeholder */}
            <rect x="40" y="20" width="40" height="60" fill="#4A90E2" />
            <rect x="35" y="75" width="50" height="10" fill="#4A90E2" />
            <rect x="30" y="85" width="60" height="15" fill="#2E5C8A" />
            {/* Water drops */}
            <rect x="50" y="30" width="4" height="8" fill="#87CEEB" />
            <rect x="62" y="35" width="4" height="8" fill="#87CEEB" />
            <rect x="56" y="42" width="4" height="8" fill="#87CEEB" />
          </svg>
        </div>

        {/* Labs OS Text */}
        <div className="loading-title">
          Labs OS
        </div>

        {/* Starting Up text */}
        <div className="loading-subtitle">
          Starting Up...
        </div>

        {/* Progress Bar */}
        <div className="loading-progress-container">
          <div
            className="loading-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
