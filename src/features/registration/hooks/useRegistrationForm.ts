// Registration form state management hook

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import type { RegistrationFormData, AdmissionSettings } from '@/types/registration.types';
import type { ValidationErrors } from './useFormValidation';

export function useRegistrationForm(grade: string) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  // Validation errors state
  const [errors, setErrors] = useState<ValidationErrors>({});
  
  // States สำหรับเอกสารแนบ
  const [houseRegistrationFile, setHouseRegistrationFile] = useState<File | null>(null);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
  // States สำหรับ Admission Settings
  const [admissionSettings, setAdmissionSettings] = useState<AdmissionSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  // ตรวจสอบ grade ที่ถูกต้อง
  const isM4 = grade === "m4";
  
  const [formData, setFormData] = useState<RegistrationFormData & { isSpecialISM: boolean }>({
    idCardOrPassport: "",
    isSpecialISM: true,
    gradeLevel: grade as 'm1' | 'm4',
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
    scienceCumulativeM1M3: "",
    mathCumulativeM1M3: "",
    englishCumulativeM1M3: "",
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
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

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

  const handleSubmit = async (e: React.FormEvent, validateForm: (data: typeof formData) => string | null) => {
    e.preventDefault();
    setLoading(true);

    // Validate form fields
    const validationError = validateForm(formData);
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

  const handleNext = (
    validateStep: (step: number, data: typeof formData) => string | null,
    validateStepFields: (step: number, data: typeof formData) => ValidationErrors
  ) => {
    // Validate fields and get errors object
    const fieldErrors = validateStepFields(currentStep, formData);
    setErrors(fieldErrors);
    
    // Check if there are any errors
    if (Object.keys(fieldErrors).length > 0) {
      toast({
        variant: "destructive",
        title: "กรุณาตรวจสอบข้อมูล",
        description: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน",
      });
      return;
    }
    
    // Clear errors and move to next step
    setErrors({});
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    // Clear errors when going back
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    // State
    formData,
    setFormData,
    currentStep,
    totalSteps,
    loading,
    uploadingFiles,
    captcha,
    captchaInput,
    setCaptchaInput,
    houseRegistrationFile,
    transcriptFile,
    photoFile,
    admissionSettings,
    loadingSettings,
    isM4,
    errors,
    
    // Actions
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleSubmit,
    handleNext,
    handlePrevious,
    generateCaptcha,
  };
}
