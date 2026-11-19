import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  Home,
  Search,
  Library,
  PlusSquare,
  Heart,
  Music2,
  X,
  ListMusic,
  Radio,
} from 'lucide-react';
import CreatePlaylistModal from './CreatePlaylistModal';

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const {
    activeTab,
    activeMeta,
    navigateTo,
    allPlaylists,
    likedTrackIds,
    isBackendConnected,
    showToast,
  } = usePlayer();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNav = (tab, meta = null) => {
    navigateTo(tab, meta);
    if (onCloseMobile) onCloseMobile();
  };

  const currentPlaylistId = activeTab === 'playlist' ? activeMeta?.playlistId : null;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-black flex flex-col h-full select-none transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Logo & Mobile Close */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full bg-[#1DB954] flex items-center justify-center text-black shadow-lg shadow-[#1DB954]/20 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10A10 10 0 0 0 12 2zm4.586 14.424c-.18.295-.563.387-.857.208-2.35-1.435-5.308-1.76-8.793-.963-.332.076-.662-.132-.738-.464-.076-.332.132-.662.464-.738 3.812-.871 7.08-.504 9.716 1.107.294.18.386.562.208.85zm1.226-2.727c-.227.37-.714.487-1.084.26-2.69-1.654-6.79-2.134-9.972-1.168-.415.126-.856-.11-1.002-.524-.126-.415.11-.856.524-1.002 3.636-1.104 8.163-.568 11.274 1.35.37.227.487.714.26 1.084zm.106-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.018-.13-1.168-.624-.15-.494.13-1.018.624-1.168 3.533-1.072 9.404-.866 13.115 1.338.444.263.59.838.327 1.282-.263.444-.838.59-1.282.327z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-[#1DB954] transition-colors">
              Soundify
            </span>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="px-3 py-2 space-y-1">
          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-all ${
              activeTab === 'home'
                ? 'text-white bg-[#282828]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('search')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-all ${
              activeTab === 'search'
                ? 'text-white bg-[#282828]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Search</span>
          </button>

          <button
            onClick={() => handleNav('library')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-all ${
              activeTab === 'library'
                ? 'text-white bg-[#282828]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Your Library</span>
          </button>
        </div>

        {/* Playlist Actions */}
        <div className="px-3 pt-4 pb-2 space-y-1">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-all group"
          >
            <div className="w-6 h-6 rounded bg-zinc-300 text-black flex items-center justify-center group-hover:bg-white transition-colors">
              <PlusSquare className="w-4 h-4 fill-current" />
            </div>
            <span>Create Playlist</span>
          </button>

          <button
            onClick={() => handleNav('liked')}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-md font-semibold text-sm transition-all group ${
              activeTab === 'liked'
                ? 'text-white bg-[#282828]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-purple-400 flex items-center justify-center text-white shadow-sm">
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="flex-1 flex items-center justify-between">
              <span>Liked Songs</span>
              <span className="text-xs text-zinc-500">{likedTrackIds.length}</span>
            </div>
          </button>
        </div>

        {/* Separator */}
        <div className="mx-6 my-2 border-t border-white/10" />

        {/* Scrollable Playlists List */}
        <div className="flex-1 px-3 overflow-y-auto space-y-0.5">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
            Playlists
          </div>
          {allPlaylists.map((playlist) => {
            const isSelected = currentPlaylistId === playlist.id;
            return (
              <button
                key={playlist.id}
                onClick={() => handleNav('playlist', { playlistId: playlist.id })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left truncate transition-colors ${
                  isSelected
                    ? 'text-[#1DB954] font-semibold bg-[#181818]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                title={playlist.title}
              >
                <ListMusic className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{playlist.title}</span>
                {playlist.id.startsWith('custom-') && (
                  <span className="ml-auto text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">
                    Custom
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info badge */}
        <div
          onClick={() =>
            showToast(
              isBackendConnected
                ? 'Connected to Soundify Express REST API (Port 5001)'
                : 'Running in Local Cache Mode',
              'info'
            )
          }
          className="p-3.5 border-t border-white/10 bg-black/40 text-[11px] text-zinc-500 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          title="Click to check backend status"
        >
          <span className="font-medium text-zinc-400">Soundify FullStack</span>
          <span
            className={`flex items-center gap-1.5 font-semibold ${
              isBackendConnected ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {isBackendConnected ? 'API Connected' : 'Local'}
          </span>
        </div>
      </aside>

      {/* Create Playlist Modal */}
      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

