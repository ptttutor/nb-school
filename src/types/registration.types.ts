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
  
  // เกรดสำหรับ ม.1 (ระดับชั้นประถมศึกษาปีที่ 4-5)
  gradeP4?: string;
  gradeP5?: string;
  
  // คะแนนสำหรับ ม.4 (ม.1-3 จำนวน 5 ภาคเรียน)
  scienceCumulativeM1M3?: string;
  mathCumulativeM1M3?: string;
  englishCumulativeM1M3?: string;
  
  // เอกสารแนบ (fields แยก)
  houseRegistrationDoc?: string;
  transcriptDoc?: string;
  photoDoc?: string;
  
  documents: string[];
  status: RegistrationStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
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
  gradeP4: string;
  gradeP5: string;
  // คะแนนสำหรับ ม.4
  scienceCumulativeM1M3: string;
  mathCumulativeM1M3: string;
  englishCumulativeM1M3: string;
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

export type EducationStatus = 
  | 'กำลังศึกษาอยู่ชั้นประถมศึกษาปีที่ 6'
  | 'จบการศึกษาชั้นประถมศึกษาปีที่ 6'
  | 'กำลังศึกษาอยู่ชั้นมัธยมศึกษาปีที่ 3'
  | 'จบการศึกษาชั้นมัธยมศึกษาปีที่ 3';

export interface AdmissionSettings {
  id?: string;
  gradeLevel: GradeLevel;
  isOpen: boolean;
  allowISM: boolean;
  allowRegular: boolean;
  announcement?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegistrationStepProps {
  formData: RegistrationFormData & { isSpecialISM: boolean };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string | boolean) => void;
  isM4: boolean;
  admissionSettings?: AdmissionSettings | null;
  errors?: { [key: string]: string };
}
