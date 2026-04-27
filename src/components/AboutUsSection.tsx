import Image from "next/image";

const TESTIMONIALS: ReadonlyArray<{ name: string; quote: string }> = [
  {
    name: "Annie",
    quote:
      "I've always had a lot of allergic reactions while wearing earrings. With NS Jewels jewelry, I no longer have reactions, which makes me very happy!",
  },
  {
    name: "Norah",
    quote:
      "I've been wearing them for a month, during the day, while sleeping, in the shower and while exercising and they look as new as when I got them!",
  },
  {
    name: "Anouk",
    quote: "Great customer service, shipping was so fast! Really happy to have discovered your company!",
  },
] as const;

export function AboutUsSection() {
  return (
    <section className="overflow-x-clip pb-16 pt-6 text-center sm:pb-20">
      <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
        <h3 className="font-display text-3xl font-semibold italic tracking-[0.12em] text-[#1c1917] sm:text-4xl">
          WHAT THEY SAY ABOUT US
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              className="rounded-2xl border border-[#e5e7eb] bg-white px-5 py-7 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
              key={item.name}
            >
              <p className="font-display text-5xl font-semibold leading-none text-[#1c1917]">&ldquo;</p>
              <p className="mt-4 text-lg leading-relaxed text-[#1f2937]">{item.quote}</p>
              <p className="mt-4 font-mono text-base text-[#111827]">- {item.name}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="relative mt-12 h-[min(76vh,720px)] w-full overflow-hidden lg:h-screen">
        <Image
          alt="NS Jewels loyalty rewards banner"
          className="hero-image-float object-cover object-[72%_center] saturate-125 hue-rotate-[300deg] brightness-95 contrast-110 lg:object-center"
          fill
          priority
          sizes="100vw"
          src="/rewards-pink-banner-no-text.png"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#1e1b4bcc] via-[#6b21a899] to-[#faf5ff26]"
        />
        <div className="absolute inset-0 z-10">
          <div className="mx-auto flex h-full w-full max-w-[1320px] items-center px-6 sm:px-10 lg:px-12">
            <div className="w-full max-w-[620px] text-left text-white">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.28em] sm:text-sm">
                NS Jewels Loyalty Program
              </p>
              <h3 className="mt-4 font-display text-5xl font-semibold italic leading-[0.95] tracking-[0.06em] sm:text-7xl lg:text-8xl">
                Rewards
              </h3>
              <p className="mt-4 max-w-lg text-sm text-white/90 sm:text-base lg:text-lg">
                Earn points on every purchase and unlock exclusive offers, early access, and premium gifts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
