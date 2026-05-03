import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getSupabaseAnon } from "@/lib/supabase/server";
import type { PackageRow, PackageItineraryDayRow } from "@/lib/supabase/types";
import type { Package } from "@/types/package";
import type { PackageItinerary, PackageItineraryDay } from "@/types/package";

function toPackage(row: PackageRow): Package {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    badge: (row.badge ?? "new") as Package["badge"],
    duration: row.duration,
    route: row.route ?? "",
    destinationSlug: row.destination_slug,
    relatedDestinationSlugs: row.related_destination_slugs ?? [],
    regionSlug: row.region_slug,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    maxGroupSize: row.max_group_size ?? 12,
    languages: row.languages ?? [],
    freeCancellation: row.free_cancellation,
    reserveNowPayLater: row.reserve_now_pay_later,
    images: (row.images as Package["images"]) ?? [],
    highlights: row.highlights ?? [],
    inclusions: row.inclusions ?? [],
    exclusions: row.exclusions ?? [],
    knowBeforeYouGo: row.know_before_you_go ?? [],
    tiers: row.pricing as Package["tiers"],
    metaTitle: row.meta_title ?? row.name,
    metaDescription: row.meta_description ?? "",
  };
}

function toItineraryDay(row: PackageItineraryDayRow): PackageItineraryDay {
  return {
    dayNumber: row.day_number,
    title: row.title,
    description: row.description ?? "",
    hotels: {
      deluxe: row.hotel_deluxe ?? "",
      luxury: row.hotel_luxury ?? "",
    },
    stops: (row.stops as PackageItineraryDay["stops"] | null) ?? [],
    drivingTime: row.driving_time ?? "",
    overnight: row.overnight ?? "",
    cityOnly: row.city_only?.length
      ? (row.city_only as PackageItineraryDay["cityOnly"])
      : undefined,
  };
}

// ── cached fetchers ───────────────────────────────────────────────────────────

const _fetchAllPackages = unstable_cache(
  async (): Promise<Package[]> => {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .order("name");

    if (error) throw new Error(`getAllPackages: ${error.message}`);
    return (data as unknown as PackageRow[]).map(toPackage);
  },
  ["all-packages"],
  { tags: ["packages"], revalidate: 86400 }
);

export const getAllPackages = cache(_fetchAllPackages);

export const getPackageBySlug = cache(async (slug: string): Promise<Package | null> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error?.code === "PGRST116") return null;
  if (error) throw new Error(`getPackageBySlug: ${error.message}`);
  return toPackage(data as unknown as PackageRow);
});

export const getPackageItinerary = cache(async (slug: string): Promise<PackageItinerary | null> => {
  const supabase = getSupabaseAnon();
  const { data, error } = await supabase
    .from("package_itinerary_days")
    .select("*")
    .eq("package_slug", slug)
    .order("day_number");

  if (error) throw new Error(`getPackageItinerary: ${error.message}`);
  if (!data || data.length === 0) return null;

  return {
    packageSlug: slug,
    days: (data as unknown as PackageItineraryDayRow[]).map(toItineraryDay),
  };
});

export const getFeaturedPackages = cache(async (limit = 5): Promise<Package[]> => {
  const all = await getAllPackages();
  return all.slice(0, limit);
});

export const getPackagesByDestination = cache(
  async (destinationSlug: string): Promise<Package[]> => {
    const supabase = getSupabaseAnon();
    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .or(`destination_slug.eq.${destinationSlug},related_destination_slugs.cs.{${destinationSlug}}`);

    if (error) throw new Error(`getPackagesByDestination: ${error.message}`);
    return (data as unknown as PackageRow[]).map(toPackage);
  }
);
