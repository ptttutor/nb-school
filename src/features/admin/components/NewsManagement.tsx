"use client";

import { useState, useEffect, FormEvent } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, ChevronLeft, ChevronRight, Download, FileText } from "lucide-react";
import type { News } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface NewsFormData {
  title: string;
  content: string;
  imageUrl: string;
  fileUrl: string;
}

interface NewsManagementProps {
  adminId: number | null;
}

export function NewsManagement({ adminId }: NewsManagementProps) {
  const [news, setNews] = useState<News[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState<NewsFormData>({
    title: '',
    content: '',
    imageUrl: '',
    fileUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Pagination & Filter states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNews();
  }, [currentPage, publishedFilter, searchQuery]);

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams({
        admin: "true",
        page: currentPage.toString(),
        limit: "10",
        published: publishedFilter,
        search: searchQuery,
      });
      
      const res = await fetch(`/api/news?${params}`);
      if (res.ok) {
        const data = await res.json();
        setNews(Array.isArray(data.news) ? data.news : []);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
      setNews([]);
    }
  };

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
      console.log('Image upload response:', data);
      
      if (!data.url) {
        throw new Error('No url in response');
      }
      
      setNewsForm(prev => {
        const updated = { ...prev, imageUrl: data.url };
        console.log('After image upload, newsForm will be:', updated);
        return updated;
      });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 10 MB",
      });
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      console.log('File upload response:', data);
      
      if (!data.url) {
        throw new Error('No url in response');
      }
      
      setNewsForm(prev => {
        const updated = { ...prev, fileUrl: data.url };
        console.log('After file upload, newsForm will be:', updated);
        return updated;
      });
      toast({
        title: "อัพโหลดสำเร็จ",
        description: "อัพโหลดไฟล์เรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการอัพโหลดไฟล์",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const createNews = async () => {
    if (!adminId || !newsForm.title.trim() || !newsForm.content.trim()) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกหัวข้อและเนื้อหาให้ครบถ้วน",
      });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsForm.title,
          content: newsForm.content,
          imageUrl: newsForm.imageUrl || null,
          fileUrl: newsForm.fileUrl || null,
          published: false,
          adminId,
        }),
      });

      if (res.ok) {
        toast({
          title: "สร้างข่าวสำเร็จ",
          description: "เพิ่มข่าวใหม่เรียบร้อยแล้ว",
        });
        setNewsForm({ title: '', content: '', imageUrl: '', fileUrl: '' });
        setIsDialogOpen(false);
        setEditingNewsId(null);
        fetchNews();
      }
    } catch (err) {
      console.error('Failed to create news:', err);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถสร้างข่าวได้",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateNews = async (id: string) => {
    console.log('updateNews called with newsForm:', newsForm);
    setSaving(true);
    try {
      const payload: any = {
        id,
        title: newsForm.title,
        content: newsForm.content,
      };
      
      // Only include imageUrl and fileUrl if they have values
      if (newsForm.imageUrl) {
        payload.imageUrl = newsForm.imageUrl;
      }
      if (newsForm.fileUrl) {
        payload.fileUrl = newsForm.fileUrl;
      }
      
      console.log('Updating news with payload:', payload);
      
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast({
          title: "แก้ไขสำเร็จ",
          description: "อัพเดทข่าวเรียบร้อยแล้ว",
        });
        setNewsForm({ title: '', content: '', imageUrl: '', fileUrl: '' });
        setEditingNewsId(null);
        setIsDialogOpen(false);
        fetchNews();
      }
    } catch (err) {
      console.error('Failed to update news:', err);
      toast({
        variant: "destructive",
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขข่าวได้",
      });
    } finally {
      setSaving(false);
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
        fetchNews();
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
        fetchNews();
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
    const formData = {
      title: item.title,
      content: item.content,
      imageUrl: item.imageUrl || '',
      fileUrl: item.fileUrl || '',
    };
    console.log('Starting edit with form data:', formData);
    setNewsForm(formData);
    setIsDialogOpen(true);
  };

  const cancelNewsForm = () => {
    setIsDialogOpen(false);
    setEditingNewsId(null);
    setNewsForm({ title: '', content: '', imageUrl: '', fileUrl: '' });
  };

  const openCreateDialog = () => {
    setEditingNewsId(null);
    setNewsForm({ title: '', content: '', imageUrl: '', fileUrl: '' });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Create Button */}
      <div>
        <Button
          onClick={openCreateDialog}
          className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          สร้างข่าวใหม่
        </Button>
      </div>

      {/* Create/Edit News Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-amber-900">
              {editingNewsId ? 'แก้ไขข่าว' : 'สร้างข่าวใหม่'}
            </DialogTitle>
            <DialogDescription>
              {editingNewsId ? 'แก้ไขข้อมูลข่าวสาร' : 'เพิ่มข่าวสารใหม่เข้าสู่ระบบ'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
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
              <Label htmlFor="news-image">รูปภาพข่าว (ไม่บังคับ)</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading || saving}
                  className="border-amber-200"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span className="animate-spin">⏳</span>
                    <span>กำลังอัพโหลดรูปภาพ...</span>
                  </div>
                )}
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
            <div className="space-y-2">
              <Label htmlFor="news-file">ไฟล์แนบ (ไม่บังคับ)</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.zip"
                  onChange={handleFileUpload}
                  disabled={uploadingFile || saving}
                  className="border-amber-200"
                />
                <p className="text-xs text-amber-600">
                  รองรับไฟล์: PDF, DOC, DOCX, XLS, XLSX, ZIP (ขนาดไม่เกิน 10 MB)
                </p>
                {uploadingFile && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <span className="animate-spin">⏳</span>
                    <span>กำลังอัพโหลดไฟล์...</span>
                  </div>
                )}
                {newsForm.fileUrl && (
                  <div className="flex items-center gap-2 p-2 border border-amber-200 rounded-md bg-amber-50">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="text-sm text-amber-700 flex-1 truncate">
                      {newsForm.fileUrl.split('/').pop()}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setNewsForm(prev => ({ ...prev, fileUrl: '' }))}
                      className="h-6 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={cancelNewsForm}
              disabled={uploading || uploadingFile || saving}
              className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
            >
              <X className="w-4 h-4 mr-2" />
              ยกเลิก
            </Button>
            <Button
              onClick={() => editingNewsId ? updateNews(editingNewsId) : createNews()}
              disabled={uploading || uploadingFile || saving}
              className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingNewsId ? 'บันทึกการแก้ไข' : 'สร้างข่าว'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* News List */}
      <Card className="shadow-xl border-amber-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-amber-900">รายการข่าวทั้งหมด</CardTitle>
          <CardDescription>จัดการข่าวสารและประกาศ (ทั้งหมด {totalCount} รายการ)</CardDescription>
        </CardHeader>
        
        {/* Filter Controls */}
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap mb-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="ค้นหาหัวข้อหรือเนื้อหาข่าว..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-amber-200"
              />
            </div>
            <Select value={publishedFilter} onValueChange={setPublishedFilter}>
              <SelectTrigger className="w-[180px] border-amber-200">
                <SelectValue placeholder="ทุกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="published">เผยแพร่แล้ว</SelectItem>
                <SelectItem value="draft">ฉบับร่าง</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {news.length === 0 ? (
            <p className="text-center text-amber-600 py-8">ไม่พบข้อมูลข่าวสาร</p>
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
                      {item.fileUrl && (
                        <div className="flex items-center gap-2 mb-2">
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <Download className="w-3 h-3" />
                            ดาวน์โหลดไฟล์แนบ
                          </a>
                        </div>
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
                        className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
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
                        className="border-amber-300 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
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
          
          {/* Pagination */}
          {news.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-amber-200">
              <div className="text-sm text-amber-700">
                แสดง {news.length} รายการจาก {totalCount} รายการทั้งหมด
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
