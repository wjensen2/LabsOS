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
import { PasswordModal } from '@/components/PasswordModal';
import { SurveyWindow } from '@/components/SurveyWindow';
import { PromptBuilderWindow } from '@/components/PromptBuilderWindow';

export default function Home() {
  const [activeWindows, setActiveWindows] = useState({
    projects: false,
    team: false,
    playlist: false,
    nora: false,
    document: false,
    document2: false,
    survey: false,
    surveyResults: false,
    promptBuilder: false,
  });

  const [currentTime, setCurrentTime] = useState(new Date());
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [useInteractiveBackground, setUseInteractiveBackground] = useState(false); // Default to gradient
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  const toggleWindow = (windowName: 'projects' | 'team' | 'playlist' | 'nora' | 'document' | 'document2' | 'survey' | 'surveyResults' | 'promptBuilder') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: !prev[windowName]
    }));
  };

  const closeWindow = (windowName: 'projects' | 'team' | 'playlist' | 'nora' | 'document' | 'document2' | 'survey' | 'surveyResults' | 'promptBuilder') => {
    setActiveWindows(prev => ({
      ...prev,
      [windowName]: false
    }));
  };

  return (
    <>
      <PasswordModal
        isVisible={!isAuthenticated}
        onPasswordCorrect={() => setIsAuthenticated(true)}
      />

      <div className="desktop">
      {/* Interactive Background */}
      {useInteractiveBackground && (
        <div className="absolute inset-0 z-0">
          <BackgroundBoxes />
        </div>
      )}
      {/* Desktop Icon Area */}
      <div className="absolute top-4 left-4 desktop-title">
        <div className="ascii-title mb-6">
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

      {/* Desktop Icons - Scattered placement */}
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
        x={windowSize.width - 175}
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
        x={windowSize.width - 220}
        y={280}
        onClick={() => toggleWindow('document')}
      />

      {/* Survey Desktop Shortcut */}
      <DesktopIcon
        icon={
          <img
            src="/bar-chart.png"
            alt="Summit Agentic Survey"
            className="w-8 h-8"
            style={{ imageRendering: 'pixelated' }}
          />
        }
        label="SUMMIT AGENTIC SURVEY"
        x={windowSize.width - 90}
        y={200}
        onClick={() => toggleWindow('survey')}
      />

      {/* Prompt Builder Desktop Shortcut */}
      <DesktopIcon
        icon={
          <img
            src="/construction.png"
            alt="Prompt Builder"
            className="w-8 h-8"
            style={{ imageRendering: 'pixelated' }}
          />
        }
        label="PROMPT BUILDER"
        x={windowSize.width - 260}
        y={450}
        onClick={() => toggleWindow('promptBuilder')}
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

      <Window
        title="Summit Agentic Survey"
        isVisible={activeWindows.survey}
        onClose={() => closeWindow('survey')}
        x={175}
        y={75}
        width={600}
        height={500}
      >
        <SurveyWindow />
      </Window>

      <Window
        title="Prompt Builder"
        isVisible={activeWindows.promptBuilder}
        onClose={() => closeWindow('promptBuilder')}
        x={100}
        y={50}
        width={900}
        height={600}
      >
        <PromptBuilderWindow />
      </Window>

      {/* Taskbar */}
      <Taskbar
        activeWindows={activeWindows}
        onToggleWindow={toggleWindow}
        useInteractiveBackground={useInteractiveBackground}
        onToggleBackground={() => setUseInteractiveBackground(!useInteractiveBackground)}
      />
      </div>
    </>
  );
}