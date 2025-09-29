'use client';

import Image from 'next/image';
import { MobileAppType } from './MobileDesktop';

interface MobileDockProps {
  onAppLaunch: (appName: MobileAppType) => void;
}

export function MobileDock({ onAppLaunch }: MobileDockProps) {
  const dockApps = [
    { id: 'projects' as MobileAppType, icon: '/projects.png' },
    { id: 'nora' as MobileAppType, icon: '/astronaut.png' },
    { id: 'playlist' as MobileAppType, icon: '/musical-score.png' },
    { id: 'team' as MobileAppType, icon: '/team.png' },
  ];

  return (
    <div className="bg-white/20 backdrop-blur-md border-t border-white/30">
      <div className="flex justify-around items-center py-2 px-4">
        {dockApps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppLaunch(app.id)}
            className="p-3 rounded-xl active:scale-95 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className="w-12 h-12 bg-white/90 rounded-xl flex items-center justify-center shadow-md">
              <Image
                src={app.icon}
                alt={app.id || 'app'}
                width={24}
                height={24}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}