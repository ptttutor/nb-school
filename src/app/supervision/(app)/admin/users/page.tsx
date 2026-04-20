"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRoleLabel } from "@/lib/supervision-utils";
import { SupervisionRole } from "@prisma/client";

interface User {
  id: string;
  username: string;
  role: SupervisionRole;
  displayName: string;
  teacherId: string | null;
  teacher: { firstName: string; lastName: string; teacherCode: string } | null;
}

interface Teacher {
  id: string;
  teacherCode: string;
  prefix: string;
  firstName: string;
  lastName: string;
}

const roleColors: Record<string, string> = {
  ACADEMIC_ADMIN: "bg-red-100 text-red-800",
  TEACHER: "bg-blue-100 text-blue-800",
  SUBJECT_HEAD: "bg-green-100 text-green-800",
  ACADEMIC_HEAD: "bg-purple-100 text-purple-800",
  VICE_PRINCIPAL_ACADEMIC: "bg-orange-100 text-orange-800",
  VICE_PRINCIPAL: "bg-yellow-100 text-yellow-800",
  PRINCIPAL: "bg-gray-100 text-gray-800",
};

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState({ username: "", password: "", role: "TEACHER", displayName: "", teacherId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const [uRes, tRes] = await Promise.all([
      fetch("/api/supervision/admin/users"),
      fetch("/api/supervision/admin/teachers"),
    ]);
    setUsers(await uRes.json());
    setTeachers(await tRes.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm({ username: "", password: "", role: "TEACHER", displayName: "", teacherId: "" });
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">จัดการผู้ใช้งาน</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มผู้ใช้ใหม่</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>ชื่อผู้ใช้ (username)</Label>
              <Input placeholder="username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>รหัสผ่าน</Label>
              <Input type="password" placeholder="รหัสผ่าน" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>ชื่อที่แสดง</Label>
              <Input placeholder="ชื่อ-นามสกุล" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required />
            </div>
            <div className="space-y-1">
              <Label>บทบาท</Label>
              <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="TEACHER">ครูผู้สอน</option>
                <option value="SUBJECT_HEAD">หัวหน้าสาระ</option>
                <option value="ACADEMIC_HEAD">หัวหน้าวิชาการ</option>
                <option value="VICE_PRINCIPAL_ACADEMIC">รองผู้อำนวยการฝ่ายวิชาการ</option>
                <option value="VICE_PRINCIPAL">รองผู้อำนวยการ</option>
                <option value="PRINCIPAL">ผู้อำนวยการ</option>
                <option value="ACADEMIC_ADMIN">Admin วิชาการ</option>
              </select>
            </div>
            {form.role === "TEACHER" && (
              <div className="space-y-1 col-span-2">
                <Label>เชื่อมกับครู</Label>
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
                  <option value="">— ยังไม่เชื่อม —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>{t.teacherCode} — {t.prefix}{t.firstName} {t.lastName}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "กำลังบันทึก..." : "เพิ่มผู้ใช้"}
              </Button>
            </div>
            {error && <p className="col-span-2 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Username</th>
              <th className="px-4 py-2 text-left font-medium">ชื่อที่แสดง</th>
              <th className="px-4 py-2 text-left font-medium">บทบาท</th>
              <th className="px-4 py-2 text-left font-medium">เชื่อมกับครู</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 font-mono">{u.username}</td>
                <td className="px-4 py-2">{u.displayName}</td>
                <td className="px-4 py-2">
                  <Badge className={`text-xs ${roleColors[u.role] ?? ""}`}>{getRoleLabel(u.role)}</Badge>
                </td>
                <td className="px-4 py-2 text-gray-600">
                  {u.teacher ? `${u.teacher.teacherCode} — ${u.teacher.firstName} ${u.teacher.lastName}` : "—"}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-4 text-center text-gray-500">ยังไม่มีผู้ใช้</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
