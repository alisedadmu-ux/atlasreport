# Atlas Report — BBC-Inspired Editorial Redesign Plan

Modern, premium, trustworthy news platform inspired by BBC's *editorial philosophy* (clarity, hierarchy, readability, credibility, fast discovery) — **not** its branding, logo, layout, colors, or assets. Atlas Report keeps its own identity (`atlaslogo.png`, name) and a blue-family **ink-navy** accent.

## Decisions (confirmed with user)
1. **Palette:** warm-neutral "paper" surfaces + near-black ink text + single restrained **ink-navy** accent.
2. **Headlines:** news-grade humanist serif (**Source Serif 4**) replacing Playfair Display; body/UI stays **Inter**.
3. **Dark mode:** keep toggle; refine **both** light and dark in the same pass.
4. **Scope:** full consistency pass — core screens fully reworked, every page aligned to the new system.

## Hard guardrails (do not break)
- Only touch `<template>`, `<style>`, `app.css`, and `nuxt.config.ts` (fonts/theme-color).
- **No** changes to `supabase.from(...)`, table schemas, RLS, auth, route paths, or data-fetch logic.
- **No** new npm packages / external UI libraries. Fonts via Google Fonts `<link>` only.
- `app.css` = single source of truth for tokens; components must reference tokens, never hard-coded hex.
- Add **presentational** computeds/refs only (e.g. `latestArticles`, `sectionGroups`, `prevArticle`, search-open). Never change fetch logic.
- Preserve all `alt`, `aria-*`, and a11y affordances; keep/raise WCAG AA contrast.
- Honor `prefers-reduced-motion`.

---

## Design language (BBC principles → Atlas)
- **Flat & crisp:** structure via thin borders, dividers, whitespace — not heavy shadows or big hover lifts.
- **Predictable hierarchy:** one dominant lead headline per zone; consistent kicker → headline → standfirst → meta order.
- **Restrained color:** near-neutral surfaces, one accent used only for interactivity/section identity.
- **Readability first:** ~680px article measure, generous line-height, clear paragraph rhythm.
- **Labeled zones:** every homepage block has an explicit section label.
- **Fast discovery:** section nav bar + numbered "Most read" + latest river + per-category sections.

---

## Phase 1 — Foundation (`app/app.css`, `nuxt.config.ts`)

### 1a. Re-theme tokens (keep every existing token NAME; change only values)
This re-themes all components at once with minimal markup risk.

**Light `:root`**
| Token | Value |
|---|---|
| `--color-bg` | `#F4F1EB` |
| `--color-bg-alt` | `#ECE8DF` |
| `--color-bg-muted` | `#E2DCD0` |
| `--color-bg-elevated` / `--color-card-bg` | `#FFFFFF` |
| `--color-card-hover` | `#FAF8F3` |
| `--color-text` | `#1A1A1A` |
| `--color-text-secondary` | `#4A4A48` |
| `--color-text-muted` | `#6E6E6A` |
| `--color-border` | `#DAD5C9` |
| `--color-border-strong` | `#C4BDAE` |
| `--color-border-light` | `#E9E5DB` |
| `--color-accent` / `--color-primary` | `#1E3A5F` (ink navy) |
| `--color-accent-hover` | `#152A46` |
| `--color-accent-active` | `#0E1E33` |
| `--color-accent-subtle` | `rgba(30,58,95,0.07)` |
| `--color-accent-light` | `rgba(30,58,95,0.14)` |
| `--color-accent-ring` | `rgba(30,58,95,0.28)` |
| `--color-secondary` | `#26251F` |
| `--color-highlight` *(repurposed: restrained gold, sparing use only)* | `#94651E` |
| `--color-success` | `#2E7D5B` |
| `--color-warning` | `#B4791B` |
| `--color-error` | `#B23A2E` |
| `--color-info` | `#1E3A5F` |
| `--color-header-bg` | `rgba(244,241,235,0.85)` |
| `--color-footer-bg` | `#ECE8DF` |
| `--color-overlay` | `rgba(20,18,15,0.5)` |

**Dark `.dark`**
| Token | Value |
|---|---|
| `--color-bg` | `#1A1815` |
| `--color-bg-alt` | `#211E1A` |
| `--color-bg-muted` | `#2A2621` |
| `--color-card-bg` | `#201D19` |
| `--color-card-hover` | `#262119` |
| `--color-text` | `#F2EFE9` |
| `--color-text-secondary` | `#B7B2A8` |
| `--color-text-muted` | `#8A857B` |
| `--color-border` | `#34302A` |
| `--color-border-strong` | `#47423A` |
| `--color-border-light` | `#2E2A24` |
| `--color-accent` / `--color-primary` | `#9BB8DB` |
| `--color-accent-hover` | `#BBD0E9` |
| `--color-accent-contrast` | `#14130F` |
| `--color-highlight` | `#D6B26A` |
| `--color-header-bg` | `rgba(26,24,21,0.9)` |
| `--color-footer-bg` | `#14130F` |
| `--color-overlay` | `rgba(0,0,0,0.6)` |
| `--color-success` | `#5FB98F` | `--color-warning` | `#E0A85A` | `--color-error` | `#E08A7E` |

### 1b. Radii — tighter, print-like
`--radius-sm:0.25rem`, `--radius-base:0.375rem`, `--radius-lg:0.5rem`, `--radius-xl:0.625rem`, `--radius-2xl:0.75rem`.

### 1c. Shadows — flatten
Reduce every `--shadow-*` to subtle values; remove bouncy `cubic-bezier(0.34,1.56,...)` from `.card`/`.card-interactive`/`.scale-in`. Hover = border-color change + ~1–2px lift only.

### 1d. Typography
- Add vars: `--font-serif: 'Source Serif 4', Georgia, 'Times New Roman', serif;`, `--font-sans` stays Inter.
- Replace all `'Playfair Display', Georgia, serif` (in `app.css` + `index.vue` + `news/[id].vue`) with `var(--font-serif)`.
- Retune headings: `letter-spacing` ≈ normal for serif, `line-height` 1.15–1.25.
- Add editorial helpers: `.kicker` (uppercase accent label), `.standfirst`/`.lead` (larger intro paragraph), `.pull-quote`, refined `.section-title` with a rule under it.
- Add `.typed-placeholder` utility = monospace accent text (for suspenseful fakable placeholders like timestamps — not used for real data).

### 1e. `nuxt.config.ts`
- Swap fonts `<link>` to Source Serif 4 + Inter:
  `family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap`
- Update `theme-color` meta + PWA `theme_color`/`background_color` to `#1E3A5F` / `#F4F1EB`.

### 1f. Container consistency
`index.vue` and `news/[id].vue` currently **omit** `.site-container` (full-bleed on wide screens). Wrap both in `.site-container`; article prose gets its own narrower `~680px` measure inside it. (Other pages already use `.site-container`.)

---

## Phase 2 — Navigation (`header.vue`, `footer.vue`)

**Header**
- Keep logo + primary nav (Home, Search, Archives, Community, About) + sticky hide-on-scroll.
- **Add a section bar** under the masthead: links for the 6 news categories (World, Tech, Sports, Science, Business, Health) → `/?cat=<id>` (homepage already reads `route.query.cat`). Active section underlined in accent. Flat, no pills.
- Keep search icon; optionally an inline expandable field on desktop (presentational state only — no new behavior).
- Mobile menu: add the section links group above account actions.
- Restyle theme toggle + auth/profile to flat tokens.

**Footer** — retune to new tokens (flat borders, warm surface); restyle heading to `.kicker`. No link/newsletter structure change.

---

## Phase 3 — Homepage (`app/pages/index.vue`)

Replace the marketing hero banner with an editorial front page of **clearly labeled zones**. Add **presentational** computeds only; reuse `articles`, `filteredArticles`, `categories`.

**Default (no category selected) = full multi-zone front page:**
1. **Masthead strip:** date + "Live updates" pulse (keep). No gradient hero.
2. **Section bar (top):** same category links as header + a **"Top Stories"** reset pill that clears `?cat` (navigates to `/`). Preserves existing `currentCategory` filter when a category *is* chosen.
3. **Lead story:** single most important headline — large serif headline, dominant image, kicker, standfirst, byline (highest visual weight).
4. **Featured stories:** 3–4 secondary cards (subordinate hierarchy).
5. **Most read (sidebar):** numbered 1–N list (keep numbered pattern), flat rows, rank numerals in accent.
6. **Latest news river:** chronological list by `published` (new `latestArticles` computed), compact list-cards (kicker + time).
7. **Category sections:** per-category strips (`sectionGroups` computed grouping `articles` by `category`) each showing 3–4 articles + "More in {section}" → `/?cat=<id>`.
8. **Recommended / Editor's picks:** curated block, restyled.
9. **Newsletter (The Daily Brief):** keep, flat.

**When a category is selected:** switch to a focused category view (lead + grid + most-read + recommended) reusing the existing filter logic — do not hide the rest of the design awkwardly.

**Helper computeds (presentational, derived from `articles`/`filteredArticles`):**
`leadArticle`, `featuredArticles`, `latestArticles` (sorted by `published` desc), `sectionGroups` (group by `category`), `recommendedArticles` (``editorsPicks``-style, excluding lead/featured).

**Preserve:** loading skeletons (retuned), empty state, `Fetch News` admin action, `onImageError` fallback.

---

## Phase 4 — Article page (`app/pages/news/[id].vue`) — reading-first

- Wrap in `.site-container`; body uses centered **~680px** measure.
- **Header block (in measure):** category **kicker** → large serif **headline** → **standfirst** (`description`, styled as a larger secondary lead paragraph) → **byline row** (author avatar + name + role, publish date, reading time) placed between title and hero image.
- **Hero image:** reading-width, tighter radius, subtle border; keep fallback + caption slot; drop heavy hover-zoom (subtle or none).
- **Body prose:** `font-size ~1.0625–1.125rem`, `line-height ~1.75–1.8`, clear paragraph spacing, strong contrast. Optional refined **drop cap** / **pull-quote** for rhythm.
- **Inline actions:** Share (Web Share API + clipboard fallback — keep) and Save, flat editorial buttons.
- **Remove** the fake TOC ("Section 1…6") and the generic "Why this matters" filler. Sidebar rail (desktop only): slim sticky **share/save + reading progress**; fold a compact **story details** (category, published, author, source) beneath the article on ≤1024px.
- **Related stories:** 3 category-matched cards (keep logic), unified card style.
- **Prev / Next story navigation:** bottom nav linking previous/next article in same category (new `prevArticle`/`nextArticle` computeds from fetched-or-fallback list).
- Keep top reading-progress bar (retune). Responsive: single column; rail collapses under content ≤1024px.

---

## Phase 5 — Shared components & card system

Unify one editorial card/button/tag language.
- **Cards** (`.card`, hero/secondary/list/related/trending/pick, `CommunityPostCard.vue`): tighter radius, thin border, flat/near-flat shadow, restrained hover (border-color + ~1–2px lift; remove scale bounce). Consistent kicker/meta typography.
- **Buttons** (`.btn*`): squared, restrained; primary = ink navy, secondary = bordered neutral, ghost = quiet; remove glossy inner shadows.
- **Badges/tags/kickers:** uppercase, small, accent/neutral; consistent everywhere.
- **Newsletter** (`NewsletterSubscribe.vue`): flat `.form-input`, `.form-success`/`.form-error`.
- **Comments** (`CommentsSection.vue`, `PostComments.vue`): accent-underline heading, card-style items w/ hover highlight, soft delete icon, condensed variant for post comments.
- **Community** (`CommunityPostCard.vue`, `CreateCommunityPost.vue`): icon+count actions, minimal follow pill, soft-divider composer — all on new tokens.

---

## Phase 6 — Secondary pages (consistency pass)
Align each to new tokens, flat cards, `.kicker`/`.section-title`, global `.form-input`/`.btn`. **No logic changes.**
- `search.vue` — flat result rows, left accent border on hover, chips active = neutral-dark.
- `archives.vue` — clean serif title, chip filters, accent left-border cards, underline pagination.
- `community.vue` + `community/profile/[id].vue` — simplified hero, underline tabs, panel cards, centered blurred modal.
- `profile.vue` — identity card w/ accent edge, section dividers, active = border, save banner.
- `auth.vue` + `forgot-password.vue` + `unsubscribe.vue` — centered card, unified inputs/buttons, mobile-centered logo.
- `about.vue` — clean hero, 3-col values, 720px body, subtle top accent rule (drop heavy gradient).
- `contact.vue` — subtle top accent border, global form rows, success banner.
- `terms.vue` + `privacy.vue` — narrow 720px legal reader, relaxed leading, `.kicker` section labels, minimal chrome.
- `admin/newsletter.vue` — flat mono stat cards, global tabs, zebra/sticky tables, matched compose form, ghost back link.
- `error.vue` — align to tokens.

---

## Phase 7 — QA & verification
- `npm run build` (and a `npm run dev` smoke test) — confirms no template/style breakage.
- `npx vue-tsc --noEmit` if available.
- Contrast: ink-navy accent + ink text on paper meet WCAG AA; **underline inline links** so interactivity reads clearly given the low-chroma accent; focus ring visible on new accent.
- Responsive spot-check: 480 / 640 / 768 / 1024 / 1280.
- Verify **light + dark** on homepage, article, nav, cards.
- Confirm Supabase reads/writes, auth, likes/follows/comments, admin checks still work.
- Confirm `alt`/`aria-*` preserved; `prefers-reduced-motion` respected.

---

## Implementation order
1. Phase 1 foundation (tokens, radii, shadows, fonts, config, container fix)
2. Phase 2 navigation
3. Phase 3 homepage
4. Phase 4 article page
5. Phase 5 shared components
6. Phase 6 secondary pages
7. Phase 7 QA

## Risks & mitigations
- **Accent close to ink text** → underline links, accent kickers, section rules; contrast-checked.
- **Font swap** → single `--font-serif` var; verify Source Serif 4 loads.
- **Homepage computeds** → purely presentational; never change fetch/schema.
- **Dark drift** → dark tokens updated same pass as light.
- **No data migration** → changes are tokens + template/style; a rebuild suffices.
- **Data dependency** → multi-zone/prev-next rely on `articles` (Supabase or `fallbackArticles`); graceful collapse when a zone is empty.
