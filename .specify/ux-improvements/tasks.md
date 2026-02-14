# UX Improvements — Task Breakdown

> Generated from plan.md. Tasks ordered by dependency. Parallel tasks marked with [P].

## Phase 1: Accessibility & Mobile Foundation

- [ ] **T1.1** Add skip-to-content link to `base.html` and `.skip-link` styles to `_reset.scss`
- [ ] **T1.2** Add `id="main-content"` to `<main>` element in `base.html`
- [ ] **T1.3** Implement CSS-only hamburger toggle in `base.html` (checkbox + label)
- [ ] **T1.4** Add hamburger toggle styles to `_layout.scss` and `_responsive.scss`
- [ ] **T1.5** [P] Add `loading="lazy"` and `decoding="async"` to images in `blog-post.html`
- [ ] **T1.6** [P] Add `loading="lazy"` and `decoding="async"` to images in `use-cases.html`
- [ ] **T1.7** [P] Add `loading="lazy"` and `decoding="async"` to images in `service-page.html`

## Phase 2: Engagement & Conversion

- [ ] **T2.1** Create `sass/_animations.scss` with `fadeInUp` keyframes and `.reveal` class
- [ ] **T2.2** Add inline IntersectionObserver `<script>` to `base.html` (< 500 bytes)
- [ ] **T2.3** Add `.reveal` class to section elements in `index.html`
- [ ] **T2.4** Replace hero proof text with stat block in `index.html`
- [ ] **T2.5** Add `.hero__stats` and `.hero__stat` styles to `_components.scss`
- [ ] **T2.6** Differentiate mid-page and final CTA content in `index.html`
- [ ] **T2.7** Add `.cta--dark` variant styles to `_components.scss`

## Phase 3: Wayfinding & Polish

- [ ] **T3.1** Add breadcrumb markup to `service-page.html`
- [ ] **T3.2** Add breadcrumb markup to `blog-post.html`
- [ ] **T3.3** Add `.breadcrumb` styles to `_components.scss`
- [ ] **T3.4** Add active nav state detection to `base.html` using `current_path`
- [ ] **T3.5** Enrich footer with individual service links using `get_section()`
- [ ] **T3.6** Add font preload hint for Sprig Sans to `base.html` `<head>`

## Verification

- [ ] **V1** Build site with `zola build` and verify no errors
- [ ] **V2** Verify keyboard navigation flow (Tab through skip-link, nav, content, footer)
- [ ] **V3** Verify hamburger menu works on mobile viewport
- [ ] **V4** Verify lazy loading applies to below-fold images
- [ ] **V5** Verify animations respect `prefers-reduced-motion`
