import Sidebar from "./sidebar";
import { useState } from "react";
import Musicplayer from "./musicPlayer";
import LyricsPanel from "./LyricsPanel";
import MetadataPanel from "./MetadataPanel";
import { usePlayer } from "../player/PlayerContext";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentTrack } = usePlayer();

  return (
    <div className="relative flex bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="transition-all duration-300 flex-1 overflow-x-hidden pb-24">
        {children}
      </div>

      {/* Global floating panels / player */}
      {currentTrack && (
        <>
          <LyricsPanel />
          <MetadataPanel />
          <Musicplayer />
        </>
      )}
    </div>
  );
};

export default Layout;

