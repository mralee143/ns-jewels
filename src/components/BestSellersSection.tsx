import Link from "next/link";

import { BestSellerProductCard } from "@/components/BestSellerProductCard";
import { SHOP_PRODUCTS } from "@/data/shop-products";

const FEATURED = SHOP_PRODUCTS.slice(0, 4);

export function BestSellersSection() {
  return (
    <section className="bg-[#EFE9FF]/40 py-14 sm:py-16" id="best-sellers">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[0.06em] text-black sm:text-4xl">
              Best sellers
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-black">
              Pieces customers reach for again and again — refined finishes, everyday comfort.
            </p>
          </div>
          <Link
            className="text-xs font-semibold uppercase tracking-[0.14em] text-black transition-colors duration-200 hover:text-neutral-800"
            href="/products/necklace"
          >
            Shop all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {FEATURED.map((product) => (
            <BestSellerProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
