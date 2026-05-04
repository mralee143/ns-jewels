import {
  CATALOGED_CATEGORY_IMAGES,
  type ProductCategorySlug,
} from "@/data/product-categories";
import { readPublicCategoryImagePaths } from "@/lib/read-public-category-image-paths";

export const getProductCategoryImages = (category: ProductCategorySlug): readonly string[] =>
  category === "handchain" || category === "rings"
    ? readPublicCategoryImagePaths(category)
    : CATALOGED_CATEGORY_IMAGES[category];
