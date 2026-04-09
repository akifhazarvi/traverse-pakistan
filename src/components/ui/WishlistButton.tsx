"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface WishlistButtonProps {
  tourSlug: string;
  className?: string;
}

export function WishlistButton({ tourSlug, className }: WishlistButtonProps) {
  const [saved, setSaved] = useState(false);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer",
        saved
          ? "bg-white/90 text-red-500"
          : "bg-black/20 text-white hover:bg-black/40",
        className
      )}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
