import type { Metadata } from "next";

import { SITE, absoluteUrl } from "./site";

interface PageMetaInput {
  title?: string;
  description?: string;
  path: string;
  image?: string | null;
  imageAlt?: string;
  type?: "website" | "article" | "product";
  publishedAt?: string;
  updatedAt?: string;
  authors?: string[];
  tags?: string[];
  noIndex?: boolean;
}

const OG_DEFAULTS = {
  width: 1200,
  height: 630,
  alt: SITE.name,
};

function absoluteImage(img: string | null | undefined): string {
  if (!img) return SITE.ogImage;
  if (img.startsWith("http")) return img;
  return absoluteUrl(img);
}

/**
 * Build Next.js Metadata with canonical, OpenGraph, and Twitter cards filled in.
 * Use this from every page's generateMetadata() / static metadata export.
 */
export function buildMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    description,
    path,
    image,
    imageAlt,
    type = "website",
    publishedAt,
    updatedAt,
    authors,
    tags,
    noIndex,
  } = input;

  const canonical = absoluteUrl(path);
  const ogImage = absoluteImage(image);
  const finalDescription = description || SITE.description;

  const metadata: Metadata = {
    title,
    description: finalDescription,
    alternates: {
      canonical,
      types: {
        "application/rss+xml": `${SITE.url}/feed.xml`,
      },
    },
    openGraph: {
      type: type === "product" ? "website" : type,
      locale: SITE.locale,
      siteName: SITE.name,
      title,
      description: finalDescription,
      url: canonical,
      images: [
        {
          url: ogImage,
          width: OG_DEFAULTS.width,
          height: OG_DEFAULTS.height,
          alt: imageAlt || title || OG_DEFAULTS.alt,
        },
      ],
      ...(type === "article" && {
        publishedTime: publishedAt,
        modifiedTime: updatedAt || publishedAt,
        authors,
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: finalDescription,
      images: [ogImage],
      creator: "@traversepakistan",
      site: "@traversepakistan",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    keywords: tags,
  };

  return metadata;
}
