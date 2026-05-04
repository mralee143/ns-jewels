import Image from "next/image";

const MADE_FOR_HER_IMAGES: ReadonlyArray<{ alt: string; src: string }> = [
  { alt: "Model wearing gold heart earrings and necklace", src: "/made for her/image 1.png" },
  { alt: "Gold heart jewelry styled for everyday wear", src: "/made for her/image 2.png" },
  { alt: "Close-up of heart-shaped gold jewelry set", src: "/made for her/image 3.png" },
  { alt: "Elegant gold heart necklace and earrings look", src: "/made for her/image 4.png" },
] as const;

export function MadeForHerSection() {
  return (
    <section
      className="mx-auto flex max-w-[1320px] flex-col items-center pb-12 pt-6 text-center sm:pb-14 sm:pt-8"
      id="products"
    >
      <h2 className="made-for-her-heading-reveal font-display text-3xl font-semibold tracking-[0.12em] text-black sm:text-4xl">
        Made For Her
      </h2>
      <div className="mt-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MADE_FOR_HER_IMAGES.map((image, index) => (
          <article
            className="made-for-her-card-reveal touch-manipulation overflow-hidden rounded-2xl border border-pink-200 bg-white shadow-sm transition-[box-shadow,transform] duration-300 hover:scale-95 hover:shadow-xl active:scale-95"
            key={image.src}
            style={{ animationDelay: `${index * 90}ms` }}
          >
            <Image
              alt={image.alt}
              className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-72 lg:h-80"
              height={460}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              src={image.src}
              width={320}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
