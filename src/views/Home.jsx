import React from 'react';
import { usePlayer } from '../context/PlayerContext';
import { TRACKS, PLAYLISTS, ARTISTS } from '../data/musicData';
import MusicCard from '../components/MusicCard';
import { Play, Pause, Heart, Sparkles, TrendingUp } from 'lucide-react';

export default function Home() {
  const {
    navigateTo,
    playTrack,
    currentTrack,
    isPlaying,
    recentlyPlayedTracks,
    allPlaylists,
    likedTrackIds,
    setSearchQuery,
    tracks,
    artists,
  } = usePlayer();

  // Dynamic greeting based on user's current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Quick 6 top cards
  const quickAccessItems = [
    {
      id: 'liked',
      type: 'liked',
      title: 'Liked Songs',
      count: likedTrackIds.length,
      gradient: 'from-indigo-700 to-purple-800',
    },
    ...allPlaylists.slice(0, 5).map((pl) => ({
      id: pl.id,
      type: 'playlist',
      title: pl.title,
      coverUrl: pl.coverUrl,
      playlist: pl,
    })),
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Greeting Banner */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-5">
          {getGreeting()}
        </h1>

        {/* Top 6 Quick Access Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickAccessItems.map((item) => {
            if (item.type === 'liked') {
              return (
                <div
                  key="liked-card"
                  onClick={() => navigateTo('liked')}
                  className="group relative flex items-center bg-[#282828]/60 hover:bg-[#282828] rounded-md overflow-hidden cursor-pointer transition-all shadow-md hover:shadow-lg"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-600 to-purple-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <Heart className="w-7 h-7 fill-white" />
                  </div>
                  <div className="flex-1 px-4 min-w-0">
                    <h3 className="font-bold text-sm md:text-base text-white truncate">
                      Liked Songs
                    </h3>
                    <p className="text-xs text-zinc-400">{item.count} songs</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('liked');
                    }}
                    className="mr-4 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all shadow-xl"
                    aria-label="Open Liked Songs"
                  >
                    <Play className="w-5 h-5 fill-black translate-x-0.5" />
                  </button>
                </div>
              );
            }

            return (
              <div
                key={item.id}
                onClick={() => navigateTo('playlist', { playlistId: item.id })}
                className="group relative flex items-center bg-[#282828]/60 hover:bg-[#282828] rounded-md overflow-hidden cursor-pointer transition-all shadow-md hover:shadow-lg"
              >
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover flex-shrink-0"
                />
                <div className="flex-1 px-4 min-w-0">
                  <h3 className="font-bold text-sm md:text-base text-white truncate">
                    {item.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('playlist', { playlistId: item.id });
                  }}
                  className="mr-4 w-10 h-10 rounded-full bg-[#1DB954] text-black flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 active:scale-95 transition-all shadow-xl"
                  aria-label={`Open ${item.title}`}
                >
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recently Played Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight hover:underline cursor-pointer">
            Recently Played
          </h2>
          <button
            onClick={() => navigateTo('library')}
            className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
          >
            Show All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {(recentlyPlayedTracks.length > 0 ? recentlyPlayedTracks.slice(0, 6) : tracks.slice(0, 6)).map(
            (track) => (
              <MusicCard key={track.id} item={track} type="track" />
            )
          )}
        </div>
      </section>

      {/* Made For You - Playlists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Made For You
            </h2>
          </div>
          <button
            onClick={() => navigateTo('library')}
            className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
          >
            Show All
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
          {allPlaylists.slice(0, 5).map((playlist) => (
            <MusicCard key={playlist.id} item={playlist} type="playlist" />
          ))}
        </div>
      </section>

      {/* Trending Songs */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#1DB954]" />
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Trending Songs
            </h2>
          </div>
          <button
            onClick={() => navigateTo('search')}
            className="text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider"
          >
            Explore
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {tracks.slice(0, 6).map((track) => (
            <MusicCard key={`trend-${track.id}`} item={track} type="track" />
          ))}
        </div>
      </section>

      {/* Popular Artists */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Popular Artists
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <MusicCard
              key={artist.id}
              item={artist}
              type="artist"
              onClick={() => {
                setSearchQuery(artist.name);
                navigateTo('search');
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

