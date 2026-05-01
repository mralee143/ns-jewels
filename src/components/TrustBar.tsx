const TRUST_ITEMS: ReadonlyArray<{ path: string; subtitle: string; title: string }> = [
  {
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
    subtitle: "Built to last long",
    title: "Tarnish resistant",
  },
  {
    path: "M12 22a7 7 0 0 0 7-7c0-5-7-13-7-13S5 10 5 15a7 7 0 0 0 7 7Z",
    subtitle: "Wear it anywhere",
    title: "Waterproof",
  },
  {
    path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z",
    subtitle: "Hypoallergenic",
    title: "Skin friendly",
  },
  {
    path: "M19 11H5a2 2 0 0 0-2 2v7h18v-7a2 2 0 0 0-2-2Zm-7 9v-4h-4v4h4Zm2-11V7a5 5 0 0 0-10 0v2h10Z",
    subtitle: "100% safe checkout",
    title: "Secure payment",
  },
  {
    path: "M3 6h11v9H3V6Zm13 0h3l3 4v5h-6V6ZM7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
    subtitle: "Nationwide delivery",
    title: "Fast delivery",
  },
] as const;

export function TrustBar() {
  return (
    <div className="border-y border-[#DDD6FE] bg-[#FFFFFF]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-2 gap-x-4 gap-y-6 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:grid-cols-5 lg:gap-x-6 lg:px-10 lg:py-9">
        {TRUST_ITEMS.map((item) => (
          <div className="flex gap-3 text-left" key={item.title}>
            <svg aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d={item.path} />
            </svg>
            <div className="min-w-0">
              <p className="text-[0.68rem] font-bold uppercase leading-snug tracking-[0.08em] text-black sm:text-xs">
                {item.title}
              </p>
              <p className="mt-1 text-[0.7rem] leading-snug text-black sm:text-[0.75rem]">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
