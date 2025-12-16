// src/api/spotifyClient.js
// Server-side Spotify Web API client using Client Credentials flow

const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// In-memory token cache (for serverless, consider Redis or similar for production)
let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Get a valid Spotify access token using Client Credentials flow
 * Caches the token until it expires
 */
async function getAccessToken() {
  // Return cached token if still valid (with 5 minute buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing Spotify credentials. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables."
    );
  }

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spotify auth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    cachedToken = data.access_token;
    // Spotify tokens typically last 3600 seconds (1 hour)
    tokenExpiresAt = Date.now() + data.expires_in * 1000;

    return cachedToken;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to get Spotify access token:", error);
    throw error;
  }
}

/**
 * Generic Spotify API request helper
 */
async function spotifyRequest(endpoint, options = {}) {
  // If authorization header is provided in options, use it (User Token)
  // Otherwise, get a App Token (Client Credentials)
  let token;
  if (options.headers && options.headers.Authorization) {
    token = null; // Token is already in headers
  } else {
    token = await getAccessToken();
  }

  const url = `${SPOTIFY_API_BASE}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Spotify API error: ${response.status} - ${errorText} (endpoint: ${endpoint})`
    );
  }

  return response.json();
}

/**
 * Fetch home sections: new releases and featured playlists
 * Note: Some Spotify endpoints require a market parameter and may not be available in all regions
 */
export async function fetchHomeSections() {
  try {
    // Use US market as default - you can make this configurable
    const market = "US";
    
    // Fetch both endpoints, but handle errors individually
    const [newReleasesResult, featuredResult] = await Promise.allSettled([
      spotifyRequest(`/browse/new-releases?limit=20&market=${market}`),
      spotifyRequest(`/browse/featured-playlists?limit=20&market=${market}`),
    ]);

    const newReleases = 
      newReleasesResult.status === "fulfilled" ? newReleasesResult.value : null;
    const featured = 
      featuredResult.status === "fulfilled" ? featuredResult.value : null;

    // Log warnings if either endpoint failed
    if (newReleasesResult.status === "rejected") {
      // eslint-disable-next-line no-console
      console.warn("Failed to fetch new releases:", newReleasesResult.reason?.message);
    }
    if (featuredResult.status === "rejected") {
      // eslint-disable-next-line no-console
      console.warn("Failed to fetch featured playlists:", featuredResult.reason?.message);
    }

    return {
      newReleases,
      featured,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching home sections:", error);
    throw error;
  }
}

/**
 * Search Spotify for tracks, artists, and albums
 */
export async function searchSpotify(query) {
  try {
    const encodedQuery = encodeURIComponent(query);
    const market = "US"; // Can be made configurable
    const data = await spotifyRequest(
      `/search?q=${encodedQuery}&type=track,artist,album&limit=20&market=${market}`
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error searching Spotify:", error);
    throw error;
  }
}

/**
 * Get a single track by ID
 */
export async function getTrackById(trackId) {
  try {
    const market = "US"; // Can be made configurable
    const data = await spotifyRequest(`/tracks/${trackId}?market=${market}`);
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error fetching track ${trackId}:`, error);
    throw error;
  }
}

/**
 * Map Spotify track object to our app's track format
 * Spotify doesn't provide full audio streams via their API,
 * only 30-second preview URLs for most tracks
 */
export function mapSpotifyTrack(spotifyTrack) {
  if (!spotifyTrack) return null;

  const album = spotifyTrack.album || {};
  const artists = spotifyTrack.artists || [];
  const images = album.images || [];

  // Spotify provides preview_url for ~30 second previews
  // For full playback, you'd need Spotify Web Playback SDK (requires Premium)
  const previewUrl = spotifyTrack.preview_url;

  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: artists.map((a) => a.name).join(", ") || "Unknown Artist",
    artistId: artists[0]?.id || null,
    album: album.name || "",
    albumId: album.id || null,
    duration: spotifyTrack.duration_ms
      ? Math.floor(spotifyTrack.duration_ms / 1000)
      : 0,
    // Map images to different sizes
    artwork: {
      "150x150": images.find((img) => img.height >= 150)?.url || images[2]?.url,
      "300x300": images.find((img) => img.height >= 300)?.url || images[1]?.url,
      "500x500": images.find((img) => img.height >= 500)?.url || images[0]?.url,
      original: images[0]?.url,
    },
    // Spotify only gives us preview URLs (30 seconds)
    resolvedStreamUrl: previewUrl || null,
    previewUrl: previewUrl,
    // Include Spotify metadata
    spotifyUrl: spotifyTrack.external_urls?.spotify,
    uri: spotifyTrack.uri,
    // Popularity (0-100)
    popularity: spotifyTrack.popularity || 0,
    // Track is explicit
    explicit: spotifyTrack.explicit || false,
    // Release date from album
    releaseDate: album.release_date || null,
  };
}
/**
 * Get User's Top Artists
 */
export async function getUserTopArtists(accessToken, timeRange = "medium_term", limit = 10) {
  try {
    const data = await spotifyRequest(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return data.items || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Error fetching user top artists:", error);
    return [];
  }
}

/**
 * Get User's Top Tracks
 */
export async function getUserTopTracks(accessToken, timeRange = "medium_term", limit = 10) {
  try {
    const data = await spotifyRequest(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return (data.items || []).map(mapSpotifyTrack);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Error fetching user top tracks:", error);
    return [];
  }
}

/**
 * Get User's Liked Tracks (Saved Tracks)
 */
export async function getUserLikedTracks(accessToken, limit = 20) {
  try {
    const data = await spotifyRequest(`/me/tracks?limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return (data.items || []).map((item) => mapSpotifyTrack(item.track));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Error fetching user liked tracks:", error);
    return [];
  }
}

/**
 * Get User's Recently Played Tracks
 */
export async function getUserRecentlyPlayed(accessToken, limit = 20) {
  try {
    const data = await spotifyRequest(`/me/player/recently-played?limit=${limit}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return (data.items || []).map((item) => mapSpotifyTrack(item.track));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Error fetching user recently played:", error);
    return [];
  }
}
