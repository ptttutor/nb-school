import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก username และ password" },
        { status: 400 }
      );
    }

    // ค้นหาใน SupervisionUser ก่อน
    let sessionData: {
      id: string;
      username: string;
      role: string;
      displayName: string;
      teacherId: string | null;
    } | null = null;

    const supervisionUser = await prisma.supervisionUser.findUnique({
      where: { username },
      include: { teacher: true },
    });

    if (supervisionUser) {
      const isValid = await bcrypt.compare(password, supervisionUser.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
          { status: 401 }
        );
      }
      sessionData = {
        id: supervisionUser.id,
        username: supervisionUser.username,
        role: supervisionUser.role,
        displayName: supervisionUser.displayName,
        teacherId: supervisionUser.teacherId,
      };
    } else {
      // ถ้าไม่พบใน SupervisionUser ให้ลองใช้ Admin account (ระบบสมัครเรียน)
      const adminUser = await prisma.admin.findUnique({ where: { username } });
      if (!adminUser) {
        return NextResponse.json(
          { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
          { status: 401 }
        );
      }
      const isValid = await bcrypt.compare(password, adminUser.password);
      if (!isValid) {
        return NextResponse.json(
          { error: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" },
          { status: 401 }
        );
      }
      sessionData = {
        id: adminUser.id,
        username: adminUser.username,
        role: "ACADEMIC_ADMIN",
        displayName: "ผู้ดูแลระบบ",
        teacherId: null,
      };
    }

    const cookieStore = await cookies();
    cookieStore.set("supervision_session", JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 ชั่วโมง
      path: "/",
    });

    return NextResponse.json({ user: sessionData });
  } catch {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
