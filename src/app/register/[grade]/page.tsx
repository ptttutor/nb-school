"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  
  // ตรวจสอบ grade ที่ถูกต้อง
  const isM4 = grade === "m4";
  const gradeText = isM4 ? "มัธยมศึกษาปีที่ ๔" : "มัธยมศึกษาปีที่ ๑";
  
  const [formData, setFormData] = useState({
    idCardOrPassport: "",
    isSpecialISM: true,
    gradeLevel: grade,
    title: "",
    firstNameTH: "",
    lastNameTH: "",
    birthDate: "",
    ethnicity: "",
    nationality: "",
    religion: "",
    phone: "",
    siblings: "",
    siblingsInSchool: "",
    educationStatus: "",
    schoolName: "",
    schoolProvince: "",
    schoolDistrict: "",
    schoolSubdistrict: "",
    villageName: "",
    houseNumber: "",
    moo: "",
    road: "",
    soi: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
    // เกรดสำหรับ ม.1 (ป.5-6)
    scienceGradeP5: "",
    scienceGradeP6: "",
    mathGradeP5: "",
    mathGradeP6: "",
    // เกรดสำหรับ ม.4 (ม.1-3)
    scienceGradeM1: "",
    scienceGradeM2: "",
    scienceGradeM3: "",
    mathGradeM1: "",
    mathGradeM2: "",
    mathGradeM3: "",
  });

  const generateCaptcha = () => {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(num);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = (): string | null => {
    // Validate ID Card or Passport (Optional but if provided must be valid)
    if (formData.idCardOrPassport.trim()) {
      // If it's all digits, should be 13 digits (Thai ID)
      if (/^\d+$/.test(formData.idCardOrPassport)) {
        if (formData.idCardOrPassport.length !== 13) {
          return "เลขบัตรประชาชนต้องเป็น 13 หลัก";
        }
      } else {
        // Passport should have at least 6 characters
        if (formData.idCardOrPassport.length < 6) {
          return "หมายเลข Passport ต้องมีอย่างน้อย 6 ตัวอักษร";
        }
      }
    }

    // Validate title
    if (!formData.title) {
      return "กรุณาเลือกคำนำหน้าชื่อ";
    }

    // Validate names
    if (!formData.firstNameTH.trim()) {
      return "กรุณากรอกชื่อภาษาไทย";
    }
    if (!formData.lastNameTH.trim()) {
      return "กรุณากรอกนามสกุลภาษาไทย";
    }

    // Validate birth date
    if (!formData.birthDate) {
      return "กรุณาเลือกวันเกิด";
    }
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const hundredYearsAgo = new Date();
    hundredYearsAgo.setFullYear(today.getFullYear() - 100);
    
    if (birthDate > today) {
      return "วันเกิดไม่สามารถเป็นวันในอนาคต";
    }
    if (birthDate < hundredYearsAgo) {
      return "วันเกิดไม่ถูกต้อง";
    }

    // Validate demographic info
    if (!formData.ethnicity.trim()) {
      return "กรุณากรอกเชื้อชาติ";
    }
    if (!formData.nationality.trim()) {
      return "กรุณากรอกสัญชาติ";
    }
    if (!formData.religion.trim()) {
      return "กรุณากรอกศาสนา";
    }

    // Validate phone
    if (!formData.phone.trim()) {
      return "กรุณากรอกเบอร์โทรศัพท์";
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      return "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก เริ่มต้นด้วย 0";
    }

    // Validate siblings
    const siblings = parseInt(formData.siblings);
    const siblingsInSchool = parseInt(formData.siblingsInSchool);
    
    if (isNaN(siblings) || siblings < 0) {
      return "จำนวนพี่น้องต้องเป็นตัวเลขที่ไม่ติดลบ";
    }
    if (isNaN(siblingsInSchool) || siblingsInSchool < 0) {
      return "จำนวนพี่น้องที่กำลังศึกษาต้องเป็นตัวเลขที่ไม่ติดลบ";
    }
    if (siblingsInSchool > siblings) {
      return "จำนวนพี่น้องที่กำลังศึกษาไม่สามารถมากกว่าจำนวนพี่น้องทั้งหมด";
    }

    // Validate address
    if (!formData.houseNumber.trim()) {
      return "กรุณากรอกบ้านเลขที่";
    }
    if (!formData.province.trim()) {
      return "กรุณากรอกจังหวัด";
    }
    if (!formData.district.trim()) {
      return "กรุณากรอกอำเภอ/เขต";
    }
    if (!formData.subdistrict.trim()) {
      return "กรุณากรอกตำบล/แขวง";
    }

    // Validate postal code
    if (!formData.postalCode.trim()) {
      return "กรุณากรอกรหัสไปรษณีย์";
    }
    const postalCodeRegex = /^\d{5}$/;
    if (!postalCodeRegex.test(formData.postalCode)) {
      return "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    // Validate education status
    if (!formData.educationStatus) {
      return "กรุณาเลือกสถานะการศึกษา";
    }

    // Validate school info
    if (!formData.schoolName.trim()) {
      return "กรุณากรอกชื่อโรงเรียน";
    }
    if (!formData.schoolProvince.trim()) {
      return "กรุณากรอกจังหวัดของโรงเรียน";
    }
    if (!formData.schoolDistrict.trim()) {
      return "กรุณากรอกอำเภอ/เขตของโรงเรียน";
    }
    if (!formData.schoolSubdistrict.trim()) {
      return "กรุณากรอกตำบล/แขวงของโรงเรียน";
    }

    return null; // No errors
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate form fields
    const validationError = validateForm();
    if (validationError) {
      setMessage(validationError);
      setLoading(false);
      return;
    }

    // Validate CAPTCHA
    if (captchaInput !== captcha) {
      setMessage("รหัสป้องกัน bot ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to registration details page
        router.push(`/registration/${data.registration.id}`);
      } else {
        setMessage(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur mb-4">
          <CardHeader>
            <div className="mb-4">
              <Link href="/register" className="text-amber-700 hover:text-amber-900 text-sm font-medium transition-colors inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                เปลี่ยนระดับชั้น
              </Link>
            </div>
            <CardTitle className="text-3xl text-amber-900">
              แบบฟอร์มสมัครเรียน {gradeText}
            </CardTitle>
            <CardDescription className="text-base">
              โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
            </CardDescription>
            <CardDescription className="text-base mt-1">
              กรุณากรอกข้อมูลให้ครบถ้วน ฟิลด์ที่มีเครื่องหมาย * จำเป็นต้องกรอก
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                  message.includes("สำเร็จ")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {message.includes("สำเร็จ") ? (
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* ส่วนที่ 1: ข้อมูลผู้สมัคร */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
                  <Badge className="bg-amber-600 text-white text-base px-3 py-1">1</Badge>
                  <h3 className="text-xl font-bold text-amber-900">ข้อมูลผู้สมัคร (นักเรียน)</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCardOrPassport">
                    เลขบัตรประจำตัวประชาชน / Passport Number (ไม่บังคับ)
                    <span className="text-amber-600 text-xs ml-2">(ไม่ต้องใส่เครื่องหมาย -)</span>
                  </Label>
                  <Input
                    type="text"
                    id="idCardOrPassport"
                    name="idCardOrPassport"
                    value={formData.idCardOrPassport}
                    onChange={handleChange}
                    placeholder="Ex. 1234567891234"
                    className="border-amber-200"
                  />
                  <p className="text-xs text-gray-500">ข้อมูลนี้ช่วยป้องกันการสมัครซ้ำและรักษาความปลอดภัยในการจัดเก็บข้อมูล หากกรอกกรุณากรอกให้ถูกต้องเหมือนบัตรของตัวนักเรียน</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isSpecialISM">ประเภทห้องเรียน *</Label>
                  <Select 
                    value={formData.isSpecialISM ? "true" : "false"} 
                    onValueChange={(val) => handleSelectChange("isSpecialISM", val === "true")} 
                    required
                  >
                    <SelectTrigger className="border-amber-200">
                      <SelectValue placeholder="เลือกประเภทห้องเรียน" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-600 text-white text-xs">ISM</Badge>
                          <span>ห้องเรียนพิเศษ ISM (Intensive Science and Mathematics)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <span>ห้องเรียนทั่วไป</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-600">
                    ห้องเรียนพิเศษ ISM เน้นวิทยาศาสตร์และคณิตศาสตร์อย่างเข้มข้น
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">คำนำหน้า *</Label>
                    <Select value={formData.title} onValueChange={(val) => handleSelectChange("title", val)} required>
                      <SelectTrigger className="border-amber-200">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstNameTH">ชื่อ (ภาษาไทย) *</Label>
                    <Input
                      type="text"
                      id="firstNameTH"
                      name="firstNameTH"
                      required
                      value={formData.firstNameTH}
                      onChange={handleChange}
                      className="border-amber-200"
                    />
                    <p className="text-xs text-gray-500">ไม่ต้องใส่คำนำหน้า</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastNameTH">นามสกุล (ภาษาไทย) *</Label>
                    <Input
                      type="text"
                      id="lastNameTH"
                      name="lastNameTH"
                      required
                      value={formData.lastNameTH}
                      onChange={handleChange}
                      className="border-amber-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">วันเกิด *</Label>
                  <Input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="border-amber-200"
                  />
                  <p className="text-xs text-gray-500">ระบบจะแปลงเป็น พ.ศ. ให้อัตโนมัติ</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">โทรศัพท์เคลื่อนที่ *</Label>
                    <Input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="border-amber-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siblings">จำนวนพี่น้อง (คน) *<span className="text-xs"> **ไม่รวมตนเอง</span></Label>
                    <Input
                      type="number"
                      id="siblings"
                      name="siblings"
                      required
                      min="0"
                      value={formData.siblings}
                      onChange={handleChange}
                      className="border-amber-200"
                    />
                  </div>

                  <div className="space-y-2">
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

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ethnicity">เชื้อชาติ *</Label>
                    <Select
                      value={formData.ethnicity}
                      onValueChange={(value) => handleSelectChange("ethnicity", value)}
                    >
                      <SelectTrigger className="border-amber-200">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">สัญชาติ *</Label>
                    <Select
                      value={formData.nationality}
                      onValueChange={(value) => handleSelectChange("nationality", value)}
                    >
                      <SelectTrigger className="border-amber-200">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="religion">ศาสนา *</Label>
                    <Select
                      value={formData.religion}
                      onValueChange={(value) => handleSelectChange("religion", value)}
                    >
                      <SelectTrigger className="border-amber-200">
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
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 2: ที่อยู่ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
                  <Badge className="bg-amber-600 text-white text-base px-3 py-1">2</Badge>
                  <h3 className="text-xl font-bold text-amber-900">ที่อยู่ตามทะเบียนบ้าน (นักเรียน)</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
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

                  <div className="space-y-2">
                    <Label htmlFor="houseNumber">บ้านเลขที่ *</Label>
                    <Input
                      type="text"
                      id="houseNumber"
                      name="houseNumber"
                      required
                      value={formData.houseNumber}
                      onChange={handleChange}
                      className="border-amber-200"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="moo">หมู่ที่ *</Label>
                    <Input
                      type="text"
                      id="moo"
                      name="moo"
                      value={formData.moo}
                      onChange={handleChange}
                      className="border-amber-200"
                    />
                  </div>

                  <div className="space-y-2">
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

                  <div className="space-y-2">
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

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="province">จังหวัด *</Label>
                    <Input
                      type="text"
                      id="province"
                      name="province"
                      required
                      value={formData.province}
                      onChange={handleChange}
                      placeholder="กรอกจังหวัด"
                      className="border-amber-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">เขต/อำเภอ *</Label>
                    <Input
                      type="text"
                      id="district"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="กรอกอำเภอ"
                      className="border-amber-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdistrict">แขวง/ตำบล *</Label>
                    <Input
                      type="text"
                      id="subdistrict"
                      name="subdistrict"
                      required
                      value={formData.subdistrict}
                      onChange={handleChange}
                      placeholder="กรอกตำบล"
                      className="border-amber-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">รหัสไปรษณีย์ *</Label>
                    <Input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      maxLength={5}
                      className="border-amber-200"
                    />
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 3: ข้อมูลการศึกษา */}
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
                            <span>กำลังศึกษาอยู่ชั้นมัธยมศึกษาปีที่ 3</span>
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
                            <span>จบการศึกษาชั้นมัธยมศึกษาปีที่ 3</span>
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
                            <span>กำลังศึกษาอยู่ชั้นประถมศึกษาปีที่ 6</span>
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
                            <span>จบการศึกษาชั้นประถมศึกษาปีที่ 6</span>
                          </label>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">โรงเรียน * <span className="text-xs text-gray-500">(ไม่ต้องใส่คำว่าโรงเรียน)</span></Label>
                      <Input
                        type="text"
                        id="schoolName"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleChange}
                        placeholder="Ex. โรงเรียนหนองบัว"
                        className="border-amber-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolProvince">จังหวัด *</Label>
                      <Input
                        type="text"
                        id="schoolProvince"
                        name="schoolProvince"
                        value={formData.schoolProvince}
                        onChange={handleChange}
                        placeholder="กรอกจังหวัด"
                        className="border-amber-200"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="schoolDistrict">เขต/อำเภอ *</Label>
                      <Input
                        type="text"
                        id="schoolDistrict"
                        name="schoolDistrict"
                        value={formData.schoolDistrict}
                        onChange={handleChange}
                        placeholder="กรอกอำเภอ"
                        className="border-amber-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolSubdistrict">แขวง/ตำบล *</Label>
                      <Input
                        type="text"
                        id="schoolSubdistrict"
                        name="schoolSubdistrict"
                        value={formData.schoolSubdistrict}
                        onChange={handleChange}
                        placeholder="กรอกตำบล"
                        className="border-amber-200"
                      />
                    </div>
                  </div>

                  {/* ฟิลด์เกรดเฉลี่ย */}
                  <div className="space-y-4 pt-4 border-t border-amber-200">
                    <Label className="text-base font-medium">เกรดเฉลี่ยรายวิชา *</Label>
                    <div className="grid md:grid-cols-2 gap-6">
                      {isM4 ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="scienceGradeM1">เกรดเฉลี่ยวิทยาศาสตร์ ม.1 *</Label>
                            <Input
                              type="text"
                              id="scienceGradeM1"
                              name="scienceGradeM1"
                              value={formData.scienceGradeM1}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="scienceGradeM2">เกรดเฉลี่ยวิทยาศาสตร์ ม.2 *</Label>
                            <Input
                              type="text"
                              id="scienceGradeM2"
                              name="scienceGradeM2"
                              value={formData.scienceGradeM2}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="scienceGradeM3">เกรดเฉลี่ยวิทยาศาสตร์ ม.3 *</Label>
                            <Input
                              type="text"
                              id="scienceGradeM3"
                              name="scienceGradeM3"
                              value={formData.scienceGradeM3}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mathGradeM1">เกรดเฉลี่ยคณิตศาสตร์ ม.1 *</Label>
                            <Input
                              type="text"
                              id="mathGradeM1"
                              name="mathGradeM1"
                              value={formData.mathGradeM1}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mathGradeM2">เกรดเฉลี่ยคณิตศาสตร์ ม.2 *</Label>
                            <Input
                              type="text"
                              id="mathGradeM2"
                              name="mathGradeM2"
                              value={formData.mathGradeM2}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="mathGradeM3">เกรดเฉลี่ยคณิตศาสตร์ ม.3 *</Label>
                            <Input
                              type="text"
                              id="mathGradeM3"
                              name="mathGradeM3"
                              value={formData.mathGradeM3}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="scienceGradeP5">เกรดเฉลี่ยวิทยาศาสตร์ ป.5 *</Label>
                            <Input
                              type="text"
                              id="scienceGradeP5"
                              name="scienceGradeP5"
                              value={formData.scienceGradeP5}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="scienceGradeP6">เกรดเฉลี่ยวิทยาศาสตร์ ป.6 *</Label>
                            <Input
                              type="text"
                              id="scienceGradeP6"
                              name="scienceGradeP6"
                              value={formData.scienceGradeP6}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mathGradeP5">เกรดเฉลี่ยคณิตศาสตร์ ป.5 *</Label>
                            <Input
                              type="text"
                              id="mathGradeP5"
                              name="mathGradeP5"
                              value={formData.mathGradeP5}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mathGradeP6">เกรดเฉลี่ยคณิตศาสตร์ ป.6 *</Label>
                            <Input
                              type="text"
                              id="mathGradeP6"
                              name="mathGradeP6"
                              value={formData.mathGradeP6}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ส่วนที่ 4: จำนวนต้องใส่ */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
                  <Badge className="bg-amber-600 text-white text-base px-3 py-1">4</Badge>
                  <h3 className="text-xl font-bold text-amber-900">ยืนยันตัวตน (ป้องกัน Bot)</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="captcha">กรุณากรอกตัวเลข 4 หลักที่เห็นด้านล่าง *</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-lg px-8 py-4 flex items-center justify-center">
                      <span className="text-4xl font-bold text-amber-900 tracking-wider select-none" style={{ fontFamily: 'monospace' }}>
                        {captcha}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={generateCaptcha}
                      variant="outline"
                      className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      สุ่มใหม่
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Input
                      type="text"
                      id="captcha"
                      name="captcha"
                      required
                      maxLength={4}
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      placeholder="กรอกตัวเวลข 4 หลัก"
                      className="border-amber-200 text-center text-2xl tracking-wider"
                      style={{ fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all text-lg py-6"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    กำลังส่งข้อมูล...
                  </>
                ) : (
                  "บันทึกข้อมูลการสมัครเรียน"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
