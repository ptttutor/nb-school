import Image from "next/image";
import { MapPin, Phone, Printer, Calendar, Award } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-amber-900 text-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* School Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo-nb-school.png" 
                alt="โรงเรียนหนองบัว" 
                width={48} 
                height={48}
                className="object-contain"
              />
              <div>
                <div className="text-xl font-semibold">โรงเรียนหนองบัว</div>
                <div className="text-sm text-amber-200">Nongbua School</div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-amber-200">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>ก่อตั้งปี พ.ศ. 2503</span>
              </div>
              <div className="flex items-start gap-2">
                <Award className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>โรงเรียนคุณภาพ ประจำอำเภอ</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ติดต่อเรา</h3>
            <div className="space-y-2 text-sm text-amber-200">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:056251281" className="hover:text-amber-100 transition-colors">
                  โทรศัพท์: 056-251281
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 flex-shrink-0" />
                <span>โทรสาร: 056-876240</span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ที่อยู่</h3>
            <div className="flex items-start gap-2 text-sm text-amber-200">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>79 หมู่ 1 ตำบลหนองบัว</p>
                <p>อำเภอหนองบัว จังหวัดนครสวรรค์ 60110</p>
                <p className="mt-2 text-xs">สังกัด สพม.นครสวรรค์</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-700 pt-6 mt-6 text-center">
          <p className="text-sm text-amber-200">
            © 2026 โรงเรียนหนองบัว อำเภอหนองบัว จังหวัดนครสวรรค์ | สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </footer>
  );
}
