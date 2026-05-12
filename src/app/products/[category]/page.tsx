import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { CategoryProductGrid } from "@/components/CategoryProductGrid";
import { FooterSection } from "@/components/FooterSection";
import { Navbar } from "@/components/Navbar";
import { WhatsAppFloatButton } from "@/components/WhatsAppFloatButton";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  isProductCategorySlug,
  productCategoryHref,
} from "@/data/product-categories";
import { getCategoryListingProducts } from "@/lib/get-product-by-slug";
import { resolveSearchToCategorySlug } from "@/lib/resolve-search-to-category-slug";

type PageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams(): { category: string }[] {
  return PRODUCT_CATEGORY_SLUGS.map((category) => ({ category }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isProductCategorySlug(category)) {
    return { title: "Not found" };
  }

  const label = PRODUCT_CATEGORY_LABELS[category];
  return {
    description: `Browse ${label} from NS Jewels.`,
    title: `${label} | NS Jewels`,
  };
}

export default async function ProductCategoryPage({ params }: PageProps) {
  const { category } = await params;

  if (!isProductCategorySlug(category)) {
    const resolved = resolveSearchToCategorySlug(category.replaceAll("-", " "));
    if (resolved) {
      redirect(productCategoryHref(resolved));
    }
    notFound();
  }

  const products = await getCategoryListingProducts(category);
  const label = PRODUCT_CATEGORY_LABELS[category];

  return (
    <div className="min-h-screen bg-background text-black">
      <Navbar />
      <main className="mx-auto max-w-[1320px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <CategoryProductGrid category={category} categoryLabel={label} products={products} />
      </main>
      <FooterSection />
      <WhatsAppFloatButton />
    </div>
  );
}
