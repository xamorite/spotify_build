// src/pages/api/spotify/me/saved.js
import { getUserLikedTracks } from "@/api/spotifyClient";

export default async function handler(req, res) {
  const accessToken = req.cookies["spotify_access_token"];

  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated with Spotify" });
  }

  try {
    const tracks = await getUserLikedTracks(accessToken, 10);
    return res.status(200).json(tracks);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching saved tracks:", error);
    return res.status(500).json({ error: "Failed to fetch saved tracks" });
  }
}
