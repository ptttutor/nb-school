"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw, Upload, Bell, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { PROVINCES, DISTRICTS, SUBDISTRICTS, NONGBUA_SCHOOLS } from "@/lib/thailand-data";

export default function RegisterPage({
  params,
}: {
  params: Promise<{ grade: string }>;
}) {
  const { grade } = use(params);
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // States สำหรับเอกสารแนบ
  const [houseRegistrationFile, setHouseRegistrationFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  // States สำหรับ Admission Settings
  const [admissionSettings, setAdmissionSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  
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
    // เกรดสำหรับ ม.1 (ป.4-5)
    gradeP4: "",
    gradeP5: "",
    // คะแนนสำหรับ ม.4 (ม.1-3 จำนวน 5 ภาคเรียน)
    scienceCumulativeM1M3: "",  // วิทยาศาสตร์
    mathCumulativeM1M3: "",     // คณิตศาสตร์
    englishCumulativeM1M3: "",  // ภาษาอังกฤษ
  });

  const generateCaptcha = () => {
    const num = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(num);
    setCaptchaInput("");
  };

  useEffect(() => {
    generateCaptcha();
    fetchAdmissionSettings();
  }, [grade]);

  const fetchAdmissionSettings = async () => {
    try {
      const response = await fetch(`/api/admission?gradeLevel=${grade}`);
      if (response.ok) {
        const data = await response.json();
        setAdmissionSettings(data);
      }
    } catch (error) {
      console.error("Error fetching admission settings:", error);
    } finally {
      setLoadingSettings(false);
    }
  };

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

  const handleSchoolSelect = (schoolName: string) => {
    const school = NONGBUA_SCHOOLS.find(s => s.name === schoolName);
    setFormData({
      ...formData,
      schoolName: schoolName,
      schoolSubdistrict: school?.subdistrict || "",
    });
  };

  const isNongbuaDistrict = formData.schoolProvince === "นครสวรรค์" && formData.schoolDistrict === "หนองบัว";

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนจังหวัด
  const handleProvinceChange = (province: string) => {
    setFormData({
      ...formData,
      schoolProvince: province,
      schoolDistrict: "",
      schoolSubdistrict: "",
      schoolName: "",
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนอำเภอ
  const handleDistrictChange = (district: string) => {
    setFormData({
      ...formData,
      schoolDistrict: district,
      schoolSubdistrict: "",
      schoolName: "",
    });
  };

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนตำบล
  const handleSubdistrictChange = (subdistrict: string) => {
    setFormData({
      ...formData,
      schoolSubdistrict: subdistrict,
    });
  };

  // ดึงรายการอำเภอตามจังหวัดที่เลือก (โรงเรียน)
  const availableDistricts = formData.schoolProvince ? DISTRICTS[formData.schoolProvince] || [] : [];

  // ดึงรายการตำบลตามจังหวัดและอำเภอที่เลือก (โรงเรียน)
  const subdistrictKey = `${formData.schoolProvince}-${formData.schoolDistrict}`;
  const availableSubdistricts = subdistrictKey && SUBDISTRICTS[subdistrictKey] ? SUBDISTRICTS[subdistrictKey] : [];

  // ฟังก์ชันสำหรับจัดการที่อยู่นักเรียน
  const handleStudentProvinceChange = (province: string) => {
    setFormData({
      ...formData,
      province: province,
      district: "",
      subdistrict: "",
    });
  };

  const handleStudentDistrictChange = (district: string) => {
    setFormData({
      ...formData,
      district: district,
      subdistrict: "",
    });
  };

  const handleStudentSubdistrictChange = (subdistrict: string) => {
    setFormData({
      ...formData,
      subdistrict: subdistrict,
    });
  };

  // ดึงรายการอำเภอตามจังหวัดที่เลือก (นักเรียน)
  const availableStudentDistricts = formData.province ? DISTRICTS[formData.province] || [] : [];

  // ดึงรายการตำบลตามจังหวัดและอำเภอที่เลือก (นักเรียน)
  const studentSubdistrictKey = `${formData.province}-${formData.district}`;
  const availableStudentSubdistricts = studentSubdistrictKey && SUBDISTRICTS[studentSubdistrictKey] ? SUBDISTRICTS[studentSubdistrictKey] : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'house' | 'transcript' | 'photo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ขนาดไฟล์ต้องไม่เกิน 5MB",
      });
      return;
    }

    switch (fileType) {
      case 'house':
        setHouseRegistrationFile(file);
        break;
      case 'transcript':
        setTranscriptFile(file);
        break;
      case 'photo':
        setPhotoFile(file);
        break;
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const validateForm = (): string | null => {
    // Validate Thai National ID Card (Required)
    if (!formData.idCardOrPassport.trim()) {
      return "กรุณากรอกเลขบัตรประชาชน";
    }
    
    // Must be exactly 13 digits (Thai ID)
    if (!/^\d{13}$/.test(formData.idCardOrPassport)) {
      return "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก";
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

  // Validate specific step
  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1: // Student Info
        if (!formData.idCardOrPassport.trim()) return "กรุณากรอกเลขบัตรประชาชน";
        if (!/^\d{13}$/.test(formData.idCardOrPassport)) return "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก";
        if (!formData.title) return "กรุณาเลือกคำนำหน้าชื่อ";
        if (!formData.firstNameTH.trim()) return "กรุณากรอกชื่อภาษาไทย";
        if (!formData.lastNameTH.trim()) return "กรุณากรอกนามสกุลภาษาไทย";
        if (!formData.birthDate) return "กรุณาเลือกวันเกิด";
        if (!formData.ethnicity.trim()) return "กรุณากรอกเชื้อชาติ";
        if (!formData.nationality.trim()) return "กรุณากรอกสัญชาติ";
        if (!formData.religion.trim()) return "กรุณากรอกศาสนา";
        if (!formData.phone.trim()) return "กรุณากรอกเบอร์โทรศัพท์";
        if (!/^0\d{9}$/.test(formData.phone)) return "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก เริ่มต้นด้วย 0";
        return null;
      
      case 2: // Address
        if (!formData.houseNumber.trim()) return "กรุณากรอกบ้านเลขที่";
        if (!formData.province.trim()) return "กรุณากรอกจังหวัด";
        if (!formData.district.trim()) return "กรุณากรอกอำเภอ/เขต";
        if (!formData.subdistrict.trim()) return "กรุณากรอกตำบล/แขวง";
        if (!formData.postalCode.trim()) return "กรุณากรอกรหัสไปรษณีย์";
        if (!/^\d{5}$/.test(formData.postalCode)) return "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
        return null;
      
      case 3: // Education
        if (!formData.educationStatus) return "กรุณาเลือกสถานะการศึกษา";
        if (!formData.schoolName.trim()) return "กรุณากรอกชื่อโรงเรียน";
        if (!formData.schoolProvince.trim()) return "กรุณากรอกจังหวัดของโรงเรียน";
        if (!formData.schoolDistrict.trim()) return "กรุณากรอกอำเภอ/เขตของโรงเรียน";
        if (!formData.schoolSubdistrict.trim()) return "กรุณากรอกตำบล/แขวงของโรงเรียน";
        return null;
      
      case 4: // Grades (skip validation, will be done in final submit)
        return null;
      
      case 5: // Parent Info (skip validation for now, will add when we implement parent fields)
        return null;
      
      case 6: // Documents
        return null;
      
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      toast({
        variant: "destructive",
        title: "กรุณาตรวจสอบข้อมูล",
        description: error,
      });
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    const validationError = validateForm();
    if (validationError) {
      toast({
        variant: "destructive",
        title: "กรุณาตรวจสอบข้อมูล",
        description: validationError,
      });
      setLoading(false);
      return;
    }

    // Validate CAPTCHA
    if (captchaInput !== captcha) {
      toast({
        variant: "destructive",
        title: "รหัสไม่ถูกต้อง",
        description: "รหัสป้องกัน bot ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
      });
      setLoading(false);
      generateCaptcha();
      return;
    }

    try {
      // อัปโหลดไฟล์เอกสารก่อน (ถ้ามี)
      setUploadingFiles(true);
      let houseRegistrationUrl: string | null = null;
      let transcriptUrl: string | null = null;
      let photoUrl: string | null = null;

      if (houseRegistrationFile) {
        houseRegistrationUrl = await uploadFile(houseRegistrationFile);
        if (!houseRegistrationUrl) {
          toast({
            variant: "destructive",
            title: "ข้อผิดพลาดในการอัปโหลด",
            description: "เกิดข้อผิดพลาดในการอัปโหลดสำเนาทะเบียนบ้าน",
          });
          setLoading(false);
          setUploadingFiles(false);
          return;
        }
      }

      if (transcriptFile) {
        transcriptUrl = await uploadFile(transcriptFile);
        if (!transcriptUrl) {
          toast({
            variant: "destructive",
            title: "ข้อผิดพลาดในการอัปโหลด",
            description: "เกิดข้อผิดพลาดในการอัปโหลดหลักฐานแสดงผลการเรียน",
          });
          setLoading(false);
          setUploadingFiles(false);
          return;
        }
      }

      if (photoFile) {
        photoUrl = await uploadFile(photoFile);
        if (!photoUrl) {
          toast({
            variant: "destructive",
            title: "ข้อผิดพลาดในการอัปโหลด",
            description: "เกิดข้อผิดพลาดในการอัปโหลดรูปถ่าย",
          });
          setLoading(false);
          setUploadingFiles(false);
          return;
        }
      }

      setUploadingFiles(false);

      // ส่งข้อมูลฟอร์มพร้อม URL ของไฟล์
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          houseRegistrationDoc: houseRegistrationUrl,
          transcriptDoc: transcriptUrl,
          photoDoc: photoUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "สมัครเรียนสำเร็จ",
          description: "กำลังนำคุณไปยังหน้ารายละเอียดการสมัคร",
        });
        // Redirect to registration details page
        setTimeout(() => {
          router.push(`/registration/${data.registration.id}`);
        }, 1000);
      } else {
        toast({
          variant: "destructive",
          title: "ไม่สามารถสมัครได้",
          description: data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
      });
    } finally {
      setLoading(false);
      setUploadingFiles(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 overflow-x-hidden">
      <div className="max-w-5xl mx-auto py-2 sm:py-4 w-full">
        {loadingSettings ? (
          <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </CardContent>
          </Card>
        ) : !admissionSettings?.isOpen ? (
          <Card className="shadow-xl border-red-200 bg-white/95 backdrop-blur">
            <CardHeader>
              <div className="mb-4">
                <Link href="/register" className="text-amber-700 hover:text-amber-900 text-sm font-medium transition-colors inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  เปลี่ยนระดับชั้น
                </Link>
              </div>
              <CardTitle className="text-3xl text-red-900 flex items-center gap-3">
                <AlertCircle className="w-8 h-8" />
                ปิดรับสมัคร {gradeText}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg text-red-800">
                ขณะนี้ยังไม่เปิดรับสมัครหรือปิดรับสมัครแล้ว
              </p>
              {admissionSettings?.announcement && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">ประกาศ:</h3>
                  <div className="text-sm text-blue-800 whitespace-pre-line">
                    {admissionSettings.announcement}
                  </div>
                </div>
              )}
              {(admissionSettings?.startDate || admissionSettings?.endDate) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="font-semibold text-amber-900 mb-2">ช่วงเวลารับสมัคร:</h3>
                  <p className="text-sm text-amber-800">
                    {admissionSettings.startDate && `เริ่ม: ${new Date(admissionSettings.startDate).toLocaleString('th-TH')}`}
                    {admissionSettings.startDate && admissionSettings.endDate && ' - '}
                    {admissionSettings.endDate && `สิ้นสุด: ${new Date(admissionSettings.endDate).toLocaleString('th-TH')}`}
                  </p>
                </div>
              )}
              <div className="pt-4">
                <Link href="/">
                  <Button variant="outline" className="border-amber-300 text-amber-700">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับหน้าแรก
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* แสดงประกาศสำคัญ */}
            {admissionSettings?.announcement && (
              <div className="space-y-4 mb-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      ประกาศสำคัญ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-blue-800 whitespace-pre-line">
                      {admissionSettings.announcement}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur mb-4 max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col">
          <CardHeader className="flex-shrink-0">
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
              กรุณากรอกข้อมูลให้ครบถ้วน ช่องที่มีเครื่องหมาย * จำเป็นต้องกรอก
            </CardDescription>
          </CardHeader>
          
          {/* Step Indicator */}
          <div className="px-6 pb-4 flex-shrink-0 border-b border-amber-100">
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center justify-between min-w-[600px] sm:min-w-0">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div key={step} className="flex items-center flex-1 min-w-0">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
                          step < currentStep
                            ? "bg-green-500 text-white"
                            : step === currentStep
                            ? "bg-amber-600 text-white ring-4 ring-amber-200"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step < currentStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
                      </div>
                      <p className={`text-[10px] sm:text-xs mt-1 sm:mt-2 text-center px-1 ${step === currentStep ? "font-semibold text-amber-900" : "text-gray-500"}`}>
                        {step === 1 && "ข้อมูล"}
                        {step === 2 && "ที่อยู่"}
                        {step === 3 && "การศึกษา"}
                        {step === 4 && "ผลเรียน"}
                        {step === 5 && "ปกครอง"}
                        {step === 6 && "เอกสาร"}
                      </p>
                    </div>
                    {step < 6 && (
                      <div
                        className={`h-1 flex-1 transition-all ${
                          step < currentStep ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
            <CardContent>
              <form id="registration-form" onSubmit={handleSubmit} className="space-y-8 pb-4">
              {/* Step 1: ข้อมูลผู้สมัคร */}
              {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200 mt-4">
                  <Badge className="bg-amber-600 text-white text-base px-3 py-1">1</Badge>
                  <h3 className="text-xl font-bold text-amber-900">ข้อมูลผู้สมัคร (นักเรียน)</h3>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idCardOrPassport">
                    เลขบัตรประจำตัวประชาชน *
                  </Label>
                  <Input
                    type="text"
                    id="idCardOrPassport"
                    name="idCardOrPassport"
                    value={formData.idCardOrPassport}
                    onChange={handleChange}
                    placeholder="กรอกเลข 13 หลัก (ไม่ต้องใส่เครื่องหมาย -)"
                    pattern="[0-9]{13}"
                    maxLength={13}
                    className="border-amber-200"
                    required
                  />
                  <p className="text-xs text-gray-500">กรุณากรอกเลขบัตรประชาชนไทย 13 หลัก ตัวอย่าง: 1234567891234 (ข้อมูลนี้ช่วยป้องกันการสมัครซ้ำ)</p>
                </div>

                <div className="space-y-2">
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
                              <div className="flex items-center gap-2">
                                <Badge className="bg-amber-600 text-white text-xs">ISM</Badge>
                                <span>ห้องเรียนพิเศษ ISM (Intensive Science and Mathematics)</span>
                              </div>
                            </SelectItem>
                          )}
                          {admissionSettings?.allowRegular && (
                            <SelectItem value="false">
                              <div className="flex items-center gap-2">
                                <span>ห้องเรียนทั่วไป</span>
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
                  <DatePicker
                    date={formData.birthDate ? new Date(formData.birthDate) : undefined}
                    setDate={(date) => {
                      if (date) {
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        setFormData({...formData, birthDate: `${year}-${month}-${day}`});
                      } else {
                        setFormData({...formData, birthDate: ""});
                      }
                    }}
                    placeholder="เลือกวันเกิด"
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
              )}

              {/* Step 2: ที่อยู่ตามทะเบียนบ้าน */}
              {currentStep === 2 && (
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
                    <Select
                      value={formData.province}
                      onValueChange={handleStudentProvinceChange}
                    >
                      <SelectTrigger className="border-amber-200">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">เขต/อำเภอ *</Label>
                    {formData.province && availableStudentDistricts.length > 0 ? (
                      <Select
                        value={formData.district}
                        onValueChange={handleStudentDistrictChange}
                      >
                        <SelectTrigger className="border-amber-200">
                          <SelectValue placeholder="เลือกอำเภอ" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStudentDistricts.map((district) => (
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
                        placeholder={formData.province ? "กรอกอำเภอ" : "เลือกจังหวัดก่อน"}
                        className="border-amber-200"
                        disabled={!formData.province}
                      />
                    )}
                    {formData.province && availableStudentDistricts.length === 0 && (
                      <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdistrict">แขวง/ตำบล *</Label>
                    {formData.district && availableStudentSubdistricts.length > 0 ? (
                      <Select
                        value={formData.subdistrict}
                        onValueChange={handleStudentSubdistrictChange}
                      >
                        <SelectTrigger className="border-amber-200">
                          <SelectValue placeholder="เลือกตำบล" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableStudentSubdistricts.map((subdistrict) => (
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
                        placeholder={formData.district ? "กรอกตำบล" : "เลือกอำเภอก่อน"}
                        className="border-amber-200"
                        disabled={!formData.district}
                      />
                    )}
                    {formData.district && availableStudentSubdistricts.length === 0 && (
                      <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
                    )}
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
              )}

              {/* Step 3: ข้อมูลการศึกษา */}
              {currentStep === 3 && (
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

                  <div className="space-y-2">
                    <Label htmlFor="schoolProvince">จังหวัด *</Label>
                    <Select
                      value={formData.schoolProvince}
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger className="border-amber-200">
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="schoolDistrict">เขต/อำเภอ *</Label>
                      {formData.schoolProvince && availableDistricts.length > 0 ? (
                        <Select
                          value={formData.schoolDistrict}
                          onValueChange={handleDistrictChange}
                        >
                          <SelectTrigger className="border-amber-200">
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
                          placeholder={formData.schoolProvince ? "กรอกอำเภอ" : "เลือกจังหวัดก่อน"}
                          className="border-amber-200"
                          disabled={!formData.schoolProvince}
                        />
                      )}
                      {formData.schoolProvince && availableDistricts.length === 0 && (
                        <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="schoolSubdistrict">แขวง/ตำบล *</Label>
                      {formData.schoolDistrict && availableSubdistricts.length > 0 ? (
                        <Select
                          value={formData.schoolSubdistrict}
                          onValueChange={handleSubdistrictChange}
                          disabled={isNongbuaDistrict && formData.schoolName !== ""}
                        >
                          <SelectTrigger className="border-amber-200">
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
                          placeholder={formData.schoolDistrict ? "กรอกตำบล" : "เลือกอำเภอก่อน"}
                          className="border-amber-200"
                          disabled={!formData.schoolDistrict || (isNongbuaDistrict && formData.schoolName !== "")}
                        />
                      )}
                      {isNongbuaDistrict && formData.schoolName && (
                        <p className="text-xs text-green-600">✓ ตำบลถูกกรอกอัตโนมัติจากการเลือกโรงเรียน</p>
                      )}
                      {formData.schoolDistrict && availableSubdistricts.length === 0 && !isNongbuaDistrict && (
                        <p className="text-xs text-amber-600">ไม่มีข้อมูลในระบบ กรุณากรอกด้วยตนเอง</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolName">โรงเรียน * <span className="text-xs text-gray-500">(ไม่ต้องใส่คำว่าโรงเรียน)</span></Label>
                    {isNongbuaDistrict ? (
                      <Select
                        value={formData.schoolName}
                        onValueChange={(value) => handleSchoolSelect(value)}
                      >
                        <SelectTrigger className="border-amber-200">
                          <SelectValue placeholder="เลือกโรงเรียน" />
                        </SelectTrigger>
                        <SelectContent>
                          {NONGBUA_SCHOOLS.map((school) => (
                            <SelectItem key={school.name} value={school.name}>
                              โรงเรียน{school.name}
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
                        className="border-amber-200"
                      />
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Step 4: ผลการเรียน */}
              {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
                  <Badge className="bg-amber-600 text-white text-base px-3 py-1">4</Badge>
                  <h3 className="text-xl font-bold text-amber-900">ผลการเรียน</h3>
                </div>

                <div className="space-y-4">
                  {/* ฟิลด์เกรดเฉลี่ย */}
                  <div className="space-y-4">
                    <Label className="text-base font-medium">
                      {isM4 ? "คะแนนเฉลี่ยสะสม (ม.1-3 จำนวน 5 ภาคเรียน) *" : "เกรดเฉลี่ยรายวิชา *"}
                    </Label>
                    <div className="grid md:grid-cols-2 gap-6">
                      {isM4 ? (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="scienceCumulativeM1M3">คะแนนเฉลี่ยสะสมกลุ่มสาระวิทยาศาสตร์ *</Label>
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
                            <p className="text-xs text-gray-500">ม.1-3 จำนวน 5 ภาคเรียน</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="mathCumulativeM1M3">คะแนนเฉลี่ยสะสมกลุ่มสาระคณิตศาสตร์ *</Label>
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
                            <p className="text-xs text-gray-500">ม.1-3 จำนวน 5 ภาคเรียน</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="englishCumulativeM1M3">คะแนนเฉลี่ยสะสมกลุ่มสาระภาษาอังกฤษ *</Label>
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
                            <p className="text-xs text-gray-500">ม.1-3 จำนวน 5 ภาคเรียน</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="gradeP4">เกรดเฉลี่ย ระดับชั้นประถมศึกษาปีที่ 4 *</Label>
                            <Input
                              type="text"
                              id="gradeP4"
                              name="gradeP4"
                              value={formData.gradeP4}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="border-amber-200"
                              pattern="[0-4](\.[0-9]{1,2})?"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gradeP5">เกรดเฉลี่ย ระดับชั้นประถมศึกษาปีที่ 5 *</Label>
                            <Input
                              type="text"
                              id="gradeP5"
                              name="gradeP5"
                              value={formData.gradeP5}
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
              )}

              {/* Step 5: ข้อมูลผู้ปกครอง */}
              {currentStep === 5 && (
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
              )}

              {/* Step 6: เอกสารและยืนยัน */}
              {currentStep === 6 && (
              <>
              <div className="space-y-6">
                <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
                  <Badge className="bg-amber-600 text-white text-base px-3 py-1">6</Badge>
                  <h3 className="text-xl font-bold text-amber-900">เอกสารและยืนยัน</h3>
                </div>

                <div className="space-y-6">
                  {/* สรุปเอกสารที่แนบ */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      สถานะเอกสารที่แนบ
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
                        <span className="text-sm text-gray-700">สำเนาทะเบียนบ้าน</span>
                        {houseRegistrationFile ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">ยังไม่แนบ</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
                        <span className="text-sm text-gray-700">หลักฐานผลการเรียน</span>
                        {transcriptFile ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">ยังไม่แนบ</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
                        <span className="text-sm text-gray-700">รูปถ่าย</span>
                        {photoFile ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">ยังไม่แนบ</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* เอกสารแนบ */}
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-3">เอกสารแนบ (ไม่บังคับ)</h4>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>เอกสารที่ควรเตรียม:</strong>
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>สำเนาทะเบียนบ้าน</li>
                    <li>หลักฐานแสดงผลการเรียน (ปพ.1 หรือ ปพ.7)</li>
                    <li>รูปถ่ายขนาด 1.5 นิ้ว หรือ 2 นิ้ว</li>
                  </ul>
                  <p className="text-xs text-blue-600 mt-2">
                    * ขนาดไฟล์แต่ละไฟล์ไม่เกิน 5MB
                  </p>
                </div>

                <div className="space-y-4">
                  {/* สำเนาทะเบียนบ้าน */}
                  <div className="space-y-2">
                    <Label htmlFor="houseRegistration" className="flex items-center gap-2">
                      สำเนาทะเบียนบ้าน
                      {houseRegistrationFile && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      type="file"
                      id="houseRegistration"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, 'house')}
                      className="border-amber-200"
                    />
                    {houseRegistrationFile && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 truncate">
                          {houseRegistrationFile.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* หลักฐานแสดงผลการเรียน */}
                  <div className="space-y-2">
                    <Label htmlFor="transcript" className="flex items-center gap-2">
                      หลักฐานแสดงผลการเรียน (ปพ.1 หรือ ปพ.7)
                      {transcriptFile && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      type="file"
                      id="transcript"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileChange(e, 'transcript')}
                      className="border-amber-200"
                    />
                    {transcriptFile && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 truncate">
                          {transcriptFile.name}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* รูปถ่าย */}
                  <div className="space-y-2">
                    <Label htmlFor="photo" className="flex items-center gap-2">
                      รูปถ่าย (ขนาด 1.5 นิ้ว หรือ 2 นิ้ว)
                      {photoFile && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </Label>
                    <Input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photo')}
                      className="border-amber-200"
                    />
                    {photoFile && (
                      <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded px-3 py-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <p className="text-sm text-green-700 truncate">
                          {photoFile.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                  </div>

                  {/* CAPTCHA Verification */}
                  <div>
                    <h4 className="font-semibold text-amber-900 mb-3">ยืนยันว่าไม่ใช่โปรแกรมอัตโนมัติ</h4>

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
                </div>
              </div>
              </>
              )}
              </form>
            </CardContent>
          </div>

          {/* Navigation Buttons - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-amber-200 p-4 sm:p-6 bg-white/95">
            <div className="flex justify-between items-center">
                <Button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  ย้อนกลับ
                </Button>

                <div className="text-sm text-gray-500">
                  ขั้นตอนที่ {currentStep} จาก {totalSteps}
                </div>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    ถัดไป
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    form="registration-form"
                    disabled={loading || uploadingFiles}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    {uploadingFiles ? (
                      <>
                        <Upload className="w-5 h-5 mr-2 animate-pulse" />
                        กำลังอัปโหลด...
                      </>
                    ) : loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        กำลังส่ง...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ส่งใบสมัคร
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
        </Card>
          </>
        )}
      </div>
    </div>
  );
}
