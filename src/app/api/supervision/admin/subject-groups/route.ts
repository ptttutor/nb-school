import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

export async function GET() {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const groups = await prisma.subjectGroup.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { subjects: true, teachers: true } } },
  });
  return NextResponse.json(groups);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, vicePrincipalId } = await req.json();
  if (!name) return NextResponse.json({ error: "กรุณากรอกชื่อกลุ่มสาระ" }, { status: 400 });

  const created = await prisma.subjectGroup.create({
    data: { name, vicePrincipalId: vicePrincipalId || null },
  });
  return NextResponse.json(created, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, vicePrincipalId } = await req.json();
  if (!id) return NextResponse.json({ error: "กรุณาระบุ id" }, { status: 400 });

  const updated = await prisma.subjectGroup.update({
    where: { id },
    data: { vicePrincipalId: vicePrincipalId || null },
  });
  return NextResponse.json(updated);
}
