import { cache } from "react";
import { blogPosts } from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog";

export const getAllBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return blogPosts;
});

export const getBlogPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    return blogPosts.find((p) => p.slug === slug) ?? null;
  }
);

export const getBlogPostsByDestination = cache(
  async (destinationSlug: string): Promise<BlogPost[]> => {
    return blogPosts.filter((p) => p.destinationSlug === destinationSlug);
  }
);

export const getLatestBlogPosts = cache(
  async (limit: number = 6): Promise<BlogPost[]> => {
    return [...blogPosts]
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
      .slice(0, limit);
  }
);
