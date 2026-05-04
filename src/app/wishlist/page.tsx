import Link from "next/link";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <main className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold tracking-[0.06em] text-black sm:text-4xl">
          Wishlist
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-black">
          Wishlist saving from product pages is coming soon. Browse collections and add pieces to your cart in the meantime.
        </p>
        <Link
          className="mt-8 inline-flex rounded-lg bg-cta px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-cta-hover"
          href="/products/rings"
        >
          Continue shopping
        </Link>
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
