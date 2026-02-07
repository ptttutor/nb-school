import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowRight, Clock, Search, Users } from "lucide-react";

export function WelcomeSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <Badge className="mb-6 bg-amber-100 text-amber-900 hover:bg-amber-200 hover:text-amber-950 text-sm px-4 py-2">
          <Clock className="w-4 h-4 mr-2" />
          เปิดรับสมัครแล้ว
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold text-amber-900 mb-6">
          กลุ่มบริหารงานวิชาการ  โรงเรียนหนองบัว
        </h1>
        
        <p className="text-xl md:text-2xl text-amber-700 mb-12 max-w-3xl mx-auto">
          ลงทะเบียนเรียนได้ง่ายๆ ด้วยระบบออนไลน์ที่ทันสมัย รวดเร็ว และปลอดภัย
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register/m1">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <GraduationCap className="w-6 h-6 mr-2" />
              สมัคร ม.1
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
          
          <Link href="/register/m4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <GraduationCap className="w-6 h-6 mr-2" />
              สมัคร ม.4
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
          
          <Link href="/search">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <Search className="w-6 h-6 mr-2" />
              ตรวจสอบการสมัคร
            </Button>
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <Link href="/applicants">
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white shadow-lg hover:shadow-xl transition-all px-8 py-6 text-lg"
            >
              <Users className="w-6 h-6 mr-2" />
              ตรวจสอบรายชื่อผู้สมัคร
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
