"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteProductButtonProps = {
  readonly productId: string;
  readonly title: string;
};

export function DeleteProductButton({ productId, title }: DeleteProductButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <button
      className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      disabled={pending}
      onClick={async () => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
          return;
        }
        setPending(true);
        try {
          const response = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
          if (!response.ok) {
            return;
          }
          router.refresh();
        } finally {
          setPending(false);
        }
      }}
      type="button"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
