import { FillImage } from "@/components/FillImage";
import type { ShopProduct } from "@/data/shop-products";
import { productDetailImageTileBg, productGalleryThumbFitClass } from "@/lib/product-image-display";

type ProductAdditionalImagesGalleryProps = {
  readonly product: ShopProduct;
};

export function ProductAdditionalImagesGallery({ product }: ProductAdditionalImagesGalleryProps) {
  const images = product.additionalImages ?? [];
  if (images.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Additional product photos"
      className="grid w-full grid-cols-2 gap-3 sm:gap-4"
    >
      {images.map((src, index) => (
        <div
          className={`relative aspect-square overflow-hidden rounded-md ${productDetailImageTileBg(product.category)}`}
          key={`${src}-${index.toString()}`}
        >
          <FillImage
            alt={`${product.title} — photo ${index + 2}`}
            className={productGalleryThumbFitClass(product.category)}
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 35vw, 50vw"
            src={src}
          />
        </div>
      ))}
    </div>
  );
}
