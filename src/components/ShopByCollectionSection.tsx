import Image from "next/image";
import Link from "next/link";

import { productCategoryHref } from "@/data/product-categories";

const COLLECTIONS: ReadonlyArray<{
  href: string;
  imageSrc: string;
  label: string;
}> = [
  {
    href: productCategoryHref("necklace"),
    imageSrc: "/necklace/heart%20necklace.jpeg",
    label: "Minimal",
  },
  {
    href: productCategoryHref("handcuffs"),
    imageSrc: "/handcuffs/gucci.jpeg",
    label: "Bold",
  },
  {
    href: productCategoryHref("sets"),
    imageSrc:
      "/sets/WhatsApp%20Image%202026-04-27%20at%207.02.44%20AM%20(1).jpeg",
    label: "Couple",
  },
  {
    href: productCategoryHref("necklace"),
    imageSrc: "/necklace/golden%20petal%20necklace.jpeg",
    label: "Layered",
  },
  {
    href: productCategoryHref("rings"),
    imageSrc: "/rings/chanel%20ring.jpeg",
    label: "Rings",
  },
  {
    href: productCategoryHref("earrings"),
    imageSrc: "/earrings/Duck%20earing.jpeg",
    label: "Earrings",
  },
] as const;

function CollectionArrowIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
      <path d="M7 17 17 7 M17 7 11 7 M17 7 17 13" />
    </svg>
  );
}

export function ShopByCollectionSection() {
  return (
    <section className="bg-[#FFFFFF] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-base font-bold uppercase tracking-[0.16em] text-black sm:text-lg uppercase">
            Shop by collection
          </h2>
          <Link
            className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-black transition-colors duration-200 hover:text-neutral-800 sm:text-xs"
            href="/products?page=1"
          >
            View all
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-5">
          {COLLECTIONS.map((item) => (
            <Link
              className="group flex flex-col rounded-xl bg-white p-3 pb-4 shadow-[0_2px_24px_rgba(109,40,217,0.06)] ring-1 ring-[#EFE9FF] transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(109,40,217,0.12)] hover:ring-[#DDD6FE]"
              href={item.href}
              key={item.label}
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#FAFAFA]">
                <Image
                  alt={`${item.label} collection`}
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 45vw"
                  src={item.imageSrc}
                />
              </div>
              <div className="mt-4 flex flex-1 flex-col items-center text-center">
                <span className="text-sm font-bold uppercase tracking-[0.06em] text-black">{item.label}</span>
                <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-black">
                  Collection
                </span>
                <span className="mt-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cta text-white shadow-md transition-colors duration-200 group-hover:bg-cta-hover">
                  <CollectionArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
