export type HotelTier = "standard" | "deluxe" | "premium" | "luxury";

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  destinationSlug: string;
  tier: HotelTier;
  image: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  amenities: string[];
  description: string;
}
