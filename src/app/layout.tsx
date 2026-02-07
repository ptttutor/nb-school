import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "โรงเรียนหนองบัว จังหวัดนครสวรรค์",
  description: "ระบบรับสมัครนักเรียนออนไลน์ โรงเรียนหนองบัว จังหวัดนครสวรรค์",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=5.0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="overflow-y-scroll">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
