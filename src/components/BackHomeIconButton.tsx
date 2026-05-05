import Link from "next/link";

type BackHomeIconButtonProps = {
  className?: string;
  href?: string;
  label?: string;
};

const DEFAULT_BUTTON_CLASSNAME =
  "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#F0D3DA] bg-white text-black transition-colors duration-200 hover:bg-[#F6C1CC]/35";

export function BackHomeIconButton({
  className = "",
  href = "/",
  label = "Back to home",
}: BackHomeIconButtonProps) {
  return (
    <Link aria-label={label} className={`${DEFAULT_BUTTON_CLASSNAME} ${className}`.trim()} href={href}>
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M15 18 9 12l6-6" />
      </svg>
      <span className="sr-only">{label}</span>
    </Link>
  );
}
