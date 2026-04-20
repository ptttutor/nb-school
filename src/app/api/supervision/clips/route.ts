import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

// คืนกลุ่มสาระที่ VP รับผิดชอบ
async function getVpSubjectGroupIds(vpUserId: string): Promise<string[]> {
  const groups = await prisma.subjectGroup.findMany({
    where: { vicePrincipalId: vpUserId },
    select: { id: true },
  });
  return groups.map((g) => g.id);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "TEACHER")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { planId, clipUrl, roundId } = await req.json();
  if (!planId || !clipUrl)
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });

  // ตรวจสอบว่า plan เป็นของครูนี้
  const plan = await prisma.teachingPlan.findFirst({
    where: { id: planId, assignment: { teacherId: session.teacherId! } },
  });
  if (!plan)
    return NextResponse.json({ error: "ไม่พบแผนการสอน" }, { status: 404 });

  const clip = await prisma.supervisionClip.create({
    data: { planId, clipUrl, status: "SUBMITTED", submittedAt: new Date(), roundId: roundId || null },
  });
  return NextResponse.json(clip, { status: 201 });
}

export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");
  const isTeacher = session.role === "TEACHER";
  const isVP = session.role === "VICE_PRINCIPAL";

  // VP เห็นเฉพาะกลุ่มสาระที่รับผิดชอบ
  let vpGroupIds: string[] | undefined;
  if (isVP) {
    vpGroupIds = await getVpSubjectGroupIds(session.id);
    if (vpGroupIds.length === 0) return NextResponse.json([]);
  }

  const clips = await prisma.supervisionClip.findMany({
    where: {
      plan: {
        assignment: {
          semesterId: semesterId || undefined,
          teacherId: isTeacher ? session.teacherId! : undefined,
          subject: vpGroupIds ? { subjectGroupId: { in: vpGroupIds } } : undefined,
        },
      },
    },
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
      round: { select: { id: true, name: true } },
      _count: { select: { reviews: true } },
    },
    orderBy: { submittedAt: "desc" },
  });
  return NextResponse.json(clips);
}
