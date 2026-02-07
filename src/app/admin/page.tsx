'use client';

import { useState, useEffect } from 'react';
import { AdminLoginForm, AdminDashboard } from '@/features/admin/components';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ตรวจสอบ localStorage เมื่อ component mount
  useEffect(() => {
    const storedAdminId = localStorage.getItem('adminId');
    if (storedAdminId) {
      setAdminId(Number(storedAdminId));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (id: number) => {
    setIsAuthenticated(true);
    setAdminId(id);
    // เก็บ adminId ลง localStorage
    localStorage.setItem('adminId', String(id));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminId(null);
    // ลบข้อมูลจาก localStorage
    localStorage.removeItem('adminId');
  };

  // แสดง loading state ขณะตรวจสอบ localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-700">กำลังโหลด...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard adminId={adminId!} onLogout={handleLogout} />;
}
