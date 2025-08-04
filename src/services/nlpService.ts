import { BookingRequest, UserPreferences } from '../types';

export const extractBookingIntent = (message: string): BookingRequest | null => {
  const lowerMessage = message.toLowerCase();
  
  // Hotel booking patterns
  if (lowerMessage.includes('hotel') || lowerMessage.includes('accommodation') || lowerMessage.includes('stay')) {
    const location = extractLocation(message);
    const dates = extractDates(message);
    
    return {
      type: 'hotel',
      location,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut
    };
  }
  
  // Flight booking patterns
  if (lowerMessage.includes('flight') || lowerMessage.includes('fly to') || lowerMessage.includes('plane')) {
    const location = extractLocation(message);
    const date = extractSingleDate(message);
    
    return {
      type: 'flight',
      destination: location,
      date
    };
  }
  
  // Train booking patterns
  if (lowerMessage.includes('train') || lowerMessage.includes('railway')) {
    const location = extractLocation(message);
    const date = extractSingleDate(message);
    
    return {
      type: 'train',
      destination: location,
      date
    };
  }
  
  return null;
};

export const extractPreferences = (message: string): Partial<UserPreferences> => {
  const lowerMessage = message.toLowerCase();
  const preferences: Partial<UserPreferences> = {};
  
  // Food preferences
  if (lowerMessage.includes('vegetarian') || lowerMessage.includes('veg')) {
    preferences.foodType = 'vegetarian';
  } else if (lowerMessage.includes('non-vegetarian') || lowerMessage.includes('non-veg')) {
    preferences.foodType = 'non-vegetarian';
  }
  
  // Accommodation preferences
  if (lowerMessage.includes('budget') || lowerMessage.includes('cheap')) {
    preferences.accommodationType = 'budget';
    preferences.budget = 'budget';
  } else if (lowerMessage.includes('luxury') || lowerMessage.includes('5 star')) {
    preferences.accommodationType = 'luxury';
    preferences.budget = 'luxury';
  }
  
  return preferences;
};

export const isAttractionQuery = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('things to do') || 
      lowerMessage.includes('attractions') || 
      lowerMessage.includes('places to visit') ||
      lowerMessage.includes('what to see')) {
    return extractLocation(message);
  }
  
  return null;
};

const extractLocation = (message: string): string => {
  const cities = ['mumbai', 'delhi', 'bangalore', 'goa', 'jaipur', 'chennai', 'kolkata', 'hyderabad', 'pune', 'manali'];
  const lowerMessage = message.toLowerCase();
  
  for (const city of cities) {
    if (lowerMessage.includes(city)) {
      return city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  
  // Try to extract location after common prepositions
  const locationPatterns = [/(?:to|in|at|near)\s+([a-zA-Z\s]+)/g];
  
  for (const pattern of locationPatterns) {
    const match = pattern.exec(lowerMessage);
    if (match && match[1]) {
      return match[1].trim().charAt(0).toUpperCase() + match[1].trim().slice(1);
    }
  }
  
  return '';
};

const extractDates = (message: string): { checkIn?: string; checkOut?: string } => {
  const dates: { checkIn?: string; checkOut?: string } = {};
  
  // Simple date extraction - in a real app, use a proper date parsing library
  const datePattern = /(\w+\s+\d{1,2}(?:\s+to\s+\d{1,2})?)/g;
  const matches = message.match(datePattern);
  
  if (matches && matches[0]) {
    const parts = matches[0].split(' to ');
    dates.checkIn = parts[0];
    if (parts[1]) {
      dates.checkOut = parts[1];
    }
  }
  
  return dates;
};

const extractSingleDate = (message: string): string => {
  const datePattern = /(?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|\w+\s+\d{1,2})/i;
  const match = message.match(datePattern);
  return match ? match[0] : '';
};