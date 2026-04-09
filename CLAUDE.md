# Traverse Pakistan — AI Agent Instructions

## What This Is
Tourism booking platform for traversepakistan.com. Next.js 15 App Router + TypeScript + Tailwind CSS v4. Phase 1 = frontend with local TS data. Phase 2 = Supabase backend.

## Stack
- Next.js 15 (App Router, `src/` dir)
- TypeScript strict
- Tailwind CSS v4 (via `@theme inline` in globals.css)
- Plus Jakarta Sans (single font, weights 400-800)
- Deployed on Vercel

## Architecture

### Data Flow
```
src/data/*.ts (local TS) → src/services/*.service.ts (async) → components
```
All service functions are `async` — swap bodies to Supabase in Phase 2, zero component changes.

### Key Directories
```
src/app/          → Pages (App Router)
src/components/   → UI: layout/, home/, tours/, trip-detail/, destination/, blog/, reviews/, ui/
src/data/         → 22 tours, 8 destinations, 5 regions, 9 hotels, 8 reviews, 6 blog posts
src/services/     → Data access layer (tour, destination, region, review, blog, hotel)
src/types/        → TypeScript interfaces
src/lib/          → utils.ts (cn, formatPrice, slugify, getWhatsAppUrl), constants.ts
src/styles/       → fonts.ts (Plus Jakarta Sans only)
```

### Routes (84 pages)
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
/booking/[tourSlug]        → Booking shell (Phase 2)
/account/*                 → Account shells (Phase 2)
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
- Flash prevention script in `<head>`
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
- All from `traversepakistan.com/wp-content/uploads/`
- `images.unoptimized: true` in next.config.ts (SSL cert issue)
- 109 verified URLs, zero 404s
- Use `next/image` with `sizes` prop

## Tours Data Model
Each tour has `pricing: { islamabad, lahore, singleSupplement }` (dual city pricing).

## Commands
```bash
npm run dev     # Dev server on :3000
npm run build   # Production build (84 pages)
npm run lint    # ESLint
```

## Brand
- Traverse Pakistan — Pakistan's highest-rated tourism company
- 4.9★ across 1,300+ reviews, TripAdvisor Travelers' Choice 2025
- Phone: +92-321-6650670
- WhatsApp: 923216650670
- Office: E-11/1, Islamabad
