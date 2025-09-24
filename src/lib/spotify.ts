import SpotifyWebApi from 'spotify-web-api-js';

// Web Playback SDK types
declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: {
      Player: new (options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      }) => SpotifyPlayer;
    };
  }
}

interface SpotifyPlayer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addListener: (event: string, callback: (data: any) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  removeListener: (event: string, callback?: (data: any) => void) => void;
  getCurrentState: () => Promise<SpotifyWebPlaybackState | null>;
  setName: (name: string) => Promise<void>;
  getVolume: () => Promise<number>;
  setVolume: (volume: number) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  previousTrack: () => Promise<void>;
  nextTrack: () => Promise<void>;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

interface SpotifyWebPlaybackState {
  context: {
    uri: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any;
  };
  disallows: {
    pausing: boolean;
    peeking_next: boolean;
    peeking_prev: boolean;
    resuming: boolean;
    seeking: boolean;
    skipping_next: boolean;
    skipping_prev: boolean;
  };
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
    current_track: SpotifyWebPlaybackTrack;
    previous_tracks: SpotifyWebPlaybackTrack[];
    next_tracks: SpotifyWebPlaybackTrack[];
  };
}

interface SpotifyWebPlaybackTrack {
  uri: string;
  id: string;
  type: string;
  media_type: string;
  name: string;
  is_playable: boolean;
  album: {
    uri: string;
    name: string;
    images: Array<{ url: string }>;
  };
  artists: Array<{ uri: string; name: string }>;
}

// Removing unused interface
// interface SpotifyDevice {
//   id: string;
//   is_active: boolean;
//   is_private_session: boolean;
//   is_restricted: boolean;
//   name: string;
//   type: string;
//   volume_percent: number;
// }

const spotifyApi = new SpotifyWebApi();

export interface Track {
  id: string;
  name: string;
  artists: Array<{ name: string }>;
  album: {
    name: string;
    images: Array<{ url: string }>;
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  images: Array<{ url: string }>;
  tracks: {
    total: number;
  };
}

export class SpotifyService {
  private static instance: SpotifyService;
  private accessToken: string | null = null;
  private isInitialized = false;
  private player: SpotifyPlayer | null = null;
  private deviceId: string | null = null;
  private playerReady = false;

  static getInstance(): SpotifyService {
    if (!SpotifyService.instance) {
      SpotifyService.instance = new SpotifyService();
    }
    return SpotifyService.instance;
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    spotifyApi.setAccessToken(token);
    this.isInitialized = true;
    this.initializeWebPlayback();
  }

  private initializeWebPlayback() {
    if (typeof window === 'undefined') return;

    const initPlayer = () => {
      if (!this.accessToken || !window.Spotify) return;

      console.log('Initializing Spotify Web Playback SDK...');

      this.player = new window.Spotify.Player({
        name: 'Fountain Labs Winamp Player',
        getOAuthToken: (cb) => {
          console.log('Getting OAuth token...');
          cb(this.accessToken!);
        },
        volume: 0.5
      });

      // Error handling
      this.player.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize:', message);
      });

      this.player.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate:', message);
      });

      this.player.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      this.player.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
      });

      // Playback status updates
      this.player.addListener('player_state_changed', (state) => {
        if (!state) return;
        console.log('Player state changed:', state);
      });

      // Ready
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Player ready with Device ID:', device_id);
        this.deviceId = device_id;
        this.playerReady = true;
      });

      // Not Ready
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline:', device_id);
        this.playerReady = false;
      });

      // Connect to the player!
      console.log('Connecting to Spotify player...');
      this.player.connect().then((success) => {
        if (success) {
          console.log('Successfully connected to Spotify!');
        } else {
          console.error('Failed to connect to Spotify');
        }
      });
    };

    // Set up the callback for when SDK is ready
    window.onSpotifyWebPlaybackSDKReady = initPlayer;

    // If SDK is already loaded, initialize immediately
    if (window.Spotify) {
      console.log('Spotify SDK already loaded, initializing...');
      initPlayer();
    } else {
      console.log('Waiting for Spotify SDK to load...');
      // Also try to poll for the SDK in case the callback doesn't fire
      const checkForSDK = setInterval(() => {
        if (window.Spotify) {
          console.log('Spotify SDK loaded via polling, initializing...');
          clearInterval(checkForSDK);
          initPlayer();
        }
      }, 1000);

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(checkForSDK);
        if (!this.player) {
          console.error('Spotify SDK failed to load within 30 seconds');
        }
      }, 30000);
    }
  }

  getPlayer(): SpotifyPlayer | null {
    return this.player;
  }

  getDeviceId(): string | null {
    return this.deviceId;
  }

  isPlayerReady(): boolean {
    return this.playerReady;
  }

  getAuthUrl(): string {
    const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
    const scopes = [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-read-collaborative',
      'streaming',
      'user-read-email',
      'user-read-private'
    ];

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId!,
      scope: scopes.join(' '),
      redirect_uri: redirectUri!,
      show_dialog: 'true'
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getMyPlaylists(): Promise<Playlist[]> {
    if (!this.isInitialized) throw new Error('Spotify not initialized');

    try {
      const response = await spotifyApi.getUserPlaylists();
      return response.items.map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description || undefined,
        images: playlist.images || [],
        tracks: {
          total: playlist.tracks.total
        }
      }));
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  }

  async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    if (!this.isInitialized) throw new Error('Spotify not initialized');

    try {
      const response = await spotifyApi.getPlaylistTracks(playlistId);
      return response.items
        .filter(item => item.track && item.track.type === 'track')
        .map(item => {
          const track = item.track as SpotifyApi.TrackObjectFull;
          return {
            id: track.id,
            name: track.name,
            artists: track.artists,
            album: track.album,
            duration_ms: track.duration_ms,
            preview_url: track.preview_url || undefined,
            external_urls: track.external_urls
          };
        });
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      throw error;
    }
  }

  async getCurrentPlayback() {
    if (!this.isInitialized) throw new Error('Spotify not initialized');

    try {
      return await spotifyApi.getMyCurrentPlaybackState();
    } catch (error) {
      console.error('Error fetching current playback:', error);
      return null;
    }
  }

  async playTrack(trackUri: string) {
    if (!this.isInitialized || !this.deviceId) throw new Error('Spotify not initialized');

    try {
      await spotifyApi.play({
        uris: [trackUri],
        device_id: this.deviceId
      });
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  async playPlaylist(playlistUri: string, trackUris?: string[]) {
    if (!this.isInitialized || !this.deviceId) throw new Error('Spotify not initialized');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        device_id: this.deviceId
      };

      if (trackUris) {
        options.uris = trackUris;
      } else {
        options.context_uri = playlistUri;
      }

      await spotifyApi.play(options);
    } catch (error) {
      console.error('Error playing playlist:', error);
      throw error;
    }
  }

  async pause() {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.pause();
    } catch (error) {
      console.error('Error pausing:', error);
      throw error;
    }
  }

  async resume() {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.resume();
    } catch (error) {
      console.error('Error resuming:', error);
      throw error;
    }
  }

  async togglePlay() {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.togglePlay();
    } catch (error) {
      console.error('Error toggling play:', error);
      throw error;
    }
  }

  async skipToNext() {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.nextTrack();
    } catch (error) {
      console.error('Error skipping to next:', error);
      throw error;
    }
  }

  async skipToPrevious() {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.previousTrack();
    } catch (error) {
      console.error('Error skipping to previous:', error);
      throw error;
    }
  }

  async setVolume(volume: number) {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.setVolume(Math.max(0, Math.min(100, volume)) / 100);
    } catch (error) {
      console.error('Error setting volume:', error);
      throw error;
    }
  }

  async seek(position: number) {
    if (!this.player) throw new Error('Player not initialized');

    try {
      await this.player.seek(position);
    } catch (error) {
      console.error('Error seeking:', error);
      throw error;
    }
  }

  async getCurrentState(): Promise<SpotifyWebPlaybackState | null> {
    if (!this.player) return null;

    try {
      return await this.player.getCurrentState();
    } catch (error) {
      console.error('Error getting current state:', error);
      return null;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getDevices(): Promise<any[]> {
    if (!this.isInitialized) throw new Error('Spotify not initialized');

    try {
      const response = await spotifyApi.getMyDevices();
      return response.devices.filter(device => device.id !== null);
    } catch (error) {
      console.error('Error getting devices:', error);
      throw error;
    }
  }

  async transferPlayback(deviceId: string) {
    if (!this.isInitialized) throw new Error('Spotify not initialized');

    try {
      await spotifyApi.transferMyPlayback([deviceId], { play: true });
    } catch (error) {
      console.error('Error transferring playback:', error);
      throw error;
    }
  }
}

export const spotify = SpotifyService.getInstance();