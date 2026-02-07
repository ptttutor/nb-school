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

// PATCH - อัปเดตข้อมูลการสมัคร (ยกเว้นเลขบัตรประชาชน)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // ลบฟิลด์ที่ห้ามแก้ไข
    const { idCardOrPassport, ...updateData } = body;

    // กรองเฉพาะค่าที่ไม่ใช่ undefined
    const cleanedData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const registration = await prisma.registration.update({
      where: { id },
      data: cleanedData,
    });

    return NextResponse.json({
      message: "อัปเดตข้อมูลสำเร็จ",
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
