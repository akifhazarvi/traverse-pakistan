import { cache } from "react";
import { getSupabaseAnon } from "@/lib/supabase/server";
import type { TourRow, TourItineraryDayRow } from "@/lib/supabase/types";
import type { Tour, TourCategory } from "@/types/tour";
import type { TourItinerary } from "@/types/itinerary";

function toTour(row: TourRow): Tour {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    category: row.category as TourCategory,
    badge: row.badge as Tour["badge"],
    duration: row.duration,
    route: row.route,
    pricing: {
      islamabad: 0,
      lahore: null,
      singleSupplement: null,
    },
    price: 0,
    originalPrice: null,
    departureDate: row.departure_date ?? "",
    destinationSlug: row.destination_slug,
    regionSlug: row.region_slug,
    travelStyleSlugs: row.travel_style_slugs,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    maxGroupSize: row.max_group_size,
    languages: row.languages,
    freeCancellation: row.free_cancellation,
    reserveNowPayLater: row.reserve_now_pay_later,
    images: row.images,
    guide: row.guide ?? undefined,
    highlights: row.highlights,
    inclusions: row.inclusions,
    exclusions: row.exclusions,
    knowBeforeYouGo: row.know_before_you_go,
    meetingPoint: row.meeting_point,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

function toItinerary(tourSlug: string, rows: TourItineraryDayRow[]): TourItinerary {
  return {
    tourSlug,
    days: rows
      .sort((a, b) => a.day_number - b.day_number)
      .map((r) => ({
        dayNumber: r.day_number,
        title: r.title,
        description: r.description,
        image: r.image,
        stops: r.stops,
        drivingTime: r.driving_time,
        overnight: r.overnight,
      })),
  };
}

export const getAllTours = cache(async (): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase.from("tours").select("*").order("name");
  if (error) throw new Error(`getAllTours: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getTourBySlug = cache(async (slug: string): Promise<Tour | null> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase.from("tours").select("*").eq("slug", slug).single();
  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`getTourBySlug: ${error.message}`);
  return toTour(data as TourRow);
});

export const getToursByDestination = cache(async (destinationSlug: string): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("destination_slug", destinationSlug);
  if (error) throw new Error(`getToursByDestination: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getToursByRegion = cache(async (regionSlug: string): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("region_slug", regionSlug);
  if (error) throw new Error(`getToursByRegion: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getToursByCategory = cache(async (category: TourCategory): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("category", category);
  if (error) throw new Error(`getToursByCategory: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getToursByStyle = cache(async (styleSlug: string): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .contains("travel_style_slugs", [styleSlug]);
  if (error) throw new Error(`getToursByStyle: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getFeaturedTours = cache(async (limit?: number): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  let query = supabase
    .from("tours")
    .select("*")
    .not("badge", "is", null)
    .order("review_count", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(`getFeaturedTours: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getSimilarTours = cache(async (tourSlug: string, limit = 4): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data: tour } = await supabase
    .from("tours")
    .select("destination_slug")
    .eq("slug", tourSlug)
    .single();
  if (!tour) return [];
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .eq("destination_slug", tour.destination_slug)
    .neq("slug", tourSlug)
    .limit(limit);
  if (error) throw new Error(`getSimilarTours: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});

export const getItineraryByTourSlug = cache(
  async (tourSlug: string): Promise<TourItinerary | null> => {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase
      .from("tour_itinerary_days")
      .select("*")
      .eq("tour_slug", tourSlug)
      .order("day_number");
    if (error) throw new Error(`getItineraryByTourSlug: ${error.message}`);
    if (!data || data.length === 0) return null;
    return toItinerary(tourSlug, data as TourItineraryDayRow[]);
  }
);

export const searchTours = cache(async (query: string): Promise<Tour[]> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("tours")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,destination_slug.ilike.%${query}%,route.ilike.%${query}%`);
  if (error) throw new Error(`searchTours: ${error.message}`);
  return (data as TourRow[]).map(toTour);
});
