// Step 3: Education Information Component

'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVINCES, DISTRICTS, SUBDISTRICTS, NONGBUA_SCHOOLS } from "@/lib/thailand-data";
import type { RegistrationStepProps } from '@/types/registration.types';

interface EducationStepProps extends RegistrationStepProps {
  schoolProvince: string;
  schoolDistrict: string;
  onSchoolProvinceChange: (province: string) => void;
  onSchoolDistrictChange: (district: string) => void;
  onSchoolSubdistrictChange: (subdistrict: string) => void;
  onSchoolSelect: (schoolName: string) => void;
}

export function EducationStep({ 
  formData, 
  handleChange,
  handleSelectChange,
  isM4,
  schoolProvince,
  schoolDistrict,
  onSchoolProvinceChange,
  onSchoolDistrictChange,
  onSchoolSubdistrictChange,
  onSchoolSelect,
  errors = {}
}: EducationStepProps) {
  // ดึงรายการอำเภอตามจังหวัดที่เลือก
  const availableDistricts = schoolProvince ? DISTRICTS[schoolProvince] || [] : [];

  // ดึงรายการตำบลตามจังหวัดและอำเภอที่เลือก
  const subdistrictKey = `${schoolProvince}-${schoolDistrict}`;
  const availableSubdistricts = subdistrictKey && SUBDISTRICTS[subdistrictKey] ? SUBDISTRICTS[subdistrictKey] : [];

  const isNongbuaDistrict = schoolProvince === "นครสวรรค์" && schoolDistrict === "หนองบัว";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
        <Badge className="bg-amber-600 text-white text-base px-3 py-1">3</Badge>
        <h3 className="text-xl font-bold text-amber-900">ข้อมูลการศึกษา</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-medium">สถานะการศึกษา</Label>
          <div className="flex flex-col gap-3">
            {isM4 ? (
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="educationStatus"
                    value="กำลังศึกษาอยู่ชั้นมัธยมศึกษาปีที่ 3"
                    checked={formData.educationStatus === "กำลังศึกษาอยู่ชั้นมัธยมศึกษาปีที่ 3"}
                    onChange={handleChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="text-sm">กำลังศึกษาอยู่ชั้นมัธยมศึกษาปีที่ 3</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="educationStatus"
                    value="จบการศึกษาชั้นมัธยมศึกษาปีที่ 3"
                    checked={formData.educationStatus === "จบการศึกษาชั้นมัธยมศึกษาปีที่ 3"}
                    onChange={handleChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="text-sm">จบการศึกษาชั้นมัธยมศึกษาปีที่ 3</span>
                </label>
              </>
            ) : (
              <>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="educationStatus"
                    value="กำลังศึกษาอยู่ชั้นประถมศึกษาปีที่ 6"
                    checked={formData.educationStatus === "กำลังศึกษาอยู่ชั้นประถมศึกษาปีที่ 6"}
                    onChange={handleChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="text-sm">กำลังศึกษาอยู่ชั้นประถมศึกษาปีที่ 6</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="educationStatus"
                    value="จบการศึกษาชั้นประถมศึกษาปีที่ 6"
                    checked={formData.educationStatus === "จบการศึกษาชั้นประถมศึกษาปีที่ 6"}
                    onChange={handleChange}
                    className="w-4 h-4 text-amber-600"
                  />
                  <span className="text-sm">จบการศึกษาชั้นประถมศึกษาปีที่ 6</span>
                </label>
              </>
            )}
          </div>
          {errors?.educationStatus && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.educationStatus}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolProvince">จังหวัด *</Label>
          <Select
            value={formData.schoolProvince}
            onValueChange={onSchoolProvinceChange}
          >
            <SelectTrigger className={cn("border-amber-200", errors?.schoolProvince && "border-red-500")}>
              <SelectValue placeholder="เลือกจังหวัด" />
            </SelectTrigger>
            <SelectContent>
              {PROVINCES.map((province) => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.schoolProvince && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.schoolProvince}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="schoolDistrict">เขต/อำเภอ *</Label>
            {schoolProvince && availableDistricts.length > 0 ? (
              <Select
                value={formData.schoolDistrict}
                onValueChange={onSchoolDistrictChange}
              >
                <SelectTrigger className={cn("border-amber-200", errors?.schoolDistrict && "border-red-500")}>
                  <SelectValue placeholder="เลือกอำเภอ" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                id="schoolDistrict"
                name="schoolDistrict"
                value={formData.schoolDistrict}
                onChange={handleChange}
                placeholder={schoolProvince ? "กรอกอำเภอ" : "เลือกจังหวัดก่อน"}
                className={cn("border-amber-200", errors?.schoolDistrict && "border-red-500")}
                disabled={!schoolProvince}
              />
            )}
            {errors?.schoolDistrict && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.schoolDistrict}
              </p>
            )}
            {schoolProvince && availableDistricts.length === 0 && (
              <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="schoolSubdistrict">แขวง/ตำบล *</Label>
            {schoolDistrict && availableSubdistricts.length > 0 ? (
              <Select
                value={formData.schoolSubdistrict}
                onValueChange={onSchoolSubdistrictChange}
                disabled={isNongbuaDistrict && formData.schoolName !== ""}
              >
                <SelectTrigger className={cn("border-amber-200", errors?.schoolSubdistrict && "border-red-500")}>
                  <SelectValue placeholder={
                    isNongbuaDistrict && formData.schoolName 
                      ? "ตำบลถูกกรอกอัตโนมัติ" 
                      : "เลือกตำบล"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSubdistricts.map((subdistrict) => (
                    <SelectItem key={subdistrict} value={subdistrict}>
                      {subdistrict}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type="text"
                id="schoolSubdistrict"
                name="schoolSubdistrict"
                value={formData.schoolSubdistrict}
                onChange={handleChange}
                placeholder={schoolDistrict ? "กรอกตำบล" : "เลือกอำเภอก่อน"}
                className={cn("border-amber-200", errors?.schoolSubdistrict && "border-red-500")}
                disabled={!schoolDistrict || (isNongbuaDistrict && formData.schoolName !== "")}
              />
            )}
            {errors?.schoolSubdistrict && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.schoolSubdistrict}
              </p>
            )}
            {isNongbuaDistrict && formData.schoolName && (
              <p className="text-xs text-green-600">✓ ตำบลถูกกรอกอัตโนมัติจากการเลือกโรงเรียน</p>
            )}
            {schoolDistrict && availableSubdistricts.length === 0 && !isNongbuaDistrict && (
              <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolName">โรงเรียน * <span className="text-xs text-gray-500">(ไม่ต้องใส่คำว่าโรงเรียน)</span></Label>
          {isNongbuaDistrict ? (
            <Select
              value={formData.schoolName}
              onValueChange={(value) => onSchoolSelect(value)}
            >
              <SelectTrigger className={cn("border-amber-200", errors?.schoolName && "border-red-500")}>
                <SelectValue placeholder="เลือกโรงเรียน" />
              </SelectTrigger>
              <SelectContent>
                {NONGBUA_SCHOOLS.map((school) => (
                  <SelectItem key={school.name} value={school.name}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              type="text"
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Ex. หนองบัว"
              className={cn("border-amber-200", errors?.schoolName && "border-red-500")}
            />
          )}
          {errors?.schoolName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.schoolName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
