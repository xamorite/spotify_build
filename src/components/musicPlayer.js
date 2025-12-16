"use client";

import {
  FaHeart,
  FaRandom,
  FaRedo,
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaInfoCircle,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { usePlayer } from "../player/PlayerContext";
import { useAuth } from "../auth/useAuth";
import { db } from "../firebase/client";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

const Musicplayer = () => {
  const audioRef = useRef(null);
  const {
    currentTrack: track,
    currentTime,
    setCurrentTime,
    isPlaying,
    setIsPlaying,
    lyricsVisible,
    setLyricsVisible,
    setMetadataVisible,
  } = usePlayer();
  const { user } = useAuth();
  const [volume, setVolume] = useState(0.66);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const whole = Math.floor(seconds);
    const mins = Math.floor(whole / 60);
    const secs = whole % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // When the current track changes, load and start playback
  useEffect(() => {
    if (track && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
    }
  }, [track, setCurrentTime, setIsPlaying]);

  // Check liked status whenever track/user changes
  useEffect(() => {
    const checkLiked = async () => {
      if (!db || !user || !track?.id) {
        setIsLiked(false);
        return;
      }
      try {
        const ref = doc(db, "users", user.uid, "likedTracks", String(track.id));
        const snap = await getDoc(ref);
        setIsLiked(snap.exists());
      } catch {
        setIsLiked(false);
      }
    };
    checkLiked();
  }, [user, track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime || 0);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    if (!audioRef.current || Number.isNaN(newTime)) return;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleLike = async () => {
    if (!db || !user || !track?.id) return;
    try {
      const ref = doc(db, "users", user.uid, "likedTracks", String(track.id));
      if (isLiked) {
        await deleteDoc(ref);
        setIsLiked(false);
      } else {
        await setDoc(
          ref,
          {
            ...track,
            likedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        setIsLiked(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to toggle like:", e);
    }
  };

  if (!track) return null; // Don't render anything if no track is selected

  const streamUrl = track.resolvedStreamUrl;
  const artworkUrl =
    track.artwork?.["150x150"] || "https://via.placeholder.com/150";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-black text-white shadow-md">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 md:px-6 pt-3 pb-2 gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 min-w-0">
          <img
            src={artworkUrl}
            alt={track.title}
            className="w-12 h-12 rounded flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-medium text-base tracking-tighter text-white truncate">
              {track.title}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {track.artist || track.user?.name}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleLike}
            className="ml-2 flex-shrink-0"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            <FaHeart
              className={`cursor-pointer ${
                isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Center Controls + Timeline (YouTube Music–style) */}
        <div className="flex flex-col items-center gap-2 mx-auto flex-1 max-w-xl">
          <div className="flex items-center gap-6 justify-center">
            <FaRedo className="cursor-pointer hover:text-purple-400" />
            <FaStepBackward className="cursor-pointer hover:text-purple-400" />
            <button
              onClick={togglePlay}
              className="bg-white text-black rounded-full p-3 hover:scale-105 transition"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <FaStepForward className="cursor-pointer hover:text-purple-400" />
            <FaRandom className="cursor-pointer hover:text-purple-400" />
          </div>
          <div className="flex items-center gap-3 w-full text-[11px] text-gray-400">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.5"
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              className="w-full accent-red-500"
            />
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume + Lyrics / metadata toggles */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="flex items-center gap-2 w-full md:w-56">
            <span className="text-purple-400 text-xs w-6">
              {Math.round(volume * 100)}
            </span>
            {isMuted ? (
              <FaVolumeMute className="cursor-pointer" onClick={toggleMute} />
            ) : (
              <FaVolumeUp className="cursor-pointer" onClick={toggleMute} />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setLyricsVisible(!lyricsVisible)}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs flex items-center gap-2"
            >
              <span>Lyrics</span>
            </button>
            <button
              type="button"
              onClick={() => setMetadataVisible(true)}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10"
              aria-label="Show track details"
            >
              <FaInfoCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={streamUrl} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Musicplayer;
