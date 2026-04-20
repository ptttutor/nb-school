import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getSupervisionSession } from "@/lib/supervision-auth";
import { SupervisionRole } from "@prisma/client";

export async function GET() {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.supervisionUser.findMany({
    orderBy: { createdAt: "asc" },
    include: { teacher: { select: { firstName: true, lastName: true, teacherCode: true } } },
  });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { username, password, role, displayName, teacherId } = await req.json();
  if (!username || !password || !role || !displayName)
    return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });

  const hashed = await bcrypt.hash(password, 10);
  const created = await prisma.supervisionUser.create({
    data: {
      username,
      password: hashed,
      role: role as SupervisionRole,
      displayName,
      teacherId: teacherId || null,
    },
  });
  return NextResponse.json(
    { id: created.id, username: created.username, role: created.role, displayName: created.displayName },
    { status: 201 }
  );
}
