"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Newspaper, Image, LogOut, Settings, BarChart3 } from "lucide-react";
import { RegistrationTable } from "./RegistrationTable";
import { RegistrationDrawer } from "./RegistrationDrawer";
import { RegistrationStats } from "./RegistrationStats";
import { NewsManagement } from "./NewsManagement";
import { HeroImageManagement } from "./HeroImageManagement";
import { AdmissionManagement } from "./AdmissionManagement";
import type { Registration, News } from "@/types";

interface AdminDashboardProps {
  adminId: string;
  onLogout: () => void;
}

export function AdminDashboard({ adminId, onLogout }: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [activeTab, setActiveTab] = useState<'registrations' | 'stats' | 'news' | 'hero' | 'admission'>('registrations');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeLevelFilter, setGradeLevelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegistrations();
    fetchAllRegistrations();
  }, [currentPage, statusFilter, gradeLevelFilter, searchQuery]);

  const fetchRegistrations = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        status: statusFilter,
        gradeLevel: gradeLevelFilter,
        search: searchQuery,
      });

      const res = await fetch(`/api/admin/registrations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data.registrations) ? data.registrations : []);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
      setRegistrations([]);
    }
  };

  const fetchAllRegistrations = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "1000",
        status: "all",
        gradeLevel: "all",
        search: "",
      });

      const res = await fetch(`/api/admin/registrations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setAllRegistrations(Array.isArray(data.registrations) ? data.registrations : []);
      }
    } catch (err) {
      console.error('Failed to fetch all registrations:', err);
      setAllRegistrations([]);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        fetchRegistrations();
        fetchAllRegistrations();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const deleteRegistration = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/registrations?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchRegistrations();
        fetchAllRegistrations();
      } else {
        alert('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (err) {
      console.error('Failed to delete registration:', err);
      alert('เกิดข้อผิดพลาดในการลบข้อมูล');
    }
  };

  const handleViewDetails = (registration: Registration) => {
    setSelectedRegistration(registration);
    setIsDrawerOpen(true);
  };

  const refreshAllData = () => {
    fetchRegistrations();
    fetchAllRegistrations();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-amber-900 mb-2">แผงควบคุม Admin</h1>
            <p className="text-amber-700">โรงเรียนหนองบัว จ.นครสวรรค์</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              ออกจากระบบ
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-600 hover:text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                กลับหน้าแรก
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            className={activeTab === 'stats'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
              : 'border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900'}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            สถิติ
          </Button> <Button
            variant={activeTab === 'registrations' ? 'default' : 'outline'}
            className={activeTab === 'registrations'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
              : 'border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900'}
            onClick={() => setActiveTab('registrations')}
          >
            <Shield className="w-4 h-4 mr-2" />
            การสมัครเรียน ({totalCount})
          </Button>

          <Button
            variant={activeTab === 'news' ? 'default' : 'outline'}
            className={activeTab === 'news'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
              : 'border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900'}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper className="w-4 h-4 mr-2" />
            จัดการข่าว
          </Button>
          <Button
            variant={activeTab === 'hero' ? 'default' : 'outline'}
            className={activeTab === 'hero'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
              : 'border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900'}
            onClick={() => setActiveTab('hero')}
          >
            <Image className="w-4 h-4 mr-2" />
            รูป Hero Section
          </Button>
          <Button
            variant={activeTab === 'admission' ? 'default' : 'outline'}
            className={activeTab === 'admission'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-600'
              : 'border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900'}
            onClick={() => setActiveTab('admission')}
          >
            <Settings className="w-4 h-4 mr-2" />
            การจัดการรับสมัคร
          </Button>
        </div>

        {/* Registrations Tab */}
        {activeTab === 'registrations' && (
          <RegistrationTable
            registrations={registrations}
            onViewDetails={handleViewDetails}
            onStatusChange={updateStatus}
            onDelete={deleteRegistration}
            totalCount={totalCount}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            gradeLevelFilter={gradeLevelFilter}
            onGradeLevelFilterChange={setGradeLevelFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <RegistrationStats
            totalCount={totalCount}
            registrations={allRegistrations}
          />
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <NewsManagement adminId={adminId} />
        )}

        {/* Hero Images Tab */}
        {activeTab === 'hero' && (
          <HeroImageManagement />
        )}

        {/* Admission Management Tab */}
        {activeTab === 'admission' && (
          <AdmissionManagement />
        )}
      </div>

      {/* Registration Detail Drawer */}
      <RegistrationDrawer
        registration={selectedRegistration}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        onUpdate={refreshAllData}
      />
    </div>
  );
}
