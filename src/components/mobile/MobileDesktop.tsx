'use client';

import { useState, useEffect } from 'react';
import { MobileAppLauncher } from './MobileAppLauncher';
import { MobileAppView } from './MobileAppView';
import { MobileDock } from './MobileDock';
import { PasswordModal } from '../PasswordModal';

export type MobileAppType =
  | 'projects'
  | 'team'
  | 'playlist'
  | 'nora'
  | 'document'
  | 'document2'
  | 'survey'
  | 'promptBuilder'
  | 'presentation'
  | 'runnerGame'
  | null;

export function MobileDesktop() {
  const [currentApp, setCurrentApp] = useState<MobileAppType>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppLaunch = (appName: MobileAppType) => {
    setCurrentApp(appName);
  };

  const handleAppClose = () => {
    setCurrentApp(null);
  };

  return (
    <>
      <PasswordModal
        isVisible={!isAuthenticated}
        onPasswordCorrect={() => setIsAuthenticated(true)}
      />

      <div className="mobile-desktop h-screen w-screen overflow-hidden bg-gradient-to-br from-purple-500 via-purple-400 to-blue-400 flex flex-col">
        {/* Status Bar */}
        <div className="mobile-status-bar bg-black/20 backdrop-blur-sm text-white px-4 py-1 flex justify-between items-center text-xs">
          <span className="font-semibold">FOUNTAIN LABS</span>
          <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {currentApp ? (
            <MobileAppView
              appName={currentApp}
              onClose={handleAppClose}
            />
          ) : (
            <MobileAppLauncher onAppLaunch={handleAppLaunch} />
          )}
        </div>

        {/* Bottom Dock - Only show when no app is open */}
        {!currentApp && (
          <MobileDock onAppLaunch={handleAppLaunch} />
        )}
      </div>

      <style jsx global>{`
        /* Mobile-specific styles */
        .mobile-desktop {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Prevent pull-to-refresh on mobile */
        .mobile-desktop {
          overscroll-behavior: contain;
        }

        /* Ensure full viewport height on mobile */
        @supports (-webkit-touch-callout: none) {
          .mobile-desktop {
            height: 100vh;
            height: -webkit-fill-available;
          }
        }
      `}</style>
    </>
  );
}