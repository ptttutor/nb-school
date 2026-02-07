// RegistrationDetailView - Main component for displaying registration details

"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header, Footer } from "@/components/layout";
import { ArrowLeft, Download, FileText } from "lucide-react";
import { useRegistrationDetail } from "../hooks";
import { StatusBadge } from "./StatusBadge";
import { DocumentList } from "./DocumentList";
import { RegistrationInfo } from "./RegistrationInfo";

interface RegistrationDetailViewProps {
  id: string;
}

export function RegistrationDetailView({ id }: RegistrationDetailViewProps) {
  const { registration, loading, error, handlePrint } = useRegistrationDetail(id);

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

  if (error || !registration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              {error || "ไม่พบข้อมูลการสมัคร"}
            </div>
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

  const gradeText = registration.gradeLevel === "m4" 
    ? "มัธยมศึกษาปีที่ ๔" 
    : "มัธยมศึกษาปีที่ ๑";

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
                  <StatusBadge status={registration.status} />
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
          <DocumentList registration={registration} />

          {/* Registration Details */}
          <RegistrationInfo registration={registration} gradeText={gradeText} />

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
