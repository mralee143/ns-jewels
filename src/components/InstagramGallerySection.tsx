import Image from "next/image";
import Link from "next/link";

const INSTAGRAM_TILES: ReadonlyArray<{ alt: string; href: string; src: string }> = [
  { alt: "NS Jewels bracelet styling", href: "/products/bracelets", src: "/bracelets/bracelet-6.jpeg" },
  { alt: "NS Jewels necklace layering", href: "/products/necklace", src: "/necklace/necklace-9.jpeg" },
  { alt: "NS Jewels ring stack", href: "/products/rings", src: "/rings/ring-14.jpeg" },
  { alt: "NS Jewels earrings", href: "/products/earrings", src: "/earrings/earrings-3.jpeg" },
  { alt: "NS Jewels handchain", href: "/products/handchain", src: "/handchain/handchain-2.jpeg" },
  { alt: "NS Jewels anklet", href: "/products/anklets", src: "/anklets/anklet-creative-display.png" },
] as const;

export function InstagramGallerySection() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-[0.06em] text-black sm:text-4xl">
              As seen on Instagram
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-black">
              Tap a tile to shop the category — fresh stacks, rings, and everyday shine.
            </p>
          </div>
          <Link
            className="text-xs font-semibold uppercase tracking-[0.14em] text-black transition-colors duration-200 hover:text-neutral-800"
            href="https://www.instagram.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            Follow @nsjewels
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
          {INSTAGRAM_TILES.map((tile) => (
            <Link
              className="group relative block aspect-square overflow-hidden rounded-lg bg-[#F7F5FF] ring-1 ring-[#EFE9FF] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-[#C4B5FD]"
              href={tile.href}
              key={tile.src}
            >
              <Image
                alt={tile.alt}
                className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                src={tile.src}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
