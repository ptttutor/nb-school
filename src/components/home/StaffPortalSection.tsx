import Link from "next/link";
import { ClipboardList, FileText, Search } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StaffPortal {
  href: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  border: string;
  bg: string;
  buttonColor: string;
}

const portals: StaffPortal[] = [
  {
    href: "/supervision",
    Icon: ClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "ระบบนิเทศภายใน",
    description: "ติดตามการจัดการเรียนรู้ ส่งแผนการสอน คลิปการสอน และบันทึกหลังสอน",
    border: "border-blue-200",
    bg: "from-blue-50 to-indigo-50",
    buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  {
    href: "/register",
    Icon: FileText,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    title: "สมัครเข้าศึกษาต่อ",
    description: "ยื่นใบสมัครเข้าศึกษาต่อระดับชั้น ม.1 และ ม.4 ออนไลน์",
    border: "border-amber-200",
    bg: "from-amber-50 to-yellow-50",
    buttonColor: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  {
    href: "/applicants",
    Icon: Search,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "ตรวจสอบสถานะการสมัคร",
    description: "ตรวจสอบสถานะใบสมัครเข้าศึกษาต่อของนักเรียน",
    border: "border-green-200",
    bg: "from-green-50 to-emerald-50",
    buttonColor: "bg-green-600 hover:bg-green-700 text-white",
  },
];

export function StaffPortalSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/60">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-amber-900">ระบบบริการออนไลน์</h2>
          <p className="text-amber-700 mt-2 text-sm">บริการสำหรับบุคลากรและนักเรียน/ผู้ปกครอง</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {portals.map((p) => (
            <div
              key={p.href}
              className={`rounded-xl border ${p.border} bg-gradient-to-br ${p.bg} p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center`}>
                <p.Icon className={`w-6 h-6 ${p.iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{p.description}</p>
              </div>
              <div className="mt-auto">
                <Link href={p.href}>
                  <button className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors ${p.buttonColor}`}>
                    เข้าสู่ระบบ →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
