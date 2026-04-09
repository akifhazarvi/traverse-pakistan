export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  tag: string;
  publishedAt: string;
  readTime: string;
  author: string;
  destinationSlug?: string;
  metaTitle: string;
  metaDescription: string;
}
