import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subjectGroupId = searchParams.get("subjectGroupId");
  const gradeLevel = searchParams.get("gradeLevel");

  const subjects = await prisma.subject.findMany({
    where: {
      subjectGroupId: subjectGroupId || undefined,
      gradeLevel: gradeLevel || undefined,
    },
    orderBy: [{ subjectCode: "asc" }],
    include: { subjectGroup: true, _count: { select: { assignments: true } } },
  });
  return NextResponse.json(subjects);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { subjectCode, subjectName, credits, gradeLevel, subjectGroupId } = await req.json();
  if (!subjectCode || !subjectName || !gradeLevel)
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });

  const created = await prisma.subject.create({
    data: {
      subjectCode,
      subjectName,
      credits: parseFloat(credits) || 1,
      gradeLevel,
      subjectGroupId: subjectGroupId || null,
    },
    include: { subjectGroup: true },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "กรุณาระบุ id" }, { status: 400 });

  await prisma.subject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
