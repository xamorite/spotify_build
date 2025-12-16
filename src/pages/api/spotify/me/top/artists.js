// src/pages/api/spotify/me/top/artists.js
import { getUserTopArtists } from "@/api/spotifyClient";

export default async function handler(req, res) {
  const accessToken = req.cookies["spotify_access_token"];

  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated with Spotify" });
  }

  try {
    const artists = await getUserTopArtists(accessToken, "medium_term", 10);
    return res.status(200).json(artists);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching top artists:", error);
    return res.status(500).json({ error: "Failed to fetch top artists" });
  }
}
