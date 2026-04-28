import Link from "next/link";

import { ShopProductCard } from "@/components/ShopProductCard";
import { SHOP_PRODUCTS } from "@/data/shop-products";

export function StyleIdeasSection() {
  return (
    <section className="mx-auto max-w-[1320px] pb-16 pt-4 sm:pb-20 sm:pt-6">
      <div className="mb-6 text-center sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78716c]">Product List</p>
        <h3 className="mt-2 font-display text-2xl font-semibold tracking-[0.08em] text-[#1c1917] sm:text-3xl">
          Shop By Category
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {SHOP_PRODUCTS.map((product, index) => (
          <ShopProductCard key={`${product.title}-${index}`} product={product} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link
          className="rounded-full border border-[#1f2937] px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f2937] transition-colors duration-200 hover:bg-[#1f2937] hover:text-white"
          href="/#products"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
