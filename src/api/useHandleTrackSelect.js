import { useCallback } from "react";
import { usePlayer } from "../player/PlayerContext";

// With the new iTunes-based API, tracks already include a previewUrl.
// This hook normalizes that into resolvedStreamUrl for the global player.

const useHandleTrackSelect = () => {
  const { setCurrentTrack, setCurrentTime, setIsPlaying } = usePlayer();

  const handleTrackSelect = useCallback(
    (track) => {
      if (!track) return;
      const resolvedStreamUrl = track.resolvedStreamUrl || track.previewUrl;
      if (!resolvedStreamUrl) {
        // eslint-disable-next-line no-console
        console.warn("No preview/stream URL available for track:", track);
      }
      setCurrentTrack({
        ...track,
        resolvedStreamUrl,
      });
      setCurrentTime(0);
      setIsPlaying(true);
    },
    [setCurrentTrack, setCurrentTime, setIsPlaying]
  );

  return handleTrackSelect;
};

export default useHandleTrackSelect;

