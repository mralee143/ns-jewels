import type { ProductCategorySlug } from "@/data/product-categories";

export type ShopProduct = {
  readonly category: "bracelets" | "handchain" | "handcuffs" | "necklace" | "rings";
  readonly description: string;
  readonly id: string;
  readonly imageSrc: string;
  readonly price: string;
  readonly slug: string;
  readonly title: string;
};

export const SHOP_PRODUCTS: readonly ShopProduct[] = [
  {
    category: "rings",
    description:
      "A classic emerald-inspired ring with a polished finish that works for both everyday styling and festive looks.",
    id: "emerald-grace-ring",
    imageSrc: "/rings/ring-1.jpeg",
    price: "Rs. 599.00 PKR",
    slug: "emerald-grace-ring",
    title: "Emerald Grace Ring",
  },
  {
    category: "bracelets",
    description:
      "A watch-style bracelet with a sleek linked pattern, designed to give your wrist stack a premium look.",
    id: "mesh-watch-bracelet",
    imageSrc: "/bracelets/bracelet-1.jpeg",
    price: "Rs. 599.00 PKR",
    slug: "mesh-watch-bracelet",
    title: "Mesh Watch Bracelet",
  },
  {
    category: "handchain",
    description:
      "A delicate handchain silhouette that adds a graceful statement to both casual and occasion wear.",
    id: "heartlock-ring",
    imageSrc: "/handchain/handchain-1.jpeg",
    price: "Rs. 350.00 PKR",
    slug: "heartlock-ring",
    title: "HeartLock Ring",
  },
  {
    category: "handcuffs",
    description:
      "An elegant heart-detailed handcuff style piece, crafted to highlight your hand with minimal effort.",
    id: "heart-drop-necklace",
    imageSrc: "/handcuffs/handcuffs-1.jpeg",
    price: "Rs. 650.00 PKR",
    slug: "heart-drop-necklace",
    title: "Heart Drop Necklace",
  },
  {
    category: "necklace",
    description:
      "A crystal pendant profile with a soft shine that pairs beautifully with layered chains or solo styling.",
    id: "luna-crystal-pendant",
    imageSrc: "/necklace/necklace-1.jpeg",
    price: "Rs. 699.00 PKR",
    slug: "luna-crystal-pendant",
    title: "Luna Crystal Pendant",
  },
  {
    category: "necklace",
    description:
      "A coordinated jewelry set look with balanced sparkle, ideal for gifting and special events.",
    id: "aurora-set",
    imageSrc: "/necklace/necklace-2.jpeg",
    price: "Rs. 780.00 PKR",
    slug: "aurora-set",
    title: "Aurora Set",
  },
  {
    category: "rings",
    description:
      "A layered vintage-inspired ring style with textured details that stand out in close-up shots.",
    id: "vintage-ring-stack",
    imageSrc: "/rings/ring-2.jpeg",
    price: "Rs. 490.00 PKR",
    slug: "vintage-ring-stack",
    title: "Vintage Ring Stack",
  },
  {
    category: "necklace",
    description:
      "A glow-finish pendant piece that gives subtle brilliance and pairs well with rose or gold tones.",
    id: "pendant-glow",
    imageSrc: "/necklace/necklace-3.jpeg",
    price: "Rs. 610.00 PKR",
    slug: "pendant-glow",
    title: "Pendant Glow",
  },
  {
    category: "bracelets",
    description:
      "A timeless bracelet profile made for day-to-day wear, with a polished texture and refined edge.",
    id: "classic-bracelet",
    imageSrc: "/bracelets/bracelet-2.jpeg",
    price: "Rs. 520.00 PKR",
    slug: "classic-bracelet",
    title: "Classic Bracelet",
  },
  {
    category: "handcuffs",
    description:
      "A velvet-inspired charm handcuff design that adds a bold focal point to your jewelry collection.",
    id: "velvet-handcuff-charm",
    imageSrc: "/handcuffs/handcuffs-2.jpeg",
    price: "Rs. 540.00 PKR",
    slug: "velvet-handcuff-charm",
    title: "Velvet Handcuff Charm",
  },
  {
    category: "necklace",
    description:
      "A two-piece crystal-forward set style that offers balanced brilliance for elevated outfits.",
    id: "crystal-duo-set",
    imageSrc: "/necklace/necklace-4.jpeg",
    price: "Rs. 720.00 PKR",
    slug: "crystal-duo-set",
    title: "Crystal Duo Set",
  },
  {
    category: "necklace",
    description:
      "A twilight-toned pendant expression with a refined chain profile and lightweight daily comfort.",
    id: "twilight-pendant",
    imageSrc: "/necklace/necklace-5.jpeg",
    price: "Rs. 590.00 PKR",
    slug: "twilight-pendant",
    title: "Twilight Pendant",
  },
] as const;

export const SHOP_PRODUCTS_BY_SLUG = SHOP_PRODUCTS.reduce<Record<string, ShopProduct>>(
  (accumulator, product) => ({
    ...accumulator,
    [product.slug]: product,
  }),
  {}
);

export const SHOP_PRODUCTS_BY_IMAGE_SRC = SHOP_PRODUCTS.reduce<Record<string, ShopProduct>>(
  (accumulator, product) => ({
    ...accumulator,
    [product.imageSrc]: product,
  }),
  {}
);

const DEFAULT_CATEGORY_PRICE: Record<ProductCategorySlug, string> = {
  anklets: "Rs. 499.00 PKR",
  bracelets: "Rs. 599.00 PKR",
  earrings: "Rs. 549.00 PKR",
  handchain: "Rs. 450.00 PKR",
  handcuffs: "Rs. 650.00 PKR",
  necklace: "Rs. 699.00 PKR",
  rings: "Rs. 599.00 PKR",
  sets: "Rs. 780.00 PKR",
};

const toDecodedStem = (imageSrc: string): string => {
  const segment = imageSrc.split("/").pop() ?? "product";
  const decoded = decodeURIComponent(segment);
  return decoded.replace(/\.[^.]+$/, "");
};

const toWords = (value: string): string[] => value.split(/[^a-zA-Z0-9]+/).filter(Boolean);

const toTitleCase = (value: string): string =>
  toWords(value)
    .map((word) => `${word[0]?.toUpperCase() ?? ""}${word.slice(1).toLowerCase()}`)
    .join(" ");

const toCategoryLabel = (category: ProductCategorySlug): string =>
  `${category[0]?.toUpperCase() ?? ""}${category.slice(1).toLowerCase()}`;

const toFallbackProduct = (category: ProductCategorySlug, imageSrc: string): ShopProduct => {
  const stem = toDecodedStem(imageSrc);
  const base = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const safeBase = base.replace(/^-+|-+$/g, "") || "item";
  const titleStem = toTitleCase(stem) || "Product";
  const title = `${toCategoryLabel(category)} ${titleStem}`;

  return {
    category,
    description: `${title} from NS Jewels with premium finishing and elegant daily-wear styling.`,
    id: `${category}-${safeBase}`,
    imageSrc,
    price: DEFAULT_CATEGORY_PRICE[category],
    slug: `${category}-${safeBase}`,
    title,
  };
};

export const getProductFromCategoryImage = (
  category: ProductCategorySlug,
  imageSrc: string
): ShopProduct => SHOP_PRODUCTS_BY_IMAGE_SRC[imageSrc] ?? toFallbackProduct(category, imageSrc);
