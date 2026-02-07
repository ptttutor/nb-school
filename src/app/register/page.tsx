"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { GradeSelection } from "@/features/registration/components";

export default function RegisterSelectPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับหน้าหลัก
              </Button>
            </Link>
          </div>
          <GradeSelection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
