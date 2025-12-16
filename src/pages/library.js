import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { db } from "../firebase/client";
import { collection, getDocs } from "firebase/firestore";
import SquareTrackCard from "../components/squareTrackCard";

const Library = () => {
  const { user } = useAuth();
  const [likedTracks, setLikedTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLiked = async () => {
      if (!db || !user) {
        setLikedTracks([]);
        return;
      }
      setLoading(true);
      try {
        const col = collection(db, "users", user.uid, "likedTracks");
        const snap = await getDocs(col);
        const tracks = snap.docs.map((d) => d.data());
        setLikedTracks(tracks);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load liked tracks:", e);
        setLikedTracks([]);
      } finally {
        setLoading(false);
      }
    };
    loadLiked();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex items-baseline justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Library</h1>
            <p className="text-gray-400 text-sm">
              All the tracks and sessions you&apos;ve loved in one place.
            </p>
          </div>
        </header>

        {loading ? (
          <div className="border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
            <p className="text-sm text-gray-400">Loading your liked songs...</p>
          </div>
        ) : likedTracks.length === 0 ? (
          <div className="border border-dashed border-white/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3">
            <h2 className="text-lg font-semibold">No saved tracks yet</h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Start listening on the home or discover pages, then tap the heart
              icon to build up your personal library.
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Liked songs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {likedTracks.map((track) => (
                <div key={track.id} className="cursor-pointer">
                  <SquareTrackCard track={track} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Library;

