"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Clip {
  id: string;
  clipUrl: string;
  status: string;
  submittedAt: string;
  round: { id: string; name: string } | null;
  plan: {
    id: string;
    assignment: {
      classGroup: string;
      subject: { subjectCode: string; subjectName: string };
      semester: { year: number; semester: number };
    };
  };
}

interface Plan {
  id: string;
  driveLink: string | null;
  status: string;
  assignment: {
    classGroup: string;
    subject: { subjectCode: string; subjectName: string };
    semester: { year: number; semester: number };
  };
}

interface Round {
  id: string;
  name: string;
  startDate: string | null;
  endDate: string | null;
  semester: { year: number; semester: number };
}

const clipStatusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่ส่ง",        color: "bg-gray-100 text-gray-600" },
  SUBMITTED:     { text: "รอนิเทศ",          color: "bg-yellow-100 text-yellow-800" },
  SUPERVISING:   { text: "อยู่ระหว่างนิเทศ", color: "bg-blue-100 text-blue-800" },
  COMPLETED:     { text: "สมบูรณ์",          color: "bg-green-100 text-green-800" },
};

export default function TeacherClipsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [clips, setClips] = useState<Clip[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [selectedRoundId, setSelectedRoundId] = useState("");
  const [clipUrl, setClipUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const [plansRes, clipsRes, roundsRes] = await Promise.all([
      fetch("/api/supervision/plans"),
      fetch("/api/supervision/clips"),
      fetch("/api/supervision/admin/supervision-rounds"),
    ]);
    if (plansRes.ok) setPlans(await plansRes.json());
    if (clipsRes.ok) setClips(await clipsRes.json());
    if (roundsRes.ok) setRounds(await roundsRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/supervision/clips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: selectedPlanId, clipUrl, roundId: selectedRoundId || null }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setClipUrl("");
      setSelectedPlanId("");
      setSelectedRoundId("");
      load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  }

  const submittedPlans = plans.filter((p) => p.status !== "NOT_SUBMITTED");

  if (loading) return <p className="text-sm text-gray-500">กำลังโหลด...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">คลิปการสอน</h1>
      <p className="text-sm text-gray-500">ส่งลิงก์คลิปการสอนจริง (1 คลิป ต่อ 1 แผนการสอน)</p>

      <Card>
        <CardHeader><CardTitle className="text-base">ส่งคลิปการสอน</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label>เลือกแผนการสอน</Label>
              <select
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                required
              >
                <option value="">— เลือกแผนการสอน —</option>
                {submittedPlans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.assignment.subject.subjectCode} — {p.assignment.subject.subjectName} ห้อง {p.assignment.classGroup}
                  </option>
                ))}
              </select>
              {submittedPlans.length === 0 && (
                <p className="text-xs text-yellow-600">กรุณาส่งแผนการสอนก่อน</p>
              )}
            </div>
            {rounds.length > 0 && (
              <div className="space-y-1">
                <Label>รอบนิเทศ (ถ้ามี)</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={selectedRoundId}
                  onChange={(e) => setSelectedRoundId(e.target.value)}
                >
                  <option value="">— ไม่ระบุรอบ —</option>
                  {rounds.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} (ปี {r.semester.year}/{r.semester.semester})
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1">
              <Label>ลิงก์คลิปการสอน</Label>
              <Input
                placeholder="https://drive.google.com/... หรือ YouTube"
                value={clipUrl}
                onChange={(e) => setClipUrl(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={saving || submittedPlans.length === 0}>
              {saving ? "กำลังบันทึก..." : "ส่งคลิป"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="font-medium text-sm">คลิปที่ส่งแล้ว</h2>
        {clips.length === 0 ? (
          <p className="text-sm text-gray-500">ยังไม่มีคลิปที่ส่ง</p>
        ) : (
          clips.map((c) => {
            const s = clipStatusLabel[c.status];
            return (
              <Card key={c.id}>
                <CardContent className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {c.plan.assignment.subject.subjectCode} — {c.plan.assignment.subject.subjectName}
                    </p>
                    {c.round && (
                      <p className="text-xs text-blue-600">{c.round.name}</p>
                    )}
                    <a
                      href={c.clipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline truncate block max-w-xs"
                    >
                      {c.clipUrl}
                    </a>
                  </div>
                  <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}