# Atlas Report Redesign Plan — Remaining Work

## Goal
Complete the premium editorial redesign across all remaining pages and components while preserving every Supabase query, database schema, route, page, and backend integration.

## Completed Scope (Do Not Touch)
- `app/app.css`: foundation theme variables, global shadows, scrollbars, skeleton animations.
- `app/layouts/default.vue`: switched to `<NuxtPage />`, skip link.
- `app/components/header.vue`: sticky nav, mobile menu, logo.
- `app/components/footer.vue`: branding + newsletter signup.
- `app/pages/index.vue`: hero, category pills, editorial grids, trending sidebar.

## Remaining Pages + Components

### 1. `app/pages/news/[id].vue`
**Current state:** Functional article detail with hero, meta, body, actions, comments, sidebar details, loading state, fallbacks.
**Redesign actions:**
- Readability: Narrower body text for long-form reading (`max-width: 680px`), increase `line-height` to 1.9, ensure strict color contrast.
- Drop caps or pull quote for the summary/description.
- Author block: Move above hero image or place it inline with title for a more editorial feel; keep avatar + name + date compact.
- Hero media: Keep current behavior (fallback, hover zoom), but align border-radius and shadow with the new system.
- Sidebar: Add a "Table of Contents" helper (static list of H2s from parsed content) and stack it above story details. Make sidebar `position: sticky` only on desktop.
- Share button: Add native Web Share API fallback with copy-to-clipboard.
- Related articles: Replace "Why this matters" card with 2–3 related article cards based on category match.
- Responsive: Stack sidebar under main on tablet (`<=1024px`), keep sticky only above 1024px.
- Typography: Ensure `Playfair Display` loads for `h1` only; all other text remains system sans-serif.

### 2. `app/pages/auth.vue`
**Current state:** Two-column layout with brand panel + auth card, session status.
**Redesign actions:**
- Center the auth card completely on mobile, maintain two-column on desktop but reduce brand copy to essential mission statement.
- Tabs: Increase touch target, add subtle shadow to active state.
- Inputs: Unified `form-input` styling with consistent focus ring.
- Session status: Convert to a collapsed "Session info" row below the form; hide by default on mobile to save space.
- Add inline validation state classes (`.form-input-error` border + helper text) for potential future validation.
- Ensure `atlasreport.png` logo is centered on mobile.

### 3. `app/pages/community.vue`
**Current state:** Hero with stats, create-post composer (conditional), tabs, topic filter, feed, skeleton loaders, sidebar panels, modal comments.
**Redesign actions:**
- Hero: Simplify to a single row with title + subtitle + stat pills; remove heavy gradient background, keep subtle border.
- Create post: If logged out, show a slim dashed prompt instead of an empty card.
- Tabs: Move from accent-fill active state to a pill underline indicator; keep `text-sm`, `font-black`.
- Feed cards: Rely on `CommunityPostCard.vue` redesign; remove duplicate empty states between community.vue and post card.
- Sidebar: Use panel cards with soft shadows, consistent padding (`1.25rem`), and unified heading styles.
- Modal: Replace fixed-bottom mobile sheet with a centered modal above `640px`; use `backdrop-filter: blur(6px)`.

### 4. `app/pages/profile.vue`
**Current state:** Sticky sidebar identity card, two-column layout, profile form + password form.
**Redesign actions:**
- Sidebar identity card: Add subtle gradient border using accent color on left edge; keep avatar + name + headline centered.
- Remove extra `w-full` button styles and rely on `btn btn-secondary w-full` consistently.
- Form sections: Use dividers only between major sections; inside a section, use only vertical spacing.
- Accent picker & density buttons: Uniform chip size, clear active state with border instead of background.
- Add success banner at top of main column after saving.

### 5. `app/pages/admin/newsletter.vue`
**Current state:** Stats grid, tabs, compose form, subscriber table, campaigns table.
**Redesign actions:**
- Stats cards: Remove hover lift (keep flat for admin density), use monochrome with subtle accent indicators.
- Tabs: Match the global tab system used in `index.vue` and `community.vue`.
- Tables: Add zebra-striping on hover, sticky header, rounded corners, border-collapse modern look.
- Compose form: Match profile page input styles exactly. Add character count for content.
- Back button: Keep but style as a ghost link at top-left.

### 6. `app/pages/search.vue`
**Current state:** Header, search input with icon, category chips, results list with hover lift, empty states.
**Redesign actions:**
- Search input: Add search icon with animated focus state; match global input token.
- Category chips: Use the dark active state (`#111827` bg, white text) for consistency.
- Result cards: Remove heavy hover lift, use a left accent border on hover instead; limit image size to `5rem` height.
- Empty states: Keep icon, title, desc, but tighten vertical spacing and max-width.

### 7. `app/pages/archives.vue`
**Current state:** Gradient header, filter bar, archive list with colored left borders, pagination.
**Redesign actions:**
- Header: Replace gradient title with clean serif title; remove heavy gradient background, keep subtle subtitle.
- Filters: Stack label + chips on a single row; chips match global chip style.
- Archive cards: Use a consistent left accent border (`3px`), rounded corners, soft shadow. Remove hover lift.
- Pagination: Underline-style current page instead of filled accent background; keep native buttons.

### 8. `app/pages/contact.vue`
**Current state:** Single centered card, form with two-column row.
**Redesign actions:**
- Card: Add a very subtle top accent border (`3px solid var(--color-accent)`).
- Form rows: Match global `.form-row` spacing and input focus styles.
- Success state: Replace inline paragraph with a top banner inside the card that fades out.

### 9. `app/pages/forgot-password.vue`
**Redesign actions:**
- Match the centered auth card style from `auth.vue` exactly (same radius, shadow, padding).
- Input and button: Use `form-input` and `btn btn-primary btn-lg w-full`.
- Add a small info text below the input: "We'll send a secure link to your inbox."

### 10. `app/pages/terms.vue`
**Redesign actions:**
- Keep as a clean legal reader with narrow text column (`max-width: 720px`).
- Typography: Slightly larger body (`1rem`), relaxed line-height (`1.8`), muted secondary text.
- Section titles: Use compact uppercase label style (`.eyebrow`) for section numbers.
- Remove card border and background; let page background breathe.

### 11. `app/pages/about.vue`
**Redesign actions:**
- Sticky hero area with logo + eyebrow + title; values as a 3-column grid on desktop.
- Values: Replace SVG icon containers with accent-filled circles, tight typography, consistent gaps.
- Body text: Clamp `max-width: 720px`, improved line-height.
- Remove heavy gradient background; keep clean white with subtle top accent line.

### 12. `app/components/CommunityPostCard.vue`
**Redesign actions:**
- Card: Increase border-radius to match `.radius-xl`, add subtle shadow.
- Header: Compress avatar to `2rem`, tighten gap between avatar and meta.
- Actions: Replace text-labeled like/comment/share with icon-only buttons + count; uniform hit area `36x36`.
- Follow button: Switch to a minimal pill when following (.following) with red hover-to-unfollow.
- Image expand: Keep overlay but remove default black; use `rgba(0,0,0,0.88)` and scale-in animation.
- Delete button: Keep ghost style but shrink to `1.5rem`.

### 13. `app/components/CreateCommunityPost.vue`
**Redesign actions:**
- Composer: Remove outer card border when not expanded; show only a soft divider line.
- Input area: Use the same font stack and sizing as `.form-input`.
- Toolbar: Move Media + Cancel + Post into a single row; hide Cancel if post is empty.
- Image preview: Remove remove button border, keep circular remove icon.
- Post button: Use `.btn btn-primary btn-sm`; disabled state should be subtle grayscale.

### 14. `app/components/CommentsSection.vue`
**Redesign actions:**
- Heading: Add a subtle left accent bar under the title.
- Comment form: Add a small avatar row above textarea (read-only); layout matches profile page `.form-row`.
- Comment items: Replace border-bottom separator with a full-width card with hover highlight.
- Delete action: Move to overflow menu or keep as a soft icon button on the right.
- Empty state: Center text, reduced padding.

### 15. `app/components/PostComments.vue`
**Redesign actions:**
- MatchCommentsSection.vue styling but use a condensed variant (`.radius-base`, tighter padding).
- List: Fixed max-height with custom scrollbar thumb.
- Reply form: Input + Post button inline; input uses `.form-input` token.

## Consistency Tokens (in `app.css`)
| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#FFFFFF` | Primary page background |
| `--color-bg-alt` | `#F8F9FA` | Secondary sections |
| `--color-border` | `#E5E7EB` | Default borders |
| `--color-border-light` | `#F3F4F6` | Subtle dividers |
| `--color-text` | `#111827` | Primary headings |
| `--color-text-secondary` | `#374151` | Body text |
| `--color-text-muted` | `#6B7280` | Helper/placeholder text |
| `--color-accent` | `#2563EB` | Interactive accents |
| `--color-input-bg` | `#FFFFFF` | Input backgrounds |
| `--color-input-border` | `#D1D5DB` | Input borders |
| `--radius-sm` | `0.375rem` | Small elements |
| `--radius-base` | `0.5rem` | Buttons, tabs |
| `--radius-lg` | `0.75rem` | Cards |
| `--radius-xl` | `1rem` | Hero cards |
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.04)` | Subtle lift |
| `--shadow-sm` | `0 4px 12px rgba(0,0,0,0.05)` | Card hover |
| `--shadow-md` | `0 10px 25px rgba(0,0,0,0.06)` | Elevated hover |

## Implementation Order
1. `news/[id].vue` (longest, most important page)
2. `auth.vue` + `forgot-password.vue` (auth system)
3. `profile.vue` + `admin/newsletter.vue` (dashboard)
4. `community.vue` + `CommunityPostCard.vue` + `CreateCommunityPost.vue` (community)
5. `CommentsSection.vue` + `PostComments.vue` (comments)
6. `search.vue` + `archives.vue` (content discovery)
7. `contact.vue` + `about.vue` + `terms.vue` (static pages)

## Guardrails
- Do not rename, remove, or restructure any `supabase.from(...)` tables.
- Do not alter route paths in `pages/`.
- Do not delete features (likes, follows, comments, admin checks).
- Do not add new npm packages or external UI libraries.
- Preserve existing data-fetch patterns (`onMounted`, composable refs).
- Keep `app.css` as the single source of truth for theme variables.

## Verification
- After edits, run `npm run lint`.
- Run `npx vue-tsc --noEmit` if available.
- Manually spot-check responsive breakpoints at 640px, 768px, 1024px.
- Ensure all `img` alt attributes and aria-labels are preserved.

## Risk Mitigation
- Scope changes per file only to `<template>` and `<style scoped>`.
- Keep all `script setup` logic identical; only add missing refs if needed for UI state (e.g., modal open, image expand).
- Use `Edit` tool with exact old string matches to prevent accidental overwrites.
