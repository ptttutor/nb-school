import Image from "next/image";
import { prisma } from "@/lib/prisma";

export async function HeroSection() {
  // ดึงรูป Hero ที่ active จาก database
  const heroImages = await prisma.heroImage.findMany({
    where: {
      active: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  // ใช้รูปแรกเป็น background (สามารถขยายเป็น carousel ได้)
  const backgroundImage = heroImages[0]?.imageUrl;

  return (
    <section className="relative h-[600px] w-full">
      {/* Background Image */}
      {backgroundImage ? (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent z-0"></div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 z-0"></div>
      )}
    </section>
  );
}
