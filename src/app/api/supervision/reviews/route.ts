import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSupervisionSession } from "@/lib/supervision-auth";
import { canReview } from "@/lib/supervision-utils";

// POST /api/supervision/reviews - บันทึกข้อเสนอแนะ
export async function POST(req: NextRequest) {
  const session = await getSupervisionSession();
  if (!session || !canReview(session.role))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { planId, clipId, logId, comment, decision } = await req.json();
  if (!comment)
    return NextResponse.json({ error: "กรุณากรอกข้อเสนอแนะ" }, { status: 400 });
  if (!planId && !clipId && !logId)
    return NextResponse.json({ error: "กรุณาระบุสิ่งที่ตรวจ" }, { status: 400 });

  const review = await prisma.reviewRecord.create({
    data: {
      reviewerId: session.id,
      planId: planId || null,
      clipId: clipId || null,
      logId: logId || null,
      comment,
      decision: decision || null,
    },
  });

  // อัปเดต status ตาม decision
  if (planId && decision) {
    const statusMap: Record<string, string> = {
      approved: "APPROVED",
      revision_required: "REVISION_REQUIRED",
    };
    if (statusMap[decision]) {
      await prisma.teachingPlan.update({
        where: { id: planId },
        data: { status: statusMap[decision] as "APPROVED" | "REVISION_REQUIRED" },
      });
    }
  }
  if (clipId && decision) {
    const statusMap: Record<string, string> = {
      completed:   "COMPLETED",
      supervising: "SUPERVISING",
      noted:       "SUPERVISING",
    };
    if (statusMap[decision]) {
      await prisma.supervisionClip.update({
        where: { id: clipId },
        data: { status: statusMap[decision] as "COMPLETED" | "SUPERVISING" },
      });
    }
  }
  if (logId && decision) {
    const statusMap: Record<string, string> = {
      approved: "APPROVED",
      revision_required: "REVISION_REQUIRED",
    };
    if (statusMap[decision]) {
      await prisma.teachingLog.update({
        where: { id: logId },
        data: { status: statusMap[decision] as "APPROVED" | "REVISION_REQUIRED" },
      });
    }
  }

  return NextResponse.json(review, { status: 201 });
}
