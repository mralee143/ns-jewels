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
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "A timeless classic ring silhouette with polished finishing — versatile for everyday wear and gifting.",
    id: "classic-ring",
    imageSrc: "/rings/classic%20ring.jpeg",
    additionalImages: [
      "/rings/classic-ring-marble-bg.jpeg",
      "/rings/classic-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "classic-ring",
    title: "Classic Ring",
  },
  {
    category: "bracelets",
    description:
      "A watch-style bracelet with a sleek linked pattern, designed to give your wrist stack a premium look.",
    id: "mesh-watch-bracelet",
    imageSrc: "/bracelets/merh%20watch%20bracelaet.jpeg",
    additionalImages: [
      "/bracelets/merh-watch-bracelet-marble-bg.jpeg",
      "/bracelets/merh-watch-bracelet-velvet-bg.jpeg",
    ],
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
    imageSrc: "/handchain/gold%20ball%20handchain.jpeg",
    additionalImages: [
      "/handchain/gold-ball-handchain-marble-bg.jpeg",
      "/handchain/gold-ball-handchain-velvet-bg.jpeg",
    ],
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
    imageSrc: "/necklace/twinkle%20necklace.jpeg",
    additionalImages: [
      "/necklace/twinkle-necklace-marble-bg.jpeg",
      "/necklace/twinkle-necklace-velvet-bg.jpeg",
    ],
    price: "Rs. 699.00 PKR",
    slug: "luna-crystal-pendant",
    title: "Luna Crystal Pendant",
  },
  {
    category: "necklace",
    description:
      "A coordinated jewelry set look with balanced sparkle, ideal for gifting and special events.",
    id: "aurora-set",
    imageSrc: "/necklace/golden%20floral%20necklace.jpeg",
    additionalImages: [
      "/necklace/golden-floral-necklace-marble-bg.jpeg",
      "/necklace/golden-floral-necklace-velvet-bg.jpeg",
    ],
    price: "Rs. 780.00 PKR",
    slug: "aurora-set",
    title: "Aurora Set",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Adjustable butterfly spiral styling with delicate lines — wear solo or stacked with your favorite bands.",
    id: "butterfly-spiral-ring",
    imageSrc: "/rings/butterfly%20spiral%20ring.jpeg",
    additionalImages: [
      "/rings/butterfly-spiral-ring-marble-bg.jpeg",
      "/rings/butterfly-spiral-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "butterfly-spiral-ring",
    title: "Adjustable Butterfly Spiral Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Black clover motif on an adjustable band — polished presence for everyday stacks and gifting.",
    id: "adjustable-black-clover-ring",
    imageSrc: "/rings/adjustable%20black%20clover%20ring.jpeg",
    additionalImages: [
      "/rings/adjustable-black-clover-ring-marble-bg.jpeg",
      "/rings/adjustable-black-clover-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "adjustable-black-clover-ring",
    title: "Adjustable Black Clover Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Floral lines on an adjustable silhouette — soft femininity with a refined daily-wear finish.",
    id: "adjustable-floral-ring-2",
    imageSrc: "/rings/adjustable%20floral%20ring.jpeg",
    additionalImages: [
      "/rings/adjustable-floral-ring-marble-bg.jpeg",
      "/rings/adjustable-floral-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "adjustable-floral-ring-2",
    title: "Adjustable Floral Ring (2)",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Leaf-inspired adjustable styling with a lightweight feel — easy to pair solo or in a stack.",
    id: "adjustable-leaf-ring",
    imageSrc: "/rings/adjustable%20leaf%20ring%20(2).jpeg",
    additionalImages: [
      "/rings/adjustable-leaf-ring-2-marble-bg.jpeg",
      "/rings/adjustable-leaf-ring-2-velvet-bg.jpeg",
    ],
    price: "Rs. 449.00 PKR",
    slug: "adjustable-leaf-ring",
    title: "Adjustable Leaf Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Spiral leaf detailing on an adjustable band — sculptural lines with everyday comfort.",
    id: "adjustable-spril-leaf-ring-1",
    imageSrc: "/rings/adjustable%20spril%20leaf%20ring.jpeg",
    additionalImages: [
      "/rings/adjustable-spril-leaf-ring-marble-bg.jpeg",
      "/rings/adjustable-spril-leaf-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "adjustable-spril-leaf-ring-1",
    title: "Adjustable Spril Leaf Ring (1)",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Uneven-edge adjustable styling for a modern stack — polished metal with a confident profile.",
    id: "adjustable-uneven-ring-1",
    imageSrc: "/rings/uneven%20ring.jpeg",
    additionalImages: [
      "/rings/uneven-ring-marble-bg.jpeg",
      "/rings/uneven-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "adjustable-uneven-ring-1",
    title: "Adjustable Uneven Ring (1)",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Bhawra-inspired silhouette with premium finishing — a signature accent from NS Jewels.",
    id: "bhawra-ring",
    imageSrc: "/rings/bhawra%20ring%20(2).jpeg",
    additionalImages: [
      "/rings/bhawra-ring-2-marble-bg.jpeg",
      "/rings/bhawra-ring-2-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "bhawra-ring",
    title: "Bhawra Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 749.00 PKR",
    description:
      "Butterfly-forward lines with a polished shine — an airy accent for day-to-night outfits.",
    id: "butterfly-ring",
    imageSrc: "/rings/butter%20fly%20ring.jpeg",
    additionalImages: [
      "/rings/butter-fly-ring-marble-bg.jpeg",
      "/rings/butter-fly-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 300.00 PKR",
    slug: "butterfly-ring",
    title: "Butterfly Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Stone-forward Cartier-inspired detailing — refined presence for gifting and daily wear.",
    id: "cartier-stone-ring",
    imageSrc: "/rings/cartier%20stone%20ring.jpeg",
    additionalImages: [
      "/rings/cartier-stone-ring-marble-bg.jpeg",
      "/rings/cartier-stone-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "cartier-stone-ring",
    title: "Cartier Stone Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 749.00 PKR",
    description:
      "Chanel-inspired profiling with polished finishing — quiet luxury for your ring stack.",
    id: "chanel-ring",
    imageSrc: "/rings/chanel%20ring.jpeg",
    additionalImages: [
      "/rings/chanel-ring-marble-bg.jpeg",
      "/rings/chanel-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 349.00 PKR",
    slug: "chanel-ring",
    title: "Chanel Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 800.00 PKR",
    description:
      "Double butterfly styling with balanced symmetry — romantic sparkle for everyday outfits.",
    id: "double-butterfly-ring",
    imageSrc: "/rings/double%20butterfly%20ring.jpeg",
    additionalImages: [
      "/rings/double-butterfly-ring-marble-bg.jpeg",
      "/rings/double-butterfly-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "double-butterfly-ring",
    title: "Double Butterfly Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Floral petal lines on an adjustable band — soft shine that layers beautifully with classics.",
    id: "adjustable-floral-ring-1",
    imageSrc: "/rings/floral%20ring.jpeg",
    additionalImages: [
      "/rings/floral-ring-marble-bg.jpeg",
      "/rings/floral-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 449.00 PKR",
    slug: "adjustable-floral-ring-1",
    title: "Adjustable Floral Ring (1)",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 749.00 PKR",
    description:
      "Gucci-inspired ring profiling with confident polish — a statement piece that still feels wearable.",
    id: "gucci-ring",
    imageSrc: "/rings/gucci%20ring.jpeg",
    additionalImages: [
      "/rings/gucci-ring-marble-bg.jpeg",
      "/rings/gucci-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "gucci-ring",
    title: "Gucci Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 600.00 PKR",
    description:
      "Heart silhouette styling with a soft romantic finish — perfect for gifting and daily shine.",
    id: "heart-ring",
    imageSrc: "/rings/hreat%20rig.jpeg",
    additionalImages: [
      "/rings/hreat-rig-marble-bg.jpeg",
      "/rings/hreat-rig-velvet-bg.jpeg",
    ],
    price: "Rs. 299.00 PKR",
    slug: "heart-ring",
    title: "Heart Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Louis Vuitton-inspired detailing with premium finishing — elevated presence for your stack.",
    id: "louis-vuitton-ring",
    imageSrc: "/rings/louis%20vuitton%20ring.jpeg",
    additionalImages: [
      "/rings/louis-vuitton-ring-marble-bg.jpeg",
      "/rings/louis-vuitton-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "louis-vuitton-ring",
    title: "Louis Vuitton Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 849.00 PKR",
    description:
      "Nail-inspired ring lines with sculptural polish — sharp, refined, and stack-friendly.",
    id: "nail-ring",
    imageSrc: "/rings/nail%20ring.jpeg",
    additionalImages: [
      "/rings/nail-ring-marble-bg.jpeg",
      "/rings/nail-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "nail-ring",
    title: "Nail Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 800.00 PKR",
    description:
      "Roman numeral detailing with a timeless profile — classic typography for everyday wear.",
    id: "roman-numeral-ring",
    imageSrc: "/rings/roman%20numeral%20ring.jpeg",
    additionalImages: [
      "/rings/roman-numeral-ring-marble-bg.jpeg",
      "/rings/roman-numeral-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "roman-numeral-ring",
    title: "Roman Numeral Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 749.00 PKR",
    description:
      "Silver-tone stone accents with butterfly styling — soft sparkle for day-to-night looks.",
    id: "silver-stone-butterfly-ring",
    imageSrc: "/rings/silver%20stone%20butterfly%20ring.jpeg",
    additionalImages: [
      "/rings/silver-stone-butterfly-ring-marble-bg.jpeg",
      "/rings/silver-stone-butterfly-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "silver-stone-butterfly-ring",
    title: "Silver Stone and Butterfly Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Spiral leaf lines with polished finishing — sculptural shine that pairs with your favorite bands.",
    id: "spril-leaf-ring",
    imageSrc: "/rings/spril%20leaf%20ring.jpeg",
    additionalImages: [
      "/rings/spril-leaf-ring-marble-bg.jpeg",
      "/rings/spril-leaf-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "spril-leaf-ring",
    title: "Spril Leaf Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 700.00 PKR",
    description:
      "Stone highlights paired with butterfly styling — balanced sparkle for everyday outfits.",
    id: "stone-butterfly-ring",
    imageSrc: "/rings/stone%20abd%20butterfly%20ring.jpeg",
    additionalImages: [
      "/rings/stone-abd-butterfly-ring-marble-bg.jpeg",
      "/rings/stone-abd-butterfly-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 399.00 PKR",
    slug: "stone-butterfly-ring",
    title: "Stone and Butterfly Ring",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Uneven-edge adjustable styling — a second profile option for modern ring stacks.",
    id: "adjustable-uneven-ring-2",
    imageSrc: "/rings/adjustable%20uneven%20ring.jpeg",
    additionalImages: [
      "/rings/adjustable-uneven-ring-marble-bg.jpeg",
      "/rings/adjustable-uneven-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "adjustable-uneven-ring-2",
    title: "Adjustable Uneven Ring (2)",
  },
  {
    category: "rings",
    compareAtPrice: "Rs. 899.00 PKR",
    description:
      "Watch-forward ring styling with sleek lines — wrist-inspired polish for your fingers.",
    id: "watch-ring",
    imageSrc: "/rings/watch%20ring.jpeg",
    additionalImages: [
      "/rings/watch-ring-marble-bg.jpeg",
      "/rings/watch-ring-velvet-bg.jpeg",
    ],
    price: "Rs. 450.00 PKR",
    slug: "watch-ring",
    title: "Watch Ring",
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
    imageSrc: "/necklace/golden%20beaded%20necklace.jpeg",
    additionalImages: [
      "/necklace/golden-beaded-necklace-marble-bg.jpeg",
      "/necklace/golden-beaded-necklace-velvet-bg.jpeg",
    ],
    price: "Rs. 610.00 PKR",
    slug: "pendant-glow",
    title: "Pendant Glow",
  },
  {
    category: "bracelets",
    description:
      "A timeless bracelet profile made for day-to-day wear, with a polished texture and refined edge.",
    id: "classic-bracelet",
    imageSrc: "/bracelets/bracelet-8.jpeg",
    additionalImages: [
      "/bracelets/bracelet-8-marble-bg.jpeg",
      "/bracelets/bracelet-8-velvet-bg.jpeg",
    ],
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
    imageSrc: "/necklace/emerald%20stone%20necklace.jpeg",
    additionalImages: [
      "/necklace/emerald-stone-necklace-marble-bg.jpeg",
      "/necklace/emerald-stone-necklace-velvet-bg.jpeg",
    ],
    price: "Rs. 720.00 PKR",
    slug: "crystal-duo-set",
    title: "Crystal Duo Set",
  },
  {
    category: "necklace",
    description:
      "A twilight-toned pendant expression with a refined chain profile and lightweight daily comfort.",
    id: "twilight-pendant",
    imageSrc: "/necklace/vintage%20rose%20necklace.jpeg",
    additionalImages: [
      "/necklace/vintage-rose-necklace-marble-bg.jpeg",
      "/necklace/vintage-rose-necklace-velvet-bg.jpeg",
    ],
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
    additionalImages: [
      "/sets/black-heart-set-gallery-blush-silk.png",
      "/sets/black-heart-set-gallery-wood-linen.png",
    ],
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
    additionalImages: [
      "/sets/golden-heart-set-gallery-burgundy-velvet.png",
      "/sets/golden-heart-set-gallery-white-marble.png",
    ],
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
    additionalImages: [
      "/sets/sets-heart-gallery-blush-silk.png",
      "/sets/sets-heart-gallery-forest-velvet.png",
    ],
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

/** Home “Shop By Category”: two handcuffs plus a broad mix (see `StyleIdeasSection`). */
const HOME_SHOP_BY_CATEGORY_SLUGS = [
  "black-stone-handcuff",
  "gucci-handcuff",
  "beaded-chain-anklet",
  "classic-ring",
  "butterfly-spiral-ring",
  "mesh-watch-bracelet",
  "classic-bracelet",
  "heartlock-ring",
  "luna-crystal-pendant",
  "pendant-glow",
  "crystal-duo-set",
  "bow-earrings",
  "black-swan-earrings",
  "sets-black-clover",
  "sets-golden-heart",
  "sets-circle-watch",
] as const;

export const HOME_SHOP_BY_CATEGORY_PRODUCTS: readonly ShopProduct[] =
  HOME_SHOP_BY_CATEGORY_SLUGS.map((slug) => {
    const product = SHOP_PRODUCTS_BY_SLUG[slug];
    if (product === undefined) {
      throw new Error(`HOME_SHOP_BY_CATEGORY_PRODUCTS: missing slug "${slug}"`);
    }
    return product;
  });

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

const NECKLACE_ADDITIONAL_IMAGES_BY_STEM: Record<string, readonly string[]> = {
  "anne tiffany necklace": [
    "/necklace/anne-tiffany-necklace-marble-bg.jpeg",
    "/necklace/anne-tiffany-necklace-velvet-bg.jpeg",
  ],
  "black stone necklace": [
    "/necklace/black-stone-necklace-marble-bg.jpeg",
    "/necklace/black-stone-necklace-velvet-bg.jpeg",
  ],
  "black swan necklace": [
    "/necklace/black-swan-necklace-marble-bg.jpeg",
    "/necklace/black-swan-necklace-velvet-bg.jpeg",
  ],
  "blach v necklace": [
    "/necklace/blach-v-necklace-marble-bg.jpeg",
    "/necklace/blach-v-necklace-velvet-bg.jpeg",
  ],
  "bow necklace": [
    "/necklace/bow-necklace-marble-bg.jpeg",
    "/necklace/bow-necklace-velvet-bg.jpeg",
  ],
  "emerald stone necklace": [
    "/necklace/emerald-stone-necklace-marble-bg.jpeg",
    "/necklace/emerald-stone-necklace-velvet-bg.jpeg",
  ],
  "gold leaf charm necklace": [
    "/necklace/gold-leaf-charm-necklace-marble-bg.jpeg",
    "/necklace/gold-leaf-charm-necklace-velvet-bg.jpeg",
  ],
  "golden beaded necklace": [
    "/necklace/golden-beaded-necklace-marble-bg.jpeg",
    "/necklace/golden-beaded-necklace-velvet-bg.jpeg",
  ],
  "golden floral necklace": [
    "/necklace/golden-floral-necklace-marble-bg.jpeg",
    "/necklace/golden-floral-necklace-velvet-bg.jpeg",
  ],
  "golden petal necklace": [
    "/necklace/golden-petal-necklace-marble-bg.jpeg",
    "/necklace/golden-petal-necklace-velvet-bg.jpeg",
  ],
  "golden premium necklace": [
    "/necklace/golden-premium-necklace-marble-bg.jpeg",
    "/necklace/golden-premium-necklace-velvet-bg.jpeg",
  ],
  "heart necklace": [
    "/necklace/heart-necklace-marble-bg.jpeg",
    "/necklace/heart-necklace-velvet-bg.jpeg",
  ],
  "nail necklace": [
    "/necklace/nail-necklace-marble-bg.jpeg",
    "/necklace/nail-necklace-velvet-bg.jpeg",
  ],
  "pink stone necklace": [
    "/necklace/pink-stone-necklace-marble-bg.jpeg",
    "/necklace/pink-stone-necklace-velvet-bg.jpeg",
  ],
  "twinkle necklace": [
    "/necklace/twinkle-necklace-marble-bg.jpeg",
    "/necklace/twinkle-necklace-velvet-bg.jpeg",
  ],
  "vintage rose necklace": [
    "/necklace/vintage-rose-necklace-marble-bg.jpeg",
    "/necklace/vintage-rose-necklace-velvet-bg.jpeg",
  ],
  "watch necklace": [
    "/necklace/watch-necklace-marble-bg.jpeg",
    "/necklace/watch-necklace-velvet-bg.jpeg",
  ],
  "white stone necklace": [
    "/necklace/white-stone-necklace-marble-bg.jpeg",
    "/necklace/white-stone-necklace-velvet-bg.jpeg",
  ],
};

const necklaceGalleryForStem = (
  stem: string
): { readonly additionalImages: readonly string[] } | Record<string, never> => {
  const images = NECKLACE_ADDITIONAL_IMAGES_BY_STEM[stem.toLowerCase()];
  return images === undefined ? {} : { additionalImages: images };
};

const NECKLACE_PRICE_BY_STEM: Record<
  string,
  { readonly compareAtPrice: string; readonly salePrice: string }
> = {
  "anne tiffany necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "black stone necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "black swan necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "blach v necklace": {
    compareAtPrice: "Rs. 850.00 PKR",
    salePrice: "Rs. 649.00 PKR",
  },
  "bow necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "emerald stone necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "gold leaf charm necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "golden beaded necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "golden floral necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "golden petal necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "golden premium necklace": {
    compareAtPrice: "Rs. 1050.00 PKR",
    salePrice: "Rs. 849.00 PKR",
  },
  "heart necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "nail necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "pink stone necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "twinkle necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "vintage rose necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "watch necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
  "white stone necklace": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 749.00 PKR",
  },
};

/** Marble + velvet variants — cart uses `additionalImages[0]` (same pattern as anklets). Keys: decoded filename stem, lowercased. */
const BRACELET_ADDITIONAL_IMAGES_BY_STEM: Record<string, readonly string[]> = {
  "bracelet-8": [
    "/bracelets/bracelet-8-marble-bg.jpeg",
    "/bracelets/bracelet-8-velvet-bg.jpeg",
  ],
  "floral bracelet": [
    "/bracelets/floral-bracelet-marble-bg.jpeg",
    "/bracelets/floral-bracelet-velvet-bg.jpeg",
  ],
  "heart bracelet": [
    "/bracelets/heart-bracelet-marble-bg.jpeg",
    "/bracelets/heart-bracelet-velvet-bg.jpeg",
  ],
  "heart bracelet (2)": [
    "/bracelets/heart-bracelet-2-marble-bg.jpeg",
    "/bracelets/heart-bracelet-2-velvet-bg.jpeg",
  ],
  "love bracelet": [
    "/bracelets/love-bracelet-marble-bg.jpeg",
    "/bracelets/love-bracelet-velvet-bg.jpeg",
  ],
  "love charm bracelet (2)": [
    "/bracelets/love-charm-bracelet-2-marble-bg.jpeg",
    "/bracelets/love-charm-bracelet-2-velvet-bg.jpeg",
  ],
  "luna love bracelet": [
    "/bracelets/luna-love-bracelet-marble-bg.jpeg",
    "/bracelets/luna-love-bracelet-velvet-bg.jpeg",
  ],
  "merh watch bracelaet": [
    "/bracelets/merh-watch-bracelet-marble-bg.jpeg",
    "/bracelets/merh-watch-bracelet-velvet-bg.jpeg",
  ],
};

const braceletGalleryForStem = (
  stem: string
): { readonly additionalImages: readonly string[] } | Record<string, never> => {
  const images = BRACELET_ADDITIONAL_IMAGES_BY_STEM[stem.toLowerCase()];
  return images === undefined ? {} : { additionalImages: images };
};

const BRACELET_PRICE_BY_STEM: Record<
  string,
  { readonly compareAtPrice: string; readonly salePrice: string }
> = {
  "bracelet-8": {
    compareAtPrice: "Rs. 900.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "floral bracelet": {
    compareAtPrice: "Rs. 900.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "heart bracelet": {
    compareAtPrice: "Rs. 750.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "heart bracelet (2)": {
    compareAtPrice: "Rs. 750.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "love bracelet": {
    compareAtPrice: "Rs. 900.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "love charm bracelet (1)": {
    compareAtPrice: "Rs. 750.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "love charm bracelet (2)": {
    compareAtPrice: "Rs. 750.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "luna love bracelet": {
    compareAtPrice: "Rs. 899.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "merh watch bracelaet": {
    compareAtPrice: "Rs. 900.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
};

const HANDCHAIN_ADDITIONAL_IMAGES_BY_STEM: Record<string, readonly string[]> = {
  "gold ball handchain": [
    "/handchain/gold-ball-handchain-marble-bg.jpeg",
    "/handchain/gold-ball-handchain-velvet-bg.jpeg",
  ],
  "pearls handchain": [
    "/handchain/pearls-handchain-marble-bg.jpeg",
    "/handchain/pearls-handchain-velvet-bg.jpeg",
  ],
};

const handchainGalleryForStem = (
  stem: string
): { readonly additionalImages: readonly string[] } | Record<string, never> => {
  const images = HANDCHAIN_ADDITIONAL_IMAGES_BY_STEM[stem.toLowerCase()];
  return images === undefined ? {} : { additionalImages: images };
};

const HANDCHAIN_PRICE_BY_STEM: Record<
  string,
  { readonly compareAtPrice: string; readonly salePrice: string }
> = {
  "gold ball handchain": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
  "pearls handchain": {
    compareAtPrice: "Rs. 950.00 PKR",
    salePrice: "Rs. 599.00 PKR",
  },
};

const RINGS_ADDITIONAL_IMAGES_BY_STEM: Record<string, readonly string[]> = {
  "adjustable black clover ring": [
    "/rings/adjustable-black-clover-ring-marble-bg.jpeg",
    "/rings/adjustable-black-clover-ring-velvet-bg.jpeg",
  ],
  "adjustable floral ring": [
    "/rings/adjustable-floral-ring-marble-bg.jpeg",
    "/rings/adjustable-floral-ring-velvet-bg.jpeg",
  ],
  "adjustable leaf ring (2)": [
    "/rings/adjustable-leaf-ring-2-marble-bg.jpeg",
    "/rings/adjustable-leaf-ring-2-velvet-bg.jpeg",
  ],
  "adjustable spril leaf ring": [
    "/rings/adjustable-spril-leaf-ring-marble-bg.jpeg",
    "/rings/adjustable-spril-leaf-ring-velvet-bg.jpeg",
  ],
  "adjustable uneven ring": [
    "/rings/adjustable-uneven-ring-marble-bg.jpeg",
    "/rings/adjustable-uneven-ring-velvet-bg.jpeg",
  ],
  "bhawra ring (2)": [
    "/rings/bhawra-ring-2-marble-bg.jpeg",
    "/rings/bhawra-ring-2-velvet-bg.jpeg",
  ],
  "butter fly ring": [
    "/rings/butter-fly-ring-marble-bg.jpeg",
    "/rings/butter-fly-ring-velvet-bg.jpeg",
  ],
  "butterfly spiral ring": [
    "/rings/butterfly-spiral-ring-marble-bg.jpeg",
    "/rings/butterfly-spiral-ring-velvet-bg.jpeg",
  ],
  "cartier stone ring": [
    "/rings/cartier-stone-ring-marble-bg.jpeg",
    "/rings/cartier-stone-ring-velvet-bg.jpeg",
  ],
  "chanel ring": [
    "/rings/chanel-ring-marble-bg.jpeg",
    "/rings/chanel-ring-velvet-bg.jpeg",
  ],
  "classic ring": [
    "/rings/classic-ring-marble-bg.jpeg",
    "/rings/classic-ring-velvet-bg.jpeg",
  ],
  "double butterfly ring": [
    "/rings/double-butterfly-ring-marble-bg.jpeg",
    "/rings/double-butterfly-ring-velvet-bg.jpeg",
  ],
  "floral ring": [
    "/rings/floral-ring-marble-bg.jpeg",
    "/rings/floral-ring-velvet-bg.jpeg",
  ],
  "gucci ring": [
    "/rings/gucci-ring-marble-bg.jpeg",
    "/rings/gucci-ring-velvet-bg.jpeg",
  ],
  "hreat rig": [
    "/rings/hreat-rig-marble-bg.jpeg",
    "/rings/hreat-rig-velvet-bg.jpeg",
  ],
  "louis vuitton ring": [
    "/rings/louis-vuitton-ring-marble-bg.jpeg",
    "/rings/louis-vuitton-ring-velvet-bg.jpeg",
  ],
  "nail ring": [
    "/rings/nail-ring-marble-bg.jpeg",
    "/rings/nail-ring-velvet-bg.jpeg",
  ],
  "roman numeral ring": [
    "/rings/roman-numeral-ring-marble-bg.jpeg",
    "/rings/roman-numeral-ring-velvet-bg.jpeg",
  ],
  "silver stone butterfly ring": [
    "/rings/silver-stone-butterfly-ring-marble-bg.jpeg",
    "/rings/silver-stone-butterfly-ring-velvet-bg.jpeg",
  ],
  "spril leaf ring": [
    "/rings/spril-leaf-ring-marble-bg.jpeg",
    "/rings/spril-leaf-ring-velvet-bg.jpeg",
  ],
  "stone abd butterfly ring": [
    "/rings/stone-abd-butterfly-ring-marble-bg.jpeg",
    "/rings/stone-abd-butterfly-ring-velvet-bg.jpeg",
  ],
  "uneven ring": [
    "/rings/uneven-ring-marble-bg.jpeg",
    "/rings/uneven-ring-velvet-bg.jpeg",
  ],
  "watch ring": [
    "/rings/watch-ring-marble-bg.jpeg",
    "/rings/watch-ring-velvet-bg.jpeg",
  ],
};

const ringGalleryForStem = (
  stem: string
): { readonly additionalImages: readonly string[] } | Record<string, never> => {
  const images = RINGS_ADDITIONAL_IMAGES_BY_STEM[stem.toLowerCase()];
  return images === undefined ? {} : { additionalImages: images };
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

const normalizeIndexedVariantSuffix = (value: string): string =>
  value.replace(/\s*(?:\((?:2|5)\)|(?:2|5))\s*$/, "").trim();

const BRACELET_TITLE_BY_STEM: Record<string, string> = {
  "bracelet-8": "Love Link Bracelet",
};

const toCategoryLabel = (category: ProductCategorySlug): string =>
  `${category[0]?.toUpperCase() ?? ""}${category.slice(1).toLowerCase()}`;

const toFallbackProduct = (category: ProductCategorySlug, imageSrc: string): ShopProduct => {
  const stem = toDecodedStem(imageSrc);
  const base = stem.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const safeBase = base.replace(/^-+|-+$/g, "") || "item";
  const titleStem = normalizeIndexedVariantSuffix(toTitleCase(stem)) || "Product";

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

  if (category === "rings") {
    const title = titleStem || "Product";
    const slug = `${category}-${safeBase}`;

    return {
      category,
      description: `${title} from NS Jewels with premium finishing and elegant daily-wear styling.`,
      id: slug,
      imageSrc,
      ...ringGalleryForStem(stem),
      price: DEFAULT_CATEGORY_PRICE[category],
      slug,
      title,
    };
  }

  if (category === "bracelets" || category === "handchain") {
    const braceletPrice = BRACELET_PRICE_BY_STEM[stem.toLowerCase()];
    const handchainPrice = HANDCHAIN_PRICE_BY_STEM[stem.toLowerCase()];
    const categoryPrice = category === "bracelets" ? braceletPrice : handchainPrice;
    const title =
      category === "bracelets"
        ? (BRACELET_TITLE_BY_STEM[stem.toLowerCase()] ?? titleStem) || "Product"
        : titleStem || "Product";
    const slug = `${category}-${safeBase}`;

    return {
      category,
      description: `${title} from NS Jewels with premium finishing and elegant daily-wear styling.`,
      id: slug,
      imageSrc,
      ...(category === "bracelets" ? braceletGalleryForStem(stem) : {}),
      ...(category === "handchain" ? handchainGalleryForStem(stem) : {}),
      ...(categoryPrice === undefined ? {} : { compareAtPrice: categoryPrice.compareAtPrice }),
      price: categoryPrice?.salePrice ?? DEFAULT_CATEGORY_PRICE[category],
      slug,
      title,
    };
  }

  if (category === "necklace") {
    const title = titleStem || "Product";
    const slug = `${category}-${safeBase}`;
    const necklacePrice = NECKLACE_PRICE_BY_STEM[stem.toLowerCase()];

    return {
      category,
      description: `${title} from NS Jewels with premium finishing and elegant daily-wear styling.`,
      id: slug,
      imageSrc,
      ...necklaceGalleryForStem(stem),
      ...(necklacePrice === undefined ? {} : { compareAtPrice: necklacePrice.compareAtPrice }),
      price: necklacePrice?.salePrice ?? DEFAULT_CATEGORY_PRICE[category],
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
