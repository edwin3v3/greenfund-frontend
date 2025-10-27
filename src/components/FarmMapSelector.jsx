import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Fix for default Leaflet icon ---
// This prevents the default marker icon from being broken
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41] // Point of the icon which will correspond to marker's location
});

L.Marker.prototype.options.icon = DefaultIcon;
// --- End icon fix ---


// This component listens for map clicks and calls the onSelect prop
function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng); // Pass the {lat, lng} object up
    },
  });
  return null; // This component doesn't render anything itself
}

// This component ensures the map re-centers when the 'center' prop changes
function ChangeView({ center, zoom }) {
  const map = useMapEvents({}); // Use empty events to get map instance
  map.setView(center, zoom);
  return null;
}

function FarmMapSelector({ center, onSelect }) {
  const [position, setPosition] = useState(center);

  // Memoize the event handler to prevent unnecessary re-renders
  const handleMapClick = useMemo(
    () => (latlng) => {
      setPosition([latlng.lat, latlng.lng]);
      onSelect(latlng);
    },
    [onSelect]
  );

  return (
    <MapContainer 
        center={position} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={position} zoom={13} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position} />
      <MapClickHandler onSelect={handleMapClick} />
    </MapContainer>
  );
}

export default FarmMapSelector;