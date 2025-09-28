'use client';

import { Settings, Folder, HelpCircle, User, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

interface TaskbarProps {
  activeWindows: {
    projects: boolean;
    team: boolean;
    playlist: boolean;
    nora: boolean;
    document: boolean;
    document2: boolean;
    survey: boolean;
    surveyResults: boolean;
    promptBuilder: boolean;
    presentation: boolean;
    runnerGame: boolean;
  };
  onToggleWindow: (window: 'projects' | 'team' | 'playlist' | 'nora' | 'document' | 'document2' | 'survey' | 'surveyResults' | 'promptBuilder' | 'presentation' | 'runnerGame') => void;
  useInteractiveBackground: boolean;
  onToggleBackground: () => void;
}

export function Taskbar({ activeWindows, onToggleWindow, useInteractiveBackground, onToggleBackground }: TaskbarProps) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [showApplicationsSubmenu, setShowApplicationsSubmenu] = useState(false);
  const [showDocumentsSubmenu, setShowDocumentsSubmenu] = useState(false);
  const startMenuRef = useRef<HTMLDivElement>(null);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target as Node)) {
        setIsStartMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="taskbar relative">
      {/* Start Menu */}
      <div className="relative" ref={startMenuRef}>
        <button
          className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        >
          <Image src="/rocket.png" alt="" width={16} height={16} className="mr-1" />
          <span className="font-bold">Start</span>
        </button>

        {isStartMenuOpen && (
          <div className="start-menu">
            <div className="start-menu-header">
              <div className="start-menu-user">
                <User size={16} />
                <span>Fountain Labs OS</span>
              </div>
            </div>

            <div className="start-menu-separator"></div>

            <div className="start-menu-section">
              {/* Applications submenu */}
              <div
                className="start-menu-item relative"
                onMouseEnter={() => setShowApplicationsSubmenu(true)}
                onMouseLeave={() => setShowApplicationsSubmenu(false)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Image src="/rocket.png" alt="" width={16} height={16} />
                    <span>Applications</span>
                  </div>
                  <ChevronRight size={12} />
                </div>

                {showApplicationsSubmenu && (
                  <div className="absolute left-full top-0 ml-1 w-56 max-h-80 overflow-y-auto bg-gray-200 border-2 border-gray-400 shadow-md z-20" style={{ bottom: 'auto', transform: 'translateY(-20px)' }}>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('projects');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/projects.png" alt="" width={16} height={16} />
                      <span>Projects</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('team');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/team.png" alt="" width={16} height={16} />
                      <span>Team</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('playlist');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/musical-score.png" alt="" width={16} height={16} />
                      <span>Music Player</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('nora');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/astronaut.png" alt="" width={16} height={16} />
                      <span>Nora AI</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('survey');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/bar-chart.png" alt="" width={16} height={16} />
                      <span>Summit Agentic Survey</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('promptBuilder');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/construction.png" alt="" width={16} height={16} />
                      <span>Prompt Builder</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('presentation');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/slides.png" alt="" width={16} height={16} />
                      <span>Fountain Summit</span>
                    </button>
                    <button
                      className="start-menu-item w-full"
                      onClick={() => {
                        onToggleWindow('runnerGame');
                        setIsStartMenuOpen(false);
                        setShowApplicationsSubmenu(false);
                      }}
                    >
                      <Image src="/man.png" alt="" width={16} height={16} />
                      <span>Fountain Runner</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Documents submenu */}
              <div
                className="start-menu-item relative"
                onMouseEnter={() => setShowDocumentsSubmenu(true)}
                onMouseLeave={() => setShowDocumentsSubmenu(false)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Folder size={16} />
                    <span>Documents</span>
                  </div>
                  <ChevronRight size={12} />
                </div>

                {showDocumentsSubmenu && (
                  <div className="absolute left-full top-0 ml-1 w-56 bg-gray-200 border-2 border-gray-400 shadow-md z-20">
                    <button
                      className="start-menu-item w-full hover:bg-blue-500 hover:text-white"
                      onClick={() => {
                        onToggleWindow('document');
                        setIsStartMenuOpen(false);
                        setShowDocumentsSubmenu(false);
                      }}
                    >
                      <Image src="/document.png" alt="" width={16} height={16} />
                      <span>Fountain Frontline OS.pdf</span>
                    </button>
                    <button
                      className="start-menu-item w-full hover:bg-blue-500 hover:text-white"
                      onClick={() => {
                        onToggleWindow('document2');
                        setIsStartMenuOpen(false);
                        setShowDocumentsSubmenu(false);
                      }}
                    >
                      <Image src="/document.png" alt="" width={16} height={16} />
                      <span>Agentic AI for Frontline Workforces - Fountain.pdf</span>
                    </button>
                    <div className="start-menu-item w-full text-gray-500">
                      <Image src="/document.png" alt="" width={16} height={16} />
                      <span>Product_Strategy_2024.pdf</span>
                    </div>
                    <div className="start-menu-item w-full text-gray-500">
                      <Image src="/document.png" alt="" width={16} height={16} />
                      <span>AI_Integration_Plan.md</span>
                    </div>
                    <div className="start-menu-item w-full text-gray-500">
                      <Image src="/document.png" alt="" width={16} height={16} />
                      <span>Team_Roadmap_Q1.txt</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="start-menu-separator"></div>

            <div className="start-menu-section">
              <button
                className="start-menu-item"
                onClick={() => {
                  onToggleBackground();
                  setIsStartMenuOpen(false);
                }}
              >
                <Settings size={16} />
                <span>{useInteractiveBackground ? 'Gradient Background' : 'Interactive Background'}</span>
              </button>
              <button className="start-menu-item">
                <HelpCircle size={16} />
                <span>Help</span>
              </button>
            </div>

            <div className="start-menu-separator"></div>

            <button className="start-menu-item">
              <HelpCircle size={16} />
              <span>About Fountain Labs OS</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 ml-2">
        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.projects ? 'active' : ''}`}
          onClick={() => onToggleWindow('projects')}
        >
          <Image src="/projects.png" alt="" width={12} height={12} />
          Projects
        </button>

        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.team ? 'active' : ''}`}
          onClick={() => onToggleWindow('team')}
        >
          <Image src="/team.png" alt="" width={12} height={12} />
          Team
        </button>

        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.playlist ? 'active' : ''}`}
          onClick={() => onToggleWindow('playlist')}
        >
          <Image src="/musical-score.png" alt="" width={12} height={12} />
          Music
        </button>

        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.nora ? 'active' : ''}`}
          onClick={() => onToggleWindow('nora')}
        >
          <Image src="/astronaut.png" alt="" width={12} height={12} />
          Nora AI
        </button>
      </div>

      <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
        <div className="text-xs text-right">
          <div>{new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
    </div>
  );
}