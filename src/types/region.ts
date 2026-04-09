export interface Region {
  id: string;
  slug: string;
  name: string;
  heroImage: string;
  description: string;
  destinationSlugs: string[];
  tourCount: number;
  metaTitle: string;
  metaDescription: string;
}
