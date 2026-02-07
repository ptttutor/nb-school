"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FileText, ChevronLeft, ChevronRight } from "lucide-react";
import type { Registration } from "@/types";

interface RegistrationTableProps {
  registrations: Registration[];
  onViewDetails: (registration: Registration) => void;
  onStatusChange: (id: string, status: string) => void;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  gradeLevelFilter: string;
  onGradeLevelFilterChange: (gradeLevel: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function RegistrationTable({ 
  registrations, 
  onViewDetails, 
  onStatusChange,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  statusFilter,
  onStatusFilterChange,
  gradeLevelFilter,
  onGradeLevelFilterChange,
  searchQuery,
  onSearchQueryChange,
}: RegistrationTableProps) {
  if (!Array.isArray(registrations) || registrations.length === 0) {
    return (
      <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-amber-900">รายการสมัครเรียน</CardTitle>
          <CardDescription>
            จัดการและอนุมัติการสมัครเรียนของผู้สมัคร (ทั้งหมด {totalCount} รายการ)
          </CardDescription>
        </CardHeader>
        
        {/* Filter Controls */}
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="ค้นหาชื่อ-นามสกุล หรือเบอร์โทร..."
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                className="border-amber-200"
              />
            </div>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-[180px] border-amber-200">
                <SelectValue placeholder="ทุกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="pending">รอดำเนินการ</SelectItem>
                <SelectItem value="approved">อนุมัติ</SelectItem>
                <SelectItem value="rejected">ปฏิเสธ</SelectItem>
              </SelectContent>
            </Select>
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
          
          <p className="text-center text-amber-600 py-8">ไม่พบข้อมูลการสมัครเรียน</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-amber-900">รายการสมัครเรียน</CardTitle>
        <CardDescription>
          จัดการและอนุมัติการสมัครเรียนของผู้สมัคร (ทั้งหมด {totalCount} รายการ)
        </CardDescription>
      </CardHeader>
      
      {/* Filter Controls */}
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap mb-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="ค้นหาชื่อ-นามสกุล หรือเบอร์โทร..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="border-amber-200"
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[180px] border-amber-200">
              <SelectValue placeholder="ทุกสถานะ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสถานะ</SelectItem>
              <SelectItem value="pending">รอดำเนินการ</SelectItem>
              <SelectItem value="approved">อนุมัติ</SelectItem>
              <SelectItem value="rejected">ปฏิเสธ</SelectItem>
            </SelectContent>
          </Select>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-amber-200">
                <TableHead>คำนำหน้า</TableHead>
                <TableHead>ชื่อ-นามสกุล</TableHead>
                <TableHead>ระดับชั้น</TableHead>
                <TableHead>วันเกิด</TableHead>
                <TableHead>เบอร์โทร</TableHead>
                <TableHead>จังหวัด</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg) => (
                <TableRow key={reg.id} className="border-amber-100">
                  <TableCell className="font-medium">
                    {reg.title}
                  </TableCell>
                  <TableCell className="font-medium">
                    {reg.firstNameTH} {reg.lastNameTH}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 w-fit">
                        {reg.gradeLevel === 'm4' ? 'ม.4' : 'ม.1'}
                      </div>
                      {reg.isSpecialISM && (
                        <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 w-fit">ISM</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {reg.birthDate ? new Date(reg.birthDate).toLocaleDateString('th-TH') : '-'}
                  </TableCell>
                  <TableCell>{reg.phone}</TableCell>
                  <TableCell>{reg.province}</TableCell>
                  <TableCell>
                    {reg.status === 'approved' && (
                      <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-900">
                        อนุมัติ
                      </div>
                    )}
                    {reg.status === 'rejected' && (
                      <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-900">
                        ปฏิเสธ
                      </div>
                    )}
                    {reg.status === 'pending' && (
                      <div className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-900">
                        รอดำเนินการ
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(reg.createdAt).toLocaleDateString('th-TH')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(reg)}
                        className="border-amber-300"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                      <Select
                        value={reg.status}
                        onValueChange={(value) => onStatusChange(reg.id, value)}
                      >
                        <SelectTrigger className="w-32 border-amber-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">รอดำเนินการ</SelectItem>
                          <SelectItem value="approved">อนุมัติ</SelectItem>
                          <SelectItem value="rejected">ปฏิเสธ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-200">
          <div className="text-sm text-amber-700">
            แสดง {registrations.length} รายการจาก {totalCount} รายการทั้งหมด
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-amber-300 text-amber-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              ก่อนหน้า
            </Button>
            <div className="text-sm text-amber-700 px-4">
              หน้า {currentPage} จาก {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-amber-300 text-amber-700 disabled:opacity-50"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
