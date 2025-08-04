import { Booking, Attraction, BookingRequest } from '../types';

export const mockHotels: Booking[] = [
  {
    id: '1',
    type: 'hotel',
    name: 'Sea Breeze Resort',
    location: 'Goa',
    price: 2500,
    rating: 4.2,
    amenities: ['Pool', 'WiFi', 'Breakfast', 'Beach Access']
  },
  {
    id: '2',
    type: 'hotel',
    name: 'Mountain View Lodge',
    location: 'Manali',
    price: 3200,
    rating: 4.5,
    amenities: ['Mountain View', 'Heating', 'Restaurant', 'Spa']
  },
  {
    id: '3',
    type: 'hotel',
    name: 'City Center Inn',
    location: 'Mumbai',
    price: 4500,
    rating: 4.0,
    amenities: ['City View', 'Gym', 'Business Center', 'Airport Shuttle']
  }
];

export const mockFlights: Booking[] = [
  {
    id: '4',
    type: 'flight',
    name: 'IndiGo 6E-234',
    location: 'Mumbai → Delhi',
    price: 5500,
    time: '08:30 - 10:45',
    class: 'Economy'
  },
  {
    id: '5',
    type: 'flight',
    name: 'Air India AI-131',
    location: 'Delhi → Bangalore',
    price: 7200,
    time: '14:20 - 17:05',
    class: 'Economy'
  }
];

export const mockTrains: Booking[] = [
  {
    id: '6',
    type: 'train',
    name: 'Rajdhani Express',
    location: 'Mumbai → Delhi',
    price: 2800,
    time: '16:55 - 08:35+1',
    class: '2AC'
  },
  {
    id: '7',
    type: 'train',
    name: 'Shatabdi Express',
    location: 'Delhi → Chandigarh',
    price: 1450,
    time: '07:40 - 11:20',
    class: 'CC'
  }
];

export const attractions: Record<string, Attraction[]> = {
  jaipur: [
    {
      name: 'Amber Fort',
      description: 'Historic fortified palace with stunning architecture',
      rating: 4.6,
      mapLink: 'https://maps.google.com/?q=Amber+Fort+Jaipur'
    },
    {
      name: 'Hawa Mahal',
      description: 'Iconic pink sandstone palace facade',
      rating: 4.4,
      mapLink: 'https://maps.google.com/?q=Hawa+Mahal+Jaipur'
    },
    {
      name: 'City Palace',
      description: 'Royal palace complex with museums and courtyards',
      rating: 4.5,
      mapLink: 'https://maps.google.com/?q=City+Palace+Jaipur'
    }
  ],
  goa: [
    {
      name: 'Baga Beach',
      description: 'Popular beach with water sports and nightlife',
      rating: 4.3,
      mapLink: 'https://maps.google.com/?q=Baga+Beach+Goa'
    },
    {
      name: 'Dudhsagar Falls',
      description: 'Spectacular four-tiered waterfall',
      rating: 4.7,
      mapLink: 'https://maps.google.com/?q=Dudhsagar+Falls+Goa'
    }
  ]
};

export const searchBookings = async (request: BookingRequest): Promise<Booking[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  switch (request.type) {
    case 'hotel':
      return mockHotels.filter(hotel => 
        !request.location || hotel.location.toLowerCase().includes(request.location.toLowerCase())
      );
    case 'flight':
      return mockFlights.filter(flight =>
        !request.location || flight.location.toLowerCase().includes(request.location.toLowerCase())
      );
    case 'train':
      return mockTrains.filter(train =>
        !request.location || train.location.toLowerCase().includes(request.location.toLowerCase())
      );
    default:
      return [];
  }
};

export const getAttractions = (location: string): Attraction[] => {
  const key = location.toLowerCase().replace(/\s+/g, '');
  return attractions[key] || [];
};