import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  // ครูแก้ไขได้เฉพาะ driveLink, units
  if (session.role === "TEACHER") {
    const plan = await prisma.teachingPlan.findFirst({
      where: { id, assignment: { teacherId: session.teacherId! } },
    });
    if (!plan) return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });

    const updated = await prisma.teachingPlan.update({
      where: { id },
      data: {
        driveLink: body.driveLink,
        status: body.driveLink ? "SUBMITTED" : "NOT_SUBMITTED",
        submittedAt: body.driveLink ? new Date() : null,
      },
    });

    // อัปเดต units ถ้ามี
    if (body.units) {
      await prisma.planUnit.deleteMany({ where: { planId: id } });
      if (body.units.length > 0) {
        await prisma.planUnit.createMany({
          data: body.units.map((u: { unitName: string }, i: number) => ({
            planId: id,
            unitNumber: i + 1,
            unitName: u.unitName,
          })),
        });
      }
    }
    return NextResponse.json(updated);
  }

  // ผู้ตรวจอัปเดต status
  if (["SUBJECT_HEAD", "ACADEMIC_HEAD", "VICE_PRINCIPAL_ACADEMIC", "ACADEMIC_ADMIN"].includes(session.role)) {
    const updated = await prisma.teachingPlan.update({
      where: { id },
      data: { status: body.status },
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const plan = await prisma.teachingPlan.findUnique({
    where: { id },
    include: {
      assignment: {
        include: {
          teacher: true,
          subject: { include: { subjectGroup: true } },
          semester: true,
        },
      },
      units: {
        include: {
          teachingLogs: true,
        },
        orderBy: { unitNumber: "asc" },
      },
      clips: true,
      reviews: {
        include: { reviewer: { select: { displayName: true, role: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!plan) return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
  return NextResponse.json(plan);
}
