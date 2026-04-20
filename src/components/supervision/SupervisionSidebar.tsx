"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getRoleLabel, SupervisionSession } from "@/lib/supervision-utils";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const navByRole: Record<string, NavItem[]> = {
  ACADEMIC_ADMIN: [
    { href: "/supervision/admin", label: "ภาพรวมระบบ", icon: "" },
    { href: "/supervision/admin/semesters", label: "ปีการศึกษา/ภาคเรียน", icon: "" },
    { href: "/supervision/admin/subject-groups", label: "กลุ่มสาระ", icon: "" },
    { href: "/supervision/admin/teachers", label: "ครูผู้สอน", icon: "" },
    { href: "/supervision/admin/subjects", label: "รายวิชา", icon: "" },
    { href: "/supervision/admin/assignments", label: "มอบหมายการสอน", icon: "" },
    { href: "/supervision/admin/users", label: "จัดการผู้ใช้", icon: "" },
    { href: "/supervision/admin/supervision-rounds", label: "รอบนิเทศ", icon: "" },
  ],
  TEACHER: [
    { href: "/supervision/teacher", label: "ภาพรวม", icon: "" },
    { href: "/supervision/teacher/plans", label: "แผนการสอน", icon: "" },
    { href: "/supervision/teacher/clips", label: "คลิปการสอน", icon: "" },
    { href: "/supervision/teacher/logs", label: "บันทึกหลังสอน", icon: "" },
    { href: "/supervision/teacher/feedback", label: "ผลการตรวจ/ข้อเสนอแนะ", icon: "" },
  ],
  SUBJECT_HEAD: [
    { href: "/supervision/review", label: "ภาพรวมสาระ", icon: "" },
    { href: "/supervision/review/plans", label: "ตรวจแผนการสอน", icon: "" },
    { href: "/supervision/review/clips", label: "ตรวจคลิปการสอน", icon: "" },
    { href: "/supervision/review/logs", label: "ตรวจบันทึกหลังสอน", icon: "" },
  ],
  ACADEMIC_HEAD: [
    { href: "/supervision/review", label: "ภาพรวมวิชาการ", icon: "" },
    { href: "/supervision/review/plans", label: "ตรวจแผนการสอน", icon: "" },
    { href: "/supervision/review/clips", label: "ตรวจคลิปการสอน", icon: "" },
    { href: "/supervision/review/logs", label: "ตรวจบันทึกหลังสอน", icon: "" },
  ],
  VICE_PRINCIPAL_ACADEMIC: [
    { href: "/supervision/review", label: "ภาพรวม", icon: "" },
    { href: "/supervision/review/plans", label: "กำกับแผนการสอน", icon: "" },
    { href: "/supervision/review/clips", label: "นิเทศ/ติดตาม", icon: "" },
    { href: "/supervision/review/logs", label: "บันทึกหลังสอน", icon: "" },
    { href: "/supervision/dashboard", label: "รายงานสรุป", icon: "" },
  ],
  VICE_PRINCIPAL: [
    { href: "/supervision/review", label: "กลุ่มสาระที่รับผิดชอบ", icon: "" },
    { href: "/supervision/review/clips", label: "นิเทศออนไลน์", icon: "" },
  ],
  PRINCIPAL: [
    { href: "/supervision/dashboard", label: "Dashboard", icon: "" },
  ],
};

export default function SupervisionSidebar({ session }: { session: SupervisionSession }) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = navByRole[session.role] ?? [];

  async function handleLogout() {
    await fetch("/api/supervision/auth/session", { method: "POST" });
    router.push("/supervision/login");
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">N</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{session.displayName}</p>
            <p className="text-xs text-gray-500">{getRoleLabel(session.role)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
