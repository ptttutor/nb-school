// Registration Types

export interface Registration {
  id: string;
  idCardOrPassport?: string;
  isSpecialISM: boolean;
  gradeLevel: string; // 'm1' | 'm4'
  title: string;
  firstNameTH: string;
  lastNameTH: string;
  birthDate: string;
  ethnicity: string;
  nationality: string;
  religion: string;
  phone: string;
  siblings?: string;
  siblingsInSchool?: string;
  
  // ข้อมูลการศึกษา
  educationStatus?: string;
  schoolName?: string;
  schoolProvince?: string;
  schoolDistrict?: string;
  schoolSubdistrict?: string;
  
  // ที่อยู่
  villageName?: string;
  houseNumber: string;
  moo?: string;
  road?: string;
  soi?: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  
  // เกรดสำหรับ ม.1 (ป.5-6)
  scienceGradeP5?: string;
  scienceGradeP6?: string;
  mathGradeP5?: string;
  mathGradeP6?: string;
  
  // เกรดสำหรับ ม.4 (ม.1-3)
  scienceGradeM1?: string;
  scienceGradeM2?: string;
  scienceGradeM3?: string;
  mathGradeM1?: string;
  mathGradeM2?: string;
  mathGradeM3?: string;
  
  documents: string[];
  status: RegistrationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export type GradeLevel = 'm1' | 'm4';

export interface RegistrationFormData {
  idCardOrPassport: string;
  gradeLevel: GradeLevel;
  title: string;
  firstNameTH: string;
  lastNameTH: string;
  birthDate: string;
  ethnicity: string;
  nationality: string;
  religion: string;
  phone: string;
  siblings: string;
  siblingsInSchool: string;
  educationStatus: string;
  schoolName: string;
  schoolProvince: string;
  schoolDistrict: string;
  schoolSubdistrict: string;
  villageName: string;
  houseNumber: string;
  moo: string;
  road: string;
  soi: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  // เกรดสำหรับ ม.1
  scienceGradeP5: string;
  scienceGradeP6: string;
  mathGradeP5: string;
  mathGradeP6: string;
  // เกรดสำหรับ ม.4
  scienceGradeM1: string;
  scienceGradeM2: string;
  scienceGradeM3: string;
  mathGradeM1: string;
  mathGradeM2: string;
  mathGradeM3: string;
}

export interface GradeData {
  // สำหรับ ม.1
  scienceGradeP5?: string;
  scienceGradeP6?: string;
  mathGradeP5?: string;
  mathGradeP6?: string;
  // สำหรับ ม.4
  scienceGradeM1?: string;
  scienceGradeM2?: string;
  scienceGradeM3?: string;
  mathGradeM1?: string;
  mathGradeM2?: string;
  mathGradeM3?: string;
}
