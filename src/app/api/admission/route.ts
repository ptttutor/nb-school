import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ดึงข้อมูล admission settings ตาม grade level
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const gradeLevel = searchParams.get("gradeLevel");

    if (!gradeLevel) {
      return NextResponse.json(
        { error: "กรุณาระบุระดับชั้น (gradeLevel)" },
        { status: 400 }
      );
    }

    let settings = await prisma.admissionSettings.findUnique({
      where: { gradeLevel },
    });

    // ถ้ายังไม่มี settings สร้างค่า default
    if (!settings) {
      settings = await prisma.admissionSettings.create({
        data: {
          gradeLevel,
          isOpen: false,
          allowISM: true,
          allowRegular: true,
        },
      });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Get admission settings error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

// PUT - อัปเดต admission settings (สำหรับ Admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      gradeLevel,
      isOpen,
      startDate,
      endDate,
      schedule,
      requirements,
      announcement,
      allowISM,
      allowRegular,
    } = body;

    if (!gradeLevel) {
      return NextResponse.json(
        { error: "กรุณาระบุระดับชั้น (gradeLevel)" },
        { status: 400 }
      );
    }

    // ตรวจสอบว่ามี settings อยู่แล้วหรือไม่
    const existing = await prisma.admissionSettings.findUnique({
      where: { gradeLevel },
    });

    let settings;
    if (existing) {
      // อัปเดต
      settings = await prisma.admissionSettings.update({
        where: { gradeLevel },
        data: {
          isOpen: isOpen !== undefined ? isOpen : existing.isOpen,
          startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : existing.startDate,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : existing.endDate,
          schedule: schedule !== undefined ? schedule : existing.schedule,
          requirements: requirements !== undefined ? requirements : existing.requirements,
          announcement: announcement !== undefined ? announcement : existing.announcement,
          allowISM: allowISM !== undefined ? allowISM : existing.allowISM,
          allowRegular: allowRegular !== undefined ? allowRegular : existing.allowRegular,
        },
      });
    } else {
      // สร้างใหม่
      settings = await prisma.admissionSettings.create({
        data: {
          gradeLevel,
          isOpen: isOpen || false,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          schedule,
          requirements,
          announcement,
          allowISM: allowISM !== undefined ? allowISM : true,
          allowRegular: allowRegular !== undefined ? allowRegular : true,
        },
      });
    }

    return NextResponse.json(
      {
        message: "อัปเดตการตั้งค่าสำเร็จ",
        settings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update admission settings error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" },
      { status: 500 }
    );
  }
}
