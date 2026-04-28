import {
  PRODUCT_CATEGORY_SLUGS,
  isProductCategorySlug,
  type ProductCategorySlug,
} from "@/data/product-categories";
import { levenshteinDistance } from "@/lib/levenshtein-distance";

const normalizeQuery = (query: string): string => query.trim().toLowerCase().replace(/\s+/g, " ");

const ALIAS_TO_SLUG: Record<string, ProductCategorySlug> = {
  anklet: "anklets",
  anklets: "anklets",
  ankle: "anklets",
  bracelet: "bracelets",
  bracelets: "bracelets",
  bracelate: "bracelets",
  earring: "earrings",
  earrings: "earrings",
  "hand chain": "handchain",
  handchain: "handchain",
  handcuff: "handcuffs",
  handcuffs: "handcuffs",
  necklace: "necklace",
  necklaces: "necklace",
  ring: "rings",
  rings: "rings",
  set: "sets",
  sets: "sets",
};

const EXTRA_TERMS: ReadonlyArray<{ slug: ProductCategorySlug; term: string }> = [
  { slug: "bracelets", term: "bracelet" },
  { slug: "bracelets", term: "bracelate" },
  { slug: "earrings", term: "earring" },
  { slug: "handcuffs", term: "handcuff" },
  { slug: "necklace", term: "necklace" },
  { slug: "necklace", term: "necklaces" },
  { slug: "rings", term: "ring" },
  { slug: "rings", term: "rings" },
  { slug: "sets", term: "set" },
  { slug: "anklets", term: "anklet" },
  { slug: "handchain", term: "hand chain" },
];

const CANONICAL_TERMS: ReadonlyArray<{ slug: ProductCategorySlug; term: string }> = [
  ...PRODUCT_CATEGORY_SLUGS.map((slug) => ({ slug, term: slug })),
  ...EXTRA_TERMS,
];

const SKIP_FUZZY = new Set([
  "and",
  "are",
  "but",
  "for",
  "from",
  "get",
  "her",
  "him",
  "his",
  "how",
  "its",
  "not",
  "our",
  "out",
  "the",
  "was",
  "who",
  "you",
]);

const maxEditDistance = (length: number): number => {
  if (length < 3) {
    return 0;
  }
  if (length <= 5) {
    return 1;
  }
  return 2;
};

const slugPriority = (slug: ProductCategorySlug): number =>
  PRODUCT_CATEGORY_SLUGS.indexOf(slug);

const fuzzyMatchSlug = (candidate: string): ProductCategorySlug | null => {
  if (candidate.length < 3 || SKIP_FUZZY.has(candidate)) {
    return null;
  }

  const maxDist = maxEditDistance(candidate.length);
  let best: { dist: number; slug: ProductCategorySlug } | null = null;

  for (const { term, slug } of CANONICAL_TERMS) {
    if (Math.abs(candidate.length - term.length) > maxDist) {
      continue;
    }
    const dist = levenshteinDistance(candidate, term);
    if (dist > maxDist) {
      continue;
    }
    if (
      !best ||
      dist < best.dist ||
      (dist === best.dist && slugPriority(slug) < slugPriority(best.slug))
    ) {
      best = { dist, slug };
    }
  }

  return best?.slug ?? null;
};

export const resolveSearchToCategorySlug = (query: string): ProductCategorySlug | null => {
  const full = normalizeQuery(query);
  if (full.length === 0) {
    return null;
  }

  if (isProductCategorySlug(full)) {
    return full;
  }

  const fromFull = ALIAS_TO_SLUG[full];
  if (fromFull) {
    return fromFull;
  }

  const words = full.split(" ");

  for (const word of words) {
    if (isProductCategorySlug(word)) {
      return word;
    }
    const fromWord = ALIAS_TO_SLUG[word];
    if (fromWord) {
      return fromWord;
    }
  }

  if (!full.includes(" ")) {
    const single = fuzzyMatchSlug(full);
    if (single) {
      return single;
    }
  }

  for (const word of words) {
    if (word.length < 3 || SKIP_FUZZY.has(word)) {
      continue;
    }
    const fromFuzzy = fuzzyMatchSlug(word);
    if (fromFuzzy) {
      return fromFuzzy;
    }
  }

  return null;
};
