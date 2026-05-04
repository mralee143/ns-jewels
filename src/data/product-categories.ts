export const PRODUCT_CATEGORY_SLUGS = [
  "bracelets",
  "handchain",
  "necklace",
  "rings",
  "sets",
  "handcuffs",
  "earrings",
  "anklets",
] as const;

export type ProductCategorySlug = (typeof PRODUCT_CATEGORY_SLUGS)[number];

export type CatalogedImageCategory = Exclude<ProductCategorySlug, "handchain" | "rings">;

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategorySlug, string> = {
  anklets: "Anklets",
  bracelets: "Bracelets",
  earrings: "Earrings",
  handcuffs: "Handcuffs",
  handchain: "Handchain",
  necklace: "Necklace",
  rings: "Rings",
  sets: "Sets",
};

export const CATALOGED_CATEGORY_IMAGES: Record<CatalogedImageCategory, readonly string[]> = {
  anklets: ["/anklets/anklet-creative-display.png"],
  earrings: ["/earrings/Bow%20Earing.jpeg", "/earrings/Duck%20earing.jpeg"],
  bracelets: [
    "/bracelets/bracelet-1.jpeg",
    "/bracelets/bracelet-2.jpeg",
    "/bracelets/bracelet-3.jpeg",
    "/bracelets/bracelet-4.jpeg",
    "/bracelets/bracelet-5.jpeg",
    "/bracelets/bracelet-6.jpeg",
    "/bracelets/bracelet-7.jpeg",
    "/bracelets/bracelet-8.jpeg",
    "/bracelets/bracelet-9.jpeg",
  ],
  handcuffs: [
    "/handcuffs/Black%20Stone.jpeg",
    "/handcuffs/elara.jpeg",
    "/handcuffs/floral%20premium.jpeg",
    "/handcuffs/Green%20stone.jpeg",
    "/handcuffs/gucci.jpeg",
    "/handcuffs/Nail.jpeg",
    "/handcuffs/Oval%20watch.jpeg",
    "/handcuffs/Premium.jpeg",
    "/handcuffs/spikes.jpeg",
    "/handcuffs/watch.jpeg",
    "/handcuffs/White%20stone.jpeg",
  ],
  necklace: [
    "/necklace/necklace-1.jpeg",
    "/necklace/necklace-2.jpeg",
    "/necklace/necklace-3.jpeg",
    "/necklace/necklace-4.jpeg",
    "/necklace/necklace-5.jpeg",
    "/necklace/necklace-6.jpeg",
    "/necklace/necklace-7.jpeg",
    "/necklace/necklace-8.jpeg",
    "/necklace/necklace-9.jpeg",
    "/necklace/necklace-10.jpeg",
    "/necklace/necklace-11.jpeg",
    "/necklace/necklace-12.jpeg",
    "/necklace/necklace-13.jpeg",
    "/necklace/necklace-14.jpeg",
    "/necklace/necklace-15.jpeg",
    "/necklace/necklace-16.jpeg",
    "/necklace/necklace-17.jpeg",
  ],
  /** Primary hero paths only — matches `imageSrc` in shop-products so extras stay on product detail (same pattern as anklets). */
  sets: [
    "/sets/black%20clover%20set.jpeg",
    "/sets/black%20heart%20set.jpeg",
    "/sets/circle%20watch%20set%20with%20bracelate.jpeg",
    "/sets/golden%20heart%20set.jpeg",
    "/sets/oval%20watch%20set%20with%20bracelate%20(2).jpeg",
    "/sets/watch%20set%20with%20bracelate.jpeg",
    "/sets/WhatsApp%20Image%202026-04-27%20at%207.02.44%20AM%20(1).jpeg",
  ],
};

export const productCategoryHref = (slug: ProductCategorySlug): string => `/products/${slug}`;

export const isProductCategorySlug = (value: string): value is ProductCategorySlug =>
  (PRODUCT_CATEGORY_SLUGS as readonly string[]).includes(value);

export const imageStemToAlt = (src: string): string => {
  const segment = src.split("/").pop() ?? "product";
  const decoded = decodeURIComponent(segment);
  const stem = decoded.replace(/\.[^.]+$/, "");
  return stem.replace(/-/g, " ");
};
