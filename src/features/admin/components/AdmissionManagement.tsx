"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Settings, Calendar, FileText, Bell, CheckCircle, XCircle } from "lucide-react";

interface AdmissionSettings {
  id: string;
  gradeLevel: string;
  isOpen: boolean;
  startDate: string | null;
  endDate: string | null;
  schedule: string | null;
  requirements: string | null;
  announcement: string | null;
  allowISM: boolean;
  allowRegular: boolean;
}

export function AdmissionManagement() {
  const [m1Settings, setM1Settings] = useState<AdmissionSettings | null>(null);
  const [m4Settings, setM4Settings] = useState<AdmissionSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"m1" | "m4">("m1");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const [m1Response, m4Response] = await Promise.all([
        fetch("/api/admission?gradeLevel=m1"),
        fetch("/api/admission?gradeLevel=m4"),
      ]);

      if (m1Response.ok) {
        const m1Data = await m1Response.json();
        setM1Settings(m1Data);
      }

      if (m4Response.ok) {
        const m4Data = await m4Response.json();
        setM4Settings(m4Data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (gradeLevel: "m1" | "m4") => {
    setSaving(true);
    setMessage("");

    const settings = gradeLevel === "m1" ? m1Settings : m4Settings;
    if (!settings) return;

    try {
      const response = await fetch("/api/admission", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        setMessage("บันทึกการตั้งค่าสำเร็จ");
        await fetchSettings();
      } else {
        setMessage("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (gradeLevel: "m1" | "m4", field: string, value: any) => {
    if (gradeLevel === "m1" && m1Settings) {
      setM1Settings({ ...m1Settings, [field]: value });
    } else if (gradeLevel === "m4" && m4Settings) {
      setM4Settings({ ...m4Settings, [field]: value });
    }
  };

  const currentSettings = activeTab === "m1" ? m1Settings : m4Settings;

  if (loading) {
    return <div className="p-6">กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-amber-700" />
            <div>
              <CardTitle className="text-2xl">การจัดการรับสมัคร</CardTitle>
              <CardDescription>ตั้งค่าการเปิด-ปิดรับสมัคร กำหนดการ และข้อกำหนดต่างๆ</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "m1" ? "default" : "outline"}
          onClick={() => setActiveTab("m1")}
          className={activeTab === "m1" ? "bg-blue-600" : ""}
        >
          มัธยมศึกษาปีที่ 1
        </Button>
        <Button
          variant={activeTab === "m4" ? "default" : "outline"}
          onClick={() => setActiveTab("m4")}
          className={activeTab === "m4" ? "bg-green-600" : ""}
        >
          มัธยมศึกษาปีที่ 4
        </Button>
      </div>

      {message && (
        <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded">
          {message}
        </div>
      )}

      {currentSettings && (
        <div className="space-y-6">
          {/* สถานะการรับสมัคร */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {currentSettings.isOpen ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                สถานะการรับสมัคร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant={currentSettings.isOpen ? "default" : "outline"}
                  onClick={() => updateSettings(activeTab, "isOpen", true)}
                  className={currentSettings.isOpen ? "bg-green-600" : ""}
                >
                  เปิดรับสมัคร
                </Button>
                <Button
                  variant={!currentSettings.isOpen ? "default" : "outline"}
                  onClick={() => updateSettings(activeTab, "isOpen", false)}
                  className={!currentSettings.isOpen ? "bg-red-600" : ""}
                >
                  ปิดรับสมัคร
                </Button>
                <Badge variant={currentSettings.isOpen ? "default" : "secondary"}>
                  {currentSettings.isOpen ? "เปิดรับสมัคร" : "ปิดรับสมัคร"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* ช่วงเวลารับสมัคร */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                ช่วงเวลารับสมัคร
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">วันเริ่มรับสมัคร</Label>
                  <DateTimePicker
                    date={currentSettings.startDate ? new Date(currentSettings.startDate) : undefined}
                    setDate={(date) => updateSettings(activeTab, "startDate", date?.toISOString())}
                    placeholder="เลือกวันเริ่มรับสมัคร"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">วันปิดรับสมัคร</Label>
                  <DateTimePicker
                    date={currentSettings.endDate ? new Date(currentSettings.endDate) : undefined}
                    setDate={(date) => updateSettings(activeTab, "endDate", date?.toISOString())}
                    placeholder="เลือกวันปิดรับสมัคร"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ประเภทห้องเรียนที่อนุญาต */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ประเภทห้องเรียนที่เปิดรับ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSettings.allowISM}
                  onChange={(e) => updateSettings(activeTab, "allowISM", e.target.checked)}
                  className="w-4 h-4"
                />
                <span>ห้องเรียนพิเศษ ISM (Intensive Science and Mathematics)</span>
                <Badge className="bg-amber-600">ISM</Badge>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentSettings.allowRegular}
                  onChange={(e) => updateSettings(activeTab, "allowRegular", e.target.checked)}
                  className="w-4 h-4"
                />
                <span>ห้องเรียนทั่วไป</span>
              </label>
            </CardContent>
          </Card>

          {/* กำหนดการ */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                กำหนดการ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                rows={6}
                className="w-full p-3 border rounded-md"
                placeholder="เช่น:&#10;- รับสมัคร: 4-12 กุมภาพันธ์ 2569&#10;- ประกาศผล: 16 กุมภาพันธ์ 2569&#10;- สอบคัดเลือก: 22 กุมภาพันธ์ 2569"
                value={currentSettings.schedule || ""}
                onChange={(e) => updateSettings(activeTab, "schedule", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* ข้อกำหนด */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                ข้อกำหนด/คุณสมบัติผู้สมัคร
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                rows={6}
                className="w-full p-3 border rounded-md"
                placeholder="เช่น:&#10;- สำเร็จการศึกษาชั้น ป.6 หรือเทียบเท่า&#10;- มีเกรดเฉลี่ยวิชาคณิตศาสตร์และวิทยาศาสตร์ไม่ต่ำกว่า 3.00"
                value={currentSettings.requirements || ""}
                onChange={(e) => updateSettings(activeTab, "requirements", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* ประกาศ/รายละเอียด */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                ประกาศ/รายละเอียดเพิ่มเติม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                rows={6}
                className="w-full p-3 border rounded-md"
                placeholder="ข้อมูลเพิ่มเติมหรือประกาศสำคัญที่ต้องการแจ้งผู้สมัคร"
                value={currentSettings.announcement || ""}
                onChange={(e) => updateSettings(activeTab, "announcement", e.target.value)}
              />
            </CardContent>
          </Card>

          {/* ปุ่มบันทึก */}
          <div className="flex justify-end">
            <Button
              onClick={() => handleSave(activeTab)}
              disabled={saving}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {saving ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
