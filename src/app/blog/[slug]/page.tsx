import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { getBlogPostBySlug, getAllBlogPosts } from "@/services/blog.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return { title: post.metaTitle, description: post.metaDescription };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="py-8 sm:py-12">
      <Container>
        <div className="max-w-[800px] mx-auto">
          <Breadcrumb
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          <div className="mt-6">
            <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase bg-[var(--primary)] text-white rounded-full">
              {post.tag}
            </span>
            <h1 className="text-[28px] sm:text-[38px] font-bold text-[var(--text-primary)] tracking-tight mt-3 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-[14px] text-[var(--text-tertiary)]">
              <span>{post.author}</span>
              <span>&middot;</span>
              <span>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>&middot;</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mt-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="800px"
              priority
            />
          </div>

          <article className="mt-8 prose prose-lg max-w-none text-[var(--text-secondary)]">
            <p className="text-lg leading-relaxed">{post.excerpt}</p>
            <p className="text-[15px] text-[var(--text-tertiary)] mt-6">
              Full article content coming soon. This is a placeholder for the complete blog post which will be added in Phase 2 with CMS integration.
            </p>
          </article>
        </div>
      </Container>
    </div>
  );
}
