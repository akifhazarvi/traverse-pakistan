# Traverse Pakistan — SEO Action Plan

Prioritized fix list distilled from [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md). Priorities:

- **Critical** — fix before any production deploy
- **High** — within 1 week of fixing critical items
- **Medium** — within 1 month
- **Low** — backlog

---

## Critical

### C1. Fix dev server CSS compile loop
**Owner**: frontend. **Effort**: 1–4h.
**Why**: Blocks every route (500 errors) and blocks this audit from doing live crawls / Playwright / CWV.
**How**:
1. `rm -rf .next node_modules/.cache && npm run dev`.
2. If still broken, try `npm run dev -- --webpack` to rule out Turbopack.
3. Inspect which source file contains `text-[var(--text-tertiary)]` inside a string literal likely to be split by RSC serialization. Suspects: any component that renders long strings containing Tailwind classes as JS strings (not JSX attributes). Grep `text-\[var\(--text-tertiary` across [src/components/](src/components/).
4. Safer long-term fix: move all `--text-tertiary` usages from arbitrary-value form (`text-[var(--text-tertiary)]`) to a Tailwind theme mapping so the class becomes `text-text-tertiary`. [globals.css](src/app/globals.css) already has `--color-text-tertiary` in `@theme inline`, so the utility should already exist.

### C2. Fix TypeScript error blocking production build
**Owner**: backend. **Effort**: 30min.
**Why**: `npm run build` exits 1 — can't deploy.
**How**: [src/services/booking.service.ts:55](src/services/booking.service.ts#L55) — the Supabase `rpc<T, A>()` generic doesn't accept `CreateBookingArgs` as `A`. Most likely fix: regenerate Supabase types (`supabase gen types typescript`) so `"create_booking"` is a known procedure, then the second generic is inferred. If RPC isn't wired up yet, stub the call with `@ts-expect-error` plus a TODO, or gate it behind a feature flag.

### C3. Resolve production config mismatch (basePath vs sitemap)
**Owner**: frontend / devops. **Effort**: 15min (decision) + 15min (edit).
**Why**: With `output: "export"` + `basePath: "/traverse-pakistan"` ([next.config.ts:6-7](next.config.ts#L6-L7)), the built site only works under that subfolder. [sitemap.ts:10](src/app/sitemap.ts#L10) emits root-domain URLs — every sitemap entry would 404 in production.
**How**: Confirm the target deployment. If it's the root domain (typical for Vercel + custom domain), **remove `basePath`**. If it's GitHub Pages under `/traverse-pakistan`, update `BASE_URL` in sitemap.ts + any hardcoded absolute URLs.

### C4. Add `robots.txt` and `sitemap.xml` to the live root
**Owner**: frontend. **Effort**: 15min.
**Why**: No crawler discovery path, no AI-crawler directives.
**How**:
1. Create `public/robots.txt` (static file; works with `output: export`):
   ```
   User-agent: *
   Allow: /
   Disallow: /account/
   Disallow: /booking/
   Disallow: /*/checkout

   # AI crawlers — allow explicitly
   User-agent: GPTBot
   Allow: /
   User-agent: ClaudeBot
   Allow: /
   User-agent: PerplexityBot
   Allow: /
   User-agent: Google-Extended
   Allow: /

   Sitemap: https://traversepakistan.com/sitemap.xml
   ```
2. Once C1/C3 are fixed, verify `/sitemap.xml` returns 200 and the URL list matches deployed paths.

### C5. Add JSON-LD for `Organization` + `LocalBusiness` site-wide
**Owner**: frontend. **Effort**: 1h.
**Why**: Zero structured data. Highest single-fix lift in the entire report — makes Knowledge Panel + star ratings eligible.
**How**: Create `src/components/seo/JsonLd.tsx` that emits `<script type="application/ld+json">` with the three lines of data you already have in [site-config.ts](src/data/site-config.ts):

```tsx
// minimal example — expand with address, geo, sameAs, logo
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Traverse Pakistan",
  url: "https://traversepakistan.com",
  logo: "https://traversepakistan.com/logo.png",
  image: "https://traversepakistan.com/og-default.jpg",
  telephone: "+92-321-6650670",
  email: "info@traversepakistan.com",
  address: { "@type": "PostalAddress", streetAddress: "Office #6, Plot No. 1, MPCHS E-11/1", addressLocality: "Islamabad", addressCountry: "PK" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "1300" },
  award: ["TripAdvisor Travelers' Choice 2025"],
  sameAs: ["https://instagram.com/traversepakistan", "https://facebook.com/traversepakistan", "..."]
}
```
Include in [src/app/layout.tsx](src/app/layout.tsx) so it ships on every page.

---

## High

### H1. Add canonical URLs + OpenGraph images + Twitter Cards
**Effort**: 2h.
**Why**: Prevents duplicate-content penalties, fixes social share cards (currently blank), enables large-image Twitter rendering.
**How**:
1. In [src/app/layout.tsx](src/app/layout.tsx) add:
   ```ts
   metadataBase: new URL("https://traversepakistan.com"),
   alternates: { canonical: "/" },
   openGraph: { ..., url: "https://traversepakistan.com", images: [{ url: "/og-default.jpg", width: 1200, height: 630 }] },
   twitter: { card: "summary_large_image", images: ["/og-default.jpg"] },
   icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
   robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
   ```
2. Every `generateMetadata` function should merge in page-specific `alternates.canonical` + `openGraph.images` (first tour/destination image works well).
3. Create `/public/og-default.jpg` (1200×630) with brand lockup + hero image. Consider per-entity OG cards generated with Next's [ImageResponse API](https://nextjs.org/docs/app/api-reference/functions/image-response) — but that requires `output: "standalone"` not `"export"`, so needs C3 resolved first.

### H2. Emit entity JSON-LD on detail pages
**Effort**: 4–6h.
**Why**: Every tour/hotel/destination/blog page is eligible for rich results that it's not getting.
**How**: Reuse the `JsonLd` helper from C5. Add one per route type:
- **Tour pages** ([src/app/grouptours/[slug]/page.tsx](src/app/grouptours/[slug]/page.tsx)): `TouristTrip` + `Offer` + `AggregateRating`.
- **Hotel pages** ([src/app/hotels/[slug]/page.tsx](src/app/hotels/[slug]/page.tsx)): `Hotel` + `Room` + `Offer` + `AggregateRating` + individual `Review`s from [hotels.ts reviews array](src/data/hotels.ts).
- **Destination pages** ([src/app/destinations/[slug]/page.tsx](src/app/destinations/[slug]/page.tsx)): `TouristDestination` + `FAQPage` (wire in [faqs.ts](src/data/faqs.ts)).
- **Blog pages** ([src/app/blog/[slug]/page.tsx](src/app/blog/[slug]/page.tsx)): `Article` + `Person` (author) + `BreadcrumbList`.
- **Package pages** ([src/app/packages/[slug]/page.tsx](src/app/packages/[slug]/page.tsx)): `Product` or `TouristTrip` with `Offer`.
- **Every detail page**: `BreadcrumbList` — already renders visually, just emit the schema equivalent.

### H3. Expand tour meta descriptions
**Effort**: 2h.
**Why**: All 22 tour metaDescriptions are <100ch (avg 61ch) — wasting 60% of the SERP snippet. Example: "7-day autumn tour to Hunza with golden foliage, Eagle" (53ch).
**How**: Rewrite each to 140–158ch. Template: `{duration}-day {category} to {destinations}. {top highlight}, {#2}, {#3}. From Rs {price}. Book with Pakistan's #1 tour operator.`

### H4. Fix blog meta title/description issues
**Effort**: 1h.
**Why**: All 10 blog metaTitles are 61–88ch (SERP-truncated). Nanga Parbat post has wrong/duplicate metaDescription.
**How**:
1. Strip `" | Traverse Pakistan Blog"` suffix from [blog-posts.ts](src/data/blog-posts.ts) — the root layout's `title.template` already appends `" | Traverse Pakistan"`. Just use the post title.
2. Fix [blog post #4 (Nanga Parbat) metaDescription](src/data/blog-posts.ts) — currently "Best places to experience autumn colors in Pakistan", should describe Nanga Parbat.
3. Expand all 10 metaDescriptions to 140–158ch.

### H5. Flip `images.unoptimized` off for production
**Effort**: 15min + testing.
**Why**: Biggest single LCP lever.
**How**: [next.config.ts:36](next.config.ts#L36) — change to `unoptimized: !isProd` (or just remove, since `output: "export"` requires `unoptimized: true` unless using a loader). With `output: export`, you'll need to either:
- Switch to `output: "standalone"` for Vercel deploy (keeps native Next image optimization), OR
- Add a `loader: "custom"` with a CDN loader (Cloudflare Images, Cloudinary, etc.), OR
- Pre-resize WordPress images and serve multiple sizes.

### H6. Block sensitive routes from indexing
**Effort**: 15min.
**Why**: `/account/*`, `/booking/*`, and `/*/checkout` are transactional/private and should not be indexed.
**How**: In the `generateMetadata` (or static metadata) of those pages, set:
```ts
robots: { index: false, follow: false }
```
Also covered by `Disallow:` in robots.txt (C4) but meta tag is the authoritative signal.

---

## Medium

### M1. Fix homepage H1
**Effort**: 10min.
Replace "Pakistan Like Never Before!" with keyword-targeted alternative, e.g. "Pakistan Tours & Custom Travel — Rated 4.9 by 1,300+ Travelers".
Homepage: [src/components/home/HeroSection.tsx](src/components/home/HeroSection.tsx).

### M2. Ship `llms.txt` for AI crawlers
**Effort**: 30min.
Create `public/llms.txt` with markdown summary of the site structure, top pages, and brand positioning. Template at [llmstxt.org](https://llmstxt.org/).

### M3. Add `updatedAt` to blog posts
**Effort**: 15min (schema) + ongoing editorial.
[blog-posts.ts](src/data/blog-posts.ts) has `publishedAt` but no `updatedAt`. Google uses `dateModified` for freshness. Add field + render into `Article` schema (depends on H2).

### M4. Expand thin blog posts
**Effort**: 2–3h per post.
- Post 10 (Autumn Colors, 120 words) → target 800+ words with destination sections.
- Post 1 (Traverse Pakistan intro, 258 words) → expand with team/awards/examples.
- Post 2 (Haramosh trek, 247 words) → add itinerary, gear, difficulty, photos.

### M5. Homepage/on-page consolidation
**Effort**: 30min.
Homepage H2s include both "Stories & Guides" and "Stories from the Road" — consolidate into one blog section. Keeps topical focus.

### M6. Add Author / Team / Trust pages
**Effort**: 4h.
- `/team` page with guide/author bios (E-E-A-T expertise signal).
- `/press` or `/awards` page listing TripAdvisor, media features.
- Link from every blog post author name to their bio.
- Link from footer.

### M7. Add CDN security headers
**Effort**: 30min (Vercel config).
`output: export` means headers can't come from Next; set them in `vercel.json`:
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [
      {"key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload"},
      {"key": "X-Content-Type-Options", "value": "nosniff"},
      {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
      {"key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(self)"}
    ]
  }]
}
```

### M8. Per-entity OG images
**Effort**: depends on approach.
Once C3 is resolved (if moving to `standalone`), use Next's `ImageResponse` to generate dynamic OG cards. Otherwise, pre-generate 1200×630 JPEGs per tour/destination/hotel and reference in their metadata.

---

## Low

### L1. Internationalization (hreflang)
Phase 2 consideration. Urdu translation + `alternates.languages` would double addressable market in Pakistan/diaspora.

### L2. Review seasonality hints
Tours have `departureDate` — schema `Event` or at minimum date-stamped page content helps rank for "April 2026 Hunza tour" queries.

### L3. Image sitemap
With 100+ high-quality images, a separate `sitemap-images.xml` can surface photos in Google Images more aggressively. Low impact but cheap.

### L4. RSS feed for blog
Helps AI crawlers + aggregators. Next's Metadata `alternates.types` can register it.

### L5. Breadcrumb visible on homepage sub-sections
Homepage sub-sections ("Popular Tours", etc.) are single-page anchors; not a breadcrumb issue, but consider jumping-anchor IDs for better "people also ask" extraction.

### L6. Clean up mixed HTTP image config
[next.config.ts:21-35](next.config.ts#L21-L35) allows both `http` and `https` for `traversepakistan.com` and `www.traversepakistan.com`. Keep only `https://traversepakistan.com` (pick one canonical host, drop `www` permutation once you confirm production canonical).

---

## Recommended Execution Order (2-week plan)

**Week 1**
- Day 1: C1, C2, C3 (unblock everything)
- Day 2: C4, C5 (robots + global schema)
- Day 3: H1, H6 (canonicals/OG + noindex on funnel)
- Day 4–5: H2 (entity schema rollout)

**Week 2**
- Day 6–7: H3, H4 (meta description/title rewrites)
- Day 8: H5 + M7 (image optimization + headers)
- Day 9: M1, M2, M3 (H1 fix, llms.txt, updatedAt)
- Day 10: Re-run audit, verify Lighthouse + Rich Results Test + validator.schema.org

After that, the projected SEO Health Score rises from ~40 → ~75–80 with everything above shipped.
