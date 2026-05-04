import type { ProductCategorySlug } from "@/data/product-categories";

export type ShopProduct = {
  readonly category: ProductCategorySlug;
  readonly compareAtPrice?: string;
  readonly description: string;
  readonly featureBullets?: readonly string[];
  readonly id: string;
  readonly imageSrc: string;
  readonly price: string;
  readonly slug: string;
  readonly title: string;
  readonly additionalImages?: readonly string[];
};

const SETS_COMPARE_AT_PRICE = "Rs. 999.00 PKR";
const SETS_SALE_PRICE = "Rs. 849.00 PKR";

const WATCH_SETS_COMPARE_AT_PRICE = "Rs. 1799.00 PKR";
const WATCH_SETS_SALE_PRICE = "Rs. 1499.00 PKR";

export const SHOP_PRODUCTS: readonly ShopProduct[] = [
  {
    category: "anklets",
    compareAtPrice: "Rs. 950.00 PKR",
    description:
      "A delicate beaded chain anklet with a lightweight feel — ideal for everyday wear, beach days, and layering with your favorite sandals.",
    id: "beaded-chain-anklet",
    imageSrc: "/anklets/anklet-creative-display.png",
    additionalImages: [
      "/anklets/anklet-model-display.png",
      "/anklets/anklet-white-bg.png",
    ],
    price: "Rs. 599.00 PKR",
    slug: "beaded-chain-anklet",
    title: "Beaded Chain Anklet",
  },
  {
    category: "rings",
    description:
      "A timeless classic ring silhouette with polished finishing — versatile for everyday wear and gifting.",
    id: "classic-ring",
    imageSrc: "/rings/classic%20ring.jpeg",
    additionalImages: ["/rings/floral%20ring.jpeg"],
    price: "Rs. 599.00 PKR",
    slug: "classic-ring",
    title: "Classic Ring",
  },
  {
    category: "bracelets",
    description:
      "A watch-style bracelet with a sleek linked pattern, designed to give your wrist stack a premium look.",
    id: "mesh-watch-bracelet",
    imageSrc: "/bracelets/bracelet-1.jpeg",
    additionalImages: ["/bracelets/bracelet-2.jpeg", "/bracelets/bracelet-3.jpeg"],
    price: "Rs. 599.00 PKR",
    slug: "mesh-watch-bracelet",
    title: "Mesh Watch Bracelet",
  },
  {
    category: "handchain",
    description:
      "A delicate handchain silhouette that adds a graceful statement to both casual and occasion wear.",
    featureBullets: [
      "High-quality stainless steel material",
      "Smooth twisted design for a modern look",
      "Lightweight and easy to wear all day",
      "Perfect for casual and formal outfits",
      "Long-lasting shine with low maintenance",
    ],
    id: "heartlock-ring",
    imageSrc: "/handchain/handchain-1.jpeg",
    additionalImages: ["/handchain/handchain-2.jpeg"],
    price: "Rs. 350.00 PKR",
    slug: "heartlock-ring",
    title: "HeartLock Ring",
  },
  {
    category: "handcuffs",
    description:
      "Black stone detailing with a polished handcuff silhouette — refined on the wrist for everyday wear.",
    id: "black-stone-handcuff",
    imageSrc: "/handcuffs/Black%20Stone.jpeg",
    additionalImages: [
      "/handcuffs/black-stone-handcuff-display-2.jpeg",
      "/handcuffs/black-stone-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 1499.00 PKR",
    price: "Rs. 999.00 PKR",
    slug: "black-stone-handcuff",
    title: "Black Stone Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Green stone accents on a sleek handcuff profile — easy polish for daytime stacks or evening shine.",
    id: "green-stone-handcuff",
    imageSrc: "/handcuffs/Green%20stone.jpeg",
    additionalImages: [
      "/handcuffs/green-stone-handcuff-display-2.jpeg",
      "/handcuffs/green-stone-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 1499.00 PKR",
    price: "Rs. 999.00 PKR",
    slug: "green-stone-handcuff",
    title: "Green Stone Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "White stone highlights with a balanced handcuff form — bright, wearable, and gifts beautifully.",
    id: "white-stone-handcuff",
    imageSrc: "/handcuffs/White%20stone.jpeg",
    additionalImages: [
      "/handcuffs/white-stone-handcuff-display-2.jpeg",
      "/handcuffs/white-stone-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 1499.00 PKR",
    price: "Rs. 999.00 PKR",
    slug: "white-stone-handcuff",
    title: "White Stone Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Floral premium detailing on a sculpted handcuff band — feminine lines with everyday versatility.",
    id: "floral-premium-handcuff",
    imageSrc: "/handcuffs/floral%20premium.jpeg",
    additionalImages: [
      "/handcuffs/floral-premium-handcuff-display-2.jpeg",
      "/handcuffs/floral-premium-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 1499.00 PKR",
    price: "Rs. 999.00 PKR",
    slug: "floral-premium-handcuff",
    title: "Floral Premium Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Gucci-inspired profiling with a confident handcuff silhouette — polished metal presence on the wrist.",
    id: "gucci-handcuff",
    imageSrc: "/handcuffs/gucci.jpeg",
    additionalImages: [
      "/handcuffs/gucci-handcuff-display-2.jpeg",
      "/handcuffs/gucci-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 850.00 PKR",
    price: "Rs. 650.00 PKR",
    slug: "gucci-handcuff",
    title: "Gucci Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Nail-inspired lines with a sculptural handcuff band — sharp polish for stacks that still feel refined.",
    id: "nail-handcuff",
    imageSrc: "/handcuffs/Nail.jpeg",
    additionalImages: [
      "/handcuffs/nail-handcuff-display-2.jpeg",
      "/handcuffs/nail-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 999.00 PKR",
    price: "Rs. 750.00 PKR",
    slug: "nail-handcuff",
    title: "Nail Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Watch-forward detailing on a streamlined handcuff silhouette — everyday wrist presence with quiet shine.",
    id: "watch-handcuff",
    imageSrc: "/handcuffs/watch.jpeg",
    additionalImages: [
      "/handcuffs/watch-handcuff-display-2.jpeg",
      "/handcuffs/watch-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 999.00 PKR",
    price: "Rs. 750.00 PKR",
    slug: "watch-handcuff",
    title: "Watch Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Oval watch styling with softened edges — a balanced handcuff profile for dress-down and occasion wear.",
    id: "oval-watch-handcuff",
    imageSrc: "/handcuffs/Oval%20watch.jpeg",
    additionalImages: [
      "/handcuffs/oval-watch-handcuff-display-2.jpeg",
      "/handcuffs/oval-watch-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 999.00 PKR",
    price: "Rs. 750.00 PKR",
    slug: "oval-watch-handcuff",
    title: "Oval Watch Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Premium metal finishing with a confident handcuff curve — built to anchor your wrist stack.",
    id: "premium-handcuff",
    imageSrc: "/handcuffs/Premium.jpeg",
    compareAtPrice: "Rs. 999.00 PKR",
    price: "Rs. 750.00 PKR",
    slug: "premium-handcuff",
    title: "Premium Handcuff",
  },
  {
    category: "handcuffs",
    description:
      "Spiked accent detailing along a polished handcuff band — edge without sacrificing everyday wearability.",
    id: "spikes-handcuff",
    imageSrc: "/handcuffs/spikes.jpeg",
    additionalImages: [
      "/handcuffs/spikes-handcuff-display-2.jpeg",
      "/handcuffs/spikes-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 999.00 PKR",
    price: "Rs. 750.00 PKR",
    slug: "spikes-handcuff",
    title: "Spikes Handcuff",
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
      "Butterfly spiral styling with delicate lines — wear solo or stacked with your favorite bands.",
    id: "butterfly-spiral-ring",
    imageSrc: "/rings/butterfly%20spiral%20ring.jpeg",
    price: "Rs. 490.00 PKR",
    slug: "butterfly-spiral-ring",
    title: "Butterfly Spiral Ring",
  },
  {
    category: "earrings",
    compareAtPrice: "Rs. 599.00 PKR",
    description: "Bow-shaped earrings with a soft shine — easy to dress up or wear every day.",
    id: "bow-earrings",
    imageSrc: "/earrings/Bow%20Earing.jpeg",
    additionalImages: ["/earrings/bow-earring-display-2.jpeg", "/earrings/bow-earring-display-3.jpeg"],
    price: "Rs. 399.00 PKR",
    slug: "bow-earrings",
    title: "Bow Earrings",
  },
  {
    category: "earrings",
    compareAtPrice: "Rs. 599.00 PKR",
    description:
      "Black swan-inspired earrings with an elegant silhouette — a refined accent for day or evening.",
    id: "black-swan-earrings",
    imageSrc: "/earrings/Duck%20earing.jpeg",
    additionalImages: ["/earrings/black-swan-display-2.jpeg", "/earrings/black-swan-display-3.jpeg"],
    price: "Rs. 399.00 PKR",
    slug: "black-swan-earrings",
    title: "Black Swan Earrings",
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
      "Elara-line styling with a sleek handcuff profile — an elevated accent for layered wrist looks.",
    id: "elara-handcuff",
    imageSrc: "/handcuffs/elara.jpeg",
    additionalImages: [
      "/handcuffs/elara-handcuff-display-2.jpeg",
      "/handcuffs/elara-handcuff-display-3.jpeg",
    ],
    compareAtPrice: "Rs. 1299.00 PKR",
    price: "Rs. 799.00 PKR",
    slug: "elara-handcuff",
    title: "Elara Premium Handcuff",
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
  {
    category: "sets",
    description:
      "A coordinated clover-motif jewelry set with polished finishing — ready to wear together or mix into your stack.",
    id: "sets-black-clover",
    imageSrc: "/sets/black%20clover%20set.jpeg",
    additionalImages: ["/sets/black-clover-set-gallery-1.png", "/sets/black-clover-set-gallery-2.png"],
    compareAtPrice: SETS_COMPARE_AT_PRICE,
    price: SETS_SALE_PRICE,
    slug: "sets-black-clover",
    title: "Black Clover Set",
  },
  {
    category: "sets",
    description:
      "A matching heart-themed set in a deep tone — balanced shine for everyday outfits and gifting.",
    id: "sets-black-heart",
    imageSrc: "/sets/black%20heart%20set.jpeg",
    compareAtPrice: SETS_COMPARE_AT_PRICE,
    price: SETS_SALE_PRICE,
    slug: "sets-black-heart",
    title: "Black Heart Set",
  },
  {
    category: "sets",
    description:
      "Circle-watch styling paired with a complementary bracelet — one cohesive look from NS Jewels.",
    id: "sets-circle-watch",
    imageSrc: "/sets/circle%20watch%20set%20with%20bracelate.jpeg",
    additionalImages: [
      "/sets/circle-watch-set-display-2.jpeg",
      "/sets/circle-watch-set-display-3.jpeg",
    ],
    compareAtPrice: WATCH_SETS_COMPARE_AT_PRICE,
    price: WATCH_SETS_SALE_PRICE,
    slug: "sets-circle-watch",
    title: "Circle Watch Set",
  },
  {
    category: "sets",
    description:
      "Warm golden heart accents across a coordinated set — soft luxury with a romantic silhouette.",
    id: "sets-golden-heart",
    imageSrc: "/sets/golden%20heart%20set.jpeg",
    compareAtPrice: SETS_COMPARE_AT_PRICE,
    price: SETS_SALE_PRICE,
    slug: "sets-golden-heart",
    title: "Golden Heart Set",
  },
  {
    category: "sets",
    description:
      "Oval watch lines matched to a bracelet pairing — refined proportions for wrist-forward styling.",
    id: "sets-oval-watch-bracelet",
    imageSrc: "/sets/oval%20watch%20set%20with%20bracelate%20(2).jpeg",
    additionalImages: [
      "/sets/oval-watch-set-display-2.jpeg",
      "/sets/oval-watch-set-display-3.jpeg",
    ],
    compareAtPrice: WATCH_SETS_COMPARE_AT_PRICE,
    price: WATCH_SETS_SALE_PRICE,
    slug: "sets-oval-watch-bracelet",
    title: "Oval Watch Set",
  },
  {
    category: "sets",
    description:
      "Classic watch presence with a linked bracelet complement — an elevated everyday duo.",
    id: "sets-watch-bracelet",
    imageSrc: "/sets/watch%20set%20with%20bracelate.jpeg",
    additionalImages: [
      "/sets/watch-bracelet-set-display-2.jpeg",
      "/sets/watch-bracelet-set-display-3.jpeg",
    ],
    compareAtPrice: WATCH_SETS_COMPARE_AT_PRICE,
    price: WATCH_SETS_SALE_PRICE,
    slug: "sets-watch-bracelet",
    title: "Watch Bracelet Set",
  },
  {
    category: "sets",
    description:
      "A heart-forward coordinated set with polished detailing — signature romance from NS Jewels.",
    id: "sets-heart",
    imageSrc: "/sets/WhatsApp%20Image%202026-04-27%20at%207.02.44%20AM%20(1).jpeg",
    compareAtPrice: SETS_COMPARE_AT_PRICE,
    price: SETS_SALE_PRICE,
    slug: "sets-heart",
    title: "Heart Set",
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
  anklets: "Rs. 599.00 PKR",
  bracelets: "Rs. 599.00 PKR",
  earrings: "Rs. 399.00 PKR",
  handchain: "Rs. 450.00 PKR",
  handcuffs: "Rs. 650.00 PKR",
  necklace: "Rs. 699.00 PKR",
  rings: "Rs. 599.00 PKR",
  sets: SETS_SALE_PRICE,
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

  if (category === "handcuffs") {
    const title = `${titleStem} Handcuff`;
    const slug = `${safeBase}-handcuff`;

    return {
      category,
      description: `${title} from NS Jewels with premium finishing and elegant daily-wear styling.`,
      id: slug,
      imageSrc,
      price: DEFAULT_CATEGORY_PRICE[category],
      slug,
      title,
    };
  }

  const title = `${toCategoryLabel(category)} ${titleStem}`;

  return {
    category,
    description: `${title} from NS Jewels with premium finishing and elegant daily-wear styling.`,
    id: `${category}-${safeBase}`,
    imageSrc,
    ...(category === "sets" ? { compareAtPrice: SETS_COMPARE_AT_PRICE } : {}),
    price: DEFAULT_CATEGORY_PRICE[category],
    slug: `${category}-${safeBase}`,
    title,
  };
};

export const getProductFromCategoryImage = (
  category: ProductCategorySlug,
  imageSrc: string
): ShopProduct => SHOP_PRODUCTS_BY_IMAGE_SRC[imageSrc] ?? toFallbackProduct(category, imageSrc);
