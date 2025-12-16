// source/hooks/useFetchTracks.js
import { useEffect, useState } from "react";
import { getTracks } from "../api/musicApi";

const useFetchTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getTracks();

        if (Array.isArray(data)) {
          setTracks(data);
        } else {
          // eslint-disable-next-line no-console
          console.warn("Expected an array but got:", data);
          setTracks([]);
          setError("Unexpected data format from API.");
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching tracks:", err);
        setError(err.message || "Failed to fetch tracks.");
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return { tracks, loading, error };
};

export default useFetchTracks;
