"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Teacher {
  id: string;
  teacherCode: string;
  prefix: string;
  firstName: string;
  lastName: string;
  subjectGroupId: string | null;
  subjectGroup: { name: string } | null;
  user: { username: string; role: string } | null;
}

interface SubjectGroup {
  id: string;
  name: string;
}

export default function TeachersAdminPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [groups, setGroups] = useState<SubjectGroup[]>([]);
  const [form, setForm] = useState({ teacherCode: "", prefix: "นาย", firstName: "", lastName: "", subjectGroupId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    const [tRes, gRes] = await Promise.all([
      fetch("/api/supervision/admin/teachers"),
      fetch("/api/supervision/admin/subject-groups"),
    ]);
    setTeachers(await tRes.json());
    setGroups(await gRes.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/teachers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ teacherCode: "", prefix: "นาย", firstName: "", lastName: "", subjectGroupId: "" });
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  const filtered = teachers.filter(
    (t) =>
      t.firstName.includes(search) ||
      t.lastName.includes(search) ||
      t.teacherCode.includes(search)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">ครูผู้สอน</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มครู</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>รหัสครู</Label>
              <Input placeholder="101" value={form.teacherCode} onChange={(e) => setForm({ ...form, teacherCode: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>คำนำหน้า</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })}>
                <option>นาย</option>
                <option>นาง</option>
                <option>นางสาว</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label>ชื่อ</Label>
              <Input placeholder="ชื่อจริง" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>นามสกุล</Label>
              <Input placeholder="นามสกุล" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>กลุ่มสาระ</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.subjectGroupId} onChange={(e) => setForm({ ...form, subjectGroupId: e.target.value })}>
                <option value="">— ยังไม่กำหนด —</option>
                {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "กำลังบันทึก..." : "เพิ่มครู"}
              </Button>
            </div>
            {error && <p className="col-span-3 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input placeholder="ค้นหาครู..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <span className="text-sm text-gray-500">{filtered.length} คน</span>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">รหัส</th>
                <th className="px-4 py-2 text-left font-medium">ชื่อ-นามสกุล</th>
                <th className="px-4 py-2 text-left font-medium">กลุ่มสาระ</th>
                <th className="px-4 py-2 text-left font-medium">บัญชีผู้ใช้</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{t.teacherCode}</td>
                  <td className="px-4 py-2">{t.prefix}{t.firstName} {t.lastName}</td>
                  <td className="px-4 py-2 text-gray-600">{t.subjectGroup?.name ?? "—"}</td>
                  <td className="px-4 py-2 text-gray-600">{t.user?.username ?? <span className="text-yellow-600">ยังไม่มีบัญชี</span>}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-500">ไม่พบข้อมูล</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
