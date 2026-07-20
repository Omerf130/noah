# Public Assets Audit — Phase 1 Visual Redesign

**Updated:** Phase 1 visual redesign pass  
**Branch:** `phase-1/design-foundation`

## Assets in repository (verified on disk)

| Path | Used for |
|------|----------|
| `/pics/hero.jpeg` | Retired from hero (old cinematic layout) |
| `/pics/hero-new.jpeg` | Available; not currently referenced |
| `/pics/background.jpeg` | Subtle global texture via BackgroundWrapper |
| `/pics/logo.jpeg` | Nav logo |
| `/pics/noa.jpeg` | MeetNoa section + `/about` page |
| `/pics/noabook.jpeg` | Services showcase + `/clinical` hero (BookFrame) |
| `/pics/noaclinic.jpeg` | `/clinical` split section (BookFrame) |
| `/pics/clinical.jpeg` | Available; not currently referenced |

## Booklet image policy

The real booklet images (`noabook.jpeg`, `noaclinic.jpeg`) are used with branded frames (BookFrame component): glow, accent ring, shadow, and responsive cropping — **not** CSS-generated fake products.

## Platform preview mockups

Hero `PlatformPreview` uses **static marketing UI** (progress bar, lesson card, metrics chip) to hint at a future student learning experience. These are decorative only — no backend or live functionality.

## Image direction notes (optional future upgrades)

Documented for client only — **not shown on the public site**:

1. **Founder portrait** — warmer natural light, approachable semi-casual framing
2. **Booklet product** — flat-lay or angled shot with visible brand colors on cover
3. **Hero lifestyle** (optional) — calm study scene, purple/teal grading

## Unused assets

- `/pics/hero-new.jpeg` — candidate for future hero photography swap
- `/pics/clinical.jpeg` — available if preferred over `noaclinic.jpeg`
