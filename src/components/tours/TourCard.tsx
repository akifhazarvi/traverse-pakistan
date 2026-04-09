import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { WishlistButton } from "@/components/ui/WishlistButton";
import type { Tour } from "@/types/tour";

interface TourCardProps {
  tour: Tour;
  variant?: "carousel" | "grid";
  className?: string;
}

export function TourCard({
  tour,
  variant = "carousel",
  className,
}: TourCardProps) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className={cn(
        "group flex flex-col rounded-[var(--radius-md)] overflow-hidden bg-[var(--bg-primary)]",
        "transition-all duration-[350ms] ease-[cubic-bezier(0.2,0,0,1)]",
        "hover:-translate-y-1 hover:shadow-[rgba(0,0,0,0.08)_0_4px_12px,rgba(0,0,0,0.04)_0_0_0_1px]",
        variant === "carousel"
          ? "min-w-[290px] w-[290px] sm:min-w-[310px] sm:w-[310px]"
          : "w-full",
        className
      )}
      style={{ boxShadow: "rgba(0,0,0,0.04) 0 0 0 1px, rgba(0,0,0,0.06) 0 2px 8px" }}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={tour.images[0]?.url || "/placeholder.jpg"}
          alt={tour.images[0]?.alt || tour.name}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0,0,1)] group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 310px"
        />

        {/* Top gradient for badge area */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />

        {/* Badge */}
        {tour.badge && (
          <div className="absolute top-3.5 left-3.5">
            <Badge type={tour.badge} />
          </div>
        )}

        {/* Wishlist */}
        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <WishlistButton tourSlug={tour.slug} />
        </div>

        {/* Duration pill — frosted glass */}
        <div className="absolute bottom-3.5 left-3.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold rounded-[var(--radius-full)] tracking-[0.04em] uppercase border border-white/10">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {tour.duration} days
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Category + Rating row */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--primary)]">
            {tour.category.replace("-", " ")}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[var(--primary-muted)] text-[13px]">★</span>
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">{tour.rating}</span>
            <span className="text-[11px] text-[var(--text-tertiary)]">({tour.reviewCount})</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="text-[16px] sm:text-[17px] font-bold text-[var(--text-primary)] leading-snug tracking-[-0.01em] group-hover:text-[var(--primary)] transition-colors duration-200 line-clamp-2">
          {tour.name}
        </h3>

        {/* Route */}
        <p className="text-[13px] text-[var(--text-tertiary)] mt-1.5 flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {tour.route}
        </p>

        {/* Trust signals */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2.5">
          {tour.freeCancellation && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--success)]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Free cancellation
            </span>
          )}
          {tour.reserveNowPayLater && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-[var(--info)]">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Pay later
            </span>
          )}
        </div>

        <div className="flex-1" />

        {/* Price row */}
        <div className="mt-3.5 pt-3.5 border-t border-[var(--border-default)]">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[12px] text-[var(--text-tertiary)] font-medium">From</span>
              <span className="text-[18px] font-bold text-[var(--text-primary)] tabular-nums tracking-tight">
                {formatPrice(tour.pricing.islamabad)}
              </span>
              {tour.originalPrice && (
                <span className="text-[12px] text-[var(--text-tertiary)] line-through tabular-nums">
                  {formatPrice(tour.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">per person</span>
          </div>
          {tour.pricing.lahore && (
            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
              {formatPrice(tour.pricing.lahore)} from Lahore
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
