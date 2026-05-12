"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, SVGProps } from "react";

type IconName = "customers" | "dashboard" | "orders" | "products" | "settings";

type NavItem = {
  readonly href: string;
  readonly icon: IconName;
  readonly label: string;
  readonly match?: readonly string[];
};

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/admin", icon: "dashboard", label: "Dashboard" },
  { href: "/admin/products", icon: "products", label: "Products" },
  { href: "/admin/orders", icon: "orders", label: "Orders" },
  { href: "/admin/customers", icon: "customers", label: "Customers", match: ["/admin/users"] },
];

const isActivePath = (pathname: string, item: NavItem): boolean => {
  const paths = [item.href, ...(item.match ?? [])];
  return paths.some((path) => pathname === path || (path !== "/admin" && pathname.startsWith(`${path}/`)));
};

const iconClassName = "h-5 w-5";

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M4 4h6v6H4V4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M14 4h6v6h-6V4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M4 14h6v6H4v-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M14 14h6v6h-6v-6Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
    </svg>
  );
}

function ProductsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="m12 3 7 7-7 11-7-11 7-7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M5 10h14M9 10l3 11 3-11M9 10l3-7 3 7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function OrdersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M7 8h10l-.7 11H7.7L7 8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function CustomersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M19.4 13.5a7.8 7.8 0 0 0 0-3l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.6-1.5L14 2.5h-4L9.6 5a8 8 0 0 0-2.6 1.5l-2.4-1-2 3.5 2 1.5a7.8 7.8 0 0 0 0 3l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

const iconByName: Record<IconName, (props: SVGProps<SVGSVGElement>) => ReactNode> = {
  customers: CustomersIcon,
  dashboard: DashboardIcon,
  orders: OrdersIcon,
  products: ProductsIcon,
  settings: SettingsIcon,
};

export function AdminDesktopNavigation() {
  const pathname = usePathname();

  return (
    <nav className="mt-8 flex flex-col gap-2 text-sm font-semibold" aria-label="Admin dashboard navigation">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item);
        const Icon = iconByName[item.icon];

        return (
          <Link
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
              active
                ? "bg-[#FDF2F5] text-cta shadow-sm ring-1 ring-[#F0D3DA]"
                : "text-[#2B2B2B] hover:bg-[#FDF2F5]/70 hover:text-cta"
            }`}
            href={item.href}
            key={item.href}
          >
            <Icon className={iconClassName} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminMobileNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
      {NAV_ITEMS.map((item) => {
        const active = isActivePath(pathname, item);
        const Icon = iconByName[item.icon];

        return (
          <Link
            className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
              active
                ? "border-[#E96A7A] bg-[#FDF2F5] text-cta"
                : "border-[#F0D3DA] bg-white text-[#2B2B2B] hover:bg-[#FDF2F5]"
            }`}
            href={item.href}
            key={item.href}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
