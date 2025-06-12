'use client';

import { Music, ExternalLink, Settings } from 'lucide-react';

export function PlaylistWindow() {
  return (
    <div className="h-full">
      <h2 className="font-bold text-sm mb-4">Fountain Labs Playlist</h2>
      
      <div className="flex flex-col items-center justify-center h-32 border border-gray-400 bg-gray-100 mb-4">
        <Music size={32} className="text-gray-500 mb-2" />
        <div className="text-xs text-center text-gray-600">
          Spotify Integration Coming Soon
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="p-3 border border-gray-400 bg-white">
          <h3 className="font-bold text-xs mb-2">Planned Features</h3>
          <ul className="text-xs space-y-1 text-gray-600">
            <li>• Live Spotify playlist sync</li>
            <li>• Team voting on tracks</li>
            <li>• Mood-based recommendations</li>
            <li>• Focus session playlists</li>
          </ul>
        </div>
        
        <div className="p-3 border border-gray-400 bg-white">
          <h3 className="font-bold text-xs mb-2">Quick Actions</h3>
          <div className="flex gap-2">
            <button className="retro-button flex items-center gap-1 text-xs">
              <ExternalLink size={10} />
              Open Spotify
            </button>
            <button className="retro-button flex items-center gap-1 text-xs">
              <Settings size={10} />
              Configure
            </button>
          </div>
        </div>
        
        <div className="p-3 border border-gray-400 bg-gray-100">
          <div className="text-xs">
            <strong>Current Vibe:</strong> Lo-fi Hip Hop
          </div>
          <div className="text-xs text-gray-600">
            Perfect for coding sessions
          </div>
        </div>
      </div>
    </div>
  );
}