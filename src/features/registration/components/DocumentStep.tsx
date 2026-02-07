// Step 6: Document Upload and Verification Component

'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, RefreshCw } from "lucide-react";

interface DocumentStepProps {
  houseRegistrationFile: File | null;
  transcriptFile: File | null;
  photoFile: File | null;
  captcha: string;
  captchaInput: string;
  onCaptchaInputChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'house' | 'transcript' | 'photo') => void;
  onRegenerateCaptcha: () => void;
}

export function DocumentStep({
  houseRegistrationFile,
  transcriptFile,
  photoFile,
  captcha,
  captchaInput,
  onCaptchaInputChange,
  onFileChange,
  onRegenerateCaptcha
}: DocumentStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
        <Badge className="bg-amber-600 text-white text-base px-3 py-1">6</Badge>
        <h3 className="text-xl font-bold text-amber-900">เอกสารและยืนยัน</h3>
      </div>

      <div className="space-y-6">
        {/* สรุปเอกสารที่แนบ */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            สถานะเอกสารที่แนบ
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
              <span className="text-sm">สำเนาทะเบียนบ้าน</span>
              {houseRegistrationFile ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">{houseRegistrationFile.name}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">ยังไม่ได้แนบไฟล์</span>
              )}
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
              <span className="text-sm">หลักฐานแสดงผลการเรียน (ปพ.1)</span>
              {transcriptFile ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">{transcriptFile.name}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">ยังไม่ได้แนบไฟล์</span>
              )}
            </div>
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
              <span className="text-sm">รูปถ่าย</span>
              {photoFile ? (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">{photoFile.name}</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">ยังไม่ได้แนบไฟล์</span>
              )}
            </div>
          </div>
        </div>

        {/* เอกสารแนบ */}
        <div>
          <h4 className="font-semibold text-amber-900 mb-3">เอกสารแนบ (ไม่บังคับ)</h4>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 mb-2">
              💡 หลังจากสมัครเสร็จแล้ว สามารถอัปโหลดเอกสารเพิ่มเติมในหน้ารายละเอียดการสมัครได้
            </p>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>สำเนาทะเบียนบ้าน</li>
              <li>หลักฐานแสดงผลการเรียน (ปพ.1)</li>
              <li>รูปถ่าย ขนาด 1.5 x 1 นิ้ว</li>
            </ul>
            <p className="text-xs text-blue-600 mt-2">
              * ขนาดไฟล์แต่ละไฟล์ไม่เกิน 5MB
            </p>
          </div>

          <div className="space-y-4">
            {/* สำเนาทะเบียนบ้าน */}
            <div className="space-y-2">
              <Label htmlFor="houseRegistration" className="flex items-center gap-2">
                สำเนาทะเบียนบ้าน
                {houseRegistrationFile && <CheckCircle className="w-4 h-4 text-green-600" />}
              </Label>
              <Input
                type="file"
                id="houseRegistration"
                accept="image/*,application/pdf"
                onChange={(e) => onFileChange(e, 'house')}
                className="border-amber-200"
              />
              {houseRegistrationFile && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  เลือกไฟล์: {houseRegistrationFile.name}
                </p>
              )}
            </div>

            {/* หลักฐานแสดงผลการเรียน */}
            <div className="space-y-2">
              <Label htmlFor="transcript" className="flex items-center gap-2">
                หลักฐานแสดงผลการเรียน (ปพ.1)
                {transcriptFile && <CheckCircle className="w-4 h-4 text-green-600" />}
              </Label>
              <Input
                type="file"
                id="transcript"
                accept="image/*,application/pdf"
                onChange={(e) => onFileChange(e, 'transcript')}
                className="border-amber-200"
              />
              {transcriptFile && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  เลือกไฟล์: {transcriptFile.name}
                </p>
              )}
            </div>

            {/* รูปถ่าย */}
            <div className="space-y-2">
              <Label htmlFor="photo" className="flex items-center gap-2">
                รูปถ่าย ขนาด 1.5 x 1 นิ้ว
                {photoFile && <CheckCircle className="w-4 h-4 text-green-600" />}
              </Label>
              <Input
                type="file"
                id="photo"
                accept="image/*"
                onChange={(e) => onFileChange(e, 'photo')}
                className="border-amber-200"
              />
              {photoFile && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  เลือกไฟล์: {photoFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CAPTCHA Verification */}
        <div>
          <h4 className="font-semibold text-amber-900 mb-3">ยืนยันว่าไม่ใช่โปรแกรมอัตโนมัติ</h4>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-300 rounded-lg px-6 py-3 text-3xl font-bold tracking-widest text-amber-900 select-none" style={{ fontFamily: 'monospace' }}>
                {captcha}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={onRegenerateCaptcha}
                variant="outline"
                size="sm"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                สร้างรหัสใหม่
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                id="captcha"
                name="captcha"
                required
                maxLength={4}
                value={captchaInput}
                onChange={(e) => onCaptchaInputChange(e.target.value)}
                placeholder="กรอกตัวเลข 4 หลัก"
                className="border-amber-200 text-center text-2xl tracking-wider"
                style={{ fontFamily: 'monospace' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
