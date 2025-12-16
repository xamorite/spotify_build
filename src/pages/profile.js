// app/profile/page.js
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/useAuth";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/client";
import {
  PencilIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import CircularArtistCard from "../components/circularArtistCard"; // Reusing the nice component

const TrackRow = ({ track, index }) => (
  <div className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors group">
    <span className="text-gray-400 w-6 text-center text-sm font-medium group-hover:text-white">{index + 1}</span>
    <div className="relative w-10 h-10 mr-4 rounded overflow-hidden flex-shrink-0">
        <img 
            src={track.album?.images?.[0]?.url || "https://placehold.co/40x40/222/fff?text=T"} 
            alt={track.title} 
            className="object-cover w-full h-full"
        />
    </div>
    <div className="flex-grow min-w-0">
      <p className="text-white font-medium truncate">{track.title}</p>
      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
    </div>
    <div className="text-gray-500 text-sm">{/* Duration could go here */}</div>
  </div>
);

const gradientColors = [
  "from-blue-600 to-blue-900",
  "from-green-600 to-green-900",
  "from-purple-600 to-purple-900",
  "from-red-600 to-red-900",
  "from-yellow-600 to-yellow-900",
  "from-amber-800 to-amber-950",
  "from-pink-600 to-pink-900",
  "from-indigo-600 to-indigo-900",
];

const Profile = () => {
  const router = useRouter();
  const { user, isAuthReady, logout } = useAuth();
  const { isSpotifyConnected } = useSpotifyAuth();

  const [profileDetails, setProfileDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [headerGradient, setHeaderGradient] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthReady && user === null) {
      router.push("/login");
    }
  }, [isAuthReady, user, router]);

  const updateProfile = () => {
    router.push("/bio");
  };

  useEffect(() => {
    if (isAuthReady && user) {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);

        // Pick a random gradient per load for variety
        const randomGradient =
          gradientColors[Math.floor(Math.random() * gradientColors.length)];
        setHeaderGradient(randomGradient);

        try {
          // 1. Fetch Firestore Profile Data (Bio, manual customization)
          let firestoreData = {};
          if (db && user?.uid) {
            const snap = await getDoc(doc(db, "users", user.uid));
            if (snap.exists()) {
              firestoreData = snap.data();
            }
          }

          // 2. Fetch Spotify Data (if connected)
          let spotifyTopArtists = [];
          let spotifyTopTracks = [];

          if (isSpotifyConnected) {
             try {
                const [artistsRes, tracksRes] = await Promise.all([
                    fetch("/api/spotify/me/top/artists"),
                    fetch("/api/spotify/me/top/tracks")
                ]);
                
                if (artistsRes.ok) spotifyTopArtists = await artistsRes.json();
                if (tracksRes.ok) spotifyTopTracks = await tracksRes.json();
             } catch (spotifyErr) {
                 console.warn("Failed to fetch spotify details for profile:", spotifyErr);
             }
          }

          // 3. Merge Data
          const detailedData = {
            ...user,
            ...firestoreData,
            fullName: firestoreData.fullName || user.name || user.email?.split('@')[0],
            bio: firestoreData.bio || "Music lover, sound explorer, and groove finder.",
            profilePictureUrl:
              firestoreData.profilePictureUrl ||
              user.photoURL ||
              "https://placehold.co/128x128/374151/ffffff?text=" + (user.email?.[0]?.toUpperCase() || "U"),
            topArtists: spotifyTopArtists.length > 0 ? spotifyTopArtists : (firestoreData.topArtists || []),
            topTracks: spotifyTopTracks.length > 0 ? spotifyTopTracks : (firestoreData.topTracks || []),
            isSpotifyLinked: isSpotifyConnected
          };

          setProfileDetails(detailedData);
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          setError(err.message || "Failed to load profile data.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchProfile();
    }
  }, [isAuthReady, user, isSpotifyConnected]);

  if (!isAuthReady || user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white w-full">
        <p className="text-xl">
          {!isAuthReady ? "Loading session..." : "Redirecting to login..."}
        </p>
      </div>
    );
  }

  if (isLoading || !profileDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white w-full">
         <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-xl text-gray-400">Loading profile...</p>
         </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white w-full p-4">
        <p className="text-xl text-red-500 mb-4">Error Loading Profile</p>
        <p className="text-gray-400 text-center">{error}</p>
        <button
          onClick={() => router.push("/home")}
          className="mt-6 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const profile = profileDetails;

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      
      {/* Header Section */}
      <div className={`relative h-80 md:h-96 w-full bg-gradient-to-b ${headerGradient}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
        
        {/* Profile Info Container */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 bg-gradient-to-t from-black via-black/60 to-transparent">
          
          {/* Profile Picture */}
          <div className="relative group">
            <img
                src={profile.profilePictureUrl}
                alt={profile.fullName}
                onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/128x128/374151/ffffff?text=U";
                }}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-2xl border-4 border-black/50 group-hover:scale-105 transition-transform duration-300"
            />
            {profile.isSpotifyLinked && (
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1.5 border-4 border-black" title="Connected to Spotify">
                    <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.38C8.88 5.88 15.96 6.24 20.04 8.521c.539.3.719.96.419 1.5-.239.54-.899.72-1.38.42z"/></svg>
                </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-grow text-center md:text-left z-10 w-full md:w-auto">
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider mb-1 text-white/80">Profile</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight shadow-sm">
                {profile.fullName}
            </h1>
            <p className="text-white/70 max-w-2xl text-sm md:text-base font-medium">
                {profile.bio}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mb-2 md:mb-4">
              <button
                onClick={updateProfile}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full transition-all text-sm font-medium"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Edit</span>
              </button>
              
              <button
                onClick={logout}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 md:bg-transparent md:hover:bg-red-600/20 text-red-500 rounded-full transition-all"
                title="Sign Out"
              >
                <PowerIcon className="w-6 h-6" />
              </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-12">
        
        {/* Top Artists Section */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Artists</h2>
            {!profile.isSpotifyLinked && (
                 <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">Offline Data</span>
            )}
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {profile.topArtists && profile.topArtists.length > 0 ? (
              profile.topArtists.slice(0, 6).map((artist, index) => (
                <CircularArtistCard 
                    key={artist.id || index} 
                    artistName={artist.name} 
                    imageUrl={artist.images?.[0]?.url} 
                    subscriberCount={artist.genres?.[0] || 'Artist'} 
                />
              ))
            ) : (
                <div className="col-span-full h-32 flex items-center justify-center bg-white/5 rounded-xl border border-white/5 border-dashed">
                    <p className="text-gray-500">No artists to display yet.</p>
                </div>
            )}
          </div>
        </section>

        {/* Top Tracks Section */}
        <section>
          <div className="flex items-end justify-between mb-6">
             <h2 className="text-2xl font-bold">Top Tracks</h2>
             <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">This Month</span>
          </div>

          <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
             {profile.topTracks && profile.topTracks.length > 0 ? (
               <div className="divide-y divide-white/5">
                 {profile.topTracks.slice(0, 5).map((track, index) => (
                   <TrackRow key={track.id || index} track={track} index={index} />
                 ))}
               </div>
             ) : (
                <div className="p-12 text-center text-gray-500">
                    No tracks to display.
                </div>
             )}
          </div>
          
          {profile.topTracks && profile.topTracks.length > 5 && (
              <div className="mt-4 text-center">
                <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
                    Show All Tracks
                </button>
              </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default Profile;
