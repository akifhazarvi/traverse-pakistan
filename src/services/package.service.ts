import { cache } from "react";
import { packages } from "@/data/packages";
import { packageItineraries } from "@/data/package-itineraries";
import type { Package } from "@/types/package";

export const getAllPackages = cache(async (): Promise<Package[]> => {
  return packages;
});

export const getPackageBySlug = cache(async (slug: string): Promise<Package | null> => {
  return packages.find((p) => p.slug === slug) ?? null;
});

export const getFeaturedPackages = cache(async (limit = 5): Promise<Package[]> => {
  return packages.slice(0, limit);
});

export const getPackageItinerary = cache(async (slug: string) => {
  return packageItineraries.find((i) => i.packageSlug === slug) ?? null;
});

export const getPackagesByDestination = cache(
  async (destinationSlug: string): Promise<Package[]> => {
    return packages.filter((p) => p.destinationSlug === destinationSlug);
  }
);
