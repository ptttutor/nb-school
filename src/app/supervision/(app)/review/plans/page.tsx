"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Plan {
  id: string;
  driveLink: string | null;
  status: string;
  submittedAt: string | null;
  assignment: {
    classGroup: string;
    teacher: { prefix: string; firstName: string; lastName: string };
    subject: { subjectCode: string; subjectName: string; subjectGroup: { name: string } | null };
    semester: { year: number; semester: number };
  };
  units: { id: string; unitNumber: number; unitName: string }[];
  _count: { clips: number; reviews: number };
}

const statusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่ส่ง", color: "bg-gray-100 text-gray-600" },
  SUBMITTED: { text: "รอตรวจ", color: "bg-yellow-100 text-yellow-800" },
  REVISION_REQUIRED: { text: "ส่งกลับแก้ไข", color: "bg-red-100 text-red-800" },
  APPROVED: { text: "ผ่านการตรวจ", color: "bg-green-100 text-green-800" },
};

export default function ReviewPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Plan | null>(null);
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("approved");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("SUBMITTED");

  async function load() {
    const res = await fetch("/api/supervision/plans");
    if (res.ok) setPlans(await res.json());
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
      body: JSON.stringify({ planId: selected.id, comment, decision }),
    });
    setSelected(null);
    setComment("");
    load();
    setSaving(false);
  }

  const filtered = filter === "ALL" ? plans : plans.filter((p) => p.status === filter);

  if (loading) return <p className="text-sm text-gray-500">กำลังโหลด...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">ตรวจแผนการสอน</h1>

      {selected ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {selected.assignment.subject.subjectCode} — {selected.assignment.subject.subjectName}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selected.assignment.teacher.prefix}{selected.assignment.teacher.firstName} {selected.assignment.teacher.lastName} · ห้อง {selected.assignment.classGroup}
                </p>
              </div>
              <Badge className={`text-xs ${statusLabel[selected.status].color}`}>{statusLabel[selected.status].text}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {selected.driveLink && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">ลิงก์แผนการสอน</p>
                <a href={selected.driveLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                  {selected.driveLink}
                </a>
              </div>
            )}
            {selected.units.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-1">แผน/หน่วยการเรียนรู้ ({selected.units.length} หน่วย)</p>
                <div className="space-y-1">
                  {selected.units.map((u) => (
                    <p key={u.id} className="text-sm text-gray-700">หน่วยที่ {u.unitNumber}: {u.unitName}</p>
                  ))}
                </div>
              </div>
            )}
            <form onSubmit={handleReview} className="space-y-3 border-t pt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">ผลการตรวจ</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm" value={decision} onChange={(e) => setDecision(e.target.value)}>
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
          <div className="flex gap-2">
            {["SUBMITTED", "REVISION_REQUIRED", "APPROVED", "ALL"].map((s) => (
              <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
                {s === "SUBMITTED" ? "รอตรวจ" : s === "REVISION_REQUIRED" ? "ส่งกลับ" : s === "APPROVED" ? "ผ่านแล้ว" : "ทั้งหมด"}
                {s !== "ALL" && (
                  <span className="ml-1 text-xs">({plans.filter((p) => p.status === s).length})</span>
                )}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500">ไม่มีรายการ</p>
            ) : (
              filtered.map((p) => {
                const s = statusLabel[p.status];
                return (
                  <Card key={p.id} className="hover:shadow-sm">
                    <CardContent className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {p.assignment.teacher.prefix}{p.assignment.teacher.firstName} {p.assignment.teacher.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.assignment.subject.subjectCode} — {p.assignment.subject.subjectName} · ห้อง {p.assignment.classGroup}
                          {p.assignment.subject.subjectGroup && ` · ${p.assignment.subject.subjectGroup.name}`}
                        </p>
                        <p className="text-xs text-gray-400">{p.units.length} หน่วย · ตรวจแล้ว {p._count.reviews} ครั้ง</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                        {p.status === "SUBMITTED" && (
                          <Button size="sm" onClick={() => { setSelected(p); setComment(""); setDecision("approved"); }}>ตรวจ</Button>
                        )}
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
