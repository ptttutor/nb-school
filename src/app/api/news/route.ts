import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    const { title, content, imageUrl, fileUrl, published, adminId } = body;

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
        fileUrl: fileUrl || null,
        published: published || false,
        adminId,
      },
    });

    // Revalidate home page to show new news
    revalidatePath('/');

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
    const { id, title, content, imageUrl, fileUrl, published } = body;

    console.log('PUT /api/news - Received body:', { id, title, content, imageUrl, fileUrl, published });

    if (!id) {
      return NextResponse.json(
        { error: "กรุณาระบุ ID ของข่าว" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (fileUrl !== undefined) updateData.fileUrl = fileUrl;
    if (published !== undefined) updateData.published = published;

    console.log('PUT /api/news - Update data:', updateData);

    const news = await prisma.news.update({
      where: { id },
      data: updateData,
    });

    console.log('PUT /api/news - Updated news:', news);

    // Revalidate home page to show updated news (especially when published status changes)
    revalidatePath('/');

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

    // Revalidate home page after deleting news
    revalidatePath('/');

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
