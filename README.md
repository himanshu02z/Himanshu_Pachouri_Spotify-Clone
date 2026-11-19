# Soundify — Fullstack Spotify Clone

A responsive, fullstack Spotify-inspired music streaming application with a **React + Tailwind CSS** frontend and an **Express.js REST API backend** with persistent JSON database storage and HTML5 Audio streaming.

---

## 🎧 Architecture Overview

### 1. Frontend (React 18 + Vite + Tailwind CSS)
- **Authentic Dark Interface**: Spotify `#121212` canvas, `#000000` sidebar, `#181818` cards with `#282828` hover, and `#1DB954` green accent.
- **Micro-Interactions**: Hover lift on music cards with floating green play button, real-time multi-bar animated audio equalizer, seekable progress and volume sliders.
- **Views**:
  - **Home**: Dynamic time-based greeting (*Good morning / afternoon / evening*), quick access 6-pack grid, Recently Played, Made For You, Trending Songs, and Popular Artists.
  - **Search**: Instant live search by title, artist, album, and genre, top result hero card, category/genre cards with Spotify gradients, filter chips (*All*, *Songs*, *Artists*, *Playlists*), and friendly empty state.
  - **Playlist View**: Vibrant gradient header, play/pause entire playlist, search inside playlist, and one-click recommended songs addition.
  - **Liked Songs**: Dedicated view for liked tracks with play all, persisted to backend & localStorage.
  - **Your Library**: Filter between Playlists, Artists, and Liked Songs with Grid or List view toggling.
- **Mobile Friendly**: Responsive drawer menu for mobile sidebar + bottom tab bar for thumb navigation.
- **Keyboard Shortcuts**:
  - `Space`: Play / Pause toggle
  - `Ctrl/Cmd + Right Arrow`: Next track
  - `Ctrl/Cmd + Left Arrow`: Previous track
  - `M`: Mute / Unmute audio

### 2. Backend (Node.js + Express.js + REST API)
- **Server Port**: `5001`
- **Database**: File-backed JSON database (`server/data/db.json`) supporting atomic reads and writes.
- **Static Assets & Audio Streaming**: Serves 8 bundled royalty-free audio tracks directly via `/audio/:filename`.
- **Fullstack Serving**: Express serves both the REST API at `/api` and the compiled production frontend from `dist`.
- **Endpoints**:
  - `GET /api/health`: Health status, uptime, track and playlist statistics
  - `GET /api/songs`: All songs (supports `?search=...`, `?genre=...`, `?limit=...`)
  - `GET /api/songs/:id`: Individual song details
  - `GET /api/artists`: List of artists
  - `GET /api/artists/:id`: Artist profile with resolved tracks
  - `GET /api/playlists`: All editorial and user playlists
  - `GET /api/playlists/:id`: Playlist details with resolved tracks
  - `POST /api/playlists`: Create new custom playlist
  - `PUT /api/playlists/:id`: Update playlist details
  - `DELETE /api/playlists/:id`: Delete playlist
  - `POST /api/playlists/:id/tracks`: Add track to playlist
  - `DELETE /api/playlists/:id/tracks/:trackId`: Remove track from playlist
  - `GET /api/liked`: Get all liked track IDs and resolved tracks
  - `POST /api/liked/:trackId`: Toggle like state for track
  - `GET /api/recently-played`: Get recent listening history
  - `POST /api/recently-played`: Record track play
  - `GET /api/categories`: Search categories and color gradients

---

## 🚀 Running the Fullstack Application

```bash
# 1. Install dependencies
npm install

# 2. Run both Backend API and Frontend simultaneously
npm run dev
```

- **Frontend (Vite HMR)**: `http://localhost:3000`
- **Backend API & Unified Fullstack**: `http://localhost:5001`
- **Health Check**: `http://localhost:5001/api/health`

```bash
# Production Build & Start
npm run build
npm start
```
