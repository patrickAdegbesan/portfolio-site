# DESIGN.md — mr-path.site

The single design-system document for this portfolio. If a page needs something this file does
not cover, add it here first, then build it.

## Direction: Shade

**Thesis:** *Software built for the conditions it runs in.* Patrick's strongest work is shaped by
local constraints: card terminals at a food counter, a shop that keeps selling when the network
drops, money that must be accounted for to the kobo. The visual language borrows from Nigerian
tropical modernism, specifically the brise-soleil (sun-shading fins and pierced screens) of the
1950s University of Ibadan campus, where the climate shapes the architecture. The
reference is architectural and regional, not ethnic: no traditional symbols, patterns or motifs are
used, and none should be added.

The one memorable device is the **fin**: evenly spaced vertical bars (`.fins`) that appear as a
divider band and behind the hero screenshots. Everything else stays quiet.

## Colour

| Token | Hex | Role |
|---|---|---|
| `--slab` | `#ECEAE4` | Page background (light) |
| `--concrete` | `#DAD7CF` | Raised panels, table stripes |
| `--shadow` | `#23272A` | Body text; background of the dark "shade" sections |
| `--foliage` | `#2E5B47` | Links on light backgrounds, availability |
| `--sun` | `#E3A82B` | The single accent: primary button, "Condition" rule, links and focus on dark |
| `--muted` | `#5E625F` | Secondary text on light (5.2:1 on slab) |
| `--line` | `#BDB9AF` | Hairlines on light |
| `--shade-text` | `#E3E1DA` | Body text on dark |
| `--shade-muted` | `#AEB2AD` | Secondary text on dark (6.9:1 on shadow) |
| `--shade-line` | `#3B4144` | Hairlines on dark |

Rules: sun is never used for body text on light backgrounds (fails contrast). Never add gradients,
glass, glows or a second accent colour.

## Type

One family: **Archivo** (Omnibus-Type, SIL OFL), self-hosted as a single variable WOFF2 with
`wght 400–800` and `wdth 100–125` (`assets/fonts/`). Width is the expressive axis:

| Use | Size | Weight | Width |
|---|---|---|---|
| Display (hero h1) | `clamp(2.4rem, 6.2vw, 5.6rem)`, line-height .95 | 800 | 125% |
| h2 | `clamp(1.8rem, 3.4vw, 2.8rem)` | 800 | 125% |
| h3 / project names | `clamp(1.5rem, 2.4vw, 2.1rem)` | 800 | 118% |
| Body | `1.0625rem` / 1.6 | 400 | 100% |
| Small / captions | `.875rem` | 400 | 100% |

No all-caps labels, no monospace, no italics for emphasis. Body measure ≤ 68ch.

## Layout

- Container `max-width: 1320px`, gutter `clamp(16px, 4vw, 56px)`.
- 12-column grid on wide screens; single column below 860px.
- Left-aligned throughout. No centred hero.
- Section rhythm: `--space-section: clamp(56px, 8vw, 96px)`.
- No rounded cards. Corners are square; separation is done with rules and the light/dark slab change.

## Components

- **Header:** name (wide 800) + 4 links. Wraps to two lines on small screens; never hidden behind a menu button.
- **Buttons:** `.btn` (2px ink border) and `.btn.sun` (filled). Minimum target 44×44px.
- **Project entry (`.proj`):** name, one-line description, *Condition* (sun rule), a credits `dl`
  (Engagement / My part / Status), link to the case study, and real screenshots.
- **Credits `dl`:** every project states what Patrick did and where it stands. Unknown → say "not confirmed" rather than guess.
- **Figure captions:** every screenshot says what it shows and whether data is test/demo data.
- **Archive table (`.archive`):** a real `<table>` for smaller projects; scrolls horizontally inside its own wrapper on phones.

## Motion

One orchestrated moment only: on first paint the hero screenshots rise into place in sequence
(opacity + 12px translate, 520ms, `--ease-out: cubic-bezier(.23,1,.32,1)`, 70ms stagger). It runs only under
`prefers-reduced-motion: no-preference`; content is fully visible without it. No scroll-triggered
reveals, cursor effects, loaders, marquees, autoplay video or parallax. Hover changes are
colour/underline only, and every hover affordance also exists on focus.

## Accessibility floor

WCAG 2.2 AA target: visible `:focus-visible` outline (ink on light, sun on dark, 3px, 3px offset),
skip link, landmarks, one h1 per page, alt text on every content image, `width`/`height` on every
`<img>` to prevent layout shift, no information conveyed by colour alone.

## Content rules (honesty)

1. No employment titles that were not salaried employment. Engagement is described as it was
   (freelance client, team product, take-home assessment, hackathon entry).
2. No metrics copied from product marketing sites (user counts, ratings, testimonials).
3. Hackathons are listed by outcome: participated / finalist / placed. Only placements with a source.
4. Demo data (e.g. SkillGraph persona and match percentages) is labelled as demo data and never used as a credential.
5. Features that are not built are not shown, or are labelled "not built yet".
6. Anything awaiting Patrick's confirmation carries `data-confirm="…"` in the HTML so it can be found with `grep -rn data-confirm`.
