import { AboutUsSection } from "@/components/AboutUsSection";
import { FooterSection } from "@/components/FooterSection";
import { HeroSection } from "@/components/HeroSection";
import { MadeForHerSection } from "@/components/MadeForHerSection";
import { Navbar } from "@/components/Navbar";
import { StyleIdeasSection } from "@/components/StyleIdeasSection";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { WhyNsJewelsSection } from "@/components/WhyNsJewelsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <HeroSection />
      <main className="py-12">
        <div className="px-5 sm:px-8 lg:px-12">
          <MadeForHerSection />
          <StyleIdeasSection />
        </div>
        <AboutUsSection />
        <div className="px-5 sm:px-8 lg:px-12">
          <WhyNsJewelsSection />
        </div>
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
