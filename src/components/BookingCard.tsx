import React from 'react';
import { Booking } from '../types';
import { MapPin, Star, Clock, Users, Plane, Train, Building } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onSelect: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking, onSelect }) => {
  const getIcon = () => {
    switch (booking.type) {
      case 'hotel': return <Building className="text-blue-500" size={20} />;
      case 'flight': return <Plane className="text-green-500" size={20} />;
      case 'train': return <Train className="text-purple-500" size={20} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-100"
         onClick={() => onSelect(booking)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="font-semibold text-gray-800">{booking.name}</h3>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">₹{booking.price.toLocaleString()}</div>
          <div className="text-xs text-gray-500">per night</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={14} className="text-gray-400" />
        <span className="text-sm text-gray-600">{booking.location}</span>
      </div>
      
      {booking.rating && (
        <div className="flex items-center gap-1 mb-2">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span className="text-sm text-gray-600">{booking.rating}</span>
        </div>
      )}
      
      {booking.time && (
        <div className="flex items-center gap-2 mb-2">
          <Clock size={14} className="text-gray-400" />
          <span className="text-sm text-gray-600">{booking.time}</span>
        </div>
      )}
      
      {booking.amenities && (
        <div className="flex flex-wrap gap-1 mt-3">
          {booking.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {amenity}
            </span>
          ))}
          {booking.amenities.length > 3 && (
            <span className="text-xs text-gray-500">+{booking.amenities.length - 3} more</span>
          )}
        </div>
      )}
      
      <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 rounded-lg hover:shadow-md transition-shadow">
        Select {booking.type === 'hotel' ? 'Hotel' : booking.type === 'flight' ? 'Flight' : 'Train'}
      </button>
    </div>
  );
};