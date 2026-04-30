"use client";

import { useCart } from "@/components/CartProvider";
import type { ShopProduct } from "@/data/shop-products";

type AddToCartButtonProps = {
  product: ShopProduct;
};

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  return (
    <button
      className="rounded-full bg-[#581c87] px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#7e22ce]"
      onClick={() => addToCart(product)}
      type="button"
    >
      Add to cart
    </button>
  );
}
