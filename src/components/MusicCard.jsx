import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause } from 'lucide-react';

export default function MusicCard({
  item,
  type = 'track', // 'track' | 'playlist' | 'artist'
  onClick,
}) {
  const { currentTrack, isPlaying, playTrack, togglePlay, navigateTo } = usePlayer();

  const isCurrentTrack = type === 'track' && currentTrack?.id === item.id;
  const isCardPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (type === 'track') {
      if (isCurrentTrack) {
        togglePlay();
      } else {
        playTrack(item);
      }
    } else if (type === 'playlist') {
      if (onClick) onClick();
      else navigateTo('playlist', { playlistId: item.id });
    } else if (type === 'artist') {
      if (onClick) onClick();
      else navigateTo('search');
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (type === 'track') {
      playTrack(item);
    } else if (type === 'playlist') {
      navigateTo('playlist', { playlistId: item.id });
    } else if (type === 'artist') {
      // Navigate to search filtered by artist or playlist
      navigateTo('search');
    }
  };

  const isArtist = type === 'artist';

  return (
    <div
      onClick={handleCardClick}
      className="group relative p-3.5 bg-[#181818] hover:bg-[#282828] rounded-lg transition-all duration-300 cursor-pointer flex flex-col shadow-md hover:shadow-xl"
    >
      {/* Cover Image Container */}
      <div className="relative mb-3.5 aspect-square w-full overflow-hidden rounded-md bg-[#242424] shadow-md">
        <img
          src={item.coverUrl || item.imageUrl}
          alt={item.title || item.name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isArtist ? 'rounded-full' : 'rounded-md'
          }`}
          loading="lazy"
        />

        {/* Floating Play Button */}
        <button
          onClick={handlePlayClick}
          className={`absolute right-2.5 bottom-2.5 w-11 h-11 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center shadow-xl shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-300 z-10 ${
            isCardPlaying
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
          }`}
          aria-label={isCardPlaying ? 'Pause' : 'Play'}
        >
          {isCardPlaying ? (
            <Pause className="w-5 h-5 fill-black text-black" />
          ) : (
            <Play className="w-5 h-5 fill-black text-black translate-x-0.5" />
          )}
        </button>
      </div>

      {/* Card Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3
            className={`font-bold text-sm tracking-tight truncate ${
              isCurrentTrack ? 'text-[#1DB954]' : 'text-white'
            }`}
            title={item.title || item.name}
          >
            {item.title || item.name}
          </h3>
          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {type === 'track' && (item.artist || 'Unknown Artist')}
            {type === 'playlist' && (item.description || `By ${item.owner || 'Soundify'}`)}
            {type === 'artist' && `${item.genre || 'Artist'} • ${item.monthlyListeners} monthly`}
          </p>
        </div>

        {type === 'track' && (
          <span className="text-[11px] text-zinc-500 mt-2 font-medium">
            {item.album}
          </span>
        )}
      </div>
    </div>
  );
}

