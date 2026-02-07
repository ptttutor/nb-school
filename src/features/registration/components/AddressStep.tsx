// Step 2: Address Information Component

'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROVINCES, DISTRICTS, SUBDISTRICTS } from "@/lib/thailand-data";
import type { RegistrationStepProps } from '@/types/registration.types';

interface AddressStepProps extends RegistrationStepProps {
  province: string;
  district: string;
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  onSubdistrictChange: (subdistrict: string) => void;
}

export function AddressStep({ 
  formData, 
  handleChange,
  handleSelectChange,
  province,
  district,
  onProvinceChange,
  onDistrictChange,
  onSubdistrictChange,
  errors = {}
}: AddressStepProps) {
  // ดึงรายการอำเภอตามจังหวัดที่เลือก
  const availableDistricts = province ? DISTRICTS[province] || [] : [];

  // ดึงรายการตำบลตามจังหวัดและอำเภอที่เลือก
  const subdistrictKey = `${province}-${district}`;
  const availableSubdistricts = subdistrictKey && SUBDISTRICTS[subdistrictKey] ? SUBDISTRICTS[subdistrictKey] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
        <Badge className="bg-amber-600 text-white text-base px-3 py-1">2</Badge>
        <h3 className="text-xl font-bold text-amber-900">ที่อยู่ตามทะเบียนบ้าน (นักเรียน)</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="villageName">ชื่อหมู่บ้าน *</Label>
          <Input
            type="text"
            id="villageName"
            name="villageName"
            value={formData.villageName}
            onChange={handleChange}
            className="border-amber-200"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="houseNumber">บ้านเลขที่ *</Label>
          <Input
            type="text"
            id="houseNumber"
            name="houseNumber"
            required
            value={formData.houseNumber}
            onChange={handleChange}
            className={cn("border-amber-200", errors?.houseNumber && "border-red-500")}
          />
          {errors?.houseNumber && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.houseNumber}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="moo">หมู่ที่ *</Label>
          <Input
            type="number"
            id="moo"
            name="moo"
            value={formData.moo}
            onChange={handleChange}
            className="border-amber-200"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="road">ถนน</Label>
          <Input
            type="text"
            id="road"
            name="road"
            value={formData.road}
            onChange={handleChange}
            className="border-amber-200"
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="soi">ซอย</Label>
          <Input
            type="text"
            id="soi"
            name="soi"
            value={formData.soi}
            onChange={handleChange}
            className="border-amber-200"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-4">
          <Label htmlFor="province">จังหวัด *</Label>
          <Select
            value={formData.province}
            onValueChange={onProvinceChange}
          >
            <SelectTrigger className={cn("border-amber-200", errors?.province && "border-red-500")}>
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
          {errors?.province && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.province}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="district">เขต/อำเภอ *</Label>
          {province && availableDistricts.length > 0 ? (
            <Select
              value={formData.district}
              onValueChange={onDistrictChange}
            >
              <SelectTrigger className={cn("border-amber-200", errors?.district && "border-red-500")}>
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
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder={province ? "กรอกอำเภอ" : "เลือกจังหวัดก่อน"}
              className={cn("border-amber-200", errors?.district && "border-red-500")}
              disabled={!province}
            />
          )}
          {errors?.district && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.district}
            </p>
          )}
          {province && availableDistricts.length === 0 && (
            <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="subdistrict">แขวง/ตำบล *</Label>
          {district && availableSubdistricts.length > 0 ? (
            <Select
              value={formData.subdistrict}
              onValueChange={onSubdistrictChange}
            >
              <SelectTrigger className={cn("border-amber-200", errors?.subdistrict && "border-red-500")}>
                <SelectValue placeholder="เลือกตำบล" />
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
              id="subdistrict"
              name="subdistrict"
              value={formData.subdistrict}
              onChange={handleChange}
              placeholder={district ? "กรอกตำบล" : "เลือกอำเภอก่อน"}
              className={cn("border-amber-200", errors?.subdistrict && "border-red-500")}
              disabled={!district}
            />
          )}
          {errors?.subdistrict && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.subdistrict}
            </p>
          )}
          {district && availableSubdistricts.length === 0 && (
            <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
          )}
        </div>

        <div className="space-y-4">
          <Label htmlFor="postalCode">รหัสไปรษณีย์ *</Label>
          <Input
            type="text"
            id="postalCode"
            name="postalCode"
            required
            value={formData.postalCode}
            onChange={handleChange}
            maxLength={5}
            className={cn("border-amber-200", errors?.postalCode && "border-red-500")}
          />
          {errors?.postalCode && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.postalCode}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
