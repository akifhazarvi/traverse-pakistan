import { SITE_CONFIG } from "@/lib/constants";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;

export const SITE = {
  ...SITE_CONFIG,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  logoWhite: `${SITE_URL}/logo-white.png`,
  ogImage: `${SITE_URL}/og-default.jpg`,
  locale: "en_US",
  country: "PK",
  addressLocality: "Islamabad",
  addressRegion: "Islamabad Capital Territory",
  postalCode: "44000",
  streetAddress: "Office #6, Plot No. 1, MPCHS E-11/1",
  geo: {
    latitude: 33.6938,
    longitude: 72.9715,
  },
  sameAs: [
    SITE_CONFIG.social.instagram,
    SITE_CONFIG.social.facebook,
    "https://tripadvisor.com/Attraction_Review-Traverse-Pakistan",
    "https://www.youtube.com/@traversepakistan",
  ],
  awards: [
    "TripAdvisor Travelers' Choice 2025",
    "#1 Top Rated Tour Agency in Islamabad",
  ],
} as const;

export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE.url}${clean}`;
}
