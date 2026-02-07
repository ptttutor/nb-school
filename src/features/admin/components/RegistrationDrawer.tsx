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
import { Badge } from "@/components/ui/badge";
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
      <SheetContent className="w-full sm:w-[400px] overflow-y-auto">
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
                className="border-amber-300"
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
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
                </Button>
              </div>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* ระดับชั้น */}
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <Label className="text-gray-600 text-xs">ระดับชั้นที่สมัคร</Label>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-blue-600 text-white text-xs">
                {registration.gradeLevel === 'm4' ? 'ม.4' : 'ม.1'}
              </Badge>
              <span className="text-sm font-medium">
                {registration.gradeLevel === 'm4' ? 'มัธยมศึกษาปีที่ 4' : 'มัธยมศึกษาปีที่ 1'}
              </span>
              {registration.isSpecialISM && (
                <Badge className="bg-amber-600 text-white text-xs">ISM</Badge>
              )}
            </div>
          </div>

          {/* ข้อมูลส่วนตัว */}
          <div>
            <h3 className="font-semibold text-base mb-3 text-amber-900">ข้อมูลส่วนตัว</h3>
            <div className="space-y-3">
              {registration.idCardOrPassport && (
                <div>
                  <Label className="text-gray-600 text-xs">เลขบัตรประชาชน/พาสปอร์ต</Label>
                  <p className="text-sm font-medium mt-1">{registration.idCardOrPassport}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-600 text-xs">คำนำหน้า</Label>
                  <p className="text-sm font-medium mt-1">{registration.title}</p>
                </div>
                <div>
                  <Label className="text-gray-600 text-xs">วันเกิด</Label>
                  <p className="text-sm font-medium mt-1">
                    {new Date(registration.birthDate).toLocaleDateString('th-TH', {
                      day: 'numeric',
                      month: 'short',
                      year: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              
              {/* ชื่อ - แก้ไขได้ */}
              <div>
                <Label className="text-gray-600 text-xs">ชื่อ</Label>
                {isEditing ? (
                  <Input
                    value={editData.firstNameTH || ''}
                    onChange={(e) => handleInputChange('firstNameTH', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{registration.firstNameTH}</p>
                )}
              </div>
              
              {/* นามสกุล - แก้ไขได้ */}
              <div>
                <Label className="text-gray-600 text-xs">นามสกุล</Label>
                {isEditing ? (
                  <Input
                    value={editData.lastNameTH || ''}
                    onChange={(e) => handleInputChange('lastNameTH', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{registration.lastNameTH}</p>
                )}
              </div>

              {/* เบอร์โทร - แก้ไขได้ */}
              <div>
                <Label className="text-gray-600 text-xs">เบอร์โทรศัพท์</Label>
                {isEditing ? (
                  <Input
                    value={editData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{registration.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* ข้อมูลการศึกษา */}
          {(registration.schoolName || registration.educationStatus) && (
            <div>
              <h3 className="font-semibold text-base mb-2 text-amber-900">ข้อมูลการศึกษา</h3>
              <div className="space-y-2">
                {registration.schoolName && (
                  <div>
                    <Label className="text-gray-600 text-xs">โรงเรียน</Label>
                    <p className="text-sm font-medium mt-1">{registration.schoolName}</p>
                  </div>
                )}
                {registration.schoolProvince && (
                  <div className="text-xs text-gray-600">
                    {registration.schoolSubdistrict && `${registration.schoolSubdistrict} `}
                    {registration.schoolDistrict && `${registration.schoolDistrict} `}
                    {registration.schoolProvince}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* เกรดเฉลี่ยรายวิชา */}
          {registration.gradeLevel === 'm4' ? (
            // คะแนนสำหรับ ม.4 (ม.1-3 จำนวน 5 ภาคเรียน)
            (registration.scienceCumulativeM1M3 || registration.mathCumulativeM1M3 || 
             registration.englishCumulativeM1M3) && (
              <div>
                <h3 className="font-semibold text-lg mb-3 text-amber-900">คะแนนเฉลี่ยสะสม (ม.1-3 จำนวน 5 ภาคเรียน)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {registration.scienceCumulativeM1M3 && (
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-600 text-xs">กลุ่มสาระวิทยาศาสตร์</Label>
                      <p className="font-bold text-xl text-green-600 mt-1">{registration.scienceCumulativeM1M3}</p>
                    </div>
                  )}
                  {registration.mathCumulativeM1M3 && (
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-600 text-xs">กลุ่มสาระคณิตศาสตร์</Label>
                      <p className="font-bold text-xl text-green-600 mt-1">{registration.mathCumulativeM1M3}</p>
                    </div>
                  )}
                  {registration.englishCumulativeM1M3 && (
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-600 text-xs">กลุ่มสาระภาษาอังกฤษ</Label>
                      <p className="font-bold text-xl text-green-600 mt-1">{registration.englishCumulativeM1M3}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          ) : (
            // เกรดสำหรับ ม.1 (ป.4-5)
            (registration.gradeP4 || registration.gradeP5) && (
              <div>
                <h3 className="font-semibold text-lg mb-3 text-amber-900">เกรดเฉลี่ย</h3>
                <div className="grid grid-cols-2 gap-4">
                  {registration.gradeP4 && (
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-600 text-xs">ระดับชั้นประถมศึกษาปีที่ 4</Label>
                      <p className="font-bold text-xl text-green-600 mt-1">{registration.gradeP4}</p>
                    </div>
                  )}
                  {registration.gradeP5 && (
                    <div className="p-3 bg-white rounded border border-green-100">
                      <Label className="text-gray-600 text-xs">ระดับชั้นประถมศึกษาปีที่ 5</Label>
                      <p className="font-bold text-xl text-green-600 mt-1">{registration.gradeP5}</p>
                    </div>
                  )}
                </div>
              </div>
            )
          )}

          {/* ที่อยู่ */}
          <div>
            <h3 className="font-semibold text-base mb-3 text-amber-900">ที่อยู่ตามทะเบียนบ้าน</h3>
            <div className="space-y-3">
              {/* บ้าน เลขที่ - แก้ไขได้ */}
              <div>
                <Label className="text-gray-600 text-xs">บ้านเลขที่</Label>
                {isEditing ? (
                  <Input
                    value={editData.houseNumber || ''}
                    onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{registration.houseNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* หมู่ - แก้ไขได้ */}
                <div>
                  <Label className="text-gray-600 text-xs">หมู่</Label>
                  {isEditing ? (
                    <Input
                      value={editData.moo || ''}
                      onChange={(e) => handleInputChange('moo', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{registration.moo || '-'}</p>
                  )}
                </div>
                {/* ซอย - แก้ไขได้ */}
                <div>
                  <Label className="text-gray-600 text-xs">ซอย</Label>
                  {isEditing ? (
                    <Input
                      value={editData.soi || ''}
                      onChange={(e) => handleInputChange('soi', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{registration.soi || '-'}</p>
                  )}
                </div>
                {/* ถนน - แก้ไขได้ */}
                <div>
                  <Label className="text-gray-600 text-xs">ถนน</Label>
                  {isEditing ? (
                    <Input
                      value={editData.road || ''}
                      onChange={(e) => handleInputChange('road', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{registration.road || '-'}</p>
                  )}
                </div>
              </div>

              {/* ตำบล - แก้ไขได้ */}
              <div>
                <Label className="text-gray-600 text-xs">ตำบล/แขวง</Label>
                {isEditing ? (
                  <Input
                    value={editData.subdistrict || ''}
                    onChange={(e) => handleInputChange('subdistrict', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{registration.subdistrict}</p>
                )}
              </div>

              {/* อำเภอ - แก้ไขได้ */}
              <div>
                <Label className="text-gray-600 text-xs">อำเภอ/เขต</Label>
                {isEditing ? (
                  <Input
                    value={editData.district || ''}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="mt-1 h-8 text-sm"
                  />
                ) : (
                  <p className="text-sm font-medium mt-1">{registration.district}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* จังหวัด - แก้ไขได้ */}
                <div>
                  <Label className="text-gray-600 text-xs">จังหวัด</Label>
                  {isEditing ? (
                    <Input
                      value={editData.province || ''}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{registration.province}</p>
                  )}
                </div>
                {/* รหัสไปรษณีย์ - แก้ไขได้ */}
                <div>
                  <Label className="text-gray-600 text-xs">รหัสไปรษณีย์</Label>
                  {isEditing ? (
                    <Input
                      value={editData.postalCode || ''}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className="mt-1 h-8 text-sm"
                    />
                  ) : (
                    <p className="text-sm font-medium mt-1">{registration.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* สถานะ */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <Label className="text-gray-600 text-sm">สถานะการสมัคร</Label>
            <div className="mt-2">
              <Badge
                variant={
                  registration.status === 'approved'
                    ? 'default'
                    : registration.status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
                }
                className={
                  registration.status === 'approved'
                    ? 'bg-green-500'
                    : registration.status === 'rejected'
                    ? ''
                    : 'bg-yellow-500'
                }
              >
                {registration.status === 'pending' && 'รอดำเนินการ'}
                {registration.status === 'approved' && 'อนุมัติ'}
                {registration.status === 'rejected' && 'ปฏิเสธ'}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
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
          <div className="flex justify-end pt-4 border-t">
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
