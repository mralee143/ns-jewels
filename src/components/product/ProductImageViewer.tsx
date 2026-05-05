"use client";

import { useEffect, useState } from "react";

import { FillImage } from "@/components/FillImage";
import type { ShopProduct } from "@/data/shop-products";
import { productDetailHeroImageFitClass, productDetailImageTileBg, productGalleryThumbFitClass } from "@/lib/product-image-display";

type ImagePreview = {
  readonly alt: string;
  readonly src: string;
};

type ProductImageViewerProps = {
  readonly product: ShopProduct;
};

const closeOnEscape = (
  event: KeyboardEvent,
  onClose: () => void,
): void => {
  if (event.key === "Escape") {
    onClose();
  }
};

export function ProductImageViewer({ product }: ProductImageViewerProps) {
  const images = product.additionalImages ?? [];
  const [previewImage, setPreviewImage] = useState<ImagePreview | null>(null);

  useEffect(() => {
    if (!previewImage) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => closeOnEscape(event, () => setPreviewImage(null));
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [previewImage]);

  return (
    <>
      <div
        className={`relative aspect-square w-full max-w-[min(100%,560px)] overflow-hidden rounded-md lg:max-w-none ${productDetailImageTileBg(product.category)}`}
      >
        <button
          aria-label={`Open full image for ${product.title}`}
          className="h-full w-full"
          onClick={() => setPreviewImage({ alt: product.title, src: product.imageSrc })}
          type="button"
        >
          <FillImage
            alt={product.title}
            className={productDetailHeroImageFitClass(product.category)}
            priority
            sizes="(min-width: 1024px) 44vw, 100vw"
            src={product.imageSrc}
          />
        </button>
      </div>

      {images.length > 0 ? (
        <div
          aria-label="Additional product photos"
          className="grid w-full grid-cols-2 gap-3 sm:gap-4"
        >
          {images.map((src, index) => (
            <div
              className={`relative aspect-square overflow-hidden rounded-md ${productDetailImageTileBg(product.category)}`}
              key={`${src}-${index.toString()}`}
            >
              <button
                aria-label={`Open photo ${index + 2} for ${product.title}`}
                className="h-full w-full"
                onClick={() =>
                  setPreviewImage({
                    alt: `${product.title} — photo ${index + 2}`,
                    src,
                  })
                }
                type="button"
              >
                <FillImage
                  alt={`${product.title} — photo ${index + 2}`}
                  className={productGalleryThumbFitClass(product.category)}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 35vw, 50vw"
                  src={src}
                />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {previewImage ? (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setPreviewImage(null);
            }
          }}
          role="dialog"
        >
          <div className="w-full max-w-5xl rounded-2xl bg-white p-3 sm:p-4">
            <div className="mb-2 flex justify-end">
              <button
                className="rounded-full border border-[#F0D3DA] px-3 py-1 text-sm font-semibold text-black transition-colors duration-200 hover:bg-[#F6C1CC]/35"
                onClick={() => setPreviewImage(null)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="relative h-[75vh] w-full overflow-hidden rounded-xl bg-neutral-100">
              <FillImage
                alt={previewImage.alt}
                className="object-contain object-center"
                sizes="(max-width: 1280px) 100vw, 1200px"
                src={previewImage.src}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
