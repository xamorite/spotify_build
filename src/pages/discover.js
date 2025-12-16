const Discover = () => {
  const tags = [
    "Today’s hits",
    "Deep focus",
    "Late night",
    "Afro vibes",
    "Chill & study",
    "Throwbacks",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-gray-400 text-sm">
            Hand-picked moods and themes to help you find your next favorite
            track.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {tags.map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-medium transition whitespace-nowrap"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-red-600/70 to-purple-700/70 p-4 flex flex-col justify-between shadow-lg"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2">
                  Curated mix
                </p>
                <h2 className="text-lg font-semibold mb-1">Vibe Session #{i + 1}</h2>
                <p className="text-xs text-white/80">
                  A dynamic mix of energetic and atmospheric tracks to keep you
                  in flow.
                </p>
              </div>
              <p className="text-[11px] text-white/80 mt-3">
                Auto-updated based on what listeners are replaying this week.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
