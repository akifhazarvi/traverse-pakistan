import { TourCard } from "./TourCard";
import type { Tour } from "@/types/tour";

interface TourGridProps {
  tours: Tour[];
}

export function TourGrid({ tours }: TourGridProps) {
  if (tours.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-[var(--text-tertiary)]">No tours found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} variant="grid" />
      ))}
    </div>
  );
}
