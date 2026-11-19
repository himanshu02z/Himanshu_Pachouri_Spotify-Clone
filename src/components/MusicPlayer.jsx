import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  ListMusic,
  AlertTriangle,
  Maximize2,
} from 'lucide-react';
import { formatDuration } from '../utils/formatters';
import QueueDrawer from './QueueDrawer';

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    audioError,
    togglePlay,
    playNext,
    playPrevious,
    seekTo,
    changeVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    toggleLike,
    showToast,
    navigateTo,
    setSearchQuery,
  } = usePlayer();

  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

  const liked = currentTrack ? isLiked(currentTrack.id) : false;

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    changeVolume(newVol);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVolumePercent = isMuted ? 0 : volume * 100;

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-30 h-20 md:h-24 bg-[#181818] border-t border-[#282828] px-3 md:px-5 flex items-center justify-between text-white select-none shadow-2xl">
        {/* Audio Error Alert Banner */}
        {audioError && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-red-600/90 text-white text-xs rounded-t-md flex items-center gap-2 shadow-lg backdrop-blur-sm animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{audioError}</span>
          </div>
        )}

        {/* LEFT: Current Track Details */}
        <div className="flex items-center gap-3 w-1/4 min-w-[140px] md:min-w-[200px]">
          {currentTrack ? (
            <>
              <div className="relative group/cover flex-shrink-0">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover shadow-md"
                />
              </div>

              <div className="min-w-0 flex flex-col justify-center">
                <span
                  onClick={() => {
                    setSearchQuery(currentTrack.title);
                    navigateTo('search');
                  }}
                  className="text-xs md:text-sm font-semibold truncate hover:underline cursor-pointer text-white"
                  title={currentTrack.title}
                >
                  {currentTrack.title}
                </span>
                <span
                  onClick={() => {
                    setSearchQuery(currentTrack.artist);
                    navigateTo('search');
                  }}
                  className="text-[11px] md:text-xs text-zinc-400 truncate hover:underline cursor-pointer hover:text-white"
                  title={currentTrack.artist}
                >
                  {currentTrack.artist}
                </span>
              </div>

              {/* Heart Favourite Button */}
              <button
                onClick={() => toggleLike(currentTrack.id)}
                className={`p-1.5 ml-1 transition-transform hover:scale-115 ${
                  liked
                    ? 'text-[#1DB954]'
                    : 'text-zinc-400 hover:text-white'
                }`}
                aria-label={liked ? 'Remove from liked' : 'Save to liked'}
              >
                <Heart className={`w-4 h-4 md:w-5 md:h-5 ${liked ? 'fill-[#1DB954]' : ''}`} />
              </button>
            </>
          ) : (
            <div className="text-xs text-zinc-500">No track selected</div>
          )}
        </div>

        {/* CENTER: Playback Controls & Progress Scrubber */}
        <div className="flex flex-col items-center max-w-[45%] md:max-w-xl w-full px-2">
          {/* Main Controls Row */}
          <div className="flex items-center gap-3 md:gap-6 mb-1.5">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`relative p-1.5 transition-colors hidden sm:block ${
                isShuffle
                  ? 'text-[#1DB954]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
              aria-label="Toggle shuffle"
            >
              <Shuffle className="w-4 h-4" />
              {isShuffle && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />
              )}
            </button>

            {/* Previous */}
            <button
              onClick={playPrevious}
              className="text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
              title="Previous (Ctrl + Left)"
              aria-label="Previous song"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play / Pause Primary Button */}
            <button
              onClick={togglePlay}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 shadow-lg transition-transform"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 fill-black" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 fill-black translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              className="text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
              title="Next (Ctrl + Right)"
              aria-label="Next song"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`relative p-1.5 transition-colors hidden sm:block ${
                repeatMode !== 'off'
                  ? 'text-[#1DB954]'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
              aria-label="Toggle repeat"
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              {repeatMode !== 'off' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />
              )}
            </button>
          </div>

          {/* Progress Bar & Timestamps */}
          <div
            className="w-full flex items-center gap-2 text-[11px] font-mono text-zinc-400 group"
            onMouseEnter={() => setIsHoveringProgress(true)}
            onMouseLeave={() => setIsHoveringProgress(false)}
          >
            <span className="w-8 text-right select-none">{formatDuration(currentTime)}</span>

            <div className="relative flex-1 flex items-center h-4 cursor-pointer">
              {/* Background Track */}
              <div className="w-full h-1 bg-zinc-600 rounded-full overflow-hidden">
                {/* Filled Progress */}
                <div
                  className={`h-full rounded-full transition-colors ${
                    isHoveringProgress ? 'bg-[#1DB954]' : 'bg-white'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Range Input on top for seeking */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Track progress"
              />
            </div>

            <span className="w-8 text-left select-none">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* RIGHT: Queue, Volume & Extra Controls */}
        <div className="flex items-center justify-end gap-2 md:gap-3 w-1/4 min-w-[120px]">
          {/* Queue Button */}
          <button
            onClick={() => setIsQueueOpen((prev) => !prev)}
            className={`p-1.5 rounded hover:bg-white/5 transition-colors ${
              isQueueOpen ? 'text-[#1DB954]' : 'text-zinc-400 hover:text-white'
            }`}
            title="Play Queue"
            aria-label="Toggle queue"
          >
            <ListMusic className="w-4 h-4 md:w-5 md:h-5" />
          </button>

          {/* Volume Control */}
          <div
            className="flex items-center gap-1.5 group/vol"
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
          >
            <button
              onClick={toggleMute}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label="Mute toggle"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </button>

            {/* Volume Slider Bar */}
            <div className="relative w-16 md:w-24 h-4 flex items-center cursor-pointer">
              <div className="w-full h-1 bg-zinc-600 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-colors ${
                    isHoveringVolume ? 'bg-[#1DB954]' : 'bg-white'
                  }`}
                  style={{ width: `${currentVolumePercent}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Volume slider"
              />
            </div>
          </div>
        </div>
      </footer>

      {/* Queue Drawer */}
      <QueueDrawer isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </>
  );
}

