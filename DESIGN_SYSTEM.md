# Traverse Pakistan — Design System v2.0

> Inspired by Airbnb, Booking.com, G Adventures — built for Pakistan's #1 tourism platform.

---

## Philosophy

**"Invisible luxury."** The UI should never compete with the photography. Pakistan's landscapes ARE the product — our job is to frame them perfectly. Every element earns its place. Color is rare, so it's meaningful. Animation is subtle, so it's trustworthy. Whitespace is generous, so nothing feels cheap.

Three rules:
1. **Photography first** — images sell, UI serves
2. **Restraint signals quality** — fewer colors, fewer fonts, fewer effects = more premium
3. **Trust through consistency** — same radius, same shadows, same spacing everywhere

---

## 1. Typography

### Font: Plus Jakarta Sans (single family)

Like Airbnb (Cereal), TripAdvisor (Trip Sans), and Booking.com (system stack) — we use **one font family** for everything. Differentiation comes from weight, size, and spacing — not multiple typefaces.

```
Font: Plus Jakarta Sans
Weights loaded: 400, 500, 600, 700, 800
Display: swap
Format: Variable font (single request)
```

**Why one font?** Every premium travel platform uses a single font. Multiple fonts signal template sites. One font, mastered, signals intentional design.

### Type Scale (fluid with clamp)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `text-xs` | 11–12px | 600 | 1.5 | +0.08em | Uppercase labels, badges, duration pills |
| `text-sm` | 12–13px | 500 | 1.5 | +0.01em | Meta text, timestamps, "per person" |
| `text-base-sm` | 13–14px | 400–500 | 1.5 | 0 | Nav links, card meta, breadcrumbs |
| `text-base` | 15–16px | 400 | 1.55 | 0 | Body text, descriptions, reviews |
| `text-lg` | 17–18px | 400 | 1.5 | 0 | Lead paragraphs, section subtitles |
| `text-xl` | 18–20px | 700 | 1.25 | −0.01em | Card titles, subsection heads |
| `text-2xl` | 20–24px | 700 | 1.2 | −0.015em | H4, sidebar headings |
| `text-3xl` | 24–30px | 700 | 1.2 | −0.02em | H3, stat numbers |
| `text-4xl` | 30–38px | 700 | 1.15 | −0.025em | H2, section titles |
| `text-5xl` | 36–48px | 800 | 1.1 | −0.025em | H1, page titles |
| `text-hero` | 40–64px | 800 | 1.05 | −0.03em | Hero display text |

### Key Rules

- **Negative letter-spacing on bold headings** (−0.2px to −0.5px) — creates editorial density, like Airbnb
- **Positive letter-spacing on ALL CAPS** (+0.08em minimum) — always
- **`font-variant-numeric: tabular-nums`** on all prices — numbers align in columns
- **Never use weight 300** — too faint on screens, signals weakness
- **500 is the new 400** for UI text — medium weight reads better on modern displays

### Weight Guide

| Weight | Name | When to use |
|--------|------|-------------|
| 400 | Regular | Body paragraphs, descriptions, long-form text |
| 500 | Medium | Nav links, buttons, form labels, card meta |
| 600 | SemiBold | Card titles, prices, sidebar labels, active states |
| 700 | Bold | Section headings (H2–H4), emphasis |
| 800 | ExtraBold | Hero titles, H1, stat numbers |

---

## 2. Color Palette

### The Rule: 95% Neutral, 5% Brand

Like Airbnb, our site should be mostly neutral tones. Brand color appears on CTAs, accents, and key moments — never everywhere.

### Primary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--primary` | `#2D6A5E` | 45, 106, 94 | Primary CTAs, links, active states — darker/richer than before |
| `--primary-hover` | `#235449` | 35, 84, 73 | Hover state |
| `--primary-light` | `#E8F5F1` | 232, 245, 241 | Light backgrounds, selected filter chips |
| `--primary-muted` | `#A5D6A7` | 165, 214, 167 | Stars, success accents, duration pills |

### Neutral Colors (the backbone)

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#1A1A1A` | Headings, primary text (warm near-black, NEVER #000) |
| `--text-secondary` | `#6B6B6B` | Body text, descriptions |
| `--text-tertiary` | `#9B9B9B` | Placeholder, disabled, timestamps |
| `--text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `--bg-primary` | `#FFFFFF` | Page background |
| `--bg-subtle` | `#F7F7F7` | Alternate sections, hover states, inputs |
| `--bg-dark` | `#1A2E2B` | Dark sections (tours, reviews) |
| `--bg-darker` | `#0F2220` | Destinations section, footer |
| `--border-default` | `#E0E0E0` | Card borders, dividers, inputs |
| `--border-strong` | `#B0B0B0` | Active input borders |
| `--border-focus` | `#1A1A1A` | Focused inputs (2px outline) |

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--success` | `#1B873F` | Free cancellation, verified badges, availability |
| `--warning` | `#E8470A` | ON SALE badges, urgency ("3 spots left") |
| `--error` | `#C13515` | Validation errors, sold out |
| `--info` | `#0969DA` | Reserve now/pay later, info chips |
| `--whatsapp` | `#25D366` | WhatsApp buttons |

### Palette Change Summary

| Before | After | Why |
|--------|-------|-----|
| `#3E7A6E` (primary) | `#2D6A5E` | Richer, deeper — more premium, better contrast |
| `#5B5B9E` (secondary purple) | Removed | Purple was competing with teal. One accent color = more premium |
| `#2A2A22` (text) | `#1A1A1A` | Slightly warmer near-black, matches Airbnb's #222 approach |
| `#484840` (text-mid) | `#6B6B6B` | True neutral gray, less muddy |
| `#717168` (text-light) | `#9B9B9B` | Lighter, more consistent gray scale |

---

## 3. Spacing System

### Base: 4px grid (with 8px as primary unit)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon-to-text gaps, fine adjustments |
| `--space-2` | 8px | Small padding, tag gaps |
| `--space-3` | 12px | Input padding (vertical), chip padding |
| `--space-4` | 16px | Card content padding, default gap |
| `--space-5` | 20px | Card padding, between related elements |
| `--space-6` | 24px | Grid gaps, between card groups |
| `--space-8` | 32px | Between content sections |
| `--space-10` | 40px | Card vertical gaps |
| `--space-12` | 48px | Section padding (mobile) |
| `--space-16` | 64px | Section padding (tablet) |
| `--space-20` | 80px | Section padding (desktop) |
| `--space-24` | 96px | Large section padding (desktop) |

### Section Padding

```css
/* Mobile: 48px, Tablet: 64px, Desktop: 80-96px */
.section { padding: 48px 20px; }
@media (min-width: 768px) { .section { padding: 64px 32px; } }
@media (min-width: 1024px) { .section { padding: 80px 64px; } }
```

### Container Widths

| Token | Value | Usage |
|-------|-------|-------|
| `--container-sm` | 680px | Blog content, forms |
| `--container-md` | 1080px | Two-column layouts |
| `--container-lg` | 1200px | Standard page content |
| `--container-xl` | 1400px | Wide layouts (tour grids, carousels) |

---

## 4. Border Radius

### Only 4 values (Airbnb principle)

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 8px | Buttons, inputs, form elements |
| `--radius-md` | 12px | Cards, modals, tooltips, popovers |
| `--radius-lg` | 16px | Gallery images, large cards |
| `--radius-full` | 9999px | Pills, search bar, tags, badges, avatars |

**No 4px, no 6px, no 10px, no 20px.** Four values only. This subconscious consistency is what makes Airbnb feel "designed" vs "assembled."

---

## 5. Shadow System

### Multi-layer shadows (Airbnb signature)

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle elevation, input fields |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1)` | Cards at rest, buttons |
| `--shadow-md` | `rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px, rgba(0,0,0,0.10) 0 4px 12px` | Card hover, elevated elements |
| `--shadow-lg` | `rgba(0,0,0,0.08) 0 1px 4px, rgba(0,0,0,0.15) 0 6px 20px` | Modals, overlays, dropdowns |
| `--shadow-xl` | `rgba(0,0,0,0.08) 0 4px 12px, rgba(0,0,0,0.20) 0 16px 40px` | Lightbox, floating panels |

**Key insight:** Never single-layer shadows. 2–3 layers = natural light. Low opacities (0.02–0.15) = premium. High opacities = cheap.

---

## 6. Animation & Motion

### Easing: Airbnb Curve

```css
--ease-default: cubic-bezier(0.2, 0, 0, 1); /* fast start, gentle decel */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* subtle overshoot */
```

### Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 150ms | Hover states, color changes |
| `--duration-normal` | 250ms | Transitions, accordion, dropdowns |
| `--duration-slow` | 400ms | Page reveals, modals, major transitions |

### Animation Patterns

| Interaction | Animation | Duration |
|-------------|-----------|----------|
| Button hover | Background darken (NOT shadow lift) | 150ms |
| Card hover | `translateY(-2px)` + shadow increase | 250ms |
| Wishlist heart | Scale 1→1.15→1 + fill color | 300ms spring |
| Modal open | Scale 0.95→1 + fade in | 300ms ease |
| Accordion open | Grid rows 0fr→1fr + opacity | 300ms ease |
| Scroll reveal | translateY(16px→0) + opacity 0→1 | 400ms ease |
| Search expand | Height morph + background dim | 300ms ease |
| Carousel slide | Scroll-snap + momentum | Native |
| Skeleton loading | Shimmer gradient pulse | 1.5s infinite |

### Rules
- **Only animate `transform` and `opacity`** — GPU-accelerated, 60fps
- **No bounce effects** — they feel toy-like
- **No spin/rotate** — distracting
- **Subtle > dramatic** — users should barely notice animations consciously

---

## 7. Component Patterns

### Tour Card (the most important component)

```
┌─────────────────────────┐
│  [Image - 3:2 ratio]    │ ← 12px radius top corners
│  [Badge] top-left       │ ← "ON SALE" / "EPIC TREK"
│  [Heart] top-right      │ ← Wishlist toggle
│  [Duration pill] bottom │ ← "5 days" with clock icon
├─────────────────────────┤
│  CATEGORY (11px caps)   │ ← text-primary-muted, tracking +0.08em
│  Tour Name (18px bold)  │ ← 2 lines max, clamp
│  📍 Route (13px)        │ ← text-tertiary
│  ★ 4.9 (214)            │ ← star + rating + count
│  ─────────────────────  │ ← subtle divider
│  Rs 47,000 ~~55,000~~   │ ← price with strikethrough
│  per person             │ ← text-tertiary
│  ✓ Free cancellation    │ ← --success green, 12px
└─────────────────────────┘
```

**Key additions from research:**
- ✓ Free cancellation badge (Booking.com's #1 converter)
- ★ Rating directly on card (all 3 platforms do this)
- "5 spots left" urgency text in --warning color

### Search Widget (Airbnb pattern)

- Collapsed: pill shape, 48px height, border + subtle shadow
- 3 sections with 1px vertical dividers
- Circular search button (right), primary color
- Expanded: background overlay dims page, fields expand
- Transition: 300ms cubic-bezier(0.2, 0, 0, 1)

### Booking Sidebar (TripAdvisor + Airbnb hybrid)

- Sticky at top: 120px (below navbar)
- 12px radius, shadow-sm at rest, shadow-md on scroll
- Price prominently at top (24px, weight 700)
- Star rating below price
- Date picker: inline calendar grid
- Traveler stepper: +/− buttons with constraints
- CTA: full-width, primary color, 52px height, 8px radius
- Trust signals: checkmarks in --success green
- "Only X spots left" urgency in --warning

---

## 8. Image Treatment

### Aspect Ratios

| Context | Ratio | Notes |
|---------|-------|-------|
| Tour card image | 3:2 | Landscape, matches G Adventures |
| Destination card | 2:3 | Portrait, immersive |
| Blog card | 16:10 | Cinematic |
| Gallery hero | Free | Full mosaic height |
| Travel style grid | 4:3 | Square-ish, grid-friendly |

### Rules
- **`object-fit: cover`** always
- **No filters or color overlays on card images** — let photography shine
- **Gradient overlays** only when text is on top (from-black/60 minimum for WCAG)
- **`loading="lazy"`** on everything below the fold
- **Next.js `<Image>` with `sizes` prop** for responsive loading
- **Hover: scale(1.03)** — subtle, 500ms transition (not 1.05 — too much)

---

## 9. Trust & Conversion Patterns

### Social Proof (show 3x per page minimum)
1. **Stats bar** — "4.9★ · 1,300+ Reviews · 98% Recommend"
2. **On every tour card** — star rating + review count
3. **Review section** — full testimonials with avatars

### Urgency (honest, never fabricated)
- "Next departure: June 15" on cards
- "5 spots remaining" in --warning color
- "Booking closes in 3 days" on detail pages

### Trust Signals
- ✓ Free cancellation (green, on every card)
- ✓ Reserve now, pay later
- ✓ TripAdvisor Travelers' Choice 2025
- ✓ 4.9★ across 1,300+ reviews
- ✓ Verified drivers & guides

---

## 10. Responsive Breakpoints

| Token | Width | Columns |
|-------|-------|---------|
| `mobile` | < 640px | 1 column |
| `tablet` | 640–1024px | 2 columns |
| `desktop` | 1024–1280px | 3 columns |
| `wide` | > 1280px | 4 columns |

### Mobile-Specific Patterns
- Sticky bottom bar: price + CTA (48px height)
- Full-screen search overlay (not inline)
- Bottom sheet modals for filters
- Touch-scrollable carousels with scroll-snap
- Minimum 48px touch targets
- Hamburger nav → full-screen overlay

---

## 11. Dark Section Treatment

For dark-background sections (tours, destinations, reviews):

| Element | Value |
|---------|-------|
| Background | `#1A2E2B` (tours, reviews) or `#0F2220` (destinations) |
| Heading text | `#FFFFFF` |
| Body text | `rgba(255,255,255,0.75)` |
| Muted text | `rgba(255,255,255,0.45)` |
| Card background | `rgba(255,255,255,0.06)` |
| Card border | `rgba(255,255,255,0.10)` |
| Accent text | `#A5D6A7` (green-light) |
| Dividers | `rgba(255,255,255,0.08)` |

---

## Quick Reference Card

```
Font:     Plus Jakarta Sans 400/500/600/700/800
Primary:  #2D6A5E (teal)
Text:     #1A1A1A / #6B6B6B / #9B9B9B
BG:       #FFFFFF / #F7F7F7
Dark BG:  #1A2E2B / #0F2220
Border:   #E0E0E0
Success:  #1B873F
Warning:  #E8470A
Radius:   8px / 12px / 16px / 9999px
Shadow:   Multi-layer, 0.02–0.15 opacity
Ease:     cubic-bezier(0.2, 0, 0, 1)
Grid:     4px base, 8px primary unit
```
