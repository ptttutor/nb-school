"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, Clock, XCircle } from "lucide-react";
import { RegistrationChart } from "./RegistrationChart";
import type { Registration } from "@/types";

interface RegistrationStatsProps {
  totalCount: number;
  registrations: Registration[];
}

export function RegistrationStats({ totalCount, registrations }: RegistrationStatsProps) {
  // คำนวณสถิติ
  const stats = {
    total: totalCount,
    pending: registrations.filter(r => r.status === 'pending').length,
    approved: registrations.filter(r => r.status === 'approved').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
    m1: registrations.filter(r => r.gradeLevel === 'm1').length,
    m4: registrations.filter(r => r.gradeLevel === 'm4').length,
    ism: registrations.filter(r => r.isSpecialISM).length,
    regular: registrations.filter(r => !r.isSpecialISM).length,
  };

  const statCards = [
    {
      title: "ทั้งหมด",
      value: stats.total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "รอดำเนินการ",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "อนุมัติ",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "ปฏิเสธ",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* สถิติหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-amber-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.value > 0 
                    ? `${((stat.value / stats.total) * 100).toFixed(1)}% ของทั้งหมด`
                    : 'ไม่มีข้อมูล'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* สถิติเพิ่มเติม */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">ม.1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.m1}</div>
            <p className="text-xs text-gray-500 mt-1">มัธยมศึกษาปีที่ 1</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">ม.4</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.m4}</div>
            <p className="text-xs text-gray-500 mt-1">มัธยมศึกษาปีที่ 4</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">โครงการปกติ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{stats.regular}</div>
            <p className="text-xs text-gray-500 mt-1">ห้องเรียนปกติ</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-700">ISM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.ism}</div>
            <p className="text-xs text-gray-500 mt-1">โครงการพิเศษ ISM</p>
          </CardContent>
        </Card>
      </div>

      {/* กราฟยอดการสมัคร */}
      <RegistrationChart registrations={registrations} />
    </div>
  );
}
