# Design System v2.2

> Airbnb-inspired. Photography-first. One font. Restraint = premium.

## Colors

All colors via CSS variables in `src/app/globals.css`. Light + dark mode via `[data-theme="dark"]`.

### Primary
| Token | Light | Dark |
|-------|-------|------|
| `--primary` | `#2D6A5E` | `#4ECDB4` |
| `--primary-hover` | `#235449` | `#3CB89F` |
| `--primary-light` | `#E8F5F1` | `#14302A` |
| `--primary-muted` | `#7BC8A4` | `#5DD9BE` |
| `--primary-deep` | `#1A3F37` | `#0C1F1B` |

### Text
| Token | Light | Dark |
|-------|-------|------|
| `--text-primary` | `#1A1A1A` | `#EAEAEA` |
| `--text-secondary` | `#555555` | `#999999` |
| `--text-tertiary` | `#8A8A8A` | `#5E5E5E` |
| `--text-inverse` | `#FFFFFF` | `#0D1B19` |

### Backgrounds
| Token | Light | Dark |
|-------|-------|------|
| `--bg-primary` | `#FFFFFF` | `#0D1B19` |
| `--bg-subtle` | `#F5F5F4` | `#132422` |
| `--bg-elevated` | `#FFFFFF` | `#1A332F` |
| `--bg-dark` | `#1A2E2B` | `#091311` |
| `--bg-darker` | `#0F2220` | `#060E0C` |

### On-Dark (for dark background sections)
| Token | Light | Dark |
|-------|-------|------|
| `--on-dark` | `#FFFFFF` | `#EAEAEA` |
| `--on-dark-secondary` | `rgba(255,255,255,0.72)` | `rgba(234,234,234,0.65)` |
| `--on-dark-tertiary` | `rgba(255,255,255,0.45)` | `rgba(234,234,234,0.35)` |
| `--on-dark-glass` | `rgba(255,255,255,0.06)` | `rgba(234,234,234,0.04)` |
| `--on-dark-glass-hover` | `rgba(255,255,255,0.10)` | `rgba(234,234,234,0.08)` |
| `--on-dark-border` | `rgba(255,255,255,0.10)` | `rgba(234,234,234,0.08)` |

### Semantic
`--success` `--warning` `--error` `--info` `--whatsapp`

## Typography

**Font:** Plus Jakarta Sans (400, 500, 600, 700, 800)

| Size | Fluid Range | Use |
|------|-------------|-----|
| `--text-xs` | 11-12px | Labels, badges, uppercase |
| `--text-sm` | 12-13px | Meta, timestamps |
| `--text-base` | 15-16px | Body text |
| `--text-lg` | 17-18px | Lead text, subtitles |
| `--text-xl` | 18-20px | Card titles |
| `--text-4xl` | 30-38px | Section headings |
| `--text-hero` | 40-64px | Hero display |

**Rules:** Negative tracking on headings (`-0.025em`). Positive tracking on ALL CAPS (`+0.08em`). Weight 500 for UI, 700 for headings, 800 for hero.

## Spacing
4px grid, 8px primary unit. Section padding: 48px mobile, 64px tablet, 80px desktop.

## Radius (only 4 values)
`8px` buttons/inputs | `12px` cards/modals | `16px` galleries | `9999px` pills

## Shadows (multi-layer)
`--shadow-sm` cards at rest | `--shadow-md` card hover | `--shadow-lg` modals | `--shadow-xl` lightbox

## Motion
Easing: `cubic-bezier(0.2, 0, 0, 1)`. Durations: 150ms hover, 250ms transitions, 400ms reveals.

## Key Patterns
- **No hardcoded colors** — always CSS variables
- **No `bg-white`** — use `var(--bg-primary)`
- **Dark sections** use `--on-dark-*` tokens, never `text-white`
- **Image overlays:** `from-black/80 via-black/30 to-transparent` + `textShadow` for readability
- **Card hover:** `-translate-y-1` + shadow upgrade, 350ms
- **Image hover:** `scale(1.03-1.06)`, 500-700ms
