import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ค้นหาการสมัครด้วยเลขบัตรประชาชน/พาสปอร์ต
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idCard = searchParams.get("idCard");

    if (!idCard) {
      return NextResponse.json(
        { error: "กรุณาระบุเลขบัตรประชาชน/พาสปอร์ต" },
        { status: 400 }
      );
    }

    // ค้นหาการสมัครด้วยเลขบัตรประชาชน/พาสปอร์ต
    const registration = await prisma.registration.findFirst({
      where: {
        idCardOrPassport: idCard.trim(),
      },
      select: {
        id: true,
        firstNameTH: true,
        lastNameTH: true,
        createdAt: true,
        status: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการสมัครด้วยเลขบัตรประชาชน/พาสปอร์ตนี้" },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการค้นหา" },
      { status: 500 }
    );
  }
}
