import type { Metadata } from "next";
import Link from "next/link";

import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { ShopProductCard } from "@/components/ShopProductCard";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import { getAllListingProducts } from "@/lib/get-product-by-slug";

export const metadata: Metadata = {
  description: "Browse all NS Jewels products in one place.",
  title: "All Products | NS Jewels",
};

const ALL_PRODUCTS_PAGE_COUNT = 3;

/** Even split of `total` items across `partCount` pages (e.g. 4 → [2, 1, 1]). */
const listingChunkSizes = (total: number, partCount: number): readonly number[] => {
  if (partCount <= 0) {
    return [];
  }
  const base = Math.floor(total / partCount);
  const remainder = total % partCount;
  return Array.from({ length: partCount }, (_, index) => base + (index < remainder ? 1 : 0));
};

const sliceStartForPage = (sizes: readonly number[], page: number): number =>
  sizes.slice(0, page - 1).reduce((sum, size) => sum + size, 0);

const parseListingPage = (raw: string | undefined, maxPage: number): number => {
  const parsed = Number.parseInt(raw ?? "1", 10);
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  return Math.min(maxPage, Math.max(1, parsed));
};

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AllProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const allProducts = await getAllListingProducts();
  const total = allProducts.length;
  const chunkSizes = listingChunkSizes(total, ALL_PRODUCTS_PAGE_COUNT);
  const nonEmptyPageNumbers = chunkSizes
    .map((size, index) => (size > 0 ? index + 1 : null))
    .filter((value): value is number => value !== null);
  const maxPage = nonEmptyPageNumbers.length > 0 ? Math.max(...nonEmptyPageNumbers) : 1;
  const page = parseListingPage(params.page, maxPage);
  const chunkSize = chunkSizes[page - 1] ?? 0;
  const start = sliceStartForPage(chunkSizes, page);
  const pageProducts = allProducts.slice(start, start + chunkSize);

  const pageLinks = nonEmptyPageNumbers;

  return (
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <header className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">NS Jewels</p>
          <h1 className="mt-2 font-display text-3xl font-semibold italic tracking-[0.08em] text-black sm:text-4xl">
            All Products
          </h1>
          {total > 0 ? (
            <p className="mt-3 text-sm text-neutral-600">
              Page {page} of {maxPage} · {total} pieces
            </p>
          ) : null}
        </header>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {pageProducts.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        {maxPage > 1 ? (
          <nav
            aria-label="Product listing pages"
            className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[#F0D3DA] pt-10"
          >
            <Link
              aria-disabled={page <= 1}
              className={`rounded-full border border-[#F0D3DA] px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                page <= 1
                  ? "pointer-events-none text-neutral-400"
                  : "text-black hover:bg-[#F6C1CC]/35"
              }`}
              href={page > 1 ? `/products?page=${String(page - 1)}` : "/products?page=1"}
              scroll={false}
            >
              Previous
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              {pageLinks.map((pageNum) => (
                <Link
                  aria-current={pageNum === page ? "page" : undefined}
                  className={`min-w-[2.5rem] rounded-full px-3 py-2 text-center text-sm font-semibold transition-colors duration-200 ${
                    pageNum === page
                      ? "bg-cta text-white"
                      : "border border-[#F0D3DA] text-black hover:bg-[#F6C1CC]/35"
                  }`}
                  href={`/products?page=${String(pageNum)}`}
                  key={pageNum}
                  scroll={false}
                >
                  {pageNum}
                </Link>
              ))}
            </div>
            <Link
              aria-disabled={page >= maxPage}
              className={`rounded-full border border-[#F0D3DA] px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
                page >= maxPage
                  ? "pointer-events-none text-neutral-400"
                  : "text-black hover:bg-[#F6C1CC]/35"
              }`}
              href={page < maxPage ? `/products?page=${String(page + 1)}` : `/products?page=${String(maxPage)}`}
              scroll={false}
            >
              Next
            </Link>
          </nav>
        ) : null}
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
