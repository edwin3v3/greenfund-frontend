import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function FarmMap({ farm }) {
  const position = [farm.latitude, farm.longitude];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Farm Location</h2>
      <div className="h-96 rounded-lg overflow-hidden z-0">
        <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              {farm.name} <br /> {farm.location_text}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default FarmMap;