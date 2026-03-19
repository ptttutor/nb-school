import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ค้นหาการสมัครด้วยเลขบัตรประชาชน
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCard = searchParams.get("idCard");

    if (!idCard) {
      return NextResponse.json(
        { error: "กรุณาระบุเลขบัตรประชาชน" },
        { status: 400 }
      );
    }

    // ค้นหาการสมัครทั้งหมดด้วยเลขบัตรประชาชน
    const registrations = await prisma.registration.findMany({
      where: {
        idCardOrPassport: idCard.trim(),
      },
      select: {
        id: true,
        firstNameTH: true,
        lastNameTH: true,
        gradeLevel: true,
        isSpecialISM: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!registrations.length) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการสมัครด้วยเลขบัตรประชาชนนี้" },
        { status: 404 }
      );
    }

    // ถ้ามีแค่รายการเดียว ส่ง id กลับตรงๆ (backward compat)
    if (registrations.length === 1) {
      return NextResponse.json(registrations[0]);
    }

    // ถ้ามีหลายรายการ ส่ง array กลับ
    return NextResponse.json({ multiple: true, registrations });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการค้นหา" },
      { status: 500 }
    );
  }
}
