"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLanguage } from "./language-provider";

let icon: L.Icon | undefined;
if (typeof window !== "undefined") {
  icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

interface LeafletMapProps {
  address?: string;
  className?: string;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, { animate: true, duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function LeafletMap({ address = "Dhaka, Bangladesh", className = "" }: LeafletMapProps) {
  const lang = useLanguage();
  // Default Dhaka coordinates
  const [coords, setCoords] = useState<[number, number]>([23.8103, 90.4125]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address || address === "Enter location to preview...") return;
    
    let isMounted = true;
    const fetchCoords = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (isMounted && data && data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchCoords, 1000); // Debounce to prevent spamming the free API
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [address]);

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md ${className}`}>
      <MapContainer 
        center={coords} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={coords} />
        <Marker position={coords} icon={icon as L.Icon}>
          <Popup>
            <div className="font-semibold">{address}</div>
          </Popup>
        </Marker>
      </MapContainer>
      {loading && (
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold shadow-lg border border-white/20 z-1000 flex items-center gap-2 text-primary">
          <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          {lang === 'en' ? 'Locating...' : 'খোঁজ করা হচ্ছে...'}
        </div>
      )}
    </div>
  );
}
