import { cache } from "react";
import { tours } from "@/data/tours";
import { itineraries } from "@/data/itineraries";
import type { Tour, TourCategory } from "@/types/tour";
import type { TourItinerary } from "@/types/itinerary";

export const getAllTours = cache(async (): Promise<Tour[]> => {
  return tours;
});

export const getTourBySlug = cache(async (slug: string): Promise<Tour | null> => {
  return tours.find((t) => t.slug === slug) ?? null;
});

export const getToursByDestination = cache(
  async (destinationSlug: string): Promise<Tour[]> => {
    return tours.filter((t) => t.destinationSlug === destinationSlug);
  }
);

export const getToursByRegion = cache(async (regionSlug: string): Promise<Tour[]> => {
  return tours.filter((t) => t.regionSlug === regionSlug);
});

export const getToursByCategory = cache(
  async (category: TourCategory): Promise<Tour[]> => {
    return tours.filter((t) => t.category === category);
  }
);

export const getToursByStyle = cache(async (styleSlug: string): Promise<Tour[]> => {
  return tours.filter((t) => t.travelStyleSlugs.includes(styleSlug));
});

export const getFeaturedTours = cache(async (limit?: number): Promise<Tour[]> => {
  const featured = tours.filter((t) => t.badge !== null);
  return limit ? featured.slice(0, limit) : featured;
});

export const getSimilarTours = cache(
  async (tourSlug: string, limit: number = 4): Promise<Tour[]> => {
    const tour = tours.find((t) => t.slug === tourSlug);
    if (!tour) return [];
    return tours
      .filter(
        (t) =>
          t.slug !== tourSlug && t.destinationSlug === tour.destinationSlug
      )
      .slice(0, limit);
  }
);

export const getItineraryByTourSlug = cache(
  async (tourSlug: string): Promise<TourItinerary | null> => {
    return itineraries.find((i) => i.tourSlug === tourSlug) ?? null;
  }
);

export const searchTours = cache(async (query: string): Promise<Tour[]> => {
  const q = query.toLowerCase();
  return tours.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.destinationSlug.includes(q) ||
      t.route.toLowerCase().includes(q)
  );
});
