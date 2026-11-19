import express from 'express';
import {
  getAllTracks,
  getTrackById,
  searchTracks,
  getAllArtists,
  getArtistById,
  getAllPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  getLikedTrackIds,
  toggleLike,
  getRecentlyPlayedIds,
  addRecentlyPlayed,
  getAllCategories,
} from '../db.js';

const router = express.Router();

// GET /api/health
router.get('/health', (req, res) => {
  const tracks = getAllTracks();
  const playlists = getAllPlaylists();
  const artists = getAllArtists();

  res.json({
    status: 'ok',
    service: 'Soundify Backend API',
    version: '1.0.0',
    uptime: process.uptime(),
    stats: {
      totalSongs: tracks.length,
      totalPlaylists: playlists.length,
      totalArtists: artists.length,
    },
  });
});

// GET /api/songs
router.get('/songs', (req, res) => {
  const { search, genre, limit } = req.query;
  let tracks = search ? searchTracks(search) : getAllTracks();

  if (genre) {
    tracks = tracks.filter(
      (t) => t.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  if (limit) {
    tracks = tracks.slice(0, parseInt(limit, 10));
  }

  res.json({ success: true, count: tracks.length, data: tracks });
});

// GET /api/songs/:id
router.get('/songs/:id', (req, res) => {
  const track = getTrackById(req.params.id);
  if (!track) {
    return res.status(404).json({ success: false, error: 'Song not found' });
  }
  res.json({ success: true, data: track });
});

// GET /api/artists
router.get('/artists', (req, res) => {
  const artists = getAllArtists();
  res.json({ success: true, count: artists.length, data: artists });
});

// GET /api/artists/:id
router.get('/artists/:id', (req, res) => {
  const artist = getArtistById(req.params.id);
  if (!artist) {
    return res.status(404).json({ success: false, error: 'Artist not found' });
  }

  const allTracks = getAllTracks();
  const tracks = (artist.trackIds || [])
    .map((tid) => allTracks.find((t) => t.id === tid))
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...artist,
      tracks,
    },
  });
});

// GET /api/playlists
router.get('/playlists', (req, res) => {
  const playlists = getAllPlaylists();
  res.json({ success: true, count: playlists.length, data: playlists });
});

// GET /api/playlists/:id
router.get('/playlists/:id', (req, res) => {
  const playlist = getPlaylistById(req.params.id);
  if (!playlist) {
    return res.status(404).json({ success: false, error: 'Playlist not found' });
  }

  const allTracks = getAllTracks();
  const tracks = (playlist.trackIds || [])
    .map((tid) => allTracks.find((t) => t.id === tid))
    .filter(Boolean);

  res.json({
    success: true,
    data: {
      ...playlist,
      tracks,
    },
  });
});

// POST /api/playlists
router.post('/playlists', (req, res) => {
  const { title, description, coverUrl, gradient } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Playlist title is required' });
  }

  const newPlaylist = createPlaylist({
    title,
    description,
    coverUrl,
    gradient,
  });

  res.status(201).json({
    success: true,
    message: 'Playlist created successfully',
    data: newPlaylist,
  });
});

// PUT /api/playlists/:id
router.put('/playlists/:id', (req, res) => {
  const updated = updatePlaylist(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, error: 'Playlist not found' });
  }

  res.json({
    success: true,
    message: 'Playlist updated successfully',
    data: updated,
  });
});

// DELETE /api/playlists/:id
router.delete('/playlists/:id', (req, res) => {
  const deleted = deletePlaylist(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Playlist not found' });
  }

  res.json({
    success: true,
    message: 'Playlist deleted successfully',
  });
});

// POST /api/playlists/:id/tracks
router.post('/playlists/:id/tracks', (req, res) => {
  const { trackId } = req.body;
  if (!trackId) {
    return res.status(400).json({ success: false, error: 'trackId is required' });
  }

  const playlist = addTrackToPlaylist(req.params.id, trackId);
  if (!playlist) {
    return res.status(404).json({ success: false, error: 'Playlist not found' });
  }

  res.json({
    success: true,
    message: 'Track added to playlist',
    data: playlist,
  });
});

// DELETE /api/playlists/:id/tracks/:trackId
router.delete('/playlists/:id/tracks/:trackId', (req, res) => {
  const playlist = removeTrackFromPlaylist(req.params.id, req.params.trackId);
  if (!playlist) {
    return res.status(404).json({ success: false, error: 'Playlist not found' });
  }

  res.json({
    success: true,
    message: 'Track removed from playlist',
    data: playlist,
  });
});

// GET /api/liked
router.get('/liked', (req, res) => {
  const likedTrackIds = getLikedTrackIds();
  const allTracks = getAllTracks();
  const tracks = likedTrackIds
    .map((tid) => allTracks.find((t) => t.id === tid))
    .filter(Boolean);

  res.json({
    success: true,
    count: likedTrackIds.length,
    likedTrackIds,
    tracks,
  });
});

// POST /api/liked/:trackId (toggle like)
router.post('/liked/:trackId', (req, res) => {
  const result = toggleLike(req.params.trackId);
  res.json({
    success: true,
    message: result.isLiked ? 'Track liked' : 'Track unliked',
    data: result,
  });
});

// GET /api/recently-played
router.get('/recently-played', (req, res) => {
  const recentIds = getRecentlyPlayedIds();
  const allTracks = getAllTracks();
  const tracks = recentIds
    .map((tid) => allTracks.find((t) => t.id === tid))
    .filter(Boolean);

  res.json({
    success: true,
    count: recentIds.length,
    recentIds,
    tracks,
  });
});

// POST /api/recently-played
router.post('/recently-played', (req, res) => {
  const { trackId } = req.body;
  if (!trackId) {
    return res.status(400).json({ success: false, error: 'trackId is required' });
  }

  const recentIds = addRecentlyPlayed(trackId);
  res.json({
    success: true,
    message: 'Track added to recently played',
    recentIds,
  });
});

// GET /api/categories
router.get('/categories', (req, res) => {
  const categories = getAllCategories();
  res.json({ success: true, count: categories.length, data: categories });
});

export default router;

