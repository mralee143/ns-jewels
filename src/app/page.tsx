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
    <div className="min-h-screen bg-[#fdfbf8] text-[#1c1917]">
      <Navbar />
      <HeroSection />
      <main className="px-5 py-12 sm:px-8 lg:px-12">
        <MadeForHerSection />
        <StyleIdeasSection />
        <AboutUsSection />
        <WhyNsJewelsSection />
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
