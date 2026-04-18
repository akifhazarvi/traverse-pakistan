# Traverse Pakistan

Pakistan's highest-rated tourism platform. Built with Next.js 16, TypeScript, Tailwind CSS, and Supabase.

**Live:** [traversepakistan.com](https://traversepakistan.com) | **Rating:** 4.9/5 (1,300+ reviews) | **Award:** TripAdvisor Travelers' Choice 2025

---

## Quick Start

```bash
git clone https://github.com/akifhazarvi/traverse-pakistan.git
cd traverse-pakistan
npm install
cp .env.example .env.local          # then fill in Supabase keys — see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The site runs without Supabase — you just won't be able to sign in or complete bookings (they fall back to WhatsApp). To unlock auth + bookings, follow the full guide: **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** (≈10 min).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme inline`) |
| Font | Plus Jakarta Sans |
| Backend | Supabase (auth, Postgres, RLS, RPC) |
| Images | next/image + WordPress CDN |
| Deploy | Vercel |

## Project Structure

```
src/
  app/                Pages (App Router) — 156 static routes at build
  components/         Layout, home, tours, trip-detail, hotels, packages, seo
  data/               22 tours, 8 destinations, 5 regions, 6 hotels, 10 blog posts
  services/           Async data access (local data now, swappable to Supabase)
  types/              TypeScript interfaces
  lib/
    constants.ts      Site-wide SITE_CONFIG
    utils.ts          cn, formatPrice, slugify, getWhatsAppUrl
    seo/              Schema builders, metadata helper, SITE object
    supabase/         Client, env, generated DB types
supabase/
  migrations/         SQL migrations — run via Supabase SQL editor or CLI
docs/
  SUPABASE_SETUP.md   Full onboarding — copy .env.local, run migration, seed
public/
  robots.txt          AI crawler allowlist (GPTBot, ClaudeBot, PerplexityBot, …)
  llms.txt            Markdown summary for AI search engines
  site.webmanifest    PWA manifest
```

## Features

### Shipped
- **SEO-first build** — per-page canonical, OpenGraph, Twitter Card, Organization + TravelAgency + LocalBusiness schema site-wide, entity-level JSON-LD (TouristTrip, Hotel, TouristDestination, Article, FAQPage, BreadcrumbList) on every detail page.
- **AI-search ready** — `robots.txt` allows 18 AI crawlers; `llms.txt` gives LLMs a clean content summary; factual passage-level content.
- **22 tours** with dual pricing (Islamabad/Lahore), itineraries, inclusions/exclusions.
- **8 destinations × 5 regions × 6 hotels × 5 packages × 10 blog guides**.
- **Airbnb-style** search widget, mosaic gallery, booking sidebar, sticky mobile bar.
- **Dark mode** with system preference + `localStorage` persistence.
- **Supabase backend** — magic-link auth, `create_booking` RPC with atomic seat allocation, RLS-protected bookings/participants/payments/reviews.
- **Secure headers** — HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy via `next.config.ts`.
- **Cinematic video stories**, rotating hero, animated stats counter, 109 real images.

## Commands

```bash
npm run dev       # Dev server on :3000 (Turbopack)
npm run build     # Production build (156 pages generated)
npm run start     # Serve production build
npm run lint      # ESLint
npx tsc --noEmit  # Type-check without building
```

## Environment

See [.env.example](.env.example) for the full, commented list. The minimum for local development:

```env
# Optional in dev — canonical origin for JSON-LD/sitemap
NEXT_PUBLIC_SITE_URL=https://traversepakistan.com

# Required for auth + online booking
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Full Supabase walkthrough (create project → apply schema → seed departure → deploy to Vercel) is in **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)**.

## SEO / GEO

This codebase is optimized for both Google and AI-search citation:

- **Run a fresh audit**: `/seo-audit` (Claude Code skill) — reports health score + action plan.
- **Schema registry**: [`src/lib/seo/schema.ts`](src/lib/seo/schema.ts) — one builder per entity type.
- **Metadata helper**: [`src/lib/seo/metadata.ts`](src/lib/seo/metadata.ts) — every page uses `buildMetadata()` to guarantee canonical + OG + Twitter.
- **Sitemap**: auto-generated from data files at [`src/app/sitemap.ts`](src/app/sitemap.ts); refreshed daily (`revalidate = 86400`).
- **AI crawlers**: explicit `Allow:` for GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, Applebot, etc. in [`public/robots.txt`](public/robots.txt).

Validate rich results: [search.google.com/test/rich-results](https://search.google.com/test/rich-results). Validate schema: [validator.schema.org](https://validator.schema.org).

## Design System

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). Key principles:

- **Photography first** — images sell, UI serves
- **One font** — Plus Jakarta Sans (400–800 weights)
- **CSS variables** — all colors theme-aware, dark mode built-in
- **4 radius values** — 8px, 12px, 16px, 9999px
- **Multi-layer shadows** — Airbnb-style depth
- **Airbnb motion curve** — `cubic-bezier(0.2, 0, 0, 1)`

## AI Agent Setup

This repo includes [CLAUDE.md](CLAUDE.md) with full context for Claude Code, Cursor, and other AI coding tools — architecture, data flow, design tokens, rules. No re-explaining the codebase on every prompt.

## Brand

**Traverse Pakistan** — One-stop travel booking platform for Pakistan.

- Tours, hotels, transport, custom trips
- Office: E-11/1, Islamabad
- Phone: +92-321-6650670
- WhatsApp: [wa.me/923216650670](https://wa.me/923216650670)
- Email: info@traversepakistan.com
- Instagram: [@traversepakistan](https://instagram.com/traversepakistan)

## License

Private. All rights reserved.
