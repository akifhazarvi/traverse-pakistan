export interface WhyVisitCard {
  icon: string;
  title: string;
  description: string;
}

export interface SeasonInfo {
  season: "spring" | "summer" | "autumn" | "winter";
  icon: string;
  months: string;
  badge: string;
  badgeColor: "green" | "yellow" | "red" | "blue";
  description: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  regionSlug: string;
  heroImage: string;
  subtitle: string;
  description: string;
  elevation?: string;
  tourCount: number;
  startingPrice: number;
  rating: number;
  whyVisitCards: WhyVisitCard[];
  seasons: SeasonInfo[];
  metaTitle: string;
  metaDescription: string;
}
