"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, FileCheck } from "lucide-react";
import type { Registration } from "@/types";

interface ApplicantsListProps {
  registrations: Registration[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  gradeLevelFilter: string;
  onGradeLevelFilterChange: (gradeLevel: string) => void;
}

export function ApplicantsList({
  registrations,
  loading,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  gradeLevelFilter,
  onGradeLevelFilterChange,
}: ApplicantsListProps) {
  const hasAllDocuments = (reg: Registration) => {
    return reg.photoDoc && reg.houseRegistrationDoc && reg.transcriptDoc;
  };

  const getMissingDocuments = (reg: Registration) => {
    const missing = [];
    if (!reg.photoDoc) missing.push("รูปถ่าย");
    if (!reg.houseRegistrationDoc) missing.push("ทะเบียนบ้าน");
    if (!reg.transcriptDoc) missing.push("ผลการเรียน");
    return missing;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-amber-700">กำลังโหลดข้อมูล...</div>
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="text-center py-12">
        <p className="text-amber-600">ไม่พบข้อมูลผู้สมัคร</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">กรองตามระดับชั้น:</span>
          <Select value={gradeLevelFilter} onValueChange={onGradeLevelFilterChange}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="ทุกระดับชั้น" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกระดับชั้น</SelectItem>
              <SelectItem value="m1">ม.1</SelectItem>
              <SelectItem value="m4">ม.4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-gray-600">
          ทั้งหมด {totalCount} รายการ
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-amber-200">
              <TableHead className="w-[60px]">ลำดับ</TableHead>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              <TableHead>ระดับชั้น</TableHead>
              <TableHead>โรงเรียน</TableHead>
              <TableHead>จังหวัด</TableHead>
              <TableHead>เบอร์โทร</TableHead>
              <TableHead>สถานะเอกสาร</TableHead>
              <TableHead>วันที่สมัคร</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((reg, index) => {
              const hasAllDocs = hasAllDocuments(reg);
              const missingDocs = getMissingDocuments(reg);
              const rowNumber = (currentPage - 1) * 20 + index + 1;

              return (
                <TableRow key={reg.id} className="border-amber-100">
                  <TableCell className="font-medium text-gray-600">
                    {rowNumber}
                  </TableCell>
                  <TableCell className="font-medium">
                    {reg.title} {reg.firstNameTH} {reg.lastNameTH}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                        {reg.gradeLevel === "m4" ? "ม.4" : "ม.1"}
                      </div>
                      {reg.isSpecialISM && (
                        <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800">
                          ISM
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {reg.schoolName || "-"}
                  </TableCell>
                  <TableCell>{reg.province}</TableCell>
                  <TableCell>{reg.phone}</TableCell>
                  <TableCell>
                    {hasAllDocs ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">ครบถ้วน</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">ไม่ครบ</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          ขาด: {missingDocs.join(", ")}
                        </div>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(reg.createdAt).toLocaleDateString("th-TH", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-amber-200">
          <div className="text-sm text-gray-600">
            หน้า {currentPage} จาก {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-amber-300"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              ก่อนหน้า
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-amber-300"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Summary */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-amber-900">{totalCount}</div>
              <div className="text-sm text-gray-600">ผู้สมัครทั้งหมด</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {registrations.filter(hasAllDocuments).length}
              </div>
              <div className="text-sm text-gray-600">เอกสารครบถ้วน</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {registrations.filter((r) => !hasAllDocuments(r)).length}
              </div>
              <div className="text-sm text-gray-600">เอกสารไม่ครบ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
