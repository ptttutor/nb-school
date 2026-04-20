"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Clip {
  id: string;
  clipUrl: string;
  status: string;
  submittedAt: string | null;
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
  _count: { reviews: number };
}

const statusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่ส่ง",           color: "bg-gray-100 text-gray-600" },
  SUBMITTED:     { text: "รอนิเทศ",             color: "bg-yellow-100 text-yellow-800" },
  SUPERVISING:   { text: "อยู่ระหว่างนิเทศ",    color: "bg-blue-100 text-blue-800" },
  COMPLETED:     { text: "สมบูรณ์",             color: "bg-green-100 text-green-800" },
};

export default function ReviewClipsPage() {
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Clip | null>(null);
  const [comment, setComment] = useState("");
  const [decision, setDecision] = useState("completed");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("SUBMITTED");

  async function load() {
    const res = await fetch("/api/supervision/clips");
    if (res.ok) setClips(await res.json());
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
      body: JSON.stringify({ clipId: selected.id, comment, decision }),
    });
    setSelected(null);
    setComment("");
    load();
    setSaving(false);
  }

  const filtered = filter === "ALL" ? clips : clips.filter((c) => c.status === filter);

  if (loading) return <p className="text-sm text-gray-500">กำลังโหลด...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">นิเทศคลิปการสอน</h1>

      {selected ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">
                  {selected.plan.assignment.subject.subjectCode} — {selected.plan.assignment.subject.subjectName}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selected.plan.assignment.teacher.prefix}{selected.plan.assignment.teacher.firstName} {selected.plan.assignment.teacher.lastName} · ห้อง {selected.plan.assignment.classGroup}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selected.plan.assignment.subject.subjectGroup?.name} · ปี {selected.plan.assignment.semester.year}/{selected.plan.assignment.semester.semester}
                </p>
              </div>
              <Badge className={`text-xs ${statusLabel[selected.status].color}`}>{statusLabel[selected.status].text}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">คลิปการสอน</p>
                <a href={selected.clipUrl} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline break-all">
                  {selected.clipUrl}
                </a>
              </div>
              {selected.plan.driveLink && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">แผนการสอน (อ้างอิง)</p>
                  <a href={selected.plan.driveLink} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline break-all">
                    {selected.plan.driveLink}
                  </a>
                </div>
              )}
            </div>

            <form onSubmit={handleReview} className="space-y-3 border-t pt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">ผลการนิเทศ</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                >
                  <option value="completed">นิเทศสมบูรณ์</option>
                  <option value="supervising">อยู่ระหว่างนิเทศ</option>
                  <option value="noted">รับทราบ</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">ข้อเสนอแนะ</label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm min-h-20 resize-y"
                  placeholder="กรอกข้อเสนอแนะจากการนิเทศ..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>{saving ? "กำลังบันทึก..." : "บันทึกการนิเทศ"}</Button>
                <Button type="button" variant="outline" onClick={() => setSelected(null)}>ยกเลิก</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {["SUBMITTED", "SUPERVISING", "COMPLETED", "ALL"].map((s) => (
              <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
                {s === "SUBMITTED" ? "รอนิเทศ" : s === "SUPERVISING" ? "กำลังนิเทศ" : s === "COMPLETED" ? "สมบูรณ์" : "ทั้งหมด"}
                {s !== "ALL" && (
                  <span className="ml-1 text-xs">({clips.filter((c) => c.status === s).length})</span>
                )}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-500">ไม่มีรายการ</p>
            ) : (
              filtered.map((c) => {
                const s = statusLabel[c.status];
                return (
                  <Card key={c.id} className="hover:shadow-sm">
                    <CardContent className="py-3 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {c.plan.assignment.teacher.prefix}{c.plan.assignment.teacher.firstName} {c.plan.assignment.teacher.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {c.plan.assignment.subject.subjectCode} — {c.plan.assignment.subject.subjectName} · ห้อง {c.plan.assignment.classGroup}
                        </p>
                        <p className="text-xs text-gray-400">{c.plan.assignment.subject.subjectGroup?.name}</p>
                        <a href={c.clipUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline truncate block max-w-xs">
                          {c.clipUrl}
                        </a>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                        {c.status === "SUBMITTED" || c.status === "SUPERVISING" ? (
                          <Button size="sm" onClick={() => { setSelected(c); setComment(""); setDecision("completed"); }}>
                            นิเทศ
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => { setSelected(c); setComment(""); setDecision("noted"); }}>
                            ดูรายละเอียด
                          </Button>
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
