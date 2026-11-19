import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import MusicCard from '../components/MusicCard';
import CreatePlaylistModal from '../components/CreatePlaylistModal';
import {
  Library as LibraryIcon,
  Plus,
  Heart,
  Search,
  LayoutGrid,
  List,
  Sparkles,
} from 'lucide-react';

export default function Library() {
  const {
    allPlaylists,
    likedTrackIds,
    artists,
    navigateTo,
  } = usePlayer();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'playlists' | 'artists'
  const [searchFilter, setSearchFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtered playlists
  const filteredPlaylists = allPlaylists.filter((pl) =>
    pl.title.toLowerCase().includes(searchFilter.toLowerCase())
  );

  // Filtered artists
  const filteredArtists = (artists || []).filter((a) =>
    a.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LibraryIcon className="w-7 h-7 text-[#1DB954]" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Your Library
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Filter Chips & View Toggle Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'playlists', 'artists'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-white text-black'
                  : 'bg-[#242424] text-zinc-300 hover:bg-[#333333]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Search within Library */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search library..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1 bg-[#242424] text-xs text-white rounded-full border border-transparent focus:border-white/20 focus:outline-none placeholder:text-zinc-500 w-32 sm:w-44"
            />
          </div>

          {/* Grid / List Mode */}
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-1.5 text-zinc-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            title={`Switch to ${viewMode === 'grid' ? 'List' : 'Grid'} view`}
          >
            {viewMode === 'grid' ? (
              <List className="w-4 h-4" />
            ) : (
              <LayoutGrid className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {/* Liked Songs Banner Card (if all or playlists) */}
        {(activeFilter === 'all' || activeFilter === 'playlists') && (
          <div
            onClick={() => navigateTo('liked')}
            className="group relative flex items-center p-4 bg-gradient-to-r from-indigo-900/80 via-purple-900/40 to-[#181818] hover:to-[#222222] border border-white/5 rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-xl"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Heart className="w-8 h-8 fill-white" />
            </div>
            <div className="ml-4 min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                Collection
              </span>
              <h3 className="font-extrabold text-base sm:text-xl text-white truncate">
                Liked Songs
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {likedTrackIds.length} liked {likedTrackIds.length === 1 ? 'song' : 'songs'}
              </p>
            </div>
          </div>
        )}

        {/* Playlists */}
        {(activeFilter === 'all' || activeFilter === 'playlists') && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
            {filteredPlaylists.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredPlaylists.map((pl) => (
                    <MusicCard key={pl.id} item={pl} type="playlist" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredPlaylists.map((pl) => (
                    <div
                      key={pl.id}
                      onClick={() => navigateTo('playlist', { playlistId: pl.id })}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={pl.coverUrl}
                          alt={pl.title}
                          className="w-12 h-12 rounded object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{pl.title}</p>
                          <p className="text-xs text-zinc-400 truncate">
                            Playlist • {pl.owner || 'Soundify'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-zinc-500">
                        {pl.trackIds?.length || 0} songs
                      </span>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <p className="text-sm text-zinc-500">No playlists matching "{searchFilter}"</p>
            )}
          </section>
        )}

        {/* Artists */}
        {(activeFilter === 'all' || activeFilter === 'artists') && (
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Artists</h2>
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredArtists.map((artist) => (
                  <MusicCard key={artist.id} item={artist} type="artist" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No artists matching "{searchFilter}"</p>
            )}
          </section>
        )}
      </div>

      <CreatePlaylistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

