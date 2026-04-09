"use client";

import { useState } from "react";
import { formatPrice, getWhatsAppUrl } from "@/lib/utils";
import { StarRating } from "@/components/ui/StarRating";
import type { Tour } from "@/types/tour";

interface BookingSidebarProps {
  tour: Tour;
}

export function BookingSidebar({ tour }: BookingSidebarProps) {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [departure, setDeparture] = useState<"islamabad" | "lahore">("islamabad");

  const basePrice = departure === "lahore" && tour.pricing.lahore
    ? tour.pricing.lahore
    : tour.pricing.islamabad;
  const totalTravelers = adults + children;
  const totalPrice = basePrice * totalTravelers;

  const whatsappMessage = `Hi! I'd like to book the "${tour.name}" tour.\n\nDeparture: ${departure === "islamabad" ? "Islamabad" : "Lahore"}\nDate: ${tour.departureDate}\nAdults: ${adults}\nChildren: ${children}\nTotal: ${formatPrice(totalPrice)}\n\nPlease confirm availability.`;

  return (
    <div className="sticky top-[120px]">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-default)] rounded-[var(--radius-md)] p-6" style={{ boxShadow: "var(--shadow-sm)" }}>
        {/* Price */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">
            {formatPrice(basePrice)}
          </span>
          {tour.originalPrice && (
            <span className="text-base text-[var(--text-tertiary)] line-through tabular-nums">
              {formatPrice(tour.originalPrice)}
            </span>
          )}
          <span className="text-[14px] text-[var(--text-tertiary)]">per person</span>
        </div>

        {/* Rating */}
        <div className="mt-2">
          <StarRating rating={tour.rating} reviewCount={tour.reviewCount} size="sm" />
        </div>

        <hr className="my-5 border-[var(--border-default)]" />

        {/* Departure city */}
        {tour.pricing.lahore && (
          <div className="mb-4">
            <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] block mb-2">
              Departure City
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeparture("islamabad")}
                className={`h-10 rounded-[var(--radius-sm)] text-[13px] font-medium border transition-colors cursor-pointer ${
                  departure === "islamabad"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--primary)]"
                }`}
              >
                Islamabad
              </button>
              <button
                type="button"
                onClick={() => setDeparture("lahore")}
                className={`h-10 rounded-[var(--radius-sm)] text-[13px] font-medium border transition-colors cursor-pointer ${
                  departure === "lahore"
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--primary)]"
                }`}
              >
                Lahore
              </button>
            </div>
          </div>
        )}

        {/* Date */}
        <div className="mb-4">
          <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] block mb-2">
            Departure Date
          </label>
          <div className="h-11 px-4 border border-[var(--border-default)] rounded-[var(--radius-sm)] flex items-center text-[14px] text-[var(--text-primary)] bg-[var(--bg-subtle)]">
            {new Date(tour.departureDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Travelers */}
        <div className="space-y-3">
          <label className="text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] block">
            Travelers
          </label>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[14px] font-medium text-[var(--text-primary)]">Adults</span>
              <span className="text-[12px] text-[var(--text-tertiary)] ml-1">(13+)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-8 h-8 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-30"
                disabled={adults <= 1}
              >
                -
              </button>
              <span className="w-6 text-center text-[15px] font-semibold tabular-nums">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(tour.maxGroupSize, adults + 1))}
                className="w-8 h-8 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-[14px] font-medium text-[var(--text-primary)]">Children</span>
              <span className="text-[12px] text-[var(--text-tertiary)] ml-1">(2-12)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-8 h-8 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer disabled:opacity-30"
                disabled={children <= 0}
              >
                -
              </button>
              <span className="w-6 text-center text-[15px] font-semibold tabular-nums">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(children + 1)}
                className="w-8 h-8 border border-[var(--border-default)] rounded-full flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="mt-5 pt-4 border-t border-[var(--border-default)] flex items-center justify-between">
          <span className="text-[14px] text-[var(--text-secondary)]">
            Total ({totalTravelers} traveler{totalTravelers > 1 ? "s" : ""})
          </span>
          <span className="text-xl font-bold text-[var(--text-primary)] tabular-nums">
            {formatPrice(totalPrice)}
          </span>
        </div>

        {/* CTA */}
        <a
          href={getWhatsAppUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 w-full h-[52px] bg-[var(--primary)] text-white text-[15px] font-semibold rounded-[var(--radius-sm)] flex items-center justify-center gap-2 hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all"
        >
          Check Availability
        </a>

        {/* Guarantees */}
        <div className="mt-5 space-y-2">
          {tour.freeCancellation && (
            <p className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free cancellation
            </p>
          )}
          {tour.reserveNowPayLater && (
            <p className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Reserve now, pay later
            </p>
          )}
          <p className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Lowest price guarantee
          </p>
          {tour.pricing.singleSupplement && (
            <p className="text-[12px] text-[var(--text-tertiary)] mt-2">
              Single room supplement: {formatPrice(tour.pricing.singleSupplement)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
