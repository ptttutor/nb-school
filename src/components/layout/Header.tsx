import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-amber-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo-nb-school.png" 
              alt="โรงเรียนหนองบัว" 
              width={60} 
              height={60}
              className="object-contain"
            />
            <div>
              <div className="text-2xl font-bold text-amber-900">โรงเรียนหนองบัว</div>
              <div className="text-sm text-amber-700">Nongbua School</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <a href="tel:056251281" className="hidden md:flex items-center gap-2 text-amber-700 hover:text-amber-900 transition-colors">
              <Phone className="w-4 h-4" />
              <span className="text-sm">056-251281</span>
            </a>
            <Link href="/admin">
              <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
