import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, Heart, MoreHorizontal, Plus, Trash2, ListPlus } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function SongRow({
  track,
  index,
  queueList = null,
  playlistId = null,
  showAlbum = true,
  showCover = true,
}) {
  const {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    isLiked,
    toggleLike,
    customPlaylists,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    setQueue,
    showToast,
    navigateTo,
    setSearchQuery,
  } = usePlayer();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isCurrent = currentTrack?.id === track.id;
  const isPlayingCurrent = isCurrent && isPlaying;
  const liked = isLiked(track.id);

  // Close context menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playTrack(track, queueList);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLike(track.id);
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    setQueue((prev) => [...prev, track]);
    showToast(`Added "${track.title}" to queue`, 'info');
    setIsMenuOpen(false);
  };

  const handleAddToCustomPlaylist = (e, targetPlaylistId) => {
    e.stopPropagation();
    addTrackToPlaylist(targetPlaylistId, track.id);
    setIsMenuOpen(false);
  };

  const handleRemoveFromThisPlaylist = (e) => {
    e.stopPropagation();
    if (playlistId) {
      removeTrackFromPlaylist(playlistId, track.id);
    }
    setIsMenuOpen(false);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative grid grid-cols-[16px_1fr_auto] md:grid-cols-[24px_4fr_3fr_minmax(120px,1fr)] items-center gap-4 px-3 md:px-4 py-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-sm select-none ${
        isCurrent ? 'bg-white/5' : ''
      }`}
    >
      {/* Index or Play/Pause Button or Animated Equalizer */}
      <div className="flex items-center justify-center w-5 text-zinc-400 font-medium">
        {isPlayingCurrent ? (
          <div className="group-hover:hidden flex items-end gap-[2px] h-4 w-4">
            <span className="w-1 bg-[#1DB954] animate-equalizer-1 rounded-sm" />
            <span className="w-1 bg-[#1DB954] animate-equalizer-2 rounded-sm" />
            <span className="w-1 bg-[#1DB954] animate-equalizer-3 rounded-sm" />
            <span className="w-1 bg-[#1DB954] animate-equalizer-4 rounded-sm" />
          </div>
        ) : (
          <span
            className={`group-hover:hidden text-xs md:text-sm ${
              isCurrent ? 'text-[#1DB954] font-bold' : 'text-zinc-400'
            }`}
          >
            {index}
          </span>
        )}

        <button
          className="hidden group-hover:flex items-center justify-center text-white hover:scale-110 transition-transform"
          aria-label={isPlayingCurrent ? 'Pause' : 'Play'}
          onClick={(e) => {
            e.stopPropagation();
            if (isCurrent) togglePlay();
            else playTrack(track, queueList);
          }}
        >
          {isPlayingCurrent ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Title & Artist Info */}
      <div className="flex items-center gap-3 min-w-0">
        {showCover && (
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-10 h-10 rounded object-cover shadow-sm flex-shrink-0"
            loading="lazy"
          />
        )}
        <div className="min-w-0">
          <p
            className={`font-medium truncate ${
              isCurrent ? 'text-[#1DB954]' : 'text-white group-hover:text-white'
            }`}
          >
            {track.title}
          </p>
          <p
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery(track.artist);
              navigateTo('search');
            }}
            className="text-xs text-zinc-400 truncate mt-0.5 group-hover:text-zinc-300 hover:underline cursor-pointer"
          >
            {track.artist}
          </p>
        </div>
      </div>

      {/* Album (hidden on small screens) */}
      {showAlbum && (
        <div className="hidden md:block truncate text-xs text-zinc-400 group-hover:text-zinc-300">
          {track.album}
        </div>
      )}

      {/* Duration & Like Button & Actions */}
      <div className="flex items-center justify-end gap-3 text-zinc-400 text-xs">
        {/* Heart Like Button */}
        <button
          onClick={handleLikeClick}
          className={`p-1.5 transition-transform hover:scale-110 ${
            liked
              ? 'text-[#1DB954] opacity-100'
              : 'opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-white'
          }`}
          aria-label={liked ? 'Unlike song' : 'Like song'}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-[#1DB954]' : ''}`} />
        </button>

        {/* Track Duration */}
        <span className="w-10 text-right font-mono text-zinc-400">
          {formatDuration(track.duration)}
        </span>

        {/* More Actions Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 bottom-full mb-1 w-56 bg-[#282828] border border-white/10 rounded-lg shadow-2xl py-1.5 z-40 text-xs text-zinc-200">
              <button
                onClick={handleAddToQueue}
                className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors text-left"
              >
                <ListPlus className="w-4 h-4 text-zinc-400" />
                <span>Add to queue</span>
              </button>

              {customPlaylists.length > 0 && (
                <div className="border-t border-white/5 my-1 pt-1">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                    Add to Playlist
                  </div>
                  {customPlaylists.map((pl) => (
                    <button
                      key={pl.id}
                      onClick={(e) => handleAddToCustomPlaylist(e, pl.id)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 hover:text-white text-left truncate"
                    >
                      <Plus className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="truncate">{pl.title}</span>
                    </button>
                  ))}
                </div>
              )}

              {playlistId && playlistId.startsWith('custom-') && (
                <div className="border-t border-white/5 my-1 pt-1">
                  <button
                    onClick={handleRemoveFromThisPlaylist}
                    className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove from this playlist</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

