import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";

// GET /api/supervision/teacher/reviews - ดูผลการตรวจทั้งหมดของครู
export async function GET() {
  const session = await getSupervisionSession();
  if (!session || session.role !== "TEACHER" || !session.teacherId)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const teacherId = session.teacherId;

  // ดึง reviews สำหรับแผนการสอนของครู
  const planReviews = await prisma.reviewRecord.findMany({
    where: { plan: { assignment: { teacherId } } },
    include: {
      reviewer: { select: { displayName: true, role: true } },
      plan: {
        include: {
          assignment: {
            include: { subject: true, semester: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ดึง reviews สำหรับคลิปการสอนของครู
  const clipReviews = await prisma.reviewRecord.findMany({
    where: { clip: { plan: { assignment: { teacherId } } } },
    include: {
      reviewer: { select: { displayName: true, role: true } },
      clip: {
        include: {
          plan: {
            include: {
              assignment: {
                include: { subject: true, semester: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // ดึง reviews สำหรับบันทึกหลังสอนของครู
  const logReviews = await prisma.reviewRecord.findMany({
    where: { log: { unit: { plan: { assignment: { teacherId } } } } },
    include: {
      reviewer: { select: { displayName: true, role: true } },
      log: {
        include: {
          unit: {
            include: {
              plan: {
                include: {
                  assignment: {
                    include: { subject: true, semester: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ planReviews, clipReviews, logReviews });
}
