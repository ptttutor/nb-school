// Step 4: Grade Information Component

'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { RegistrationStepProps } from '@/types/registration.types';

export function GradeStep({ 
  formData, 
  handleChange,
  isM4
}: RegistrationStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
        <Badge className="bg-amber-600 text-white text-base px-3 py-1">4</Badge>
        <h3 className="text-xl font-bold text-amber-900">ผลการเรียน</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-4">
          <Label className="text-base font-medium">
            {isM4 ? "คะแนนเฉลี่ยสะสม (ม.1-3 จำนวน 5 ภาคเรียน) *" : "เกรดเฉลี่ยรายวิชา *"}
          </Label>
          <div className="grid md:grid-cols-2 gap-6">
            {isM4 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="scienceCumulativeM1M3">วิทยาศาสตร์ (คะแนนเฉลี่ยสะสม ม.1-3)</Label>
                  <Input
                    type="text"
                    id="scienceCumulativeM1M3"
                    name="scienceCumulativeM1M3"
                    value={formData.scienceCumulativeM1M3}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mathCumulativeM1M3">คณิตศาสตร์ (คะแนนเฉลี่ยสะสม ม.1-3)</Label>
                  <Input
                    type="text"
                    id="mathCumulativeM1M3"
                    name="mathCumulativeM1M3"
                    value={formData.mathCumulativeM1M3}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="englishCumulativeM1M3">ภาษาอังกฤษ (คะแนนเฉลี่ยสะสม ม.1-3)</Label>
                  <Input
                    type="text"
                    id="englishCumulativeM1M3"
                    name="englishCumulativeM1M3"
                    value={formData.englishCumulativeM1M3}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gradeP4">เกรดเฉลี่ย ป.4</Label>
                  <Input
                    type="text"
                    id="gradeP4"
                    name="gradeP4"
                    value={formData.gradeP4}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-amber-200"
                  />
                  <p className="text-xs text-gray-500">ระบุเกรดเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradeP5">เกรดเฉลี่ย ป.5</Label>
                  <Input
                    type="text"
                    id="gradeP5"
                    name="gradeP5"
                    value={formData.gradeP5}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="border-amber-200"
                  />
                  <p className="text-xs text-gray-500">ระบุเกรดเฉลี่ย 0.00 - 4.00</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
