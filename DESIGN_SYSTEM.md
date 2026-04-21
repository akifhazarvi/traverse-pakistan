# Design System v2.3

> Nature-first travel story. One font. No emojis. Restraint = premium.
> All values live in [src/app/globals.css](src/app/globals.css) — read that file for canonical values. This doc is a **map**, not a copy.

## First Principles

1. **No hardcoded colors** — always `var(--token)` or `text-[var(--token)]` / `bg-[var(--token)]`. The only exception: `bg-black/NN` and `border-white/NN` when composited **over a photograph** (these act as photo overlays, not theme surfaces).
2. **No emojis anywhere** — content cards, empty states, chips, data files. Use `<Icon name="..." />`.
3. **No inline `<svg>`** — use `<Icon name="..." />`. All new icons go in [src/components/ui/Icon.tsx](src/components/ui/Icon.tsx).
4. **Use tokens, not magic numbers** — `rounded-[var(--radius-md)]` not `rounded-[12px]`; `duration-[var(--duration-normal)]` not `duration-300`.
5. **Dark sections use `--on-dark-*` tokens**, never `text-white` / `bg-white`.

## Tokens — Color

Brand palette is emerald + Himalayan terracotta. Every token has a light + dark value.

| Purpose | Tokens |
|---------|--------|
| **Primary** (emerald) | `--primary`, `--primary-hover`, `--primary-light`, `--primary-muted`, `--primary-deep` |
| **Accent** (sunset terracotta — urgency, sale badges) | `--accent-warm`, `--accent-warm-hover`, `--accent-warm-light` |
| **Text** | `--text-primary`, `--text-secondary`, `--text-tertiary`, `--text-inverse` |
| **Backgrounds** | `--bg-primary`, `--bg-subtle`, `--bg-elevated`, `--bg-dark`, `--bg-darker` |
| **On-dark** (for sections on dark bg — works in both themes) | `--on-dark`, `--on-dark-secondary`, `--on-dark-tertiary`, `--on-dark-border`, `--on-dark-glass`, `--on-dark-glass-hover` |
| **Borders** | `--border-default`, `--border-strong`, `--border-focus` |
| **Semantic** | `--success`, `--warning`, `--error`, `--info`, `--whatsapp` |
| **Rating gold** (reserved for star icons on hero photography) | `--rating-gold` |
| **Seasonal tints** (SeasonCard) | `--season-{spring,summer,autumn,winter}-{bg,fg,ring}` |

## Tokens — Type

Plus Jakarta Sans. Fluid scale, all `clamp()`:
`--text-xs` · `--text-sm` · `--text-base-sm` · `--text-base` · `--text-lg` · `--text-xl` · `--text-2xl` · `--text-3xl` · `--text-4xl` · `--text-5xl` · `--text-hero`

**Rules:** negative tracking on headings (`-0.025em`); positive tracking on ALL CAPS (`+0.08em`–`+0.18em`); weight 500 UI, 600 bolder UI, 700 headings, 800 hero.

## Tokens — Layout & Motion

| Category | Tokens |
|----------|--------|
| **Radius** (only 4 values) | `--radius-sm` (8px), `--radius-md` (12px), `--radius-lg` (16px), `--radius-full` (9999px) |
| **Shadows** (multi-layer) | `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl` |
| **Motion — easing** | `--ease-default` (Airbnb cubic-bezier), `--ease-spring` |
| **Motion — duration** | `--duration-fast` (150ms), `--duration-normal` (250ms), `--duration-slow` (400ms) |

## Iconography

| Concern | Rule |
|---------|------|
| Source | [`@phosphor-icons/react`](https://phosphoricons.com/) only, via the `<Icon>` wrapper |
| Stroke weight | `weight="regular"` for 98% of uses; `"bold"` only for tiny inline checks; `"fill"` for filled stars / hearts; `"duotone"` for half-stars |
| Size scale | `xs=12`, `sm=14`, `md=16`, `lg=20`, `xl=24`, `2xl=28`, `3xl=32` — pass a token, never a raw number unless unavoidable |
| Color | Default `currentColor`; for fixed colors pass a CSS var (`color="var(--primary-muted)"`), never a hex |
| Adding a new icon | Import in [Icon.tsx](src/components/ui/Icon.tsx), add to `iconMap`, done. One file to change |
| Emojis | **Never** — in data, chips, or empty states |

## Seasonal Tint Pattern

`SeasonCard` picks tint + icon purely from `season`:
- spring → `flower` + rose tint
- summer → `sun` + amber tint
- autumn → `leaf` + copper tint
- winter → `snowflake` + slate tint

Don't store these mappings in data. Derive in the renderer.

## Components — UI primitives

Path: [src/components/ui/](src/components/ui/)

| Component | Purpose |
|-----------|---------|
| `Icon` | Canonical icon renderer — see above |
| `Button` | `primary` / `secondary` / `outline` / `ghost` / `white` × `sm/md/lg/icon`; hover lifts 1px + shadow bloom; active press `scale(0.98)` |
| `Chip` | Pill label with optional icon slot |
| `Badge` | Tour/package status badges |
| `StarRating` | 5-star row with fill/regular/duotone weights for full/empty/half |
| `SectionHeader` | `title` + optional `eyebrow`, `subtitle`, `linkText/Href`, `center`, `light` |
| `EyebrowLabel` | Uppercase editorial kicker (`0.18em` tracking) |
| `EmptyState` | Icon in soft emerald circle + title + description + action slot |
| `Reveal` | `IntersectionObserver`-based rise-on-enter wrapper (respects `prefers-reduced-motion`) |
| `Container` | Responsive max-width wrapper with `wide` variant |
| `Accordion` | Accessible disclosure list |
| `Carousel` | Horizontal scroll carousel with snap + arrow controls |

## Components — Destination layer

Path: [src/components/destination/](src/components/destination/)

| Component | Purpose |
|-----------|---------|
| `DestinationStory` | Eyebrow + dotted travelogue rule + italic opening pull-quote + prose — the narrative "about" section |
| `MomentCard` | Replaces the old "Why Visit" tile. Left-aligned, icon in soft circle, hover lift |
| `SeasonCard` | Seasonal tint-driven card: icon derives from season name, colors from `--season-*` tokens |

## Patterns

- **Image overlay for text-over-photo:** gradient `from-black/80 via-black/30 to-transparent` + `textShadow`
- **Card hover (images):** image `scale(1.03–1.06)` over 500–700ms; card lifts `-translate-y-1`
- **Button hover:** `-translate-y-[1px]`, shadow upgrade `xs→md`, `active:translate-y-0 active:scale-[0.98]`
- **Icon accompanying metric** (e.g. `4.9 ★`): inline-flex, gap `1–1.5`, star uses `weight="fill"` + `color="var(--rating-gold)"` on photography, `"var(--primary-muted)"` on theme surfaces

## Authoring checklist (before committing UI changes)

- [ ] No emojis (search your diff for `[\u{1F300}-\u{1F9FF}]`, `[\u{2600}-\u{27BF}]`)
- [ ] No hex colors (search your diff for `#[0-9A-Fa-f]{3,6}`)
- [ ] No inline `<svg>` (use `<Icon>`)
- [ ] No raw `px` radius (use `var(--radius-*)`)
- [ ] No raw durations like `duration-300` (use `var(--duration-*)`)
- [ ] No `text-white`/`bg-white` except overlaid on photography (use `--on-dark` / `--bg-primary`)
- [ ] Dark-mode verified by toggling `data-theme="dark"`
