"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import type { HeroImage } from "@/types/hero.types";
import { useToast } from "@/hooks/use-toast";

export function HeroImageManagement() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    imageUrl: "",
    title: "",
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHeroImages();
  }, [currentPage, activeFilter, searchQuery]);

  const fetchHeroImages = async () => {
    try {
      const params = new URLSearchParams({
        admin: "true",
        page: currentPage.toString(),
        limit: "9",
        active: activeFilter,
        search: searchQuery,
      });
      
      const response = await fetch(`/api/hero?${params}`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      
      setHeroImages(Array.isArray(data.heroImages) ? data.heroImages : []);
      setTotalCount(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error:", error);
      setHeroImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setNewImage({ ...newImage, imageUrl: data.fileUrl });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการอัพโหลดรูป",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAddImage = async () => {
    if (!newImage.imageUrl) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณาอัพโหลดรูปภาพ",
      });
      return;
    }

    try {
      const response = await fetch("/api/hero", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newImage),
      });

      if (!response.ok) throw new Error("Failed to add");

      toast({
        title: "เพิ่มรูปสำเร็จ",
        description: "เพิ่มรูปภาพเรียบร้อยแล้ว",
      });
      setNewImage({ imageUrl: "", title: "", order: 0 });
      setIsDialogOpen(false);
      fetchHeroImages();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการเพิ่มรูปภาพ",
      });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const response = await fetch("/api/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !currentActive }),
      });

      if (!response.ok) throw new Error("Failed to update");
      toast({
        title: "อัพเดทสำเร็จ",
        description: currentActive ? "ซ่อนรูปภาพแล้ว" : "แสดงรูปภาพแล้ว",
      });
      fetchHeroImages();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการอัพเดท",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ต้องการลบรูปนี้ใช่หรือไม่?")) return;

    try {
      const response = await fetch(`/api/hero?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");
      toast({
        title: "ลบสำเร็จ",
        description: "ลบรูปภาพเรียบร้อยแล้ว",
      });
      fetchHeroImages();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการลบรูป",
      });
    }
  };

  const handleUpdateOrder = async (id: string, newOrder: number) => {
    try {
      const response = await fetch("/api/hero", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, order: newOrder }),
      });

      if (!response.ok) throw new Error("Failed to update");
      toast({
        title: "อัพเดทลำดับสำเร็จ",
        description: "เปลี่ยนลำดับรูปภาพแล้ว",
      });
      fetchHeroImages();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการอัพเดทลำดับ",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-amber-700">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amber-900">จัดการรูป Hero Section</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มรูป
        </Button>
      </div>

      {/* Add Image Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-amber-900">เพิ่มรูป Hero ใหม่</DialogTitle>
            <DialogDescription>
              อัพโหลดรูปภาพสำหรับ Hero Section หน้าแรกของเว็บไซต์
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>อัพโหลดรูปภาพ *</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="border-amber-200"
              />
              {uploading && <p className="text-sm text-gray-500">กำลังอัพโหลด...</p>}
              {newImage.imageUrl && (
                <div className="relative w-full h-48 border border-amber-200 rounded-md overflow-hidden">
                  <img
                    src={newImage.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>ชื่อรูป (ไม่บังคับ)</Label>
              <Input
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                placeholder="คำอธิบายรูปภาพ"
                className="border-amber-200"
              />
            </div>

            <div className="space-y-2">
              <Label>ลำดับการแสดงผล</Label>
              <Input
                type="number"
                value={newImage.order}
                onChange={(e) => setNewImage({ ...newImage, order: parseInt(e.target.value) })}
                className="border-amber-200"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setNewImage({ imageUrl: "", title: "", order: 0 });
              }}
              className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
            >
              <X className="w-4 h-4 mr-2" />
              ยกเลิก
            </Button>
            <Button 
              onClick={handleAddImage} 
              disabled={uploading || !newImage.imageUrl}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            >
              <Save className="w-4 h-4 mr-2" />
              เพิ่มรูป
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filter Controls */}
      <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-amber-900">รายการรูป Hero Section (ทั้งหมด {totalCount} รูป)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap mb-6">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="ค้นหาชื่อรูป..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-amber-200"
              />
            </div>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[180px] border-amber-200">
                <SelectValue placeholder="ทุกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="active">เปิดใช้งาน</SelectItem>
                <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {heroImages.length === 0 ? (
            <p className="text-center text-amber-600 py-8">ไม่พบรูปภาพ</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {heroImages.map((image) => (
          <Card key={image.id} className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
            <CardContent className="p-4">
              <div className="relative w-full h-48 mb-3">
                <img
                  src={image.imageUrl}
                  alt={image.title || "Hero Image"}
                  className="w-full h-full object-cover rounded"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    image.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {image.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </Badge>
              </div>

              <div className="space-y-2">
                {image.title && (
                  <p className="text-sm font-medium text-amber-900">{image.title}</p>
                )}
                <p className="text-xs text-amber-600">ลำดับ: {image.order}</p>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(image.id, image.active)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                  >
                    {image.active ? (
                      <>
                        <EyeOff className="w-3 h-3 mr-1" />
                        ปิด
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3 mr-1" />
                        เปิด
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateOrder(image.id, image.order - 1)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateOrder(image.id, image.order + 1)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    ลบ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-200">
                <div className="text-sm text-amber-700">
                  แสดง {heroImages.length} รูปจาก {totalCount} รูปทั้งหมด
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-amber-300 text-amber-700 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    ก่อนหน้า
                  </Button>
                  <div className="text-sm text-amber-700 px-4">
                    หน้า {currentPage} จาก {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-amber-300 text-amber-700 disabled:opacity-50"
                  >
                    ถัดไป
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
