import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { TRACKS, PLAYLISTS, ARTISTS, CATEGORIES } from '../data/musicData';
import {
  checkServerHealth,
  getSongsFromApi,
  getPlaylistsFromApi,
  getArtistsFromApi,
  getLikedFromApi,
  toggleLikeOnApi,
  createPlaylistOnApi,
  addTrackToPlaylistOnApi,
  removeTrackFromPlaylistOnApi,
  recordPlayedTrackOnApi,
} from '../utils/api';

const PlayerContext = createContext(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider = ({ children }) => {
  // Navigation State with Back/Forward history
  const [navState, setNavState] = useState({
    history: [{ tab: 'home', meta: null }],
    index: 0,
  });

  const currentNav = navState.history[navState.index] || { tab: 'home', meta: null };
  const activeTab = currentNav.tab;
  const activeMeta = currentNav.meta;

  const navigateTo = useCallback((tab, meta = null) => {
    setNavState((prev) => {
      const current = prev.history[prev.index];
      if (current && current.tab === tab && JSON.stringify(current.meta) === JSON.stringify(meta)) {
        return prev;
      }
      const newHistory = prev.history.slice(0, prev.index + 1);
      newHistory.push({ tab, meta });
      return {
        history: newHistory,
        index: newHistory.length - 1,
      };
    });
  }, []);

  const goBack = useCallback(() => {
    setNavState((prev) => {
      if (prev.index > 0) {
        return { ...prev, index: prev.index - 1 };
      }
      return prev;
    });
  }, []);

  const goForward = useCallback(() => {
    setNavState((prev) => {
      if (prev.index < prev.history.length - 1) {
        return { ...prev, index: prev.index + 1 };
      }
      return prev;
    });
  }, []);

  const canGoBack = navState.index > 0;
  const canGoForward = navState.index < navState.history.length - 1;

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Backend Connectivity status
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Core Data loaded from API or local fallback
  const [tracks, setTracks] = useState(TRACKS);
  const [playlists, setPlaylists] = useState(PLAYLISTS);
  const [artists, setArtists] = useState(ARTISTS);

  // Audio & Playback State
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(TRACKS[0].duration || 0);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('soundify_volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [queue, setQueue] = useState(TRACKS);
  const [audioError, setAudioError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Liked Songs State (persisted in localStorage + backend sync)
  const [likedTrackIds, setLikedTrackIds] = useState(() => {
    try {
      const saved = localStorage.getItem('soundify_liked_tracks');
      return saved ? JSON.parse(saved) : ['track-1', 'track-3', 'track-4'];
    } catch {
      return ['track-1', 'track-3', 'track-4'];
    }
  });

  // Recently Played
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('soundify_recent_tracks');
      return saved ? JSON.parse(saved) : ['track-1', 'track-2', 'track-4', 'track-3'];
    } catch {
      return ['track-1', 'track-2', 'track-4', 'track-3'];
    }
  });

  // Custom User Playlists
  const [customPlaylists, setCustomPlaylists] = useState(() => {
    try {
      const saved = localStorage.getItem('soundify_custom_playlists');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'custom-1',
              title: 'My Favorites 2024',
              description: 'Handpicked favorites and chill vibes.',
              owner: 'You',
              coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
              gradient: 'from-purple-800 via-indigo-950 to-[#121212]',
              trackIds: ['track-1', 'track-3', 'track-4'],
              createdAt: '2024-03-01',
            },
          ];
    } catch {
      return [];
    }
  });

  // HTML5 Audio Reference
  const audioRef = useRef(new Audio());

  // Show temporary toast message
  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
  }, []);

  const closeToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Fetch initial data from Backend API
  useEffect(() => {
    let isMounted = true;

    async function syncWithBackend() {
      try {
        const health = await checkServerHealth();
        if (health && health.status === 'ok' && isMounted) {
          setIsBackendConnected(true);

          // Sync tracks
          const songsRes = await getSongsFromApi();
          if (songsRes?.success && songsRes.data?.length > 0 && isMounted) {
            setTracks(songsRes.data);
          }

          // Sync playlists
          const playlistsRes = await getPlaylistsFromApi();
          if (playlistsRes?.success && playlistsRes.data?.length > 0 && isMounted) {
            setPlaylists(playlistsRes.data);
          }

          // Sync artists
          const artistsRes = await getArtistsFromApi();
          if (artistsRes?.success && artistsRes.data?.length > 0 && isMounted) {
            setArtists(artistsRes.data);
          }

          // Sync liked
          const likedRes = await getLikedFromApi();
          if (likedRes?.success && Array.isArray(likedRes.likedTrackIds) && isMounted) {
            setLikedTrackIds(likedRes.likedTrackIds);
          }
        }
      } catch (e) {
        console.warn('Backend sync failed, continuing with local state', e);
      }
    }

    syncWithBackend();

    return () => {
      isMounted = false;
    };
  }, []);

  // LocalStorage backups
  useEffect(() => {
    try {
      localStorage.setItem('soundify_liked_tracks', JSON.stringify(likedTrackIds));
    } catch (e) {
      console.error('Error saving liked tracks', e);
    }
  }, [likedTrackIds]);

  useEffect(() => {
    try {
      localStorage.setItem('soundify_custom_playlists', JSON.stringify(customPlaylists));
    } catch (e) {
      console.error('Error saving custom playlists', e);
    }
  }, [customPlaylists]);

  useEffect(() => {
    try {
      localStorage.setItem('soundify_recent_tracks', JSON.stringify(recentlyPlayedIds));
    } catch (e) {
      console.error('Error saving recent tracks', e);
    }
  }, [recentlyPlayedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('soundify_volume', volume.toString());
    } catch (e) {
      console.error('Error saving volume', e);
    }
  }, [volume]);

  // Like / Unlike Track Toggle
  const toggleLike = useCallback(
    async (trackId) => {
      setLikedTrackIds((prev) => {
        const isCurrentlyLiked = prev.includes(trackId);
        const next = isCurrentlyLiked ? prev.filter((id) => id !== trackId) : [trackId, ...prev];
        const track = tracks.find((t) => t.id === trackId);
        showToast(
          isCurrentlyLiked
            ? `Removed "${track?.title || 'Song'}" from Liked Songs`
            : `Added "${track?.title || 'Song'}" to Liked Songs`,
          isCurrentlyLiked ? 'info' : 'success'
        );
        return next;
      });

      // Sync with backend API
      try {
        await toggleLikeOnApi(trackId);
      } catch (err) {
        console.warn('Could not sync like with backend', err);
      }
    },
    [tracks, showToast]
  );

  const isLiked = useCallback(
    (trackId) => {
      return likedTrackIds.includes(trackId);
    },
    [likedTrackIds]
  );

  // Custom Playlist Management
  const createPlaylist = useCallback(
    async (title, description = '') => {
      const newPlaylist = {
        id: `custom-${Date.now()}`,
        title: title.trim() || `My Playlist #${customPlaylists.length + 1}`,
        description: description.trim() || 'Created by you.',
        owner: 'You',
        coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        gradient: 'from-emerald-800 via-zinc-900 to-[#121212]',
        trackIds: [],
        createdAt: new Date().toISOString(),
      };
      setCustomPlaylists((prev) => [newPlaylist, ...prev]);
      showToast(`Created playlist "${newPlaylist.title}"`, 'success');

      // Sync with backend
      try {
        await createPlaylistOnApi(newPlaylist);
      } catch (err) {
        console.warn('Could not sync created playlist with backend', err);
      }

      return newPlaylist;
    },
    [customPlaylists.length, showToast]
  );

  const addTrackToPlaylist = useCallback(
    async (playlistId, trackId) => {
      setCustomPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            if (pl.trackIds.includes(trackId)) {
              showToast('Song is already in this playlist', 'info');
              return pl;
            }
            showToast(`Added song to "${pl.title}"`, 'success');
            return { ...pl, trackIds: [...pl.trackIds, trackId] };
          }
          return pl;
        })
      );

      // Also update in playlists state if standard
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            if (!pl.trackIds.includes(trackId)) {
              return { ...pl, trackIds: [...pl.trackIds, trackId] };
            }
          }
          return pl;
        })
      );

      // Sync with backend
      try {
        await addTrackToPlaylistOnApi(playlistId, trackId);
      } catch (err) {
        console.warn('Could not sync track addition with backend', err);
      }
    },
    [showToast]
  );

  const removeTrackFromPlaylist = useCallback(
    async (playlistId, trackId) => {
      setCustomPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            showToast(`Removed song from "${pl.title}"`, 'info');
            return { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) };
          }
          return pl;
        })
      );

      // Also update in playlists state
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === playlistId) {
            return { ...pl, trackIds: pl.trackIds.filter((id) => id !== trackId) };
          }
          return pl;
        })
      );

      // Sync with backend
      try {
        await removeTrackFromPlaylistOnApi(playlistId, trackId);
      } catch (err) {
        console.warn('Could not sync track removal with backend', err);
      }
    },
    [showToast]
  );

  // Audio Event Bindings
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
      setAudioError(null);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setAudioError(null);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleError = (e) => {
      console.error('Audio playback error', e, audio.error);
      setIsPlaying(false);
      setAudioError('Failed to load audio track. Please check file or connection.');
      showToast('Audio playback error: track could not be loaded.', 'error');
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, [showToast]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Audio source setup when currentTrack changes
  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;

    setAudioError(null);

    if (audio.src !== window.location.origin + currentTrack.audioUrl && audio.src !== currentTrack.audioUrl) {
      audio.src = currentTrack.audioUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Playback interrupted or blocked by browser policy:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle Song Ended
  useEffect(() => {
    const audio = audioRef.current;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        playNext();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, queue, currentTrack]); // eslint-disable-line react-hooks/exhaustive-deps

  // Play a specific track
  const playTrack = useCallback(
    (track, newQueue = null) => {
      if (!track) return;

      if (newQueue && Array.isArray(newQueue) && newQueue.length > 0) {
        setQueue(newQueue);
      }

      setRecentlyPlayedIds((prev) => {
        const filtered = prev.filter((id) => id !== track.id);
        return [track.id, ...filtered.slice(0, 19)];
      });

      // Record to backend API
      recordPlayedTrackOnApi(track.id).catch((e) => console.warn(e));

      const audio = audioRef.current;

      if (currentTrack && currentTrack.id === track.id) {
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio
            .play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Play error:', err);
              setAudioError('Failed to play track.');
            });
        }
        return;
      }

      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.duration || 0);
      setAudioError(null);

      audio.src = track.audioUrl;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Autoplay prevented or error:', err);
          setIsPlaying(false);
        });
    },
    [currentTrack, isPlaying]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrack) {
      if (queue.length > 0) {
        playTrack(queue[0]);
      }
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Play error:', err);
          setAudioError('Playback failed. Please try again.');
        });
    }
  }, [currentTrack, isPlaying, playTrack, queue]);

  const playNext = useCallback(() => {
    if (!queue || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    let nextIndex = 0;

    if (isShuffle) {
      if (queue.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * queue.length);
        } while (nextIndex === currentIndex);
      }
    } else {
      if (currentIndex >= 0 && currentIndex < queue.length - 1) {
        nextIndex = currentIndex + 1;
      } else if (repeatMode === 'all') {
        nextIndex = 0;
      } else {
        setIsPlaying(false);
        return;
      }
    }

    const nextTrack = queue[nextIndex];
    if (nextTrack) {
      playTrack(nextTrack);
    }
  }, [queue, currentTrack, isShuffle, repeatMode, playTrack]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    if (!queue || queue.length === 0) return;

    const currentIndex = queue.findIndex((t) => t.id === currentTrack?.id);
    let prevIndex = 0;

    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * queue.length);
    } else {
      if (currentIndex > 0) {
        prevIndex = currentIndex - 1;
      } else {
        prevIndex = queue.length - 1;
      }
    }

    const prevTrack = queue[prevIndex];
    if (prevTrack) {
      playTrack(prevTrack);
    }
  }, [queue, currentTrack, isShuffle, playTrack]);

  const seekTo = useCallback((time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const changeVolume = useCallback((val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      if (!prev) {
        setPreviousVolume(volume);
        return true;
      } else {
        if (volume === 0) {
          setVolume(previousVolume || 0.5);
        }
        return false;
      }
    });
  }, [volume, previousVolume]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const next = !prev;
      showToast(next ? 'Shuffle enabled' : 'Shuffle disabled', 'info');
      return next;
    });
  }, [showToast]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') {
        showToast('Repeat all enabled', 'info');
        return 'all';
      }
      if (prev === 'all') {
        showToast('Repeat one enabled', 'info');
        return 'one';
      }
      showToast('Repeat disabled', 'info');
      return 'off';
    });
  }, [showToast]);

  // Derived arrays
  const likedTracks = likedTrackIds
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean);

  const recentlyPlayedTracks = recentlyPlayedIds
    .map((id) => tracks.find((t) => t.id === id))
    .filter(Boolean);

  const allPlaylists = [...playlists, ...customPlaylists];

  return (
    <PlayerContext.Provider
      value={{
        // Navigation
        activeTab,
        activeMeta,
        navigateTo,
        goBack,
        goForward,
        canGoBack,
        canGoForward,
        searchQuery,
        setSearchQuery,

        // Backend Connectivity
        isBackendConnected,

        // Data
        tracks,
        artists,
        categories: CATEGORIES,

        // Playback State
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffle,
        repeatMode,
        queue,
        audioError,

        // Playback Controls
        playTrack,
        togglePlay,
        playNext,
        playPrevious,
        seekTo,
        changeVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        setQueue,

        // Likes & Playlists
        likedTrackIds,
        likedTracks,
        toggleLike,
        isLiked,
        customPlaylists,
        createPlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        allPlaylists,
        recentlyPlayedTracks,

        // Feedback / Toast
        toastMessage,
        showToast,
        closeToast,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
