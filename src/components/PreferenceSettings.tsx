import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Settings, X } from 'lucide-react';

interface PreferenceSettingsProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
}

export const PreferenceSettings: React.FC<PreferenceSettingsProps> = ({ preferences, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempPreferences, setTempPreferences] = useState<UserPreferences>(preferences);

  const handleSave = () => {
    onSave(tempPreferences);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        title="Settings"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Travel Preferences</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Food Preference
                </label>
                <select
                  value={tempPreferences.foodType || ''}
                  onChange={(e) => setTempPreferences({ ...tempPreferences, foodType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accommodation Type
                </label>
                <select
                  value={tempPreferences.accommodationType || ''}
                  onChange={(e) => setTempPreferences({ ...tempPreferences, accommodationType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No preference</option>
                  <option value="budget">Budget Hotels</option>
                  <option value="mid-range">Mid-Range Hotels</option>
                  <option value="luxury">Luxury Hotels</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  value={tempPreferences.budget || ''}
                  onChange={(e) => setTempPreferences({ ...tempPreferences, budget: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No preference</option>
                  <option value="budget">Budget (Under ₹3,000)</option>
                  <option value="mid-range">Mid-Range (₹3,000-₹8,000)</option>
                  <option value="luxury">Luxury (Above ₹8,000)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Style
                </label>
                <select
                  value={tempPreferences.travelStyle || ''}
                  onChange={(e) => setTempPreferences({ ...tempPreferences, travelStyle: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">No preference</option>
                  <option value="adventure">Adventure</option>
                  <option value="relaxation">Relaxation</option>
                  <option value="cultural">Cultural</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-md"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};