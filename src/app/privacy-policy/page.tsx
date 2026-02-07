"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับหน้าแรก
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl border-amber-200 bg-white/95 backdrop-blur">
          <CardHeader className="border-b border-amber-100">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-amber-600" />
              <div>
                <CardTitle className="text-3xl text-amber-900">
                  นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล
                </CardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  อัพเดทล่าสุด: 8 กุมภาพันธ์ 2569
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="prose max-w-none p-8">
            {/* บทนำ */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">บทนำ</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                โรงเรียนหนองบัว ให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลส่วนบุคคลของนักเรียนและผู้ปกครอง 
                นโยบายความเป็นส่วนตัวฉบับนี้อธิบายถึงวิธีการที่เราเก็บรวบรวม ใช้ เปิดเผย และคุ้มครองข้อมูลส่วนบุคคลของท่าน
                ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </p>
            </section>

            {/* ข้อมูลที่เก็บรวบรวม */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">1. ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</h2>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="font-semibold text-blue-900 mb-2">ข้อมูลของนักเรียน:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• ข้อมูลส่วนตัว: เลขบัตรประชาชน, ชื่อ-นามสกุล, วันเกิด, เชื้อชาติ, สัญชาติ, ศาสนา</li>
                  <li>• ข้อมูลติดต่อ: ที่อยู่, เบอร์โทรศัพท์</li>
                  <li>• ข้อมูลการศึกษา: โรงเรียนเดิม, ระดับการศึกษา, ผลการเรียน</li>
                  <li>• ข้อมูลครอบครัว: จำนวนพี่น้อง, พี่น้องที่เรียนในโรงเรียน</li>
                </ul>
              </div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="font-semibold text-green-900 mb-2">ข้อมูลของผู้ปกครอง:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• ข้อมูลส่วนตัว: ชื่อ-นามสกุล บิดา/มารดา</li>
                  <li>• ข้อมูลติดต่อ: เบอร์โทรศัพท์ผู้ปกครอง</li>
                </ul>
              </div>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                <p className="font-semibold text-amber-900 mb-2">เอกสารประกอบ:</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• สำเนาทะเบียนบ้าน</li>
                  <li>• หลักฐานผลการเรียน (ปพ.1 หรือ ปพ.7)</li>
                  <li>• รูปถ่าย</li>
                </ul>
              </div>
            </section>

            {/* วัตถุประสงค์ */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">2. วัตถุประสงค์ในการใช้ข้อมูล</h2>
              </div>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>เพื่อดำเนินการรับสมัครนักเรียนและพิจารณาคุณสมบัติของผู้สมัคร</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>เพื่อติดต่อสื่อสารกับผู้สมัครและผู้ปกครอง</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>เพื่อจัดทำทะเบียนนักเรียนและเอกสารการศึกษา</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>เพื่อใช้ในการบริหารจัดการและพัฒนาระบบการศึกษา</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>เพื่อปฏิบัติตามกฎหมายและระเบียบของหน่วยงานราชการที่เกี่ยวข้อง</span>
                </li>
              </ul>
            </section>

            {/* การเปิดเผยข้อมูล */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">3. การเปิดเผยข้อมูลส่วนบุคคล</h2>
              </div>
              <p className="text-gray-700 mb-4">
                โรงเรียนหนองบัวจะไม่เปิดเผยข้อมูลส่วนบุคคลของท่านให้แก่บุคคลภายนอก เว้นแต่กรณีดังต่อไปนี้:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>ได้รับความยินยอมจากท่านหรือผู้ปกครอง</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>เพื่อปฏิบัติตามกฎหมายหรือคำสั่งศาล</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>เพื่อส่งต่อให้หน่วยงานราชการที่เกี่ยวข้องตามอำนาจหน้าที่</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>ข้อมูลสาธารณะ เช่น รายชื่อผู้สมัครที่แสดงบนเว็บไซต์ (เฉพาะชื่อ-นามสกุล, ระดับชั้น, โรงเรียน, จังหวัด)</span>
                </li>
              </ul>
            </section>

            {/* ความปลอดภัย */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">4. การรักษาความปลอดภัยของข้อมูล</h2>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสมเพื่อป้องกันการสูญหาย การเข้าถึง การใช้ การเปลี่ยนแปลง 
                  การแก้ไข หรือการเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>เข้ารหัสข้อมูลด้วย SSL/HTTPS</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>จำกัดการเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่ได้รับอนุญาต</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>สำรองข้อมูลอย่างสม่ำเสมอ</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>ตรวจสอบและปรับปรุงมาตรการรักษาความปลอดภัยอย่างต่อเนื่อง</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* ระยะเวลาเก็บรักษา */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">5. ระยะเวลาในการเก็บรักษาข้อมูล</h2>
              </div>
              <p className="text-gray-700">
                โรงเรียนจะเก็บรักษาข้อมูลส่วนบุคคลของท่านไว้ตามระยะเวลาที่จำเป็น:
              </p>
              <ul className="space-y-2 text-gray-700 mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>ข้อมูลผู้สมัครที่ไม่ได้รับคัดเลือก: เก็บไว้ 1 ปีการศึกษา แล้วทำลาย</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600">•</span>
                  <span>ข้อมูลนักเรียนที่รับเข้าศึกษา: เก็บไว้ตลอดระยะเวลาที่ศึกษาและอีก 5 ปีหลังสำเร็จการศึกษา</span>
                </li>
              </ul>
            </section>

            {/* สิทธิของเจ้าของข้อมูล */}
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-bold text-amber-900 m-0">6. สิทธิของเจ้าของข้อมูลส่วนบุคคล</h2>
              </div>
              <p className="text-gray-700 mb-3">ท่านมีสิทธิต่อไปนี้เกี่ยวกับข้อมูลส่วนบุคคลของท่าน:</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="font-semibold text-amber-900">สิทธิในการเข้าถึง</p>
                  <p className="text-sm text-gray-600">ขอเข้าถึงและขอรับสำเนาข้อมูลของท่าน</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="font-semibold text-amber-900">สิทธิในการแก้ไข</p>
                  <p className="text-sm text-gray-600">ขอแก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="font-semibold text-amber-900">สิทธิในการลบ</p>
                  <p className="text-sm text-gray-600">ขอลบข้อมูลของท่าน (ภายใต้เงื่อนไข)</p>
                </div>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="font-semibold text-amber-900">สิทธิในการคัดค้าน</p>
                  <p className="text-sm text-gray-600">คัดค้านการประมวลผลข้อมูล</p>
                </div>
              </div>
            </section>

            {/* ติดต่อ */}
            <section className="mb-8">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-6">
                <h2 className="text-xl font-bold text-amber-900 mb-4">7. ติดต่อเรา</h2>
                <p className="text-gray-700 mb-3">
                  หากท่านมีคำถามหรือข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ หรือต้องการใช้สิทธิของท่าน 
                  กรุณาติดต่อ:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p className="font-semibold text-amber-900">โรงเรียนหนองบัว</p>
                  <p>อำเภอหนองบัว จังหวัดนครสวรรค์</p>
                  <p>โทร: 056-219-XXX</p>
                  <p>อีเมล: info@nongbua.ac.th</p>
                </div>
              </div>
            </section>

            {/* การเปลี่ยนแปลง */}
            <section>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">การเปลี่ยนแปลงนโยบาย</h3>
                <p className="text-sm text-gray-700">
                  โรงเรียนขอสงวนสิทธิ์ในการแก้ไขเปลี่ยนแปลงนโยบายความเป็นส่วนตัวนี้ได้ตามความเหมาะสม 
                  การเปลี่ยนแปลงจะมีผลทันทีที่ประกาศบนเว็บไซต์ โปรดตรวจสอบนโยบายนี้เป็นประจำ
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
