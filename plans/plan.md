# Atlas Report Redesign Plan

## Goal
Finish the premium editorial redesign across all remaining pages/components while preserving every Supabase query, database schema, route, page, and backend integration.

## Scope boundaries
- Redesign covers only `<template>` markup and `<style scoped>` blocks in the files listed below.
- `script setup` logic is frozen unless a missing UI-only ref is required.
- `app.css` tokens are the single source of truth for colors, radii, and shadows. Do not hard-code values in component styles.
- Do not remove or replace Supabase, database schemas, auth, routes, pages, or backend logic.

## In scope
- `app/pages/index.vue` already redesigned — do not touch.
- `app/pages/news/[id].vue`
- `app/pages/auth.vue`
- `app/pages/forgot-password.vue`
- `app/pages/profile.vue`
- `app/pages/admin/newsletter.vue`
- `app/pages/community.vue`
- `app/pages/community/profile/[id].vue`
- `app/pages/search.vue`
- `app/pages/archives.vue`
- `app/pages/contact.vue`
- `app/pages/terms.vue`
- `app/pages/privacy.vue`
- `app/pages/about.vue`
- `app/pages/unsubscribe.vue`
- `app/components/CommunityPostCard.vue`
- `app/components/CreateCommunityPost.vue`
- `app/components/CommentsSection.vue`
- `app/components/PostComments.vue`
- `app/components/NewsletterSubscribe.vue`

## Out of scope (preserve as-is)
- `app/app.css`
- `app/layouts/default.vue`
- `app/components/header.vue`
- `app/components/footer.vue`
- `app/app.vue`
- `app/components/GlobalNavbar.vue`
- All `supabase.from(...)` queries, table schemas, RLS policies
- All route paths in `pages/`
- `nuxt.config.ts`, `.env`, PWA config

## Actual theme tokens (from `app.css`)
| Token | Value |
|---|---|
| `--color-bg` | `#FFFFFF` |
| `--color-bg-alt` | `#FAFBFC` |
| `--color-bg-muted` | `#F3F4F6` |
| `--color-text` | `#0F172A` |
| `--color-text-secondary` | `#4B5563` |
| `--color-text-muted` | `#9CA3AF` |
| `--color-border` | `#E5E7EB` |
| `--color-border-light` | `#F3F4F6` |
| `--color-accent` | `#2563EB` |
| `--color-accent-hover` | `#1D4ED8` |
| `--color-accent-subtle` | `rgba(37, 99, 235, 0.06)` |
| `--color-accent-light` | `rgba(37, 99, 235, 0.12)` |
| `--color-card-bg` | `#FFFFFF` |
| `--color-input-bg` | `#FFFFFF` |
| `--color-input-border` | `#E5E7EB` |
| `--color-header-bg` | `rgba(255, 255, 255, 0.88)` |
| `--color-footer-bg` | `#FAFBFC` |
| `--color-overlay` | `rgba(15, 23, 42, 0.56)` |
| `--color-success` | `#10B981` |
| `--color-error` | `#EF4444` |
| `--color-warning` | `#F59E0B` |
| `--shadow-xs` | `0 1px 2px 0 rgba(0, 0, 0, 0.02)` |
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.02), 0 1px 3px 0 rgba(0, 0, 0, 0.04)` |
| `--shadow-base` | `0 1px 3px 0 rgba(0, 0, 0, 0.03), 0 4px 12px -2px rgba(0, 0, 0, 0.02)` |
| `--shadow-md` | `0 4px 16px -4px rgba(0, 0, 0, 0.05), 0 8px 24px -8px rgba(0, 0, 0, 0.03)` |
| `--shadow-lg` | `0 12px 40px -10px rgba(0, 0, 0, 0.06), 0 16px 48px -16px rgba(0, 0, 0, 0.04)` |
| `--shadow-xl` | `0 20px 60px -12px rgba(0, 0, 0, 0.08), 0 24px 64px -20px rgba(0, 0, 0, 0.06)` |
| `--shadow-accent` | `0 4px 14px rgba(37, 99, 235, 0.2)` |
| `--radius-sm` | `0.5rem` |
| `--radius-base` | `0.75rem` |
| `--radius-lg` | `1rem` |
| `--radius-xl` | `1.25rem` |
| `--radius-2xl` | `1.5rem` |

## Design constraints
- Use existing `atlasreport.png` logo consistently.
- One accent: `#2563EB`.
- Typography: `Playfair Display` for `h1`/`h2`. System sans-serif for body text.
- Light theme base.
- Responsive breakpoints: `640px`, `768px`, `1024px`.
- Honor `prefers-reduced-motion: reduce` from `app.css`.

## Implementation order
1. `news/[id].vue`
2. `auth.vue` + `forgot-password.vue`
3. `profile.vue` + `admin/newsletter.vue` + `community/profile/[id].vue`
4. `community.vue` + `CommunityPostCard.vue` + `CreateCommunityPost.vue`
5. `CommentsSection.vue` + `PostComments.vue`
6. `search.vue` + `archives.vue`
7. `contact.vue` + `about.vue` + `terms.vue` + `privacy.vue` + `unsubscribe.vue` + `NewsletterSubscribe.vue`

## Guardrails
- Do not rename, remove, or restructure any `supabase.from(...)` tables.
- Do not alter route paths in `pages/`.
- Do not delete features (likes, follows, comments, admin checks).
- Do not add new npm packages or external UI libraries.
- Preserve existing data-fetch patterns.
- Keep `app.css` as the single source of truth for theme variables. Replace any hard-coded colors in component styles with theme variables.

## Verification
- Run `npm run lint`.
- Run `npx vue-tsc --noEmit` if available.
- Spot-check responsive breakpoints at `640px`, `768px`, `1024px`.
- Ensure all `img` alt attributes and aria-labels are preserved.

## Risk mitigation
- Scope changes per file only to `<template>` and `<style scoped>`.
- Keep all `script setup` logic identical; only add UI-only refs where needed.
- Use exact old string matches for edits.
- Reuse global utilities (`.form-input`, `.btn`, `.badge`) from `app.css` instead of duplicating them.

## File-specific directives

### `app/pages/news/[id].vue`
- Reading width: `max-width: 720px` for article prose.
- Line height: `1.85` or higher for body text.
- Drop cap or pull quote for summary.
- Author block above or inline with title; compact.
- Hero media: preserve fallback and hover zoom; align radius/shadow to tokens.
- Sidebar: add a TOC helper above story details; sticky only on desktop.
- Share: add Web Share API fallback, then copy URL.
- Related articles: 2–3 cards by category match.
- Responsive: stack sidebar under main at `<=1024px`.

### `app/pages/auth.vue`
- Center auth card on mobile; keep two-column desktop layout; trim brand copy.
- Tabs: larger touch target, subtle shadow when active.
- Inputs: unified `.form-input` focus ring.
- Session status: compact row below form; hidden by default on mobile.
- Logo centered on mobile.

### `app/pages/profile.vue`
- Sidebar identity card: add accent gradient on left edge; center content.
- Form sections: dividers only between major sections.
- Accent picker and density buttons: active state = border instead of background.
- Success banner at top of main column after saving.

### `app/pages/admin/newsletter.vue`
- Stats cards: flat, monochrome with subtle accent indicators; no hover lift.
- Tabs: match global tab system.
- Tables: zebra-striping on hover, sticky header, rounded corners.
- Compose form: match profile inputs; add character count.
- Back button: ghost link style at top-left.

### `app/pages/community.vue`
- Hero: single row with title, subtitle, stat pills; light border.
- Logged-out state: slim dashed prompt.
- Tabs: underline indicator, no fill.
- Sidebar panels: unified padding `1.25rem` and heading style.
- Modal: centered on `>=640px`; backdrop blur.

### `app/pages/community/profile/[id].vue`
- Profile card: clean banner, avatar, stats, follow/edit actions.
- Edit modal: reuse `.form-input` tokens.
- Posts feed: reuse `CommunityPostCard.vue`.
- Modal comments: centered on `>=640px`; backdrop blur.

### `app/components/CommunityPostCard.vue`
- Card radius: `--radius-xl`; subtle shadow.
- Avatar: `2rem`; tighter header gap.
- Actions: icon-only buttons + count; uniform `36x36` tap target.
- Follow button: minimal pill when following; red hover-to-unfollow.
- Image expand: `rgba(0,0,0,0.88)` backdrop; scale-in.
- Delete button: `1.5rem` ghost.

### `app/components/CreateCommunityPost.vue`
- Composer: no outer border when collapsed; soft divider instead.
- Inputs: match `.form-input` sizing.
- Toolbar: single row for Media/Cancel/Post; hide Cancel when empty.
- Post button: `.btn btn-primary btn-sm`.

### `app/components/CommentsSection.vue`
- Heading: left accent underline.
- Comment form: small avatar row above textarea.
- Comment items: card style with hover highlight; no border-bottom separator.
- Delete: soft icon button on the right.
- Empty state: centered, reduced padding.

### `app/components/PostComments.vue`
- Match `CommentsSection.vue` style, condensed variant.
- List: fixed max-height with custom scrollbar.
- Reply form: inline input + button using `.form-input`.

### `app/pages/search.vue`
- Search input: icon with animated focus; match global token.
- Category chips: dark active state (`var(--color-text)` bg, white text).
- Result cards: remove heavy hover lift; left accent border on hover; image height `5rem`.

### `app/pages/archives.vue`
- Header: clean serif title; remove heavy gradient background.
- Filters: label + chips in one row; chips match global chip style.
- Archive cards: consistent `3px` left accent border; rounded corners; soft shadow.

### `app/pages/contact.vue`
- Card: subtle top accent border (`3px solid var(--color-accent)`).
- Form rows: match global `.form-row`.
- Success state: top banner inside card.

### `app/pages/terms.vue`
- Narrow text column: `max-width: 720px`.
- Body: `1rem`, line-height `1.8`, secondary text.
- Section titles: compact uppercase label style.

### `app/pages/privacy.vue`
- Mirror `terms.vue` treatment: narrow column, clean typography, no heavy container chrome.

### `app/pages/about.vue`
- Sticky hero area with logo + eyebrow + title.
- Values: 3-column grid on desktop; accent-filled icon circles.
- Body: `max-width: 720px`, improved line-height.
- Remove heavy gradient background; keep clean white with subtle top accent line.

### `app/pages/unsubscribe.vue`
- Match centered auth card treatment from `auth.vue`/`forgot-password.vue`.
- Inputs/buttons use global `.form-input` and `.btn` tokens.
- Loading/success/error states: clean centered states with lifted card.

### `app/components/NewsletterSubscribe.vue`
- Match footer styling with updated tokens.
- Input use `.form-input` where possible; success/error text uses global `.form-success`/`.form-error`.

## Unresolved decision
Dark mode: should the redesign also polish dark mode, keep the toggle as-is, or remove dark mode entirely?
1. Remove dark mode toggle and `.dark` styles entirely. Keeps the redesign focused on one premium light experience.
2. Keep dark mode as-is; accept that some redesigned pages may appear half-upgraded in dark mode until a future pass.
3. Update dark mode tokens in parallel so both themes remain polished.

Recommended: option 1, unless the product explicitly requires dark mode. This keeps the implementation tight and avoids token drift. If the user wants parity, switch to option 3.
