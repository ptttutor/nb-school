import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
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
