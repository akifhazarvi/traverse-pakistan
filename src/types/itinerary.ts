import type { TourImage } from "./tour";

export interface ItineraryStop {
  name: string;
  detail: string;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  image: TourImage | null;
  stops: ItineraryStop[];
  drivingTime: string;
  overnight: string;
}

export interface TourItinerary {
  tourSlug: string;
  days: ItineraryDay[];
}
