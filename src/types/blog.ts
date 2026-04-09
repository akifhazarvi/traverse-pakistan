export interface BlogImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface BlogSection {
  heading?: string;
  headingLevel?: "h2" | "h3" | "h4";
  text: string;
  images?: BlogImage[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  sections: BlogSection[];
  image: string;
  tag: string;
  tags: string[];
  categories: string[];
  publishedAt: string;
  readTime: string;
  author: string;
  destinationSlug?: string;
  metaTitle: string;
  metaDescription: string;
}
