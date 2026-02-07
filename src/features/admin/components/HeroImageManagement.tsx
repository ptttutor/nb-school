"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import type { HeroImage } from "@/types/hero.types";
import { useToast } from "@/hooks/use-toast";

export function HeroImageManagement() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newImage, setNewImage] = useState({
    imageUrl: "",
    title: "",
    order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHeroImages();
  }, []);

  const fetchHeroImages = async () => {
    try {
      const response = await fetch("/api/hero");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setHeroImages(data);
    } catch (error) {
      console.error("Error:", error);
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
      setShowAddForm(false);
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
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">จัดการรูป Hero Section</h2>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มรูป
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>เพิ่มรูป Hero ใหม่</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>อัพโหลดรูปภาพ</Label>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-gray-500 mt-1">กำลังอัพโหลด...</p>}
                {newImage.imageUrl && (
                  <div className="mt-2 relative w-full h-40">
                    <img
                      src={newImage.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>ชื่อรูป (ไม่บังคับ)</Label>
              <Input
                value={newImage.title}
                onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                placeholder="คำอธิบายรูปภาพ"
              />
            </div>

            <div>
              <Label>ลำดับการแสดงผล</Label>
              <Input
                type="number"
                value={newImage.order}
                onChange={(e) => setNewImage({ ...newImage, order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddImage} disabled={uploading || !newImage.imageUrl}>
                <ImageIcon className="w-4 h-4 mr-2" />
                เพิ่มรูป
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heroImages.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <div className="relative w-full h-48 mb-3">
                <img
                  src={image.imageUrl}
                  alt={image.title || "Hero Image"}
                  className="w-full h-full object-cover rounded"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    image.active ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {image.active ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                </Badge>
              </div>

              <div className="space-y-2">
                {image.title && (
                  <p className="text-sm font-medium">{image.title}</p>
                )}
                <p className="text-xs text-gray-500">ลำดับ: {image.order}</p>

                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(image.id, image.active)}
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
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateOrder(image.id, image.order + 1)}
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

      {heroImages.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">ยังไม่มีรูป Hero</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
