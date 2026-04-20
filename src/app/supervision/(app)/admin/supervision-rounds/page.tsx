"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Round {
  id: string;
  name: string;
  semesterId: string;
  startDate: string | null;
  endDate: string | null;
  semester: { year: number; semester: number };
}

interface Semester {
  id: string;
  year: number;
  semester: number;
  isActive: boolean;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
}

function isActive(r: Round) {
  const now = new Date();
  if (r.startDate && r.endDate) {
    return new Date(r.startDate) <= now && now <= new Date(r.endDate);
  }
  return false;
}

export default function SupervisionRoundsAdminPage() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [form, setForm] = useState({ name: "", semesterId: "", startDate: "", endDate: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterSemesterId, setFilterSemesterId] = useState("");

  async function load() {
    const [rRes, sRes] = await Promise.all([
      fetch("/api/supervision/admin/supervision-rounds"),
      fetch("/api/supervision/admin/semesters"),
    ]);
    if (rRes.ok) setRounds(await rRes.json());
    if (sRes.ok) {
      const semData: Semester[] = await sRes.json();
      setSemesters(semData);
      const active = semData.find((s) => s.isActive);
      if (active) {
        setForm((prev) => ({ ...prev, semesterId: active.id }));
        setFilterSemesterId(active.id);
      }
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/supervision-rounds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm((prev) => ({ ...prev, name: "", startDate: "", endDate: "" }));
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ต้องการลบรอบนิเทศนี้?")) return;
    await fetch(`/api/supervision/admin/supervision-rounds?id=${id}`, { method: "DELETE" });
    load();
  }

  const filtered = rounds.filter(
    (r) => !filterSemesterId || r.semesterId === filterSemesterId
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">รอบนิเทศภายใน</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มรอบนิเทศ</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1 col-span-2">
              <Label>ชื่อรอบนิเทศ</Label>
              <Input
                placeholder="เช่น รอบนิเทศที่ 1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>ภาคเรียน</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.semesterId}
                onChange={(e) => setForm({ ...form, semesterId: e.target.value })}
                required
              >
                <option value="">— เลือกภาคเรียน —</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    ปี {s.year} ภาค {s.semester}{s.isActive ? " (ปัจจุบัน)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>วันเริ่มต้น</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>วันสิ้นสุด</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "กำลังบันทึก..." : "เพิ่มรอบนิเทศ"}
              </Button>
            </div>
            {error && <p className="col-span-4 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filterSemesterId}
            onChange={(e) => setFilterSemesterId(e.target.value)}
          >
            <option value="">ทุกภาคเรียน</option>
            {semesters.map((s) => (
              <option key={s.id} value={s.id}>{s.year}/{s.semester}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">{filtered.length} รอบ</span>
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีรอบนิเทศ</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => {
              const active = isActive(r);
              return (
                <Card key={r.id} className={active ? "border-blue-300" : ""}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{r.name}</p>
                        {active && (
                          <Badge className="text-xs bg-blue-100 text-blue-800">กำลังดำเนินการ</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        ปี {r.semester.year} ภาค {r.semester.semester}
                        {(r.startDate || r.endDate) && (
                          <> · {formatDate(r.startDate)} — {formatDate(r.endDate)}</>
                        )}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(r.id)}
                    >
                      ลบ
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
