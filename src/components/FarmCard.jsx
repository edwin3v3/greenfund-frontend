import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiMaximize, FiClipboard } from 'react-icons/fi';

function FarmCard({ farm }) {
  return (
    <Link to={`/app/farms/${farm.id}`} className="block">
      <div className="bg-surface rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col p-6 border border-gray-100">
        <h3 className="text-xl font-bold text-text-primary mb-2">{farm.name}</h3>
        
        <div className="space-y-3 text-sm text-text-secondary flex-grow">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-primary" />
            <span>{farm.location_text}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiMaximize className="text-primary" />
            <span>{farm.size_acres} acres</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClipboard className="text-primary" />
            <span>Current Crop: {farm.current_crop || 'N/A'}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <span className="text-primary font-semibold hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default FarmCard;