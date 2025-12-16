"use client";

// src/components/LyricsPanel.js
// Floating lyrics panel, inspired by Spotify / YouTube Music.

import { useEffect, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { getLyrics } from "../api/musicApi";
import { usePlayer } from "../player/PlayerContext";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const LyricsPanel = () => {
  const {
    currentTrack,
    currentTime,
    lyricsVisible,
    setLyricsVisible,
    lyricsFullscreen,
    setLyricsFullscreen,
  } = usePlayer();

  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentTrack || !lyricsVisible) {
      setLyrics("");
      setError("");
      return;
    }

    const fetchLyrics = async () => {
      setLoading(true);
      setError("");
      setLyrics("");
      try {
        const text = await getLyrics(
          currentTrack.artist || currentTrack.user?.name,
          currentTrack.title
        );
        if (!text) {
          setLyrics("Lyrics not available for this track.");
        } else {
          setLyrics(text);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load lyrics:", e);
        setError("Failed to load lyrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [currentTrack, lyricsVisible]);

  if (!currentTrack || !lyricsVisible) {
    return null;
  }

  const title = currentTrack.title;
  const artist = currentTrack.artist || currentTrack.user?.name;

  // Desktop glassmorphic bottom-left card, with optional fullscreen overlay.
  const basePanel = (
    <div
      className={`${
        lyricsFullscreen
          ? "fixed inset-0 z-40 bg-black/90"
          : "fixed bottom-20 left-4 z-30 max-w-sm"
      }`}
    >
      <div
        className={`relative backdrop-blur-2xl bg-white/10 border border-white/10 text-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
          lyricsFullscreen
            ? "w-full h-full md:w-[70vw] md:h-[70vh] md:mx-auto md:my-auto"
            : "w-full max-h-80"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-red-300">
              Lyrics
            </p>
            <p className="text-sm font-semibold truncate">{title}</p>
            <p className="text-xs text-gray-300 truncate">{artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-300 hidden sm:block">
              {formatTime(currentTime)}
            </span>
            <button
              type="button"
              onClick={() => setLyricsFullscreen(!lyricsFullscreen)}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-200"
              aria-label={lyricsFullscreen ? "Exit full screen" : "Full screen"}
            >
              {lyricsFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setLyricsVisible(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-gray-200"
              aria-label="Close lyrics"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 text-xs sm:text-sm leading-relaxed text-gray-100">
          {loading && <p>Loading lyrics...</p>}
          {error && <p className="text-red-300">{error}</p>}
          {!loading && !error && lyrics && (
            <pre className="whitespace-pre-wrap font-sans">{lyrics}</pre>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: fullscreen overlay by default */}
      <div className="block md:hidden fixed inset-0 z-40 bg-black/95">
        {basePanel}
      </div>

      {/* Desktop / tablet: glass card at bottom-left, fullscreen toggle inside card */}
      <div className="hidden md:block">{basePanel}</div>
    </>
  );
};

export default LyricsPanel;
