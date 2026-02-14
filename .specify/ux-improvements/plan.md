# UX Improvements — Implementation Plan

> Based on spec.md audit findings, organized by impact and dependency order.

## Phase 1: Accessibility & Mobile Foundation

These changes are structural and affect the base template used by all pages.

### 1.1 Skip-to-Content Link
- **File:** `templates/base.html`
- **Change:** Add `<a class="skip-link" href="#main-content">Skip to content</a>` as first child of `<body>`
- **File:** `sass/_reset.scss`
- **Change:** Add `.skip-link` styles (visually hidden, visible on `:focus`)
- **File:** `templates/base.html`
- **Change:** Add `id="main-content"` to `<main>` element

### 1.2 Mobile Hamburger Navigation
- **File:** `templates/base.html`
- **Change:** Add CSS-only hamburger toggle using `<input type="checkbox">` + `<label>` pattern
- **File:** `sass/_layout.scss`
- **Change:** Add `.header__toggle` and `.header__toggle-label` styles
- **File:** `sass/_responsive.scss`
- **Change:** Replace current nav-wrapping behavior with hamburger slide-down at < 768px
- **Constraint:** Pure CSS, no JavaScript

### 1.3 Image Lazy Loading
- **File:** All templates that render `<img>` tags
- **Change:** Add `loading="lazy"` and `decoding="async"` to all images below the fold
- **Priority:** Blog post images, use case card images, service page images

## Phase 2: Engagement & Conversion

### 2.1 Scroll-Triggered Entrance Animations
- **File:** `sass/_components.scss`
- **Change:** Add CSS `@keyframes fadeInUp` animation
- **File:** New file: `sass/_animations.scss`
- **Change:** Create `.animate-on-scroll` utility with `animation-play-state: paused` approach
- **Reality check:** Pure CSS can't detect scroll position. Use CSS `animation-timeline: view()` (supported in Chrome/Edge) with graceful fallback for other browsers. Alternatively, add a minimal `<script>` using `IntersectionObserver` (< 500 bytes).
- **Decision:** Use IntersectionObserver (tiny, progressive enhancement, broad browser support)

### 2.2 Enhanced Social Proof on Hero
- **File:** `templates/index.html`
- **Change:** Replace generic proof text with a stat block: three KPI-style numbers (e.g., "90-day ROI", "3x pipeline velocity", "500+ SMEs")
- **File:** `sass/_components.scss`
- **Change:** Add `.hero__stats` grid with `.hero__stat` items

### 2.3 Differentiated CTA Sections
- **File:** `templates/index.html`
- **Change:** Make mid-page CTA specific (audit booking with benefit bullets) and final CTA general (newsletter/contact with different visual treatment)
- **File:** `sass/_components.scss`
- **Change:** Add `.cta--dark` variant with inverted color scheme for visual differentiation

## Phase 3: Wayfinding & Information Architecture

### 3.1 Breadcrumb Navigation
- **File:** `templates/service-page.html`, `templates/blog-post.html`
- **Change:** Add breadcrumb markup using `<nav aria-label="Breadcrumb">` with `<ol>` structured data
- **File:** `sass/_components.scss`
- **Change:** Add `.breadcrumb` styles

### 3.2 Enriched Footer
- **File:** `templates/base.html`
- **Change:** Add individual service links to footer Services group (dynamically from content)
- **Constraint:** Zola can load section pages via `get_section()` — use this to iterate services

### 3.3 Active Navigation State
- **File:** `templates/base.html`
- **Change:** Add active state detection using `current_path` to highlight current nav section
- Uses Tera's `current_path is starting_with` for matching

## Phase 4: Performance Polish

### 4.1 Font Preload
- **File:** `templates/base.html`
- **Change:** Add `<link rel="preload" as="font" type="font/woff2" crossorigin>` for Sprig Sans

### 4.2 Image Optimization Guidelines
- **File:** `MEDIA_PLAN.md`
- **Change:** Document WebP conversion workflow and srcset recommendations for future images

## Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Scroll animations | IntersectionObserver (JS) | CSS `animation-timeline` has ~75% browser support; IO is ~97% and < 500 bytes |
| Contact form | Keep mailto for now | No backend available; inline form would need external service |
| Hamburger nav | CSS-only checkbox hack | Aligns with zero-JS constitution; well-supported pattern |
| Breadcrumbs | Schema.org + aria | SEO benefit + accessibility, no JS needed |

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| CSS checkbox nav has focus management issues | Add `:focus-within` fallback and test with VoiceOver/NVDA |
| IntersectionObserver adds JS to a zero-JS site | Tiny footprint (< 500 bytes), loaded as inline `<script>`, progressive enhancement only |
| Hardcoded stats may feel inauthentic | Use conservative, defensible numbers or qualify with "up to" language |
