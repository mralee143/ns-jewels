"use client";

import Image, { type ImageProps } from "next/image";
import { type SyntheticEvent, useCallback, useState } from "react";

export type FillImageProps = Omit<ImageProps, "fill" | "sizes" | "onLoadingComplete"> & {
  sizes: string;
  /**
   * When true (default), the image stays hidden until load then plays a short reveal.
   * Set false when another layer controls opacity (e.g. hero cross-fade).
   */
  revealOnLoad?: boolean;
};

export function FillImage({
  alt,
  className,
  onError,
  onLoad,
  revealOnLoad = true,
  sizes,
  ...rest
}: FillImageProps) {
  const [isReady, setIsReady] = useState(false);
  const resolvedSizes = sizes.trim().length > 0 ? sizes : "100vw";

  const handleLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      if (revealOnLoad) {
        setIsReady(true);
      }
      onLoad?.(event);
    },
    [onLoad, revealOnLoad],
  );

  const handleError = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      if (revealOnLoad) {
        setIsReady(true);
      }
      onError?.(event);
    },
    [onError, revealOnLoad],
  );

  const revealClasses =
    revealOnLoad ?
      isReady ?
        "fill-image-reveal fill-image-reveal--ready"
      : "fill-image-reveal"
    : "";

  return (
    <Image
      {...rest}
      alt={alt ?? ""}
      className={[revealClasses, className].filter(Boolean).join(" ")}
      fill
      onError={handleError}
      onLoad={handleLoad}
      sizes={resolvedSizes}
    />
  );
}
