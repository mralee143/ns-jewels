import type { ShopProduct } from "@/data/shop-products";

const DEFAULT_FEATURE_BULLETS: readonly string[] = [
  "High-quality stainless steel material",
  "Smooth twisted design for a modern look",
  "Lightweight and easy to wear all day",
  "Perfect for casual and formal outfits",
  "Long-lasting shine with low maintenance",
];

const normalizeBulletsFromDescription = (description: string): readonly string[] => {
  const parts = description
    .split(/(?<=[.!?])\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
  return parts.length >= 3 ? parts.slice(0, 6) : [];
};

export const getProductFeatureBullets = (product: ShopProduct): readonly string[] => {
  if (product.featureBullets && product.featureBullets.length > 0) {
    return product.featureBullets;
  }

  const fromDescription = normalizeBulletsFromDescription(product.description);
  return fromDescription.length > 0 ? fromDescription : DEFAULT_FEATURE_BULLETS;
};
