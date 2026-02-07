"use client";

import { useState, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import type { News } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface NewsFormData {
  title: string;
  content: string;
  imageUrl: string;
}

interface NewsManagementProps {
  news: News[];
  adminId: number | null;
  onRefresh: () => void;
}

export function NewsManagement({ news, adminId, onRefresh }: NewsManagementProps) {
  const [isCreatingNews, setIsCreatingNews] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<NewsFormData>({
    title: '',
    content: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setNewsForm({ ...newsForm, imageUrl: data.fileUrl });
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

  const createNews = async () => {
    if (!adminId || !newsForm.title.trim() || !newsForm.content.trim() || !newsForm.imageUrl.trim()) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วนและอัพโหลดรูปภาพ",
      });
      return;
    }

    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newsForm,
          adminId,
        }),
      });

      if (res.ok) {
        toast({
          title: "สร้างข่าวสำเร็จ",
          description: "เพิ่มข่าวใหม่เรียบร้อยแล้ว",
        });
        setNewsForm({ title: '', content: '', imageUrl: '' });
        setIsCreatingNews(false);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to create news:', err);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถสร้างข่าวได้",
      });
    }
  };

  const updateNews = async (id: string) => {
    try {
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          ...newsForm,
        }),
      });

      if (res.ok) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "อัพเดทข่าวเรียบร้อยแล้ว",
        });
        setNewsForm({ title: '', content: '', imageUrl: '' });
        setEditingNewsId(null);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update news:', err);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขข่าวได้",
      });
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          published: !currentStatus,
        }),
      });

      if (res.ok) {
        toast({
          title: "อัพเดทสำเร็จ",
          description: currentStatus ? "ซ่อนข่าวแล้ว" : "เผยแพร่ข่าวแล้ว",
        });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to toggle publish:', err);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนสถานะได้",
      });
    }
  };

  const deleteNews = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบข่าวนี้?')) {
      return;
    }

    try {
      const res = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast({
          title: "ลบสำเร็จ",
          description: "ลบข่าวเรียบร้อยแล้ว",
        });
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to delete news:', err);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบข่าวได้",
      });
    }
  };

  const startEditNews = (item: News) => {
    setEditingNewsId(item.id);
    setNewsForm({
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || '',
    });
    setIsCreatingNews(false);
  };

  const cancelNewsForm = () => {
    setIsCreatingNews(false);
    setEditingNewsId(null);
    setNewsForm({ title: '', content: '', imageUrl: '' });
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit News Form */}
      {(isCreatingNews || editingNewsId) && (
        <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-amber-900">
              {editingNewsId ? 'แก้ไขข่าว' : 'สร้างข่าวใหม่'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="news-title">หัวข้อข่าว</Label>
                <Input
                  id="news-title"
                  value={newsForm.title}
                  onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  placeholder="กรอกหัวข้อข่าว"
                  className="border-amber-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-content">เนื้อหา</Label>
                <textarea
                  id="news-content"
                  value={newsForm.content}
                  onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  placeholder="กรอกเนื้อหาข่าว"
                  rows={6}
                  className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="news-image">รูปภาพข่าว *</Label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="border-amber-200"
                  />
                  {uploading && <p className="text-sm text-gray-500">กำลังอัพโหลด...</p>}
                  {newsForm.imageUrl && (
                    <div className="relative w-full h-48 border border-amber-200 rounded-md overflow-hidden">
                      <img
                        src={newsForm.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => editingNewsId ? updateNews(editingNewsId) : createNews()}
                  className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingNewsId ? 'บันทึกการแก้ไข' : 'สร้างข่าว'}
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelNewsForm}
                  className="border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  ยกเลิก
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Button */}
      {!isCreatingNews && !editingNewsId && (
        <div>
          <Button
            onClick={() => setIsCreatingNews(true)}
            className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            สร้างข่าวใหม่
          </Button>
        </div>
      )}

      {/* News List */}
      <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-amber-900">รายการข่าวทั้งหมด</CardTitle>
          <CardDescription>จัดการข่าวสารและประกาศ</CardDescription>
        </CardHeader>
        <CardContent>
          {news.length === 0 ? (
            <p className="text-center text-amber-600 py-8">ยังไม่มีข่าวสาร</p>
          ) : (
            <div className="space-y-4">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="border border-amber-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-amber-900">
                          {item.title}
                        </h3>
                        <Badge
                          variant={item.published ? 'default' : 'secondary'}
                          className={
                            item.published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {item.published ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                        </Badge>
                      </div>
                      <p className="text-amber-700 text-sm mb-2 line-clamp-2">
                        {item.content}
                      </p>
                      {item.imageUrl && (
                        <p className="text-xs text-amber-500 mb-2">
                          รูปภาพ: {item.imageUrl}
                        </p>
                      )}
                      <p className="text-xs text-amber-600">
                        เผยแพร่เมื่อ: {new Date(item.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublish(item.id, item.published)}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        {item.published ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" />
                            ซ่อน
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" />
                            เผยแพร่
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditNews(item)}
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        แก้ไข
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteNews(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        ลบ
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
