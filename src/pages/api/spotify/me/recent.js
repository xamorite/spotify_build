// src/pages/api/spotify/me/recent.js
import { getUserRecentlyPlayed } from "@/api/spotifyClient";

export default async function handler(req, res) {
  const accessToken = req.cookies["spotify_access_token"];

  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated with Spotify" });
  }

  try {
    const tracks = await getUserRecentlyPlayed(accessToken, 10);
    return res.status(200).json(tracks);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching recently played:", error);
    return res.status(500).json({ error: "Failed to fetch recently played" });
  }
}
