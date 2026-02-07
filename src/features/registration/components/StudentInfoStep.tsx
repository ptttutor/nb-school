// Step 1: Student Information Component

'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DatePicker } from "@/components/ui/date-picker";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegistrationStepProps } from '@/types/registration.types';

export function StudentInfoStep({ 
  formData, 
  handleChange, 
  handleSelectChange,
  isM4,
  admissionSettings,
  errors = {}
}: RegistrationStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200 mt-4">
        <Badge className="bg-amber-600 text-white text-base px-3 py-1">1</Badge>
        <h3 className="text-xl font-bold text-amber-900">ข้อมูลผู้สมัคร (นักเรียน)</h3>
      </div>

      <div className="space-y-4">
        <Label htmlFor="idCardOrPassport">
          เลขบัตรประจำตัวประชาชน *
        </Label>
        <Input
          type="number"
          id="idCardOrPassport"
          name="idCardOrPassport"
          value={formData.idCardOrPassport}
          onChange={handleChange}
          placeholder="กรอกเลข 13 หลัก (ไม่ต้องใส่เครื่องหมาย -)"
          pattern="[0-9]{13}"
          maxLength={13}
          className={cn("border-amber-200", errors?.idCardOrPassport && "border-red-500")}
          required
        />
        {errors?.idCardOrPassport && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.idCardOrPassport}
          </p>
        )}
        <p className="text-xs text-gray-500">กรุณากรอกเลขบัตรประชาชนไทย 13 หลัก ตัวอย่าง: 1234567891234 (ข้อมูลนี้ช่วยป้องกันการสมัครซ้ำ)</p>
      </div>

      <div className="space-y-4">
        <Label htmlFor="isSpecialISM">ประเภทห้องเรียน *</Label>
        {(!admissionSettings?.allowISM && !admissionSettings?.allowRegular) ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            ขณะนี้ไม่เปิดรับสมัครทั้งห้อง ISM และห้องทั่วไป
          </div>
        ) : (
          <>
            <Select 
              value={formData.isSpecialISM ? "true" : "false"} 
              onValueChange={(val) => handleSelectChange("isSpecialISM", val === "true")} 
              required
            >
              <SelectTrigger className="border-amber-200">
                <SelectValue placeholder="เลือกประเภทห้องเรียน" />
              </SelectTrigger>
              <SelectContent>
                {admissionSettings?.allowISM && (
                  <SelectItem value="true">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">ห้องเรียนพิเศษ ISM</span>
                      <span className="text-xs text-gray-500">เน้นวิทยาศาสตร์และคณิตศาสตร์</span>
                    </div>
                  </SelectItem>
                )}
                {admissionSettings?.allowRegular && (
                  <SelectItem value="false">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">ห้องเรียนทั่วไป</span>
                      <span className="text-xs text-gray-500">หลักสูตรมาตรฐาน</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600">
              {admissionSettings?.allowISM && admissionSettings?.allowRegular 
                ? "ห้องเรียนพิเศษ ISM เน้นวิทยาศาสตร์และคณิตศาสตร์อย่างเข้มข้น"
                : admissionSettings?.allowISM 
                ? "ขณะนี้เปิดรับสมัครเฉพาะห้อง ISM เท่านั้น"
                : "ขณะนี้เปิดรับสมัครเฉพาะห้องทั่วไปเท่านั้น"
              }
            </p>
          </>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="title">คำนำหน้า *</Label>
          <Select value={formData.title} onValueChange={(val) => handleSelectChange("title", val)} required>
            <SelectTrigger className={cn("border-amber-200", errors?.title && "border-red-500")}>
              <SelectValue placeholder="เด็กชาย" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="เด็กชาย">เด็กชาย</SelectItem>
              <SelectItem value="เด็กหญิง">เด็กหญิง</SelectItem>
              <SelectItem value="นาย">นาย</SelectItem>
              <SelectItem value="นางสาว">นางสาว</SelectItem>
              <SelectItem value="นาง">นาง</SelectItem>
            </SelectContent>
          </Select>
          {errors?.title && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="firstNameTH">ชื่อ (ภาษาไทย) *</Label>
          <Input
            type="text"
            id="firstNameTH"
            name="firstNameTH"
            required
            value={formData.firstNameTH}
            onChange={handleChange}
            className={cn("border-amber-200", errors?.firstNameTH && "border-red-500")}
          />
          {errors?.firstNameTH && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.firstNameTH}
            </p>
          )}
          <p className="text-xs text-gray-500">ไม่ต้องใส่คำนำหน้า</p>
        </div>

        <div className="space-y-4">
          <Label htmlFor="lastNameTH">นามสกุล (ภาษาไทย) *</Label>
          <Input
            type="text"
            id="lastNameTH"
            name="lastNameTH"
            required
            value={formData.lastNameTH}
            onChange={handleChange}
            className={cn("border-amber-200", errors?.lastNameTH && "border-red-500")}
          />
          {errors?.lastNameTH && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.lastNameTH}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label htmlFor="birthDate">วันเกิด *</Label>
        <DatePicker
          date={formData.birthDate ? new Date(formData.birthDate) : undefined}
          setDate={(date) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              handleSelectChange('birthDate', `${year}-${month}-${day}`);
            } else {
              handleSelectChange('birthDate', "");
            }
          }}
          placeholder="เลือกวันเกิด"
        />
        {errors?.birthDate && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors.birthDate}
          </p>
        )}
        <p className="text-xs text-gray-500">ระบบจะแปลงเป็น พ.ศ. ให้อัตโนมัติ</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="phone">โทรศัพท์เคลื่อนที่ *</Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className={cn("border-amber-200", errors?.phone && "border-red-500")}
          />
          {errors?.phone && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="siblings">จำนวนพี่น้อง (คน) *<span className="text-xs"> **ไม่รวมตนเอง</span></Label>
          <Input
            type="number"
            id="siblings"
            name="siblings"
            required
            min="0"
            value={formData.siblings}
            onChange={handleChange}
            className={cn("border-amber-200", errors?.siblings && "border-red-500")}
          />
          {errors?.siblings && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.siblings}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="siblingsInSchool">มีพี่น้องเรียนที่โรงเรียนหนองบัว (คน) *</Label>
          <Input
            type="number"
            id="siblingsInSchool"
            name="siblingsInSchool"
            required
            min="0"
            value={formData.siblingsInSchool}
            onChange={handleChange}
            className="border-amber-200"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="ethnicity">เชื้อชาติ *</Label>
          <Select
            value={formData.ethnicity}
            onValueChange={(value) => handleSelectChange("ethnicity", value)}
          >
            <SelectTrigger className={cn("border-amber-200", errors?.ethnicity && "border-red-500")}>
              <SelectValue placeholder="เลือกเชื้อชาติ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ไทย">ไทย</SelectItem>
              <SelectItem value="จีน">จีน</SelectItem>
              <SelectItem value="มอญ">มอญ</SelectItem>
              <SelectItem value="ไทใหญ่">ไทใหญ่</SelectItem>
              <SelectItem value="กะเหรี่ยง">กะเหรี่ยง</SelectItem>
              <SelectItem value="ลาว">ลาว</SelectItem>
              <SelectItem value="เขมร">เขมร</SelectItem>
              <SelectItem value="มลายู">มลายู</SelectItem>
              <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {errors?.ethnicity && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.ethnicity}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="nationality">สัญชาติ *</Label>
          <Select
            value={formData.nationality}
            onValueChange={(value) => handleSelectChange("nationality", value)}
          >
            <SelectTrigger className={cn("border-amber-200", errors?.nationality && "border-red-500")}>
              <SelectValue placeholder="เลือกสัญชาติ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ไทย">ไทย</SelectItem>
              <SelectItem value="พม่า">พม่า</SelectItem>
              <SelectItem value="ลาว">ลาว</SelectItem>
              <SelectItem value="กัมพูชา">กัมพูชา</SelectItem>
              <SelectItem value="เวียดนาม">เวียดนาม</SelectItem>
              <SelectItem value="จีน">จีน</SelectItem>
              <SelectItem value="อินเดีย">อินเดีย</SelectItem>
              <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {errors?.nationality && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.nationality}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="religion">ศาสนา *</Label>
          <Select
            value={formData.religion}
            onValueChange={(value) => handleSelectChange("religion", value)}
          >
            <SelectTrigger className={cn("border-amber-200", errors?.religion && "border-red-500")}>
              <SelectValue placeholder="เลือกศาสนา" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="พุทธ">พุทธ</SelectItem>
              <SelectItem value="อิสลาม">อิสลาม</SelectItem>
              <SelectItem value="คริสต์">คริสต์</SelectItem>
              <SelectItem value="ฮินดู">ฮินดู</SelectItem>
              <SelectItem value="ซิกข์">ซิกข์</SelectItem>
              <SelectItem value="ไม่นับถือศาสนา">ไม่นับถือศาสนา</SelectItem>
              <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
            </SelectContent>
          </Select>
          {errors?.religion && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.religion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
