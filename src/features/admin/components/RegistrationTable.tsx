"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { FileText } from "lucide-react";
import type { Registration } from "@/types";

interface RegistrationTableProps {
  registrations: Registration[];
  onViewDetails: (registration: Registration) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function RegistrationTable({ registrations, onViewDetails, onStatusChange }: RegistrationTableProps) {
  if (!Array.isArray(registrations) || registrations.length === 0) {
    return (
      <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-amber-900">รายการสมัครเรียน</CardTitle>
          <CardDescription>
            จัดการและอนุมัติการสมัครเรียนของผู้สมัคร
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-amber-600 py-8">ยังไม่มีการสมัครเรียน</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-amber-900">รายการสมัครเรียน</CardTitle>
        <CardDescription>
          จัดการและอนุมัติการสมัครเรียนของผู้สมัคร
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      <Badge className="bg-blue-100 text-blue-800 w-fit">
                        {reg.gradeLevel === 'm4' ? 'ม.4' : 'ม.1'}
                      </Badge>
                      {reg.isSpecialISM && (
                        <Badge className="bg-amber-100 text-amber-800 w-fit">ISM</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {reg.birthDate ? new Date(reg.birthDate).toLocaleDateString('th-TH') : '-'}
                  </TableCell>
                  <TableCell>{reg.phone}</TableCell>
                  <TableCell>{reg.province}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        reg.status === 'approved'
                          ? 'default'
                          : reg.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                      className={
                        reg.status === 'approved'
                          ? 'bg-green-100 text-green-900 hover:bg-green-200 hover:text-green-950'
                          : reg.status === 'rejected'
                          ? ''
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200 hover:text-amber-950'
                      }
                    >
                      {reg.status === 'pending' && 'รอดำเนินการ'}
                      {reg.status === 'approved' && 'อนุมัติ'}
                      {reg.status === 'rejected' && 'ปฏิเสธ'}
                    </Badge>
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
      </CardContent>
    </Card>
  );
}
