"use client";

import { cn } from "@/lib/utils";

interface FilterTagProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterTag({ label, active, onClick, className }: FilterTagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-[13px] font-medium rounded-full border transition-all duration-200 cursor-pointer whitespace-nowrap",
        active
          ? "bg-[var(--primary)] text-[var(--text-inverse)] border-[var(--primary)]"
          : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--primary)] hover:text-[var(--primary)]",
        className
      )}
    >
      {label}
    </button>
  );
}
