'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Square,
  Volume2,
  Music,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { spotify, Track, Playlist } from '@/lib/spotify';

export function PlaylistWindow() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tracks, setTracks] = useState<Track[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [devices, setDevices] = useState<Record<string, unknown>[]>([]);
  const [showPlaylistDropdown, setShowPlaylistDropdown] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 400, height: 180 });
  const [isResizing, setIsResizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  // Demo playlists for when not authenticated
  const demoPlaylists = [
    { id: 'demo1', name: 'Coding Vibes', description: 'Perfect for deep work', images: [], tracks: { total: 42 } },
    { id: 'demo2', name: 'Lo-fi Hip Hop', description: 'Chill beats to code to', images: [], tracks: { total: 28 } },
    { id: 'demo3', name: 'Electronic Focus', description: 'Upbeat electronic music', images: [], tracks: { total: 35 } }
  ];

  // Monitor Web Playback SDK state
  const updatePlayerState = useCallback(async () => {
    const state = await spotify.getCurrentState();
    if (state) {
      setCurrentTrack(state.track_window.current_track);
      setIsPlaying(!state.paused);
      setCurrentTime(state.position);
      setDuration(state.track_window.current_track ? 30000 : 0); // Spotify tracks vary
    }
  }, []);

  useEffect(() => {
    // Check for access token in URL fragment (from OAuth callback)
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (accessToken) {
      console.log('Access token found, setting up Spotify...');
      spotify.setAccessToken(accessToken);
      setIsAuthenticated(true);
      loadPlaylists();
      loadDevices();

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Set up player ready monitoring with timeout
      let playerCheckCount = 0;
      const maxChecks = 60; // 60 seconds max

      const checkPlayerReady = setInterval(() => {
        playerCheckCount++;
        console.log(`Checking if player is ready... (attempt ${playerCheckCount}/${maxChecks})`);

        if (spotify.isPlayerReady()) {
          console.log('Player is ready!');
          setPlayerReady(true);
          clearInterval(checkPlayerReady);

          // Set up state monitoring
          const stateInterval = setInterval(updatePlayerState, 1000);
          return () => clearInterval(stateInterval);
        } else if (playerCheckCount >= maxChecks) {
          console.error('Player failed to become ready within 60 seconds');
          clearInterval(checkPlayerReady);
        }
      }, 1000);

      return () => clearInterval(checkPlayerReady);
    }
  }, [updatePlayerState]);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !windowRef.current) return;

      const rect = windowRef.current.getBoundingClientRect();
      const newWidth = Math.max(350, e.clientX - rect.left);
      const newHeight = Math.max(150, e.clientY - rect.top);

      setWindowSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showPlaylistDropdown && windowRef.current && !windowRef.current.contains(event.target as Node)) {
        setShowPlaylistDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPlaylistDropdown]);

  const loadPlaylists = async () => {
    try {
      const userPlaylists = await spotify.getMyPlaylists();
      setPlaylists(userPlaylists.slice(0, 3)); // Show first 3 playlists
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  };

  const loadDevices = async () => {
    try {
      const userDevices = await spotify.getDevices();
      setDevices(userDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const handlePlaylistSelect = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    if (playlist.id.startsWith('demo')) {
      // Handle demo playlist
      setTracks([]);
      return;
    }

    setIsLoading(true);
    try {
      const playlistTracks = await spotify.getPlaylistTracks(playlist.id);
      setTracks(playlistTracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTrackSelect = async (track: Track) => {
    if (!playerReady) {
      console.log('Player not ready yet');
      return;
    }

    try {
      const trackUri = `spotify:track:${track.id}`;
      await spotify.playTrack(trackUri);
      setCurrentTrack(track);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePlaylistPlay = async (playlist: Playlist) => {
    if (!playerReady) {
      console.log('Player not ready yet');
      return;
    }

    try {
      const playlistUri = `spotify:playlist:${playlist.id}`;
      await spotify.playPlaylist(playlistUri);
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  const togglePlayPause = async () => {
    if (!playerReady) return;

    try {
      await spotify.togglePlay();
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleNext = async () => {
    if (!playerReady) return;

    try {
      await spotify.skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const handlePrevious = async () => {
    if (!playerReady) return;

    try {
      await spotify.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  const handleStop = async () => {
    if (!playerReady) return;

    try {
      await spotify.pause();
      // Reset position to beginning
      await spotify.seek(0);
    } catch (error) {
      console.error('Error stopping:', error);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    if (playerReady) {
      try {
        await spotify.setVolume(newVolume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  const handleSeek = async (position: number) => {
    if (!playerReady) return;

    try {
      await spotify.seek(position);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeviceSelect = async (deviceId: string) => {
    try {
      await spotify.transferPlayback(deviceId);
      await loadDevices(); // Refresh device list
    } catch (error) {
      console.error('Error transferring playback:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAuth = () => {
    window.location.href = spotify.getAuthUrl();
  };

  return (
    <div
      ref={windowRef}
      className="relative bg-gradient-to-b from-gray-300 to-gray-500 border-2 border-gray-600 font-mono select-none"
      style={{
        width: `${windowSize.width}px`,
        height: `${windowSize.height}px`,
        minWidth: '350px',
        minHeight: '150px'
      }}
    >
      {/* Winamp Title Bar */}
      <div className="bg-gradient-to-r from-gray-400 to-gray-600 h-5 flex items-center justify-between px-2 text-xs border-b border-gray-700">
        <span className="text-black font-bold">🎵 POOLSUITE</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-500 border border-gray-700"></div>
          <div className="w-3 h-3 bg-gray-500 border border-gray-700"></div>
          <div className="w-3 h-3 bg-red-500 border border-gray-700"></div>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="p-4 text-center">
          <div className="mb-4">
            <Music size={48} className="mx-auto mb-2 text-gray-400" />
            <p className="mb-4">Connect to Spotify to play music</p>
            <button
              onClick={handleAuth}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white font-bold flex items-center gap-2 mx-auto"
            >
              <ExternalLink size={14} />
              Connect Spotify
            </button>
          </div>

          <div className="border-t border-gray-600 pt-4">
            <h3 className="font-bold mb-2">Demo Playlists</h3>
            <div className="space-y-1">
              {demoPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  onClick={() => handlePlaylistSelect(playlist)}
                  className="bg-gray-800 hover:bg-gray-700 p-2 cursor-pointer rounded border border-gray-600"
                >
                  <div className="font-semibold">{playlist.name}</div>
                  <div className="text-gray-400 text-xs">{playlist.tracks.total} tracks</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Song Info Display */}
          <div className="bg-black h-16 m-2 border border-gray-600 flex items-center px-3">
            <div className="text-green-400 font-mono text-xs flex-1">
              {currentTrack ? (
                <div>
                  <div className="font-bold truncate">{currentTrack.name}</div>
                  <div className="text-green-300 truncate text-xs">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {currentTrack.artists ? currentTrack.artists.map((a: any) => a.name).join(', ') : 'Unknown Artist'}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  {playerReady ? 'No track selected' : '⏳ Loading player...'}
                </div>
              )}
            </div>
            <div className="text-green-400 text-xs">
              {formatTime(currentTime / 1000)} / {formatTime(duration / 1000)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mx-2 mb-2">
            <div
              className="h-2 bg-gray-700 border border-gray-800 cursor-pointer"
              onClick={(e) => {
                if (!playerReady || !duration) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = clickX / rect.width;
                const newPosition = percentage * duration;
                handleSeek(newPosition);
              }}
            >
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
              />
            </div>
          </div>

          {/* Control Panel */}
          <div className="flex items-center justify-between mx-2 mb-2">
            {/* Playlist Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPlaylistDropdown(!showPlaylistDropdown)}
                className="bg-gray-600 hover:bg-gray-500 px-3 py-1 text-xs border border-gray-800 flex items-center gap-2 min-w-32"
                disabled={!isAuthenticated}
              >
                <span className="truncate">
                  {selectedPlaylist ? selectedPlaylist.name : 'Select Playlist'}
                </span>
                <ChevronDown size={12} />
              </button>

              {showPlaylistDropdown && (
                <div className="absolute top-full left-0 w-48 bg-gray-600 border border-gray-800 z-10 max-h-32 overflow-y-auto">
                  {playlists.slice(0, 5).map((playlist) => (
                    <button
                      key={playlist.id}
                      onClick={() => {
                        handlePlaylistSelect(playlist);
                        setShowPlaylistDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-500 border-b border-gray-700"
                    >
                      <div className="font-semibold truncate">{playlist.name}</div>
                      <div className="text-gray-300 text-xs">{playlist.tracks.total} tracks</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Media Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevious}
                className="bg-gray-600 hover:bg-gray-500 p-2 border border-gray-800"
                disabled={!playerReady}
                title="Previous"
              >
                <SkipBack size={14} />
              </button>
              <button
                onClick={togglePlayPause}
                className={`p-2 border border-gray-800 ${
                  playerReady
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-gray-600 cursor-not-allowed'
                }`}
                disabled={!playerReady}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                onClick={handleStop}
                className="bg-gray-600 hover:bg-gray-500 p-2 border border-gray-800"
                disabled={!playerReady}
                title="Stop"
              >
                <Square size={14} />
              </button>
              <button
                onClick={handleNext}
                className="bg-gray-600 hover:bg-gray-500 p-2 border border-gray-800"
                disabled={!playerReady}
                title="Next"
              >
                <SkipForward size={14} />
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Volume2 size={12} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-16 h-1 bg-gray-700 rounded appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${volume}%, #374151 ${volume}%, #374151 100%)`
                }}
              />
              <span className="text-xs w-8">{volume}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Resize Handle */}
      <div
        ref={resizeRef}
        className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 border border-gray-700 cursor-se-resize"
        onMouseDown={() => setIsResizing(true)}
        title="Resize window"
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600"></div>
      </div>
    </div>
  );
}