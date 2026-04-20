/**
 * Pure helpers สำหรับ supervision module
 * ไม่ใช้ next/headers → ใช้ได้ทั้ง Server และ Client Components
 */
import { SupervisionRole } from "@prisma/client";

export interface SupervisionSession {
  id: string;
  username: string;
  role: SupervisionRole;
  displayName: string;
  teacherId: string | null;
}

export function canReview(role: SupervisionRole): boolean {
  return [
    "SUBJECT_HEAD",
    "ACADEMIC_HEAD",
    "VICE_PRINCIPAL_ACADEMIC",
    "VICE_PRINCIPAL",
    "ACADEMIC_ADMIN",
  ].includes(role);
}

export function canManageSystem(role: SupervisionRole): boolean {
  return role === "ACADEMIC_ADMIN";
}

export function getRoleLabel(role: SupervisionRole): string {
  const labels: Record<SupervisionRole, string> = {
    ACADEMIC_ADMIN: "Admin วิชาการ",
    TEACHER: "ครูผู้สอน",
    SUBJECT_HEAD: "หัวหน้าสาระ",
    ACADEMIC_HEAD: "หัวหน้าวิชาการ",
    VICE_PRINCIPAL_ACADEMIC: "รองผู้อำนวยการฝ่ายวิชาการ",
    VICE_PRINCIPAL: "รองผู้อำนวยการ",
    PRINCIPAL: "ผู้อำนวยการ",
  };
  return labels[role];
}
