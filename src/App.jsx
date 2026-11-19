import React, { useState, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import Toast from './components/Toast';

import Home from './views/Home';
import Search from './views/Search';
import PlaylistView from './views/PlaylistView';
import LikedSongs from './views/LikedSongs';
import Library from './views/Library';

import { Home as HomeIcon, Search as SearchIcon, Library as LibraryIcon } from 'lucide-react';

function MainLayout() {
  const { activeTab, navigateTo, togglePlay, playNext, playPrevious, toggleMute } = usePlayer();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in input or textarea
      if (
        ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) ||
        document.activeElement?.isContentEditable
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'ArrowRight') {
        e.preventDefault();
        playNext();
      } else if ((e.ctrlKey || e.metaKey) && e.code === 'ArrowLeft') {
        e.preventDefault();
        playPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleMute, playNext, playPrevious]);

  // Render active view
  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'search':
        return <Search />;
      case 'playlist':
        return <PlaylistView />;
      case 'liked':
        return <LikedSongs />;
      case 'library':
        return <Library />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#121212] text-white select-none">
      {/* Top Main Section (Sidebar + Scrollable Content) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#121212] overflow-hidden relative">
          <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />

          <main className="flex-1 overflow-y-auto px-4 md:px-8 py-4 pb-28 md:pb-28">
            <div className="max-w-7xl mx-auto">{renderView()}</div>
          </main>
        </div>
      </div>

      {/* Bottom Player */}
      <MusicPlayer />

      {/* Mobile Bottom Tab Bar (Spotify mobile style for easy thumb access) */}
      <nav className="md:hidden fixed bottom-20 left-0 right-0 z-20 h-12 bg-black/95 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 text-zinc-400">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
            activeTab === 'home' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <HomeIcon className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('search')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
            activeTab === 'search' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <SearchIcon className="w-4 h-4" />
          <span>Search</span>
        </button>

        <button
          onClick={() => navigateTo('library')}
          className={`flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
            activeTab === 'library' || activeTab === 'liked' ? 'text-white' : 'text-zinc-400'
          }`}
        >
          <LibraryIcon className="w-4 h-4" />
          <span>Library</span>
        </button>
      </nav>

      {/* Global Notification Toast */}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <MainLayout />
    </PlayerProvider>
  );
}

