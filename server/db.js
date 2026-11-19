import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_DB } from './data/defaultData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Ensure database file exists
function initDb() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
  }
}

initDb();

export function getDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning default:', err);
    return DEFAULT_DB;
  }
}

export function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

// SONGS
export function getAllTracks() {
  const db = getDb();
  return db.tracks || [];
}

export function getTrackById(id) {
  const tracks = getAllTracks();
  return tracks.find((t) => t.id === id) || null;
}

export function searchTracks(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return getAllTracks();
  return getAllTracks().filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.artist.toLowerCase().includes(q) ||
      t.album.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q)
  );
}

// ARTISTS
export function getAllArtists() {
  const db = getDb();
  return db.artists || [];
}

export function getArtistById(id) {
  const artists = getAllArtists();
  return artists.find((a) => a.id === id) || null;
}

// PLAYLISTS
export function getAllPlaylists() {
  const db = getDb();
  return db.playlists || [];
}

export function getPlaylistById(id) {
  const playlists = getAllPlaylists();
  return playlists.find((p) => p.id === id) || null;
}

export function createPlaylist({ title, description, coverUrl, gradient }) {
  const db = getDb();
  const newPlaylist = {
    id: `playlist-${Date.now()}`,
    title: (title || 'New Playlist').trim(),
    description: (description || 'Created by you.').trim(),
    owner: 'You',
    coverUrl:
      coverUrl ||
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    gradient: gradient || 'from-emerald-800 via-zinc-900 to-[#121212]',
    trackIds: [],
    createdAt: new Date().toISOString(),
  };

  db.playlists = [newPlaylist, ...(db.playlists || [])];
  saveDb(db);
  return newPlaylist;
}

export function updatePlaylist(id, updates) {
  const db = getDb();
  const index = (db.playlists || []).findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.playlists[index] = {
    ...db.playlists[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveDb(db);
  return db.playlists[index];
}

export function deletePlaylist(id) {
  const db = getDb();
  const beforeCount = (db.playlists || []).length;
  db.playlists = (db.playlists || []).filter((p) => p.id !== id);
  saveDb(db);
  return db.playlists.length < beforeCount;
}

export function addTrackToPlaylist(playlistId, trackId) {
  const db = getDb();
  const playlist = (db.playlists || []).find((p) => p.id === playlistId);
  if (!playlist) return null;

  if (!playlist.trackIds) playlist.trackIds = [];
  if (!playlist.trackIds.includes(trackId)) {
    playlist.trackIds.push(trackId);
    saveDb(db);
  }
  return playlist;
}

export function removeTrackFromPlaylist(playlistId, trackId) {
  const db = getDb();
  const playlist = (db.playlists || []).find((p) => p.id === playlistId);
  if (!playlist) return null;

  if (playlist.trackIds) {
    playlist.trackIds = playlist.trackIds.filter((id) => id !== trackId);
    saveDb(db);
  }
  return playlist;
}

// LIKES
export function getLikedTrackIds() {
  const db = getDb();
  return db.likedTrackIds || [];
}

export function toggleLike(trackId) {
  const db = getDb();
  let liked = db.likedTrackIds || [];
  let isNowLiked = false;

  if (liked.includes(trackId)) {
    liked = liked.filter((id) => id !== trackId);
    isNowLiked = false;
  } else {
    liked = [trackId, ...liked];
    isNowLiked = true;
  }

  db.likedTrackIds = liked;
  saveDb(db);
  return { trackId, isLiked: isNowLiked, likedTrackIds: liked };
}

// RECENTLY PLAYED
export function getRecentlyPlayedIds() {
  const db = getDb();
  return db.recentlyPlayedIds || [];
}

export function addRecentlyPlayed(trackId) {
  const db = getDb();
  let recents = (db.recentlyPlayedIds || []).filter((id) => id !== trackId);
  recents = [trackId, ...recents.slice(0, 19)];
  db.recentlyPlayedIds = recents;
  saveDb(db);
  return recents;
}

// CATEGORIES
export function getAllCategories() {
  const db = getDb();
  return db.categories || [];
}

