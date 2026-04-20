"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Unit {
  id: string;
  unitNumber: number;
  unitName: string;
  teachingLogs: TeachingLog[];
  plan: {
    assignment: {
      classGroup: string;
      subject: { subjectCode: string; subjectName: string };
    };
  };
}

interface TeachingLog {
  id: string;
  status: string;
  result: string | null;
  issues: string | null;
  improvement: string | null;
  studentWorkLink: string | null;
  attachmentLink: string | null;
}

interface Plan {
  id: string;
  status: string;
  assignment: {
    classGroup: string;
    subject: { subjectCode: string; subjectName: string };
  };
  units: (Unit & { teachingLogs: TeachingLog[] })[];
}

const logStatusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่บันทึก", color: "bg-gray-100 text-gray-600" },
  SUBMITTED: { text: "รอตรวจ", color: "bg-yellow-100 text-yellow-800" },
  REVISION_REQUIRED: { text: "ส่งกลับแก้ไข", color: "bg-red-100 text-red-800" },
  APPROVED: { text: "ผ่านการตรวจ", color: "bg-green-100 text-green-800" },
};

export default function TeacherLogsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<(Unit & { teachingLogs: TeachingLog[] }) | null>(null);
  const [form, setForm] = useState({ result: "", issues: "", improvement: "", studentWorkLink: "", attachmentLink: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/supervision/plans");
    if (res.ok) setPlans(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function selectUnit(unit: Unit & { teachingLogs: TeachingLog[] }) {
    setSelectedUnit(unit);
    const log = unit.teachingLogs[0];
    setForm({
      result: log?.result || "",
      issues: log?.issues || "",
      improvement: log?.improvement || "",
      studentWorkLink: log?.studentWorkLink || "",
      attachmentLink: log?.attachmentLink || "",
    });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUnit) return;
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/supervision/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId: selectedUnit.id, ...form }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setSelectedUnit(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-gray-500">กำลังโหลด...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">บันทึกหลังสอน</h1>

      {selectedUnit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              หน่วยที่ {selectedUnit.unitNumber}: {selectedUnit.unitName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>ผลการจัดการเรียนรู้</Label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-20 resize-y"
                  placeholder="สรุปผลการจัดการเรียนรู้ นักเรียนบรรลุจุดประสงค์หรือไม่ อย่างไร"
                  value={form.result}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>ปัญหา/อุปสรรค</Label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-16 resize-y"
                  placeholder="ปัญหาหรืออุปสรรคที่พบ (ถ้ามี)"
                  value={form.issues}
                  onChange={(e) => setForm({ ...form, issues: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>แนวทางแก้ไข/พัฒนา</Label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-16 resize-y"
                  placeholder="แนวทางแก้ไขหรือพัฒนาสำหรับครั้งต่อไป"
                  value={form.improvement}
                  onChange={(e) => setForm({ ...form, improvement: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>ลิงก์ผลงานนักเรียน (ถ้ามี)</Label>
                  <Input placeholder="https://..." value={form.studentWorkLink} onChange={(e) => setForm({ ...form, studentWorkLink: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>ลิงก์เอกสารแนบอื่น (ถ้ามี)</Label>
                  <Input placeholder="https://..." value={form.attachmentLink} onChange={(e) => setForm({ ...form, attachmentLink: e.target.value })} />
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "กำลังบันทึก..." : "บันทึกหลังสอน"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelectedUnit(null)}>ยกเลิก</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.filter((p) => p.units.length > 0).length === 0 ? (
            <p className="text-sm text-gray-500">กรุณาส่งแผนการสอนและกำหนดหน่วยการเรียนรู้ก่อน</p>
          ) : (
            plans.filter((p) => p.units.length > 0).map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">
                    {p.assignment.subject.subjectCode} — {p.assignment.subject.subjectName} ห้อง {p.assignment.classGroup}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {p.units.map((u) => {
                    const log = u.teachingLogs[0];
                    const s = log ? logStatusLabel[log.status] : logStatusLabel.NOT_SUBMITTED;
                    return (
                      <div key={u.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50">
                        <div>
                          <span className="text-sm">หน่วยที่ {u.unitNumber}: {u.unitName}</span>
                          {log?.result && (
                            <p className="text-xs text-gray-500 truncate max-w-xs">{log.result}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                          <Button size="sm" variant="outline" onClick={() => selectUnit(u)}>
                            {log ? "แก้ไข" : "บันทึก"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
