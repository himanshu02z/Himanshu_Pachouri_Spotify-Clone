import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, ListMusic, Play, Trash2 } from 'lucide-react';
import { formatDuration } from '../utils/formatters';

export default function QueueDrawer({ isOpen, onClose }) {
  const { currentTrack, queue, playTrack, setQueue, showToast } = usePlayer();

  if (!isOpen) return null;

  const currentTrackIndex = queue.findIndex((t) => t.id === currentTrack?.id);
  const upNextTracks = queue.slice(currentTrackIndex + 1);

  const clearQueue = () => {
    if (currentTrack) {
      setQueue([currentTrack]);
      showToast('Queue cleared', 'info');
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-80 md:w-96 bg-[#181818] border-l border-white/10 shadow-2xl flex flex-col pb-24 md:pb-24 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-[#1DB954]" />
          <h2 className="font-bold text-white text-base">Play Queue</h2>
        </div>
        <div className="flex items-center gap-2">
          {upNextTracks.length > 0 && (
            <button
              onClick={clearQueue}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-white/5"
              title="Clear up next"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close queue"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Now Playing */}
        <div>
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
            Now Playing
          </h3>
          {currentTrack ? (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white/10">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="w-12 h-12 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-[#1DB954] truncate">
                  {currentTrack.title}
                </p>
                <p className="text-xs text-zinc-400 truncate">{currentTrack.artist}</p>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                {formatDuration(currentTrack.duration)}
              </span>
            </div>
          ) : (
            <p className="text-xs text-zinc-500">No track selected</p>
          )}
        </div>

        {/* Next in Queue */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Next In Queue ({upNextTracks.length})
            </h3>
          </div>

          {upNextTracks.length > 0 ? (
            <div className="space-y-1">
              {upNextTracks.map((track, i) => (
                <div
                  key={`${track.id}-${i}`}
                  onClick={() => playTrack(track)}
                  className="group flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate group-hover:text-[#1DB954]">
                        {track.title}
                      </p>
                      <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-zinc-500">
                      {formatDuration(track.duration)}
                    </span>
                    <button
                      className="p-1 text-zinc-400 group-hover:text-white"
                      title="Play now"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-500 text-xs">
              <p>Queue is empty.</p>
              <p className="mt-1">Add tracks from any playlist or song list!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

