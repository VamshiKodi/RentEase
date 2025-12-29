import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';

const NearbyMap = ({ center, housesWithCoords, onSelect }) => {
  if (!center) return null;

  const { latitude, longitude } = center;

  return (
    <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-md h-64">
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <CircleMarker
          center={[latitude, longitude]}
          pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9 }}
          radius={8}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            You
          </Tooltip>
        </CircleMarker>

        {/* Property markers */}
        {housesWithCoords.map(({ house, lat, lng }) => (
          <CircleMarker
            key={house._id}
            center={[lat, lng]}
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.9 }}
            radius={7}
            eventHandlers={{
              click: () => onSelect && onSelect(house._id),
            }}
          >
            <Tooltip direction="top" offset={[0, -4]}>
              {house.title}
              {typeof house.distanceKm === 'number' && !Number.isNaN(house.distanceKm)
                ? ` (${house.distanceKm.toFixed(1)} km)`
                : ''}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md text-xs text-gray-800">
        <div className="flex items-center space-x-2 mb-1">
          <span className="w-3 h-3 rounded-full bg-primary-600 border-2 border-white" />
          <span>You</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          <span>Nearby properties</span>
        </div>
      </div>
    </div>
  );
};

export default NearbyMap;
