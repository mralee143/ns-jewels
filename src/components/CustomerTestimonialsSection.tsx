import Image from "next/image";

import { StarRating } from "@/components/StarRating";

const TESTIMONIALS: ReadonlyArray<{ avatarSrc: string; name: string; quote: string }> = [
  {
    avatarSrc: "/earrings/earrings-1.jpeg",
    name: "Aisha K.",
    quote:
      "The finish still looks brand new after weeks of daily wear. Elegant packaging and quick delivery — exactly what I hoped for.",
  },
  {
    avatarSrc: "/rings/ring-12.jpeg",
    name: "Mira L.",
    quote:
      "Finally jewelry that doesn’t irritate my skin. The violet-toned pieces photograph beautifully for my small business shoots.",
  },
  {
    avatarSrc: "/bracelets/bracelet-5.jpeg",
    name: "Noor F.",
    quote:
      "Customer care walked me through sizing and shipping was seamless. I’ve already gifted two pieces from NS Jewels.",
  },
] as const;

export function CustomerTestimonialsSection() {
  return (
    <section className="bg-[#F7F5FF] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-10">
        <h2 className="text-center font-display text-3xl font-semibold tracking-[0.06em] text-black sm:text-4xl">
          What our customers say
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-black">
          Real styling moments from shoppers who love tarnish-resistant, waterproof-friendly pieces.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((item) => (
            <article
              className="flex flex-col rounded-xl bg-white p-6 shadow-sm ring-1 ring-[#DDD6FE]/80"
              key={item.name}
            >
              <StarRating className="justify-start" />
              <p className="mt-4 text-sm leading-relaxed text-black">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-[#C4B5FD]/60">
                  <Image
                    alt={`Portrait for ${item.name}`}
                    className="object-cover"
                    fill
                    sizes="44px"
                    src={item.avatarSrc}
                  />
                </div>
                <p className="text-sm font-semibold text-black">{item.name}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
