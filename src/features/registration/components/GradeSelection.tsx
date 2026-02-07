"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function GradeSelection() {
  return (
    <div className="container mx-auto px-4 py-4 md:py-6">
      {/* Title Card */}
      <Card className="mb-4 md:mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">
            เลือกระดับชั้นที่ต้องการสมัคร
          </CardTitle>
          <CardDescription className="text-base md:text-lg">
            โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grade Selection - Horizontal on ALL screen sizes */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
        {/* ม.1 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl md:text-4xl font-bold text-primary">1</span>
            </div>
            <CardTitle className="text-lg md:text-xl">มัธยมศึกษาปีที่ 1</CardTitle>
            <CardDescription className="text-sm md:text-base">
              ห้องเรียนพิเศษ ISM / ห้องเรียนทั่วไป
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>สำหรับผู้จบ ป.6 หรือเทียบเท่า</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>เลือกห้องเรียนได้ตามความต้องการ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>เน้นวิทยาศาสตร์และคณิตศาสตร์</span>
              </li>
            </ul>
            <Link href="/register/grade7" className="block">
              <Button className="w-full" size="lg">
                <GraduationCap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                สมัครเรียน ม.1
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* ม.4 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center pb-3">
            <div className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl md:text-4xl font-bold text-primary">4</span>
            </div>
            <CardTitle className="text-lg md:text-xl">มัธยมศึกษาปีที่ 4</CardTitle>
            <CardDescription className="text-sm md:text-base">
              ห้องเรียนพิเศษ ISM / ห้องเรียนทั่วไป
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-1.5 text-xs md:text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>สำหรับผู้จบ ม.3 หรือเทียบเท่า</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>เลือกห้องเรียนได้ตามความต้องการ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>เตรียมความพร้อมสู่มหาวิทยาลัย</span>
              </li>
            </ul>
            <Link href="/register/grade10" className="block">
              <Button className="w-full" size="lg">
                <GraduationCap className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                สมัครเรียน ม.4
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">ข้อมูลสำคัญ:</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-xs md:text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>กรุณาเตรียมเลขบัตรประชาชน</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>
                เตรียมไฟล์ ใบทะเบียนบ้าน ,หลักฐานแสดงผลการเรียน (ปพ.1 ป) , รูปถ่ายขนาด 1.5 นิ้ว หรือ 1 นิ้ว สำหรับการ Upload เข้าระบบ
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>ต้องมีผลการเรียนเฉลี่ยวิชาวิทยาศาสตร์ คณิตศาสตร์ ภาษาอังกฤษ</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>สามารถกลับมาแก้ไขข้อมูลได้ภายหลัง</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>หลังสมัครเสร็จ สามารถดาวน์โหลดใบสมัครเพื่อพิมพ์และนำมายื่นที่โรงเรียน</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}