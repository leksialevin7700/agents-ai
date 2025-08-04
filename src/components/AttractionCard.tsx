import React from 'react';
import { Attraction } from '../types';
import { MapPin, Star, ExternalLink } from 'lucide-react';

interface AttractionCardProps {
  attraction: Attraction;
}

export const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 text-lg">{attraction.name}</h3>
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="text-sm font-medium text-gray-600">{attraction.rating}</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {attraction.description}
      </p>
      
      <a
        href={attraction.mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-shadow text-sm font-medium"
      >
        <MapPin size={16} />
        View on Maps
        <ExternalLink size={14} />
      </a>
    </div>
  );
};