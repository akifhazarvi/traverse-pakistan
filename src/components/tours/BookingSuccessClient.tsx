"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

function SuccessInner({ tourName }: { tourName: string }) {
  const params = useSearchParams();
  const ref = params.get("ref");

  return (
    <div className="mt-10 max-w-[560px] mx-auto text-center">
      <div
        className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
        style={{ background: "var(--primary-light)" }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-[28px] sm:text-[34px] font-bold text-[var(--text-primary)] tracking-tight">
        Booking confirmed
      </h1>

      {ref && (
        <p className="mt-3 text-[14px] text-[var(--text-secondary)]">
          Reference{" "}
          <span className="font-mono font-semibold text-[var(--text-primary)]">{ref}</span>
        </p>
      )}

      <p className="mt-4 text-[15px] text-[var(--text-secondary)]">
        Your seat on <span className="font-semibold text-[var(--text-primary)]">{tourName}</span> is reserved.
        We&apos;ll email payment instructions within 2 hours and confirm the final itinerary via WhatsApp.
      </p>

      <div className="mt-8 p-5 bg-[var(--bg-subtle)] border border-[var(--border-default)] rounded-[var(--radius-md)] text-left">
        <h2 className="text-[14px] font-bold text-[var(--text-primary)] mb-2">What happens next</h2>
        <ol className="space-y-2 text-[13px] text-[var(--text-secondary)] list-decimal pl-5">
          <li>Our team reviews your booking and reserves your seat.</li>
          <li>We send a payment link (bank transfer, JazzCash, or card) within 2 hours.</li>
          <li>Once paid, you receive the full itinerary, packing list, and driver contact.</li>
          <li>We stay in touch via WhatsApp until your trip ends.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/account/trips">
          <Button size="lg">View my trips</Button>
        </Link>
        <Link
          href="/grouptours"
          className="text-[14px] font-semibold text-[var(--primary)] hover:underline"
        >
          Browse more tours
        </Link>
      </div>
    </div>
  );
}

export function BookingSuccessClient({ tourName }: { tourName: string }) {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-[var(--text-tertiary)]">Loading…</div>}>
      <SuccessInner tourName={tourName} />
    </Suspense>
  );
}
