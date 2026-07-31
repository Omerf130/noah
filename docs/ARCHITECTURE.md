# Architecture Notes — Phase 1

## Design system

- **Tokens:** SCSS partials in [`styles/`](../styles/) (`_variables`, `_breakpoints`, `_mixins`, `_typography`)
- **Runtime CSS variables:** Exposed via `:root` in [`app/globals.scss`](../app/globals.scss) for components that need CSS custom properties
- **Consumption:** Component SCSS modules use `@use 'variables' as *` via `sassOptions.includePaths` in [`next.config.js`](../next.config.js)
- **Rule:** Do not hardcode brand colors/spacing in new components — use tokens

### Color palette

| Role | Token | Value |
|------|-------|-------|
| Primary | `$color-primary` | `#500889` |
| Secondary | `$color-accent-gold` | `#ffedab` |
| Deep purple | `$color-purple-deep` | `#3a0666` |
| Lavender | `$color-lavender` / `$color-lavender-soft` | `#d4b8f0` / soft tint |
| Amber accent | `$color-amber` / `$color-amber-dark` | `#d4a017` / `#a67c00` |
| Warm surfaces | `$color-gold-tint`, `$color-gold-soft`, `$color-beige`, `$color-surface-warm` | cream / off-white tones |
| Muted | `$color-purple-muted`, `$color-purple-soft` | purple-gray accents |

Sitewide accents use purple + gold family only. The Hero [`PlatformPreview`](../app/components/marketing/PlatformPreview/PlatformPreview.module.scss) retains pinned local teal values so the Hero visual column stays unchanged.

## UI components

- **Location:** [`app/components/ui/`](../app/components/ui/)
- **Philosophy:** Lightweight, Phase-1-focused primitives (Button, Card, Container, SectionTitle, Input, TextArea, ClientMount). No generic render-prop systems.
- **Extension:** New variants added only when a second consumer needs them

## Hydration and browser extensions

Some browser extensions inject attributes (e.g. `fdprocessedid`) onto `<button>`, `<input>`, and `<select>` elements before React hydrates, which causes hydration mismatch warnings in development.

**Approach:** [`ClientMount`](../app/components/ui/ClientMount/ClientMount.tsx) defers rendering of extension-targeted interactive markup (FAQ accordion buttons, Contact form) until after client mount. Section headings remain SSR. We do **not** use `suppressHydrationWarning` for this case.

## Marketing layout

- **Route group:** `app/(marketing)/` — URLs unchanged (`/`, `/about`, `/clinical`, etc.)
- **Shared shell:** Skip link, Nav, `<main id="main-content">`, Footer
- **Root layout:** `app/layout.tsx` keeps html/body, metadata defaults, BackgroundWrapper

## Phase 2 — Content and routes

Static content lives in [`lib/content/`](../lib/content/) (`courses.ts`, `products.ts`, `services.ts`, `contact.ts`). Pages consume data objects so a future MongoDB/Admin swap requires minimal UI changes.

**Canonical routes:** `/`, `/about`, `/courses`, `/courses/pharmaceutical-calculations`, `/products`, `/products/booklet`, `/products/practice-kit`, `/personal-guidance`, `/private-lessons`, `/contact`, `/login`

**Redirects:** `/clinical` → `/products/booklet`, `/private-process` → `/personal-guidance`

**SEO:** [`lib/seo.ts`](../lib/seo.ts) — metadata, canonical, Open Graph, Twitter, JSON-LD helpers per page.

**Contact:** Shared [`ContactSection`](../app/components/marketing/contact/ContactSection/ContactSection.tsx) on homepage embed and `/contact`. Query param `?service=` preselects dropdown. WhatsApp submit — no backend storage.

## SEO / structured data

- Per-page `generateMetadata()` on marketing pages
- `app/sitemap.ts`, `app/robots.ts`
- **JSON-LD:** Only verified business data. See TODO in homepage metadata when address/social URLs are unavailable.

## Out of scope (Phase 1)

MongoDB, auth, admin, store, APIs, email, payments.

## Checkpoint G (admin content blocks)

See [`docs/checkpoint-g-content-blocks.md`](checkpoint-g-content-blocks.md) for the Rich Text admin content block system, transitional legacy rules, and deferred features (video, student rendering, additional block types).
