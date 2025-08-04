import React, { useState, useEffect, useRef } from 'react';
import { Message, UserPreferences, Booking, BookingRequest } from '../types';
import { ChatMessage } from './ChatMessage';
import { BookingCard } from './BookingCard';
import { AttractionCard } from './AttractionCard';
import { VoiceRecorder } from './VoiceRecorder';
import { PreferenceSettings } from './PreferenceSettings';
import { TypingIndicator } from './TypingIndicator';
import { extractBookingIntent, extractPreferences, isAttractionQuery } from '../services/nlpService';
import { searchBookings, getAttractions } from '../services/mockApi';
import { Send, Plane, MapPin, Heart } from 'lucide-react';


function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [showBookings, setShowBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  


  useEffect(() => {
    // Load preferences from localStorage
    const saved = localStorage.getItem('travel-preferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }

    // Initial greeting
    const greeting: Message = {
      id: '1',
      text: "Hello! I'm your AI Travel Concierge 🌟 How can I help you today? I can book hotels, flights, trains, recommend attractions, or remember your preferences for future trips!",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    setMessages([greeting]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('travel-preferences', JSON.stringify(newPreferences));
    
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: "Perfect! I've saved your preferences. I'll keep them in mind for all future recommendations! 🎯",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for booking intent
    const bookingIntent = extractBookingIntent(userMessage);
    if (bookingIntent) {
      setIsLoading(true);
      try {
        const results = await searchBookings(bookingIntent);
        setShowBookings(results);
        
        if (results.length > 0) {
          const type = bookingIntent.type;
          const location = bookingIntent.location || bookingIntent.destination || 'your destination';
          return `Great! I found ${results.length} ${type}${results.length > 1 ? 's' : ''} for ${location}. Check out the options below and let me know which one you'd like to book! ✈️`;
        } else {
          return `I couldn't find any ${bookingIntent.type}s matching your criteria. Could you try a different location or dates?`;
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    // Check for preference updates
    const newPreferences = extractPreferences(userMessage);
    if (Object.keys(newPreferences).length > 0) {
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);
      localStorage.setItem('travel-preferences', JSON.stringify(updatedPreferences));
      
      const prefList = Object.entries(newPreferences).map(([key, value]) => `${key}: ${value}`).join(', ');
      return `Excellent! I've noted your preferences: ${prefList}. I'll make sure to suggest ${newPreferences.foodType || newPreferences.accommodationType} options in future recommendations! 📝`;
    }
    
    // Check for attraction queries
    const attractionLocation = isAttractionQuery(userMessage);
    if (attractionLocation) {
      const attractions = getAttractions(attractionLocation);
      if (attractions.length > 0) {
        // We'll show attraction cards separately
        return `${attractionLocation} has some amazing attractions! Here are the top recommendations for you:`;
      } else {
        return `I'd love to help with attractions in ${attractionLocation}, but I don't have specific information for that location yet. Try asking about popular destinations like Jaipur, Goa, or Delhi!`;
      }
    }
    
    // General responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm here to help make your travel dreams come true! Whether you need hotels, flights, trains, or local recommendations, just let me know! 🌍";
    }
    
    if (lowerMessage.includes('thank')) {
      return "You're most welcome! I'm always here to help make your travels amazing! Is there anything else you'd like to explore? 😊";
    }
    
    // Default helpful response
    return "I'm here to help with all your travel needs! You can ask me to:\n\n• Book hotels, flights, or trains\n• Find attractions and restaurants\n• Set your travel preferences\n• Get recommendations based on your style\n\nWhat would you like to do? 🗺️";
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setShowBookings([]);
    
    // Simulate typing delay
    setTimeout(async () => {
      const response = await generateAIResponse(text);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Show attractions if applicable
      const attractionLocation = isAttractionQuery(text);
      if (attractionLocation && getAttractions(attractionLocation).length > 0) {
        // Attractions will be shown via the showBookings state being empty
        // and the attraction location being detected
      }
    }, 1500);
  };

  const handleBookingSelect = (booking: Booking) => {
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect choice! I've selected ${booking.name} for you. The total cost is ₹${booking.price.toLocaleString()}. Shall I proceed with the booking confirmation? 🎉`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
    setShowBookings([]);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
  };

  const lastUserMessage = messages.length > 0 ? messages[messages.length - 1]?.text || messages[messages.length - 2]?.text : '';
  const attractionLocation = isAttractionQuery(lastUserMessage);
  const attractions = attractionLocation ? getAttractions(attractionLocation) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <Plane className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  AI Travel Concierge
                </h1>
                <p className="text-sm text-gray-500">Your personal travel assistant</p>
              </div>
            </div>
            <PreferenceSettings preferences={preferences} onSave={savePreferences} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask me anything about your travel plans..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      disabled={isTyping}
                    />
                  </div>
                  <VoiceRecorder onTranscript={handleVoiceTranscript} />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="text-red-500" size={18} />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleSendMessage('Book a hotel')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  🏨 Book Hotels
                </button>
                <button
                  onClick={() => handleSendMessage('Book a flight')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  ✈️ Book Flights
                </button>
                <button
                  onClick={() => handleSendMessage('Book a train')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  🚂 Book Trains
                </button>
                <button
                  onClick={() => handleSendMessage('Things to do in Jaipur')}
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  🗺️ Find Attractions
                </button>
              </div>
            </div>

            {/* User Preferences */}
            {Object.keys(preferences).length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin className="text-green-500" size={18} />
                  Your Preferences
                </h3>
                <div className="space-y-2">
                  {preferences.foodType && (
                    <div className="text-sm">
                      <span className="text-gray-500">Food:</span>
                      <span className="ml-2 text-gray-800 capitalize bg-green-50 px-2 py-1 rounded-full text-xs">
                        {preferences.foodType}
                      </span>
                    </div>
                  )}
                  {preferences.accommodationType && (
                    <div className="text-sm">
                      <span className="text-gray-500">Hotels:</span>
                      <span className="ml-2 text-gray-800 capitalize bg-blue-50 px-2 py-1 rounded-full text-xs">
                        {preferences.accommodationType}
                      </span>
                    </div>
                  )}
                  {preferences.budget && (
                    <div className="text-sm">
                      <span className="text-gray-500">Budget:</span>
                      <span className="ml-2 text-gray-800 capitalize bg-purple-50 px-2 py-1 rounded-full text-xs">
                        {preferences.budget}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings Grid */}
        {showBookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plane className="text-blue-500" size={24} />
              Available Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onSelect={handleBookingSelect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Attractions Grid */}
        {attractions.length > 0 && showBookings.length === 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="text-green-500" size={24} />
              Top Attractions in {attractionLocation}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attractions.map((attraction, index) => (
                <AttractionCard key={index} attraction={attraction} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <p className="text-gray-500 text-sm">
            AI Travel Concierge - Making your travel dreams come true, one conversation at a time ✨
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
