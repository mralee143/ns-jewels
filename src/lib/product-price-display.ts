import type { ShopProduct } from "@/data/shop-products";
import { parsePriceStringToRupees } from "@/lib/pricing";

export const parsePriceLabelToNumber = (price: string): number => parsePriceStringToRupees(price);

export const formatPkrLine = (value: number): string => `Rs.${value.toFixed(2)} PKR`;

/** Compact storefront PKR label (same as {@link formatPkrLine}). */
export const formatRsAmount = (amount: number): string => formatPkrLine(amount);

export const resolveCompareAtAmount = (product: ShopProduct): number => {
  if (product.compareAtPrice) {
    return parsePriceLabelToNumber(product.compareAtPrice);
  }
  return parsePriceLabelToNumber(product.price) + 301;
};
