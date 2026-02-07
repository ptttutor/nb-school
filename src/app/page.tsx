import { Header, Footer } from "@/components/layout";
import { HeroSection, WelcomeSection, LocationSection } from "@/components/home";
import { NewsSection } from "@/features/news/components";

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <Header />
      <main className="flex-1 w-full">
        <HeroSection />
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
