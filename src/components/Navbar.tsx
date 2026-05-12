"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { useAuthModal } from "@/components/auth/auth-modal-provider";
import { useCart } from "@/components/CartProvider";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORY_SLUGS,
  productCategoryHref,
} from "@/data/product-categories";
import { resolveSearchToCategorySlug } from "@/lib/resolve-search-to-category-slug";

const NAV_ITEMS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  ...PRODUCT_CATEGORY_SLUGS.map((slug) => ({
    href: productCategoryHref(slug),
    label: PRODUCT_CATEGORY_LABELS[slug],
  })),
];

const ANNOUNCEMENT_LINES = [
  "Welcome to NS Jewels — fine jewelry for the moments you want to remember",
  "Hand-finished details · edited collections you will not find on the high street",
  "Complimentary delivery on qualifying orders · secure checkout, always",
  "New pieces land often — follow the sparkle and treat yourself, guilt-free",
] as const;

const ANNOUNCEMENT_ARIA_LABEL = ANNOUNCEMENT_LINES.join(". ");

function AnnouncementTruckIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 shrink-0 text-[#E96A7A]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12 0a48.667 48.667 0 00-12 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AnnouncementStarIcon() {
  return (
    <svg aria-hidden className="logo-gold-accent h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="currentColor"
      />
    </svg>
  );
}

function AnnouncementLineSegment({ text }: { text: string }) {
  return (
    <span className="flex shrink-0 items-center gap-2 px-5 sm:gap-2.5 sm:px-8">
      <AnnouncementTruckIcon />
      <span className="whitespace-nowrap text-[#E96A7A]">{text}</span>
      <AnnouncementStarIcon />
    </span>
  );
}

function IconUserCircle(props: { readonly className?: string }) {
  return (
    <svg aria-hidden className={props.className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar() {
  const { openLogin } = useAuthModal();
  const { cartCount } = useCart();
  const { data: session, status: sessionStatus } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const trimmedSearchValue = useMemo(() => searchValue.trim(), [searchValue]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedSearchValue) {
      return;
    }

    const categorySlug = resolveSearchToCategorySlug(trimmedSearchValue);
    if (categorySlug) {
      router.push(productCategoryHref(categorySlug));
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmedSearchValue)}`);
    }
    setIsSearchOpen(false);
    setSearchValue("");
  };

  const handleNavClick = (href: string) => () => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);

    if (href === "/" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="page-entrance-nav sticky top-0 z-30">
      <div
        aria-label={ANNOUNCEMENT_ARIA_LABEL}
        className="border-b border-[#F0D3DA] bg-[#F6C1CC] text-sm font-semibold tracking-wide sm:text-[0.9375rem]"
        role="region"
      >
        <div className="hidden items-center justify-center gap-2 px-4 py-2 text-center motion-reduce:flex">
          <AnnouncementTruckIcon />
          <span className="text-balance text-[#E96A7A]">{ANNOUNCEMENT_ARIA_LABEL}</span>
          <AnnouncementStarIcon />
        </div>
        <div aria-hidden className="announcement-marquee-root motion-reduce:hidden">
          <div className="announcement-marquee-track flex w-max py-2">
            <div className="flex shrink-0 flex-nowrap items-center">
              {ANNOUNCEMENT_LINES.map((line, index) => (
                <AnnouncementLineSegment key={`a-${index}`} text={line} />
              ))}
            </div>
            <div className="flex shrink-0 flex-nowrap items-center">
              {ANNOUNCEMENT_LINES.map((line, index) => (
                <AnnouncementLineSegment key={`b-${index}`} text={line} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="relative flex w-full items-center justify-between gap-3 border-b border-[#F0D3DA] bg-white px-4 py-3 sm:gap-4 sm:px-6 lg:gap-3 lg:px-8 lg:py-4 xl:gap-6">
        <button
          aria-controls="mobile-nav-menu"
          aria-expanded={isMobileMenuOpen}
          aria-label="Open menu"
          className="flex items-center rounded-md text-black outline-none transition-colors duration-200 [-webkit-tap-highlight-color:transparent] hover:text-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:hidden"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          type="button"
        >
          {isMobileMenuOpen ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12 19 17.6 17.6 19 12 13.4 6.4 19 5 17.6 10.6 12 5 6.4 6.4 5Z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16v2H4V7Zm0 4h16v2H4v-2Zm0 4h16v2H4v-2Z" />
            </svg>
          )}
          <span className="hidden text-xs font-bold uppercase tracking-[0.14em] sm:inline">
            {isMobileMenuOpen ? "Close" : "Menu"}
          </span>
        </button>

        <Link
          className="absolute left-1/2 z-10 shrink-0 -translate-x-1/2 transition-opacity duration-200 lg:static lg:z-auto lg:translate-x-0"
          href="/"
          onClick={handleNavClick("/")}
        >
          <Image
            alt="NS Jewels logo"
            className="h-auto w-[140px] transition-transform duration-300 hover:scale-[1.06] sm:w-[160px] lg:w-[170px] xl:w-[200px]"
            height={307}
            loading="eager"
            priority
            src="/brand_logo.png"
            width={1024}
          />
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden min-w-0 -translate-x-1/2 lg:static lg:flex lg:translate-x-0 lg:flex-1 lg:justify-center"
        >
          <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[0.65rem] font-black uppercase tracking-[0.14em] text-black sm:gap-x-6 lg:flex-nowrap lg:gap-x-2 lg:text-[0.6rem] xl:gap-x-6 xl:text-[0.75rem]">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  className="whitespace-nowrap border-b-2 border-transparent pb-0.5 text-black outline-none transition-colors duration-200 hover:border-cta hover:text-cta focus-visible:border-cta focus-visible:text-cta"
                  href={item.href}
                  onClick={handleNavClick(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions — search opens full-width row below (same on mobile and desktop) */}
        <div className="z-10 flex shrink-0 items-center gap-3 text-black sm:gap-5 lg:ml-0">
          {isSearchOpen ? (
            <button
              aria-label="Close search"
              className="flex items-center justify-center rounded-md p-1.5 text-xl leading-none text-black transition-colors duration-200 hover:bg-black/5 hover:text-neutral-800"
              onClick={() => {
                setIsSearchOpen(false);
                setSearchValue("");
              }}
              type="button"
            >
              ×
            </button>
          ) : (
            <button
              aria-label="Open search"
              className="flex items-center gap-2 font-black text-black transition-colors duration-200 hover:text-neutral-800"
              onClick={() => setIsSearchOpen(true)}
              type="button"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 2a5.5 5.5 0 1 0 3.7 9.6l3.6 3.6 1.4-1.4-3.6-3.6A5.5 5.5 0 0 0 10.5 5Z" />
              </svg>
              <span className="hidden text-xs font-black uppercase tracking-[0.14em] xl:inline">Search</span>
            </button>
          )}
          {!isSearchOpen ? (
            <>
              {sessionStatus === "loading" ? (
                <span
                  aria-busy
                  aria-label="Loading account"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/5"
                >
                  <span className="size-4 animate-pulse rounded-full bg-neutral-300" />
                </span>
              ) : session?.user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {session.user.role === "ADMIN" ? (
                    <Link
                      aria-label="Admin panel"
                      className="rounded-full border border-[#F0D3DA] bg-[#FDF2F5] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-[#2B2B2B] transition-colors duration-200 hover:border-cta hover:text-cta md:px-3"
                      href="/admin"
                    >
                      Admin
                    </Link>
                  ) : null}
                  <Link
                    aria-label="My account"
                    className={`flex items-center justify-center rounded-md transition-colors duration-200 hover:text-neutral-800 ${
                      pathname === "/account" ? "text-cta" : "text-black"
                    }`}
                    href="/account"
                  >
                    <IconUserCircle className="h-6 w-6 stroke-[2.5]" />
                  </Link>
                </div>
              ) : (
                <button
                  aria-label="Sign in"
                  className="text-black transition-colors duration-200 hover:text-neutral-800"
                  onClick={() => openLogin()}
                  type="button"
                >
                  <IconUserCircle className="h-6 w-6 stroke-[2.5]" />
                </button>
              )}
              <Link
                aria-label="Shopping bag"
                className="relative text-black transition-colors duration-200 hover:text-neutral-800"
                href="/cart"
              >
                <svg className="h-6 w-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {cartCount > 0 ? (
                  <span className="absolute -right-2 -top-2 rounded-full bg-[#F6C1CC] px-1.5 py-0.5 text-[0.6rem] font-black leading-none text-black ring-1 ring-black/15">
                    {cartCount}
                  </span>
                ) : null}
              </Link>
            </>
          ) : null}
        </div>
      </div>

      {isSearchOpen ? (
        <div className="border-t border-[#F0D3DA] bg-white px-4 py-3 sm:px-8 lg:px-10">
          <form className="flex w-full items-center gap-2" onSubmit={handleSearchSubmit}>
            <input
              aria-label="Search products"
              autoFocus
              className="min-h-11 min-w-0 flex-1 rounded-lg border border-pink-200 bg-white px-3 py-2.5 text-sm font-medium text-black shadow-none outline-none [-webkit-appearance:none] [appearance:none] placeholder:text-black/45 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300/40"
              enterKeyHint="search"
              inputMode="search"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search products…"
              type="text"
              value={searchValue}
            />
            <button
              className="shrink-0 rounded-lg bg-cta px-3 py-2.5 text-xs font-black uppercase tracking-wide text-white transition-colors duration-200 hover:bg-cta-hover"
              type="submit"
            >
              Go
            </button>
          </form>
        </div>
      ) : null}
      {isMobileMenuOpen ? (
        <nav aria-label="Mobile" className="border-t border-[#F0D3DA] bg-white lg:hidden" id="mobile-nav-menu">
          <ul className="flex w-full flex-col px-5 py-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  className="block border-b border-pink-200 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-black underline-offset-[6px] outline-none transition-colors duration-200 hover:text-cta hover:underline hover:decoration-2 hover:decoration-cta focus-visible:text-cta focus-visible:underline focus-visible:decoration-2 focus-visible:decoration-cta"
                  href={item.href}
                  onClick={handleNavClick(item.href)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
