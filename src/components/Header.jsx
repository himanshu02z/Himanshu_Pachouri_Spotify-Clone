import React, { useState, useRef, useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  User,
  ExternalLink,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';

export default function Header({ onToggleMobileSidebar }) {
  const {
    activeTab,
    navigateTo,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    searchQuery,
    setSearchQuery,
    showToast,
  } = usePlayer();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (activeTab !== 'search') {
      navigateTo('search');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 md:px-8 py-3.5 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 transition-colors">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 text-zinc-300 hover:text-white rounded-full hover:bg-white/10"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Back / Forward History Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canGoBack
                ? 'bg-black/60 text-white hover:bg-black/80 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-black/30 text-zinc-600 cursor-not-allowed opacity-50'
            }`}
            title="Go back"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              canGoForward
                ? 'bg-black/60 text-white hover:bg-black/80 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-black/30 text-zinc-600 cursor-not-allowed opacity-50'
            }`}
            title="Go forward"
            aria-label="Go forward"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar - visible if activeTab === 'search' or on wider screen */}
        <div className="relative flex-1 max-w-md ml-1 md:ml-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (activeTab !== 'search') navigateTo('search');
              }}
              className="w-full pl-10 pr-9 py-2 bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#242424] text-white text-sm rounded-full border border-transparent focus:border-white/30 focus:outline-none transition-all placeholder:text-zinc-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 p-0.5 text-zinc-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => showToast('Soundify Free - Enjoy unlimited ad-free playback!', 'info')}
          className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-full bg-white text-black hover:scale-105 transition-transform"
        >
          Explore Premium
        </button>

        {/* User Profile Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1 md:pr-3 rounded-full bg-black/60 hover:bg-[#282828] text-white transition-colors border border-transparent hover:border-white/10"
            aria-label="User menu"
            aria-expanded={isProfileOpen}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1DB954] to-emerald-400 flex items-center justify-center font-bold text-xs text-black shadow-sm">
              S
            </div>
            <span className="hidden md:inline text-xs font-bold tracking-tight">Soundify</span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-[#282828] border border-white/10 rounded-lg shadow-2xl py-1 text-sm text-zinc-200 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs text-zinc-400">Signed in as</p>
                <p className="font-semibold text-white truncate">soundify.listener@local</p>
              </div>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  showToast('Account details: Soundify Mini Web Edition', 'info');
                }}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 hover:text-white transition-colors text-left"
              >
                <span>Account</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
              </button>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigateTo('liked');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors text-left"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                <span>Liked Songs</span>
              </button>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  showToast('Storage & Audio preferences are saved locally', 'info');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                <span>Settings</span>
              </button>
              <div className="border-t border-white/5 my-1" />
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  showToast('Listening in Guest Session', 'info');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/10 hover:text-white transition-colors text-left text-red-400 hover:text-red-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

