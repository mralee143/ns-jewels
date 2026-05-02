import { PRODUCT_CATEGORY_SLUGS, type ProductCategorySlug } from "@/data/product-categories";
import type { ShopProduct } from "@/data/shop-products";
import { getAllCatalogProducts } from "@/lib/get-product-by-slug";

export const getCrossCategoryRecommendations = (
  product: ShopProduct,
  limit = 4
): readonly ShopProduct[] => {
  const catalog = getAllCatalogProducts();
  const firstByCategory = new Map<ProductCategorySlug, ShopProduct>();

  for (const entry of catalog) {
    if (entry.slug === product.slug || entry.category === product.category) {
      continue;
    }

    if (!firstByCategory.has(entry.category)) {
      firstByCategory.set(entry.category, entry);
    }
  }

  const picks: ShopProduct[] = [];

  for (const slug of PRODUCT_CATEGORY_SLUGS) {
    if (slug === product.category) {
      continue;
    }

    const candidate = firstByCategory.get(slug);
    if (candidate) {
      picks.push(candidate);
    }

    if (picks.length >= limit) {
      break;
    }
  }

  return picks.slice(0, limit);
};
