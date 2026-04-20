import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

export async function GET(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const semesterId = searchParams.get("semesterId");

  const rounds = await prisma.supervisionRound.findMany({
    where: { semesterId: semesterId || undefined },
    orderBy: [{ semesterId: "desc" }, { startDate: "asc" }],
    include: { semester: true },
  });
  return NextResponse.json(rounds);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { name, semesterId, startDate, endDate } = await req.json();
  if (!name || !semesterId)
    return NextResponse.json({ error: "กรุณากรอกชื่อรอบและภาคเรียน" }, { status: 400 });

  const created = await prisma.supervisionRound.create({
    data: {
      name,
      semesterId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
    include: { semester: true },
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

  await prisma.supervisionRound.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
