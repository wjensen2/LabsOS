'use client';

import Image from 'next/image';
import { MobileAppType } from './MobileDesktop';

interface AppConfig {
  id: MobileAppType;
  name: string;
  icon: string;
  color: string;
}

const apps: AppConfig[] = [
  { id: 'projects', name: 'Projects', icon: '/projects.png', color: 'bg-blue-500' },
  { id: 'team', name: 'Team', icon: '/team.png', color: 'bg-green-500' },
  { id: 'playlist', name: 'Music', icon: '/musical-score.png', color: 'bg-pink-500' },
  { id: 'nora', name: 'Nora AI', icon: '/astronaut.png', color: 'bg-purple-500' },
  { id: 'survey', name: 'Survey', icon: '/bar-chart.png', color: 'bg-yellow-500' },
  { id: 'promptBuilder', name: 'Prompt', icon: '/construction.png', color: 'bg-orange-500' },
  { id: 'presentation', name: 'Summit', icon: '/slides.png', color: 'bg-indigo-500' },
  { id: 'runnerGame', name: 'Runner', icon: '/man.png', color: 'bg-red-500' },
  { id: 'document', name: 'Docs', icon: '/document.png', color: 'bg-gray-500' },
];

interface MobileAppLauncherProps {
  onAppLaunch: (appName: MobileAppType) => void;
}

export function MobileAppLauncher({ onAppLaunch }: MobileAppLauncherProps) {
  const handleAppClick = (appId: MobileAppType) => {
    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onAppLaunch(appId);
  };

  return (
    <div className="h-full flex flex-col px-4 pt-8 pb-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          CHAO SUMMIT
        </h1>
        <p className="text-white/80 text-sm">FOUNTAIN LABS OS</p>
      </div>

      {/* App Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 active:scale-95 hover:bg-white/10"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <div
                className={`w-16 h-16 ${app.color} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <Image
                  src={app.icon}
                  alt={app.name}
                  width={32}
                  height={32}
                  className="filter brightness-0 invert"
                />
              </div>
              <span className="text-white text-xs font-medium drop-shadow">
                {app.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4">
        <p className="text-white/60 text-xs">
          {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>
    </div>
  );
}