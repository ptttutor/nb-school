import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Get file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert image to WebP format for better compression
    const webpBuffer = await sharp(buffer)
      .webp({ quality: 85 }) // ปรับคุณภาพตามต้องการ (1-100)
      .toBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s/g, "-");
    const filename = `${timestamp}-${originalName}.webp`;

    // Upload to Vercel Blob
    const blob = await put(filename, webpBuffer, {
      access: "public",
      contentType: "image/webp",
    });

    // Return file URL
    return NextResponse.json(
      {
        success: true,
        fileUrl: blob.url,
        filename: filename,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
