import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const gradeLevel = searchParams.get("gradeLevel") || "all";
    const search = searchParams.get("search") || "";

    // Build where clause for filtering (same as main list)
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

    // Count registrations with all documents
    const withAllDocs = await prisma.registration.count({
      where: {
        ...where,
        AND: [
          { photoDoc: { not: null } },
          { houseRegistrationDoc: { not: null } },
          { transcriptDoc: { not: null } },
        ],
      },
    });

    // Count registrations with incomplete documents
    const withIncompleteDocs = total - withAllDocs;

    return NextResponse.json({
      total,
      withAllDocuments: withAllDocs,
      withIncompleteDocuments: withIncompleteDocs,
    });
  } catch (error) {
    console.error("Error fetching applicants stats:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงสถิติ" },
      { status: 500 }
    );
  }
}
