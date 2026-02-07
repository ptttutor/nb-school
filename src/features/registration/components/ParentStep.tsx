// Step 5: Parent Information Component

'use client';

import { Badge } from "@/components/ui/badge";

export function ParentStep() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
        <Badge className="bg-amber-600 text-white text-base px-3 py-1">5</Badge>
        <h3 className="text-xl font-bold text-amber-900">ข้อมูลผู้ปกครอง</h3>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          📌 ระบบจะเพิ่มข้อมูลผู้ปกครองในเวอร์ชันต่อไป สามารถข้ามขั้นตอนนี้ได้
        </p>
      </div>
    </div>
  );
}
