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
        <h3 className="font-display text-3xl font-semibold tracking-[0.12em] text-black sm:text-4xl">
          WHAT THEY SAY ABOUT US
        </h3>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              className="rounded-2xl border border-pink-200 bg-white px-5 py-7 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg"
              key={item.name}
            >
              <p className="font-display text-5xl font-semibold leading-none text-black">&ldquo;</p>
              <p className="mt-4 text-lg leading-relaxed text-black">{item.quote}</p>
              <p className="mt-4 font-mono text-base text-black">- {item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
