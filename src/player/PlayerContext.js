// src/player/PlayerContext.js
// Global context for the current track, playback state, lyrics and metadata panels.

import { createContext, useContext, useState } from "react";

const PlayerContext = createContext(undefined);

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const [lyricsVisible, setLyricsVisible] = useState(false);
  const [lyricsFullscreen, setLyricsFullscreen] = useState(false);

  const [metadataVisible, setMetadataVisible] = useState(false);

  const value = {
    currentTrack,
    setCurrentTrack,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    lyricsVisible,
    setLyricsVisible,
    lyricsFullscreen,
    setLyricsFullscreen,
    metadataVisible,
    setMetadataVisible,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return ctx;
};


