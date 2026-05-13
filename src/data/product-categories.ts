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

/** Listing heroes only — omit `-marble-bg`, `-velvet-bg`, `-display-*`, etc. (mirrors former `readPublicCategoryImagePaths` rules). */
export const CATALOGED_CATEGORY_IMAGES: Record<ProductCategorySlug, readonly string[]> = {
  anklets: ["/anklets/anklet-creative-display.png"],
  earrings: ["/earrings/Bow%20Earing.jpeg", "/earrings/Duck%20earing.jpeg"],
  bracelets: [
    "/bracelets/floral%20bracelet.jpeg",
    "/bracelets/heart%20bracelet%20(2).jpeg",
    "/bracelets/heart%20bracelet.jpeg",
    "/bracelets/love%20bracelet.jpeg",
    "/bracelets/love%20charm%20bracelet%20(2).jpeg",
    "/bracelets/luna%20love%20bracelet.jpeg",
    "/bracelets/merh%20watch%20bracelaet.jpeg",
    "/bracelets/bracelet-8.jpeg",
  ],
  handchain: ["/handchain/gold%20ball%20handchain.jpeg", "/handchain/pearls%20handchain.jpeg"],
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
    "/necklace/anne%20tiffany%20necklace.jpeg",
    "/necklace/black%20stone%20necklace.jpeg",
    "/necklace/black%20swan%20necklace.jpeg",
    "/necklace/blach%20v%20necklace.jpeg",
    "/necklace/bow%20necklace.jpeg",
    "/necklace/emerald%20stone%20necklace.jpeg",
    "/necklace/gold%20leaf%20charm%20necklace.jpeg",
    "/necklace/golden%20beaded%20necklace.jpeg",
    "/necklace/golden%20floral%20necklace.jpeg",
    "/necklace/golden%20petal%20necklace.jpeg",
    "/necklace/golden%20premium%20necklace.jpeg",
    "/necklace/heart%20necklace.jpeg",
    "/necklace/nail%20necklace.jpeg",
    "/necklace/pink%20stone%20necklace.jpeg",
    "/necklace/twinkle%20necklace.jpeg",
    "/necklace/vintage-rose-necklace-marble-bg.jpeg",
    "/necklace/watch%20necklace.jpeg",
    "/necklace/white%20stone%20necklace.jpeg",
  ],
  rings: [
    "/rings/adjustable%20black%20clover%20ring.jpeg",
    "/rings/adjustable%20floral%20ring.jpeg",
    "/rings/adjustable%20leaf%20ring%20(2).jpeg",
    "/rings/adjustable%20spril%20leaf%20ring.jpeg",
    "/rings/adjustable%20uneven%20ring.jpeg",
    "/rings/bhawra%20ring%20(2).jpeg",
    "/rings/butter%20fly%20ring.jpeg",
    "/rings/butterfly%20spiral%20ring.jpeg",
    "/rings/cartier%20stone%20ring.jpeg",
    "/rings/chanel%20ring.jpeg",
    "/rings/classic%20ring.jpeg",
    "/rings/double%20butterfly%20ring.jpeg",
    "/rings/floral%20ring.jpeg",
    "/rings/gucci%20ring.jpeg",
    "/rings/hreat%20rig.jpeg",
    "/rings/louis%20vuitton%20ring.jpeg",
    "/rings/nail%20ring.jpeg",
    "/rings/roman%20numeral%20ring.jpeg",
    "/rings/silver%20stone%20butterfly%20ring.jpeg",
    "/rings/spril%20leaf%20ring.jpeg",
    "/rings/stone%20abd%20butterfly%20ring.jpeg",
    "/rings/uneven%20ring.jpeg",
    "/rings/watch%20ring.jpeg",
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
