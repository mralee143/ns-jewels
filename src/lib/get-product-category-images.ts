import {
  CATALOGED_CATEGORY_IMAGES,
  type ProductCategorySlug,
} from "@/data/product-categories";

/** Uses static paths only so Next output tracing does not bundle public JPEGs into serverless functions. */
export const getProductCategoryImages = (category: ProductCategorySlug): readonly string[] =>
  CATALOGED_CATEGORY_IMAGES[category];
