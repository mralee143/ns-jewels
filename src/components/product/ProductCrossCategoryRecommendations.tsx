import { CategoryProductCard } from "@/components/CategoryProductCard";
import type { ShopProduct } from "@/data/shop-products";

type ProductCrossCategoryRecommendationsProps = {
  readonly products: readonly ShopProduct[];
};

export function ProductCrossCategoryRecommendations({ products }: ProductCrossCategoryRecommendationsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section aria-label="Recommended from other categories" className="mt-12 border-t border-[#F0D3DA] pt-12">
      <h2 className="font-display text-xl font-semibold tracking-wide text-black">You may also like</h2>
      <p className="mt-2 max-w-xl font-sans text-sm text-neutral-600">
        Discover pieces from other collections — one highlight per category.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {products.map((entry) => (
          <CategoryProductCard key={entry.slug} product={entry} />
        ))}
      </div>
    </section>
  );
}
