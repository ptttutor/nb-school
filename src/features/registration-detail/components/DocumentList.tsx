// DocumentList Component - Display registration documents

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText } from "lucide-react";
import type { Registration } from "@/types/registration.types";

interface DocumentListProps {
  registration: Registration;
}

export function DocumentList({ registration }: DocumentListProps) {
  const hasDocuments = registration.houseRegistrationDoc || 
                       registration.transcriptDoc || 
                       registration.photoDoc || 
                       registration.documents.length > 0;

  return (
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
            <DocumentStatusItem 
              label="สำเนาทะเบียนบ้าน"
              hasDocument={!!registration.houseRegistrationDoc}
            />
            <DocumentStatusItem 
              label="หลักฐานผลการเรียน (ปพ.1 หรือ ปพ.7)"
              hasDocument={!!registration.transcriptDoc}
            />
            <DocumentStatusItem 
              label="รูปถ่าย (1.5 หรือ 2 นิ้ว)"
              hasDocument={!!registration.photoDoc}
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
                label="รูปถ่าย (1.5 / 2 นิ้ว)"
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

function DocumentStatusItem({ label, hasDocument }: { label: string; hasDocument: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 bg-white rounded">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-2">
        {hasDocument ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-600 font-medium">แนบแล้ว</span>
          </>
        ) : (
          <span className="text-xs text-gray-400">ยังไม่แนบ</span>
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
