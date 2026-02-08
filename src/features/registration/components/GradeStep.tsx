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
            {isM4 ? "ระดับคะแนนเฉลี่ยสะสม ระดับชั้นมัธยมศึกษาปีที่ 3 จำนวน 5 ภาคเรียน" : "เกรดเฉลี่ยรายวิชา *"}
          </Label>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {isM4 ? (
              <>
                <div className="space-y-4 md:col-span-2">
                  <Label htmlFor="cumulativeGPAM1M3">ระดับคะแนนเฉลี่ยสะสม ระดับชั้นมัธยมศึกษาปีที่ 3 จำนวน 5 ภาคเรียน (GPA รวมทุกวิชา)</Label>
                  <Input
                    type="text"
                    id="cumulativeGPAM1M3"
                    name="cumulativeGPAM1M3"
                    value={formData.cumulativeGPAM1M3}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="scienceCumulativeM1M3">ระดับคะแนนเฉลี่ยสะสมกลุ่มสาระการเรียนรู้วิชาวิทยาศาสตร์ ระดับชั้นมัธยมศึกษาปีที่ 3 จำนวน 5 ภาคเรียน</Label>
                  <Input
                    type="text"
                    id="scienceCumulativeM1M3"
                    name="scienceCumulativeM1M3"
                    value={formData.scienceCumulativeM1M3}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="mathCumulativeM1M3">ระดับคะแนนเฉลี่ยสะสมกลุ่มสาระการเรียนรู้วิชาคณิตศาสตร์ ระดับชั้นมัธยมศึกษาปีที่ 3 จำนวน 5 ภาคเรียน</Label>
                  <Input
                    type="text"
                    id="mathCumulativeM1M3"
                    name="mathCumulativeM1M3"
                    value={formData.mathCumulativeM1M3}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="englishCumulativeM1M3">ระดับคะแนนเฉลี่ยสะสมกลุ่มสาระการเรียนรู้วิชาภาษาอังกฤษ ระดับชั้นมัธยมศึกษาปีที่ 3 จำนวน 5 ภาคเรียน</Label>
                  <Input
                    type="text"
                    id="englishCumulativeM1M3"
                    name="englishCumulativeM1M3"
                    value={formData.englishCumulativeM1M3}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4 md:col-span-2">
                  <Label htmlFor="cumulativeGPAP4P5">ระดับคะแนนเฉลี่ยสะสม ระดับชั้นประถมศึกษาปีที่ 4-5 จำนวน 5 ภาคเรียน (GPA รวมทุกวิชา)</Label>
                  <Input
                    type="text"
                    id="cumulativeGPAP4P5"
                    name="cumulativeGPAP4P5"
                    value={formData.cumulativeGPAP4P5}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="scienceCumulativeP4P5">ระดับคะแนนเฉลี่ยสะสมกลุ่มสาระการเรียนรู้วิชาวิทยาศาสตร์ ระดับชั้นประถมศึกษาปีที่ 4-5 จำนวน 5 ภาคเรียน</Label>
                  <Input
                    type="text"
                    id="scienceCumulativeP4P5"
                    name="scienceCumulativeP4P5"
                    value={formData.scienceCumulativeP4P5}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="mathCumulativeP4P5">ระดับคะแนนเฉลี่ยสะสมกลุ่มสาระการเรียนรู้วิชาคณิตศาสตร์ ระดับชั้นประถมศึกษาปีที่ 4-5 จำนวน 5 ภาคเรียน</Label>
                  <Input
                    type="text"
                    id="mathCumulativeP4P5"
                    name="mathCumulativeP4P5"
                    value={formData.mathCumulativeP4P5}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="englishCumulativeP4P5">ระดับคะแนนเฉลี่ยสะสมกลุ่มสาระการเรียนรู้วิชาภาษาอังกฤษ ระดับชั้นประถมศึกษาปีที่ 4-5 จำนวน 5 ภาคเรียน</Label>
                  <Input
                    type="text"
                    id="englishCumulativeP4P5"
                    name="englishCumulativeP4P5"
                    value={formData.englishCumulativeP4P5}
                    onChange={handleChange}
                    onInput={(e) => {
                      const value = e.currentTarget.value;
                      if (!/^\d*\.?\d{0,2}$/.test(value)) {
                        e.currentTarget.value = value.slice(0, -1);
                      }
                    }}
                    placeholder="0.00"
                    className="border-amber-200"
                    pattern="[0-4](\.[0-9]{1,2})?"
                  />
                  <p className="text-xs text-gray-500">ระบุคะแนนเฉลี่ย 0.00 - 4.00</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
