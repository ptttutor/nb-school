import { getSupervisionSession } from "@/lib/supervision-auth";
import { canReview, getRoleLabel } from "@/lib/supervision-utils";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function ReviewHomePage() {
  const session = await getSupervisionSession();
  if (!session || !canReview(session.role)) redirect("/supervision");

  const semester = await prisma.academicSemester.findFirst({ where: { isActive: true } });

  const where = {
    assignment: {
      semesterId: semester?.id,
      subject: session.role === "SUBJECT_HEAD" && session.teacherId
        ? {
            subjectGroup: {
              teachers: { some: { id: session.teacherId } },
            },
          }
        : undefined,
    },
  };

  const [totalPlans, pendingPlans, totalClips, pendingClips, totalLogs, pendingLogs] = await Promise.all([
    prisma.teachingPlan.count({ where }),
    prisma.teachingPlan.count({ where: { ...where, status: "SUBMITTED" } }),
    prisma.supervisionClip.count({ where: { plan: where } }),
    prisma.supervisionClip.count({ where: { plan: where, status: "SUBMITTED" } }),
    prisma.teachingLog.count({ where: { unit: { plan: where } } }),
    prisma.teachingLog.count({ where: { unit: { plan: where }, status: "SUBMITTED" } }),
  ]);

  const menus = [
    { href: "/supervision/review/plans", label: "ตรวจแผนการสอน", icon: "", total: totalPlans, pending: pendingPlans, pendingLabel: "รอตรวจ" },
    { href: "/supervision/review/clips", label: "ตรวจคลิปการสอน", icon: "", total: totalClips, pending: pendingClips, pendingLabel: "รอนิเทศ" },
    { href: "/supervision/review/logs", label: "ตรวจบันทึกหลังสอน", icon: "", total: totalLogs, pending: pendingLogs, pendingLabel: "รอตรวจ" },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">ภาพรวมการตรวจ</h1>
        <p className="text-sm text-gray-500 mt-1">
          {getRoleLabel(session.role)}
          {semester && ` · ปีการศึกษา ${semester.year} ภาคเรียน ${semester.semester}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {menus.map((m) => (
          <Link key={m.href} href={m.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{m.icon}</span> {m.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{m.pending}</div>
                <div className="text-xs text-gray-500">{m.pendingLabel} (จาก {m.total} รายการ)</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
