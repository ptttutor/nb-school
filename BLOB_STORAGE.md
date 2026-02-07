# Vercel Blob Storage Configuration

This project uses Vercel Blob for file uploads with automatic image optimization.

## Features

- **Automatic WebP Conversion**: All uploaded images (JPEG, PNG) are automatically converted to WebP format for optimal file size and performance
- **PDF Support**: PDF files are uploaded as-is without conversion
- **Public Access**: All uploaded files are publicly accessible via Vercel Blob URLs
- **Image Quality**: WebP images are compressed at 85% quality for the best balance between size and visual quality

## Environment Setup

Add the following to your `.env` file:

```env
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

Get your token from: https://vercel.com/dashboard/stores

## Upload Types

### Hero Images (`/api/hero`)
- Used for homepage hero section backgrounds
- Automatically converted to WebP
- Managed through Admin Dashboard → "รูป Hero Section" tab

### Registration Documents (`/api/registration/[id]/documents`)
- Student registration documents (transcripts, ID cards, etc.)
- Images converted to WebP
- PDFs kept in original format
- Max file size: 5MB
- Allowed types: PDF, JPEG, PNG

### General Uploads (`/api/upload`)
- Generic image upload endpoint
- All images converted to WebP
- Returns public Vercel Blob URL

## Dependencies

- `@vercel/blob`: Vercel Blob storage SDK
- `sharp`: High-performance image processing library for Node.js

## File Deletion

When deleting records that contain blob URLs, the system automatically:
1. Deletes the file from Vercel Blob storage
2. Removes the database reference

This prevents orphaned files and keeps storage costs down.

## Next.js Image Configuration

The `next.config.ts` is configured to allow images from:
- `**.public.blob.vercel-storage.com`
- `**.blob.vercel-storage.com`
- Any remote HTTPS sources
- localhost for development

## Migration Notes

Previous local file storage (`/public/uploads/`) has been replaced with Vercel Blob. 
Existing files in `/public/uploads/` will need to be manually migrated if needed.
