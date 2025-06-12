'use client';

import { useState, useEffect } from 'react';
import { Window } from '@/components/Window';
import { Taskbar } from '@/components/Taskbar';
import { ProjectsWindow } from '@/components/ProjectsWindow';
import { TeamWindow } from '@/components/TeamWindow';
import { PlaylistWindow } from '@/components/PlaylistWindow';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function Home() {
  const [activeWindows, setActiveWindows] = useState({
    projects: false,
    team: false,
    playlist: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleWindow = (windowName: 'projects' | 'team' | 'playlist') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: !prev[windowName]
    }));
  };

  const closeWindow = (windowName: 'projects' | 'team' | 'playlist') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: false
    }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Animated Desktop Background */}
      <AnimatedBackground />
      
      {/* Desktop Icon Area */}
      <div className="absolute top-4 left-4">
        <div className="text-white pixel-font">
          FOUNTAIN LABS
        </div>
        <div className="text-white text-xs mt-1 opacity-75">
          {currentTime.toLocaleDateString()}
        </div>
      </div>

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

      {/* Taskbar */}
      <Taskbar 
        activeWindows={activeWindows}
        onToggleWindow={toggleWindow}
      />
    </div>
  );
}