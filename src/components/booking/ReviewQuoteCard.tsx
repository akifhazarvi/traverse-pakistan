"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import type { Review } from "@/types/review";

interface ReviewQuoteCardProps {
  reviews: Review[];
  compact?: boolean;
}

export function ReviewQuoteCard({ reviews, compact }: ReviewQuoteCardProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % reviews.length), 9000);
    return () => window.clearInterval(id);
  }, [reviews.length]);

  if (!reviews.length) return null;
  const review = reviews[index];
  const text = truncateAtSentence(review.text, compact ? 110 : 180);

  return (
    <figure
      className={`relative rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-primary)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <span className="absolute -top-3 left-5 text-[36px] leading-none text-[var(--primary)] font-serif opacity-40 select-none">
        &ldquo;
      </span>
      <blockquote className="text-[13px] text-[var(--text-secondary)] leading-relaxed italic">
        {text}
      </blockquote>
      <figcaption className="mt-3 flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-deep)] text-[var(--text-inverse)] text-[11px] font-bold flex items-center justify-center">
          {review.initial}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[var(--text-primary)] truncate">{review.name}</p>
          <p className="text-[10px] text-[var(--text-tertiary)] inline-flex items-center gap-1">
            <span className="inline-flex gap-0.5" aria-label={`${review.rating} out of 5`}>
              {Array.from({ length: review.rating }, (_, i) => (
                <Icon key={i} name="star" size="xs" weight="fill" color="var(--primary-muted)" />
              ))}
            </span>
            <span>· {review.travelerType}</span>
          </p>
        </div>
        {reviews.length > 1 && (
          <div className="flex gap-1">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === index ? "bg-[var(--primary)]" : "bg-[var(--border-default)]"
                }`}
              />
            ))}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

function truncateAtSentence(text: string, max: number) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastStop = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("! "), slice.lastIndexOf("? "));
  if (lastStop > max * 0.5) return slice.slice(0, lastStop + 1);
  return slice.trimEnd() + "…";
}
