import { PRODUCT_CATEGORY_SLUGS, type ProductCategorySlug } from "@/data/product-categories";
import {
  getProductFromCategoryImage,
  SHOP_PRODUCTS,
  SHOP_PRODUCTS_BY_SLUG,
  type ShopProduct,
} from "@/data/shop-products";
import { getProductCategoryImages } from "@/lib/get-product-category-images";

const categoryListingOrder = (slug: ProductCategorySlug): number =>
  PRODUCT_CATEGORY_SLUGS.indexOf(slug);

/** Full storefront listing: every category image SKU plus explicit `SHOP_PRODUCTS` rows (deduped by slug; explicit entries win). */
export const getAllListingProducts = (): readonly ShopProduct[] => {
  const bySlug = new Map<string, ShopProduct>();

  for (const product of getAllCatalogProducts()) {
    bySlug.set(product.slug, product);
  }

  for (const product of SHOP_PRODUCTS) {
    bySlug.set(product.slug, product);
  }

  return [...bySlug.values()].sort((a, b) => {
    const orderA = categoryListingOrder(a.category);
    const orderB = categoryListingOrder(b.category);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.title.localeCompare(b.title);
  });
};

export const getProductBySlug = (slug: string): ShopProduct | null => {
  const direct = SHOP_PRODUCTS_BY_SLUG[slug];
  if (direct) {
    return direct;
  }

  for (const category of PRODUCT_CATEGORY_SLUGS) {
    const images = getProductCategoryImages(category);
    for (const imageSrc of images) {
      const product = getProductFromCategoryImage(category, imageSrc);
      if (product.slug === slug) {
        return product;
      }
    }
  }

  return null;
};

export const getAllCatalogProducts = (): readonly ShopProduct[] => {
  const catalog = PRODUCT_CATEGORY_SLUGS.flatMap((category) =>
    getProductCategoryImages(category).map((imageSrc) => getProductFromCategoryImage(category, imageSrc))
  );
  const seen = new Set<string>();

  return catalog.filter((product) => {
    if (seen.has(product.slug)) {
      return false;
    }
    seen.add(product.slug);
    return true;
  });
};
