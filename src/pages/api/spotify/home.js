// src/pages/api/spotify/home.js

import { fetchHomeSections, mapSpotifyTrack } from "../../../../src/api/spotifyClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = await fetchHomeSections();

    const albums =
      data.newReleases?.albums?.items?.map((a) => ({
        id: a.id,
        title: a.name,
        artist: a.artists?.[0]?.name || "",
        artwork: a.images,
      })) || [];

    const featuredPlaylists =
      data.featured?.playlists?.items?.map((p) => ({
        id: p.id,
        title: p.name,
        artwork: p.images,
      })) || [];

    // Flatten a set of tracks from new releases for \"Listen again\" style sections.
    const tracks =
      data.newReleases?.albums?.items
        ?.slice(0, 10)
        .flatMap((a) =>
          (a.tracks?.items || []).map((t) =>
            mapSpotifyTrack({
              ...t,
              album: a,
            })
          )
        ) || [];

    return res.status(200).json({
      tracks,
      albums,
      featuredPlaylists,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Spotify home API error:", e);
    return res.status(500).json({ error: "Failed to load Spotify home content" });
  }
}


