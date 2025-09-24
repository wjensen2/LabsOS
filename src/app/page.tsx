'use client';

import { useState, useEffect } from 'react';
import { Window } from '@/components/Window';
import { Taskbar } from '@/components/Taskbar';
import { ProjectsWindow } from '@/components/ProjectsWindow';
import { TeamWindow } from '@/components/TeamWindow';
import { PlaylistWindow } from '@/components/PlaylistWindow';
import { DesktopIcon } from '@/components/DesktopIcon';
import { BrowserWindow } from '@/components/BrowserWindow';
import { BackgroundBoxes } from '@/components/BackgroundBoxes';
import { DocumentViewer } from '@/components/DocumentViewer';

export default function Home() {
  const [activeWindows, setActiveWindows] = useState({
    projects: false,
    team: false,
    playlist: false,
    nora: false,
    document: false,
    document2: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [useInteractiveBackground, setUseInteractiveBackground] = useState(false); // Default to gradient

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

  const toggleWindow = (windowName: 'projects' | 'team' | 'playlist' | 'nora' | 'document' | 'document2') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: !prev[windowName]
    }));
  };

  const closeWindow = (windowName: 'projects' | 'team' | 'playlist' | 'nora' | 'document' | 'document2') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: false
    }));
  };

  return (
    <div className="desktop">
      {/* Interactive Background */}
      {useInteractiveBackground && (
        <div className="absolute inset-0 z-0">
          <BackgroundBoxes />
        </div>
      )}
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
          <img
            src="/astronaut.png"
            alt="Nora AI"
            className="w-8 h-8"
            style={{ imageRendering: 'pixelated' }}
          />
        }
        label="NORA AI"
        x={windowSize.width - 120}
        y={120}
        onClick={() => toggleWindow('nora')}
      />

      {/* Document Desktop Shortcut */}
      <DesktopIcon
        icon={
          <img
            src="/document.png"
            alt="Fountain Frontline OS"
            className="w-8 h-8"
            style={{ imageRendering: 'pixelated' }}
          />
        }
        label="FOUNTAIN FRONTLINE OS"
        x={windowSize.width - 120}
        y={220}
        onClick={() => toggleWindow('document')}
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

      <Window
        title="Fountain Frontline OS.pdf"
        isVisible={activeWindows.document}
        onClose={() => closeWindow('document')}
        x={100}
        y={100}
        width={700}
        height={500}
      >
        <DocumentViewer
          title="Fountain Frontline OS.pdf"
          documentUrl="/Fountain Frontline OS.pdf"
        />
      </Window>

      <Window
        title="Agentic AI for Frontline Workforces - Fountain.pdf"
        isVisible={activeWindows.document2}
        onClose={() => closeWindow('document2')}
        x={150}
        y={120}
        width={700}
        height={500}
      >
        <DocumentViewer
          title="Agentic AI for Frontline Workforces - Fountain.pdf"
          documentUrl="/Agentic AI for Frontline Workforces - Fountain.pdf"
        />
      </Window>

      {/* Taskbar */}
      <Taskbar
        activeWindows={activeWindows}
        onToggleWindow={toggleWindow}
        useInteractiveBackground={useInteractiveBackground}
        onToggleBackground={() => setUseInteractiveBackground(!useInteractiveBackground)}
      />
    </div>
  );
}