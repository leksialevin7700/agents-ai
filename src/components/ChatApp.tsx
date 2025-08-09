// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Message, UserPreferences, Booking } from '../types';
import { ChatMessage } from './ChatMessage';
import { BookingCard } from './BookingCard';
//import { AttractionCard } from './AttractionCard';
import { VoiceRecorder } from './VoiceRecorder';
import { PreferenceSettings } from './PreferenceSettings';
import { TypingIndicator } from './TypingIndicator';
import OSMMap from './OSMMap'; // Add this
import { searchBookings, getAttractions } from '../services/mockApi';
import { Send, Plane, MapPin, Heart } from 'lucide-react';

// Add location type
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

  // Load saved preferences and chat history
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

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  // Add this useEffect to fix map loading issues
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
    return () => clearTimeout(timer);
  }, [locations]);

  // Save user preferences
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

  // Handle sending message to backend AI
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
    setShowBookings([]);

    // Format history
    const history = messages
      .slice(1) // Skip the initial greeting
      .map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        content: msg.text,
      }))
      .filter((msg) => msg.content);

    const fullHistory = history;
    setMapLoading(true);
 
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          history: fullHistory,
          preferences // Send user preferences to backend
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'AI request failed');

      let aiText = data.reply;
      let modifiedText = aiText;

      // ✅ Use locations returned from backend
      let newLocations: Location[] = data.locations || [];

      if (newLocations.length > 0) {
        const locationText = newLocations
          .map(loc => `- **${loc.name}** — ${loc.description}`)
          .join('\n');
        modifiedText += `\n\nHere are some places you might like:\n${locationText}`;
      } else {
        // Fallback JSON parsing
        const match = data.reply.match(/```json\n([\s\S]*?)\n```/);
        if (match) {
          try {
            const parsed = JSON.parse(match[1]);
            if (Array.isArray(parsed)) {
              newLocations = parsed;
            }
          } catch (err) {
            console.error("Failed to parse inline JSON locations", err);
          }
        }
      }

      if (newLocations.length > 0) {
        setLocations(newLocations);
      }


      // Handle booking trigger
      const bookingMatch = aiText.match(/\[SHOW_BOOKINGS\s+type=([^\s\]]+)/);
      if (bookingMatch) {
        const type = bookingMatch[1];
        const locMatch = aiText.match(/location=([^\s\]]+)/);
        const location = locMatch ? locMatch[1] : 'India';

        try {
          const results = await searchBookings({ type, location });
          setShowBookings(results);
          modifiedText = aiText.replace(/\[SHOW_BOOKINGS[^\]]*\]/g, '').trim();
          if (!modifiedText) {
            modifiedText = `Here are some ${type}s I found for you in ${location}:`;
          }
        } catch {
          modifiedText = "Sorry, I couldn't load bookings right now.";
        }
      }

      // Handle attraction trigger
      const attractionMatch = aiText.match(/\[SHOW_ATTRACTIONS\s+location=([^\]]+)/);
      if (attractionMatch) {
        const location = attractionMatch[1];
        const attractions = getAttractions(location);
        if (attractions.length > 0) {
          modifiedText = `${location} has some amazing attractions! Here are the top recommendations for you:`;
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

  // Handle booking selection
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
  };

  // Handle voice input
  const handleVoiceTranscript = (transcript: string) => {
    setInputValue(transcript);
  };

  // Detect attractions from last message
  // const lastUserMessage =
  //   messages.length > 0
  //     ? messages[messages.length - 1]?.text || messages[messages.length - 2]?.text
  //     : '';
  // const attractionLocation = extractLocationFromMessage(lastUserMessage); // Simple helper
  // const attractions = attractionLocation ? getAttractions(attractionLocation) : [];

  // // Dummy helper (replace with NLP or use Gemini to extract)
  // function extractLocationFromMessage(text: string): string | null {
  //   const locations = ['Jaipur', 'Goa', 'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Agra', 'Pune'];
  //   for (const loc of locations) {
  //     if (text.toLowerCase().includes(loc.toLowerCase())) return loc;
  //   }
  //   return null;
  // }

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
                {locations.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-bold text-blue-700 mb-2">Recommended Locations:</h3>
                    {mapLoading && <p className="text-sm text-gray-500">Loading map...</p>}
                    <OSMMap locations={locations} />
                  </div>
                )}
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
                <button onClick={() => handleSendMessage('Book a hotel')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  🏨 Book Hotels
                </button>
                <button onClick={() => handleSendMessage('Book a flight')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  ✈️ Book Flights
                </button>
                <button onClick={() => handleSendMessage('Book a train')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  🚂 Book Trains
                </button>
                <button onClick={() => handleSendMessage('Things to do in Jaipur')} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                  🗺️ Find Attractions
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
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bookings */}
        {showBookings.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Plane className="text-blue-500" size={24} />
              Available Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {showBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} onSelect={handleBookingSelect} />
              ))}
            </div>
          </div>
        )}

        {/* Attractions */}
        {/* {attractions.length > 0 && showBookings.length === 0 && (
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
        )} */}
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