// Form validation hook

import type { RegistrationFormData } from '@/types/registration.types';

export interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation(isM4: boolean) {
  
  const validateForm = (formData: RegistrationFormData & { isSpecialISM: boolean }): string | null => {
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

  const validateStepFields = (step: number, formData: RegistrationFormData & { isSpecialISM: boolean }): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    switch (step) {
      case 1: // Student Info
        if (!formData.idCardOrPassport.trim()) {
          errors.idCardOrPassport = "กรุณากรอกเลขบัตรประชาชน";
        } else if (!/^\d{13}$/.test(formData.idCardOrPassport)) {
          errors.idCardOrPassport = "เลขบัตรประชาชนต้องเป็นตัวเลข 13 หลัก";
        }
        
        if (!formData.title) errors.title = "กรุณาเลือกคำนำหน้าชื่อ";
        if (!formData.firstNameTH.trim()) errors.firstNameTH = "กรุณากรอกชื่อ";
        if (!formData.lastNameTH.trim()) errors.lastNameTH = "กรุณากรอกนามสกุล";
        
        if (!formData.birthDate) {
          errors.birthDate = "กรุณาเลือกวันเกิด";
        }
        
        if (!formData.ethnicity.trim()) errors.ethnicity = "กรุณาเลือกเชื้อชาติ";
        if (!formData.nationality.trim()) errors.nationality = "กรุณาเลือกสัญชาติ";
        if (!formData.religion.trim()) errors.religion = "กรุณาเลือกศาสนา";
        
        if (!formData.phone.trim()) {
          errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
        } else if (!/^0\d{9}$/.test(formData.phone)) {
          errors.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก เริ่มต้นด้วย 0";
        }
        
        if (!formData.siblings || formData.siblings === "") {
          errors.siblings = "กรุณากรอกจำนวนพี่น้อง";
        }
        
        if (!formData.siblingsInSchool || formData.siblingsInSchool === "") {
          errors.siblingsInSchool = "กรุณากรอกจำนวนพี่น้องในโรงเรียน";
        }
        break;
      
      case 2: // Address
        if (!formData.houseNumber.trim()) errors.houseNumber = "กรุณากรอกบ้านเลขที่";
        if (!formData.province.trim()) errors.province = "กรุณาเลือกจังหวัด";
        if (!formData.district.trim()) errors.district = "กรุณาเลือกอำเภอ/เขต";
        if (!formData.subdistrict.trim()) errors.subdistrict = "กรุณาเลือกตำบล/แขวง";
        
        if (!formData.postalCode.trim()) {
          errors.postalCode = "กรุณากรอกรหัสไปรษณีย์";
        } else if (!/^\d{5}$/.test(formData.postalCode)) {
          errors.postalCode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
        }
        break;
      
      case 3: // Education
        if (!formData.educationStatus) errors.educationStatus = "กรุณาเลือกสถานะการศึกษา";
        if (!formData.schoolName.trim()) errors.schoolName = "กรุณากรอกชื่อโรงเรียน";
        if (!formData.schoolProvince.trim()) errors.schoolProvince = "กรุณาเลือกจังหวัด";
        if (!formData.schoolDistrict.trim()) errors.schoolDistrict = "กรุณาเลือกอำเภอ/เขต";
        if (!formData.schoolSubdistrict.trim()) errors.schoolSubdistrict = "กรุณาเลือกตำบล/แขวง";
        break;
      
      case 4: // Grades
      case 5: // Parent Info
      case 6: // Documents
        // No validation for these steps
        break;
    }
    
    return errors;
  };

  const validateStep = (step: number, formData: RegistrationFormData & { isSpecialISM: boolean }): string | null => {
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
      case 5: // Parent Info (skip validation for now)
      case 6: // Documents
        return null;
      
      default:
        return null;
    }
  };

  return {
    validateForm,
    validateStep,
    validateStepFields,
  };
}
