"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PackageCard } from "@/components/packages/PackageCard";
import type { Package } from "@/types/package";

const allDestinations = [
  { name: "Hunza Valley", slug: "hunza" },
  { name: "Skardu", slug: "skardu" },
  { name: "Fairy Meadows", slug: "fairy-meadows" },
  { name: "Ghizar & Phandar", slug: "ghizar" },
  { name: "Chitral & Kalash", slug: "chitral" },
  { name: "Kumrat Valley", slug: "kumrat" },
  { name: "Swat & Malam Jabba", slug: "swat" },
  { name: "Neelam Valley", slug: "neelam-valley" },
  { name: "Makran Coast & Gwadar", slug: "makran" },
];

export function PackagesClient({ packages }: { packages: Package[] }) {
  const searchParams = useSearchParams();
  const destFilter = searchParams.get("destination") ?? "";
  const dateFilter = searchParams.get("checkin") ?? "";

  const filtered = useMemo(() => (
    destFilter ? packages.filter((p) => p.destinationSlug === destFilter) : packages
  ), [packages, destFilter]);

  const destName = allDestinations.find((d) => d.slug === destFilter)?.name;
  const hasFilters = !!(destFilter || dateFilter);

  const dateLabel = dateFilter
    ? new Date(dateFilter).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;

  return (
    <>
      {/* Active filter summary */}
      {hasFilters && (
        <div className="bg-[var(--bg-subtle)] border-b border-[var(--border-default)] py-3">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 flex items-center gap-3 flex-wrap">
            <span className="text-[13px] text-[var(--text-secondary)]">
              {filtered.length} package{filtered.length !== 1 ? "s" : ""}
              {destName ? ` in ${destName}` : ""}
              {dateLabel ? ` · from ${dateLabel}` : ""}
            </span>
            <Link href="/packages" className="text-[13px] font-semibold text-[var(--primary)] hover:underline">
              Clear filters
            </Link>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[18px] font-semibold text-[var(--text-primary)]">No packages found</p>
            <p className="text-[14px] text-[var(--text-tertiary)] mt-2">Try a different destination or clear your filters</p>
            <Link href="/packages" className="inline-block mt-4 px-6 py-2.5 bg-[var(--primary)] text-[var(--text-inverse)] text-[14px] font-semibold rounded-full hover:bg-[var(--primary-hover)] transition-colors">
              Show all packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} variant="grid" />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
