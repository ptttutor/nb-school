import { getSupervisionSession } from "@/lib/supervision-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SupervisionAdminPage() {
  const session = await getSupervisionSession();
  if (!session || session.role !== "ACADEMIC_ADMIN") redirect("/supervision");

  const [teachers, subjects, semesters, users, groups] = await Promise.all([
    prisma.supervisionTeacher.count(),
    prisma.subject.count(),
    prisma.academicSemester.findFirst({ where: { isActive: true } }),
    prisma.supervisionUser.count(),
    prisma.subjectGroup.count(),
  ]);

  const stats = semesters
    ? await prisma.teacherSubjectAssignment.count({ where: { semesterId: semesters.id } })
    : 0;

  const menuItems = [
    { href: "/supervision/admin/semesters", label: "ปีการศึกษา/ภาคเรียน", icon: "", desc: "กำหนดภาคเรียนและปฏิทินการส่งงาน" },
    { href: "/supervision/admin/subject-groups", label: "กลุ่มสาระ", icon: "", desc: "จัดการกลุ่มสาระการเรียนรู้" },
    { href: "/supervision/admin/teachers", label: "ครูผู้สอน", icon: "", desc: "เพิ่ม/แก้ไขข้อมูลครู" },
    { href: "/supervision/admin/subjects", label: "รายวิชา", icon: "", desc: "จัดการรายวิชาทั้งหมด" },
    { href: "/supervision/admin/assignments", label: "มอบหมายการสอน", icon: "", desc: "กำหนดครูสอนวิชาและห้องเรียน" },
    { href: "/supervision/admin/users", label: "จัดการผู้ใช้", icon: "", desc: "เพิ่ม/แก้ไขบัญชีผู้ใช้งาน" },
    { href: "/supervision/admin/supervision-rounds", label: "รอบนิเทศ", icon: "", desc: "กำหนดรอบนิเทศภายใน" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ระบบนิเทศภายใน — Admin วิชาการ</h1>
        <p className="text-gray-500 text-sm mt-1">จัดการข้อมูลพื้นฐานและกำหนดค่าระบบ</p>
      </div>

      {/* สรุปภาพรวม */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-blue-600">{teachers}</div>
            <div className="text-sm text-gray-500 mt-1">ครูผู้สอน</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-600">{subjects}</div>
            <div className="text-sm text-gray-500 mt-1">รายวิชา</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-purple-600">{groups}</div>
            <div className="text-sm text-gray-500 mt-1">กลุ่มสาระ</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-orange-600">{users}</div>
            <div className="text-sm text-gray-500 mt-1">ผู้ใช้งาน</div>
          </CardContent>
        </Card>
      </div>

      {semesters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800">
            ภาคเรียนที่กำลังดำเนินการ: ปีการศึกษา {semesters.year} ภาคเรียน {semesters.semester}
            {stats > 0 && <span className="ml-2 text-blue-600">({stats} รายการมอบหมายการสอน)</span>}
          </p>
        </div>
      )}

      {/* เมนูหลัก */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
