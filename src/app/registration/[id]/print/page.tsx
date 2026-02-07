"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  gradeP4?: string;
  gradeP5?: string;
  scienceCumulativeM1M3?: string;
  mathCumulativeM1M3?: string;
  englishCumulativeM1M3?: string;
  photoDoc?: string;
  status: string;
  createdAt: string;
}

export default function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  const fetchRegistration = async () => {
    try {
      const response = await fetch(`/api/registration/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRegistration(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current || !registration) return;
    
    setGenerating(true);
    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `ใบสมัคร_${registration.firstNameTH}_${registration.lastNameTH}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
      setGenerating(false);
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
  const roomType = registration.isSpecialISM ? "ห้องเรียนพิเศษ ISM" : "ห้องเรียนปกติ";

  return (
    <>
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 210mm;
            height: 297mm;
            max-height: 297mm;
            padding: 10mm !important;
            page-break-after: avoid;
            overflow: hidden;
          }
        }
        
        .print-container {
          font-family: 'Sarabun', 'TH SarabunPSK', sans-serif;
          width: 210mm;
          max-width: 210mm;
          min-height: 297mm;
          background: white;
          margin: 0 auto;
          padding: 20mm;
          box-sizing: border-box;
        }
        
        .form-field {
          border-bottom: 1px dotted #333;
          display: inline-block;
          padding: 0 4px 2px;
          min-width: 40px;
          line-height: 1.4;
        }
        
        .section-spacing {
          margin-bottom: 10px;
        }
        
        .subsection-spacing {
          margin-bottom: 6px;
        }
        
        .line-spacing {
          margin-bottom: 5px;
          line-height: 1.5;
        }
        
        @media print {
          .section-spacing {
            margin-bottom: 8px;
          }
          .subsection-spacing {
            margin-bottom: 5px;
          }
          .line-spacing {
            margin-bottom: 4px;
            line-height: 1.4;
          }
        }
      `}</style>

      <div className="bg-gray-100 min-h-screen py-8">
        {/* Print Button */}
        <div className="no-print mb-6 text-center">
          <button
            onClick={handleDownloadPDF}
            disabled={generating}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium shadow-lg transition-all"
          >
            {generating ? 'กำลังสร้าง PDF...' : '📥 ดาวน์โหลด PDF'}
          </button>
          <button
            onClick={() => router.back()}
            className="ml-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium shadow-lg transition-all"
          >
            ← กลับ
          </button>
        </div>

        <div className="print-container bg-white shadow-2xl">
          
          {/* Border Container */}
          <div ref={contentRef} className="border-2 border-black" style={{fontSize: '12px', padding: '12px'}}>
            
            {/* Header */}
            <div className="border-2 border-black text-center" style={{padding: '8px', marginBottom: '12px'}}>
              <h1 className="text-sm font-bold" style={{marginBottom: '4px'}}>
                ใบสมัครเข้าศึกษาต่อระดับชั้น{gradeTH}
              </h1>
              <h2 className="text-xs font-bold" style={{marginBottom: '2px'}}>
                ประเภท {roomType}
              </h2>
              <p className="text-xs" style={{margin: 0}}>
                โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
              </p>
            </div>

            {/* Date Section */}
            <div className="section-spacing">
              <div className="line-spacing">
                <span>วันที่ </span>
                <span className="form-field" style={{minWidth: '60px', textAlign: 'center'}}>
                  {new Date(registration.createdAt).getDate()}
                </span>
                <span> เดือน </span>
                <span className="form-field" style={{minWidth: '120px', textAlign: 'center'}}>
                  {new Date(registration.createdAt).toLocaleDateString("th-TH", { month: "long" })}
                </span>
                <span> พ.ศ. </span>
                <span className="form-field" style={{minWidth: '80px', textAlign: 'center'}}>
                  {new Date(registration.createdAt).getFullYear() + 543}
                </span>
              </div>
            </div>

            {/* Personal Info Section */}
            <div className="section-spacing">
              <div className="line-spacing">
                <span>ข้าพเจ้า </span>
                <span className="form-field" style={{minWidth: '80px'}}>
                  {registration.title}
                </span>
                <span> ชื่อ </span>
                <span className="form-field" style={{minWidth: '150px'}}>
                  {registration.firstNameTH}
                </span>
                <span> สกุล </span>
                <span className="form-field" style={{minWidth: '150px'}}>
                  {registration.lastNameTH}
                </span>
              </div>

              <div className="line-spacing">
                <span>เลขประจำตัวประชาชน </span>
                <span className="form-field" style={{minWidth: '180px'}}>
                  {registration.idCardOrPassport || "-"}
                </span>
                <span> เกิดวันที่ </span>
                <span className="form-field" style={{minWidth: '150px'}}>
                  {new Date(registration.birthDate).toLocaleDateString("th-TH")}
                </span>
              </div>

              <div className="line-spacing">
                <span>สัญชาติ </span>
                <span className="form-field" style={{minWidth: '100px'}}>
                  {registration.nationality}
                </span>
                <span> เชื้อชาติ </span>
                <span className="form-field" style={{minWidth: '100px'}}>
                  {registration.ethnicity}
                </span>
                <span> ศาสนา </span>
                <span className="form-field" style={{minWidth: '100px'}}>
                  {registration.religion}
                </span>
              </div>

              <div className="line-spacing">
                <span>โทรศัพท์ </span>
                <span className="form-field" style={{minWidth: '150px'}}>
                  {registration.phone}
                </span>
              </div>
            </div>

            {/* Address Section */}
            <div className="section-spacing">
              <div className="font-bold text-sm border-b-2 border-gray-400 pb-2 mb-3">
                ที่อยู่ตามทะเบียนบ้าน
              </div>
              
              <div className="subsection-spacing">
                <div className="line-spacing">
                  <span>บ้านเลขที่ </span>
                  <span className="form-field" style={{minWidth: '100px'}}>
                    {registration.houseNumber}
                  </span>
                  {registration.villageName && (
                    <>
                      <span> หมู่บ้าน </span>
                      <span className="form-field" style={{minWidth: '150px'}}>
                        {registration.villageName}
                      </span>
                    </>
                  )}
                  {registration.moo && (
                    <>
                      <span> หมู่ที่ </span>
                      <span className="form-field" style={{minWidth: '60px'}}>
                        {registration.moo}
                      </span>
                    </>
                  )}
                </div>

                {(registration.soi || registration.road) && (
                  <div className="line-spacing">
                    {registration.soi && (
                      <>
                        <span>ซอย </span>
                        <span className="form-field" style={{minWidth: '150px'}}>
                          {registration.soi}
                        </span>
                      </>
                    )}
                    {registration.road && (
                      <>
                        <span> ถนน </span>
                        <span className="form-field" style={{minWidth: '150px'}}>
                          {registration.road}
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="line-spacing">
                  <span>ตำบล/แขวง </span>
                  <span className="form-field" style={{minWidth: '130px'}}>
                    {registration.subdistrict}
                  </span>
                  <span> อำเภอ/เขต </span>
                  <span className="form-field" style={{minWidth: '130px'}}>
                    {registration.district}
                  </span>
                </div>

                <div className="line-spacing">
                  <span>จังหวัด </span>
                  <span className="form-field" style={{minWidth: '150px'}}>
                    {registration.province}
                  </span>
                  <span> รหัสไปรษณีย์ </span>
                  <span className="form-field" style={{minWidth: '80px'}}>
                    {registration.postalCode}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="border-t-2 border-gray-400 section-spacing" style={{paddingTop: '10px'}}>
              <div className="font-bold text-sm" style={{marginBottom: '8px'}}>
                นักเรียนต้องกรอกข้อมูลด้านล่างด้วย
              </div>
              
              <div className="subsection-spacing">
                <div className="line-spacing">
                  <span>ลำดับที่ </span>
                  <span className="form-field" style={{minWidth: '80px'}}></span>
                  <span> / </span>
                  <span className="form-field" style={{minWidth: '80px'}}></span>
                </div>

                <div className="line-spacing">
                  <span>ข้าพเจ้า {registration.title} {registration.firstNameTH} {registration.lastNameTH}</span>
                </div>

                <div className="line-spacing">
                  <span>นักเรียนชั้น{registration.gradeLevel === "m1" ? "ประถมศึกษาปีที่ ๖" : "มัธยมศึกษาปีที่ ๓"}</span>
                </div>

                <div className="line-spacing">
                  <span>โรงเรียน </span>
                  <span className="form-field" style={{minWidth: '400px'}}></span>
                </div>

                <div className="line-spacing">
                  <span>ปัจจุบันอยู่บ้านเลขที่ </span>
                  <span className="form-field" style={{minWidth: '60px'}}></span>
                  <span> หมู่ที่ </span>
                  <span className="form-field" style={{minWidth: '50px'}}></span>
                  <span> ตำบล </span>
                  <span className="form-field" style={{minWidth: '120px'}}></span>
                </div>

                <div className="line-spacing">
                  <span>อำเภอ </span>
                  <span className="form-field" style={{minWidth: '120px'}}></span>
                  <span> จังหวัด </span>
                  <span className="form-field" style={{minWidth: '120px'}}></span>
                </div>

                <div className="line-spacing">
                  <span>มีความประสงค์สมัครเรียน ม. </span>
                  <span className="form-field" style={{minWidth: '50px'}}></span>
                  <span> ห้อง {roomType}</span>
                </div>
              </div>

              {/* Exam Subjects Box */}
              <div className="border-2 border-black" style={{padding: '8px', margin: '12px 0'}}>
                <div className="font-bold text-sm" style={{marginBottom: '6px'}}>วิชาที่สอบ</div>
                <div className="text-sm" style={{lineHeight: '1.6'}}>
                  <div>๑. วิทยาศาสตร์</div>
                  <div>๒. คณิตศาสตร์</div>
                  <div>๓. ภาษาอังกฤษ</div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="text-right mt-8">
                <div className="line-spacing">
                  <span>ลงชื่อ </span>
                  <span className="form-field" style={{minWidth: '200px'}}></span>
                  <span> ผู้รับสมัคร</span>
                </div>
                <div className="line-spacing">
                  <span>(นางสาวธิดารัตน์ ขอดจันทึก)</span>
                </div>
                <div className="line-spacing">
                  <span className="form-field" style={{minWidth: '50px'}}></span>
                  <span> / </span>
                  <span className="form-field" style={{minWidth: '50px'}}></span>
                  <span> / </span>
                  <span className="form-field" style={{minWidth: '70px'}}></span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center border-t border-gray-300 mt-8 pt-3 text-xs text-gray-600">
              <p className="mb-0">
                โรงเรียนหนองบัว ต.หนองบัว อ.หนองบัว จ.นครสวรรค์ 60110 • โทร. 056-291-234
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}