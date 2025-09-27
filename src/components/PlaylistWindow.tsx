'use client';

import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export function PlaylistWindow() {
  const [selectedPlaylist, setSelectedPlaylist] = useState<{ id: string; name: string }>({
    id: '3qH7s11IkCeRRQM3cSK7hR',
    name: "T'was September of 2025"
  });
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 400, height: 180 });
  const [isResizing, setIsResizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Curated playlists
  const playlists = [
    { id: '3qH7s11IkCeRRQM3cSK7hR', name: "T'was September of 2025" },
    { id: '37i9dQZF1DXcBWIGoYBM5M', name: 'Today\'s Top Hits' },
    { id: '37i9dQZF1DX4JAvHpjipBk', name: 'New Music Friday' },
    { id: '37i9dQZF1DWXRqgorJj26U', name: 'Rock Classics' },
    { id: '37i9dQZF1DX0XUsuxWHRQd', name: 'RapCaviar' },
    { id: '37i9dQZF1DXcF6B6QPhFDv', name: 'Rock This' }
  ];

  // Resize functionality
  useState(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !windowRef.current) return;

      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(300, e.clientX - rect.left);
      const newHeight = Math.max(152, e.clientY - rect.top);

      setWindowSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (typeof window !== 'undefined') {
      if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  });

  const handlePlaylistSelect = (playlist: { id: string; name: string }) => {
    setSelectedPlaylist(playlist);
    setShowPlaylistDropdown(false);
  };

  return (
    <div
      ref={windowRef}
      className="relative bg-gradient-to-b from-gray-300 to-gray-500 border-2 border-gray-600 font-mono select-none overflow-hidden"
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        minWidth: '300px',
        minHeight: '152px'
      }}
    >
      {/* Winamp-style Title Bar */}
      <div className="bg-gradient-to-r from-gray-400 to-gray-600 h-5 flex items-center justify-between px-2 text-xs border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-black font-bold">🎵 POOLSUITE FM</span>

          {/* Playlist Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
              className="bg-gray-500 hover:bg-gray-400 px-2 py-0.5 text-xs border border-gray-700 flex items-center gap-1"
            >
              <span className="truncate max-w-[150px]">
                {selectedPlaylist.name}
              </span>
              <ChevronDown size={10} />
            </button>

            {showPlaylistDropdown && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-gray-600 border border-gray-800 z-50 max-h-40 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handlePlaylistSelect(playlist)}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-gray-500 border-b border-gray-700 text-white"
                  >
                    {playlist.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-500 border border-gray-700"></div>
          <div className="w-3 h-3 bg-gray-500 border border-gray-700"></div>
          <div className="w-3 h-3 bg-red-500 border border-gray-700"></div>
        </div>
      </div>

      {/* Spotify Embed */}
      <div className="w-full h-[calc(100%-20px)]">
        <iframe
          style={{ borderRadius: '0' }}
          src={`https://open.spotify.com/embed/playlist/${selectedPlaylist.id}?utm_source=generator&theme=0`}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>

      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 border border-gray-700 cursor-se-resize z-10"
        onMouseDown={() => setIsResizing(true)}
        title="Resize window"
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
      </div>
    </div>
  );
}