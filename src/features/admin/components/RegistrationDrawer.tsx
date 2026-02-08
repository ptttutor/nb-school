"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";
import type { Registration } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface RegistrationDrawerProps {
  registration: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export function RegistrationDrawer({ registration, open, onOpenChange, onUpdate }: RegistrationDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<Partial<Registration>>({});
  const { toast } = useToast();

  if (!registration) return null;

  const startEdit = () => {
    setEditData({
      firstNameTH: registration.firstNameTH,
      lastNameTH: registration.lastNameTH,
      phone: registration.phone,
      houseNumber: registration.houseNumber,
      moo: registration.moo,
      road: registration.road,
      soi: registration.soi,
      province: registration.province,
      district: registration.district,
      subdistrict: registration.subdistrict,
      postalCode: registration.postalCode,
      // เกรด M1 (legacy)
      gradeP4: registration.gradeP4,
      gradeP5: registration.gradeP5,
      // GPA M1 (ป.4-5)
      cumulativeGPAP4P5: registration.cumulativeGPAP4P5,
      scienceCumulativeP4P5: registration.scienceCumulativeP4P5,
      mathCumulativeP4P5: registration.mathCumulativeP4P5,
      englishCumulativeP4P5: registration.englishCumulativeP4P5,
      // GPA M4 (ม.1-3)
      cumulativeGPAM1M3: registration.cumulativeGPAM1M3,
      scienceCumulativeM1M3: registration.scienceCumulativeM1M3,
      mathCumulativeM1M3: registration.mathCumulativeM1M3,
      englishCumulativeM1M3: registration.englishCumulativeM1M3,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const saveEdit = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/registrations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: registration.id,
          ...editData
        }),
      });

      if (response.ok) {
        toast({
          title: "บันทึกสำเร็จ",
          description: "แก้ไขข้อมูลการสมัครเรียบร้อยแล้ว",
        });
        setIsEditing(false);
        setEditData({});
        if (onUpdate) onUpdate();
        onOpenChange(false);
      } else {
        toast({
          variant: "destructive",
          title: "ข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดในการบันทึก",
        });
      }
    } catch (error) {
      console.error('Error saving:', error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[1200px] max-w-none overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl text-amber-900">
                รายละเอียดการสมัคร
              </SheetTitle>
              <SheetDescription className="text-sm">
                ข้อมูลผู้สมัครเข้าศึกษาต่อ
              </SheetDescription>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={startEdit}
                className="border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <Edit className="w-4 h-4 mr-1" />
                แก้ไข
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4 mr-1" />
                  ยกเลิก
                </Button>
                <Button
                  size="sm"
                  onClick={saveEdit}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* ระดับชั้น และข้อมูลส่วนตัว */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">ระดับชั้นที่สมัคร</Label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-blue-600 text-white">
                  {registration.gradeLevel === 'm4' ? 'ม.4' : 'ม.1'}
                </span>
                <span className="font-medium">
                  {registration.gradeLevel === 'm4' ? 'มัธยมศึกษาปีที่ 4' : 'มัธยมศึกษาปีที่ 1'}
                </span>
                {registration.isSpecialISM && (
                  <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-purple-600 text-white">ISM</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-600">คำนำหน้า</Label>
              <p className="font-medium">{registration.title}</p>
            </div>
            {registration.idCardOrPassport && (
              <div className="space-y-2">
                <Label className="text-gray-600">เลขบัตรประชาชน</Label>
                <p className="font-medium">{registration.idCardOrPassport}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-gray-600">วันเกิด</Label>
              <p className="font-medium">
                {new Date(registration.birthDate).toLocaleDateString('th-TH', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>

            {/* ชื่อ - แก้ไขได้ */}
            <div className="space-y-2">
              <Label className="text-gray-600">ชื่อ</Label>
              {isEditing ? (
                <Input
                  value={editData.firstNameTH || ''}
                  onChange={(e) => handleInputChange('firstNameTH', e.target.value)}
                  className="border-amber-200"
                />
              ) : (
                <p className="font-medium">{registration.firstNameTH}</p>
              )}
            </div>

            {/* นามสกุล - แก้ไขได้ */}
            <div className="space-y-2">
              <Label className="text-gray-600">นามสกุล</Label>
              {isEditing ? (
                <Input
                  value={editData.lastNameTH || ''}
                  onChange={(e) => handleInputChange('lastNameTH', e.target.value)}
                  className="border-amber-200"
                />
              ) : (
                <p className="font-medium">{registration.lastNameTH}</p>
              )}
            </div>

            {/* เบอร์โทร - แก้ไขได้ */}
            <div className="space-y-2">
              <Label className="text-gray-600">เบอร์โทรศัพท์</Label>
              {isEditing ? (
                <Input
                  value={editData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="border-amber-200"
                />
              ) : (
                <p className="font-medium">{registration.phone}</p>
              )}
            </div>
          </div>

          {/* ข้อมูลการศึกษา */}
          {(registration.schoolName || registration.educationStatus) && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">ข้อมูลการศึกษา</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registration.schoolName && (
                  <div className="space-y-2">
                    <Label className="text-gray-600">โรงเรียน</Label>
                    <p className="font-medium">{registration.schoolName}</p>
                  </div>
                )}
                {registration.schoolProvince && (
                  <div className="space-y-2">
                    <Label className="text-gray-600">ที่อยู่โรงเรียน</Label>
                    <p className="text-sm">
                      {registration.schoolSubdistrict && `${registration.schoolSubdistrict} `}
                      {registration.schoolDistrict && `${registration.schoolDistrict} `}
                      {registration.schoolProvince}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* เกรดเฉลี่ยรายวิชา */}
          {registration.gradeLevel === 'm4' ? (
            (registration.cumulativeGPAM1M3 || registration.scienceCumulativeM1M3 || registration.mathCumulativeM1M3 ||
              registration.englishCumulativeM1M3 || isEditing) && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">ระดับคะแนนเฉลี่ยสะสม ระดับชั้นมัธยมศึกษาปีที่ 3 จำนวน 5 ภาคเรียน</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-600">GPA รวมทุกวิชา</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.cumulativeGPAM1M3 || ''}
                        onChange={(e) => handleInputChange('cumulativeGPAM1M3', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^\d*\.?\d{0,2}$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00"
                        className="border-amber-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-purple-600 mt-1">{registration.cumulativeGPAM1M3 || '-'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">กลุ่มสาระการเรียนรู้วิชาวิทยาศาสตร์</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.scienceCumulativeM1M3 || ''}
                        onChange={(e) => handleInputChange('scienceCumulativeM1M3', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^\d*\.?\d{0,2}$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00"
                        className="border-amber-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-green-600 mt-1">{registration.scienceCumulativeM1M3 || '-'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">กลุ่มสาระการเรียนรู้วิชาคณิตศาสตร์</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.mathCumulativeM1M3 || ''}
                        onChange={(e) => handleInputChange('mathCumulativeM1M3', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^\d*\.?\d{0,2}$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00"
                        className="border-amber-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-blue-600 mt-1">{registration.mathCumulativeM1M3 || '-'}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">กลุ่มสาระการเรียนรู้วิชาภาษาอังกฤษ</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.englishCumulativeM1M3 || ''}
                        onChange={(e) => handleInputChange('englishCumulativeM1M3', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^\d*\.?\d{0,2}$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00"
                        className="border-amber-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-purple-600 mt-1">{registration.englishCumulativeM1M3 || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          ) : (
            (registration.cumulativeGPAP4P5 || registration.scienceCumulativeP4P5 || registration.mathCumulativeP4P5 || registration.englishCumulativeP4P5 || registration.gradeP4 || registration.gradeP5 || isEditing) && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">เกรดเฉลี่ย (GPA ป.4-5 จำนวน 5 ภาคเรียน)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Overall GPA - Full Width */}
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-gray-600">GPA รวม ป.4-5</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.cumulativeGPAP4P5 || ''}
                        onChange={(e) => handleInputChange('cumulativeGPAP4P5', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^[0-4]?(\.[0-9]{0,2})?$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00-4.00"
                        className="border-purple-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-purple-600 mt-1">{registration.cumulativeGPAP4P5 || '-'}</p>
                    )}
                  </div>
                  
                  {/* Science GPA */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">วิทยาศาสตร์</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.scienceCumulativeP4P5 || ''}
                        onChange={(e) => handleInputChange('scienceCumulativeP4P5', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^[0-4]?(\.[0-9]{0,2})?$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00-4.00"
                        className="border-green-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-green-600 mt-1">{registration.scienceCumulativeP4P5 || '-'}</p>
                    )}
                  </div>

                  {/* Math GPA */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">คณิตศาสตร์</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.mathCumulativeP4P5 || ''}
                        onChange={(e) => handleInputChange('mathCumulativeP4P5', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^[0-4]?(\.[0-9]{0,2})?$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00-4.00"
                        className="border-blue-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-blue-600 mt-1">{registration.mathCumulativeP4P5 || '-'}</p>
                    )}
                  </div>

                  {/* English GPA */}
                  <div className="space-y-2">
                    <Label className="text-gray-600">ภาษาอังกฤษ</Label>
                    {isEditing ? (
                      <Input
                        type="text"
                        value={editData.englishCumulativeP4P5 || ''}
                        onChange={(e) => handleInputChange('englishCumulativeP4P5', e.target.value)}
                        onInput={(e) => {
                          const value = e.currentTarget.value;
                          if (!/^[0-4]?(\.[0-9]{0,2})?$/.test(value)) {
                            e.currentTarget.value = value.slice(0, -1);
                          }
                        }}
                        placeholder="0.00-4.00"
                        className="border-orange-200"
                      />
                    ) : (
                      <p className="font-bold text-2xl text-orange-600 mt-1">{registration.englishCumulativeP4P5 || '-'}</p>
                    )}
                  </div>
                </div>
              </div>
            )
          )}

          {/* ที่อยู่ */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-4">ที่อยู่ตามทะเบียนบ้าน</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-600">บ้านเลขที่</Label>
                {isEditing ? (
                  <Input
                    value={editData.houseNumber || ''}
                    onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                    className="border-amber-200"
                  />
                ) : (
                  <p className="font-medium">{registration.houseNumber}</p>
                )}
              </div>
              {registration.moo && (
                <div className="space-y-2">
                  <Label className="text-gray-600">หมู่</Label>
                  {isEditing ? (
                    <Input
                      value={editData.moo || ''}
                      onChange={(e) => handleInputChange('moo', e.target.value)}
                      className="border-amber-200"
                    />
                  ) : (
                    <p className="font-medium">{registration.moo}</p>
                  )}
                </div>
              )}
              {registration.soi && (
                <div className="space-y-2">
                  <Label className="text-gray-600">ซอย</Label>
                  {isEditing ? (
                    <Input
                      value={editData.soi || ''}
                      onChange={(e) => handleInputChange('soi', e.target.value)}
                      className="border-amber-200"
                    />
                  ) : (
                    <p className="font-medium">{registration.soi}</p>
                  )}
                </div>
              )}
              {registration.road && (
                <div className="space-y-2">
                  <Label className="text-gray-600">ถนน</Label>
                  {isEditing ? (
                    <Input
                      value={editData.road || ''}
                      onChange={(e) => handleInputChange('road', e.target.value)}
                      className="border-amber-200"
                    />
                  ) : (
                    <p className="font-medium">{registration.road}</p>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label className="text-gray-600">ตำบล/แขวง</Label>
                {isEditing ? (
                  <Input
                    value={editData.subdistrict || ''}
                    onChange={(e) => handleInputChange('subdistrict', e.target.value)}
                    className="border-amber-200"
                  />
                ) : (
                  <p className="font-medium">{registration.subdistrict}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">อำเภอ/เขต</Label>
                {isEditing ? (
                  <Input
                    value={editData.district || ''}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="border-amber-200"
                  />
                ) : (
                  <p className="font-medium">{registration.district}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">จังหวัด</Label>
                {isEditing ? (
                  <Input
                    value={editData.province || ''}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className="border-amber-200"
                  />
                ) : (
                  <p className="font-medium">{registration.province}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">รหัสไปรษณีย์</Label>
                {isEditing ? (
                  <Input
                    value={editData.postalCode || ''}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="border-amber-200"
                  />
                ) : (
                  <p className="font-medium">{registration.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* เอกสารประกอบการสมัคร */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-4">เอกสารประกอบ</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-gray-600">รูปถ่าย</Label>
                {registration.photoDoc ? (
                  <a
                    href={registration.photoDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    ดูรูปถ่าย
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">ยังไม่ได้อัปโหลด</p>
                )}
              </div>

              <div>
                <Label className="text-gray-600">สำเนาทะเบียนบ้าน</Label>
                {registration.houseRegistrationDoc ? (
                  <a
                    href={registration.houseRegistrationDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ดูทะเบียนบ้าน
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">ยังไม่ได้อัปโหลด</p>
                )}
              </div>

              <div>
                <Label className="text-gray-600">หลักฐานแสดงผลการเรียน</Label>
                {registration.transcriptDoc ? (
                  <a
                    href={registration.transcriptDoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 hover:underline mt-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    ดูผลการเรียน
                  </a>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">ยังไม่ได้อัปโหลด</p>
                )}
              </div>
            </div>
          </div>

          {/* สถานะ */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-4">สถานะการสมัคร</h3>
            <div className="space-y-2">
              <div>
                {registration.status === 'approved' && (
                  <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-green-500 text-white">
                    อนุมัติ
                  </div>
                )}
                {registration.status === 'rejected' && (
                  <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-500 text-white">
                    ปฏิเสธ
                  </div>
                )}
                {registration.status === 'pending' && (
                  <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-yellow-400 text-gray-900">
                    รอดำเนินการ
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">
                สมัครเมื่อ: {new Date(registration.createdAt).toLocaleDateString('th-TH', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* ปุ่มปิด */}
          <div className="flex justify-end pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-amber-300"
            >
              ปิด
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
