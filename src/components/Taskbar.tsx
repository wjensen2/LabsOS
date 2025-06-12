'use client';

import { Monitor, Users, Music } from 'lucide-react';

interface TaskbarProps {
  activeWindows: {
    projects: boolean;
    team: boolean;
    playlist: boolean;
  };
  onToggleWindow: (window: 'projects' | 'team' | 'playlist') => void;
}

export function Taskbar({ activeWindows, onToggleWindow }: TaskbarProps) {
  return (
    <div className="taskbar">
      <div className="flex gap-2">
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
      </div>
      
      <div className="ml-auto flex items-center gap-2">
        <div className="text-xs">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}