const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center px-4">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-bold">About Expression</h1>
        <p className="text-gray-300 text-base leading-relaxed">
          Expression is a modern music experience built for creators, curators,
          and deep listeners. It combines a clean, focused interface with smart
          discovery tools so you can move seamlessly from finding new sounds to
          replaying your all-time favorites.
        </p>
        <p className="text-gray-300 text-base leading-relaxed">
          Under the hood, Expression uses real-time authentication, cloud
          storage, and live lyrics to keep your sessions in sync across
          devices&mdash;whether you&apos;re in the studio, commuting, or
          winding down at night.
        </p>
        <p className="text-gray-400 text-sm">
          This project is in active development. Expect frequent UI polish,
          smarter recommendations, and more ways to make the app feel like your
          own.
        </p>
      </div>
    </div>
  );
};

export default About;
