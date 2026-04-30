"use client";

import Link from "next/link";

import { useCart } from "@/components/CartProvider";
import { FillImage } from "@/components/FillImage";
import type { ShopProduct } from "@/data/shop-products";

type CategoryProductCardProps = {
  product: ShopProduct;
};

const parsePrice = (price: string): number => Number.parseFloat(price.replace(/,/g, "").replace(/[^\d.]/g, "")) || 0;

const formatPkr = (value: number): string => `Rs.${value.toFixed(2)} PKR`;

export function CategoryProductCard({ product }: CategoryProductCardProps) {
  const { addToCart } = useCart();
  const discountedPrice = parsePrice(product.price);
  const originalPrice = discountedPrice + 301;
  const handleMouseMove: React.MouseEventHandler<HTMLElement> = (event) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = ((centerY - y) / centerY) * 5;

    card.style.setProperty("--card-rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--card-rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--shine-x", `${((x / bounds.width) * 100).toFixed(2)}%`);
    card.style.setProperty("--shine-y", `${((y / bounds.height) * 100).toFixed(2)}%`);
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLElement> = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--card-rotate-x", "0deg");
    card.style.setProperty("--card-rotate-y", "0deg");
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "50%");
  };

  return (
    <article
      className="product-card-3d group overflow-hidden rounded-2xl border border-[#f3e8ff] bg-white shadow-sm transition-[box-shadow,transform] duration-300 hover:shadow-lg"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="product-card-3d-surface">
        <Link className="relative block aspect-square overflow-hidden bg-[#faf5ff]" href={`/product/${product.slug}`}>
          <FillImage
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            src={product.imageSrc}
          />
        </Link>
        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-[#1c1917]">
            <Link className="transition-colors duration-200 hover:text-[#7e22ce]" href={`/product/${product.slug}`}>
              {product.title}
            </Link>
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-[#78716c] line-through">{formatPkr(originalPrice)}</span>
            <span className="text-sm font-semibold text-[#581c87]">{product.price}</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              className="flex-1 rounded-full bg-[#581c87] px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:bg-[#7e22ce]"
              onClick={() => addToCart(product)}
              type="button"
            >
              Add to cart
            </button>
            <Link
              className="flex-1 rounded-full border border-[#581c87] px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#581c87] transition-colors duration-200 hover:bg-[#f3e8ff]"
              href={`/product/${product.slug}`}
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
