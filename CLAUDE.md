# Traverse Pakistan — AI Agent Instructions

## What This Is
Tourism booking platform for traversepakistan.com. Next.js 15 App Router + TypeScript + Tailwind CSS v4. Phase 2 (Supabase backend) is partially complete — destinations and regions are live on Supabase; tours, hotels, blog, reviews still use local TS data.

## Stack
- Next.js 15 (App Router, `src/` dir)
- TypeScript strict
- Tailwind CSS v4 (via `@theme inline` in globals.css)
- Plus Jakarta Sans (single font, weights 400-800)
- Supabase (PostgreSQL) — partial backend
- Deployed on Vercel

## Architecture

### Data Flow
```
Supabase DB → src/services/*.service.ts (async) → components   ← destinations, regions
src/data/*.ts → src/services/*.service.ts (async) → components  ← tours, hotels, blog, reviews
```
All service functions are `async`. Supabase uses `getSupabaseAnon()` (cookie-free client) for SSG compatibility.

### Key Directories
```
src/app/          → Pages (App Router)
src/components/   → UI: layout/, home/, tours/, trip-detail/, destination/, blog/, reviews/, ui/
src/data/         → 22 tours, 9 hotels, 8 reviews, 6 blog posts (local TS — not yet migrated)
src/services/     → Data access layer (tour, destination, region, review, blog, hotel)
src/lib/supabase/ → server.ts (getSupabaseAnon), client.ts, types.ts
src/types/        → TypeScript interfaces
src/lib/          → utils.ts (cn, formatPrice, slugify, getWhatsAppUrl), constants.ts
src/styles/       → fonts.ts (Plus Jakarta Sans only)
```

### Supabase Tables (live)
- `destinations` — 201 rows. Columns: slug, name, subtitle, description, hero_image, region_id (FK), parent_id (self-FK for hierarchy), elevation, rating, starting_price, why_visit_cards, seasons, meta_title, meta_description
- `regions` — 7 rows. Columns: slug, name, description, image_url
- `destination_faqs` — linked via destination_id FK

### Destination Hierarchy
- `parent_id` is a self-referencing FK on `destinations` for parent-child geography (e.g. Hunza → Attabad Lake)
- Top-level destinations have `parent_id = NULL`
- 3-level nesting supported: region → valley → sub-spot
- `region_id` handles region membership separately from `parent_id`

### Routes (351 pages)
```
/                          → Homepage (9 sections)
/tours                     → Listing with filters
/tours/[slug]              → Trip detail (gallery, itinerary, booking sidebar)
/destinations              → Grid
/destinations/[slug]       → Detail (tours, why-visit, seasons, FAQs)
/regions/[slug]            → Region with destinations + tours
/travel-styles             → Grid
/travel-styles/[slug]      → Filtered tours
/blog, /blog/[slug]        → Blog
/about, /contact           → Static
/booking/[tourSlug]        → Booking (Phase 2 shell)
/account/*                 → Account shells (Phase 2)
/admin/*                   → Admin (bookings, departures, quote requests, reviews)
/grouptours/[slug]         → Group tour detail + checkout
/hotels/[slug]             → Hotel detail + checkout
/packages/[slug]           → Package detail
```

## Design System (see DESIGN_SYSTEM.md for full spec)

### Colors — use CSS variables, NEVER hardcode hex
```
--primary / --primary-hover / --primary-light / --primary-muted / --primary-deep
--text-primary / --text-secondary / --text-tertiary / --text-inverse
--bg-primary / --bg-subtle / --bg-elevated / --bg-dark / --bg-darker
--border-default / --border-strong
--success / --warning / --error / --info / --whatsapp
```

### Dark Mode
- Theme toggle in navbar, persisted to localStorage
- `[data-theme="dark"]` on `<html>` flips all CSS variables
- Flash prevention inline `<script>` in `<head>` (Server Component — React 19 warns once, benign)
- **On-dark sections** (tours, destinations, reviews, video, footer) use:
  ```
  --on-dark / --on-dark-secondary / --on-dark-tertiary
  --on-dark-glass / --on-dark-glass-hover / --on-dark-border
  ```

### Rules
1. **No hardcoded colors** — always `var(--token)` or `text-[var(--token)]`
2. **No `bg-white`** — use `bg-[var(--bg-primary)]` or `bg-[var(--bg-elevated)]`
3. **No `text-white` on dark sections** — use `text-[var(--on-dark)]`
4. **SVG strokes** — use `stroke="var(--primary)"`, never hex
5. **Radius: only 4 values** — 8px, 12px, 16px, 9999px
6. **Shadows: multi-layer** — use `var(--shadow-sm/md/lg/xl)`
7. **Motion: Airbnb curve** — `cubic-bezier(0.2, 0, 0, 1)`, 150/250/400ms

## Images
- All hero images served from `traversepakistan.com/wp-content/uploads/`
- `images.unoptimized: true` in next.config.ts (WordPress SSL cert issue)
- Use `next/image` with `sizes` prop
- Do NOT use Google Drive, Supabase Storage, or other hosts for hero images — keep everything on the WordPress CDN

## Tours Data Model
Each tour has `pricing: { islamabad, lahore, singleSupplement }` (dual city pricing).

## Branches
- `main` — production
- `backend-testing` — Supabase migration work
- `tweaks` — frontend UI changes

## Commands
```bash
npm run dev     # Dev server on :3000
npm run build   # Production build (351 pages)
npm run lint    # ESLint
```

## Brand
- Traverse Pakistan — Pakistan's highest-rated tourism company
- 4.9★ across 1,300+ reviews, TripAdvisor Travelers' Choice 2025
- Phone: +92-321-6650670
- WhatsApp: 923216650670
- Office: E-11/1, Islamabad
