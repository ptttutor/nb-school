// DocumentList Component - Display and upload registration documents

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Upload, Loader2 } from "lucide-react";
import type { Registration } from "@/types/registration.types";
import { useToast } from "@/hooks/use-toast";

interface DocumentListProps {
  registration: Registration;
}

export function DocumentList({ registration }: DocumentListProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();
  
  const hasDocuments = registration.houseRegistrationDoc || 
                       registration.transcriptDoc || 
                       registration.photoDoc || 
                       registration.documents.length > 0;

  const handleFileUpload = async (
    file: File,
    docType: 'houseRegistrationDoc' | 'transcriptDoc' | 'photoDoc'
  ) => {
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ขนาดไฟล์ต้องไม่เกิน 5MB",
      });
      return;
    }

    setUploading(docType);
    try {
      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const { url } = await uploadResponse.json();

      // Update registration with new document URL
      const updateResponse = await fetch(`/api/registration/${registration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [docType]: url }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update registration');
      }

      toast({
        title: "อัพโหลดสำเร็จ",
        description: "ไฟล์ได้รับการอัพโหลดแล้ว",
      });

      // Reload page to show updated document
      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัพโหลดไฟล์ได้ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setUploading(null);
    }
  };

  const triggerFileInput = (docType: 'houseRegistrationDoc' | 'transcriptDoc' | 'photoDoc') => {
    const input = document.getElementById(`file-${docType}`) as HTMLInputElement;
    input?.click();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">เอกสารแนบ</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Hidden file inputs */}
        <input
          type="file"
          id="file-houseRegistrationDoc"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'houseRegistrationDoc');
            e.target.value = '';
          }}
        />
        <input
          type="file"
          id="file-transcriptDoc"
          className="hidden"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'transcriptDoc');
            e.target.value = '';
          }}
        />
        <input
          type="file"
          id="file-photoDoc"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file, 'photoDoc');
            e.target.value = '';
          }}
        />

        {/* สรุปสถานะเอกสาร */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            สถานะเอกสารที่ควรแนบ
          </h4>
          <div className="space-y-2">
            <DocumentStatusItem 
              label="สำเนาทะเบียนบ้าน"
              hasDocument={!!registration.houseRegistrationDoc}
              docType="houseRegistrationDoc"
              onUpload={triggerFileInput}
              uploading={uploading === 'houseRegistrationDoc'}
            />
            <DocumentStatusItem 
              label="หลักฐานผลการเรียน (ปพ.1 หรือ ปพ.7)"
              hasDocument={!!registration.transcriptDoc}
              docType="transcriptDoc"
              onUpload={triggerFileInput}
              uploading={uploading === 'transcriptDoc'}
            />
            <DocumentStatusItem 
              label="รูปถ่าย 1.5 หรือ 1 นิ้ว"
              hasDocument={!!registration.photoDoc}
              docType="photoDoc"
              onUpload={triggerFileInput}
              uploading={uploading === 'photoDoc'}
            />
          </div>
        </div>

        {/* รายการเอกสาร */}
        {hasDocuments ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700 mb-2">รายการเอกสารที่แนบแล้ว</h4>
            
            {registration.houseRegistrationDoc && (
              <DocumentLink 
                label="สำเนาทะเบียนบ้าน"
                url={registration.houseRegistrationDoc}
              />
            )}
            {registration.transcriptDoc && (
              <DocumentLink 
                label="หลักฐานผลการเรียน (ปพ.1 / ปพ.7)"
                url={registration.transcriptDoc}
              />
            )}
            {registration.photoDoc && (
              <DocumentLink 
                label="รูปถ่าย 1.5 หรือ 1 นิ้ว"
                url={registration.photoDoc}
              />
            )}

            {registration.documents.length > 0 && (
              <>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">เอกสารเพิ่มเติม</p>
                </div>
                {registration.documents.map((doc, index) => (
                  <DocumentLink 
                    key={index}
                    label={`เอกสารเพิ่มเติม ${index + 1}`}
                    url={doc}
                    variant="secondary"
                  />
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
  );
}

function DocumentStatusItem({ 
  label, 
  hasDocument,
  docType,
  onUpload,
  uploading 
}: { 
  label: string; 
  hasDocument: boolean;
  docType: 'houseRegistrationDoc' | 'transcriptDoc' | 'photoDoc';
  onUpload: (docType: 'houseRegistrationDoc' | 'transcriptDoc' | 'photoDoc') => void;
  uploading: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {hasDocument ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpload(docType)}
              disabled={uploading}
              className="border-amber-300 text-amber-700 hover:bg-amber-50 ml-2 h-7 text-xs"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  กำลังอัพโหลด...
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 mr-1" />
                  เปลี่ยนไฟล์
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            <span className="text-xs text-gray-400 mr-2">ยังไม่แนบ</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpload(docType)}
              disabled={uploading}
              className="border-blue-300 text-blue-700 hover:bg-blue-50 h-7 text-xs"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  กำลังอัพโหลด...
                </>
              ) : (
                <>
                  <Upload className="w-3 h-3 mr-1" />
                  อัพโหลด
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function DocumentLink({ label, url, variant = "primary" }: { 
  label: string; 
  url: string; 
  variant?: "primary" | "secondary";
}) {
  const bgColor = variant === "primary" ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200";
  const iconColor = variant === "primary" ? "text-green-600" : "text-blue-600";

  return (
    <div className={`flex items-center justify-between p-3 ${bgColor} border rounded-lg`}>
      <div className="flex items-center gap-2">
        <CheckCircle className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
