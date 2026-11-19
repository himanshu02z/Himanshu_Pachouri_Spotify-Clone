import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { X, Music, Sparkles } from 'lucide-react';

export default function CreatePlaylistModal({ isOpen, onClose }) {
  const { createPlaylist, navigateTo } = usePlayer();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const playlist = createPlaylist(title, description);
    setTitle('');
    setDescription('');
    onClose();
    // Navigate straight to the new playlist
    navigateTo('playlist', { playlistId: playlist.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 bg-[#282828] border border-white/10 rounded-xl shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DB954] to-emerald-700 flex items-center justify-center text-black">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Create Playlist</h2>
            <p className="text-xs text-zinc-400">Add to your custom Soundify collection</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Playlist Name <span className="text-[#1DB954]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="My Awesome Playlist"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#3e3e3e] border border-transparent focus:border-[#1DB954] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Give your playlist a catchy description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#3e3e3e] border border-transparent focus:border-[#1DB954] rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-zinc-600 disabled:cursor-not-allowed text-black font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

