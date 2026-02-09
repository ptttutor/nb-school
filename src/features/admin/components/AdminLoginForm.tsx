"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdminLoginFormProps {
  onLoginSuccess: (adminId: string) => void;
}

export function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "เข้าสู่ระบบสำเร็จ",
          description: "ยินดีต้อนรับ",
        });
        onLoginSuccess(data.admin.id);
      } else {
        toast({
          variant: "destructive",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          description: data.error || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="absolute top-8 left-8">
        <Link href="/">
          <Button variant="ghost" className="text-amber-700 hover:text-white hover:bg-amber-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับหน้าแรก
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-xl border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-amber-900">
            Admin Login
          </CardTitle>
          <CardDescription>เข้าสู่ระบบจัดการ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              disabled={isLoading}
            >
              {isLoading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
