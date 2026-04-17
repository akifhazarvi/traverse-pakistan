# Traverse Pakistan — Full SEO Audit

- **Target**: `http://localhost:3000` (Next.js 16.2.3 dev server, Phase 1 rebuild)
- **Date**: 2026-04-17
- **Scope**: Source-code + runtime audit (one homepage HTML capture before the dev server entered a 500 loop; remaining analysis performed statically against [src/](src/))
- **Business type detected**: Tourism booking platform (Local Service / Travel) — brick-and-mortar office in Islamabad + nationwide service area. Industry: **Tour operator + hotel bookings + travel content**.

---

## Executive Summary

### Overall SEO Health Score: **40 / 100** — "Foundational but Underpowered"

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 35 | 7.7 |
| Content Quality | 23% | 55 | 12.6 |
| On-Page SEO | 20% | 50 | 10.0 |
| Schema / Structured Data | 10% | 0 | 0.0 |
| Performance (CWV est.) | 10% | 40 | 4.0 |
| AI Search Readiness | 10% | 20 | 2.0 |
| Images | 5% | 75 | 3.8 |
| **Total** | **100%** | — | **40** |

The platform has a **strong structured data model** in [src/data/](src/data/) (tours, hotels, destinations, reviews with ratings, NAP, awards) but emits **zero** of that as machine-readable signals. The ceiling is high — most critical fixes are "plumb existing data into `<head>`".

### Top 5 Critical Issues

1. **Dev server is currently broken** — Tailwind v4 is extracting a corrupted class fragment (`text-[var(--text-tertia"])</script>...`) into generated CSS, producing 500 errors on every route. Combined with a TS error in [src/services/booking.service.ts:55](src/services/booking.service.ts#L55), `npm run build` also fails. Nothing can be audited via live crawling until this is fixed.
2. **Zero structured data (JSON-LD)** — no `Organization`, `LocalBusiness`, `TouristTrip`, `Product`, `Hotel`, `FAQPage`, `BreadcrumbList`, or `Review` schema. The entire `src/data/*.ts` tree contains the exact fields Google wants for rich results, and none of it is exposed.
3. **Production config will 404 the entire site** — [next.config.ts](next.config.ts#L7-L9) sets `output: "export"` + `basePath: "/traverse-pakistan"`. A production build deployed to traversepakistan.com would serve `/traverse-pakistan/grouptours/...` instead of `/grouptours/...`. Unless this is intentional for a GitHub Pages subfolder, every URL in the sitemap will mismatch.
4. **No robots.txt, no llms.txt, no working sitemap.xml** — [src/app/sitemap.ts](src/app/sitemap.ts) exists but returns 500 right now; there's no `robots.ts`, no `public/robots.txt`, and no `public/llms.txt`. AI crawlers (GPTBot, ClaudeBot, PerplexityBot) have no explicit allowlist, and search engines can't discover the URL set.
5. **No canonical URLs, no og:image, no Twitter Card image** — every page is indexable with no canonical (duplicate-content risk once pagination/filters ship), the root OpenGraph config omits `og:image`, and `twitter:card` is `summary` rather than `summary_large_image`. Social shares will render blank cards.

### Top 5 Quick Wins

1. **Ship a global JSON-LD helper** — emit `Organization` + `LocalBusiness` + `AggregateRating` (data already in [siteConfig.stats](src/data/site-config.ts#L22-L28): 4.9★, 1300 reviews) from root layout. ~30 min of work, unlocks Knowledge Panel eligibility.
2. **Expand tour/blog meta descriptions** — 22/22 tour descs are <100ch; 6/10 blog descs are <100ch. Target 140–158 chars. Rewrite once, ~2 hours.
3. **Add `public/robots.txt` + `public/llms.txt`** — static files, no dev-server issues, immediate AI-crawler access.
4. **Add `og:image` to root layout metadata + generate a 1200×630 share image** — use the Rakaposhi/cherry-blossom hero as the default, switch `twitter:card` to `summary_large_image`.
5. **Fix the Nanga Parbat blog metaDescription** — currently set to "Best places to experience autumn colors in Pakistan" (copy-pasted from another post). Also a duplicate meta description between two posts.

---

## Technical SEO

### Crawlability
- **Current state**: Dev server returns 500 on every route due to Tailwind class-extraction bug. A single homepage snapshot (407KB HTML) taken before the compile loop is the only runtime artifact available.
- **robots.txt**: **Missing** — `/robots.txt` returns the error page. No `public/robots.txt`, no `src/app/robots.ts`.
- **sitemap.xml**: **Broken** — [src/app/sitemap.ts](src/app/sitemap.ts) is well-structured (emits static pages + 22 tours + 8 destinations + 5 regions + 10 blog posts + travel styles) but currently 500s because of the dev-server CSS issue. Also compatibility concern: with `output: "export"` + `basePath: "/traverse-pakistan"`, all sitemap URLs (`https://traversepakistan.com/grouptours/...`) will mismatch actual deployed URLs (which would be under `/traverse-pakistan/...`).
- **llms.txt**: **Missing**. No markdown summary for AI crawlers.
- **Internal linking**: Homepage has 69 internal links across navbar, featured sections, destinations, and footer — healthy density. No orphan-page detection run (dev-server blocker).
- **basePath issue**: [next.config.ts:6](next.config.ts#L6) — `basePath: isProd ? "/traverse-pakistan" : ""`. This is a **production-breaking misconfiguration** if the target is the root domain. Sitemap at [src/app/sitemap.ts:10](src/app/sitemap.ts#L10) hardcodes `BASE_URL = "https://traversepakistan.com"` (no `/traverse-pakistan` prefix), so sitemap URLs will not match deployed URLs.

### Indexability
- No `noindex` meta tags on any public page ✓
- No canonical tag on any page ✗ — every page is a duplicate-content risk the moment filters/pagination ship.
- 4 pages have no metadata export at all ([src/app/page.tsx](src/app/page.tsx), [src/app/account/settings/page.tsx](src/app/account/settings/page.tsx), [src/app/account/trips/page.tsx](src/app/account/trips/page.tsx), [src/app/account/wishlist/page.tsx](src/app/account/wishlist/page.tsx)) — account routes should probably be `noindex` since they're user-private.
- Booking and checkout pages ([src/app/booking/[tourSlug]/page.tsx](src/app/booking/[tourSlug]/page.tsx), [src/app/grouptours/[slug]/checkout/page.tsx](src/app/grouptours/[slug]/checkout/page.tsx), [src/app/hotels/[slug]/checkout/page.tsx](src/app/hotels/[slug]/checkout/page.tsx)) — currently emit only a title, no description. These should be `noindex` (transactional funnel pages are thin-by-design).

### Security
- **No `headers()` config** in [next.config.ts](next.config.ts) — missing `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`. `output: "export"` means headers must be set at the CDN/Vercel layer instead.
- HTTPS presumably terminated at the edge in production; [next.config.ts:21-28](next.config.ts#L21-L28) also allows `http://traversepakistan.com` and `http://www.traversepakistan.com` as image sources — prefer HTTPS-only.

### Core Web Vitals
Cannot measure field data (dev server broken + no CrUX/PSI run). Lab-only concerns from source:
- `images.unoptimized: true` ([next.config.ts:36](next.config.ts#L36)) — all images served at full resolution. This kills **LCP** on every image-heavy page (most pages). Current justification ("SSL cert issue") doesn't apply in production where `traversepakistan.com` has valid HTTPS; the flag should flip to `false` for production.
- Hero images use `priority` correctly in destination/region/hotel routes ✓
- Homepage appears to have `fetchPriority="low"` preload on an HMR bundle — fine for dev.

### Redirects
- No redirects configured (`output: export` prevents `next.config.ts` redirects at runtime anyway). Must be done at CDN: trailing-slash policy, www→non-www, legacy WordPress URLs → new routes.

---

## Content Quality

### Coverage
| Entity | Count | metaTitle | metaDescription | Author | publishedAt | updatedAt |
|---|---|---|---|---|---|---|
| Tours | 22 | 22/22 ✓ | 22/22 ✓ | — | — | — |
| Destinations | 8 | 8/8 ✓ | 8/8 ✓ | — | — | — |
| Regions | 5 | 5/5 ✓ | 5/5 ✓ | — | — | — |
| Packages | 5 | 5/5 ✓ | 5/5 ✓ | — | — | — |
| Hotels | 6 | — (uses runtime template) | — (uses description) | — | — | — |
| Blog | 10 | 10/10 ✓ | 10/10 ✓ | 10/10 ✓ | 10/10 ✓ | **0/10 ✗** |
| Reviews | 8 | — | — | — | — | — |

### Meta Title Length
| Entity | Range | >60ch (too long) | <30ch (too short) |
|---|---|---|---|
| Tours | 48–68ch | 4/22 | 0 |
| Blog | 61–88ch | **10/10** | 0 |

Every single blog meta title exceeds the 60-char SERP truncation threshold, largely because of the redundant `" | Traverse Pakistan Blog"` suffix (24ch). The root layout already supplies a `%s | Traverse Pakistan` template — blog posts double-brand.

### Meta Description Length
| Entity | Range | <100ch (too short) | >160ch (too long) |
|---|---|---|---|
| Tours | 43–81ch | **22/22** | 0 |
| Blog | 33–154ch | 6/10 | 0 |

All 22 tour meta descriptions are under 100 chars — averaging 61. Google's SERP snippet budget is ~155–158 chars. Every tour page is wasting ~60% of its SERP real estate.

### Duplicate Content
- **Blog #4 (Nanga Parbat)** has `metaDescription: "Best places to experience autumn colors in Pakistan"` — copy-pasted from blog #10. Wrong topic + duplicate signal.
- **Blog #10 ("Best Places to Experience Autumn Colors in Pakistan")** has 120-word content — thin.
- **Blog #1 (258 words)** and **Blog #2 (247 words)** — thin, under Google's rough 300-word article bar.

### E-E-A-T
- **Experience**: Hotel and tour descriptions read as first-hand ("Wake before dawn to watch sunrise paint Rakaposhi, Diran, Ultar Sar…") — strong experiential language.
- **Expertise**: Awards listed in [src/data/site-config.ts:28-37](src/data/site-config.ts#L28-L37) (TripAdvisor Travelers' Choice 2025, #1 Top Rated in Islamabad) but **not exposed as schema** on any page.
- **Authoritativeness**: No `/about` author bios, no team/guide profiles, no press mentions page.
- **Trustworthiness**: Phone + WhatsApp + office address are in Footer ✓. Cancellation/privacy/terms pages exist ✓. Review count (1,300+) stated on homepage ✓ — but again, no `Review`/`AggregateRating` schema.

### Readability
Tour/hotel/destination descriptions: crisp, active, sentence length reasonable (sample avg ~18 words). Blog content varies widely — Post 4 (1,480 words, Nanga Parbat) strong; Post 10 (120 words) functionally a stub.

---

## On-Page SEO

### Homepage (the only live snapshot)
- **Title** (65ch): "Traverse Pakistan — Pakistan's Highest-Rated Tourism Company" — good length, brand+value prop. Note: rendered title shows `&#x27;` encoded apostrophe; confirm this is the HTML-encoded form only and Google parses it correctly (it should).
- **Description** (151ch): Good length, includes primary keyword "tour operator" and geographic modifiers ("Hunza, Skardu, Chitral").
- **H1** (1 instance): "Pakistan Like Never Before!" — marketing-fluff, no keyword alignment. Competitors rank on "Pakistan tours" / "book Pakistan tour" / "Hunza tour package" — the H1 misses all of them.
- **H2s** (9): "Design Your Dream Journey", "Popular Tours", "Popular Stays", "Explore Destinations", "Travel Your Way", "Stories & Guides", "Stories from the Road", "Why Travel With Us", "What Travelers Say" — two of these ("Stories & Guides" / "Stories from the Road") are near-duplicates, consolidate.
- **H3s**: 47 — likely fine (card titles, etc.) but verify the nesting.
- **Internal links**: 69 — good.
- **External links**: 6 — small.
- **Word count (visible)**: ~1,311 words.

### Root Layout Metadata ([src/app/layout.tsx:10-30](src/app/layout.tsx#L10-L30))
Has `title.template`, `keywords`, and `openGraph.{type,locale,siteName}` — missing:
- `metadataBase` (required for `openGraph.images` URLs to resolve correctly)
- `openGraph.url`, `openGraph.title`, `openGraph.description`, `openGraph.images`
- `twitter.{card: "summary_large_image", title, description, images}`
- `alternates.canonical`
- `robots: { index: true, follow: true, ... }` + `verification` (Search Console / Bing)
- `icons` (favicon exists but not declared)
- `authors`, `creator`, `publisher`

### Dynamic Routes
All 7 dynamic `generateMetadata` functions emit only `title` + `description`. None emit OG, Twitter, canonical, or `alternates`. The per-entity data (`tour.metaTitle`, `tour.metaDescription`) is being passed through, but nothing else from the rich entity model (images, price, rating) flows into `<head>`.

### Keyword Targeting Gaps
Based on [layout.tsx keywords](src/app/layout.tsx#L17-L23): "Pakistan tours", "Hunza tour", "Skardu tour", "K2 Base Camp", "Pakistan travel", "Traverse Pakistan". Reasonable seed list. Not present but high-value:
- "Pakistan tour packages"
- "Hunza tour from Islamabad/Lahore" (matches dual-city pricing)
- "Pakistan honeymoon / family tour"
- "cherry blossom Hunza tour" (seasonal, high intent)
- "K2 base camp trek"

---

## Schema & Structured Data

### Current implementation
**None.** Zero JSON-LD. Zero microdata. `grep -r "application/ld+json"` returns empty across [src/](src/).

### Validation errors
N/A — nothing to validate.

### Missing opportunities (ranked by impact)

| Schema | Where | Data source | Expected rich result |
|---|---|---|---|
| `Organization` + `LocalBusiness` (TravelAgency) | Root layout | [siteConfig](src/data/site-config.ts) | Knowledge panel, business info in SERP |
| `AggregateRating` (4.9 / 1,300 reviews) | Organization | [siteConfig.stats](src/data/site-config.ts#L22-L28) | Star ratings in brand SERPs |
| `TouristTrip` + `Offer` | Tour detail pages | [tours.ts](src/data/tours.ts) (price, duration, route, images) | Trip carousel, pricing in SERP |
| `Hotel` + `Offer` + `Room` | Hotel detail pages | [hotels.ts](src/data/hotels.ts) (rating, rooms, amenities, price) | Hotel pack eligibility |
| `Review` + `AggregateRating` | Hotels/tours | [hotels.ts](src/data/hotels.ts) reviews array | Star ratings next to listings |
| `FAQPage` | Destination pages | [faqs.ts](src/data/faqs.ts) (via `getFAQsByDestination`) | FAQ rich results, AI Overviews citation |
| `BreadcrumbList` | All detail pages (breadcrumbs already render) | — | Breadcrumb trail in SERP |
| `Article` + `Person` | Blog posts | [blog-posts.ts](src/data/blog-posts.ts) | Top stories, article rich result |
| `TouristDestination` / `Place` | Destination pages | [destinations.ts](src/data/destinations.ts) | Place info card |
| `Event` | Departure dates per tour | [tours.ts `departureDate`](src/data/tours.ts) | Event pack for seasonal tours |

Every one of these has the underlying data already typed and queryable via service functions. Implementation is additive only.

---

## Performance (CWV)

Field data unavailable (dev server broken, no PSI run, no GA4/CrUX). Code-level concerns:

- **LCP risk: HIGH** — `images.unoptimized: true` ([next.config.ts:36](next.config.ts#L36)) means every hero image is a full-size JPEG from WordPress. Hunza/Skardu hero images from [traversepakistan.com/wp-content/uploads](https://traversepakistan.com/wp-content/uploads/) are typically 1–4 MB. On a detail page the LCP element will be the hero; without Next image optimization, LCP on mid-tier mobile likely 4–6s.
- **CLS risk: LOW/MEDIUM** — `next/image` with `fill` is used correctly on hero sections. Check non-hero cards for explicit width/height.
- **INP risk: UNKNOWN** — ThemeProvider + multiple client components. Theme toggle is an inline `<script>` in the `<head>` (good anti-FOUC).
- **JS bundle**: Turbopack dev mode; production size not measured.
- **Third-party scripts**: None detected in layout — no GA, no GTM, no chat widget, no pixel. Either they haven't been added yet or they're intentionally absent for Phase 1.

**Recommendation**: once the Tailwind / TS issues are fixed, run `npx @next/bundle-analyzer` and Lighthouse mobile on five archetype routes (home, tours list, tour detail, hotel detail, blog post).

---

## Images

### Homepage analysis
- 47 `<img>` elements, **100% have alt text** (0 missing, 0 empty). Alt text is descriptive ("Cherry blossoms with Rakaposhi", "Autumn Hunza", "Skardu blossom") — not keyword-stuffed, not generic.
- All images served from WordPress CDN (`traversepakistan.com/wp-content/uploads/`).

### Global concerns
- `images.unoptimized: true` — full-size JPEG delivery sitewide. Biggest single performance drag.
- No **OG share image** configured anywhere. `og:image` is `None` on the homepage.
- No explicit favicon links (browser will fall back to `/favicon.ico`, which exists). Add `apple-touch-icon`, `manifest`, `icon` links.
- Logo files exist in [public/](public/) (`logo.png`, `logo-white.png`, `logo-real.jpg`, `logo.svg`) but not used for schema `logo` property (no schema exists).

### Next steps
- Flip `unoptimized` to `false` in production.
- Generate a dedicated 1200×630 OG image (Rakaposhi + brand lockup).
- Generate blog-specific OG cards per post.
- Add `sizes` prop review across card components (most tour/hotel cards render at ~320–400 px on mobile; if the image is served at 2560 px that's pure waste).

---

## AI Search Readiness (GEO)

### Citability score: **20 / 100**

- **LLM access**: No `robots.txt` → no explicit allow/deny for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`. Most are permissive by default but explicit allow = higher crawl priority for some.
- **llms.txt**: Missing. Anthropic/Perplexity-style AI crawlers increasingly use this as a sitemap-for-LLMs.
- **JSON-LD**: Zero. Big blocker — LLMs preferentially cite passages from pages with entity markup.
- **Passage-level citability**: Medium. Tour/hotel descriptions are concrete and factual (names, altitudes, distances, prices) — LLM-friendly. Homepage H1 "Pakistan Like Never Before!" is vague. Blog posts use first-person "Traverse Pakistan" voice (good for brand attribution).
- **Brand mention signals**: TripAdvisor + Tour company awards present in [site-config.ts](src/data/site-config.ts#L28-L37) as plain text; not exposed as schema `award` or linked.
- **Table/list density**: Tours have good inclusion/exclusion lists (implicit structured content). Hotels have amenities arrays. These will render as bullet lists — citability-friendly.
- **FAQ structure**: [src/data/faqs.ts](src/data/faqs.ts) exists (destination-linked) but without `FAQPage` schema, the citation value is lost.

### Platform-specific notes
- **Google AI Overviews**: needs HowTo / FAQPage / Review schema + quality E-E-A-T content. Largest gap.
- **ChatGPT Search**: allowlist `GPTBot`, ship `llms.txt`, ensure `OpenGraph` images.
- **Perplexity**: allowlist `PerplexityBot`, favors sites with clear Wikipedia-style factual sections (destination pages can be restructured to help).

---

## Local SEO

### Business type
**Hybrid: brick-and-mortar (office) + service-area (nationwide tours).**
- Physical office: Office #6, Plot No. 1, MPCHS E-11/1, Islamabad ([siteConfig.address](src/data/site-config.ts#L9)).
- Service area: all of Pakistan (Gilgit-Baltistan, KPK, Punjab, Sindh, Balochistan).

### NAP consistency (Name, Address, Phone)
- **Homepage HTML**: phone `+923216650670` (tel), email `info@traversepakistan.com` (mailto), WhatsApp `923216650670` all present ✓.
- **Address**: hardcoded in [Footer.tsx:129](src/components/layout/Footer.tsx#L129) as plain text — should pull from `siteConfig` and expose via `PostalAddress` schema.
- Phone format inconsistency: `siteConfig.phone` is `"+92-321-6650670"` (with dashes) but `tel:+923216650670` in HTML (no dashes). Harmless technically but a `Person`/`Organization` schema would want one canonical form.

### Local schema (missing)
None. Should emit `TravelAgency` (subclass of `LocalBusiness`) with:
- `name`, `url`, `logo`, `image`
- `address` → `PostalAddress` (streetAddress, addressLocality: "Islamabad", addressRegion: "Islamabad Capital Territory", addressCountry: "PK", postalCode)
- `geo` → `GeoCoordinates` (Islamabad coords)
- `telephone`, `email`
- `openingHoursSpecification` (not in data — needs to be added)
- `areaServed` → Pakistan (Country) with sub-regions
- `aggregateRating` (4.9 / 1,300)
- `award` (TripAdvisor)
- `sameAs` (Instagram, Facebook, TripAdvisor links from [siteConfig.social](src/data/site-config.ts#L15-L19))

### GBP (Google Business Profile) — outside-site signals
Not auditable from the local build. Recommended actions when live:
- Verify GBP listing for "Traverse Pakistan" in Islamabad.
- Ensure GBP NAP matches site NAP exactly.
- Link GBP → site, site → GBP (via `sameAs` in schema once added).

### Location page quality
There is no dedicated `/office` or `/islamabad` local landing page. Consider one since the company has a single physical office.

---

## Build / Dev Blockers (not SEO per se, but block the audit)

### 1. Tailwind CSS class extraction bug — BLOCKS DEV

```
./src/app/globals.css:1974:29
Parsing CSS source code failed
.text-\[var\(--text-tertia\"\]\)\<\/script\>\<script\>self\.__next_f\.push\(\[1\,\"ry\...
```

[src/app/globals.css](src/app/globals.css) is only 206 lines — the 1974 is Tailwind's *generated* output. Somewhere in the scanned content, Tailwind is extracting a Tailwind arbitrary-value class that's been corrupted by the RSC flight-payload encoding. Likely triggered by a long string literal containing `text-[var(--text-tertiary)]` that gets chunk-split across a `</script><script>` boundary when Next serializes a client-component prop, then Tailwind picks up the mangled fragment on recompile.

Workarounds to try (in order):
1. `rm -rf .next node_modules/.cache` and restart dev.
2. Disable Turbopack: `npm run dev -- --webpack`.
3. Scope Tailwind content paths via `@source` in globals.css to exclude `.next/`.
4. Move dynamic arbitrary-value classes (`text-[var(--text-tertiary)]`) into a named utility under `@theme` in [globals.css](src/app/globals.css) to prevent Tailwind from scanning prop strings.

### 2. TypeScript error in booking service — BLOCKS PROD BUILD

[src/services/booking.service.ts:55](src/services/booking.service.ts#L55):
```
Type error: Type 'CreateBookingArgs' does not satisfy the constraint 'never'.
const { data, error } = await supabase.rpc<"create_booking", CreateBookingArgs>(
```

Generics in Supabase's `rpc` signature don't match what's being passed. Needs either regenerating Supabase types or fixing the generic parameters.

### 3. Production config mismatch — WILL BREAK LIVE URLS

[next.config.ts:6](next.config.ts#L6): `basePath: isProd ? "/traverse-pakistan" : ""` combined with `output: "export"` means a production build only works when served under `/traverse-pakistan/*`. [sitemap.ts:10](src/app/sitemap.ts#L10) hardcodes `BASE_URL = "https://traversepakistan.com"` with no `/traverse-pakistan` prefix. Either:
- Remove `basePath` (if deploying to the root domain — most likely), or
- Update `BASE_URL` + canonical helpers to include the prefix.

---

## Audit Limitations

- Only **one page** was successfully captured as rendered HTML before the dev server entered the 500 loop ([.seo-audit/raw/homepage.html](.seo-audit/raw/homepage.html), 407KB). All other analysis is from source.
- No Core Web Vitals field data (no CrUX / PSI / GA4 configured).
- No DataForSEO / Google Search Console data (credentials not checked).
- No Playwright screenshots captured (dev server broken).
- No live crawl of 500 pages — analyzed 26 routes from source, 10 blog posts, 22 tours, 8 destinations, 6 hotels, 5 packages, 5 regions.

See [ACTION-PLAN.md](ACTION-PLAN.md) for prioritized fixes.
