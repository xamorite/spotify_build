// app/home/page.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../auth/useAuth";
import { useSpotifyAuth } from "../hooks/useSpotifyAuth";
import useFetchTracks from "../hooks/useFetchTracks";
import { searchTracks } from "../api/musicApi";
// Import necessary components (assuming you'll create these)
import Sidebar from "../components/sidebar"; // Placeholder for the fixed left nav
import TopSearchHeader from "../components/topSearchHeader"; // Placeholder for the top search bar
import NewArrival from "../components/newArrival"; // Reusing the existing component for the large banner spot
import TrackCard from "../components/trackCard"; // For square album/track covers
import useHandleTrackSelect from "../api/useHandleTrackSelect";

// New components needed for the UI structure
import SectionBar from "../components/sectionBar"; // Reused, but now mainly for section titles
import SquareTrackCard from "../components/squareTrackCard"; // Assuming a component for the 'From your library' style
import CircularArtistCard from "../components/circularArtistCard"; // Assuming a component for 'Listen again' circular items

const HomePage = () => {
  // State for the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default to open on desktop
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const { user, isAuthReady } = useAuth();
  const { isSpotifyConnected, loading: spotifyAuthLoading } = useSpotifyAuth();
  const router = useRouter();
  
  // Data states for Spotify User Content
  const [userTopTracks, setUserTopTracks] = useState([]);
  const [userTopArtists, setUserTopArtists] = useState([]);
  const [userRecentlyPlayed, setUserRecentlyPlayed] = useState([]);
  const [userLikedTracks, setUserLikedTracks] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(false);

  // Fallback generic data
  const { tracks: genericTracks, loading: genericLoading, error: genericError } = useFetchTracks();

  const handleTrackSelect = useHandleTrackSelect();

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Determine user's name for a personalized touch
  const userName = user?.email?.split("@")[0] || user?.name || "User";

  // Define performSearch callback BEFORE any conditional returns
  const performSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchError("");
      return;
    }
    setSearchLoading(true);
    setSearchError("");
    try {
      const results = await searchTracks(searchTerm);
      setSearchResults(results || []);
    } catch (e) {
      console.error("Search failed:", e);
      setSearchError("Something went wrong while searching.");
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm]);

  // --- Authentication Check Effect ---
  useEffect(() => {
    if (isAuthReady && user === null) {
      router.push("/login");
    } else if (isAuthReady && user) {
      console.log("User is logged in:", user);
    }
  }, [user, router, isAuthReady]);

  // --- Fetch User Data if Connected to Spotify ---
  useEffect(() => {
    if (isSpotifyConnected) {
      const fetchUserData = async () => {
        setUserDataLoading(true);
        try {
          // Fetch all user data in parallel
          const [topTracksRes, topArtistsRes, recentRes, likedRes] = await Promise.all([
            fetch("/api/spotify/me/top/tracks"),
            fetch("/api/spotify/me/top/artists"),
            fetch("/api/spotify/me/recent"),
            fetch("/api/spotify/me/saved"),
          ]);

          if (topTracksRes.ok) setUserTopTracks(await topTracksRes.json());
          if (topArtistsRes.ok) setUserTopArtists(await topArtistsRes.json());
          if (recentRes.ok) setUserRecentlyPlayed(await recentRes.json());
          if (likedRes.ok) setUserLikedTracks(await likedRes.json());
          
        } catch (e) {
          console.error("Failed to fetch user spotify data", e);
        } finally {
          setUserDataLoading(false);
        }
      };
      fetchUserData();
    }
  }, [isSpotifyConnected]);


  // Conditional returns AFTER all hooks
  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white w-full">
        <p className="text-xl">Loading session...</p>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white w-full">
        <p className="text-xl">Authentication required. Redirecting...</p>
      </div>
    );
  }

  const showUserData = isSpotifyConnected && !userDataLoading;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white ">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <main
        className={`
          min-h-screen w-full transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"}
        `}
      >
        {/* Top Header/Search Bar */}
        <TopSearchHeader
          userName={userName}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={performSearch}
          toggleSidebar={toggleSidebar}
        />

        {/* Content Area */}
        <div className="w-full px-4 md:px-6 lg:px-8 py-6 space-y-8">
          
          {/* Spotify Connection Banner */}
          {!spotifyAuthLoading && !isSpotifyConnected && (
             <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-xl p-6 mb-8 flex items-center justify-between shadow-lg">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Connect your Spotify</h3>
                  <p className="text-green-100">Unlock your top tracks, artists, and playlists directly in Vibe.</p>
                </div>
                <button 
                  onClick={() => window.location.href = '/api/auth/login'}
                  className="bg-white text-green-900 font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform shadow-md"
                >
                  Connect Spotify
                </button>
             </div>
          )}

          {/* Search Results (when active) */}
          {searchTerm.trim() && (
            <section className="space-y-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-2xl font-bold">Search results</h3>
                  <p className="text-sm text-gray-400">
                    Showing matches for{" "}
                    <span className="font-semibold">"{searchTerm}"</span>
                  </p>
                </div>
              </div>
              {searchLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
                </div>
              )}
              {searchError && (
                <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
                  {searchError}
                </div>
              )}
              {!searchLoading && !searchError && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {searchResults.length === 0 ? (
                    <p className="text-sm text-gray-400 col-span-full">
                      No results found. Try a different artist, track, or album.
                    </p>
                  ) : (
                    searchResults.map((track) => (
                      <div
                        key={track.id}
                        className="aspect-square relative group cursor-pointer"
                        onClick={() => handleTrackSelect(track)}
                      >
                        <SquareTrackCard
                          track={track}
                          className="transform transition-transform group-hover:scale-105"
                        />
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          )}

          {/* Quick Navigation */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {[
              "Podcasts", "Relax", "Feel good", "Workout", "Energize", 
              "Party", "Romance", "Commute", "Sad", "Focus", "Sleep",
            ].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full
                text-sm font-medium transition-all whitespace-nowrap
                focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* User Specific Collections or Fallback */}
          
          {/* Recently Played / Listen Again */}
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-gray-400 font-medium mb-1">{userName}</h2>
                <h3 className="text-2xl font-bold">
                  {showUserData ? "Recently Played" : "Listen again"}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {(showUserData ? userRecentlyPlayed : genericTracks.slice(0, 6)).map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className="aspect-square relative group cursor-pointer"
                  onClick={() => handleTrackSelect(track)}
                >
                  <NewArrival
                    track={track}
                    isSmaller={true}
                    className="transform transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Top Artists (If Connected) */}
          {showUserData && userTopArtists.length > 0 && (
             <section className="mb-12">
               <h3 className="text-2xl font-bold mb-6">Your Top Artists</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                 {userTopArtists.slice(0, 6).map((artist) => (
                   <div key={artist.id} className="aspect-square relative group cursor-pointer">
                      <CircularArtistCard
                        artistName={artist.name}
                        imageUrl={artist.images?.[0]?.url}
                        subscriberCount={"Artist"} // Spotify doesn't send easy subs count in this endpoint usually
                        className="transform transition-transform group-hover:scale-105"
                      />
                   </div>
                 ))}
               </div>
             </section>
          )}

          {/* Your Top Tracks / Library */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">
              {showUserData ? "Your Top Tracks" : "From your library"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {(showUserData ? userTopTracks : genericTracks.slice(6, 12)).slice(0,12).map((track) => (
                <div
                  key={track.id}
                  className="aspect-square relative group cursor-pointer"
                  onClick={() => handleTrackSelect(track)}
                >
                  <SquareTrackCard
                    track={track}
                    className="transform transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* New Releases or Liked Songs */}
           <section className="mb-12">
            <SectionBar sectionName={showUserData ? "Liked Songs" : "New Releases"} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
              {(showUserData ? userLikedTracks : genericTracks.slice(12, 18)).slice(0,6).map((track) => (
                <div
                  key={track.id}
                  className="aspect-square relative group cursor-pointer"
                  onClick={() => handleTrackSelect(track)}
                >
                  <SquareTrackCard
                    track={track}
                    className="transform transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </section>


          {/* States */}
          {genericLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
            </div>
          )}
          {genericError && (
            <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
              Error fetching tracks: {genericError}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
