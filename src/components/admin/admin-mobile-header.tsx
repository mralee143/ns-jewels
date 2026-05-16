import Image from "next/image";
import Link from "next/link";

type AdminMobileHeaderProps = {
  readonly label: string;
};

export function AdminMobileHeader({ label }: AdminMobileHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 md:hidden">
      <Link
        aria-label="NS Jewels admin dashboard"
        className="flex min-w-0 items-center gap-3"
        href="/admin"
      >
        <Image
          alt="NS JEWELS logo"
          className="h-9 w-auto max-w-[100px] rounded-md object-contain"
          height={918}
          priority
          src="/brand-logo.png"
          width={3058}
        />
        <span className="truncate text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E6E]">
          Admin
        </span>
      </Link>
      <Link
        aria-label="Account and settings"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#F0D3DA] bg-[#FDF2F5]/70 text-cta transition-colors hover:bg-[#FDF2F5]"
        href="/admin/settings"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-[#F0D3DA]">
          <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="1.7" />
            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
          </svg>
        </span>
        <span className="sr-only">{label}</span>
      </Link>
    </div>
  );
}
