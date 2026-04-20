import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

// GET /api/supervision/admin/semesters
export async function GET() {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const semesters = await prisma.academicSemester.findMany({
    orderBy: [{ year: "desc" }, { semester: "desc" }],
    include: { _count: { select: { assignments: true } } },
  });
  return NextResponse.json(semesters);
}

// POST /api/supervision/admin/semesters
export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { year, semester, planDeadline, clipDeadline, logDeadline } = body;

  if (!year || !semester)
    return NextResponse.json({ error: "กรุณากรอกปีการศึกษาและภาคเรียน" }, { status: 400 });

  const created = await prisma.academicSemester.create({
    data: {
      year: parseInt(year),
      semester: parseInt(semester),
      planDeadline: planDeadline ? new Date(planDeadline) : null,
      clipDeadline: clipDeadline ? new Date(clipDeadline) : null,
      logDeadline: logDeadline ? new Date(logDeadline) : null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
