import Image from "next/image";

const BENEFIT_IMAGES: ReadonlyArray<{ alt: string; src: string }> = [
  { alt: "Allergy Free", src: "/why-ns/allergy-free.png" },
  { alt: "Made To Last", src: "/why-ns/made-to-last.png" },
  { alt: "Gold Alternative", src: "/why-ns/gold-alternative.png" },
  { alt: "Fast and Free shipping", src: "/why-ns/fast-free.png" },
] as const;

export function WhyNsJewelsSection() {
  return (
    <section className="w-full py-7 text-center sm:py-8">
      <h3 className="font-display text-2xl font-medium tracking-[0.08em] text-black sm:text-3xl">
        WHY NS JEWELS?
      </h3>
      <div className="mx-auto mt-5 flex w-full flex-wrap items-start justify-center gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 lg:gap-x-4">
        {BENEFIT_IMAGES.map((benefit) => (
          <article className="flex w-[128px] justify-center sm:w-[140px]" key={benefit.src}>
            <Image
              alt={benefit.alt}
              className="h-auto w-full object-contain"
              height={150}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              src={benefit.src}
              width={150}
            />
          </article>
        ))}
      </div>
    </section>
  );
}
