// source/pages/index.js
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../auth/useAuth";

const Landing = () => {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="max-w-3xl text-center space-y-8">
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">
            Expression Music
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
            Stream what moves you.
            <span className="block text-red-500">Discover. Save. Repeat.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto">
            A sleek music experience with personalized libraries, smart
            discovery, and live lyrics. Built for focus, flow, and late-night
            sessions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-600/30 transition"
            >
              Get started free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 font-medium transition"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </main>

      <section className="border-t border-white/10 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300">
          <div>
            <p className="font-semibold text-white mb-1">Massive catalog</p>
            <p>New and classic tracks, all in one place.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Live lyrics</p>
            <p>Sing along with real-time synced lyrics.</p>
          </div>
          <div>
            <p className="font-semibold text-white mb-1">Your vibe</p>
            <p>Tailored sections for focus, chill, and parties.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

