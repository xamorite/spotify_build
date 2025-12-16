// app/components/circularArtistCard.js
import React from 'react';
import Image from 'next/image';

const CircularArtistCard = ({ artistName, subscriberCount, imageUrl, className }) => {
  return (
    <div className={`cursor-pointer group flex flex-col items-center text-center ${className || ''}`}>
      {/* Circular Image Area */}
      <div className="w-full aspect-square rounded-full overflow-hidden mb-3 relative shadow-lg group-hover:shadow-2xl transition-shadow">
        {imageUrl ? (
            <Image 
                src={imageUrl} 
                alt={artistName}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 150px, 200px"
            />
        ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
            <span className="text-3xl text-gray-400 font-bold">{artistName?.charAt(0) || "A"}</span>
            </div>
        )}
      </div>
      
      {/* Text Content */}
      <h4 className="text-md font-bold truncate w-full group-hover:text-green-400 transition-colors">{artistName}</h4>
      <p className="text-xs text-gray-400 mt-1">{subscriberCount}</p>
    </div>
  );
};

export default CircularArtistCard;