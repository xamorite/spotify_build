"use client";

// src/components/MetadataPanel.js
// Fullscreen-style metadata view for the current track (Spotify-like).

import { X } from "lucide-react";
import { usePlayer } from "../player/PlayerContext";

const MetadataPanel = () => {
  const { currentTrack, metadataVisible, setMetadataVisible } = usePlayer();

  if (!currentTrack || !metadataVisible) return null;

  const artwork =
    currentTrack.artwork?.["480x480"] ||
    currentTrack.artwork?.["150x150"] ||
    "https://via.placeholder.com/480";

  return (
    <div className="fixed inset-0 z-40 bg-black/95 text-white flex items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8">
        {/* Artwork */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={artwork}
            alt={currentTrack.title}
            className="w-full max-w-sm rounded-3xl shadow-2xl object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-red-300 mb-1">
                Now playing
              </p>
              <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">
                {currentTrack.title}
              </h1>
              <p className="text-base text-gray-300 mt-1">
                {currentTrack.artist || currentTrack.user?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMetadataVisible(false)}
              className="p-2 rounded-full hover:bg-white/10 text-gray-200"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-2 space-y-2 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-white">Album:</span>{" "}
              {currentTrack.collectionName || "Unknown album"}
            </p>
            <p>
              <span className="font-semibold text-white">Artist:</span>{" "}
              {currentTrack.artist || currentTrack.user?.name}
            </p>
            {currentTrack.formattedDuration && (
              <p>
                <span className="font-semibold text-white">Duration:</span>{" "}
                {currentTrack.formattedDuration}
              </p>
            )}
            {currentTrack.fullPermalink && (
              <p>
                <span className="font-semibold text-white">More info:</span>{" "}
                <a
                  href={currentTrack.fullPermalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 underline"
                >
                  Open in source
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetadataPanel;


