import type { ShopProduct } from "@/data/shop-products";

const normalize = (value: string): string => value.trim().toLowerCase();

const productMatchesNeedle = (product: ShopProduct, needle: string): boolean => {
  const title = product.title.toLowerCase();
  const price = product.price.toLowerCase();
  return title.includes(needle) || price.includes(needle);
};

export const filterShopProductsByQuery = (
  query: string,
  products: readonly ShopProduct[]
): ShopProduct[] => {
  const needle = normalize(query);
  if (needle.length === 0) {
    return [];
  }

  return products.filter((product) => productMatchesNeedle(product, needle));
};
