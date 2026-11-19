import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongRow from '../components/SongRow';
import {
  Play,
  Pause,
  Clock,
  Heart,
  MoreHorizontal,
  Search,
  Music,
  Plus,
} from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function PlaylistView() {
  const {
    activeMeta,
    allPlaylists,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    addTrackToPlaylist,
    showToast,
    tracks,
  } = usePlayer();

  const [playlistSearch, setPlaylistSearch] = useState('');
  const [isSavedPlaylist, setIsSavedPlaylist] = useState(false);

  const playlistId = activeMeta?.playlistId || 'playlist-1';
  const playlist = allPlaylists.find((p) => p.id === playlistId) || allPlaylists[0];

  // Resolve tracks for this playlist
  const playlistTracks = (playlist.trackIds || [])
    .map((id) => (tracks || []).find((t) => t.id === id))
    .filter(Boolean);

  // Filtered by internal playlist search
  const displayedTracks = playlistSearch.trim()
    ? playlistTracks.filter(
        (t) =>
          t.title.toLowerCase().includes(playlistSearch.toLowerCase()) ||
          t.artist.toLowerCase().includes(playlistSearch.toLowerCase()) ||
          t.album.toLowerCase().includes(playlistSearch.toLowerCase())
      )
    : playlistTracks;

  // Calculate total playlist duration
  const totalDurationSeconds = playlistTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  // Check if current playlist is currently playing
  const isPlaylistActive =
    playlistTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const handlePlayPlaylist = () => {
    if (playlistTracks.length === 0) {
      showToast('Playlist has no tracks yet. Add some below!', 'info');
      return;
    }

    if (isPlaylistActive) {
      togglePlay();
    } else {
      // Start from first track or currently playing track if already in list
      const trackToPlay = playlistTracks.find((t) => t.id === currentTrack?.id) || playlistTracks[0];
      playTrack(trackToPlay, playlistTracks);
    }
  };

  const handleToggleSavePlaylist = () => {
    setIsSavedPlaylist((prev) => {
      const next = !prev;
      showToast(
        next ? `Saved "${playlist.title}" to your library` : `Removed "${playlist.title}" from your library`,
        'info'
      );
      return next;
    });
  };

  // Recommended tracks to add if custom playlist
  const nonPlaylistTracks = (tracks || []).filter(
    (t) => !playlist.trackIds?.includes(t.id)
  );

  return (
    <div className="-mx-4 md:-mx-8 -mt-3.5 space-y-6 pb-16">
      {/* Header Banner with Rich Gradient */}
      <div
        className={`bg-gradient-to-b ${
          playlist.gradient || 'from-emerald-800 via-zinc-900 to-[#121212]'
        } px-6 md:px-8 pt-10 md:pt-16 pb-6 shadow-2xl transition-all duration-300`}
      >
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 max-w-7xl mx-auto">
          {/* Cover Art */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg overflow-hidden shadow-2xl flex-shrink-0 bg-[#282828] border border-white/10 group">
            <img
              src={playlist.coverUrl}
              alt={playlist.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Playlist Metadata */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
              {playlist.id.startsWith('custom-') ? 'Custom Playlist' : 'Playlist'}
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mt-1 mb-3 line-clamp-2">
              {playlist.title}
            </h1>
            <p className="text-sm text-zinc-300 max-w-2xl mb-4 line-clamp-2">
              {playlist.description}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-medium text-white/90">
              <span className="font-bold text-white">{playlist.owner || 'Soundify'}</span>
              <span>•</span>
              <span>{playlistTracks.length} {playlistTracks.length === 1 ? 'song' : 'songs'}</span>
              {totalMinutes > 0 && (
                <>
                  <span>•</span>
                  <span className="text-zinc-300">about {totalMinutes} min</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-6 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-6">
            {/* Primary Big Green Play Button */}
            <button
              onClick={handlePlayPlaylist}
              className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlaylistActive ? 'Pause playlist' : 'Play playlist'}
            >
              {isPlaylistActive ? (
                <Pause className="w-7 h-7 fill-black" />
              ) : (
                <Play className="w-7 h-7 fill-black translate-x-0.5" />
              )}
            </button>

            {/* Save / Like Playlist */}
            <button
              onClick={handleToggleSavePlaylist}
              className={`p-2 transition-transform hover:scale-110 ${
                isSavedPlaylist ? 'text-[#1DB954]' : 'text-zinc-400 hover:text-white'
              }`}
              title="Save to Your Library"
              aria-label="Save to Your Library"
            >
              <Heart className={`w-8 h-8 ${isSavedPlaylist ? 'fill-[#1DB954]' : ''}`} />
            </button>

            {/* Options */}
            <button
              onClick={() => showToast(`Playlist link copied to clipboard`, 'info')}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
              title="More options"
              aria-label="More options"
            >
              <MoreHorizontal className="w-7 h-7" />
            </button>
          </div>

          {/* Search within playlist */}
          {playlistTracks.length > 0 && (
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Find in playlist..."
                value={playlistSearch}
                onChange={(e) => setPlaylistSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#282828] text-xs text-white rounded-full border border-transparent focus:border-white/20 focus:outline-none placeholder:text-zinc-500"
              />
            </div>
          )}
        </div>

        {/* Songs Table Header */}
        <div className="grid grid-cols-[16px_1fr_auto] md:grid-cols-[24px_4fr_3fr_minmax(120px,1fr)] items-center gap-4 px-3 md:px-4 py-3 mt-4 border-b border-white/10 text-xs font-semibold text-zinc-400 uppercase tracking-wider select-none">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block">Album</div>
          <div className="flex items-center justify-end pr-8">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Tracks List */}
        {displayedTracks.length > 0 ? (
          <div className="mt-2 space-y-0.5">
            {displayedTracks.map((track, i) => (
              <SongRow
                key={`${track.id}-${i}`}
                track={track}
                index={i + 1}
                queueList={playlistTracks}
                playlistId={playlist.id}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400">
            <Music className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
            {playlistSearch ? (
              <p>No songs found matching "{playlistSearch}"</p>
            ) : (
              <div>
                <h3 className="font-bold text-lg text-white mb-1">It's a bit empty here</h3>
                <p className="text-xs text-zinc-400">Add some songs to get the party started!</p>
              </div>
            )}
          </div>
        )}

        {/* Recommended Songs to add (especially helpful for custom playlists) */}
        {nonPlaylistTracks.length > 0 && (
          <div className="mt-14 pt-8 border-t border-white/10">
            <h3 className="text-lg font-bold text-white mb-1">Recommended Songs</h3>
            <p className="text-xs text-zinc-400 mb-4">Based on what's in this playlist</p>
            <div className="space-y-2">
              {nonPlaylistTracks.slice(0, 4).map((track) => (
                <div
                  key={`rec-${track.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#181818] hover:bg-[#282828] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{track.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                      {formatDuration(track.duration)}
                    </span>
                    <button
                      onClick={() => addTrackToPlaylist(playlist.id, track.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/20 hover:border-white text-xs font-semibold text-white hover:scale-105 active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

