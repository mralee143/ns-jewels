import Link from "next/link";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  productCategoryHref,
} from "@/data/product-categories";

export default function ProductCategoryNotFound() {
  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#1c1917]">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-16 text-center sm:px-8 lg:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">NS Jewels</p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-[0.06em] text-[#1c1917] sm:text-4xl">
          Not found
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#57534e]">
          That category doesn&apos;t exist or the spelling doesn&apos;t match our collections. Pick a
          category below or go back home.
        </p>
        <ul className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {PRODUCT_CATEGORY_SLUGS.map((slug) => (
            <li key={slug}>
              <Link
                className="inline-block rounded-full border border-[#581c87] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#581c87] transition-colors duration-200 hover:bg-[#581c87] hover:text-white"
                href={productCategoryHref(slug)}
              >
                {PRODUCT_CATEGORY_LABELS[slug]}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          className="mt-12 inline-block text-sm font-semibold text-[#581c87] underline-offset-4 transition-colors hover:text-[#7e22ce] hover:underline"
          href="/"
        >
          Back to home
        </Link>
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
