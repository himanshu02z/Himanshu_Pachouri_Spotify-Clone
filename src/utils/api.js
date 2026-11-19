const API_BASE =
  typeof window !== 'undefined' && window.location.port === '3000'
    ? 'http://localhost:5001/api'
    : '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn(`API request to ${endpoint} failed, falling back to local state:`, err);
    return null;
  }
}

export async function checkServerHealth() {
  return await request('/health');
}

export async function getSongsFromApi(query = '') {
  const endpoint = query ? `/songs?search=${encodeURIComponent(query)}` : '/songs';
  return await request(endpoint);
}

export async function getPlaylistsFromApi() {
  return await request('/playlists');
}

export async function getArtistsFromApi() {
  return await request('/artists');
}

export async function getCategoriesFromApi() {
  return await request('/categories');
}

export async function getLikedFromApi() {
  return await request('/liked');
}

export async function toggleLikeOnApi(trackId) {
  return await request(`/liked/${trackId}`, { method: 'POST' });
}

export async function createPlaylistOnApi(playlistData) {
  return await request('/playlists', {
    method: 'POST',
    body: JSON.stringify(playlistData),
  });
}

export async function addTrackToPlaylistOnApi(playlistId, trackId) {
  return await request(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({ trackId }),
  });
}

export async function removeTrackFromPlaylistOnApi(playlistId, trackId) {
  return await request(`/playlists/${playlistId}/tracks/${trackId}`, {
    method: 'DELETE',
  });
}

export async function recordPlayedTrackOnApi(trackId) {
  return await request('/recently-played', {
    method: 'POST',
    body: JSON.stringify({ trackId }),
  });
}
