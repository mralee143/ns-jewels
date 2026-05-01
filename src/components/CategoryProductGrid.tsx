import Link from "next/link";

import { CategoryProductCard } from "@/components/CategoryProductCard";
import type { ProductCategorySlug } from "@/data/product-categories";
import { getProductFromCategoryImage } from "@/data/shop-products";

type CategoryProductGridProps = {
  category: ProductCategorySlug;
  categoryLabel: string;
  images: readonly string[];
};

export function CategoryProductGrid({ category, categoryLabel, images }: CategoryProductGridProps) {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-black">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link className="text-black transition-colors duration-200 hover:text-neutral-800" href="/">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="text-black/45">
            /
          </li>
          <li className="font-medium text-black">{categoryLabel}</li>
        </ol>
      </nav>
      <header className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">NS Jewels</p>
        <h1 className="mt-2 font-display text-3xl font-semibold italic tracking-[0.08em] text-black sm:text-4xl">
          {categoryLabel}
        </h1>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((src) => {
          const product = getProductFromCategoryImage(category, src);
          return (
            <CategoryProductCard key={src} product={product} />
          );
        })}
      </div>
    </div>
  );
}
