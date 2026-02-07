import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const gradeLevel = searchParams.get("gradeLevel") || "all";
    const search = searchParams.get("search") || "";

    // Build where clause for filtering
    const where: any = {};
    
    if (gradeLevel !== "all") {
      where.gradeLevel = gradeLevel;
    }
    
    if (search) {
      where.OR = [
        { firstNameTH: { contains: search, mode: 'insensitive' } },
        { lastNameTH: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.registration.count({ where });

    // Get paginated registrations with only public fields
    const registrations = await prisma.registration.findMany({
      where,
      select: {
        id: true,
        title: true,
        firstNameTH: true,
        lastNameTH: true,
        gradeLevel: true,
        isSpecialISM: true,
        schoolName: true,
        province: true,
        photoDoc: true,
        houseRegistrationDoc: true,
        transcriptDoc: true,
        createdAt: true,
      },
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
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    );
  }
}
