// RegistrationInfo Component - Display and edit registration information

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Edit, X } from "lucide-react";
import type { Registration } from "@/types/registration.types";
import { useToast } from "@/hooks/use-toast";

interface RegistrationInfoProps {
  registration: Registration;
  gradeText: string;
}

export function RegistrationInfo({ registration, gradeText }: RegistrationInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Registration>>(registration);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/registration/${registration.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) throw new Error("Failed to update");

      toast({
        title: "บันทึกสำเร็จ",
        description: "ข้อมูลได้รับการอัปเดตแล้ว",
      });
      setIsEditing(false);
      // Reload page to show updated data
      window.location.reload();
    } catch (error) {
      console.error("Error updating registration:", error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(registration);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: any) => {
    setEditedData({ ...editedData, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">รายละเอียดการสมัคร</CardTitle>
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <Edit className="w-4 h-4 mr-2" />
              แก้ไขข้อมูล
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                ยกเลิก
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* ข้อมูลพื้นฐาน */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-600">ระดับชั้นที่สมัคร</Label>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-blue-600 text-white">
                {registration.gradeLevel === "m4" ? "ม.4" : "ม.1"}
              </div>
              <span className="font-medium">{gradeText}</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">คำนำหน้า</Label>
            {isEditing ? (
              <Input
                value={editedData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.title}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">ชื่อ</Label>
            {isEditing ? (
              <Input
                value={editedData.firstNameTH || ""}
                onChange={(e) => handleChange("firstNameTH", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.firstNameTH}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">นามสกุล</Label>
            {isEditing ? (
              <Input
                value={editedData.lastNameTH || ""}
                onChange={(e) => handleChange("lastNameTH", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.lastNameTH}</p>
            )}
          </div>
          {registration.idCardOrPassport && (
            <div className="space-y-2">
              <Label className="text-gray-600">เลขบัตรประชาชน/พาสปอร์ต</Label>
              <Input
                value={registration.idCardOrPassport}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              {isEditing && (
                <p className="text-xs text-gray-500">* ไม่สามารถแก้ไขเลขบัตรประชาชนได้</p>
              )}
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-gray-600">วัน/เดือน/ปีเกิด</Label>
            {isEditing ? (
              <Input
                type="date"
                value={editedData.birthDate ? new Date(editedData.birthDate).toISOString().split('T')[0] : ""}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">
                {new Date(registration.birthDate).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">เชื้อชาติ</Label>
            {isEditing ? (
              <Input
                value={editedData.ethnicity || ""}
                onChange={(e) => handleChange("ethnicity", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.ethnicity}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">สัญชาติ</Label>
            {isEditing ? (
              <Input
                value={editedData.nationality || ""}
                onChange={(e) => handleChange("nationality", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.nationality}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">ศาสนา</Label>
            {isEditing ? (
              <Input
                value={editedData.religion || ""}
                onChange={(e) => handleChange("religion", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.religion}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-gray-600">เบอร์โทรศัพท์</Label>
            {isEditing ? (
              <Input
                value={editedData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.phone}</p>
            )}
          </div>
        </div>

        {/* ข้อมูลการศึกษา */}
        {registration.schoolName && (
          <EducationSection 
            registration={registration} 
            isEditing={isEditing}
            editedData={editedData}
            handleChange={handleChange}
          />
        )}

        {/* ที่อยู่ */}
        <AddressSection 
          registration={registration}
          isEditing={isEditing}
          editedData={editedData}
          handleChange={handleChange}
        />

        {/* ข้อมูลครอบครัว */}
        {(registration.siblings || registration.siblingsInSchool) && (
          <FamilySection 
            registration={registration}
            isEditing={isEditing}
            editedData={editedData}
            handleChange={handleChange}
          />
        )}
      </CardContent>
    </Card>
  );
}

function EducationSection({ 
  registration,
  isEditing,
  editedData,
  handleChange 
}: { 
  registration: Registration;
  isEditing: boolean;
  editedData: Partial<Registration>;
  handleChange: (field: string, value: any) => void;
}) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-semibold mb-4">ข้อมูลการศึกษา</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.educationStatus && (
          <div className="space-y-2">
            <Label className="text-gray-600">สถานะการศึกษา</Label>
            {isEditing ? (
              <Input
                value={editedData.educationStatus || ""}
                onChange={(e) => handleChange("educationStatus", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.educationStatus}</p>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-gray-600">โรงเรียน</Label>
          {isEditing ? (
            <Input
              value={editedData.schoolName || ""}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              className="border-amber-200"
            />
          ) : (
            <p className="font-medium">{registration.schoolName}</p>
          )}
        </div>
        {registration.schoolProvince && (
          <div className="space-y-2">
            <Label className="text-gray-600">จังหวัด</Label>
            {isEditing ? (
              <Input
                value={editedData.schoolProvince || ""}
                onChange={(e) => handleChange("schoolProvince", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.schoolProvince}</p>
            )}
          </div>
        )}
        {registration.schoolDistrict && (
          <div className="space-y-2">
            <Label className="text-gray-600">อำเภอ</Label>
            {isEditing ? (
              <Input
                value={editedData.schoolDistrict || ""}
                onChange={(e) => handleChange("schoolDistrict", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.schoolDistrict}</p>
            )}
          </div>
        )}
        {registration.schoolSubdistrict && (
          <div className="space-y-2">
            <Label className="text-gray-600">ตำบล</Label>
            {isEditing ? (
              <Input
                value={editedData.schoolSubdistrict || ""}
                onChange={(e) => handleChange("schoolSubdistrict", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.schoolSubdistrict}</p>
            )}
          </div>
        )}
      </div>

      {/* Grades */}
      {registration.gradeLevel === "m4" ? (
        <M4GradesSection 
          registration={registration}
          isEditing={isEditing}
          editedData={editedData}
          handleChange={handleChange}
        />
      ) : (
        <M1GradesSection 
          registration={registration}
          isEditing={isEditing}
          editedData={editedData}
          handleChange={handleChange}
        />
      )}
    </div>
  );
}

function M4GradesSection({ 
  registration,
  isEditing,
  editedData,
  handleChange 
}: { 
  registration: Registration;
  isEditing: boolean;
  editedData: Partial<Registration>;
  handleChange: (field: string, value: any) => void;
}) {
  if (!registration.scienceCumulativeM1M3 && 
      !registration.mathCumulativeM1M3 && 
      !registration.englishCumulativeM1M3) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-semibold mb-3 text-green-700">
        คะแนนเฉลี่ยสะสม (ม.1-3 จำนวน 5 ภาคเรียน)
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {registration.scienceCumulativeM1M3 && (
          <div className="space-y-2">
            <Label className="text-gray-600">วิทยาศาสตร์</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editedData.scienceCumulativeM1M3 ?? ""}
                onChange={(e) => handleChange("scienceCumulativeM1M3", parseFloat(e.target.value) || 0)}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  const parts = value.split('.');
                  if (parts[1] && parts[1].length > 2) {
                    e.currentTarget.value = parseFloat(value).toFixed(2);
                  }
                }}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium text-green-600">
                {registration.scienceCumulativeM1M3}
              </p>
            )}
          </div>
        )}
        {registration.mathCumulativeM1M3 && (
          <div className="space-y-2">
            <Label className="text-gray-600">คณิตศาสตร์</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editedData.mathCumulativeM1M3 ?? ""}
                onChange={(e) => handleChange("mathCumulativeM1M3", parseFloat(e.target.value) || 0)}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  const parts = value.split('.');
                  if (parts[1] && parts[1].length > 2) {
                    e.currentTarget.value = parseFloat(value).toFixed(2);
                  }
                }}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium text-green-600">
                {registration.mathCumulativeM1M3}
              </p>
            )}
          </div>
        )}
        {registration.englishCumulativeM1M3 && (
          <div className="space-y-2">
            <Label className="text-gray-600">ภาษาอังกฤษ</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editedData.englishCumulativeM1M3 ?? ""}
                onChange={(e) => handleChange("englishCumulativeM1M3", parseFloat(e.target.value) || 0)}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  const parts = value.split('.');
                  if (parts[1] && parts[1].length > 2) {
                    e.currentTarget.value = parseFloat(value).toFixed(2);
                  }
                }}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium text-green-600">
                {registration.englishCumulativeM1M3}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function M1GradesSection({ 
  registration,
  isEditing,
  editedData,
  handleChange 
}: { 
  registration: Registration;
  isEditing: boolean;
  editedData: Partial<Registration>;
  handleChange: (field: string, value: any) => void;
}) {
  if (!registration.gradeP4 && !registration.gradeP5) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t">
      <h4 className="font-semibold mb-3 text-green-700">เกรดเฉลี่ย</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.gradeP4 && (
          <div className="space-y-2">
            <Label className="text-gray-600">ประถมศึกษาปีที่ 4</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editedData.gradeP4 ?? ""}
                onChange={(e) => handleChange("gradeP4", parseFloat(e.target.value) || 0)}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  const parts = value.split('.');
                  if (parts[1] && parts[1].length > 2) {
                    e.currentTarget.value = parseFloat(value).toFixed(2);
                  }
                }}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium text-green-600">{registration.gradeP4}</p>
            )}
          </div>
        )}
        {registration.gradeP5 && (
          <div className="space-y-2">
            <Label className="text-gray-600">ประถมศึกษาปีที่ 5</Label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editedData.gradeP5 ?? ""}
                onChange={(e) => handleChange("gradeP5", parseFloat(e.target.value) || 0)}
                onInput={(e) => {
                  const value = e.currentTarget.value;
                  const parts = value.split('.');
                  if (parts[1] && parts[1].length > 2) {
                    e.currentTarget.value = parseFloat(value).toFixed(2);
                  }
                }}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium text-green-600">{registration.gradeP5}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AddressSection({ 
  registration,
  isEditing,
  editedData,
  handleChange 
}: { 
  registration: Registration;
  isEditing: boolean;
  editedData: Partial<Registration>;
  handleChange: (field: string, value: any) => void;
}) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-semibold mb-4">ที่อยู่ตามทะเบียนบ้าน</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.villageName && (
          <div className="space-y-2">
            <Label className="text-gray-600">หมู่บ้าน</Label>
            {isEditing ? (
              <Input
                value={editedData.villageName || ""}
                onChange={(e) => handleChange("villageName", e.target.value)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.villageName}</p>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label className="text-gray-600">บ้านเลขที่</Label>
          {isEditing ? (
            <Input
              value={editedData.houseNumber || ""}
              onChange={(e) => handleChange("houseNumber", e.target.value)}
              className="border-amber-200"
            />
          ) : (
            <p className="font-medium">{registration.houseNumber}</p>
          )}
        </div>
        {registration.moo && (
          <div className="space-y-2">
            <Label className="text-gray-600">หมู่ที่</Label>
            {isEditing ? (
              <Input
                value={editedData.moo || ""}
                onChange={(e) => handleChange("moo", e.target.value)}
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
                value={editedData.soi || ""}
                onChange={(e) => handleChange("soi", e.target.value)}
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
                value={editedData.road || ""}
                onChange={(e) => handleChange("road", e.target.value)}
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
              value={editedData.subdistrict || ""}
              onChange={(e) => handleChange("subdistrict", e.target.value)}
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
              value={editedData.district || ""}
              onChange={(e) => handleChange("district", e.target.value)}
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
              value={editedData.province || ""}
              onChange={(e) => handleChange("province", e.target.value)}
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
              value={editedData.postalCode || ""}
              onChange={(e) => handleChange("postalCode", e.target.value)}
              className="border-amber-200"
            />
          ) : (
            <p className="font-medium">{registration.postalCode}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FamilySection({ 
  registration,
  isEditing,
  editedData,
  handleChange 
}: { 
  registration: Registration;
  isEditing: boolean;
  editedData: Partial<Registration>;
  handleChange: (field: string, value: any) => void;
}) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-semibold mb-4">ข้อมูลครอบครัว</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registration.siblings !== null && registration.siblings !== undefined && (
          <div className="space-y-2">
            <Label className="text-gray-600">จำนวนพี่น้อง</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editedData.siblings ?? ""}
                onChange={(e) => handleChange("siblings", parseInt(e.target.value) || 0)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.siblings} คน</p>
            )}
          </div>
        )}
        {registration.siblingsInSchool !== null && registration.siblingsInSchool !== undefined && (
          <div className="space-y-2">
            <Label className="text-gray-600">พี่น้องที่เรียนโรงเรียนนี้</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editedData.siblingsInSchool ?? ""}
                onChange={(e) => handleChange("siblingsInSchool", parseInt(e.target.value) || 0)}
                className="border-amber-200"
              />
            ) : (
              <p className="font-medium">{registration.siblingsInSchool} คน</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
