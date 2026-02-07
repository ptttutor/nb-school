"use client";

import { Map, MapTileLayer, MapMarker } from "@/components/ui/map";
import type { LatLngExpression } from "leaflet";

const SCHOOL_COORDINATES = [15.86532, 100.60036] satisfies LatLngExpression;

export default function SchoolMap() {
  return (
    <Map center={SCHOOL_COORDINATES} zoom={16}>
      <MapTileLayer />
      <MapMarker position={SCHOOL_COORDINATES}>
        <div className="text-center">
          <h3 className="font-bold text-lg text-amber-900">โรงเรียนหนองบัว</h3>
          <p className="text-sm text-gray-700">อำเภอหนองบัว จังหวัดนครสวรรค์</p>
          <p className="text-xs text-gray-600 mt-1">โทร: 056-251281</p>
        </div>
      </MapMarker>
    </Map>
  );
}
