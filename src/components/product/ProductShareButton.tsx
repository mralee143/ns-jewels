"use client";

type ProductShareButtonProps = {
  readonly title: string;
};

export function ProductShareButton({ title }: ProductShareButtonProps) {
  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    try {
      if (navigator.share) {
        await navigator.share({ text: title, title, url });
        return;
      }

      await navigator.clipboard.writeText(url);
    } catch {
      /* cancelled share or clipboard unavailable */
    }
  };

  return (
    <button
      className="mt-8 flex items-center gap-2 text-sm font-medium text-black transition-colors duration-200 hover:text-neutral-700"
      onClick={() => void handleShare()}
      type="button"
    >
      <svg
        aria-hidden
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10" />
        <path d="m7 8 5-5 5 5" />
        <rect fill="none" height="7" rx="1.5" width="14" x="5" y="14" />
      </svg>
      Share
    </button>
  );
}
