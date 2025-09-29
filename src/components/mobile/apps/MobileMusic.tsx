'use client';

import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  cover: string;
}

const playlist: Song[] = [
  { id: '1', title: 'Focus Flow', artist: 'Fountain Labs', album: 'Productivity Beats', duration: '3:42', cover: '/music-cover-1.png' },
  { id: '2', title: 'Code & Coffee', artist: 'Dev Vibes', album: 'Morning Sessions', duration: '4:15', cover: '/music-cover-2.png' },
  { id: '3', title: 'Summit Sounds', artist: 'Conference Mix', album: 'Event Highlights', duration: '2:58', cover: '/music-cover-3.png' },
  { id: '4', title: 'Innovation Rhythm', artist: 'Fountain Labs', album: 'Creative Flow', duration: '3:28', cover: '/music-cover-4.png' },
];

export function MobileMusic() {
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(45);
  const [likedSongs, setLikedSongs] = useState<string[]>(['1', '3']);

  const song = playlist[currentSong];
  const progress = (currentTime / 222) * 100; // Mock total duration

  const toggleLike = (songId: string) => {
    setLikedSongs(prev =>
      prev.includes(songId)
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  return (
    <div className="h-full bg-gradient-to-b from-purple-900 to-black text-white">
      {/* Current Song */}
      <div className="p-6 text-center">
        <div className="w-48 h-48 mx-auto mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-6xl">🎵</div>
        </div>
        <h2 className="text-xl font-bold mb-1">{song.title}</h2>
        <p className="text-purple-300 mb-1">{song.artist}</p>
        <p className="text-sm text-gray-400">{song.album}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-4">
        <div className="h-1 bg-gray-700 rounded-full mb-2">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>0:{currentTime.toString().padStart(2, '0')}</span>
          <span>{song.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          onClick={() => toggleLike(song.id)}
          className="p-3"
        >
          <Heart
            size={20}
            className={likedSongs.includes(song.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}
          />
        </button>
        <button
          onClick={() => setCurrentSong(prev => Math.max(0, prev - 1))}
          className="p-3"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-4 bg-purple-600 rounded-full"
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>
        <button
          onClick={() => setCurrentSong(prev => Math.min(playlist.length - 1, prev + 1))}
          className="p-3"
        >
          <SkipForward size={24} />
        </button>
        <button className="p-3">
          <Volume2 size={20} />
        </button>
      </div>

      {/* Playlist */}
      <div className="flex-1 bg-black/30 rounded-t-3xl p-4">
        <h3 className="text-lg font-semibold mb-3">Up Next</h3>
        <div className="space-y-2">
          {playlist.map((song, index) => (
            <div
              key={song.id}
              onClick={() => setCurrentSong(index)}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                index === currentSong ? 'bg-purple-600/30' : 'active:bg-white/10'
              }`}
            >
              <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center text-xs">
                🎵
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{song.title}</h4>
                <p className="text-xs text-gray-400">{song.artist}</p>
              </div>
              <div className="text-xs text-gray-400">{song.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}