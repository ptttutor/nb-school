import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put, del } from "@vercel/blob";
import sharp from "sharp";

// POST - อัพโหลดเอกสาร
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "กรุณาเลือกไฟล์" },
        { status: 400 }
      );
    }

    // ตรวจสอบประเภทไฟล์
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์ PDF, JPG, PNG เท่านั้น" },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "ขนาดไฟล์ต้องไม่เกิน 5MB" },
        { status: 400 }
      );
    }

    // สร้างชื่อไฟล์ที่ไม่ซ้ำ
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    let fileName = `${id}_${timestamp}_${file.name}`;
    let contentType = file.type;

    // ถ้าเป็นรูปภาพ แปลงเป็น WebP
    if (file.type.startsWith("image/")) {
      buffer = await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer();
      
      // เปลี่ยนนามสกุลไฟล์เป็น .webp
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      fileName = `${id}_${timestamp}_${nameWithoutExt}.webp`;
      contentType = "image/webp";
    }

    // Upload ไปยัง Vercel Blob
    const blob = await put(fileName, buffer, {
      access: "public",
      contentType: contentType,
    });

    // อัปเดตข้อมูลในฐานข้อมูล
    const fileUrl = blob.url;
    const registration = await prisma.registration.findUnique({
      where: { id },
      select: { documents: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการสมัคร" },
        { status: 404 }
      );
    }

    const updatedDocuments = [...registration.documents, fileUrl];

    await prisma.registration.update({
      where: { id },
      data: { documents: updatedDocuments },
    });

    return NextResponse.json({
      message: "อัพโหลดเอกสารสำเร็จ",
      fileUrl,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพโหลดเอกสาร" },
      { status: 500 }
    );
  }
}

// DELETE - ลบเอกสาร
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const documentUrl = searchParams.get("url");

    if (!documentUrl) {
      return NextResponse.json(
        { error: "กรุณาระบุ URL ของเอกสาร" },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { id },
      select: { documents: true },
    });

    if (!registration) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลการสมัคร" },
        { status: 404 }
      );
    }

    // ลบไฟล์จาก Vercel Blob
    try {
      await del(documentUrl);
    } catch (error) {
      console.error("Error deleting from blob:", error);
      // ดำเนินการต่อแม้ว่าจะลบไฟล์ไม่สำเร็จ เพื่ออัพเดท database
    }

    const updatedDocuments = registration.documents.filter(
      (doc) => doc !== documentUrl
    );

    await prisma.registration.update({
      where: { id },
      data: { documents: updatedDocuments },
    });

    return NextResponse.json({
      message: "ลบเอกสารสำเร็จ",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบเอกสาร" },
      { status: 500 }
    );
  }
}
