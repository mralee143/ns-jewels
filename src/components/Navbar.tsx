"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

const NAV_ITEMS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/#bracelets", label: "Bracelets" },
  { href: "/#necklace", label: "Necklace" },
  { href: "/#rings", label: "Rings" },
  { href: "/#sets", label: "Sets" },
  { href: "/#handcuffs", label: "Handcuffs" },
  { href: "/#earrings", label: "Earrings" },
  { href: "/#stacks", label: "Stacks" },
  { href: "/#anklets", label: "Anklets" },
] as const;

export function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const trimmedSearchValue = useMemo(() => searchValue.trim(), [searchValue]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!trimmedSearchValue) {
      return;
    }

    router.push(`/?q=${encodeURIComponent(trimmedSearchValue)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#ebe4d9] bg-[#fdfbf8]">
      <div className="relative flex w-full items-center gap-4 px-5 py-2 sm:px-8 lg:px-10">
        {/* Mobile Menu Button - First on Mobile */}
        <button
          aria-label="Open menu"
          aria-controls="mobile-nav-menu"
          aria-expanded={isMobileMenuOpen}
          className="flex items-center gap-2 transition-colors duration-200 hover:text-[#1c1917] lg:hidden"
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

        {/* Logo - Second on Mobile, First on Desktop */}
        <Link className="shrink-0 lg:order-first" href="/">
          <Image
            alt="NS Jewels logo"
            className="h-auto w-[110px] scale-125 transition-transform duration-300 hover:scale-135 sm:w-[130px]"
            height={300}
            priority
            src="/ns-logo-latest.png"
            width={600}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex items-center gap-4 text-[0.65rem] font-black uppercase tracking-[0.14em] text-[#000000] xl:gap-6 xl:text-[0.75rem]">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link className="transition-colors duration-200 hover:text-[#4c1d95]" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="transition-colors duration-200 hover:text-[#4c1d95]" href="/#contact">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Actions - Third on Mobile */}
        <div className="ml-auto flex items-center gap-3 text-[#292524] sm:gap-5">
          <form className="flex items-center gap-2" onSubmit={handleSearchSubmit}>
            <input
              aria-label="Search products"
              className="w-20 border border-[#d6d3d1] bg-white px-2 py-1 text-[10px] font-black tracking-[0.05em] text-[#000000] outline-none ring-0 placeholder:text-[#78716c] focus:border-[#a68b5b] sm:w-32 sm:text-xs"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search..."
              type="search"
              value={searchValue}
            />
            <button
              aria-label="Search"
              className="flex items-center gap-2 transition-colors duration-200 hover:text-[#1c1917] font-black"
              type="submit"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15Zm0 2a5.5 5.5 0 1 0 3.7 9.6l3.6 3.6 1.4-1.4-3.6-3.6A5.5 5.5 0 0 0 10.5 5Z" />
              </svg>
              <span className="hidden text-xs font-black uppercase tracking-[0.14em] sm:inline">
                Search
              </span>
            </button>
          </form>
          <button aria-label="Login" className="transition-colors duration-200 hover:text-[#4c1d95]" type="button">
            <svg className="h-6 w-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
          <button aria-label="Shopping bag" className="transition-colors duration-200 hover:text-[#4c1d95]" type="button">
            <svg className="h-6 w-6 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <nav
          aria-label="Mobile"
          className="border-t border-[#ebe4d9] bg-[#fdfbf8] lg:hidden"
          id="mobile-nav-menu"
        >
          <ul className="mx-auto flex w-full max-w-[1320px] flex-col px-5 py-3 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  className="block border-b border-[#f1ede6] py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#292524] transition-colors duration-200 hover:text-[#1c1917]"
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                className="block border-b border-[#f1ede6] py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#292524] transition-colors duration-200 hover:text-[#1c1917]"
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
