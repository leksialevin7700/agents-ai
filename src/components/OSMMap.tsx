import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
  type: string;
}

interface OSMMapProps {
  locations: Location[];
  onBookingSelect?: (hotelName: string) => void; // optional callback
  onRegionSelect?: (latlng: { lat: number; lng: number }) => void; // new callback for region click
}

const OSMMap: React.FC<OSMMapProps> = ({ locations, onBookingSelect, onRegionSelect }) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted || locations.length === 0) return null;

  const centerLat = locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
  const centerLng = locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;

  const hotelIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/2201/2201577.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });

  return (
    <div className="mt-4 rounded-xl overflow-hidden h-96">
      <MapContainer
        ref={mapRef}
        center={[centerLat, centerLng]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        whenReady={() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }}
        onClick={(e: L.LeafletMouseEvent) => {
          if (onRegionSelect) {
            onRegionSelect(e.latlng); // Pass lat/lng back to parent
          }
        }}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={[location.lat, location.lng]}
            icon={location.type === 'booking' ? hotelIcon : undefined}
          >
            <Popup>
              <div className="font-bold text-blue-600">{location.name}</div>
              <div className="text-sm">{location.description}</div>
              {location.type === 'booking' && onBookingSelect && (
                <button
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
                  onClick={() => onBookingSelect(location.name)}
                >
                  View Hotels
                </button>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default OSMMap;
