import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const my = searchParams.get("my") === "true";
  const semesterId = searchParams.get("semesterId");
  const teacherId = searchParams.get("teacherId");
  const subjectGroupId = searchParams.get("subjectGroupId");

  const activeSemester = await prisma.academicSemester.findFirst({ where: { isActive: true } });

  const assignments = await prisma.teacherSubjectAssignment.findMany({
    where: {
      teacherId: my && session.teacherId ? session.teacherId : teacherId || undefined,
      semesterId: semesterId || activeSemester?.id,
      subject: subjectGroupId ? { subjectGroupId } : undefined,
    },
    include: {
      teacher: true,
      subject: { include: { subjectGroup: true } },
      semester: true,
      teachingPlan: {
        include: {
          units: { orderBy: { unitNumber: "asc" } },
          _count: { select: { clips: true } },
        },
      },
    },
    orderBy: [{ subject: { subjectCode: "asc" } }, { classGroup: "asc" }],
  });
  return NextResponse.json(assignments);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { teacherId, subjectId, semesterId, classGroup } = await req.json();
  if (!teacherId || !subjectId || !semesterId || !classGroup)
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });

  const created = await prisma.teacherSubjectAssignment.create({
    data: { teacherId, subjectId, semesterId, classGroup },
    include: { teacher: true, subject: true, semester: true },
  });
  return NextResponse.json(created, { status: 201 });
}
