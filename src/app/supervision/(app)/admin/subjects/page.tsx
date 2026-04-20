"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  gradeLevel: string;
  subjectGroupId: string | null;
  subjectGroup: { name: string } | null;
  _count?: { assignments: number };
}

interface SubjectGroup {
  id: string;
  name: string;
}

const gradeLevels = ["ม.1", "ม.2", "ม.3", "ม.4", "ม.5", "ม.6"];

export default function SubjectsAdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [groups, setGroups] = useState<SubjectGroup[]>([]);
  const [form, setForm] = useState({
    subjectCode: "",
    subjectName: "",
    credits: "1",
    gradeLevel: "ม.1",
    subjectGroupId: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  const [filterGrade, setFilterGrade] = useState("");

  async function load() {
    const [sRes, gRes] = await Promise.all([
      fetch("/api/supervision/admin/subjects"),
      fetch("/api/supervision/admin/subject-groups"),
    ]);
    if (sRes.ok) setSubjects(await sRes.json());
    if (gRes.ok) setGroups(await gRes.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ subjectCode: "", subjectName: "", credits: "1", gradeLevel: "ม.1", subjectGroupId: "" });
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  const filtered = subjects.filter((s) => {
    const matchSearch =
      !search ||
      s.subjectCode.toLowerCase().includes(search.toLowerCase()) ||
      s.subjectName.toLowerCase().includes(search.toLowerCase());
    const matchGroup = !filterGroup || s.subjectGroupId === filterGroup;
    const matchGrade = !filterGrade || s.gradeLevel === filterGrade;
    return matchSearch && matchGroup && matchGrade;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">รายวิชา</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มรายวิชา</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>รหัสวิชา</Label>
              <Input
                placeholder="เช่น ท21101"
                value={form.subjectCode}
                onChange={(e) => setForm({ ...form, subjectCode: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1 col-span-2">
              <Label>ชื่อวิชา</Label>
              <Input
                placeholder="เช่น ภาษาไทย 1"
                value={form.subjectName}
                onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>หน่วยกิต</Label>
              <Input
                type="number"
                step="0.5"
                min="0.5"
                value={form.credits}
                onChange={(e) => setForm({ ...form, credits: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1">
              <Label>ระดับชั้น</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.gradeLevel}
                onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })}
              >
                {gradeLevels.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <Label>กลุ่มสาระ</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.subjectGroupId}
                onChange={(e) => setForm({ ...form, subjectGroupId: e.target.value })}
              >
                <option value="">— ยังไม่กำหนด —</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="col-span-2 md:col-span-3 flex items-center gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? "กำลังบันทึก..." : "เพิ่มรายวิชา"}
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="ค้นหารหัส/ชื่อวิชา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
          >
            <option value="">ทุกกลุ่มสาระ</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filterGrade}
            onChange={(e) => setFilterGrade(e.target.value)}
          >
            <option value="">ทุกระดับชั้น</option>
            {gradeLevels.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
          <span className="text-sm text-gray-500">{filtered.length} รายวิชา</span>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">รหัสวิชา</th>
                <th className="px-4 py-2 text-left font-medium">ชื่อวิชา</th>
                <th className="px-4 py-2 text-center font-medium">หน่วยกิต</th>
                <th className="px-4 py-2 text-center font-medium">ระดับ</th>
                <th className="px-4 py-2 text-left font-medium">กลุ่มสาระ</th>
                <th className="px-4 py-2 text-center font-medium">มอบหมาย</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">ไม่พบรายวิชา</td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-mono text-blue-700">{s.subjectCode}</td>
                    <td className="px-4 py-2">{s.subjectName}</td>
                    <td className="px-4 py-2 text-center">{s.credits}</td>
                    <td className="px-4 py-2 text-center">{s.gradeLevel}</td>
                    <td className="px-4 py-2 text-gray-500">{s.subjectGroup?.name || "—"}</td>
                    <td className="px-4 py-2 text-center text-gray-500">{s._count?.assignments ?? 0}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
