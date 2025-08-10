// src/BookingCard.tsx
import React from 'react';
import { Booking } from '../types'; // Ensure this is correctly imported

interface BookingCardProps {
  booking: Booking;
  onSelect: (booking: Booking) => void;
}
// src/BookingCard.tsx
export const BookingCard: React.FC<BookingCardProps> = ({ booking, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{booking.name}</h3>
          <p className="text-sm text-gray-500">{booking.location}</p>
          <div className="flex items-center mt-2">
            <span className="text-yellow-500 mr-1">⭐</span>
            <span>{booking.rating}/5</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-blue-600 font-bold">₹{booking.price}</span>
          <span className="text-sm text-gray-500">per night</span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {(booking.amenities || []).slice(0, 2).map((amenity) => (
          <span
            key={amenity}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
          >
            {amenity}
          </span>
        ))}
        {booking.amenities && booking.amenities.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs cursor-pointer hover:bg-gray-200">
            +{booking.amenities.length - 2} more
          </span>
        )}
      </div>

      <button 
        onClick={() => onSelect(booking)}
        className="w-full mt-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white py-2 rounded-lg hover:shadow-md transition-shadow"
      >
        Select Hotel
      </button>
    </div>
  );
};