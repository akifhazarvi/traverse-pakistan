"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface WishlistButtonProps {
  savedCount?: number;
  className?: string;
}

export function WishlistButton({ savedCount, className }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  const displayCount = savedCount !== undefined
    ? saved ? savedCount + 1 : savedCount
    : undefined;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer backdrop-blur-sm active:scale-95",
          saved ? "text-[var(--error)]" : "text-[var(--on-dark)]"
        )}
        style={{
          background: saved ? "rgba(255,255,255,0.94)" : "rgba(0,0,0,0.32)",
        }}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={saved ? "motion-safe:animate-[wishlistPop_320ms_cubic-bezier(0.34,1.56,0.64,1)]" : ""}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      {displayCount !== undefined && displayCount > 0 && (
        <span
          className="text-[11px] font-semibold px-2 py-[3px] rounded-full backdrop-blur-sm text-[var(--on-dark)]"
          style={{ background: "rgba(0,0,0,0.42)" }}
        >
          {displayCount.toLocaleString()} saved
        </span>
      )}
    </div>
  );
}
