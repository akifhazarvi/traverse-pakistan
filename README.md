# Traverse Pakistan

Pakistan's highest-rated tourism platform. Built with Next.js 15, TypeScript, and Tailwind CSS.

**Live:** [traversepakistan.com](https://traversepakistan.com) | **Rating:** 4.9/5 (1,300+ reviews) | **Award:** TripAdvisor Travelers' Choice 2025

---

## Quick Start

```bash
git clone https://github.com/akifhazarvi/traverse-pakistan.git
cd traverse-pakistan
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | Plus Jakarta Sans |
| Images | traversepakistan.com CDN |
| Deploy | Vercel |

## Project Structure

```
src/
  app/            84 pages across 10 route groups
  components/     50+ components (layout, home, tours, trip-detail, ui)
  data/           22 tours, 8 destinations, 9 hotels, 8 reviews
  services/       Async data access (swap to Supabase in Phase 2)
  types/          TypeScript interfaces
  lib/            Utilities (cn, formatPrice, slugify)
  hooks/          useScrollReveal
  styles/         Font config
```

## Features

### Phase 1 (Current)
- 22 tour packages with dual pricing (Islamabad/Lahore)
- 8 destinations across 5 regions
- Airbnb-style search widget with destination/date/traveler pickers
- Trip detail pages with mosaic gallery, itinerary accordion, booking sidebar
- Dark mode with system preference detection
- Cinematic video stories section (YouTube theater mode)
- Animated stats counter
- Rotating hero with 5 Pakistan landscapes
- 109 real images from WordPress CDN
- SEO: per-page metadata, sitemap, generateStaticParams
- Mobile responsive with sticky booking bar

### Phase 2 (Planned)
- Supabase backend (zero component changes — swap service bodies)
- User authentication and accounts
- Online booking with payment integration
- Real-time availability
- Admin CMS for tours/blog
- Hotel booking system
- Transport rental system

## Design System

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the full specification. Key principles:

- **Photography first** — images sell, UI serves
- **One font** — Plus Jakarta Sans (400-800 weights)
- **CSS variables** — all colors theme-aware, dark mode built-in
- **4 radius values** — 8px, 12px, 16px, 9999px
- **Multi-layer shadows** — Airbnb-style depth
- **Airbnb motion curve** — `cubic-bezier(0.2, 0, 0, 1)`

## AI Agent Setup

This repo includes [CLAUDE.md](CLAUDE.md) with full context for Claude Code, Cursor, and other AI coding tools. It covers architecture, data flow, design tokens, and rules — so you can prompt efficiently without re-explaining the codebase.

## Commands

```bash
npm run dev       # Development server (localhost:3000)
npm run build     # Production build (84 static pages)
npm run lint      # ESLint
npm run start     # Serve production build
```

## Environment

No environment variables needed for Phase 1. Phase 2 will require:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Brand

**Traverse Pakistan** — One-stop travel booking platform for Pakistan.

- Tours, hotels, transport, custom trips
- 22+ tour packages across 15+ regions
- Office: E-11/1, Islamabad
- Phone: +92-321-6650670
- Instagram: [@traversepakistan](https://instagram.com/traversepakistan) (78K followers)

## License

Private. All rights reserved.
