import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";
import { canReview } from "@/lib/supervision-utils";

// POST - ส่งบันทึกหลังสอน / PATCH - แก้ไข
export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "TEACHER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { unitId, result, issues, improvement, studentWorkLink, attachmentLink } = await req.json();
  if (!unitId)
    return NextResponse.json({ error: "กรุณาระบุหน่วยการเรียนรู้" }, { status: 400 });

  // ตรวจสอบว่า unit เป็นของครูนี้
  const unit = await prisma.planUnit.findFirst({
    where: { id: unitId, plan: { assignment: { teacherId: session.teacherId! } } },
  });
  if (!unit) return NextResponse.json({ error: "ไม่พบหน่วยการเรียนรู้" }, { status: 404 });

  // upsert บันทึกหลังสอน
  const existing = await prisma.teachingLog.findFirst({ where: { unitId } });
  const log = existing
    ? await prisma.teachingLog.update({
        where: { id: existing.id },
        data: { result, issues, improvement, studentWorkLink, attachmentLink, status: "SUBMITTED", submittedAt: new Date() },
      })
    : await prisma.teachingLog.create({
        data: { unitId, result, issues, improvement, studentWorkLink, attachmentLink, status: "SUBMITTED", submittedAt: new Date() },
      });
  return NextResponse.json(log, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const isTeacher = session.role === "TEACHER";

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

  const logs = await prisma.teachingLog.findMany({
    where: {
      unit: {
        plan: {
          assignment: {
            semesterId: semesterId || undefined,
            teacherId: isTeacher ? session.teacherId! : undefined,
            subject: vpGroupIds ? { subjectGroupId: { in: vpGroupIds } } : undefined,
          },
        },
      },
    },
    include: {
      unit: {
        include: {
          plan: {
            include: {
              assignment: {
                include: {
                  teacher: true,
                  subject: { include: { subjectGroup: true } },
                  semester: true,
                },
              },
            },
          },
        },
      },
      _count: { select: { reviews: true } },
    },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(logs);
}
