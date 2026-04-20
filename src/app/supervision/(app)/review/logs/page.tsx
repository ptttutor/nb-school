"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TeachingLog {
  id: string;
  status: string;
  result: string | null;
  issues: string | null;
  improvement: string | null;
  studentWorkLink: string | null;
  attachmentLink: string | null;
  submittedAt: string | null;
  unit: {
    id: string;
    unitNumber: number;
    unitName: string;
    plan: {
      id: string;
      driveLink: string | null;
      assignment: {
        classGroup: string;
        teacher: { prefix: string; firstName: string; lastName: string };
        subject: { subjectCode: string; subjectName: string; subjectGroup: { name: string } | null };
        semester: { year: number; semester: number };
      };
    };
  };
  _count: { reviews: number };
}

const statusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED:     { text: "ยังไม่บันทึก",    color: "bg-gray-100 text-gray-600" },
  SUBMITTED:         { text: "รอตรวจ",          color: "bg-yellow-100 text-yellow-800" },
  REVISION_REQUIRED: { text: "ส่งกลับแก้ไข",   color: "bg-red-100 text-red-800" },
  APPROVED:          { text: "ผ่านการตรวจ",     color: "bg-green-100 text-green-800" },
};

export default function ReviewLogsPage() {
  const [logs, setLogs] = useState<TeachingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<TeachingLog | null>(null);
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("approved");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("SUBMITTED");

  async function load() {
    const res = await fetch("/api/supervision/logs");
    if (res.ok) setLogs(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleReview(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    await fetch("/api/supervision/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId: selected.id, comment, decision }),
    });
    setSelected(null);
    setComment("");
    load();
    setSaving(false);
  }

  const filtered = filter === "ALL" ? logs : logs.filter((l) => l.status === filter);

  if (loading) return <p className="text-sm text-gray-500">กำลังโหลด...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">ตรวจบันทึกหลังสอน</h1>

      {selected ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  หน่วยที่ {selected.unit.unitNumber}: {selected.unit.unitName}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selected.unit.plan.assignment.subject.subjectCode} — {selected.unit.plan.assignment.subject.subjectName}
                </p>
                <p className="text-sm text-gray-500">
                  {selected.unit.plan.assignment.teacher.prefix}{selected.unit.plan.assignment.teacher.firstName} {selected.unit.plan.assignment.teacher.lastName} · ห้อง {selected.unit.plan.assignment.classGroup}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.unit.plan.assignment.subject.subjectGroup?.name} · ปี {selected.unit.plan.assignment.semester.year}/{selected.unit.plan.assignment.semester.semester}
                </p>
              </div>
              <Badge className={`text-xs ${statusLabel[selected.status].color}`}>{statusLabel[selected.status].text}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 bg-gray-50 rounded-lg p-3">
              {selected.result && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">ผลการจัดการเรียนรู้</p>
                  <p className="text-sm mt-0.5">{selected.result}</p>
                </div>
              )}
              {selected.issues && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">ปัญหาและอุปสรรค</p>
                  <p className="text-sm mt-0.5">{selected.issues}</p>
                </div>
              )}
              {selected.improvement && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">แนวทางแก้ไข/พัฒนา</p>
                  <p className="text-sm mt-0.5">{selected.improvement}</p>
                </div>
              )}
              {selected.studentWorkLink && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">ลิงก์ผลงานนักเรียน</p>
                  <a href={selected.studentWorkLink} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all">
                    {selected.studentWorkLink}
                  </a>
                </div>
              )}
              {selected.attachmentLink && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">เอกสารแนบ</p>
                  <a href={selected.attachmentLink} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all">
                    {selected.attachmentLink}
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleReview} className="space-y-3 border-t pt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">ผลการตรวจ</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <option value="approved">ผ่าน</option>
                  <option value="revision_required">ส่งกลับแก้ไข</option>
                  <option value="noted">รับทราบ</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">ข้อเสนอแนะ</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-20 resize-y"
                  placeholder="กรอกข้อเสนอแนะ..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึกการตรวจ"}</Button>
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>ยกเลิก</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {["SUBMITTED", "REVISION_REQUIRED", "APPROVED", "ALL"].map((s) => (
              <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
                {s === "SUBMITTED" ? "รอตรวจ" : s === "REVISION_REQUIRED" ? "ส่งกลับ" : s === "APPROVED" ? "ผ่านแล้ว" : "ทั้งหมด"}
                {s !== "ALL" && (
                  <span className="ml-1 text-xs">({logs.filter((l) => l.status === s).length})</span>
                )}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500">ไม่มีรายการ</p>
            ) : (
              filtered.map((l) => {
                const s = statusLabel[l.status];
                return (
                  <Card key={l.id} className="hover:shadow-sm">
                    <CardContent className="py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {l.unit.plan.assignment.teacher.prefix}{l.unit.plan.assignment.teacher.firstName} {l.unit.plan.assignment.teacher.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {l.unit.plan.assignment.subject.subjectCode} — {l.unit.plan.assignment.subject.subjectName} · ห้อง {l.unit.plan.assignment.classGroup}
                        </p>
                        <p className="text-xs text-gray-400">
                          หน่วยที่ {l.unit.unitNumber}: {l.unit.unitName} · {l.unit.plan.assignment.subject.subjectGroup?.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                        <Button
                          size="sm"
                          variant={l.status === "SUBMITTED" ? "default" : "outline"}
                          onClick={() => { setSelected(l); setComment(""); setDecision("approved"); }}
                        >
                          {l.status === "SUBMITTED" ? "ตรวจ" : "ดูรายละเอียด"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
