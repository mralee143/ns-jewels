import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const QUICK_LINKS: ReadonlyArray<{ href: string; label: string }> = [
  { href: "/#products", label: "Shipping Policy" },
  { href: "/#products", label: "Return and Exchange Policy" },
  { href: "/#contact", label: "Contact" },
] as const;

const SOCIAL_LINKS: ReadonlyArray<{ href: string; icon: ReactNode; label: string }> = [
  {
    href: "https://www.facebook.com",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7.9V12h2.6V9.8c0-2.6 1.6-4 3.9-4 1.1 0 2.2.2 2.2.2v2.5h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
      </svg>
    ),
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4A5.8 5.8 0 0 1 16.2 22H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.6Zm4.4 2.5a5.1 5.1 0 1 1 0 10.2 5.1 5.1 0 0 1 0-10.2Zm0 2a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Zm5-1.3a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
      </svg>
    ),
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com",
    icon: (
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.18V2h-3.45v13.67a2.89 2.89 0 1 1-5.2-1.71 2.89 2.89 0 0 1 2.31-1.39V9.4a6.84 6.84 0 0 0-1-.05 6.33 6.33 0 1 0 6.33 6.33V11.2a8.19 8.19 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-2-.43Z" />
      </svg>
    ),
    label: "TikTok",
  },
] as const;

export function FooterSection() {
  return (
    <footer className="mt-8 bg-[#efe1ff] text-[#581c87]">
      <div className="grid w-full grid-cols-1 gap-8 px-5 py-12 sm:px-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-4 lg:gap-x-8 lg:px-12">
        <div className="text-left">
          <Link className="inline-block" href="/">
            <Image
              alt="NS Jewels logo"
              className="h-auto w-[200px] mix-blend-multiply sm:w-[220px]"
              height={300}
              src="/brand__logo.jpeg"
              width={600}
            />
          </Link>
          <div className="mt-5 flex items-center gap-4 text-[#581c87]">
            {SOCIAL_LINKS.map((item) => (
              <Link
                aria-label={item.label}
                className="transition-colors duration-200 hover:text-[#7e22ce]"
                href={item.href}
                key={item.label}
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="text-left">
          <h2 className="font-display text-lg font-semibold text-[#581c87]">Quick links</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link className="text-sm text-[#581c87] transition-colors duration-200 hover:text-[#7e22ce]" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-left" id="contact">
          <h2 className="font-display text-lg font-semibold text-[#581c87]">Contact Information</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-[#581c87]">
            <li>
              <a className="transition-colors duration-200 hover:text-[#7e22ce]" href="tel:+923000000000">
                +92 300 0000000
              </a>
            </li>
            <li>
              <a className="transition-colors duration-200 hover:text-[#7e22ce]" href="mailto:hello@nsjewels.com">
                hello@nsjewels.com
              </a>
            </li>
          </ul>
        </div>
        <div className="text-left">
          <h2 className="font-display text-lg font-semibold text-[#581c87]">Our Story</h2>
          <p className="mt-4 text-sm leading-relaxed text-[#581c87]">
            We started NS Jewels with the hope of creating timeless, luxury-focused pieces built on quality and contemporary design at approachable prices.
          </p>
        </div>
      </div>
      <div className="border-t border-[#d8b4fe] py-6 text-center">
        <p className="text-xs text-[#581c87]">© {new Date().getFullYear()} NS Jewels. All rights reserved.</p>
      </div>
    </footer>
  );
}
