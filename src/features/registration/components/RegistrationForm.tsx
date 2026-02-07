// Main Registration Form Component

'use client';

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertCircle, Bell, ChevronRight, ChevronLeft, Check, Upload } from "lucide-react";
import { useRegistrationForm, useFormValidation } from '../hooks';
import {
  StudentInfoStep,
  AddressStep,
  EducationStep,
  GradeStep,
  ParentStep,
  DocumentStep
} from './';
import { NONGBUA_SCHOOLS } from "@/lib/thailand-data";

interface RegistrationFormProps {
  grade: string;
}

export function RegistrationForm({ grade }: RegistrationFormProps) {
  const {
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
    handleChange,
    handleSelectChange,
    handleFileChange,
    handleSubmit,
    handleNext,
    handlePrevious,
    generateCaptcha,
    errors,
  } = useRegistrationForm(grade);

  const { validateForm, validateStep, validateStepFields } = useFormValidation(isM4);

  const gradeText = isM4 ? "มัธยมศึกษาปีที่ ๔" : "มัธยมศึกษาปีที่ ๑";

  // Address handlers
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

  // School handlers
  const handleProvinceChange = (province: string) => {
    setFormData({
      ...formData,
      schoolProvince: province,
      schoolDistrict: "",
      schoolSubdistrict: "",
      schoolName: "",
    });
  };

  const handleDistrictChange = (district: string) => {
    setFormData({
      ...formData,
      schoolDistrict: district,
      schoolSubdistrict: "",
      schoolName: "",
    });
  };

  const handleSubdistrictChange = (subdistrict: string) => {
    setFormData({
      ...formData,
      schoolSubdistrict: subdistrict,
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

  if (loadingSettings) {
    return (
      <div className="min-h-screen p-2 sm:p-4 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-5xl mx-auto py-2 sm:py-4 w-full">
          <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur">
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!admissionSettings?.isOpen) {
    return (
      <div className="min-h-screen p-2 sm:p-4 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-5xl mx-auto py-2 sm:py-4 w-full">
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 md:p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-5xl mx-auto py-2 sm:py-4 w-full">
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

        <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur mb-4 flex flex-col">
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
          <div className="overflow-y-auto max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-320px)]">
            <CardContent>
              <form id="registration-form" onSubmit={(e) => handleSubmit(e, validateForm)} className="space-y-8 pb-4">
                {currentStep === 1 && (
                  <StudentInfoStep
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    isM4={isM4}
                    admissionSettings={admissionSettings}
                    errors={errors}
                  />
                )}

                {currentStep === 2 && (
                  <AddressStep
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    isM4={isM4}
                    province={formData.province}
                    district={formData.district}
                    onProvinceChange={handleStudentProvinceChange}
                    onDistrictChange={handleStudentDistrictChange}
                    onSubdistrictChange={handleStudentSubdistrictChange}
                    errors={errors}
                  />
                )}

                {currentStep === 3 && (
                  <EducationStep
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    isM4={isM4}
                    schoolProvince={formData.schoolProvince}
                    schoolDistrict={formData.schoolDistrict}
                    onSchoolProvinceChange={handleProvinceChange}
                    onSchoolDistrictChange={handleDistrictChange}
                    onSchoolSubdistrictChange={handleSubdistrictChange}
                    onSchoolSelect={handleSchoolSelect}
                    errors={errors}
                  />
                )}

                {currentStep === 4 && (
                  <GradeStep
                    formData={formData}
                    handleChange={handleChange}
                    handleSelectChange={handleSelectChange}
                    isM4={isM4}
                  />
                )}

                {currentStep === 5 && <ParentStep />}

                {currentStep === 6 && (
                  <DocumentStep
                    houseRegistrationFile={houseRegistrationFile}
                    transcriptFile={transcriptFile}
                    photoFile={photoFile}
                    captcha={captcha}
                    captchaInput={captchaInput}
                    onCaptchaInputChange={setCaptchaInput}
                    onFileChange={handleFileChange}
                    onRegenerateCaptcha={generateCaptcha}
                  />
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
                className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900 disabled:opacity-50"
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
                  onClick={() => handleNext(validateStep, validateStepFields)}
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
      </div>
    </div>
  );
}
