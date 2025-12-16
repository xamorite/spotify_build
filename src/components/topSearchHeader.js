// app/components/topSearchHeader.js
"use client";
import React from "react";
import Link from "next/link";
import { Search, User, Menu } from "lucide-react";

const TopSearchHeader = ({
  userName,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  toggleSidebar,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    // Sticky header for persistent search and navigation
    <header className="sticky top-0 z-20 h-16 bg-[#121212]/95 backdrop-blur-md flex items-center justify-between px-4 md:px-6 lg:px-6">
      {/* Left: App / Menu (similar to YouTube Music) */}
      <div className="flex items-center gap-3 min-w-[140px]">
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-white/10 text-white/80"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-semibold tracking-tight">
          Expression <span className="text-red-500">Music</span>
        </span>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-grow max-w-xl mx-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search songs, albums, artists"
              className="w-full bg-[#202020] text-white py-2 pl-10 pr-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-[#262626] text-sm"
            />
          </div>
        </form>
      </div>

      {/* Right: User Profile */}
      <div className="flex items-center space-x-3">
        <Link
          href="/profile"
          className="hidden sm:flex flex-col text-right text-xs leading-tight"
        >
          <span className="font-semibold">{userName}</span>
          <span className="text-[11px] text-gray-400">View profile</span>
        </Link>
        <Link href="/profile">
          <div className="bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-gray-600">
            <User className="w-4 h-4 text-white" />
          </div>
        </Link>
      </div>
    </header>
  );
};

export default TopSearchHeader;
