"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Assignment {
  id: string;
  classGroup: string;
  subject: { subjectCode: string; subjectName: string; gradeLevel: string; subjectGroup: { name: string } | null };
  semester: { year: number; semester: number };
  teachingPlan: {
    id: string;
    driveLink: string | null;
    status: string;
    units: { id: string; unitNumber: number; unitName: string }[];
  } | null;
}

const statusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่ส่ง", color: "bg-gray-100 text-gray-600" },
  SUBMITTED: { text: "รอตรวจ", color: "bg-yellow-100 text-yellow-800" },
  REVISION_REQUIRED: { text: "ส่งกลับแก้ไข", color: "bg-red-100 text-red-800" },
  APPROVED: { text: "ผ่านการตรวจ", color: "bg-green-100 text-green-800" },
};

export default function TeacherPlansPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [form, setForm] = useState({ driveLink: "", units: [{ unitName: "" }] });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/supervision/admin/assignments?my=true");
    if (res.ok) setAssignments(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function selectAssignment(a: Assignment) {
    setSelected(a);
    setError("");
    if (a.teachingPlan) {
      setForm({
        driveLink: a.teachingPlan.driveLink || "",
        units: a.teachingPlan.units.length > 0
          ? a.teachingPlan.units.map((u) => ({ unitName: u.unitName }))
          : [{ unitName: "" }],
      });
    } else {
      setForm({ driveLink: "", units: [{ unitName: "" }] });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setError("");
    setSaving(true);

    const filteredUnits = form.units.filter((u) => u.unitName.trim());

    try {
      if (selected.teachingPlan) {
        // อัปเดต
        const res = await fetch(`/api/supervision/plans/${selected.teachingPlan.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ driveLink: form.driveLink, units: filteredUnits }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      } else {
        // สร้างใหม่
        const res = await fetch("/api/supervision/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assignmentId: selected.id, driveLink: form.driveLink, units: filteredUnits }),
        });
        if (!res.ok) throw new Error((await res.json()).error);
      }
      setSelected(null);
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  function addUnit() {
    setForm({ ...form, units: [...form.units, { unitName: "" }] });
  }
  function removeUnit(i: number) {
    setForm({ ...form, units: form.units.filter((_, idx) => idx !== i) });
  }
  function updateUnit(i: number, val: string) {
    const units = [...form.units];
    units[i] = { unitName: val };
    setForm({ ...form, units });
  }

  if (loading) return <p className="text-gray-500 text-sm">กำลังโหลด...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">แผนการสอน</h1>

      {selected ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selected.subject.subjectCode} — {selected.subject.subjectName} ห้อง {selected.classGroup}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>ลิงก์ Google Drive (แผนการสอน/โครงการสอน)</Label>
                <Input
                  placeholder="https://drive.google.com/..."
                  value={form.driveLink}
                  onChange={(e) => setForm({ ...form, driveLink: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>แผน/หน่วยการเรียนรู้</Label>
                  <Button type="button" size="sm" variant="outline" onClick={addUnit}>+ เพิ่มหน่วย</Button>
                </div>
                {form.units.map((u, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-sm text-gray-500 mt-2 w-6 text-center">{i + 1}.</span>
                    <Input
                      placeholder={`ชื่อแผน/หน่วยที่ ${i + 1}`}
                      value={u.unitName}
                      onChange={(e) => updateUnit(i, e.target.value)}
                    />
                    {form.units.length > 1 && (
                      <Button type="button" size="sm" variant="ghost" className="text-red-500" onClick={() => removeUnit(i)}>ลบ</Button>
                    )}
                  </div>
                ))}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "กำลังบันทึก..." : "ส่งแผนการสอน"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>ยกเลิก</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีรายวิชา</p>
          ) : (
            assignments.map((a) => {
              const plan = a.teachingPlan;
              const s = plan ? statusLabel[plan.status] : statusLabel.NOT_SUBMITTED;
              return (
                <Card key={a.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{a.subject.subjectCode} — {a.subject.subjectName}</p>
                      <p className="text-xs text-gray-500">{a.subject.subjectGroup?.name} · ชั้น {a.subject.gradeLevel} · ห้อง {a.classGroup}</p>
                      {plan && plan.units.length > 0 && (
                        <p className="text-xs text-blue-600 mt-0.5">{plan.units.length} แผน/หน่วย</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                      <Button size="sm" variant="outline" onClick={() => selectAssignment(a)}>
                        {plan ? "แก้ไข" : "ส่งแผน"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
