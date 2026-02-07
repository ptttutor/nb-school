"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, AlertCircle } from "lucide-react";

export function SearchForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [idCard, setIdCard] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate ID card
    if (!idCard || idCard.trim().length === 0) {
      setMessage("กรุณากรอกเลขบัตรประชาชน");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/registration/search?idCard=${encodeURIComponent(idCard.trim())}`);
      const data = await response.json();

      if (response.ok && data.id) {
        // พบข้อมูลการสมัคร redirect ไปหน้ารายละเอียด
        router.push(`/registration/${data.id}`);
      } else {
        setMessage(data.error || "ไม่พบข้อมูลการสมัครด้วยเลขบัตรประชาชนนี้");
      }
    } catch (error) {
      console.error("Search error:", error);
      setMessage("เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-amber-200">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-amber-100 rounded-full">
            <Search className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <CardTitle className="text-2xl text-amber-900">
              ตรวจสอบการสมัคร
            </CardTitle>
            <CardDescription className="text-base mt-1">
              ค้นหาข้อมูลการสมัครด้วยเลขบัตรประชาชน
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="idCard" className="text-base">
              เลขบัตรประชาชน *
            </Label>
            <Input
              type="text"
              id="idCard"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              placeholder="กรอกเลขบัตรประชาชน 13 หลัก หรือเลขพาสปอร์ต"
              className="border-amber-200 text-lg py-6"
              required
            />
            <p className="text-sm text-gray-600">
              กรุณากรอกเลขบัตรประชาชนที่ใช้ในการสมัคร
            </p>
          </div>

          {/* Message */}
          {message && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-800 text-sm">{message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-lg py-6"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                กำลังค้นหา...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                ค้นหาข้อมูลการสมัคร
              </>
            )}
          </Button>
        </form>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">หมายเหตุ:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• กรอกเลขบัตรประชาชนที่ใช้สมัครเท่านั้น</li>
            <li>• หากไม่พบข้อมูล แสดงว่ายังไม่ได้ทำการสมัครหรือกรอกข้อมูลไม่ถูกต้อง</li>
            <li>• สามารถกลับมาตรวจสอบได้ตลอดเวลา</li>
          </ul>
        </div>

        {/* Link to Register */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">ยังไม่ได้สมัคร?</p>
          <Link href="/register">
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900">
              สมัครเรียนเลย
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
