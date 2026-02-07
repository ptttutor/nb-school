import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

// GET - ดึงรูป Hero ทั้งหมดที่ active
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get("admin") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const activeFilter = searchParams.get("active") || "all";
    const search = searchParams.get("search") || "";

    // Build where clause for filtering
    const where: any = {};
    
    if (!isAdmin) {
      // For public, only show active images
      where.active = true;
    } else {
      // Admin filters
      if (activeFilter !== "all") {
        where.active = activeFilter === "active";
      }
      
      if (search) {
        where.title = { contains: search, mode: 'insensitive' };
      }
    }

    // For admin, return paginated data
    if (isAdmin) {
      // Get total count
      const total = await prisma.heroImage.count({ where });

      // Get paginated images
      const heroImages = await prisma.heroImage.findMany({
        where,
        orderBy: {
          order: 'asc',
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return NextResponse.json({
        heroImages,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // For public, return all active images without pagination
    const heroImages = await prisma.heroImage.findMany({
      where,
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(heroImages);
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero images" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มรูป Hero ใหม่ (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageUrl, title, order, active } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const heroImage = await prisma.heroImage.create({
      data: {
        imageUrl,
        title: title || null,
        order: order || 0,
        active: active !== undefined ? active : true,
      },
    });

    return NextResponse.json(heroImage, { status: 201 });
  } catch (error) {
    console.error("Error creating hero image:", error);
    return NextResponse.json(
      { error: "Failed to create hero image" },
      { status: 500 }
    );
  }
}

// PATCH - อัพเดทรูป Hero (Admin only)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, imageUrl, title, order, active } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (title !== undefined) updateData.title = title;
    if (order !== undefined) updateData.order = order;
    if (active !== undefined) updateData.active = active;

    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(heroImage);
  } catch (error) {
    console.error("Error updating hero image:", error);
    return NextResponse.json(
      { error: "Failed to update hero image" },
      { status: 500 }
    );
  }
}

// DELETE - ลบรูป Hero (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // ดึงข้อมูลรูปก่อนเพื่อลบจาก Vercel Blob
    const heroImage = await prisma.heroImage.findUnique({
      where: { id },
    });

    if (heroImage?.imageUrl) {
      try {
        await del(heroImage.imageUrl);
      } catch (error) {
        console.error("Error deleting from blob:", error);
        // ดำเนินการต่อแม้ว่าจะลบไฟล์ไม่สำเร็จ
      }
    }

    await prisma.heroImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Hero image deleted successfully" });
  } catch (error) {
    console.error("Error deleting hero image:", error);
    return NextResponse.json(
      { error: "Failed to delete hero image" },
      { status: 500 }
    );
  }
}
