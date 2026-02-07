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

    // Validate file type (images and PDFs)
    const isImage = file.type.startsWith("image/");
    const isPDF = file.type === "application/pdf";
    
    if (!isImage && !isPDF) {
      return NextResponse.json(
        { error: "Only image files and PDF are allowed" },
        { status: 400 }
      );
    }

    // Get file buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);
    let contentType = file.type;
    let filename = "";

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/\s/g, "-");

    // Convert image to WebP format for better compression
    if (isImage) {
      buffer = Buffer.from(await sharp(buffer)
        .webp({ quality: 85 })
        .toBuffer());
      filename = `${timestamp}-${originalName}.webp`;
      contentType = "image/webp";
    } else {
      // Keep PDF as is
      filename = `${timestamp}-${originalName}.pdf`;
    }

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: "public",
      contentType: contentType,
    });

    // Return file URL
    return NextResponse.json(
      {
        success: true,
        url: blob.url,
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
