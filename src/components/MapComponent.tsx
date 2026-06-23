'use client'

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet marker icon issue in Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface ReportMapProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  readonly?: boolean;
}

function LocationMarker({ position, setPosition, readonly }: ReportMapProps) {
  const map = useMapEvents({
    click(e) {
      if (!readonly) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
    locationfound(e) {
      if (!position && !readonly) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      }
    },
  });

  useEffect(() => {
    if (!readonly) {
      map.locate();
    } else if (position) {
      map.flyTo(position, 15);
    }
  }, [map, readonly, position]);

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function ReportMap({ position, setPosition, readonly = false, otherMarkers = [] }: ReportMapProps & { otherMarkers?: { lat: number, lng: number, category: string }[] }) {
  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden', position: 'relative' }}>
      <MapContainer 
        center={position || [ -6.200000, 106.816666 ]} // Default Jakarta
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} readonly={readonly} />
        
        {otherMarkers.map((marker, idx) => (
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={icon}>
          </Marker>
        ))}
      </MapContainer>
      
      {!readonly && (
        <button 
          type="button"
          onClick={(e) => {
            e.preventDefault();
            navigator.geolocation.getCurrentPosition((pos) => {
              setPosition([pos.coords.latitude, pos.coords.longitude]);
            }, (err) => {
              alert("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan.");
            });
          }}
          disabled={readonly}
          style={{ 
            position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 1000, 
            backgroundColor: 'white', border: 'none', padding: '0.5rem', 
            borderRadius: '50%', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}
          title="Lokasi Saat Ini"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
        </button>
      )}
    </div>
  );
}
