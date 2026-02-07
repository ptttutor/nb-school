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
  Edit,
  FileText,
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
  // เกรดสำหรับ ม.1 (ป.4-5)
  gradeP4?: string;
  gradeP5?: string;
  // คะแนนเฉลี่ยสะสมสำหรับ ม.4 (ม.1-3 จำนวน 5 ภาคเรียน)
  scienceCumulativeM1M3?: string;
  mathCumulativeM1M3?: string;
  englishCumulativeM1M3?: string;
  // เอกสารแนบ (field แยก)
  houseRegistrationDoc?: string;
  transcriptDoc?: string;
  photoDoc?: string;
  documents: string[]; // legacy
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

  const handlePrint = () => {
    // เปิดหน้าพิมพ์ใบสมัครที่มีข้อมูลเต็ม
    window.open(`/registration/${id}/print`, '_blank');
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
            <div className="text-center text-red-600">ไม่พบข้อมูลการสมัคร</div>
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

        {/* Action Buttons */}
        <div className="mb-6">
          <Button onClick={handlePrint} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            ดาวน์โหลดใบสมัคร
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

        {/* Documents Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">เอกสารแนบ</CardTitle>
          </CardHeader>
          <CardContent>
            {/* สรุปสถานะเอกสาร */}
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                สถานะเอกสารที่ควรแนบ
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
                  <span className="text-sm text-gray-700">สำเนาทะเบียนบ้าน</span>
                  <div className="flex items-center gap-2">
                    {registration.houseRegistrationDoc ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">ยังไม่แนบ</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
                  <span className="text-sm text-gray-700">หลักฐานผลการเรียน (ปพ.1 หรือ ปพ.7)</span>
                  <div className="flex items-center gap-2">
                    {registration.transcriptDoc ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">ยังไม่แนบ</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
                  <span className="text-sm text-gray-700">รูปถ่าย (1.5 หรือ 2 นิ้ว)</span>
                  <div className="flex items-center gap-2">
                    {registration.photoDoc ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">ยังไม่แนบ</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* รายการเอกสาร */}
            {(registration.houseRegistrationDoc || registration.transcriptDoc || registration.photoDoc || registration.documents.length > 0) ? (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700 mb-2">รายการเอกสารที่แนบแล้ว</h4>
                
                {/* เอกสารจาก field แยก */}
                {registration.houseRegistrationDoc && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <a
                        href={registration.houseRegistrationDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        สำเนาทะเบียนบ้าน
                      </a>
                    </div>
                  </div>
                )}
                {registration.transcriptDoc && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <a
                        href={registration.transcriptDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        หลักฐานผลการเรียน (ปพ.1 / ปพ.7)
                      </a>
                    </div>
                  </div>
                )}
                {registration.photoDoc && (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <a
                        href={registration.photoDoc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        รูปถ่าย (1.5 / 2 นิ้ว)
                      </a>
                    </div>
                  </div>
                )}

                {/* เอกสารเพิ่มเติมจาก documents array */}
                {registration.documents.length > 0 && (
                  <>
                    {registration.documents.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">เอกสารเพิ่มเติม</p>
                      </div>
                    )}
                    {registration.documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <a
                            href={doc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            เอกสารเพิ่มเติม {index + 1}
                          </a>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">ยังไม่มีเอกสารแนบ</p>
                <p className="text-xs text-gray-500 mt-1">
                  เอกสารจะถูกแนบมาพร้อมกับการสมัคร
                </p>
              </div>
            )}
          </CardContent>
        </Card>

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
                  {registration.schoolSubdistrict && (
                    <div>
                      <Label className="text-gray-600">ตำบล</Label>
                      <p className="font-medium">{registration.schoolSubdistrict}</p>
                    </div>
                  )}
                </div>
                
                {/* Grades */}
                {registration.gradeLevel === "m4" ? (
                  // คะแนนสะสมสำหรับ ม.4 (ม.1-3 จำนวน 5 ภาคเรียน)
                  (registration.scienceCumulativeM1M3 || registration.mathCumulativeM1M3 || registration.englishCumulativeM1M3) && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-green-700">คะแนนเฉลี่ยสะสม (ม.1-3 จำนวน 5 ภาคเรียน)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {registration.scienceCumulativeM1M3 && (
                          <div>
                            <Label className="text-gray-600">วิทยาศาสตร์</Label>
                            <p className="font-medium text-green-600">{registration.scienceCumulativeM1M3}</p>
                          </div>
                        )}
                        {registration.mathCumulativeM1M3 && (
                          <div>
                            <Label className="text-gray-600">คณิตศาสตร์</Label>
                            <p className="font-medium text-green-600">{registration.mathCumulativeM1M3}</p>
                          </div>
                        )}
                        {registration.englishCumulativeM1M3 && (
                          <div>
                            <Label className="text-gray-600">ภาษาอังกฤษ</Label>
                            <p className="font-medium text-green-600">{registration.englishCumulativeM1M3}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  // เกรดเฉลี่ยสำหรับ ม.1 (ป.4-5)
                  (registration.gradeP4 || registration.gradeP5) && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-semibold mb-3 text-green-700">เกรดเฉลี่ย</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {registration.gradeP4 && (
                          <div>
                            <Label className="text-gray-600">ประถมศึกษาปีที่ 4</Label>
                            <p className="font-medium text-green-600">{registration.gradeP4}</p>
                          </div>
                        )}
                        {registration.gradeP5 && (
                          <div>
                            <Label className="text-gray-600">ประถมศึกษาปีที่ 5</Label>
                            <p className="font-medium text-green-600">{registration.gradeP5}</p>
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
