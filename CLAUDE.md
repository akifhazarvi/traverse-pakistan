# Traverse Pakistan — AI Agent Instructions

Tourism booking platform for traversepakistan.com.
**Stack:** Next.js 15 App Router · TypeScript strict · Tailwind v4 · Plus Jakarta Sans · Supabase (Phase 2) · Vercel.

---

## Non-negotiable rules

1. **No emojis** anywhere — data files, chips, empty states, headings. Use `<Icon>`.
2. **No hex colors** — always `var(--token)`. See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
3. **No inline `<svg>`** — icons go through [`<Icon>`](src/components/ui/Icon.tsx).
4. **No `bg-white` / `text-white`** on theme surfaces — use `--bg-primary` / `--on-dark`. Exception: overlays `bg-black/NN` on photographs.
5. **Only 4 radius values:** 8 / 12 / 16 / 9999px via `--radius-{sm,md,lg,full}`.
6. **Motion tokens** — `--duration-fast/normal/slow`, `--ease-default` (Airbnb curve). No `duration-300`.
7. **Services are async** — components import from `src/services/*.service.ts`, never from `src/data/*` directly.

---

## File map — where things live

### Routes & pages
- [src/app/](src/app/) — App Router pages
- Destination detail: [src/app/destinations/[slug]/page.tsx](src/app/destinations/[slug]/page.tsx)
- Tour detail: [src/app/grouptours/[slug]/page.tsx](src/app/grouptours/[slug]/page.tsx)
- Package detail: [src/app/packages/[slug]/](src/app/packages/[slug]/)
- Hotel detail: [src/app/hotels/[slug]/page.tsx](src/app/hotels/[slug]/page.tsx)

### UI primitives → [src/components/ui/](src/components/ui/)
`Icon`, `Button`, `Chip`, `Badge`, `StarRating`, `SectionHeader`, `EyebrowLabel`, `EmptyState`, `Reveal`, `Container`, `Carousel`, `Accordion`, `FilterTag`, `PriceDisplay`, `WishlistButton`.

### Domain components
- [src/components/destination/](src/components/destination/) — `DestinationStory`, `MomentCard`, `SeasonCard`
- [src/components/home/](src/components/home/) — homepage sections (`HeroSection`, `WhyUsSection`, `StatsBar`, `DestinationsScroll`, `FeaturedHotels`, `VideoStories`, `ReviewsCarousel`)
- [src/components/tours/](src/components/tours/) — `TourCard`, booking success
- [src/components/packages/](src/components/packages/) — package card, detail, itinerary, booking sidebar
- [src/components/hotels/](src/components/hotels/) — hotel listing, detail, sidebar, checkout
- [src/components/trip-detail/](src/components/trip-detail/) — `MosaicGallery`, `BookingSidebar`, `ItineraryAccordion`
- [src/components/booking/](src/components/booking/) — wizard, trust strip, urgency, FAQ, review quote, mobile reserve bar
- [src/components/layout/](src/components/layout/) — `Navbar`, `Footer`, `Breadcrumb`, `ThemeToggle`, `WhatsAppFAB`, `AwardStrip`, `NavSearchBar`
- [src/components/auth/](src/components/auth/) · [src/components/admin/](src/components/admin/) · [src/components/account/](src/components/account/) · [src/components/seo/](src/components/seo/) · [src/components/quote/](src/components/quote/)

### Data / services / types
- [src/data/](src/data/) — TS data (destinations, tours, regions, hotels, reviews, blog, travel-styles, faqs, packages, itinerary)
- [src/services/](src/services/) — `*.service.ts`, async. Phase 2: swap body to Supabase, components stay
- [src/types/](src/types/) — TS interfaces. `WhyVisitCard.icon` is typed as `IconName` (from `Icon.tsx`)
- [src/lib/](src/lib/) — `utils.ts` (cn, formatPrice, slugify, getWhatsAppUrl), `constants.ts`, `supabase/`, `seo/`
- [src/styles/fonts.ts](src/styles/fonts.ts) — Plus Jakarta Sans

---

## Common tasks → file to open

| Task | Open |
|------|------|
| Add a new icon | [Icon.tsx](src/components/ui/Icon.tsx) — import + add to `iconMap` |
| Add a new destination | [src/data/destinations.ts](src/data/destinations.ts) — use `IconName` tokens, include `opening` |
| Change brand color | [src/app/globals.css](src/app/globals.css) — update the token, both light + dark blocks |
| Add a section header with eyebrow | Use `<SectionHeader eyebrow="..." title="..." />` |
| Empty state | Use `<EmptyState icon="..." title="..." description="..." action={...} />` |
| Add a seasonal tint | Already derived in [SeasonCard.tsx](src/components/destination/SeasonCard.tsx) from `season` name — don't add per-destination |
| Scroll-reveal wrap | `<Reveal delayMs={60}>…</Reveal>` (respects `prefers-reduced-motion`) |

---

## Authoring checklist before committing UI

- No emojis in diff (`rg '[\u{1F300}-\u{1F9FF}]'`)
- No hex in diff (`rg '#[0-9A-Fa-f]{3,6}\b'`)
- No new inline `<svg>` (`rg '<svg' src/`)
- Toggled `data-theme="dark"` and verified
- `npm run build` passes

---

## Commands

```bash
npm run dev    # Dev server (Turbopack) on :3000
npm run build  # Production build, static-generates ~80 pages
npm run lint   # ESLint
```

---

## Brand quick-ref

- Pakistan's highest-rated tourism company — 4.9 ★ · 1,300+ reviews · TripAdvisor Travelers' Choice 2025
- Phone `+92-321-6650670` · WhatsApp `923216650670` · Office E-11/1, Islamabad
- Image host: `https://traversepakistan.com/wp-content/uploads/` (`images.unoptimized: true` in [next.config.ts](next.config.ts) due to upstream SSL)
