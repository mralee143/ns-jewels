import { PRODUCT_CATEGORY_SLUGS, type ProductCategorySlug } from "@/data/product-categories";
import {
  getProductFromCategoryImage,
  SHOP_PRODUCTS,
  SHOP_PRODUCTS_BY_SLUG,
  type ShopProduct,
} from "@/data/shop-products";
import {
  findPublishedShopProducts,
  findPublishedShopProductsByCategory,
  findShopProductBySlugFromDb,
} from "@/lib/db-products";
import { getProductCategoryImages } from "@/lib/get-product-category-images";

const categoryListingOrder = (slug: ProductCategorySlug): number =>
  PRODUCT_CATEGORY_SLUGS.indexOf(slug);

const mergeProductsDbWins = (
  legacy: readonly ShopProduct[],
  dbProducts: readonly ShopProduct[]
): ShopProduct[] => {
  const bySlug = new Map<string, ShopProduct>();
  for (const product of legacy) {
    bySlug.set(product.slug, product);
  }
  for (const product of dbProducts) {
    bySlug.set(product.slug, product);
  }
  return [...bySlug.values()];
};

const sortListing = (products: readonly ShopProduct[]): ShopProduct[] =>
  [...products].sort((a, b) => {
    const orderA = categoryListingOrder(a.category);
    const orderB = categoryListingOrder(b.category);
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.title.localeCompare(b.title);
  });

/** Static-only listing (same behavior as before database-backed products). */
export const buildLegacyListingProducts = (): readonly ShopProduct[] => {
  const explicitHeroSrc = new Set(SHOP_PRODUCTS.map((product) => product.imageSrc));
  const bySlug = new Map<string, ShopProduct>();

  for (const product of buildLegacyCatalogProducts()) {
    if (explicitHeroSrc.has(product.imageSrc)) {
      continue;
    }
    bySlug.set(product.slug, product);
  }

  for (const product of SHOP_PRODUCTS) {
    bySlug.set(product.slug, product);
  }

  return sortListing([...bySlug.values()]);
};

/** Storefront listing: legacy catalog plus database products (DB overrides matching slugs). */
export async function getAllListingProducts(): Promise<readonly ShopProduct[]> {
  const [legacy, dbProducts] = await Promise.all([
    Promise.resolve(buildLegacyListingProducts()),
    findPublishedShopProducts(),
  ]);
  return sortListing(mergeProductsDbWins(legacy, dbProducts));
};

export const buildLegacyCatalogProducts = (): readonly ShopProduct[] => {
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

/** Full merged catalog for recommendations and static route hints. */
export async function getAllCatalogProducts(): Promise<readonly ShopProduct[]> {
  const [legacy, dbProducts] = await Promise.all([
    Promise.resolve(buildLegacyCatalogProducts()),
    findPublishedShopProducts(),
  ]);
  return sortListing(mergeProductsDbWins(legacy, dbProducts));
};

export const getLegacyProductBySlug = (slug: string): ShopProduct | null => {
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

/** Resolved product for PDP and APIs (published DB rows override legacy). */
export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const fromDb = await findShopProductBySlugFromDb(slug);
  if (fromDb) {
    return fromDb;
  }
  return getLegacyProductBySlug(slug);
}

/** Category listing grid: image-derived SKUs plus DB-only products for that category. */
export async function getCategoryListingProducts(
  category: ProductCategorySlug
): Promise<readonly ShopProduct[]> {
  const images = getProductCategoryImages(category);
  const fromImages = images.map((src) => getProductFromCategoryImage(category, src));
  const dbForCategory = await findPublishedShopProductsByCategory(category);
  return sortListing(mergeProductsDbWins(fromImages, dbForCategory));
}
