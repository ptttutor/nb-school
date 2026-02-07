"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import {
  ArrowLeft,
  Printer,
  Edit,
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Download,
} from "lucide-react";

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
  // เกรดสำหรับ ม.1
  scienceGradeP5?: string;
  scienceGradeP6?: string;
  mathGradeP5?: string;
  mathGradeP6?: string;
  // เกรดสำหรับ ม.4
  scienceGradeM1?: string;
  scienceGradeM2?: string;
  scienceGradeM3?: string;
  mathGradeM1?: string;
  mathGradeM2?: string;
  mathGradeM3?: string;
  documents: string[];
  status: string;
  createdAt: string;
}

export default function RegistrationViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingGPA, setEditingGPA] = useState(false);
  const [grades, setGrades] = useState({
    // สำหรับ ม.1
    scienceGradeP5: "",
    scienceGradeP6: "",
    mathGradeP5: "",
    mathGradeP6: "",
    // สำหรับ ม.4
    scienceGradeM1: "",
    scienceGradeM2: "",
    scienceGradeM3: "",
    mathGradeM1: "",
    mathGradeM2: "",
    mathGradeM3: "",
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchRegistration();
  }, [id]);

  const fetchRegistration = async () => {
    try {
      const response = await fetch(`/api/registration/${id}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setRegistration(data);
      setGrades({
        // สำหรับ ม.1
        scienceGradeP5: data.scienceGradeP5 || "",
        scienceGradeP6: data.scienceGradeP6 || "",
        mathGradeP5: data.mathGradeP5 || "",
        mathGradeP6: data.mathGradeP6 || "",
        // สำหรับ ม.4
        scienceGradeM1: data.scienceGradeM1 || "",
        scienceGradeM2: data.scienceGradeM2 || "",
        scienceGradeM3: data.scienceGradeM3 || "",
        mathGradeM1: data.mathGradeM1 || "",
        mathGradeM2: data.mathGradeM2 || "",
        mathGradeM3: data.mathGradeM3 || "",
      });
    } catch (error) {
      console.error("Error:", error);
      setMessage("ไม่พบข้อมูลการสมัคร");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateGPA = async () => {
    try {
      const response = await fetch(`/api/registration/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(grades),
      });

      if (!response.ok) throw new Error("Failed to update");

      setMessage("อัปเดตเกรดเฉลี่ยสำเร็จ");
      setEditingGPA(false);
      fetchRegistration();
    } catch (error) {
      console.error("Error:", error);
      setMessage("เกิดข้อผิดพลาดในการอัปเดตเกรดเฉลี่ย");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `/api/registration/${id}/documents`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setMessage("อัพโหลดเอกสารสำเร็จ");
      fetchRegistration();
    } catch (error: any) {
      console.error("Error:", error);
      setMessage(error.message || "เกิดข้อผิดพลาดในการอัพโหลดเอกสาร");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (documentUrl: string) => {
    if (!confirm("ต้องการลบเอกสารนี้ใช่หรือไม่?")) return;

    try {
      const response = await fetch(
        `/api/registration/${id}/documents?url=${encodeURIComponent(
          documentUrl
        )}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete");

      setMessage("ลบเอกสารสำเร็จ");
      fetchRegistration();
    } catch (error) {
      console.error("Error:", error);
      setMessage("เกิดข้อผิดพลาดในการลบเอกสาร");
    }
  };

  const handlePrint = () => {
    // ดาวน์โหลดไฟล์ PDF แบบฟอร์มใบสมัคร
    if (!registration) return;
    const link = document.createElement('a');
    link.href = '/ใบสมัครเข้าศึกษา.pdf';
    link.download = `ใบสมัครเข้าศึกษา-${registration.firstNameTH}-${registration.lastNameTH}.pdf`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">กำลังโหลด...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">{message}</div>
            <div className="mt-4 text-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับหน้าหลัก
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="mr-1 h-3 w-3" />
            อนุมัติแล้ว
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500">
            <XCircle className="mr-1 h-3 w-3" />
            ไม่อนุมัติ
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500">
            <Clock className="mr-1 h-3 w-3" />
            รอการตรวจสอบ
          </Badge>
        );
    }
  };

  const gradeText = registration.gradeLevel === "m4" ? "มัธยมศึกษาปีที่ ๔" : "มัธยมศึกษาปีที่ ๑";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับหน้าหลัก
            </Button>
          </Link>
        </div>

        {/* Title Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">
                  ใบสมัครเข้าศึกษาต่อระดับชั้น{gradeText}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
                </p>
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  {registration.isSpecialISM ? (
                    <>
                      <Badge className="bg-amber-600 text-white">ISM</Badge>
                      ห้องเรียนพิเศษ ISM - {gradeText}
                    </>
                  ) : (
                    <>ห้องเรียนทั่วไป - {gradeText}</>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {getStatusBadge(registration.status)}
                <Badge variant="outline" className="text-xs">
                  รหัสอ้างอิง: {registration.id.slice(-8).toUpperCase()}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Message */}
        {message && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Button onClick={handlePrint} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            ดาวน์โหลดใบสมัคร
          </Button>
          <Button
            onClick={() => setEditingGPA(!editingGPA)}
            variant="outline"
            className="w-full"
          >
            <Edit className="mr-2 h-4 w-4" />
            {editingGPA ? "ยกเลิกแก้ไข" : "แก้ไขเกรดเฉลี่ย"}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <label>
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "กำลังอัพโหลด..." : "แนบเอกสาร"}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </Button>
        </div>

        {/* คำแนะนำการดาวน์โหลดใบสมัคร */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">คำแนะนำ: การดาวน์โหลดใบสมัคร</p>
                <p>กดปุ่ม &ldquo;ดาวน์โหลดใบสมัคร&rdquo; เพื่อดาวน์โหลดแบบฟอร์มใบสมัครอย่างเป็นทางการ</p>
                <p className="mt-1">กรุณาพิมพ์และกรอกข้อมูลตามรายละเอียดด้านล่าง จากนั้นนำมายื่นที่โรงเรียน</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPA Section */}
        {editingGPA && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {registration?.gradeLevel === "m4" ? (
                    // เกรดสำหรับ ม.4 (ม.1-3)
                    <>
                      <div>
                        <Label>เกรดเฉลี่ยวิทยาศาสตร์ ม.1</Label>
                        <Input
                          type="text"
                          value={grades.scienceGradeM1}
                          onChange={(e) => setGrades({...grades, scienceGradeM1: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยวิทยาศาสตร์ ม.2</Label>
                        <Input
                          type="text"
                          value={grades.scienceGradeM2}
                          onChange={(e) => setGrades({...grades, scienceGradeM2: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยวิทยาศาสตร์ ม.3</Label>
                        <Input
                          type="text"
                          value={grades.scienceGradeM3}
                          onChange={(e) => setGrades({...grades, scienceGradeM3: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยคณิตศาสตร์ ม.1</Label>
                        <Input
                          type="text"
                          value={grades.mathGradeM1}
                          onChange={(e) => setGrades({...grades, mathGradeM1: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยคณิตศาสตร์ ม.2</Label>
                        <Input
                          type="text"
                          value={grades.mathGradeM2}
                          onChange={(e) => setGrades({...grades, mathGradeM2: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยคณิตศาสตร์ ม.3</Label>
                        <Input
                          type="text"
                          value={grades.mathGradeM3}
                          onChange={(e) => setGrades({...grades, mathGradeM3: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </>
                  ) : (
                    // เกรดสำหรับ ม.1 (ป.5-6)
                    <>
                      <div>
                        <Label>เกรดเฉลี่ยวิทยาศาสตร์ ป.5</Label>
                        <Input
                          type="text"
                          value={grades.scienceGradeP5}
                          onChange={(e) => setGrades({...grades, scienceGradeP5: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยวิทยาศาสตร์ ป.6</Label>
                        <Input
                          type="text"
                          value={grades.scienceGradeP6}
                          onChange={(e) => setGrades({...grades, scienceGradeP6: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยคณิตศาสตร์ ป.5</Label>
                        <Input
                          type="text"
                          value={grades.mathGradeP5}
                          onChange={(e) => setGrades({...grades, mathGradeP5: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label>เกรดเฉลี่ยคณิตศาสตร์ ป.6</Label>
                        <Input
                          type="text"
                          value={grades.mathGradeP6}
                          onChange={(e) => setGrades({...grades, mathGradeP6: e.target.value})}
                          placeholder="0.00"
                        />
                      </div>
                    </>
                  )}
                </div>
                <Button onClick={handleUpdateGPA} className="w-full">
                  บันทึกเกรดเฉลี่ย
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents Section */}
        {registration.documents.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">เอกสารแนบ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {registration.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <a
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        เอกสาร {index + 1}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDocument(doc)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Registration Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">รายละเอียดการสมัคร</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-600">ระดับชั้นที่สมัคร</Label>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white">
                    {registration.gradeLevel === "m4" ? "ม.4" : "ม.1"}
                  </Badge>
                  <span className="font-medium">{gradeText}</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-600">คำนำหน้า</Label>
                <p className="font-medium">{registration.title}</p>
              </div>
              <div>
                <Label className="text-gray-600">ชื่อ-นามสกุล</Label>
                <p className="font-medium">
                  {registration.firstNameTH} {registration.lastNameTH}
                </p>
              </div>
              {registration.idCardOrPassport && (
                <div>
                  <Label className="text-gray-600">
                    เลขบัตรประชาชน/พาสปอร์ต
                  </Label>
                  <p className="font-medium">{registration.idCardOrPassport}</p>
                </div>
              )}
              <div>
                <Label className="text-gray-600">วัน/เดือน/ปีเกิด</Label>
                <p className="font-medium">
                  {new Date(registration.birthDate).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <Label className="text-gray-600">เชื้อชาติ</Label>
                <p className="font-medium">{registration.ethnicity}</p>
              </div>
              <div>
                <Label className="text-gray-600">สัญชาติ</Label>
                <p className="font-medium">{registration.nationality}</p>
              </div>
              <div>
                <Label className="text-gray-600">ศาสนา</Label>
                <p className="font-medium">{registration.religion}</p>
              </div>
              <div>
                <Label className="text-gray-600">เบอร์โทรศัพท์</Label>
                <p className="font-medium">{registration.phone}</p>
              </div>
            </div>

            {/* Education Section */}
            {registration.schoolName && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">ข้อมูลการศึกษา</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600">สถานะการศึกษา</Label>
                    <p className="font-medium">{registration.educationStatus}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">โรงเรียน</Label>
                    <p className="font-medium">{registration.schoolName}</p>
                  </div>
                  {registration.schoolProvince && (
                    <div>
                      <Label className="text-gray-600">จังหวัด</Label>
                      <p className="font-medium">{registration.schoolProvince}</p>
                    </div>
                  )}
                  {registration.schoolDistrict && (
                    <div>
                      <Label className="text-gray-600">อำเภอ</Label>
                      <p className="font-medium">{registration.schoolDistrict}</p>
                    </div>
                  )}
                </div>
                
                {/* Grades */}
                {registration.gradeLevel === "m4" ? (
                  // เกรดสำหรับ ม.4 (ม.1-3)
                  (registration.scienceGradeM1 || registration.scienceGradeM2 || registration.scienceGradeM3 ||
                   registration.mathGradeM1 || registration.mathGradeM2 || registration.mathGradeM3) && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-green-700">เกรดเฉลี่ยรายวิชา</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registration.scienceGradeM1 && (
                          <div>
                            <Label className="text-gray-600">วิทยาศาสตร์ ม.1</Label>
                            <p className="font-medium text-green-600">{registration.scienceGradeM1}</p>
                          </div>
                        )}
                        {registration.scienceGradeM2 && (
                          <div>
                            <Label className="text-gray-600">วิทยาศาสตร์ ม.2</Label>
                            <p className="font-medium text-green-600">{registration.scienceGradeM2}</p>
                          </div>
                        )}
                        {registration.scienceGradeM3 && (
                          <div>
                            <Label className="text-gray-600">วิทยาศาสตร์ ม.3</Label>
                            <p className="font-medium text-green-600">{registration.scienceGradeM3}</p>
                          </div>
                        )}
                        {registration.mathGradeM1 && (
                          <div>
                            <Label className="text-gray-600">คณิตศาสตร์ ม.1</Label>
                            <p className="font-medium text-green-600">{registration.mathGradeM1}</p>
                          </div>
                        )}
                        {registration.mathGradeM2 && (
                          <div>
                            <Label className="text-gray-600">คณิตศาสตร์ ม.2</Label>
                            <p className="font-medium text-green-600">{registration.mathGradeM2}</p>
                          </div>
                        )}
                        {registration.mathGradeM3 && (
                          <div>
                            <Label className="text-gray-600">คณิตศาสตร์ ม.3</Label>
                            <p className="font-medium text-green-600">{registration.mathGradeM3}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  // เกรดสำหรับ ม.1 (ป.5-6)
                  (registration.scienceGradeP5 || registration.scienceGradeP6 ||
                   registration.mathGradeP5 || registration.mathGradeP6) && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-green-700">เกรดเฉลี่ยรายวิชา</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registration.scienceGradeP5 && (
                          <div>
                            <Label className="text-gray-600">วิทยาศาสตร์ ป.5</Label>
                            <p className="font-medium text-green-600">{registration.scienceGradeP5}</p>
                          </div>
                        )}
                        {registration.scienceGradeP6 && (
                          <div>
                            <Label className="text-gray-600">วิทยาศาสตร์ ป.6</Label>
                            <p className="font-medium text-green-600">{registration.scienceGradeP6}</p>
                          </div>
                        )}
                        {registration.mathGradeP5 && (
                          <div>
                            <Label className="text-gray-600">คณิตศาสตร์ ป.5</Label>
                            <p className="font-medium text-green-600">{registration.mathGradeP5}</p>
                          </div>
                        )}
                        {registration.mathGradeP6 && (
                          <div>
                            <Label className="text-gray-600">คณิตศาสตร์ ป.6</Label>
                            <p className="font-medium text-green-600">{registration.mathGradeP6}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Address Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold mb-4">ที่อยู่ตามทะเบียนบ้าน</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {registration.villageName && (
                  <div>
                    <Label className="text-gray-600">หมู่บ้าน</Label>
                    <p className="font-medium">{registration.villageName}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-600">บ้านเลขที่</Label>
                  <p className="font-medium">{registration.houseNumber}</p>
                </div>
                {registration.moo && (
                  <div>
                    <Label className="text-gray-600">หมู่ที่</Label>
                    <p className="font-medium">{registration.moo}</p>
                  </div>
                )}
                {registration.soi && (
                  <div>
                    <Label className="text-gray-600">ซอย</Label>
                    <p className="font-medium">{registration.soi}</p>
                  </div>
                )}
                {registration.road && (
                  <div>
                    <Label className="text-gray-600">ถนน</Label>
                    <p className="font-medium">{registration.road}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-600">ตำบล/แขวง</Label>
                  <p className="font-medium">{registration.subdistrict}</p>
                </div>
                <div>
                  <Label className="text-gray-600">อำเภอ/เขต</Label>
                  <p className="font-medium">{registration.district}</p>
                </div>
                <div>
                  <Label className="text-gray-600">จังหวัด</Label>
                  <p className="font-medium">{registration.province}</p>
                </div>
                <div>
                  <Label className="text-gray-600">รหัสไปรษณีย์</Label>
                  <p className="font-medium">{registration.postalCode}</p>
                </div>
              </div>
            </div>

            {/* Family Section */}
            {(registration.siblings || registration.siblingsInSchool) && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold mb-4">ข้อมูลครอบครัว</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {registration.siblings && (
                    <div>
                      <Label className="text-gray-600">จำนวนพี่น้อง</Label>
                      <p className="font-medium">{registration.siblings} คน</p>
                    </div>
                  )}
                  {registration.siblingsInSchool && (
                    <div>
                      <Label className="text-gray-600">
                        พี่น้องที่เรียนโรงเรียนนี้
                      </Label>
                      <p className="font-medium">
                        {registration.siblingsInSchool} คน
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            สามารถกลับมาดูรายละเอียดการสมัครได้ตลอดเวลาโดยใช้รหัสอ้างอิง:{" "}
            <span className="font-bold">
              {registration.id.slice(-8).toUpperCase()}
            </span>
          </p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
