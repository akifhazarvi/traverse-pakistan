"use client";

import { useEffect, useState } from "react";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getNextOpenDeparture } from "@/services/booking.service";
import type { Departure } from "@/types/booking";
import type { Tour } from "@/types/tour";
import type { Review } from "@/types/review";
import { MobileBookingSheet } from "./MobileBookingSheet";
import { hasResumableDraft } from "@/hooks/useCheckoutDraft";

interface MobileReserveBarProps {
  tour: Tour;
  reviews: Review[];
}

export function MobileReserveBar({ tour, reviews }: MobileReserveBarProps) {
  const [open, setOpen] = useState(false);
  const [liveDeparture, setLiveDeparture] = useState<Departure | null>(null);
  const [resume, setResume] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResume(hasResumableDraft(tour.slug) !== null);
  }, [tour.slug]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    getNextOpenDeparture(tour.slug)
      .then((d) => { if (!cancelled) setLiveDeparture(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [tour.slug]);

  const basePrice = tour.pricing.islamabad;
  const seatsLeft = liveDeparture?.seatsAvailable ?? null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-[var(--bg-primary)] border-t border-[var(--border-default)] px-4 py-3 pb-[env(safe-area-inset-bottom,12px)]"
           style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[18px] font-bold text-[var(--text-primary)] tabular-nums">
                {formatPrice(basePrice)}
              </span>
              <span className="text-[11px] text-[var(--text-tertiary)]">/ person</span>
            </div>
            {seatsLeft !== null && seatsLeft <= 6 && seatsLeft > 0 ? (
              <p className="text-[11px] font-bold text-[var(--error)] flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--error)] animate-pulse" />
                Only {seatsLeft} seats left
              </p>
            ) : (
              <p className="text-[11px] text-[var(--text-secondary)]">
                Free cancellation · Reserve now, pay later
              </p>
            )}
          </div>

          <a
            href={getWhatsAppUrl(`Hi! Quick question about the ${tour.name} tour before I book.`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="w-11 h-11 rounded-full border border-[var(--border-default)] flex items-center justify-center shrink-0 hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--whatsapp)">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
          </a>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="h-11 px-5 bg-[var(--primary)] text-[var(--text-inverse)] text-[14px] font-bold rounded-full hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all shrink-0"
          >
            {resume ? "Resume" : "Reserve"}
          </button>
        </div>
      </div>

      <MobileBookingSheet open={open} onClose={() => setOpen(false)} tour={tour} reviews={reviews} />
    </>
  );
}
