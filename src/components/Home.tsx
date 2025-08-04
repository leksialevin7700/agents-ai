import React, { useState } from 'react';
import { Plane, MapPin, Calendar, Users, Star, ArrowRight, Globe, Camera, Heart } from 'lucide-react';

// Mock Router Link component for demonstration
const Link = ({ to, children, className }) => (
  <a href={to} className={className}>{children}</a>
);

const Home = () => {
  const [isVisible, setIsVisible] = useState(true);

  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Smart Destinations",
      description: "AI-powered recommendations based on your preferences and travel style"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Intelligent Planning",
      description: "Optimized itineraries that maximize your time and experiences"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Group Travel",
      description: "Coordinate with friends and family for seamless group adventures"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Coverage",
      description: "Discover hidden gems and popular attractions worldwide"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "San Francisco, CA",
      text: "TravelMate AI planned our entire European trip perfectly! Saved us hours of research.",
      rating: 5
    },
    {
      name: "Marcus Johnson",
      location: "Austin, TX", 
      text: "The AI suggestions were spot-on. Found amazing local restaurants we never would have discovered.",
      rating: 5
    },
    {
      name: "Elena Rodriguez",
      location: "Miami, FL",
      text: "Best travel planning experience ever. The chat feature feels like having a personal travel agent.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            {/* Animated Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 shadow-lg animate-bounce">
              <Plane className="w-10 h-10 text-white transform rotate-45" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              TravelMate AI
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              Your intelligent travel companion that crafts personalized adventures
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
              Chat with AI • Discover Attractions • Plan Seamlessly • Travel Confidently
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/chat"
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                Start Planning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-6 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl border border-gray-200 hover:bg-white transition-all duration-300"
                >
                  Login
                </Link>
                
                <Link
                  to="/register"
                  className="px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 mb-16">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">50K+ Happy Travelers</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span className="font-medium">200+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Why Choose TravelMate AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning with our intelligent features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our community is saying
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <Camera className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TravelMate AI to create unforgettable experiences
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Plane className="w-6 h-6 transform rotate-45" />
            <span className="text-xl font-bold">TravelMate AI</span>
          </div>
          <p className="text-gray-400 mb-4">
            Making travel planning intelligent, personal, and effortless
          </p>
          <div className="flex justify-center gap-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition">Terms</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;