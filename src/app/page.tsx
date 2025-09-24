'use client';

import { useState, useEffect } from 'react';
import { Window } from '@/components/Window';
import { Taskbar } from '@/components/Taskbar';
import { ProjectsWindow } from '@/components/ProjectsWindow';
import { TeamWindow } from '@/components/TeamWindow';
import { PlaylistWindow } from '@/components/PlaylistWindow';
import { DesktopIcon } from '@/components/DesktopIcon';
import { BrowserWindow } from '@/components/BrowserWindow';
import { Bot } from 'lucide-react';

export default function Home() {
  const [activeWindows, setActiveWindows] = useState({
    projects: false,
    team: false,
    playlist: false,
    nora: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleWindow = (windowName: 'projects' | 'team' | 'playlist' | 'nora') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: !prev[windowName]
    }));
  };

  const closeWindow = (windowName: 'projects' | 'team' | 'playlist' | 'nora') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: false
    }));
  };

  return (
    <div className="desktop">
      {/* Desktop Icon Area */}
      <div className="absolute top-4 left-4 desktop-title">
        <div className="ascii-title mb-3">
{`██████╗ ██╗  ██╗██████╗  ██████╗
██╔════╝ ██║  ██║██╔══██╗██╔═══██╗
██║      ███████║██████╔╝██║   ██║
██║      ██╔══██║██╔══██╗██║   ██║
╚██████╗ ██║  ██║██║  ██║╚██████╔╝
 ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝

███████╗██╗   ██╗███╗   ███╗███╗   ███╗██╗████████╗
██╔════╝██║   ██║████╗ ████║████╗ ████║██║╚══██╔══╝
███████╗██║   ██║██╔████╔██║██╔████╔██║██║   ██║
╚════██║██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║
███████║╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║
╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝   `}
        </div>
        <div className="text-white pixel-font">
          FOUNTAIN LABS
        </div>
        <div className="text-white text-xs mt-1 opacity-75 desktop-version">
          System v2.1
        </div>
        <div className="text-white text-xs mt-1 opacity-75 desktop-date">
          {currentTime.toLocaleDateString()}
        </div>
      </div>

      {/* Desktop Icons */}
      <DesktopIcon
        icon={
          <div className="pixel-bot-icon">
            <div className="pixel-bot-head"></div>
            <div className="pixel-bot-body"></div>
            <div className="pixel-bot-arms"></div>
          </div>
        }
        label="NORA AI"
        x={windowSize.width - 120}
        y={120}
        onClick={() => toggleWindow('nora')}
      />

      {/* Windows */}
      <Window
        title="Projects - Fountain Labs"
        isVisible={activeWindows.projects}
        onClose={() => closeWindow('projects')}
        x={50}
        y={50}
        width={450}
        height={400}
      >
        <ProjectsWindow />
      </Window>

      <Window
        title="Team - Fountain Labs"
        isVisible={activeWindows.team}
        onClose={() => closeWindow('team')}
        x={150}
        y={100}
        width={350}
        height={350}
      >
        <TeamWindow />
      </Window>

      <Window
        title="Playlist - Fountain Labs"
        isVisible={activeWindows.playlist}
        onClose={() => closeWindow('playlist')}
        x={250}
        y={150}
        width={400}
        height={380}
      >
        <PlaylistWindow />
      </Window>

      <Window
        title="Nora AI - Browser"
        isVisible={activeWindows.nora}
        onClose={() => closeWindow('nora')}
        x={200}
        y={80}
        width={800}
        height={600}
      >
        <BrowserWindow
          url="https://fountain-nora-ai.replit.app/"
          title="Nora AI"
        />
      </Window>

      {/* Taskbar */}
      <Taskbar 
        activeWindows={activeWindows}
        onToggleWindow={toggleWindow}
      />
    </div>
  );
}