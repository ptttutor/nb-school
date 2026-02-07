import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ดึงข้อมูลการสมัครตาม ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const registration = await prisma.registration.findUnique({
      where: { id },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการสมัคร" },
        { status: 404 }
      );
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error fetching registration:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

// PATCH - อัปเดตข้อมูล (เกรดเฉลี่ย)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { 
      // เกรดสำหรับ ม.1
      scienceGradeP5, 
      scienceGradeP6, 
      mathGradeP5, 
      mathGradeP6,
      // เกรดสำหรับ ม.4
      scienceGradeM1, 
      scienceGradeM2, 
      scienceGradeM3,
      mathGradeM1, 
      mathGradeM2,
      mathGradeM3,
    } = body;

    const registration = await prisma.registration.update({
      where: { id },
      data: { 
        // อัพเดททุกฟิลด์ที่ส่งมา
        scienceGradeP5,
        scienceGradeP6,
        mathGradeP5,
        mathGradeP6,
        scienceGradeM1,
        scienceGradeM2,
        scienceGradeM3,
        mathGradeM1,
        mathGradeM2,
        mathGradeM3,
      },
    });

    return NextResponse.json({
      message: "อัปเดตเกรดเฉลี่ยสำเร็จ",
      registration,
    });
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}
