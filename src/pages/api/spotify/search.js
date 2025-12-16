// src/pages/api/spotify/search.js

import { searchSpotify, mapSpotifyTrack } from "../../../../src/api/spotifyClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.query;
  if (!query || !String(query).trim()) {
    return res.status(200).json({ tracks: [], artists: [], albums: [] });
  }

  try {
    const data = await searchSpotify(String(query).trim());

    const tracks = (data.tracks?.items || []).map(mapSpotifyTrack);
    const artists =
      data.artists?.items?.map((a) => ({
        id: a.id,
        name: a.name,
        followers: a.followers?.total || 0,
        images: a.images || [],
      })) || [];
    const albums =
      data.albums?.items?.map((a) => ({
        id: a.id,
        title: a.name,
        artist: a.artists?.[0]?.name || "",
        images: a.images || [],
      })) || [];

    return res.status(200).json({ tracks, artists, albums });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Spotify search API error:", e);
    return res.status(500).json({ error: "Failed to search Spotify" });
  }
}


