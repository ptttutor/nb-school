import { getSupervisionSession } from "@/lib/supervision-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getSupervisionSession();
  if (!session) redirect("/supervision/login");

  const allowedRoles = ["PRINCIPAL", "VICE_PRINCIPAL_ACADEMIC", "ACADEMIC_ADMIN", "ACADEMIC_HEAD"];
  if (!allowedRoles.includes(session.role)) redirect("/supervision");

  const semester = await prisma.academicSemester.findFirst({ where: { isActive: true } });

  const [
    totalTeachers,
    totalAssignments,
    plansSubmitted,
    plansApproved,
    clipsSubmitted,
    clipsCompleted,
    logsSubmitted,
    logsApproved,
  ] = await Promise.all([
    prisma.supervisionTeacher.count(),
    prisma.teacherSubjectAssignment.count({ where: { semesterId: semester?.id } }),
    prisma.teachingPlan.count({ where: { assignment: { semesterId: semester?.id }, status: { not: "NOT_SUBMITTED" } } }),
    prisma.teachingPlan.count({ where: { assignment: { semesterId: semester?.id }, status: "APPROVED" } }),
    prisma.supervisionClip.count({ where: { plan: { assignment: { semesterId: semester?.id } }, status: { not: "NOT_SUBMITTED" } } }),
    prisma.supervisionClip.count({ where: { plan: { assignment: { semesterId: semester?.id } }, status: "COMPLETED" } }),
    prisma.teachingLog.count({ where: { unit: { plan: { assignment: { semesterId: semester?.id } } }, status: { not: "NOT_SUBMITTED" } } }),
    prisma.teachingLog.count({ where: { unit: { plan: { assignment: { semesterId: semester?.id } } }, status: "APPROVED" } }),
  ]);

  // สรุปแยกตามกลุ่มสาระ + VP
  const subjectGroups = await prisma.subjectGroup.findMany({
    include: {
      teachers: {
        include: {
          assignments: {
            where: { semesterId: semester?.id },
            include: { teachingPlan: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const groupStats = subjectGroups.map((g) => {
    const assignments = g.teachers.flatMap((t) => t.assignments);
    const plans = assignments.map((a) => a.teachingPlan).filter(Boolean);
    return {
      name: g.name,
      vicePrincipalId: g.vicePrincipalId,
      totalAssignments: assignments.length,
      plansSubmitted: plans.filter((p) => p?.status !== "NOT_SUBMITTED").length,
      plansApproved: plans.filter((p) => p?.status === "APPROVED").length,
    };
  });

  // สรุปแยกตามรองผู้อำนวยการ
  const vpUsers = await prisma.supervisionUser.findMany({
    where: { role: { in: ["VICE_PRINCIPAL", "VICE_PRINCIPAL_ACADEMIC"] } },
    select: { id: true, displayName: true, role: true },
  });
  const vpStats = vpUsers.map((vp) => {
    const responsible = groupStats.filter((g) => g.vicePrincipalId === vp.id);
    return {
      displayName: vp.displayName,
      role: vp.role,
      groups: responsible.map((g) => g.name),
      totalAssignments: responsible.reduce((s, g) => s + g.totalAssignments, 0),
      plansApproved: responsible.reduce((s, g) => s + g.plansApproved, 0),
      plansSubmitted: responsible.reduce((s, g) => s + g.plansSubmitted, 0),
    };
  });

  // ครูที่ยังส่งไม่ครบ
  const allTeachers = await prisma.supervisionTeacher.findMany({
    include: {
      assignments: {
        where: { semesterId: semester?.id },
        include: {
          teachingPlan: {
            include: { clips: true, units: { include: { teachingLogs: true } } },
          },
        },
      },
      subjectGroup: true,
    },
    orderBy: [{ firstName: "asc" }],
  });

  const incompleteTeachers = allTeachers
    .filter((t) => {
      if (t.assignments.length === 0) return false;
      return t.assignments.some((a) => {
        const noPlan = !a.teachingPlan || a.teachingPlan.status === "NOT_SUBMITTED";
        const noClip = !a.teachingPlan || a.teachingPlan.clips.length === 0;
        const noLog = !a.teachingPlan || a.teachingPlan.units.every((u) => u.teachingLogs.length === 0);
        return noPlan || noClip || noLog;
      });
    })
    .map((t) => {
      const missingItems: string[] = [];
      const hasPlan = t.assignments.some((a) => a.teachingPlan && a.teachingPlan.status !== "NOT_SUBMITTED");
      const hasClip = t.assignments.some((a) => a.teachingPlan && a.teachingPlan.clips.length > 0);
      const hasLog = t.assignments.some((a) => a.teachingPlan && a.teachingPlan.units.some((u) => u.teachingLogs.length > 0));
      if (!hasPlan) missingItems.push("แผนการสอน");
      if (!hasClip) missingItems.push("คลิปการสอน");
      if (!hasLog) missingItems.push("บันทึกหลังสอน");
      return {
        name: `${t.prefix}${t.firstName} ${t.lastName}`,
        group: t.subjectGroup?.name ?? "—",
        missing: missingItems,
      };
    })
    .slice(0, 30); // จำกัด 30 รายการ

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard ภาพรวมระบบนิเทศ</h1>
        {semester && (
          <p className="text-sm text-gray-500 mt-1">ปีการศึกษา {semester.year} ภาคเรียน {semester.semester}</p>
        )}
      </div>

      {/* สรุปตัวเลขหลัก */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-blue-600">{totalTeachers}</div>
            <div className="text-sm text-gray-500 mt-1">ครูทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-600">{totalAssignments}</div>
            <div className="text-sm text-gray-500 mt-1">รายวิชาที่มอบหมาย</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-600">{plansApproved}</div>
            <div className="text-sm text-gray-500 mt-1">แผนผ่านแล้ว</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-yellow-600">{plansSubmitted - plansApproved}</div>
            <div className="text-sm text-gray-500 mt-1">แผนรอตรวจ</div>
          </CardContent>
        </Card>
      </div>

      {/* สรุปแต่ละโมดูล */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">📝 แผนการสอน</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ส่งแล้ว</span>
              <span className="font-medium">{plansSubmitted} / {totalAssignments}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 rounded-full h-2" style={{ width: totalAssignments > 0 ? `${(plansSubmitted / totalAssignments) * 100}%` : "0%" }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ผ่านแล้ว</span>
              <span className="font-medium text-green-600">{plansApproved}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">🎬 คลิปการสอน</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ส่งแล้ว</span>
              <span className="font-medium">{clipsSubmitted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">นิเทศสมบูรณ์</span>
              <span className="font-medium text-green-600">{clipsCompleted}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">📓 บันทึกหลังสอน</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">บันทึกแล้ว</span>
              <span className="font-medium">{logsSubmitted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ผ่านแล้ว</span>
              <span className="font-medium text-green-600">{logsApproved}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* สรุปแยกตามกลุ่มสาระ */}
      <Card>
        <CardHeader><CardTitle className="text-base">สรุปแยกตามกลุ่มสาระ</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium">กลุ่มสาระ</th>
                  <th className="px-3 py-2 text-center font-medium">รายวิชา</th>
                  <th className="px-3 py-2 text-center font-medium">ส่งแผนแล้ว</th>
                  <th className="px-3 py-2 text-center font-medium">ผ่านแผน</th>
                  <th className="px-3 py-2 text-center font-medium">% ความก้าวหน้า</th>
                </tr>
              </thead>
              <tbody>
                {groupStats.map((g) => (
                  <tr key={g.name} className="border-t">
                    <td className="px-3 py-2">{g.name}</td>
                    <td className="px-3 py-2 text-center">{g.totalAssignments}</td>
                    <td className="px-3 py-2 text-center">{g.plansSubmitted}</td>
                    <td className="px-3 py-2 text-center text-green-600 font-medium">{g.plansApproved}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-green-500 rounded-full h-1.5"
                            style={{ width: g.totalAssignments > 0 ? `${(g.plansApproved / g.totalAssignments) * 100}%` : "0%" }} />
                        </div>
                        <span className="text-xs text-gray-500">
                          {g.totalAssignments > 0 ? Math.round((g.plansApproved / g.totalAssignments) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {groupStats.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-500">ยังไม่มีข้อมูล</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* สรุปแยกตามรองผู้อำนวยการ */}
      {vpStats.some((v) => v.groups.length > 0) && (
        <Card>
          <CardHeader><CardTitle className="text-base">สรุปแยกตามรองผู้อำนวยการผู้รับผิดชอบ</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium">รองผู้อำนวยการ</th>
                    <th className="px-3 py-2 text-left font-medium">กลุ่มสาระรับผิดชอบ</th>
                    <th className="px-3 py-2 text-center font-medium">รายวิชา</th>
                    <th className="px-3 py-2 text-center font-medium">ส่งแผน</th>
                    <th className="px-3 py-2 text-center font-medium">ผ่านแผน</th>
                  </tr>
                </thead>
                <tbody>
                  {vpStats.filter((v) => v.groups.length > 0).map((v) => (
                    <tr key={v.displayName} className="border-t">
                      <td className="px-3 py-2 font-medium">{v.displayName}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{v.groups.join(", ")}</td>
                      <td className="px-3 py-2 text-center">{v.totalAssignments}</td>
                      <td className="px-3 py-2 text-center">{v.plansSubmitted}</td>
                      <td className="px-3 py-2 text-center text-green-600 font-medium">{v.plansApproved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* รายชื่อครูที่ยังส่งไม่ครบ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            ครูที่ยังส่งไม่ครบ
            <span className="ml-2 text-sm font-normal text-gray-500">({incompleteTeachers.length} คน)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incompleteTeachers.length === 0 ? (
            <p className="text-sm text-green-600 font-medium">✓ ครูทุกคนส่งครบแล้ว</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-3 py-2 text-left font-medium">ชื่อ-นามสกุล</th>
                    <th className="px-3 py-2 text-left font-medium">กลุ่มสาระ</th>
                    <th className="px-3 py-2 text-left font-medium">ยังไม่ส่ง</th>
                  </tr>
                </thead>
                <tbody>
                  {incompleteTeachers.map((t, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{t.name}</td>
                      <td className="px-3 py-2 text-gray-500 text-xs">{t.group}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-1 flex-wrap">
                          {t.missing.map((m) => (
                            <span key={m} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{m}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


export default async function DashboardPage() {
  const session = await getSupervisionSession();
  if (!session) redirect("/supervision/login");

  const allowedRoles = ["PRINCIPAL", "VICE_PRINCIPAL_ACADEMIC", "ACADEMIC_ADMIN", "ACADEMIC_HEAD"];
  if (!allowedRoles.includes(session.role)) redirect("/supervision");

  const semester = await prisma.academicSemester.findFirst({ where: { isActive: true } });

  const [
    totalTeachers,
    totalAssignments,
    plansSubmitted,
    plansApproved,
    clipsSubmitted,
    clipsCompleted,
    logsSubmitted,
    logsApproved,
  ] = await Promise.all([
    prisma.supervisionTeacher.count(),
    prisma.teacherSubjectAssignment.count({ where: { semesterId: semester?.id } }),
    prisma.teachingPlan.count({ where: { assignment: { semesterId: semester?.id }, status: { not: "NOT_SUBMITTED" } } }),
    prisma.teachingPlan.count({ where: { assignment: { semesterId: semester?.id }, status: "APPROVED" } }),
    prisma.supervisionClip.count({ where: { plan: { assignment: { semesterId: semester?.id } }, status: { not: "NOT_SUBMITTED" } } }),
    prisma.supervisionClip.count({ where: { plan: { assignment: { semesterId: semester?.id } }, status: "COMPLETED" } }),
    prisma.teachingLog.count({ where: { unit: { plan: { assignment: { semesterId: semester?.id } } }, status: { not: "NOT_SUBMITTED" } } }),
    prisma.teachingLog.count({ where: { unit: { plan: { assignment: { semesterId: semester?.id } } }, status: "APPROVED" } }),
  ]);

  // สรุปแยกตามกลุ่มสาระ
  const subjectGroups = await prisma.subjectGroup.findMany({
    include: {
      teachers: {
        include: {
          assignments: {
            where: { semesterId: semester?.id },
            include: {
              teachingPlan: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const groupStats = subjectGroups.map((g) => {
    const assignments = g.teachers.flatMap((t) => t.assignments);
    const plans = assignments.map((a) => a.teachingPlan).filter(Boolean);
    return {
      name: g.name,
      totalAssignments: assignments.length,
      plansSubmitted: plans.filter((p) => p?.status !== "NOT_SUBMITTED").length,
      plansApproved: plans.filter((p) => p?.status === "APPROVED").length,
    };
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard ภาพรวมระบบนิเทศ</h1>
        {semester && (
          <p className="text-sm text-gray-500 mt-1">ปีการศึกษา {semester.year} ภาคเรียน {semester.semester}</p>
        )}
      </div>

      {/* สรุปตัวเลขหลัก */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-blue-600">{totalTeachers}</div>
            <div className="text-sm text-gray-500 mt-1">ครูทั้งหมด</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-gray-600">{totalAssignments}</div>
            <div className="text-sm text-gray-500 mt-1">รายวิชาที่มอบหมาย</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-green-600">{plansApproved}</div>
            <div className="text-sm text-gray-500 mt-1">แผนผ่านแล้ว</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-3xl font-bold text-yellow-600">{plansSubmitted - plansApproved}</div>
            <div className="text-sm text-gray-500 mt-1">แผนรอตรวจ</div>
          </CardContent>
        </Card>
      </div>

      {/* สรุปแต่ละโมดูล */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">📝 แผนการสอน</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ส่งแล้ว</span>
              <span className="font-medium">{plansSubmitted} / {totalAssignments}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 rounded-full h-2" style={{ width: totalAssignments > 0 ? `${(plansSubmitted / totalAssignments) * 100}%` : "0%" }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ผ่านแล้ว</span>
              <span className="font-medium text-green-600">{plansApproved}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">🎬 คลิปการสอน</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ส่งแล้ว</span>
              <span className="font-medium">{clipsSubmitted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">นิเทศสมบูรณ์</span>
              <span className="font-medium text-green-600">{clipsCompleted}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">📓 บันทึกหลังสอน</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">บันทึกแล้ว</span>
              <span className="font-medium">{logsSubmitted}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ผ่านแล้ว</span>
              <span className="font-medium text-green-600">{logsApproved}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* สรุปแยกตามกลุ่มสาระ */}
      <Card>
        <CardHeader><CardTitle className="text-base">สรุปแยกตามกลุ่มสาระ</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left font-medium">กลุ่มสาระ</th>
                  <th className="px-3 py-2 text-center font-medium">รายวิชา</th>
                  <th className="px-3 py-2 text-center font-medium">ส่งแผนแล้ว</th>
                  <th className="px-3 py-2 text-center font-medium">ผ่านแผน</th>
                  <th className="px-3 py-2 text-center font-medium">% ความก้าวหน้า</th>
                </tr>
              </thead>
              <tbody>
                {groupStats.map((g) => (
                  <tr key={g.name} className="border-t">
                    <td className="px-3 py-2">{g.name}</td>
                    <td className="px-3 py-2 text-center">{g.totalAssignments}</td>
                    <td className="px-3 py-2 text-center">{g.plansSubmitted}</td>
                    <td className="px-3 py-2 text-center text-green-600 font-medium">{g.plansApproved}</td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-green-500 rounded-full h-1.5"
                            style={{ width: g.totalAssignments > 0 ? `${(g.plansApproved / g.totalAssignments) * 100}%` : "0%" }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {g.totalAssignments > 0 ? Math.round((g.plansApproved / g.totalAssignments) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {groupStats.length === 0 && (
                  <tr><td colSpan={5} className="px-3 py-4 text-center text-gray-500">ยังไม่มีข้อมูล</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
