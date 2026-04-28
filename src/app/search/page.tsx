import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { ShopProductCard } from "@/components/ShopProductCard";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  productCategoryHref,
} from "@/data/product-categories";
import { SHOP_PRODUCTS } from "@/data/shop-products";
import { filterShopProductsByQuery } from "@/lib/filter-shop-products";
import { resolveSearchToCategorySlug } from "@/lib/resolve-search-to-category-slug";

type PageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

const queryFromSearchParams = (params: { q?: string | string[] }): string => {
  const raw = params.q;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return typeof value === "string" ? value : "";
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const trimmed = queryFromSearchParams(params).trim();
  return {
    description: trimmed
      ? `Search results for “${trimmed}” at NS Jewels.`
      : "Search NS Jewels products.",
    title: trimmed ? `Search: ${trimmed} | NS Jewels` : "Search | NS Jewels",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = queryFromSearchParams(params);
  const trimmed = query.trim();

  if (trimmed.length > 0) {
    const categorySlug = resolveSearchToCategorySlug(trimmed);
    if (categorySlug) {
      redirect(productCategoryHref(categorySlug));
    }
  }

  const results =
    trimmed.length > 0 ? filterShopProductsByQuery(trimmed, SHOP_PRODUCTS) : [];

  return (
    <div className="min-h-screen bg-[#fdfbf8] text-[#1c1917]">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-[#57534e]">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                className="text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]"
                href="/"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#a8a29e]">
              /
            </li>
            <li className="font-medium text-[#1c1917]">Search</li>
          </ol>
        </nav>

        <header className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">NS Jewels</p>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-[0.06em] text-[#1c1917] sm:text-3xl">
            {trimmed.length > 0 && results.length === 0
              ? "Not found"
              : trimmed.length > 0
                ? `Results for “${trimmed}”`
                : "Search products"}
          </h1>
          {trimmed.length > 0 ? (
            <p className="mt-2 text-sm text-[#57534e]">
              {results.length === 0
                ? "No products matched that search. Try a category below or check the spelling of the product name."
                : `${results.length} product${results.length === 1 ? "" : "s"} found.`}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[#57534e]">
              Use the search icon in the header, type a name or keyword, then press Go or Enter.
            </p>
          )}
        </header>

        {trimmed.length > 0 && results.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((product, index) => (
              <ShopProductCard key={`${product.title}-${index}`} product={product} />
            ))}
          </div>
        ) : null}

        {trimmed.length > 0 && results.length === 0 ? (
          <div className="rounded-2xl border border-[#f3e8ff] bg-[#faf5ff] px-5 py-8 text-center sm:px-8">
            <p className="text-sm font-medium text-[#57534e]">Browse by category</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
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
          </div>
        ) : null}

        <div className="mt-12">
          <Link
            className="inline-flex rounded-full border border-[#581c87] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#581c87] transition-colors duration-200 hover:bg-[#581c87] hover:text-white"
            href="/#products"
          >
            Browse shop
          </Link>
        </div>
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
