import React, { useState, useEffect, useRef } from 'react';
import { Message, UserPreferences, Booking } from '../types';
import { ChatMessage } from './ChatMessage';
import { BookingCard } from './BookingCard';
import { VoiceRecorder } from './VoiceRecorder';
import { PreferenceSettings } from './PreferenceSettings';
import { TypingIndicator } from './TypingIndicator';
import OSMMap from './OSMMap';
import { searchBookings, getAttractions } from '../services/mockApi';
import { Send, Plane, MapPin, Heart } from 'lucide-react';

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
  type: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({});
  const [showBookings, setShowBookings] = useState<Booking[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mapLoading, setMapLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"map" | "list">("map");
  const [bookingRequested, setBookingRequested] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('travel-preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
    const savedChat = localStorage.getItem('chat-messages');
    const greeted = localStorage.getItem('initial-greeting-sent');
    if (savedChat && JSON.parse(savedChat).length > 1) {
      setMessages(JSON.parse(savedChat));
    } else {
      const greeting: Message = {
        id: '1',
        text: "Hello! I'm your AI Travel Concierge 🌟 How can I help you today? I can book hotels, flights, trains, recommend attractions, or remember your preferences for future trips!",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages([greeting]);
    }
    if (!greeted) {
      localStorage.setItem('initial-greeting-sent', 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    return () => clearTimeout(timer);
  }, [locations]);

  const savePreferences = (newPreferences: UserPreferences) => {
    setPreferences({ ...preferences, ...newPreferences });
    localStorage.setItem('travel-preferences', JSON.stringify({ ...preferences, ...newPreferences }));
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: "Perfect! I've saved your preferences. I'll keep them in mind for all future recommendations! 🎯",
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    };
    setMessages((prev) => [...prev, confirmationMessage]);
  };

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user' as const,
      timestamp: new Date(),
      type: 'text' as const,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setMapLoading(true);
    
    // Set booking flag if user requests accommodation
    const isBookingRequest = /book|hotel|stay|accommodation|reservation|place to stay/i.test(text);
    setBookingRequested(isBookingRequest);
    
    // Only clear previous bookings if it's a new booking request
    if (isBookingRequest) {
      setShowBookings([]);
      setLocations([]);
    }

    const history = messages
      .slice(1)
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.text,
      }))
      .filter((msg) => msg.content);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history,
          preferences
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI request failed');

      let aiText = data.reply;
      let modifiedText = aiText;
      
      // 🏨 Hotel Fetching
      if (isBookingRequest || /\[SHOW_BOOKINGS\s+type=hotel/i.test(aiText)) {
      const locMatch = aiText.match(/location=([^\s\]]+)/);
      const locationName = locMatch ? locMatch[1] : preferences?.destination || "India";

      try {
        // Geocode location name
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
        );
        const geoData = await geoRes.json();
        if (geoData.length > 0) {
          const { lat, lon } = geoData[0];

          // Fetch hotels from backend
          const hotelRes = await fetch(`/api/hotels?lat=${lat}&lng=${lon}`);
          const hotels: Booking[] = await hotelRes.json();

            if (hotels.length > 0) {
            setShowBookings(hotels);
            setLocations(
              hotels.map((h) => ({
                name: h.name,
                lat: h.lat || 0,
                lng: h.lng || 0,
                description: h.description || "Hotel in the selected area",
                type: "booking"
              }))
            );

            modifiedText = `Here are the best hotels in ${locationName}:`;
          } else {
            modifiedText += "\n";
          }
        } else {
          modifiedText += "\nSorry, I couldn't locate that destination. Please try a different location name.";
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
        modifiedText += "\n\n⚠️ Failed to load hotel data. Please try again later.";
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: modifiedText,
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't connect to the AI service. Please try again later.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      setMapLoading(false);
    }
  };

  const handleRegionSelect = async (latlng: { lat: number; lng: number }) => {
    try {
      setMapLoading(true);
      const res = await fetch(`/api/hotels?lat=${latlng.lat}&lng=${latlng.lng}`);
      const hotels = await res.json();
      setLocations(hotels.map((h: Booking) => ({
        name: h.name,
        lat: h.lat || 0,
        lng: h.lng || 0,
        description: h.description || "Hotel in the area",
        type: "booking"
      })));
      setShowBookings(hotels);
      setActiveTab("map");
    } catch (err) {
      console.error("Error fetching hotels:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "⚠️ Failed to load hotels for this area. Please try another location.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setMapLoading(false);
    }
  };

  const handleBookingSelect = (booking: Booking) => {
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `Perfect choice! I've selected ${booking.name} for you. The total cost is ₹${booking.price.toLocaleString()}. Shall I proceed with the booking confirmation? 🎉`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'text',
    };
    setMessages((prev) => [...prev, confirmationMessage]);
    setShowBookings([]);
    setLocations([]);
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
  };
  
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
          {/* Chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about your travel plans..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    disabled={isTyping}
                  />
                  <VoiceRecorder onTranscript={handleVoiceTranscript} />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    className="p-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl hover:shadow-md transition-shadow disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Heart className="text-red-500" size={18} />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={() => handleSendMessage('Book a hotel in Jaipur')} 
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <span className="bg-blue-100 p-1 rounded-lg">🏨</span> Book Hotels
                </button>
                <button 
                  onClick={() => handleSendMessage('Book a flight from Delhi to Mumbai')} 
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <span className="bg-blue-100 p-1 rounded-lg">✈️</span> Book Flights
                </button>
                <button 
                  onClick={() => handleSendMessage('Book a train from Bangalore to Chennai')} 
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <span className="bg-blue-100 p-1 rounded-lg">🚂</span> Book Trains
                </button>
                <button 
                  onClick={() => handleSendMessage('Things to do in Jaipur')} 
                  className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg flex items-center gap-2"
                >
                  <span className="bg-blue-100 p-1 rounded-lg">🗺️</span> Find Attractions
                </button>
              </div>
            </div>

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
                      <span className="ml-2 capitalize bg-green-50 px-2 py-1 rounded-full text-xs">
                        {preferences.foodType}
                      </span>
                    </div>
                  )}
                  {preferences.accommodationType && (
                    <div className="text-sm">
                      <span className="text-gray-500">Hotels:</span>
                      <span className="ml-2 capitalize bg-blue-50 px-2 py-1 rounded-full text-xs">
                        {preferences.accommodationType}
                      </span>
                    </div>
                  )}
                  {preferences.budget && (
                    <div className="text-sm">
                      <span className="text-gray-500">Budget:</span>
                      <span className="ml-2 capitalize bg-purple-50 px-2 py-1 rounded-full text-xs">
                        {preferences.budget}
                      </span>
                    </div>
                  )}
                  {preferences.destination && (
                    <div className="text-sm">
                      <span className="text-gray-500">Destination:</span>
                      <span className="ml-2 capitalize bg-yellow-50 px-2 py-1 rounded-full text-xs">
                        {preferences.destination}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ 1. AVAILABILITY BOX: Hotel Booking Cards */}
        {showBookings.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plane className="text-blue-500" size={24} />
              Available Accommodations
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

        {/* ✅ 2. MAP SECTION: Show hotel locations on map */}
        {showBookings.length > 0 && locations.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="text-green-500" size={20} />
              Hotel Locations on Map
            </h3>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
              <OSMMap 
                locations={locations} 
                onRegionSelect={handleRegionSelect} 
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white border-t border-gray-100 mt-12">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center">
            <p className="text-gray-500 text-sm">
              AI Travel Concierge - Making your travel dreams come true, one conversation at a time ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;