'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { MobileAppType } from './MobileDesktop';

// Import mobile-specific app components
import { MobileProjects } from './apps/MobileProjects';
import { MobileTeam } from './apps/MobileTeam';
import { MobileMusic } from './apps/MobileMusic';
import { MobileNora } from './apps/MobileNora';
import { MobileSurvey } from './apps/MobileSurvey';
import { MobilePromptBuilder } from './apps/MobilePromptBuilder';
import { MobilePresentation } from './apps/MobilePresentation';
import { MobileRunner } from './apps/MobileRunner';
import { MobileDocument } from './apps/MobileDocument';

interface MobileAppViewProps {
  appName: MobileAppType;
  onClose: () => void;
}

export function MobileAppView({ appName, onClose }: MobileAppViewProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Handle swipe down to close
  useEffect(() => {
    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // If swiping down from top of screen
      if (startY < 100 && deltaY > 50) {
        setIsClosing(true);
        setTimeout(onClose, 200);
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onClose]);

  const getAppTitle = () => {
    switch (appName) {
      case 'projects': return 'Projects';
      case 'team': return 'Team';
      case 'playlist': return 'Music Player';
      case 'nora': return 'Nora AI';
      case 'survey': return 'Summit Survey';
      case 'promptBuilder': return 'Prompt Builder';
      case 'presentation': return 'Fountain Summit';
      case 'runnerGame': return 'Fountain Runner';
      case 'document': return 'Documents';
      case 'document2': return 'Documents';
      default: return 'App';
    }
  };

  const renderApp = () => {
    switch (appName) {
      case 'projects':
        return <MobileProjects />;
      case 'team':
        return <MobileTeam />;
      case 'playlist':
        return <MobileMusic />;
      case 'nora':
        return <MobileNora />;
      case 'survey':
        return <MobileSurvey />;
      case 'promptBuilder':
        return <MobilePromptBuilder />;
      case 'presentation':
        return <MobilePresentation />;
      case 'runnerGame':
        return <MobileRunner />;
      case 'document':
      case 'document2':
        return <MobileDocument documentType={appName} />;
      default:
        return <div className="p-4 text-center">App not found</div>;
    }
  };

  return (
    <div
      className={`h-full w-full bg-gray-50 flex flex-col transition-transform duration-200 ${
        isClosing ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* App Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => {
              setIsClosing(true);
              setTimeout(onClose, 200);
            }}
            className="p-2 -ml-2 rounded-lg active:bg-white/20"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-semibold text-lg flex-1 text-center mr-8">
            {getAppTitle()}
          </h1>
        </div>
      </div>

      {/* App Content */}
      <div className="flex-1 overflow-y-auto">
        {renderApp()}
      </div>
    </div>
  );
}