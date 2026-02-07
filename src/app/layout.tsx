import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "โรงเรียนหนองบัว จังหวัดนครสวรรค์",
  description: "ระบบรับสมัครนักเรียนออนไลน์ โรงเรียนหนองบัว จังหวัดนครสวรรค์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
