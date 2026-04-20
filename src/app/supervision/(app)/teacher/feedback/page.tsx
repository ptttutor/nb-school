"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Reviewer {
  displayName: string;
  role: string;
}

interface PlanReview {
  id: string;
  comment: string;
  decision: string | null;
  createdAt: string;
  reviewer: Reviewer;
  plan: {
    assignment: {
      classGroup: string;
      subject: { subjectCode: string; subjectName: string };
      semester: { year: number; semester: number };
    };
  } | null;
}

interface ClipReview {
  id: string;
  comment: string;
  decision: string | null;
  createdAt: string;
  reviewer: Reviewer;
  clip: {
    clipUrl: string;
    plan: {
      assignment: {
        classGroup: string;
        subject: { subjectCode: string; subjectName: string };
        semester: { year: number; semester: number };
      };
    };
  } | null;
}

interface LogReview {
  id: string;
  comment: string;
  decision: string | null;
  createdAt: string;
  reviewer: Reviewer;
  log: {
    unit: {
      unitNumber: number;
      unitName: string;
      plan: {
        assignment: {
          classGroup: string;
          subject: { subjectCode: string; subjectName: string };
          semester: { year: number; semester: number };
        };
      };
    };
  } | null;
}

const decisionLabel: Record<string, { text: string; color: string }> = {
  approved:          { text: "ผ่าน",             color: "bg-green-100 text-green-800" },
  revision_required: { text: "ส่งกลับแก้ไข",    color: "bg-red-100 text-red-800" },
  completed:         { text: "นิเทศสมบูรณ์",    color: "bg-green-100 text-green-800" },
  supervising:       { text: "กำลังนิเทศ",      color: "bg-blue-100 text-blue-800" },
  noted:             { text: "รับทราบ",          color: "bg-gray-100 text-gray-600" },
};

const roleLabel: Record<string, string> = {
  SUBJECT_HEAD:           "หัวหน้าสาระ",
  ACADEMIC_HEAD:          "หัวหน้าวิชาการ",
  VICE_PRINCIPAL_ACADEMIC:"รองผู้อำนวยการฝ่ายวิชาการ",
  VICE_PRINCIPAL:         "รองผู้อำนวยการ",
  ACADEMIC_ADMIN:         "Admin วิชาการ",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function TeacherFeedbackPage() {
  const [planReviews, setPlanReviews] = useState<PlanReview[]>([]);
  const [clipReviews, setClipReviews] = useState<ClipReview[]>([]);
  const [logReviews, setLogReviews] = useState<LogReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"plans" | "clips" | "logs">("plans");

  useEffect(() => {
    fetch("/api/supervision/teacher/reviews")
      .then((r) => r.json())
      .then((d) => {
        setPlanReviews(d.planReviews ?? []);
        setClipReviews(d.clipReviews ?? []);
        setLogReviews(d.logReviews ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-sm text-gray-500">กำลังโหลด...</p>;

  const totalCount = planReviews.length + clipReviews.length + logReviews.length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold">ผลการตรวจและข้อเสนอแนะ</h1>
        <p className="text-sm text-gray-500 mt-1">
          ข้อเสนอแนะจากผู้ตรวจทั้งหมด {totalCount} รายการ
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {(["plans", "clips", "logs"] as const).map((t) => {
          const count = t === "plans" ? planReviews.length : t === "clips" ? clipReviews.length : logReviews.length;
          const label = t === "plans" ? "แผนการสอน" : t === "clips" ? "คลิปการสอน" : "บันทึกหลังสอน";
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-blue-600 text-blue-700" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {label}
              <span className="ml-1.5 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Plan Reviews */}
      {tab === "plans" && (
        <div className="space-y-3">
          {planReviews.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีข้อเสนอแนะสำหรับแผนการสอน</p>
          ) : planReviews.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      📝 {r.plan?.assignment.subject.subjectCode} — {r.plan?.assignment.subject.subjectName}
                    </CardTitle>
                    <p className="text-xs text-gray-400">ห้อง {r.plan?.assignment.classGroup}</p>
                  </div>
                  {r.decision && decisionLabel[r.decision] && (
                    <Badge className={`text-xs ${decisionLabel[r.decision].color}`}>
                      {decisionLabel[r.decision].text}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-gray-700 whitespace-pre-line">{r.comment}</p>
                <p className="text-xs text-gray-400">
                  โดย {r.reviewer.displayName} ({roleLabel[r.reviewer.role] ?? r.reviewer.role}) · {formatDate(r.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Clip Reviews */}
      {tab === "clips" && (
        <div className="space-y-3">
          {clipReviews.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีข้อเสนอแนะสำหรับคลิปการสอน</p>
          ) : clipReviews.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      🎬 {r.clip?.plan.assignment.subject.subjectCode} — {r.clip?.plan.assignment.subject.subjectName}
                    </CardTitle>
                    <p className="text-xs text-gray-400">ห้อง {r.clip?.plan.assignment.classGroup}</p>
                    {r.clip?.clipUrl && (
                      <a href={r.clip.clipUrl} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline truncate block max-w-xs">
                        {r.clip.clipUrl}
                      </a>
                    )}
                  </div>
                  {r.decision && decisionLabel[r.decision] && (
                    <Badge className={`text-xs ${decisionLabel[r.decision].color}`}>
                      {decisionLabel[r.decision].text}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-gray-700 whitespace-pre-line">{r.comment}</p>
                <p className="text-xs text-gray-400">
                  โดย {r.reviewer.displayName} ({roleLabel[r.reviewer.role] ?? r.reviewer.role}) · {formatDate(r.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Log Reviews */}
      {tab === "logs" && (
        <div className="space-y-3">
          {logReviews.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีข้อเสนอแนะสำหรับบันทึกหลังสอน</p>
          ) : logReviews.map((r) => (
            <Card key={r.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      📓 {r.log?.unit.plan.assignment.subject.subjectCode} — {r.log?.unit.plan.assignment.subject.subjectName}
                    </CardTitle>
                    <p className="text-xs text-gray-400">
                      หน่วยที่ {r.log?.unit.unitNumber}: {r.log?.unit.unitName} · ห้อง {r.log?.unit.plan.assignment.classGroup}
                    </p>
                  </div>
                  {r.decision && decisionLabel[r.decision] && (
                    <Badge className={`text-xs ${decisionLabel[r.decision].color}`}>
                      {decisionLabel[r.decision].text}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-gray-700 whitespace-pre-line">{r.comment}</p>
                <p className="text-xs text-gray-400">
                  โดย {r.reviewer.displayName} ({roleLabel[r.reviewer.role] ?? r.reviewer.role}) · {formatDate(r.createdAt)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
