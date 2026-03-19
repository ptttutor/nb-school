import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const gradeLevel = searchParams.get("gradeLevel") || "all";
    const ismFilter = searchParams.get("ismFilter") || "all";
    const docFilter = searchParams.get("docFilter") || "all";
    const search = searchParams.get("search") || "";

    // Build where clause using AND to support all filters cleanly
    const conditions: any[] = [];

    if (gradeLevel !== "all") {
      conditions.push({ gradeLevel });
    }

    if (ismFilter === "ism") {
      conditions.push({ isSpecialISM: true });
    } else if (ismFilter === "regular") {
      conditions.push({ isSpecialISM: false });
    }

    if (docFilter === "complete") {
      conditions.push({ photoDoc: { not: null } });
      conditions.push({ houseRegistrationDoc: { not: null } });
      conditions.push({ transcriptDoc: { not: null } });
    } else if (docFilter === "incomplete") {
      conditions.push({
        OR: [
          { photoDoc: null },
          { houseRegistrationDoc: null },
          { transcriptDoc: null },
        ],
      });
    }

    if (search) {
      conditions.push({
        OR: [
          { firstNameTH: { contains: search, mode: 'insensitive' } },
          { lastNameTH: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const where: any = conditions.length > 0 ? { AND: conditions } : {};

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
