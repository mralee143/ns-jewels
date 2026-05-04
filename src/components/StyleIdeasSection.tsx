import Link from "next/link";

import { ShopProductCard } from "@/components/ShopProductCard";
import { SHOP_PRODUCTS } from "@/data/shop-products";

export function StyleIdeasSection() {
  return (
    <section className="mx-auto max-w-[1320px] pb-16 pt-4 sm:pb-20 sm:pt-6">
      <div className="mb-6 text-center sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black">Product List</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-[0.08em] text-black sm:text-3xl">
          Shop By Category
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {SHOP_PRODUCTS.slice(0, 12).map((product, index) => (
          <ShopProductCard key={`${product.title}-${index}`} product={product} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          className="rounded-full border border-black px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-colors duration-200 hover:bg-cta hover:text-white"
          href="/#products"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
