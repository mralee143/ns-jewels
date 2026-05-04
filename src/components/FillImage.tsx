import Image, { type ImageProps } from "next/image";

export type FillImageProps = Omit<ImageProps, "fill" | "sizes"> & {
  sizes: string;
};

export function FillImage(props: FillImageProps) {
  const { alt, sizes, ...rest } = props;
  const resolvedSizes = sizes.trim().length > 0 ? sizes : "100vw";
  return <Image {...rest} alt={alt ?? ""} fill sizes={resolvedSizes} />;
}
