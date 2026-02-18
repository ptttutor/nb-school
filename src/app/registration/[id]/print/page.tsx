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

// Dotted underline field component
function F({ value, w = "80px" }: { value?: string | null; w?: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        borderBottom: "1px dotted #555",
        minWidth: w,
        paddingLeft: "2px",
        paddingRight: "2px",
        verticalAlign: "bottom",
      }}
    >
      {value ?? ""}
    </span>
  );
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
        backgroundColor: "#ffffff",
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight,
      });
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // Add single page only
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      
      const fileName = `ใบสมัคร_ISM_${registration.firstNameTH}_${registration.lastNameTH}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("เกิดข้อผิดพลาดในการสร้าง PDF");
    } finally {
      setGenerating(false);
    }
  };

  if (loading)
    return <div className="flex justify-center items-center h-screen text-lg">กำลังโหลดข้อมูล...</div>;
  if (!registration)
    return <div className="flex justify-center items-center h-screen text-lg">ไม่พบข้อมูลการสมัคร</div>;

  const gradeTH = registration.gradeLevel === "m4" ? "มัธยมศึกษาปีที่ ๔" : "มัธยมศึกษาปีที่ ๑";

  const createdDate = new Date(registration.createdAt);
  const thDay = createdDate.getDate();
  const thMonth = createdDate.toLocaleDateString("th-TH", { month: "long" });
  const thYear = createdDate.getFullYear() + 543;

  const birthDateObj = new Date(registration.birthDate);
  const birthDay = birthDateObj.getDate();
  const birthMonth = birthDateObj.toLocaleDateString("th-TH", { month: "long" });
  const birthYear = birthDateObj.getFullYear() + 543;

  // Calculate age
  const ageYears = createdDate.getFullYear() - birthDateObj.getFullYear();

  const fullName = `${registration.title}${registration.firstNameTH} ${registration.lastNameTH}`;

  const baseStyle: React.CSSProperties = {
    fontFamily: "'TH Sarabun New', 'Sarabun', 'Angsana New', serif",
    fontSize: "14.5pt",
    color: "#000",
    lineHeight: "1.75",
  };

  return (
    <>
      {/* Toolbar — hidden on print */}
      <div className="flex justify-center gap-4 p-4 bg-gray-100 print:hidden">
        <button
          onClick={handleDownloadPDF}
          disabled={generating}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow transition-all disabled:opacity-50"
        >
          {generating ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium shadow transition-all"
        >
          ← กลับ
        </button>
      </div>

      {/* A4 canvas */}
      <div className="flex justify-center bg-gray-200 min-h-screen py-8 print:py-0 print:bg-white">
        <div
          ref={contentRef}
          style={{
            ...baseStyle,
            width: "210mm",
            minHeight: "297mm",
            backgroundColor: "#fff",
            padding: "14mm 22mm 14mm 22mm",
            boxSizing: "border-box",
          }}
        >

          {/* ─────────────────────────────────────────
              SECTION 1 — Main Application Form
          ───────────────────────────────────────── */}

          {/* Title */}
          <div style={{ textAlign: "center", marginBottom: "2px" }}>
            <div style={{ fontWeight: "bold", fontSize: "17pt" }}>
              ใบสมัครเข้าศึกษาต่อระดับชั้น{gradeTH}
            </div>
            <div style={{ fontWeight: "bold", fontSize: "15pt" }}>
              โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
            </div>
            <div style={{ fontWeight: "bold", fontSize: "15pt" }}>
              ประเภท {registration.isSpecialISM ? "ห้องเรียนพิเศษ ISM" : "ห้องเรียนปกติ"}
            </div>
          </div>

          {/* ลำดับที่ */}
          <div style={{ textAlign: "right", fontSize: "13pt", marginBottom: "1px" }}>
            ลำดับที่<F w="55px" />/<F w="35px" />
          </div>

          {/* วันที่ */}
          <div style={{ marginBottom: "5px", fontSize: "13.5pt" }}>
            วันที่<F w="28px" />เดือน<F w="90px" />พ.ศ.<F w="50px" />
          </div>

          {/* ชื่อ + ชั้น */}
          <div style={{ marginBottom: "3px" }}>
            ข้าพเจ้า<F value={fullName} w="195px" />นักเรียนชั้น{registration.gradeLevel === "m1" ? "ประถมศึกษาปีที่ ๖" : "มัธยมศึกษาปีที่ ๓"}
          </div>

          {/* โรงเรียน + ตำบล + อำเภอ */}
          <div style={{ marginBottom: "3px" }}>
            โรงเรียน<F value={registration.schoolName} w="160px" />ตำบล<F value={registration.schoolSubdistrict} w="90px" />อำเภอ<F value={registration.schoolDistrict} w="90px" />
          </div>

          {/* รหัสประจำตัว + วันเกิด + อายุ */}
          <div style={{ marginBottom: "3px" }}>
            รหัสประจำตัว<F value={registration.idCardOrPassport} w="130px" />เกิดวันที่<F value={String(birthDay)} w="24px" />เดือน<F value={birthMonth} w="85px" />พ.ศ.<F value={String(birthYear)} w="48px" />อายุ<F value={String(ageYears)} w="28px" />ปี
          </div>

          {/* ที่อยู่ */}
          <div style={{ marginBottom: "3px" }}>
            อยู่บ้านเลขที่<F value={registration.houseNumber} w="48px" />หมู่ที่<F value={registration.moo} w="28px" />ตำบล<F value={registration.subdistrict} w="90px" />อำเภอ<F value={registration.district} w="90px" />จังหวัด<F value={registration.province} w="80px" />
          </div>

          {/* โทรศัพท์ + เลขประชาชน */}
          <div style={{ marginBottom: "8px" }}>
            โทรศัพท์<F value={registration.phone} w="120px" />เลขประจำตัวประชาชน<F value={registration.idCardOrPassport} w="145px" />
          </div>

          {/* หลักฐานการสมัคร */}
          <div style={{ fontWeight: "bold", marginBottom: "3px" }}>หลักฐานการสมัคร</div>
          <div style={{ marginLeft: "20px", marginBottom: "18px" }}>
            <span style={{ fontSize: "16pt", verticalAlign: "middle", marginRight: "6px" }}>○</span>
            หลักฐานใบแสดงผลการเรียน (ปพ.๑) ระดับชั้น{registration.gradeLevel === "m1" ? "ประถมศึกษา" : "มัธยมศึกษาตอนต้น"}
          </div>

          {/* ลายเซ็นผู้สมัคร */}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            ลงชื่อ<F w="190px" />ผู้สมัคร
          </div>
          <div style={{ textAlign: "center", marginTop: "2px" }}>
            (<F w="190px" />)
          </div>

          {/* ════ Dashed separator with label ════ */}
          <div style={{ position: "relative", margin: "22px 0 14px 0" }}>
            <div style={{ borderTop: "1px dashed #444", width: "100%" }} />
            <span
              style={{
                position: "absolute",
                top: "-10px",
                left: "50%",
                transform: "translateX(-50%)",
                background: "#fff",
                padding: "0 12px",
                fontSize: "12pt",
                whiteSpace: "nowrap",
              }}
            >
              นักเรียนต้องกรอกข้อมูลด้านล่างด้วย
            </span>
          </div>

          {/* ─────────────────────────────────────────
              SECTION 2 — Tear-off Acceptance Slip
          ───────────────────────────────────────── */}

          {/* ลำดับที่ */}
          <div style={{ textAlign: "right", fontSize: "13pt", marginBottom: "1px" }}>
            ลำดับที่<F w="55px" />/<F w="35px" />
          </div>

          {/* ชื่อ + ชั้น */}
          <div style={{ marginBottom: "3px" }}>
            ข้าพเจ้า<F w="195px" />นักเรียนชั้น{registration.gradeLevel === "m1" ? "ประถมศึกษาปีที่ ๖" : "มัธยมศึกษาปีที่ ๓"}
          </div>

          {/* โรงเรียน */}
          <div style={{ marginBottom: "3px" }}>
            โรงเรียน<F w="240px" />
          </div>

          {/* ที่อยู่ปัจจุบัน */}
          <div style={{ marginBottom: "3px" }}>
            ปัจจุบันอยู่บ้านเลขที่<F w="48px" />หมู่ที่<F w="28px" />ตำบล<F w="90px" />อำเภอ<F w="90px" />
          </div>

          {/* จังหวัด + ความประสงค์ */}
          <div style={{ marginBottom: "14px" }}>
            จังหวัด<F w="110px" />มีความประสงค์สมัครเรียนระดับชั้น{gradeTH} ห้อง ISM
          </div>

          {/* วิชาที่สอบ box — right aligned */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "14px" }}>
            <div
              style={{
                border: "1px solid #333",
                padding: "6px 16px 8px 16px",
                fontSize: "13.5pt",
                lineHeight: "1.9",
              }}
            >
              <div style={{ fontWeight: "bold" }}>วิชาที่สอบ</div>
              <div>ก. วิทยาศาสตร์</div>
              <div>ข. คณิตศาสตร์</div>
              <div>ค. ภาษาอังกฤษ</div>
            </div>
          </div>

          {/* ลายเซ็นผู้รับสมัคร */}
          <div style={{ textAlign: "center" }}>
            ลงชื่อ<F w="190px" />ผู้รับสมัคร
          </div>
          <div style={{ textAlign: "center", marginTop: "2px" }}>
            (นางสาวธิดารัตน์ ขอดจันทึก)
          </div>
          <div style={{ textAlign: "center", marginTop: "2px" }}>
            <F w="38px" />/<F w="38px" />/<F w="38px" />
          </div>

        </div>
      </div>
    </>
  );
}