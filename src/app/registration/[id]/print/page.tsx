"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

interface Registration {
  id: string;
  idCardOrPassport?: string;
  isSpecialISM: boolean;
  gradeLevel: string;
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
  educationStatus?: string;
  schoolName?: string;
  schoolProvince?: string;
  schoolDistrict?: string;
  schoolSubdistrict?: string;
  villageName?: string;
  houseNumber: string;
  moo?: string;
  road?: string;
  soi?: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  scienceGradeM1?: string;
  scienceGradeM2?: string;
  mathGradeM1?: string;
  mathGradeM2?: string;
  status: string;
  createdAt: string;
}

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  const fetchRegistration = async () => {
    try {
      const response = await fetch(`/api/registration/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRegistration(data);
      // Auto print after loading
      setTimeout(() => {
        window.print();
      }, 500);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>ไม่พบข้อมูลการสมัคร</p>
      </div>
    );
  }

  const grade = registration.gradeLevel === "m4" ? "๔" : "๑";
  const gradeTH = registration.gradeLevel === "m4"
    ? "มัธยมศึกษาปีที่ ๔"
    : "มัธยมศึกษาปีที่ ๑";

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="max-w-[210mm] mx-auto bg-white p-8 print:p-0">
        {/* Print Button */}
        <div className="no-print mb-4 text-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            พิมพ์ใบสมัคร
          </button>
          <button
            onClick={() => router.back()}
            className="ml-4 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            กลับ
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold mb-2">
            ใบสมัครเข้าศึกษาต่อระดับชั้น{gradeTH}
          </h1>
          <p className="text-base mb-1">
            โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
          </p>
          <p className="text-base font-semibold">
            ประเภท ห้องเรียนพิเศษ ISM
          </p>
        </div>

        {/* Reference Number */}
        <div className="text-right mb-4 text-sm">
          <p>
            รหัสอ้างอิง: <span className="font-bold">{registration.id.slice(-8).toUpperCase()}</span>
          </p>
          <p>
            วันที่สมัคร:{" "}
            {new Date(registration.createdAt).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Personal Information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-1">
            ข้อมูลส่วนตัว
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div className="flex">
              <span className="w-40">คำนำหน้า:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.title}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">ชื่อ:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.firstNameTH}
              </span>
            </div>
            <div className="flex col-span-2">
              <span className="w-40">นามสกุล:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.lastNameTH}
              </span>
            </div>
            {registration.idCardOrPassport && (
              <div className="flex col-span-2">
                <span className="w-40">เลขบัตรประชาชน/พาสปอร์ต:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.idCardOrPassport}
                </span>
              </div>
            )}
            <div className="flex col-span-2">
              <span className="w-40">วัน/เดือน/ปีเกิด:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {new Date(registration.birthDate).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">เชื้อชาติ:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.ethnicity}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">สัญชาติ:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.nationality}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">ศาสนา:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.religion}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">เบอร์โทรศัพท์:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Education Information */}
        {registration.schoolName && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-1">
              ข้อมูลการศึกษา
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex">
                <span className="w-40">สถานะการศึกษา:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.educationStatus}
                </span>
              </div>
              <div className="flex">
                <span className="w-40">โรงเรียน:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.schoolName}
                </span>
              </div>
              {registration.schoolProvince && (
                <>
                  <div className="flex">
                    <span className="w-40">จังหวัด:</span>
                    <span className="border-b border-dotted border-gray-400 flex-1">
                      {registration.schoolProvince}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-40">อำเภอ:</span>
                    <span className="border-b border-dotted border-gray-400 flex-1">
                      {registration.schoolDistrict}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            {/* Grades Section */}
            {(registration.scienceGradeM1 || registration.scienceGradeM2 || 
              registration.mathGradeM1 || registration.mathGradeM2) && (
              <div className="mt-4 pt-4 border-t border-gray-300">
                <h3 className="text-base font-bold mb-3">เกรดเฉลี่ยรายวิชา</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {registration.scienceGradeM1 && (
                    <div className="flex">
                      <span className="w-40">วิทยาศาสตร์ ม.1:</span>
                      <span className="border-b border-dotted border-gray-400 flex-1 font-semibold">
                        {registration.scienceGradeM1}
                      </span>
                    </div>
                  )}
                  {registration.scienceGradeM2 && (
                    <div className="flex">
                      <span className="w-40">วิทยาศาสตร์ ม.2:</span>
                      <span className="border-b border-dotted border-gray-400 flex-1 font-semibold">
                        {registration.scienceGradeM2}
                      </span>
                    </div>
                  )}
                  {registration.mathGradeM1 && (
                    <div className="flex">
                      <span className="w-40">คณิตศาสตร์ ม.1:</span>
                      <span className="border-b border-dotted border-gray-400 flex-1 font-semibold">
                        {registration.mathGradeM1}
                      </span>
                    </div>
                  )}
                  {registration.mathGradeM2 && (
                    <div className="flex">
                      <span className="w-40">คณิตศาสตร์ ม.2:</span>
                      <span className="border-b border-dotted border-gray-400 flex-1 font-semibold">
                        {registration.mathGradeM2}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Address Information */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-1">
            ที่อยู่ตามทะเบียนบ้าน
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {registration.villageName && (
              <div className="flex">
                <span className="w-40">หมู่บ้าน:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.villageName}
                </span>
              </div>
            )}
            <div className="flex">
              <span className="w-40">บ้านเลขที่:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.houseNumber}
              </span>
            </div>
            {registration.moo && (
              <div className="flex">
                <span className="w-40">หมู่ที่:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.moo}
                </span>
              </div>
            )}
            {registration.soi && (
              <div className="flex">
                <span className="w-40">ซอย:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.soi}
                </span>
              </div>
            )}
            {registration.road && (
              <div className="flex">
                <span className="w-40">ถนน:</span>
                <span className="border-b border-dotted border-gray-400 flex-1">
                  {registration.road}
                </span>
              </div>
            )}
            <div className="flex">
              <span className="w-40">ตำบล/แขวง:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.subdistrict}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">อำเภอ/เขต:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.district}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">จังหวัด:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.province}
              </span>
            </div>
            <div className="flex">
              <span className="w-40">รหัสไปรษณีย์:</span>
              <span className="border-b border-dotted border-gray-400 flex-1">
                {registration.postalCode}
              </span>
            </div>
          </div>
        </div>

        {/* Family Information */}
        {(registration.siblings || registration.siblingsInSchool) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 border-b-2 border-gray-300 pb-1">
              ข้อมูลครอบครัว
            </h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {registration.siblings && (
                <div className="flex">
                  <span className="w-40">จำนวนพี่น้อง:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1">
                    {registration.siblings} คน
                  </span>
                </div>
              )}
              {registration.siblingsInSchool && (
                <div className="flex">
                  <span className="w-40">พี่น้องที่เรียนโรงเรียนนี้:</span>
                  <span className="border-b border-dotted border-gray-400 flex-1">
                    {registration.siblingsInSchool} คน
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm">
            ข้าพเจ้าขอรับรองว่าข้อมูลข้างต้นเป็นความจริงทุกประการ
          </p>
          <div className="mt-16 flex justify-around">
            <div className="text-center">
              <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
              <p className="text-sm">ลายมือชื่อผู้สมัคร</p>
              <p className="text-sm">
                ( {registration.firstNameTH} {registration.lastNameTH} )
              </p>
            </div>
            <div className="text-center">
              <div className="border-b border-gray-400 w-48 mx-auto mb-2"></div>
              <p className="text-sm">ลายมือชื่อผู้ปกครอง</p>
              <p className="text-sm">( ................................. )</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>
            โรงเรียนหนองบัว ต.หนองบัว อ.หนองบัว จ.นครสวรรค์ 60110
          </p>
          <p>โทร. 056-291-234</p>
        </div>
      </div>
    </>
  );
}
