import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

// GET - ดูแผนการสอนของครู
export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");

  // ถ้าเป็นครู ดูเฉพาะของตัวเอง
  const isTeacher = session.role === "TEACHER";
  if (isTeacher && !session.teacherId)
    return NextResponse.json([]);

  // VP เห็นเฉพาะกลุ่มสาระที่รับผิดชอบ
  let vpGroupIds: string[] | undefined;
  if (session.role === "VICE_PRINCIPAL") {
    const groups = await prisma.subjectGroup.findMany({
      where: { vicePrincipalId: session.id },
      select: { id: true },
    });
    vpGroupIds = groups.map((g) => g.id);
    if (vpGroupIds.length === 0) return NextResponse.json([]);
  }

  const plans = await prisma.teachingPlan.findMany({
    where: {
      assignment: {
        semesterId: semesterId || undefined,
        teacherId: isTeacher ? session.teacherId! : undefined,
        subject: vpGroupIds ? { subjectGroupId: { in: vpGroupIds } } : undefined,
      },
    },
    include: {
      assignment: {
        include: {
          teacher: true,
          subject: { include: { subjectGroup: true } },
          semester: true,
        },
      },
      units: { include: { teachingLogs: true, _count: { select: { teachingLogs: true } } } },
      _count: { select: { clips: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(plans);
}

// POST - สร้างแผนการสอน
export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "TEACHER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { assignmentId, driveLink, units } = await req.json();
  if (!assignmentId)
    return NextResponse.json({ error: "กรุณาระบุรายวิชา" }, { status: 400 });

  // ตรวจสอบว่า assignment เป็นของครูนี้
  const assignment = await prisma.teacherSubjectAssignment.findFirst({
    where: { id: assignmentId, teacherId: session.teacherId! },
  });
  if (!assignment)
    return NextResponse.json({ error: "ไม่พบรายวิชาที่ระบุ" }, { status: 404 });

  const plan = await prisma.teachingPlan.create({
    data: {
      assignmentId,
      driveLink: driveLink || null,
      status: driveLink ? "SUBMITTED" : "NOT_SUBMITTED",
      submittedAt: driveLink ? new Date() : null,
      units: units?.length
        ? {
            create: units.map((u: { unitName: string }, i: number) => ({
              unitNumber: i + 1,
              unitName: u.unitName,
            })),
          }
        : undefined,
    },
    include: { units: true },
  });
  return NextResponse.json(plan, { status: 201 });
}
