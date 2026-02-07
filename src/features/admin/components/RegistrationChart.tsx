"use client";

import { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Registration } from "@/types";

interface RegistrationChartProps {
  registrations: Registration[];
}

type TimeRange = 'day' | 'week' | 'month';

export function RegistrationChart({ registrations }: RegistrationChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');

  const chartData = useMemo(() => {
    if (!registrations.length) return [];

    // จัดกลุ่มข้อมูลตามช่วงเวลา
    const groupedData = new Map<string, number>();

    registrations.forEach((reg) => {
      const date = new Date(reg.createdAt);
      let key: string;

      if (timeRange === 'day') {
        // รายวัน
        key = date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' });
      } else if (timeRange === 'week') {
        // รายสัปดาห์
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `สัปดาห์ ${weekStart.toLocaleDateString('th-TH', { day: '2-digit', month: 'short' })}`;
      } else {
        // รายเดือน
        key = date.toLocaleDateString('th-TH', { month: 'short', year: 'numeric' });
      }

      groupedData.set(key, (groupedData.get(key) || 0) + 1);
    });

    // แปลงเป็น array และเรียงตามวันที่
    const result = Array.from(groupedData.entries())
      .map(([period, count]) => ({ period, count }))
      .slice(-30); // แสดงข้อมูล 30 ช่วงล่าสุด

    console.log('Chart Data:', result);
    return result;
  }, [registrations, timeRange]);

  const chartConfig = {
    count: {
      label: "จำนวนการสมัคร",
      color: "hsl(32, 95%, 44%)",
    },
  } satisfies ChartConfig;

  const totalRegistrations = chartData.reduce((sum, item) => sum + item.count, 0);
  const averagePerPeriod = totalRegistrations > 0 ? (totalRegistrations / chartData.length).toFixed(1) : 0;

  return (
    <Card className="border-amber-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-amber-900">กราฟยอดการสมัคร</CardTitle>
            <CardDescription>
              แสดงจำนวนการสมัครเรียนตามช่วงเวลา
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('day')}
              className={timeRange === 'day' ? 'bg-amber-600' : 'border-amber-300'}
            >
              รายวัน
            </Button>
            <Button
              variant={timeRange === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('week')}
              className={timeRange === 'week' ? 'bg-amber-600' : 'border-amber-300'}
            >
              รายสัปดาห์
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange('month')}
              className={timeRange === 'month' ? 'bg-amber-600' : 'border-amber-300'}
            >
              รายเดือน
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <div className="text-xs text-gray-500 mb-2">
              แสดงข้อมูล {chartData.length} ช่วงเวลา จากทั้งหมด {registrations.length} รายการ
            </div>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 60,
                  right: 20,
                  top: 20,
                  bottom: 80,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: 'ช่วงเวลา', 
                    position: 'insideBottom', 
                    offset: -5,
                    style: { fontSize: 14, fontWeight: 600, fill: '#78350f' }
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={true}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                  allowDecimals={false}
                  label={{ 
                    value: 'จำนวนการสมัคร (คน)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: 14, fontWeight: 600, fill: '#78350f' }
                  }}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(120, 53, 15, 0.1)' }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(32, 95%, 44%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">ยอดรวม</p>
                <p className="text-2xl font-bold text-amber-900">{totalRegistrations}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  เฉลี่ยต่อ{timeRange === 'day' ? 'วัน' : timeRange === 'week' ? 'สัปดาห์' : 'เดือน'}
                </p>
                <p className="text-2xl font-bold text-amber-900">{averagePerPeriod}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">ไม่มีข้อมูลการสมัคร</p>
              <p className="text-sm">จำนวนการสมัครทั้งหมด: {registrations.length} รายการ</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
