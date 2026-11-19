import React, { useState, useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { CATEGORIES } from '../data/musicData';
import SongRow from '../components/SongRow';
import MusicCard from '../components/MusicCard';
import { Search as SearchIcon, Play, Pause, Frown, Sparkles } from 'lucide-react';

export default function Search() {
  const {
    searchQuery,
    setSearchQuery,
    allPlaylists,
    tracks,
    artists,
    playTrack,
    currentTrack,
    isPlaying,
    togglePlay,
    navigateTo,
  } = usePlayer();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'songs' | 'artists' | 'playlists'

  // Filtered matching elements
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { songs: [], artists: [], playlists: [], topResult: null };
    }

    const matchedSongs = (tracks || []).filter(
      (track) =>
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q) ||
        track.genre.toLowerCase().includes(q)
    );

    const matchedArtists = (artists || []).filter(
      (artist) =>
        artist.name.toLowerCase().includes(q) ||
        artist.genre.toLowerCase().includes(q)
    );

    const matchedPlaylists = allPlaylists.filter(
      (pl) =>
        pl.title.toLowerCase().includes(q) ||
        pl.description.toLowerCase().includes(q)
    );

    // Pick top result: prioritize exact artist match or first song
    let top = null;
    const exactArtist = matchedArtists.find((a) => a.name.toLowerCase() === q);
    if (exactArtist) {
      top = { item: exactArtist, type: 'artist' };
    } else if (matchedSongs.length > 0) {
      top = { item: matchedSongs[0], type: 'track' };
    } else if (matchedArtists.length > 0) {
      top = { item: matchedArtists[0], type: 'artist' };
    } else if (matchedPlaylists.length > 0) {
      top = { item: matchedPlaylists[0], type: 'playlist' };
    }

    return {
      songs: matchedSongs,
      artists: matchedArtists,
      playlists: matchedPlaylists,
      topResult: top,
    };
  }, [searchQuery, allPlaylists]);

  const hasResults =
    searchResults.songs.length > 0 ||
    searchResults.artists.length > 0 ||
    searchResults.playlists.length > 0;

  const isQueryActive = searchQuery.trim().length > 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Filter Tabs when query is present */}
      {isQueryActive && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'songs', 'artists', 'playlists'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
                activeFilter === filter
                  ? 'bg-white text-black'
                  : 'bg-[#282828] text-white hover:bg-[#383838]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* No Query: Browse All Categories */}
      {!isQueryActive && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Browse All
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSearchQuery(cat.title)}
                className={`relative h-44 md:h-52 rounded-xl p-4 overflow-hidden cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${cat.color}`}
              >
                <h3 className="font-extrabold text-xl md:text-2xl text-white tracking-tight z-10 relative">
                  {cat.title}
                </h3>
                <img
                  src={cat.coverUrl}
                  alt={cat.title}
                  className="absolute -right-4 -bottom-4 w-28 h-28 md:w-32 md:h-32 object-cover rounded-md rotate-[25deg] shadow-2xl transition-transform group-hover:rotate-[30deg]"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Query with Results */}
      {isQueryActive && hasResults && (
        <div className="space-y-8">
          {/* Top Result + Top Songs (when 'all' or 'songs') */}
          {(activeFilter === 'all' || activeFilter === 'songs') && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
              {/* Top Result Card */}
              {searchResults.topResult && activeFilter === 'all' && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-3">Top Result</h2>
                  <div className="group relative p-5 bg-[#181818] hover:bg-[#282828] rounded-xl transition-all duration-300 shadow-xl cursor-pointer">
                    <div className="relative mb-4 w-24 h-24">
                      <img
                        src={
                          searchResults.topResult.item.coverUrl ||
                          searchResults.topResult.item.imageUrl
                        }
                        alt="Top result"
                        className={`w-full h-full object-cover shadow-lg ${
                          searchResults.topResult.type === 'artist'
                            ? 'rounded-full'
                            : 'rounded-lg'
                        }`}
                      />
                    </div>
                    <h3 className="text-2xl font-extrabold text-white truncate tracking-tight">
                      {searchResults.topResult.item.title ||
                        searchResults.topResult.item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-black/40 text-zinc-300">
                        {searchResults.topResult.type}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {searchResults.topResult.type === 'track' &&
                          searchResults.topResult.item.artist}
                        {searchResults.topResult.type === 'artist' &&
                          `${searchResults.topResult.item.monthlyListeners} monthly listeners`}
                        {searchResults.topResult.type === 'playlist' &&
                          searchResults.topResult.item.description}
                      </span>
                    </div>

                    {/* Play Button */}
                    <button
                      onClick={() => {
                        if (searchResults.topResult.type === 'track') {
                          if (currentTrack?.id === searchResults.topResult.item.id) {
                            togglePlay();
                          } else {
                            playTrack(searchResults.topResult.item);
                          }
                        } else if (searchResults.topResult.type === 'playlist') {
                          navigateTo('playlist', {
                            playlistId: searchResults.topResult.item.id,
                          });
                        }
                      }}
                      className="absolute right-5 bottom-5 w-12 h-12 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all shadow-xl"
                      aria-label="Play top result"
                    >
                      {searchResults.topResult.type === 'track' &&
                      currentTrack?.id === searchResults.topResult.item.id &&
                      isPlaying ? (
                        <Pause className="w-5 h-5 fill-black" />
                      ) : (
                        <Play className="w-5 h-5 fill-black translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Songs List */}
              {searchResults.songs.length > 0 && (
                <div className={activeFilter === 'songs' ? 'lg:col-span-2' : ''}>
                  <h2 className="text-xl font-bold text-white mb-3">Songs</h2>
                  <div className="space-y-1">
                    {(activeFilter === 'songs'
                      ? searchResults.songs
                      : searchResults.songs.slice(0, 4)
                    ).map((song, i) => (
                      <SongRow
                        key={song.id}
                        track={song}
                        index={i + 1}
                        queueList={searchResults.songs}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Artists Match */}
          {(activeFilter === 'all' || activeFilter === 'artists') &&
            searchResults.artists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-3">Artists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.artists.map((artist) => (
                    <MusicCard key={artist.id} item={artist} type="artist" />
                  ))}
                </div>
              </section>
            )}

          {/* Playlists Match */}
          {(activeFilter === 'all' || activeFilter === 'playlists') &&
            searchResults.playlists.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-white mb-3">Playlists</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {searchResults.playlists.map((playlist) => (
                    <MusicCard key={playlist.id} item={playlist} type="playlist" />
                  ))}
                </div>
              </section>
            )}
        </div>
      )}

      {/* Query with NO Results - Empty State */}
      {isQueryActive && !hasResults && (
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#282828] flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
            <Frown className="w-8 h-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            No results found for "{searchQuery}"
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Please make sure your words are spelled correctly, or try searching for a
            different artist, song title, or genre.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-6 px-5 py-2.5 rounded-full bg-white text-black font-semibold text-xs hover:scale-105 active:scale-95 transition-transform"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

