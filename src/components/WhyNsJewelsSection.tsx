import Image from "next/image";

const PROMO_IMAGE_QUALITY = 92 as const;

const BENEFIT_IMAGES: ReadonlyArray<{ alt: string; src: string }> = [
  { alt: "Allergy Free", src: "/why-ns/allergy-free.png" },
  { alt: "Made To Last", src: "/why-ns/made-to-last.png" },
  { alt: "Gold Alternative", src: "/why-ns/gold-alternative.png" },
  { alt: "Fast and Free shipping", src: "/why-ns/fast-free.png" },
] as const;

const PROMO_BANNER_ALT =
  "Clover Black Clover Collection — model in pink velvet wearing black clover gold jewelry, with earrings on velvet and roses." as const;

const LIFESTYLE_ALT =
  "Model in a white tee wearing matte gold open-heart stud earrings and a matching heart pendant necklace." as const;

const HEX_SET_LIFESTYLE_ALT =
  "Model in a cream shirt wearing a matching gold hexagonal black-dial jewelry set — earrings, ring, necklace, and bracelet." as const;

const ABOUT_NS_JEWELS_TAGLINE =
  "Waterproof-friendly pieces you can live in — without giving up that warm-gold glow." as const;

const ABOUT_NS_JEWELS_BLURB =
  "NS Jewels is built around one idea: jewelry should feel as good as it looks. Every silhouette is tarnish-resistant and shower-safe, finished in tones that read like real gold on skin — so your everyday stack still feels quietly luxurious." as const;

/** Tall promo frame — mobile uses a shorter viewport fraction so the section does not feel endless when stacked. */
const PROMO_BANNER_BOX =
  "relative h-[min(52vh,560px)] min-h-[280px] w-full min-w-0 shrink-0 basis-auto sm:h-[min(62vh,720px)] sm:min-h-[340px] md:h-[min(78vh,960px)] md:min-h-[480px] md:min-w-0 md:shrink md:basis-0 md:flex-[1.65]" as const;

/** About column: on small screens do not mirror the banner height (avoids huge empty area + over-stretched lifestyle tiles). */
const ABOUT_COLUMN_BOX =
  "relative flex w-full min-h-0 flex-col gap-3 bg-background md:min-h-[480px] md:h-[min(78vh,960px)] md:flex-[0.85] md:gap-4" as const;

const ABOUT_IMAGE_GRID_BOX =
  "relative grid w-full min-w-0 shrink-0 grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] gap-2 max-md:aspect-[5/4] max-md:max-h-[min(52vh,380px)] max-md:min-h-[200px] sm:gap-2.5 md:min-h-[min(32vh,300px)] md:flex-1 md:gap-3" as const;

const ABOUT_PROMO_PAIR_SIZES =
  "(min-width: 1024px) 18vw, (min-width: 768px) 22vw, 48vw" as const;

const ABOUT_PROMO_IMAGES: ReadonlyArray<{ alt: string; src: string; emphasis: "primary" | "accent" }> =
  [
    { alt: LIFESTYLE_ALT, emphasis: "primary", src: "/why-ns/about-ns-jewels-lifestyle.png" },
    { alt: HEX_SET_LIFESTYLE_ALT, emphasis: "accent", src: "/why-ns/promo-hex-set-lifestyle.png" },
  ] as const;

export function WhyNsJewelsSection() {
  return (
    <div className="w-full">
      <section
        aria-label="Clover collection promotion and about NS Jewels"
        className="relative w-full bg-background"
      >
        <div className="w-full px-4 sm:px-5 md:flex md:justify-start md:pl-6 md:pr-10 lg:pl-8 lg:pr-12">
          <div className="flex w-full min-w-0 max-w-full flex-col gap-4 md:max-w-none md:flex-row md:items-stretch md:gap-4">
            <div className={PROMO_BANNER_BOX}>
              <Image
                alt={PROMO_BANNER_ALT}
                className="object-cover object-center"
                fill
                priority={false}
                quality={PROMO_IMAGE_QUALITY}
                sizes="(min-width: 1024px) 60vw, (min-width: 768px) 72vw, 100vw"
                src="/why-ns/black-clover-collection-promo-banner.png"
              />
            </div>
            <div className={ABOUT_COLUMN_BOX}>
              <div className={ABOUT_IMAGE_GRID_BOX}>
                {ABOUT_PROMO_IMAGES.map((item) => (
                  <div
                    className={[
                      "relative h-full min-h-0 min-w-0 overflow-hidden rounded-2xl ring-1 shadow-sm",
                      item.emphasis === "primary"
                        ? "ring-[color-mix(in_srgb,var(--brand-logo-gold-mid)_35%,transparent)]"
                        : "ring-pink-200/80",
                    ].join(" ")}
                    key={item.src}
                  >
                    <Image
                      alt={item.alt}
                      className="object-cover object-center"
                      fill
                      priority={false}
                      quality={PROMO_IMAGE_QUALITY}
                      sizes={ABOUT_PROMO_PAIR_SIZES}
                      src={item.src}
                    />
                  </div>
                ))}
              </div>
              <div className="relative flex w-full min-w-0 shrink-0 flex-col justify-start gap-3 overflow-hidden rounded-2xl border border-pink-200/90 bg-[linear-gradient(165deg,#ffffff_0%,#fff9fb_45%,#fdf2f5_100%)] px-4 py-5 sm:gap-3.5 sm:px-5 sm:py-6 md:gap-4 md:px-6 md:py-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--brand-logo-gold-light)_55%,transparent),transparent_70%)] opacity-90"
                />
                <div className="relative flex items-start gap-3">
                  <svg
                    aria-hidden
                    className="mt-0.5 h-11 w-11 shrink-0 sm:h-12 sm:w-12"
                    viewBox="0 0 48 48"
                  >
                    <defs>
                      <linearGradient id="about-ns-monogram-gold" x1="0%" x2="100%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--brand-logo-gold-deep)" />
                        <stop offset="45%" stopColor="var(--brand-logo-gold-mid)" />
                        <stop offset="62%" stopColor="var(--brand-logo-gold-light)" />
                        <stop offset="100%" stopColor="var(--brand-logo-gold-mid)" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="24"
                      cy="24"
                      fill="none"
                      r="22"
                      stroke="url(#about-ns-monogram-gold)"
                      strokeWidth="1.25"
                    />
                    <text
                      fill="url(#about-ns-monogram-gold)"
                      style={{
                        fontFamily: "var(--font-display), Georgia, serif",
                        fontSize: "15px",
                        fontWeight: 600,
                      }}
                      textAnchor="middle"
                      x="24"
                      y="30"
                    >
                      NS
                    </text>
                  </svg>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="font-display text-[0.65rem] font-medium uppercase tracking-[0.28em] text-[#6E6E6E] sm:text-xs">
                      Our name on it
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-semibold leading-[1.05] tracking-[0.02em] sm:text-3xl md:text-[2rem]">
                      <span className="brand-gold-gradient-text">NS</span>
                      <span className="text-black"> Jewels</span>
                    </h2>
                    <p className="mt-2 font-display text-sm font-medium italic leading-snug text-[#2B2B2B] sm:text-base">
                      {ABOUT_NS_JEWELS_TAGLINE}
                    </p>
                  </div>
                </div>
                <div
                  aria-hidden
                  className="h-px w-12 shrink-0 bg-[linear-gradient(90deg,var(--brand-logo-gold-deep),var(--brand-logo-gold-light),var(--brand-logo-gold-mid))] opacity-85"
                />
                <p className="relative max-w-prose text-left text-[0.7rem] leading-relaxed text-[#6E6E6E] sm:text-xs md:text-sm">
                  {ABOUT_NS_JEWELS_BLURB}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-7 text-center sm:py-8">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
          <h3 className="font-display text-2xl font-medium tracking-[0.08em] text-black sm:text-3xl">
            WHY NS JEWELS?
          </h3>
          <div className="mx-auto mt-5 grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-none sm:grid-cols-4 sm:gap-4 lg:gap-6">
            {BENEFIT_IMAGES.map((benefit) => (
              <article
                className="flex min-h-0 min-w-0 flex-col items-center justify-center rounded-2xl border border-pink-200/80 bg-white p-3 shadow-sm sm:p-4"
                key={benefit.src}
              >
                <Image
                  alt={benefit.alt}
                  className="h-auto w-full max-w-[140px] object-contain sm:max-w-[150px]"
                  height={150}
                  sizes="(min-width: 1024px) 160px, (min-width: 640px) 20vw, 42vw"
                  src={benefit.src}
                  width={150}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
