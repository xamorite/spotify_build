// src/pages/api/spotify/track.js

import { getTrackById, mapSpotifyTrack } from "../../../../src/api/spotifyClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "Missing track id" });
  }

  try {
    const track = await getTrackById(String(id));
    return res.status(200).json({ track: mapSpotifyTrack(track) });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Spotify track API error:", e);
    return res.status(500).json({ error: "Failed to load track" });
  }
}


