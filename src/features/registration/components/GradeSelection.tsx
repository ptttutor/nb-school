"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

export function GradeSelection() {
  return (
    <>
      {/* Title Card */}
      <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur mb-8">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-amber-100 rounded-full">
              <GraduationCap className="w-12 h-12 text-amber-700" />
            </div>
          </div>
          <CardTitle className="text-3xl text-amber-900">
            เลือกระดับชั้นที่ต้องการสมัคร
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grade Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* ม.1 */}
        <Link href="/register/m1">
          <Card className="border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer group h-full">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-4xl font-bold text-blue-700">1</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">
                  มัธยมศึกษาปีที่ ๑
                </h3>
                <p className="text-gray-600 mb-4">
                  ห้องเรียนพิเศษ ISM
                </p>
                <ul className="text-sm text-gray-600 text-left space-y-2 mb-6">
                  <li>• สำหรับผู้จบ ป.6 หรือเทียบเท่า</li>
                  <li>• เน้นวิทยาศาสตร์และคณิตศาสตร์</li>
                  <li>• พัฒนาทักษะภาษาอังกฤษ</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  สมัครเรียน ม.1
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* ม.4 */}
        <Link href="/register/m4">
          <Card className="border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer group h-full">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-4xl font-bold text-green-700">4</span>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">
                  มัธยมศึกษาปีที่ ๔
                </h3>
                <p className="text-gray-600 mb-4">
                  ห้องเรียนพิเศษ ISM
                </p>
                <ul className="text-sm text-gray-600 text-left space-y-2 mb-6">
                  <li>• สำหรับผู้จบ ม.3 หรือเทียบเท่า</li>
                  <li>• เน้นวิทยาศาสตร์และคณิตศาสตร์</li>
                  <li>• เตรียมความพร้อมสู่มหาวิทยาลัย</li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  สมัครเรียน ม.4
                </Button>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Information */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-3">ข้อมูลสำคัญ:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• กรุณาเตรียมเลขบัตรประชาชน/พาสปอร์ต</li>
            <li>• ต้องมีผลการเรียนเฉลี่ยวิชาวิทยาศาสตร์และคณิตศาสตร์</li>
            <li>• สามารถกลับมาแก้ไขข้อมูลได้ภายหลัง</li>
            <li>• หลังสมัครเสร็จ สามารถดาวน์โหลดใบสมัครเพื่อพิมพ์และนำมายื่นที่โรงเรียน</li>
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
