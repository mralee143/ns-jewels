import { PRODUCT_CATEGORY_SLUGS } from "@/data/product-categories";
import { getProductFromCategoryImage, SHOP_PRODUCTS_BY_SLUG, type ShopProduct } from "@/data/shop-products";
import { getProductCategoryImages } from "@/lib/get-product-category-images";

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
