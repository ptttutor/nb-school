"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const SCHOOL_COORDINATES: [number, number] = [15.86532, 100.60036];

// Dynamically import map component to prevent SSR issues
const DynamicMap = dynamic(
  () => import("@/components/home/SchoolMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] rounded-lg bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">กำลังโหลดแผนที่...</p>
      </div>
    )
  }
);

export function LocationSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            ที่อยู่โรงเรียน
          </h2>
          <p className="text-lg text-amber-700">
            โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
          </p>
        </div>

        <div className="w-full">
          <div className="relative w-full h-[500px] rounded-lg overflow-hidden border-2 border-amber-200 shadow-xl">
            <DynamicMap />
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            <a
              href={`https://www.google.com/maps?q=${SCHOOL_COORDINATES[0]},${SCHOOL_COORDINATES[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" />
              เปิดใน Google Maps
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
