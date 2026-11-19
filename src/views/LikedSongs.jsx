import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import SongRow from '../components/SongRow';
import { Play, Pause, Heart, Clock, Sparkles } from 'lucide-react';

export default function LikedSongs() {
  const {
    likedTracks,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    navigateTo,
  } = usePlayer();

  const isLikedActive =
    likedTracks.some((t) => t.id === currentTrack?.id) && isPlaying;

  const totalDurationSeconds = likedTracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMinutes = Math.floor(totalDurationSeconds / 60);

  const handlePlayLiked = () => {
    if (likedTracks.length === 0) return;
    if (isLikedActive) {
      togglePlay();
    } else {
      const trackToPlay = likedTracks.find((t) => t.id === currentTrack?.id) || likedTracks[0];
      playTrack(trackToPlay, likedTracks);
    }
  };

  return (
    <div className="-mx-4 md:-mx-8 -mt-3.5 space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-b from-indigo-800 via-purple-950 to-[#121212] px-6 md:px-8 pt-10 md:pt-16 pb-6 shadow-2xl transition-all">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 max-w-7xl mx-auto">
          {/* Big Heart Square Icon */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-2xl flex-shrink-0">
            <Heart className="w-24 h-24 sm:w-28 sm:h-28 fill-white drop-shadow-md" />
          </div>

          {/* Details */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <span className="text-xs uppercase font-extrabold tracking-widest text-white/80">
              Playlist
            </span>
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mt-1 mb-3">
              Liked Songs
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-medium text-white/90">
              <span className="font-bold text-white">Soundify Listener</span>
              <span>•</span>
              <span>
                {likedTracks.length} {likedTracks.length === 1 ? 'song' : 'songs'}
              </span>
              {totalMinutes > 0 && (
                <>
                  <span>•</span>
                  <span className="text-zinc-300">{totalMinutes} min</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-8 max-w-7xl mx-auto">
        {likedTracks.length > 0 ? (
          <>
            {/* Play Button Row */}
            <div className="py-2">
              <button
                onClick={handlePlayLiked}
                className="w-14 h-14 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all"
                aria-label={isLikedActive ? 'Pause liked songs' : 'Play liked songs'}
              >
                {isLikedActive ? (
                  <Pause className="w-7 h-7 fill-black" />
                ) : (
                  <Play className="w-7 h-7 fill-black translate-x-0.5" />
                )}
              </button>
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

            {/* List */}
            <div className="mt-2 space-y-0.5">
              {likedTracks.map((track, i) => (
                <SongRow
                  key={track.id}
                  track={track}
                  index={i + 1}
                  queueList={likedTracks}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#282828] flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
              Songs you like will appear here
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Save songs by tapping the heart icon in the music player, search results, or
              any album view.
            </p>
            <button
              onClick={() => navigateTo('search')}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:scale-105 active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-[#1DB954]" />
              <span>Find Songs</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

