"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicyDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าผู้ใช้ยอมรับนโยบายแล้วหรือยัง
    const hasAccepted = localStorage.getItem("privacyPolicyAccepted");
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("privacyPolicyAccepted", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-6">
          <div className="flex items-center gap-3 text-white">
            <Shield className="h-8 w-8" />
            <h2 className="text-2xl font-bold">นโยบายความเป็นส่วนตัว</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4 text-gray-700">
            <p className="text-lg font-semibold text-amber-800">
              ยินดีต้อนรับสู่ระบบรับสมัครนักเรียนออนไลน์
            </p>
            
            <p>
              โรงเรียนหนองบัวให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน 
              ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                ข้อมูลที่เราเก็บรวบรวม
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                <li>ข้อมูลส่วนตัวของนักเรียน (ชื่อ-นามสกุล, เลขบัตรประชาชน, วันเกิด)</li>
                <li>ข้อมูลผู้ปกครอง (ชื่อ-นามสกุล, เบอร์โทร, ที่อยู่)</li>
                <li>ข้อมูลการศึกษา (ผลการเรียน, โรงเรียนเดิม)</li>
                <li>เอกสารประกอบ (รูปถ่าย, ทะเบียนบ้าน, ใบแสดงผลการเรียน)</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                วัตถุประสงค์การใช้ข้อมูล
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm ml-6">
                <li>พิจารณาคุณสมบัติและรับสมัครนักเรียน</li>
                <li>ติดต่อสื่อสารกับผู้สมัครและผู้ปกครอง</li>
                <li>จัดทำสถิติและรายงานภายใน</li>
                <li>เผยแพร่รายชื่อผู้มีสิทธิ์สอบ/สัมภาษณ์บนเว็บไซต์</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                สิทธิของท่าน
              </h3>
              <p className="text-sm ml-6">
                ท่านมีสิทธิ์เข้าถึง แก้ไข ลบ หรือคัดค้านการประมวลผลข้อมูลส่วนบุคคลของท่าน
                สามารถติดต่อได้ที่งานทะเบียนและวัดผล โทร. 056-221-062
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                การกดปุ่ม "ยอมรับ" ถือว่าท่านได้อ่านและยินยอมให้โรงเรียนเก็บรวบรวม 
                ใช้ และเปิดเผยข้อมูลส่วนบุคคลตามนโยบายฉบับนี้
              </p>
              <p className="text-sm text-amber-700 mt-2">
                <Link href="/privacy-policy" className="underline hover:text-amber-900">
                  อ่านนโยบายความเป็นส่วนตัวฉบับเต็ม
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex justify-center">
          <Button
            onClick={handleAccept}
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold px-8"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            ยอมรับนโยบายความเป็นส่วนตัว
          </Button>
        </div>
      </div>
    </div>
  );
}
