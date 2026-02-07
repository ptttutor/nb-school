"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ApplicantsList } from "@/features/applicants/components/ApplicantsList";
import type { Registration } from "@/types";

export default function ApplicantsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [gradeLevelFilter, setGradeLevelFilter] = useState("all");

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, gradeLevelFilter]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        status: "all",
        gradeLevel: gradeLevelFilter,
        search: "",
      });

      const res = await fetch(`/api/admin/registrations?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRegistrations(Array.isArray(data.registrations) ? data.registrations : []);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              กลับหน้าแรก
            </Button>
          </Link>
        </div>

        <Card className="p-8 shadow-xl border-amber-200 bg-white/90 backdrop-blur">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">
              รายชื่อผู้สมัครเข้าศึกษา
            </h1>
            <p className="text-amber-700">
              ตรวจสอบรายชื่อและสถานะการแนบเอกสารของผู้สมัครทั้งหมด
            </p>
          </div>

          <ApplicantsList
            registrations={registrations}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={setCurrentPage}
            gradeLevelFilter={gradeLevelFilter}
            onGradeLevelFilterChange={setGradeLevelFilter}
          />
        </Card>
      </div>
    </div>
  );
}
