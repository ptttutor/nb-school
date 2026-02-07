import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Download } from "lucide-react";

interface News {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  fileUrl?: string;
  createdAt: string;
}

async function getNews(): Promise<News[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/news`, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    return [];
  }
}

export async function NewsSection() {
  const news = await getNews();

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 mb-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="mt-8 text-3xl font-bold text-amber-900">
            ข่าวสารและประกาศ
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item.id} className="border-amber-200 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center overflow-hidden rounded-t-lg">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-amber-400 text-center p-8">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-50">ไม่มีรูปภาพ</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-amber-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <CardTitle className="text-amber-900 line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {item.content}
                </CardDescription>
                {item.fileUrl && (
                  <div className="mt-3">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลดเอกสารแนบ
                    </a>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
