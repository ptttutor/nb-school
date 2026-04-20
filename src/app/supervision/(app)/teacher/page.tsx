import { getSupervisionSession } from "@/lib/supervision-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const statusLabel: Record<string, { text: string; color: string }> = {
  NOT_SUBMITTED: { text: "ยังไม่ส่ง", color: "bg-gray-100 text-gray-600" },
  SUBMITTED: { text: "รอตรวจ", color: "bg-yellow-100 text-yellow-800" },
  REVISION_REQUIRED: { text: "ส่งกลับแก้ไข", color: "bg-red-100 text-red-800" },
  APPROVED: { text: "ผ่านการตรวจ", color: "bg-green-100 text-green-800" },
};

export default async function TeacherHomePage() {
  const session = await getSupervisionSession();
  if (!session || session.role !== "TEACHER") redirect("/supervision");
  if (!session.teacherId) {
    return (
      <div className="max-w-xl mx-auto mt-10 text-center">
        <p className="text-gray-500">บัญชีผู้ใช้นี้ยังไม่ได้เชื่อมกับข้อมูลครู กรุณาติดต่อ Admin วิชาการ</p>
      </div>
    );
  }

  const semester = await prisma.academicSemester.findFirst({ where: { isActive: true } });

  const assignments = await prisma.teacherSubjectAssignment.findMany({
    where: {
      teacherId: session.teacherId,
      semesterId: semester?.id,
    },
    include: {
      subject: { include: { subjectGroup: true } },
      semester: true,
      teachingPlan: {
        include: {
          _count: { select: { clips: true, units: true } },
        },
      },
    },
    orderBy: { subject: { subjectCode: "asc" } },
  });

  const planCount = assignments.filter((a) => a.teachingPlan).length;
  const approvedCount = assignments.filter((a) => a.teachingPlan?.status === "APPROVED").length;
  const pendingCount = assignments.filter((a) => a.teachingPlan?.status === "SUBMITTED").length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">สวัสดี, {session.displayName}</h1>
        {semester && (
          <p className="text-gray-500 text-sm mt-1">
            ปีการศึกษา {semester.year} ภาคเรียน {semester.semester}
          </p>
        )}
      </div>

      {/* สรุปสถานะ */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-blue-600">{assignments.length}</div>
            <div className="text-sm text-gray-500 mt-1">รายวิชาที่รับผิดชอบ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-500 mt-1">ผ่านการตรวจ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-500 mt-1">รอตรวจ</div>
          </CardContent>
        </Card>
      </div>

      {/* เมนูด่วน */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/supervision/teacher/plans">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4 text-center">
              <div className="font-medium text-sm">แผนการสอน</div>
              <div className="text-xs text-gray-500 mt-0.5">{planCount}/{assignments.length} วิชา</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/supervision/teacher/clips">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4 text-center">
              <div className="font-medium text-sm">คลิปการสอน</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/supervision/teacher/logs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="py-4 text-center">
              <div className="font-medium text-sm">บันทึกหลังสอน</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* รายวิชาของครู */}
      <Card>
        <CardHeader><CardTitle className="text-base">รายวิชาของฉัน</CardTitle></CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">ยังไม่มีการมอบหมายวิชา</p>
          ) : (
            <div className="space-y-2">
              {assignments.map((a) => {
                const plan = a.teachingPlan;
                const s = plan ? statusLabel[plan.status] : statusLabel.NOT_SUBMITTED;
                return (
                  <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium">{a.subject.subjectCode} — {a.subject.subjectName}</p>
                      <p className="text-xs text-gray-500">{a.subject.subjectGroup?.name} · ห้อง {a.classGroup} · ชั้น {a.subject.gradeLevel}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {plan && (
                        <span className="text-xs text-gray-500">{plan._count.units} หน่วย</span>
                      )}
                      <Badge className={`text-xs ${s.color}`}>{s.text}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
