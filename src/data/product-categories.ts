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

export type CatalogedImageCategory = Exclude<ProductCategorySlug, "handchain" | "sets">;

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
  earrings: [
    "/earrings/earrings-1.jpeg",
    "/earrings/earrings-2.jpeg",
    "/earrings/earrings-3.jpeg",
  ],
  handcuffs: [
    "/handcuffs/handcuffs-1.jpeg",
    "/handcuffs/handcuffs-2.jpeg",
    "/handcuffs/handcuffs-3.jpeg",
    "/handcuffs/handcuffs-4.jpeg",
    "/handcuffs/handcuffs-5.jpeg",
    "/handcuffs/handcuffs-6.jpeg",
    "/handcuffs/handcuffs-7.jpeg",
    "/handcuffs/handcuffs-8.jpeg",
    "/handcuffs/handcuffs-9.jpeg",
    "/handcuffs/handcuffs-10.jpeg",
    "/handcuffs/handcuffs-11.jpeg",
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
  rings: [
    "/rings/ring-1.jpeg",
    "/rings/ring-2.jpeg",
    "/rings/ring-3.jpeg",
    "/rings/ring-4.jpeg",
    "/rings/ring-5.jpeg",
    "/rings/ring-6.jpeg",
    "/rings/ring-7.jpeg",
    "/rings/ring-8.jpeg",
    "/rings/ring-9.jpeg",
    "/rings/ring-10.jpeg",
    "/rings/ring-11.jpeg",
    "/rings/ring-12.jpeg",
    "/rings/ring-13.jpeg",
    "/rings/ring-14.jpeg",
    "/rings/ring-15.jpeg",
    "/rings/ring-16.jpeg",
    "/rings/ring-17.jpeg",
    "/rings/ring-18.jpeg",
    "/rings/ring-19.jpeg",
    "/rings/ring-20.jpeg",
    "/rings/ring-21.jpeg",
    "/rings/ring-22.jpeg",
    "/rings/ring-23.jpeg",
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
