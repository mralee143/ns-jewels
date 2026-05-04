type StarRatingProps = {
  readonly className?: string;
  readonly value?: number;
};

export function StarRating({ className = "", value = 5 }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, value));

  return (
    <div
      aria-label={`${clamped} out of 5 stars`}
      className={`flex gap-0.5 ${className}`}
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <svg
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 ${index < clamped ? "text-black" : "text-black/25"}`}
          fill="currentColor"
          key={`star-${index}`}
          viewBox="0 0 24 24"
        >
          <path d="m12 3 2.9 6.61 7.16.63-5.42 4.7 1.64 7.06L12 17.77 5.72 22l1.64-7.06L2 10.24l7.16-.63L12 3Z" />
        </svg>
      ))}
    </div>
  );
}
