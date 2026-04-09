import { blogPosts } from "@/data/blog-posts";
import type { BlogPost } from "@/types/blog";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return blogPosts;
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function getBlogPostsByDestination(
  destinationSlug: string
): Promise<BlogPost[]> {
  return blogPosts.filter((p) => p.destinationSlug === destinationSlug);
}

export async function getLatestBlogPosts(
  limit: number = 6
): Promise<BlogPost[]> {
  return [...blogPosts]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}
