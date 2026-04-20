import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const subjectGroupId = searchParams.get("subjectGroupId");

  const teachers = await prisma.supervisionTeacher.findMany({
    where: subjectGroupId ? { subjectGroupId } : undefined,
    orderBy: [{ firstName: "asc" }],
    include: { subjectGroup: true, user: { select: { id: true, username: true, role: true } } },
  });
  return NextResponse.json(teachers);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { teacherCode, prefix, firstName, lastName, subjectGroupId } = await req.json();
  if (!teacherCode || !firstName || !lastName)
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });

  const created = await prisma.supervisionTeacher.create({
    data: {
      teacherCode,
      prefix: prefix || "",
      firstName,
      lastName,
      subjectGroupId: subjectGroupId || null,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
