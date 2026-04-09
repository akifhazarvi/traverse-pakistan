import { destinations } from "@/data/destinations";
import { destinationFaqs } from "@/data/faqs";
import type { Destination } from "@/types/destination";
import type { FAQ } from "@/types/faq";

export async function getAllDestinations(): Promise<Destination[]> {
  return destinations;
}

export async function getDestinationBySlug(
  slug: string
): Promise<Destination | null> {
  return destinations.find((d) => d.slug === slug) ?? null;
}

export async function getDestinationsByRegion(
  regionSlug: string
): Promise<Destination[]> {
  return destinations.filter((d) => d.regionSlug === regionSlug);
}

export async function getFAQsByDestination(
  destinationSlug: string
): Promise<FAQ[]> {
  const entry = destinationFaqs.find(
    (f) => f.destinationSlug === destinationSlug
  );
  return entry?.faqs ?? [];
}
