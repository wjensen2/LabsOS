'use client';

import { Monitor, Users, Music, Settings, Power, Folder, HelpCircle, User, Bot } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TaskbarProps {
  activeWindows: {
    projects: boolean;
    team: boolean;
    playlist: boolean;
    nora: boolean;
  };
  onToggleWindow: (window: 'projects' | 'team' | 'playlist' | 'nora') => void;
}

export function Taskbar({ activeWindows, onToggleWindow }: TaskbarProps) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
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
    <div className="taskbar">
      {/* Start Menu */}
      <div className="relative" ref={startMenuRef}>
        <button
          className={`start-button ${isStartMenuOpen ? 'active' : ''}`}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
        >
          <span className="font-bold">Start</span>
        </button>

        {isStartMenuOpen && (
          <div className="start-menu">
            <div className="start-menu-header">
              <div className="start-menu-user">
                <User size={16} />
                <span>CHRO Summit User</span>
              </div>
            </div>

            <div className="start-menu-separator"></div>

            <div className="start-menu-section">
              <div className="start-menu-title">Programs</div>
              <button
                className="start-menu-item"
                onClick={() => {
                  onToggleWindow('projects');
                  setIsStartMenuOpen(false);
                }}
              >
                <Monitor size={16} />
                <span>Projects</span>
              </button>
              <button
                className="start-menu-item"
                onClick={() => {
                  onToggleWindow('team');
                  setIsStartMenuOpen(false);
                }}
              >
                <Users size={16} />
                <span>Team</span>
              </button>
              <button
                className="start-menu-item"
                onClick={() => {
                  onToggleWindow('playlist');
                  setIsStartMenuOpen(false);
                }}
              >
                <Music size={16} />
                <span>Playlist</span>
              </button>
              <button
                className="start-menu-item"
                onClick={() => {
                  onToggleWindow('nora');
                  setIsStartMenuOpen(false);
                }}
              >
                <Bot size={16} />
                <span>Nora AI</span>
              </button>
            </div>

            <div className="start-menu-separator"></div>

            <div className="start-menu-section">
              <button className="start-menu-item">
                <Folder size={16} />
                <span>Documents</span>
              </button>
              <button className="start-menu-item">
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <button className="start-menu-item">
                <HelpCircle size={16} />
                <span>Help</span>
              </button>
            </div>

            <div className="start-menu-separator"></div>

            <button className="start-menu-item">
              <Power size={16} />
              <span>Shut Down...</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-2 ml-2">
        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.projects ? 'active' : ''}`}
          onClick={() => onToggleWindow('projects')}
        >
          <Monitor size={12} />
          Projects
        </button>

        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.team ? 'active' : ''}`}
          onClick={() => onToggleWindow('team')}
        >
          <Users size={12} />
          Team
        </button>

        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.playlist ? 'active' : ''}`}
          onClick={() => onToggleWindow('playlist')}
        >
          <Music size={12} />
          Playlist
        </button>

        <button
          className={`taskbar-button flex items-center gap-2 ${activeWindows.nora ? 'active' : ''}`}
          onClick={() => onToggleWindow('nora')}
        >
          <Bot size={12} />
          Nora AI
        </button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="text-xs">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}