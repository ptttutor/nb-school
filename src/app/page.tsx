import { Header, Footer } from "@/components/layout";
import { HeroSection, WelcomeSection, LocationSection } from "@/components/home";
import { NewsSection } from "@/features/news/components";
import { prisma } from "@/lib/prisma";

// Revalidate every 60 seconds to show fresh news
export const revalidate = 60;

export default async function Home() {
  // Fetch active hero images
  const heroImages = await prisma.heroImage.findMany({
    where: {
      active: true,
    },
    orderBy: {
      order: 'asc',
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection heroImages={heroImages} />
        <WelcomeSection />
        <div className="pb-16">
          <NewsSection />
        </div>
        <div className="pb-40">
          <LocationSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
