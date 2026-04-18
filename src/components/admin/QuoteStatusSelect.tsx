"use client";

import { useState, useTransition } from "react";
import { updateQuoteRequestStatus } from "@/app/admin/quote-requests/actions";
import type { QuoteRequestStatus } from "@/lib/supabase/types";

const OPTIONS: { value: QuoteRequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

const TONE: Record<QuoteRequestStatus, { fg: string; bg: string }> = {
  new: { fg: "var(--info)", bg: "color-mix(in srgb, var(--info) 12%, transparent)" },
  contacted: { fg: "var(--warning)", bg: "color-mix(in srgb, var(--warning) 14%, transparent)" },
  quoted: { fg: "var(--primary)", bg: "var(--primary-muted)" },
  converted: { fg: "var(--success)", bg: "color-mix(in srgb, var(--success) 14%, transparent)" },
  closed: { fg: "var(--text-tertiary)", bg: "var(--bg-subtle)" },
};

export function QuoteStatusSelect({
  id,
  initial,
}: {
  id: string;
  initial: QuoteRequestStatus;
}) {
  const [status, setStatus] = useState<QuoteRequestStatus>(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tone = TONE[status];

  function handleChange(next: QuoteRequestStatus) {
    const previous = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      const result = await updateQuoteRequestStatus(id, next);
      if (!result.ok) {
        setStatus(previous);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <label className="relative inline-flex items-center">
        <select
          value={status}
          disabled={isPending}
          onChange={(e) => handleChange(e.target.value as QuoteRequestStatus)}
          className="appearance-none rounded-full px-3 py-1 pr-7 text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2"
          style={{
            color: tone.fg,
            background: tone.bg,
            border: "1px solid transparent",
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-2 w-3 h-3"
          viewBox="0 0 12 12"
          fill="none"
          stroke={tone.fg}
          strokeWidth="1.5"
        >
          <path d="M3 5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </label>
      {error ? (
        <span className="text-[10px]" style={{ color: "var(--error)" }}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
