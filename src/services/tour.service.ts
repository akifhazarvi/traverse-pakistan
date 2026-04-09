import { tours } from "@/data/tours";
import { itineraries } from "@/data/itineraries";
import type { Tour, TourCategory } from "@/types/tour";
import type { TourItinerary } from "@/types/itinerary";

export async function getAllTours(): Promise<Tour[]> {
  return tours;
}

export async function getTourBySlug(slug: string): Promise<Tour | null> {
  return tours.find((t) => t.slug === slug) ?? null;
}

export async function getToursByDestination(
  destinationSlug: string
): Promise<Tour[]> {
  return tours.filter((t) => t.destinationSlug === destinationSlug);
}

export async function getToursByRegion(regionSlug: string): Promise<Tour[]> {
  return tours.filter((t) => t.regionSlug === regionSlug);
}

export async function getToursByCategory(
  category: TourCategory
): Promise<Tour[]> {
  return tours.filter((t) => t.category === category);
}

export async function getToursByStyle(styleSlug: string): Promise<Tour[]> {
  return tours.filter((t) => t.travelStyleSlugs.includes(styleSlug));
}

export async function getFeaturedTours(limit?: number): Promise<Tour[]> {
  const featured = tours.filter((t) => t.badge !== null);
  return limit ? featured.slice(0, limit) : featured;
}

export async function getSimilarTours(
  tourSlug: string,
  limit: number = 4
): Promise<Tour[]> {
  const tour = tours.find((t) => t.slug === tourSlug);
  if (!tour) return [];
  return tours
    .filter(
      (t) =>
        t.slug !== tourSlug && t.destinationSlug === tour.destinationSlug
    )
    .slice(0, limit);
}

export async function getItineraryByTourSlug(
  tourSlug: string
): Promise<TourItinerary | null> {
  return itineraries.find((i) => i.tourSlug === tourSlug) ?? null;
}

export async function searchTours(query: string): Promise<Tour[]> {
  const q = query.toLowerCase();
  return tours.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.destinationSlug.includes(q) ||
      t.route.toLowerCase().includes(q)
  );
}
