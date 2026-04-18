import type { MetadataRoute } from "next";
import { SITE, IS_GITHUB_PAGES, absoluteUrl } from "@/lib/seo/site";

export const dynamic = "force-static";

const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  "Bytespider",
  "CCBot",
  "cohere-ai",
  "DiffBot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "MistralAI-User",
];

const SEARCH_ENGINES = ["Googlebot", "Googlebot-Image", "Bingbot", "DuckDuckBot", "YandexBot"];

const FUNNEL_DISALLOW = ["/account/", "/booking/", "/*/checkout", "/*/checkout/", "/api/", "/_next/"];

/**
 * Dynamic robots.txt.
 *
 * - Vercel (default build): AI crawlers + major search engines explicitly
 *   allowed, funnel/account routes disallowed. Sitemap advertised.
 * - GitHub Pages (GITHUB_PAGES=true): everything disallowed — internal test
 *   previews must never be indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (IS_GITHUB_PAGES) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: SITE.url,
    };
  }

  const allowOnlyRules = [...SEARCH_ENGINES, ...AI_CRAWLERS].map((userAgent) => ({
    userAgent,
    allow: "/",
  }));

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: FUNNEL_DISALLOW },
      ...allowOnlyRules,
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE.url,
  };
}
