"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { MapPin } from "lucide-react";
import { renderToString } from "react-dom/server";

interface MapProps {
  center: LatLngExpression;
  zoom?: number;
  className?: string;
  children?: ReactNode;
}

export function Map({ center, zoom = 13, className, children }: MapProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className={cn("h-full w-full z-0", className)}
    >
      {children}
    </MapContainer>
  );
}

interface MapTileLayerProps {
  url?: string;
  attribution?: string;
}

export function MapTileLayer({ 
  url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}: MapTileLayerProps = {}) {
  return (
    <TileLayer
      attribution={attribution}
      url={url}
    />
  );
}

// Default marker icon component
function DefaultMarkerIcon() {
  return (
    <div className="relative">
      <MapPin className="w-8 h-8 text-red-600 fill-red-500 drop-shadow-lg" strokeWidth={1.5} />
    </div>
  );
}

interface MapMarkerProps {
  position: LatLngExpression;
  icon?: ReactNode;
  iconAnchor?: [number, number];
  popupAnchor?: [number, number];
  children?: ReactNode;
}

export function MapMarker({ 
  position, 
  icon,
  iconAnchor = [16, 32],
  popupAnchor = [0, -32],
  children 
}: MapMarkerProps) {
  const iconElement = icon || <DefaultMarkerIcon />;
  
  const divIcon = L.divIcon({
    html: renderToString(iconElement as any),
    className: "custom-marker-icon",
    iconAnchor,
    popupAnchor,
  });

  return (
    <Marker position={position} icon={divIcon}>
      {children && <Popup>{children}</Popup>}
    </Marker>
  );
}
