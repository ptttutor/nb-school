"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FileText, ChevronLeft, ChevronRight, Trash2, Download, Settings } from "lucide-react";
import type { Registration } from "@/types";

interface RegistrationTableProps {
  registrations: Registration[];
  onViewDetails: (registration: Registration) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
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
  onDelete,
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
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    gradeLevel: 'all' as string,
    status: 'all' as string,
    dateRange: 'all' as string,
    dateFrom: '',
    dateTo: '',
    includeDocuments: true,
  });

  const exportToExcel = async () => {
    setIsExporting(true);
    setShowExportDialog(false);
    try {
      // Build query based on export options
      const useGradeLevel = exportOptions.gradeLevel;
      const useStatus = exportOptions.status;
      
      // Fetch all registrations without pagination
      const response = await fetch(
        `/api/admin/registrations?page=1&limit=99999&status=${useStatus}&gradeLevel=${useGradeLevel}&search=`
      );
      
      if (!response.ok) throw new Error('Failed to fetch data');
      
      const data = await response.json();
      let allRegistrations = data.registrations || [];
      
      // Filter by date range if specified
      if (exportOptions.dateRange === 'custom' && exportOptions.dateFrom) {
        allRegistrations = allRegistrations.filter((reg: Registration) => {
          const regDate = new Date(reg.createdAt);
          const fromDate = new Date(exportOptions.dateFrom);
          const toDate = exportOptions.dateTo ? new Date(exportOptions.dateTo) : new Date();
          return regDate >= fromDate && regDate <= toDate;
        });
      } else if (exportOptions.dateRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        allRegistrations = allRegistrations.filter((reg: Registration) => {
          const regDate = new Date(reg.createdAt);
          regDate.setHours(0, 0, 0, 0);
          return regDate.getTime() === today.getTime();
        });
      } else if (exportOptions.dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        allRegistrations = allRegistrations.filter((reg: Registration) => 
          new Date(reg.createdAt) >= weekAgo
        );
      } else if (exportOptions.dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        allRegistrations = allRegistrations.filter((reg: Registration) => 
          new Date(reg.createdAt) >= monthAgo
        );
      }

      // Prepare export metadata
      const exportDate = new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const statusText = useStatus === 'all' ? 'ทุกสถานะ' : 
                        useStatus === 'pending' ? 'รอดำเนินการ' :
                        useStatus === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ';
      
      const gradeLevelText = useGradeLevel === 'all' ? 'ทุกระดับชั้น' :
                            useGradeLevel === 'm1' ? 'ม.1' : 'ม.4';
      
      const dateRangeText = exportOptions.dateRange === 'all' ? 'ทั้งหมด' :
                           exportOptions.dateRange === 'today' ? 'วันนี้' :
                           exportOptions.dateRange === 'week' ? '7 วันที่ผ่านมา' :
                           exportOptions.dateRange === 'month' ? '30 วันที่ผ่านมา' :
                           `${exportOptions.dateFrom} ถึง ${exportOptions.dateTo || 'วันนี้'}`;

      // Prepare data for Excel
      // Determine which grade levels are present
      const hasM1 = allRegistrations.some((r: Registration) => r.gradeLevel === 'm1');
      const hasM4 = allRegistrations.some((r: Registration) => r.gradeLevel === 'm4');
      const isMixed = hasM1 && hasM4;

      const excelData = allRegistrations.map((reg: Registration, index: number) => {
        const baseData: any = {
          'ลำดับ': index + 1,
          'รหัสผู้สมัคร': reg.id,
          'เลขบัตรประชาชน/Passport': reg.idCardOrPassport || '-',
          'ISM': reg.isSpecialISM ? 'ใช่' : 'ไม่ใช่',
          'ระดับชั้น': reg.gradeLevel === 'm4' ? 'ม.4' : 'ม.1',
          'คำนำหน้า': reg.title,
          'ชื่อ': reg.firstNameTH,
          'นามสกุล': reg.lastNameTH,
          'วันเกิด': reg.birthDate ? new Date(reg.birthDate).toLocaleDateString('th-TH') : '-',
          'เชื้อชาติ': reg.ethnicity,
          'สัญชาติ': reg.nationality,
          'ศาสนา': reg.religion,
          'เบอร์โทร': reg.phone,
          'จำนวนพี่น้อง': reg.siblings || '-',
          'พี่น้องในโรงเรียน': reg.siblingsInSchool || '-',
          'สถานะการศึกษา': reg.educationStatus || '-',
          'โรงเรียน': reg.schoolName || '-',
          'จังหวัดโรงเรียน': reg.schoolProvince || '-',
          'อำเภอโรงเรียน': reg.schoolDistrict || '-',
          'ตำบลโรงเรียน': reg.schoolSubdistrict || '-',
          'ชื่อหมู่บ้าน': reg.villageName || '-',
          'บ้านเลขที่': reg.houseNumber,
          'หมู่ที่': reg.moo || '-',
          'ถนน': reg.road || '-',
          'ซอย': reg.soi || '-',
          'จังหวัด': reg.province,
          'อำเภอ': reg.district,
          'ตำบล': reg.subdistrict,
          'รหัสไปรษณีย์': reg.postalCode,
        };

        // Add grade-specific fields based on what's present in the data
        if (isMixed) {
          // If mixed, include all columns but fill based on grade level
          baseData['GPA รวม ป.4-5'] = reg.gradeLevel === 'm1' ? (reg.cumulativeGPAP4P5 || '-') : '-';
          baseData['GPA วิทยาศาสตร์ ป.4-5'] = reg.gradeLevel === 'm1' ? (reg.scienceCumulativeP4P5 || '-') : '-';
          baseData['GPA คณิตศาสตร์ ป.4-5'] = reg.gradeLevel === 'm1' ? (reg.mathCumulativeP4P5 || '-') : '-';
          baseData['GPA ภาษาอังกฤษ ป.4-5'] = reg.gradeLevel === 'm1' ? (reg.englishCumulativeP4P5 || '-') : '-';
          baseData['GPA รวม ม.1-3'] = reg.gradeLevel === 'm4' ? (reg.cumulativeGPAM1M3 || '-') : '-';
          baseData['GPA วิทยาศาสตร์ ม.1-3'] = reg.gradeLevel === 'm4' ? (reg.scienceCumulativeM1M3 || '-') : '-';
          baseData['GPA คณิตศาสตร์ ม.1-3'] = reg.gradeLevel === 'm4' ? (reg.mathCumulativeM1M3 || '-') : '-';
          baseData['GPA ภาษาอังกฤษ ม.1-3'] = reg.gradeLevel === 'm4' ? (reg.englishCumulativeM1M3 || '-') : '-';
        } else if (hasM1) {
          // Only M1 students - only include M1 grade columns
          baseData['GPA รวม ป.4-5'] = reg.cumulativeGPAP4P5 || '-';
          baseData['GPA วิทยาศาสตร์ ป.4-5'] = reg.scienceCumulativeP4P5 || '-';
          baseData['GPA คณิตศาสตร์ ป.4-5'] = reg.mathCumulativeP4P5 || '-';
          baseData['GPA ภาษาอังกฤษ ป.4-5'] = reg.englishCumulativeP4P5 || '-';
        } else if (hasM4) {
          // Only M4 students - only include M4 grade columns
          baseData['GPA รวม ม.1-3'] = reg.cumulativeGPAM1M3 || '-';
          baseData['GPA วิทยาศาสตร์ ม.1-3'] = reg.scienceCumulativeM1M3 || '-';
          baseData['GPA คณิตศาสตร์ ม.1-3'] = reg.mathCumulativeM1M3 || '-';
          baseData['GPA ภาษาอังกฤษ ม.1-3'] = reg.englishCumulativeM1M3 || '-';
        }

        // Add document and status fields
        baseData['เอกสารทะเบียนบ้าน'] = reg.houseRegistrationDoc || '-';
        baseData['เอกสารผลการเรียน'] = reg.transcriptDoc || '-';
        baseData['เอกสารรูปถ่าย'] = reg.photoDoc || '-';
        baseData['สถานะ'] = reg.status === 'approved' ? 'อนุมัติ' : reg.status === 'rejected' ? 'ปฏิเสธ' : 'รอดำเนินการ';
        baseData['วันที่สมัคร'] = new Date(reg.createdAt).toLocaleString('th-TH');
        baseData['วันที่อัพเดท'] = new Date(reg.updatedAt).toLocaleString('th-TH');

        return baseData;
      });

      // Create header information
      const headerInfo = [
        ['รายงานการสมัครเรียน โรงเรียนนวมินทราชูทิศ บดินทรเดชา'],
        [''],
        ['วันที่ Export:', exportDate],
        ['ระดับชั้นที่กรอง:', gradeLevelText],
        ['สถานะที่กรอง:', statusText],
        ['ช่วงเวลาที่กรอง:', dateRangeText],
        ['จำนวนรายการทั้งหมด:', `${allRegistrations.length} รายการ`],
        [''],
      ];

      // Create workbook
      const workbook = XLSX.utils.book_new();
      
      // Create worksheet with header
      const worksheet = XLSX.utils.aoa_to_sheet(headerInfo);
      
      // Append data starting from row after header
      XLSX.utils.sheet_add_json(worksheet, excelData, { 
        origin: `A${headerInfo.length + 1}`,
        skipHeader: false 
      });
      
      // Set column widths based on actual columns
      const baseColWidths = [
        { wch: 8 },  // ลำดับ
        { wch: 25 }, // รหัส
        { wch: 18 }, // บัตร
        { wch: 8 },  // ISM
        { wch: 12 }, // ระดับชั้น
        { wch: 10 }, // คำนำหน้า
        { wch: 15 }, // ชื่อ
        { wch: 15 }, // นามสกุล
        { wch: 15 }, // วันเกิด
        { wch: 12 }, // เชื้อชาติ
        { wch: 12 }, // สัญชาติ
        { wch: 12 }, // ศาสนา
        { wch: 12 }, // เบอร์
        { wch: 10 }, // พี่น้อง
        { wch: 15 }, // พี่น้องในโรงเรียน
        { wch: 15 }, // สถานะการศึกษา
        { wch: 30 }, // โรงเรียน
        { wch: 15 }, // จังหวัดโรงเรียน
        { wch: 15 }, // อำเภอโรงเรียน
        { wch: 15 }, // ตำบลโรงเรียน
        { wch: 15 }, // ชื่อหมู่บ้าน
        { wch: 12 }, // บ้านเลขที่
        { wch: 8 },  // หมู่
        { wch: 15 }, // ถนน
        { wch: 15 }, // ซอย
        { wch: 15 }, // จังหวัด
        { wch: 15 }, // อำเภอ
        { wch: 15 }, // ตำบล
        { wch: 12 }, // รหัสไปรษณีย์
      ];

      // Use the same hasM1/hasM4 determined earlier
      let gradeColWidths: any[] = [];
      if (hasM1 && !hasM4) {
        // Only M1 students
        gradeColWidths = [
          { wch: 15 }, // ผลการเรียน ป.4
          { wch: 15 }, // ผลการเรียน ป.5
        ];
      } else if (hasM4 && !hasM1) {
        // Only M4 students
        gradeColWidths = [
          { wch: 15 }, // GPA รวม ม.1-3
          { wch: 20 }, // GPA วิทยาศาสตร์ ม.1-3
          { wch: 20 }, // GPA คณิตศาสตร์ ม.1-3
          { wch: 20 }, // GPA ภาษาอังกฤษ ม.1-3
        ];
      } else if (hasM1 && hasM4) {
        // Mixed - include both
        gradeColWidths = [
          { wch: 15 }, // ผลการเรียน ป.4
          { wch: 15 }, // ผลการเรียน ป.5
          { wch: 15 }, // GPA รวม ม.1-3
          { wch: 20 }, // GPA วิทยาศาสตร์ ม.1-3
          { wch: 20 }, // GPA คณิตศาสตร์ ม.1-3
          { wch: 20 }, // GPA ภาษาอังกฤษ ม.1-3
        ];
      }

      const documentColWidths = [
        { wch: 50 }, // เอกสารทะเบียนบ้าน
        { wch: 50 }, // เอกสารผลการเรียน
        { wch: 50 }, // เอกสารรูปถ่าย
        { wch: 15 }, // สถานะ
        { wch: 20 }, // วันที่สมัคร
        { wch: 20 }, // วันที่อัพเดท
      ];

      const colWidths = [...baseColWidths, ...gradeColWidths, ...documentColWidths];
      worksheet['!cols'] = colWidths;
      
      // Merge cells for title
      if (!worksheet['!merges']) worksheet['!merges'] = [];
      worksheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }); // Merge title row

      // Add to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'รายการสมัคร');
      
      // Create summary sheet
      const summaryData = [
        ['สรุปข้อมูลการสมัครเรียน'],
        [''],
        ['วันที่ Export:', exportDate],
        [''],
        ['เงื่อนไขการกรอง'],
        ['ระดับชั้น:', gradeLevelText],
        ['สถานะ:', statusText],
        ['ช่วงเวลา:', dateRangeText],
        [''],
        ['สรุปจำนวน'],
        ['จำนวนรายการทั้งหมด:', `${allRegistrations.length} รายการ`],
        [''],
        ['สถิติตามระดับชั้น'],
        ['ม.1:', `${allRegistrations.filter((r: Registration) => r.gradeLevel === 'm1').length} รายการ`],
        ['ม.4:', `${allRegistrations.filter((r: Registration) => r.gradeLevel === 'm4').length} รายการ`],
        [''],
        ['สถิติตามสถานะ'],
        ['รอดำเนินการ:', `${allRegistrations.filter((r: Registration) => r.status === 'pending').length} รายการ`],
        ['อนุมัติ:', `${allRegistrations.filter((r: Registration) => r.status === 'approved').length} รายการ`],
        ['ปฏิเสธ:', `${allRegistrations.filter((r: Registration) => r.status === 'rejected').length} รายการ`],
        [''],
        ['สถิติ ISM'],
        ['สมัครแบบ ISM:', `${allRegistrations.filter((r: Registration) => r.isSpecialISM).length} รายการ`],
        ['สมัครแบบทั่วไป:', `${allRegistrations.filter((r: Registration) => !r.isSpecialISM).length} รายการ`],
      ];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet['!cols'] = [{ wch: 25 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'สรุปข้อมูล');

      // Generate detailed filename
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = new Date().toTimeString().slice(0, 5).replace(/:/g, '');
      let filename = `รายการสมัคร_${timestamp}_${timeStr}`;
      
      if (useGradeLevel !== 'all') {
        filename += `_${useGradeLevel.toUpperCase()}`;
      }
      if (useStatus !== 'all') {
        filename += `_${useStatus}`;
      }
      if (exportOptions.dateRange !== 'all') {
        filename += `_${exportOptions.dateRange}`;
      }
      filename += '.xlsx';

      // Download file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error('Export error:', error);
      alert('เกิดข้อผิดพลาดในการ Export ข้อมูล');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteId && onDelete) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

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
            <Button
              onClick={exportToExcel}
              disabled={isExporting}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  กำลัง Export...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </>
              )}
            </Button>
          </div>
          
          <p className="text-center text-amber-600 py-8">ไม่พบข้อมูลการสมัครเรียน</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
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
          <Button
            onClick={() => setShowExportDialog(true)}
            disabled={isExporting}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
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
                <TableHead>โรงเรียน</TableHead>
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
                  <TableCell className="max-w-[200px] truncate">
                    {reg.schoolName || '-'}
                  </TableCell>
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(reg.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

    <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? 
            <br />
            <span className="text-red-600 font-semibold">ข้อมูลจะถูกลบออกจากฐานข้อมูลถาวรและไม่สามารถกู้คืนได้</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDeleteConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            ลบข้อมูล
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amber-900 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            ตั้งค่าการ Export ข้อมูล
          </DialogTitle>
          <DialogDescription>
            เลือกเงื่อนไขและรูปแบบข้อมูลที่ต้องการ Export
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Grade Level */}
          <div className="space-y-2">
            <Label className="text-amber-900 font-semibold">ระดับชั้น</Label>
            <Select 
              value={exportOptions.gradeLevel} 
              onValueChange={(value) => setExportOptions({...exportOptions, gradeLevel: value})}
            >
              <SelectTrigger className="border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกระดับชั้น</SelectItem>
                <SelectItem value="m1">ม.1</SelectItem>
                <SelectItem value="m4">ม.4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-amber-900 font-semibold">สถานะ</Label>
            <Select 
              value={exportOptions.status} 
              onValueChange={(value) => setExportOptions({...exportOptions, status: value})}
            >
              <SelectTrigger className="border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="pending">รอดำเนินการ</SelectItem>
                <SelectItem value="approved">อนุมัติ</SelectItem>
                <SelectItem value="rejected">ปฏิเสธ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="text-amber-900 font-semibold">ช่วงเวลา</Label>
            <Select 
              value={exportOptions.dateRange} 
              onValueChange={(value) => setExportOptions({...exportOptions, dateRange: value})}
            >
              <SelectTrigger className="border-amber-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="today">วันนี้</SelectItem>
                <SelectItem value="week">7 วันที่ผ่านมา</SelectItem>
                <SelectItem value="month">30 วันที่ผ่านมา</SelectItem>
                <SelectItem value="custom">กำหนดเอง</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {exportOptions.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-amber-900">วันที่เริ่มต้น</Label>
                <Input
                  type="date"
                  value={exportOptions.dateFrom}
                  onChange={(e) => setExportOptions({...exportOptions, dateFrom: e.target.value})}
                  className="border-amber-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-amber-900">วันที่สิ้นสุด</Label>
                <Input
                  type="date"
                  value={exportOptions.dateTo}
                  onChange={(e) => setExportOptions({...exportOptions, dateTo: e.target.value})}
                  className="border-amber-200"
                />
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-900 font-semibold mb-2">สรุปข้อมูลที่จะ Export:</p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• ระดับชั้น: {exportOptions.gradeLevel === 'all' ? 'ทุกระดับชั้น' : exportOptions.gradeLevel === 'm1' ? 'ม.1' : 'ม.4'}</li>
              <li>• สถานะ: {exportOptions.status === 'all' ? 'ทุกสถานะ' : exportOptions.status === 'pending' ? 'รอดำเนินการ' : exportOptions.status === 'approved' ? 'อนุมัติ' : 'ปฏิเสธ'}</li>
              <li>• ช่วงเวลา: {
                exportOptions.dateRange === 'all' ? 'ทั้งหมด' :
                exportOptions.dateRange === 'today' ? 'วันนี้' :
                exportOptions.dateRange === 'week' ? '7 วันที่ผ่านมา' :
                exportOptions.dateRange === 'month' ? '30 วันที่ผ่านมา' :
                `${exportOptions.dateFrom || '-'} ถึง ${exportOptions.dateTo || 'วันนี้'}`
              }</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowExportDialog(false)}
            className="border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={exportToExcel}
            disabled={isExporting || (exportOptions.dateRange === 'custom' && !exportOptions.dateFrom)}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            {isExporting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                กำลัง Export...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export ทันที
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
