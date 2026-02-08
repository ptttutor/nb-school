import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") || "all";
    const gradeLevel = searchParams.get("gradeLevel") || "all";
    const search = searchParams.get("search") || "";

    // Build where clause for filtering
    const where: any = {};
    
    if (status !== "all") {
      where.status = status;
    }
    
    if (gradeLevel !== "all") {
      where.gradeLevel = gradeLevel;
    }
    
    if (search) {
      where.OR = [
        { firstNameTH: { contains: search, mode: 'insensitive' } },
        { lastNameTH: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
      ];
    }

    // Get total count
    const total = await prisma.registration.count({ where });

    // Get paginated registrations
    const registrations = await prisma.registration.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      registrations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "กรุณาระบุข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "สถานะไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(
      { 
        message: "อัพเดทสถานะสำเร็จ",
        registration 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID" },
        { status: 400 }
      );
    }

    // Filter only allowed fields for update
    const allowedFields = [
      'firstNameTH',
      'lastNameTH',
      'phone',
      'houseNumber',
      'moo',
      'road',
      'soi',
      'province',
      'district',
      'subdistrict',
      'postalCode',
      // เกรด M1 (legacy)
      'gradeP4',
      'gradeP5',
      // GPA M1 (ป.4-5)
      'cumulativeGPAP4P5',
      'scienceCumulativeP4P5',
      'mathCumulativeP4P5',
      'englishCumulativeP4P5',
      // GPA M4 (ม.1-3)
      'cumulativeGPAM1M3',
      'scienceCumulativeM1M3',
      'mathCumulativeM1M3',
      'englishCumulativeM1M3',
    ];

    const dataToUpdate: Record<string, any> = {};
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        dataToUpdate[field] = updateData[field];
      }
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(
      { 
        message: "อัพเดทข้อมูลสำเร็จ",
        registration 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating registration:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพเดทข้อมูล" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID" },
        { status: 400 }
      );
    }

    await prisma.registration.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "ลบข้อมูลสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข้อมูล" },
      { status: 500 }
    );
  }
}
