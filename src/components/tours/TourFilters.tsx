"use client";

import { useState } from "react";
import { FilterTag } from "@/components/ui/FilterTag";
import { TourGrid } from "./TourGrid";
import type { Tour } from "@/types/tour";

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Group Tours", value: "group-tour" },
  { label: "Trekking", value: "trekking" },
  { label: "Cultural", value: "cultural" },
  { label: "Luxury", value: "luxury" },
  { label: "Adventure", value: "adventure" },
];

const sortOptions = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Duration: Short", value: "duration-asc" },
  { label: "Rating", value: "rating" },
];

interface TourFiltersProps {
  tours: Tour[];
}

export function TourFilters({ tours }: TourFiltersProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState("recommended");

  const filtered = tours
    .filter((t) => activeFilter === "all" || t.category === activeFilter)
    .sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "duration-asc":
          return a.duration - b.duration;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div>
      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((opt) => (
            <FilterTag
              key={opt.value}
              label={opt.label}
              active={activeFilter === opt.value}
              onClick={() => setActiveFilter(opt.value)}
            />
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 px-4 text-[13px] border border-[var(--border-default)] rounded-full bg-[var(--bg-primary)] text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 cursor-pointer"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <p className="text-[14px] text-[var(--text-tertiary)] mb-6">
        {filtered.length} tour{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Grid */}
      <TourGrid tours={filtered} />
    </div>
  );
}
