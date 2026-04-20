import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

// PATCH /api/supervision/admin/semesters/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json();

  if (body.isActive === true) {
    // deactivate ทั้งหมดก่อน แล้ว activate ตัวที่เลือก
    await prisma.academicSemester.updateMany({ data: { isActive: false } });
  }

  const updated = await prisma.academicSemester.update({
    where: { id },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  await prisma.academicSemester.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
