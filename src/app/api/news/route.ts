import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - ดึงข่าวทั้งหมด (เฉพาะที่ publish แล้วสำหรับ public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const published = searchParams.get("published") || "all";
    const search = searchParams.get("search") || "";

    // Build where clause for filtering
    const where: any = {};
    
    if (!isAdmin) {
      where.published = true;
    } else {
      // Admin filters
      if (published !== "all") {
        where.published = published === "published";
      }
      
      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } },
        ];
      }
    }

    // For admin, return paginated data
    if (isAdmin) {
      // Get total count
      const total = await prisma.news.count({ where });

      // Get paginated news
      const news = await prisma.news.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          admin: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return NextResponse.json({
        news,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }, { status: 200 });
    }

    // For public, return all published news without pagination
    const news = await prisma.news.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        admin: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(news, { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลข่าว" },
      { status: 500 }
    );
  }
}

// POST - สร้างข่าวใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, imageUrl, published, adminId } = body;

    if (!title || !content || !adminId) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        published: published || false,
        adminId,
      },
    });

    return NextResponse.json(
      {
        message: "สร้างข่าวสำเร็จ",
        news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างข่าว" },
      { status: 500 }
    );
  }
}

// PUT - อัพเดทข่าว
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, content, imageUrl, published } = body;

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID ของข่าว" },
        { status: 400 }
      );
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(
      {
        message: "อัพเดทข่าวสำเร็จ",
        news,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพเดทข่าว" },
      { status: 500 }
    );
  }
}

// DELETE - ลบข่าว
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID ของข่าว" },
        { status: 400 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "ลบข่าวสำเร็จ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบข่าว" },
      { status: 500 }
    );
  }
}
