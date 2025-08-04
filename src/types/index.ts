export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'booking' | 'recommendation';
}

export interface UserPreferences {
  foodType?: string;
  accommodationType?: string;
  budget?: string;
  travelStyle?: string;
}

export interface BookingRequest {
  type: 'hotel' | 'flight' | 'train';
  location?: string;
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  date?: string;
  passengers?: number;
  class?: string;
}

export interface Booking {
  id: string;
  type: 'hotel' | 'flight' | 'train';
  name: string;
  location: string;
  price: number;
  rating?: number;
  amenities?: string[];
  time?: string;
  class?: string;
}

export interface Attraction {
  name: string;
  description: string;
  rating: number;
  mapLink: string;
}