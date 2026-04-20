"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Semester {
  id: string;
  year: number;
  semester: number;
  isActive: boolean;
  planDeadline: string | null;
  clipDeadline: string | null;
  logDeadline: string | null;
  _count?: { assignments: number };
}

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ year: "", semester: "1", planDeadline: "", clipDeadline: "", logDeadline: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/supervision/admin/semesters");
    setSemesters(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/semesters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ year: "", semester: "1", planDeadline: "", clipDeadline: "", logDeadline: "" });
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  async function setActive(id: string) {
    await fetch(`/api/supervision/admin/semesters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: true }),
    });
    load();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">ปีการศึกษา / ภาคเรียน</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มภาคเรียนใหม่</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>ปีการศึกษา</Label>
              <Input
                placeholder="เช่น 2568"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>ภาคเรียน</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.semester}
                onChange={(e) => setForm({ ...form, semester: e.target.value })}
              >
                <option value="1">ภาคเรียนที่ 1</option>
                <option value="2">ภาคเรียนที่ 2</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>กำหนดส่งแผนการสอน</Label>
              <Input type="date" value={form.planDeadline} onChange={(e) => setForm({ ...form, planDeadline: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>กำหนดส่งคลิปการสอน</Label>
              <Input type="date" value={form.clipDeadline} onChange={(e) => setForm({ ...form, clipDeadline: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label>กำหนดส่งบันทึกหลังสอน</Label>
              <Input type="date" value={form.logDeadline} onChange={(e) => setForm({ ...form, logDeadline: e.target.value })} />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "กำลังบันทึก..." : "เพิ่มภาคเรียน"}
              </Button>
            </div>
            {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {loading ? (
          <p className="text-gray-500 text-sm">กำลังโหลด...</p>
        ) : semesters.length === 0 ? (
          <p className="text-gray-500 text-sm">ยังไม่มีข้อมูลภาคเรียน</p>
        ) : (
          semesters.map((s) => (
            <Card key={s.id}>
              <CardContent className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    ปีการศึกษา {s.year} ภาคเรียน {s.semester}
                  </span>
                  {s.isActive && <Badge className="ml-2 bg-green-100 text-green-800 text-xs">กำลังใช้งาน</Badge>}
                  {s._count && <span className="ml-2 text-xs text-gray-500">{s._count.assignments} รายการ</span>}
                  <div className="text-xs text-gray-500 mt-1 space-x-3">
                    {s.planDeadline && <span>ส่งแผน: {new Date(s.planDeadline).toLocaleDateString("th-TH")}</span>}
                    {s.clipDeadline && <span>ส่งคลิป: {new Date(s.clipDeadline).toLocaleDateString("th-TH")}</span>}
                    {s.logDeadline && <span>บันทึกหลังสอน: {new Date(s.logDeadline).toLocaleDateString("th-TH")}</span>}
                  </div>
                </div>
                {!s.isActive && (
                  <Button size="sm" variant="outline" onClick={() => setActive(s.id)}>
                    ตั้งเป็นภาคเรียนปัจจุบัน
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
