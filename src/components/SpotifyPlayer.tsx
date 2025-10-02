'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface SpotifyPlayerProps {
  onClose?: () => void;
}

export function SpotifyPlayer({ onClose }: SpotifyPlayerProps) {
  const [position, setPosition] = useState({ x: 50, y: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const playerRef = useRef<HTMLDivElement>(null);

  // Default playlist
  const playlistId = '5JaEX5yzdYiU3rGPmLOjzc';

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (playerRef.current) {
      const rect = playerRef.current.getBoundingClientRect();
      dragOffset.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      setIsDragging(true);
    }
  };

  return (
    <div
      ref={playerRef}
      className="absolute shadow-2xl"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '100%',
        maxWidth: '500px',
        height: '352px',
        zIndex: 10
      }}
    >
      {/* Invisible drag handle bar at top */}
      <div
        className="absolute top-0 left-0 right-0 h-4 cursor-move z-20"
        onMouseDown={handleMouseDown}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 z-30 bg-red-500 hover:bg-red-600 text-white p-1 rounded-sm shadow-md"
        title="Close player"
      >
        <X size={12} />
      </button>

      {/* Spotify Embed */}
      <iframe
        style={{ borderRadius: '12px' }}
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}