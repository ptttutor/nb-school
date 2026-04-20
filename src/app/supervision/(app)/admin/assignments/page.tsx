"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface Assignment {
  id: string;
  classGroup: string;
  teacher: { id: string; prefix: string; firstName: string; lastName: string; teacherCode: string };
  subject: { id: string; subjectCode: string; subjectName: string; gradeLevel: string; subjectGroup: { name: string } | null };
  semester: { id: string; year: number; semester: number };
  teachingPlan: { status: string } | null;
}

interface Teacher {
  id: string;
  teacherCode: string;
  prefix: string;
  firstName: string;
  lastName: string;
  subjectGroup: { name: string } | null;
}

interface Subject {
  id: string;
  subjectCode: string;
  subjectName: string;
  gradeLevel: string;
  subjectGroup: { name: string } | null;
}

interface Semester {
  id: string;
  year: number;
  semester: number;
  isActive: boolean;
}

interface SubjectGroup {
  id: string;
  name: string;
}

const planStatusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่ส่ง",     color: "bg-gray-100 text-gray-600" },
  SUBMITTED:     { text: "รอตรวจ",        color: "bg-yellow-100 text-yellow-800" },
  REVISION_REQUIRED: { text: "ส่งกลับ",   color: "bg-red-100 text-red-800" },
  APPROVED:      { text: "ผ่านแล้ว",      color: "bg-green-100 text-green-800" },
};

export default function AssignmentsAdminPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [groups, setGroups] = useState<SubjectGroup[]>([]);

  const [form, setForm] = useState({
    teacherId: "",
    subjectId: "",
    semesterId: "",
    classGroup: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [filterSemesterId, setFilterSemesterId] = useState("");
  const [filterGroupId, setFilterGroupId] = useState("");
  const [filterTeacherId, setFilterTeacherId] = useState("");

  async function load() {
    const [aRes, tRes, sRes, semRes, gRes] = await Promise.all([
      fetch("/api/supervision/admin/assignments"),
      fetch("/api/supervision/admin/teachers"),
      fetch("/api/supervision/admin/subjects"),
      fetch("/api/supervision/admin/semesters"),
      fetch("/api/supervision/admin/subject-groups"),
    ]);
    if (aRes.ok) setAssignments(await aRes.json());
    if (tRes.ok) setTeachers(await tRes.json());
    if (sRes.ok) setSubjects(await sRes.json());
    if (semRes.ok) {
      const semData: Semester[] = await semRes.json();
      setSemesters(semData);
      const active = semData.find((s) => s.isActive);
      if (active) {
        setForm((prev) => ({ ...prev, semesterId: active.id }));
        setFilterSemesterId(active.id);
      }
    }
    if (gRes.ok) setGroups(await gRes.json());
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/supervision/admin/assignments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setForm((prev) => ({ ...prev, teacherId: "", subjectId: "", classGroup: "" }));
      load();
    } else {
      const d = await res.json();
      setError(d.error);
    }
    setSaving(false);
  }

  const filteredSubjects = subjects.filter(
    (s) => !filterGroupId || s.subjectGroup?.name === groups.find((g) => g.id === filterGroupId)?.name
  );

  const filtered = assignments.filter((a) => {
    const matchSem = !filterSemesterId || a.semester.id === filterSemesterId;
    const matchGroup = !filterGroupId || a.subject.subjectGroup?.name === groups.find((g) => g.id === filterGroupId)?.name;
    const matchTeacher = !filterTeacherId || a.teacher.id === filterTeacherId;
    return matchSem && matchGroup && matchTeacher;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">มอบหมายการสอน</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">เพิ่มการมอบหมายการสอน</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1 col-span-2">
              <Label>ครูผู้สอน</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.teacherId}
                onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                required
              >
                <option value="">— เลือกครู —</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.teacherCode} — {t.prefix}{t.firstName} {t.lastName}
                    {t.subjectGroup ? ` (${t.subjectGroup.name})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <Label>รายวิชา</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                required
              >
                <option value="">— เลือกวิชา —</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.subjectCode} — {s.subjectName} ({s.gradeLevel})
                    {s.subjectGroup ? ` [${s.subjectGroup.name}]` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
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
                    {s.year}/{s.semester}{s.isActive ? " (ปัจจุบัน)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label>ห้องเรียน</Label>
              <input
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="เช่น 1, 2, 3"
                value={form.classGroup}
                onChange={(e) => setForm({ ...form, classGroup: e.target.value })}
                required
              />
            </div>
            <div className="col-span-2 flex items-end">
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "กำลังบันทึก..." : "เพิ่มการมอบหมาย"}
              </Button>
            </div>
            {error && <p className="col-span-4 text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
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
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filterGroupId}
            onChange={(e) => setFilterGroupId(e.target.value)}
          >
            <option value="">ทุกกลุ่มสาระ</option>
            {groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <select
            className="border rounded-md px-3 py-2 text-sm"
            value={filterTeacherId}
            onChange={(e) => setFilterTeacherId(e.target.value)}
          >
            <option value="">ทุกครู</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>{t.teacherCode} — {t.prefix}{t.firstName} {t.lastName}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">{filtered.length} รายการ</span>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">ครูผู้สอน</th>
                <th className="px-4 py-2 text-left font-medium">รายวิชา</th>
                <th className="px-4 py-2 text-center font-medium">ห้อง</th>
                <th className="px-4 py-2 text-left font-medium">กลุ่มสาระ</th>
                <th className="px-4 py-2 text-center font-medium">ภาคเรียน</th>
                <th className="px-4 py-2 text-center font-medium">แผนการสอน</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">ไม่พบรายการ</td>
                </tr>
              ) : (
                filtered.map((a) => {
                  const planStatus = a.teachingPlan?.status ?? "NOT_SUBMITTED";
                  const ps = planStatusLabel[planStatus];
                  return (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <p className="font-medium">{a.teacher.prefix}{a.teacher.firstName} {a.teacher.lastName}</p>
                        <p className="text-xs text-gray-400">{a.teacher.teacherCode}</p>
                      </td>
                      <td className="px-4 py-2">
                        <p>{a.subject.subjectCode}</p>
                        <p className="text-xs text-gray-500">{a.subject.subjectName}</p>
                      </td>
                      <td className="px-4 py-2 text-center">{a.classGroup}</td>
                      <td className="px-4 py-2 text-gray-500 text-xs">{a.subject.subjectGroup?.name || "—"}</td>
                      <td className="px-4 py-2 text-center">{a.semester.year}/{a.semester.semester}</td>
                      <td className="px-4 py-2 text-center">
                        <Badge className={`text-xs ${ps.color}`}>{ps.text}</Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
