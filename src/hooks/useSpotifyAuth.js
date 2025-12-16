// src/hooks/useSpotifyAuth.js
import { useState, useEffect } from "react";

export function useSpotifyAuth() {
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setIsSpotifyConnected(data.isAuthenticated);
        setLoading(false);
      })
      .catch(() => {
        setIsSpotifyConnected(false);
        setLoading(false);
      });
  }, []);

  return { isSpotifyConnected, loading };
}
