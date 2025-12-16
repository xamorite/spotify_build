// src/api/musicApi.js
// Client-side helpers that call our own Next.js Spotify API routes.

// Simple public lyrics API (best-effort, not all songs will be found)
const LYRICS_BASE_URL = "https://api.lyrics.ovh/v1";

// Home feed tracks from /api/spotify/home
export async function getTracks() {
  try {
    const res = await fetch("/api/spotify/home");
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch home tracks:", res.status);
      return [];
    }
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching tracks:", err);
    return [];
  }
}

// Search by artist, track, or album – used by the header search bar
export async function searchTracks(term) {
  if (!term || !term.trim()) return [];
  try {
    const res = await fetch(
      `/api/spotify/search?${new URLSearchParams({ query: term.trim() })}`
    );
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("Failed to search Spotify:", res.status);
      return [];
    }
    const data = await res.json();
    return data.tracks || [];
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error searching tracks:", err);
    return [];
  }
}

export async function getLyrics(artist, title) {
  if (!artist || !title) return null;
  try {
    const res = await fetch(
      `${LYRICS_BASE_URL}/${encodeURIComponent(artist)}/${encodeURIComponent(
        title
      )}`
    );
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data.lyrics || null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error fetching lyrics:", err);
    return null;
  }
}
