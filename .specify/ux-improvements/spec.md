# UX Improvements Specification

> Spec-driven UX audit and improvement plan for sailwave-ai.github.io

## Context

Salewave is a static marketing site built with Zola targeting SME decision-makers evaluating AI sales operations solutions. The site launched with a solid foundation (semantic HTML, design tokens, mobile-first CSS, accessibility basics) but has gaps in conversion optimization, mobile usability, perceived performance, and engagement patterns.

## UX Audit Findings

### A. Accessibility Gaps (Severity: High)

| Issue | Impact | Location |
|-------|--------|----------|
| No skip-to-content link | Keyboard users must tab through entire nav on every page | `base.html` |
| Navigation has no hamburger/toggle on mobile | 5 links + logo crowd the header on small screens (< 576px) | `_responsive.scss` |
| Links rely on color alone (no underline) | Users with color vision deficiency may miss interactive elements | `_typography.scss` |
| No `aria-label` on CTA sections | Screen readers lack context for repeated "Book the Audit" links | `index.html` |
| Missing `lang` attribute on HTML for non-English content | Assistive technology may mispronounce content | `base.html` (present, `lang="en"`) |

### B. Conversion & Engagement Gaps (Severity: High)

| Issue | Impact |
|-------|--------|
| Contact is mailto-only | High friction. No inline form means users must leave the page to contact. |
| Two identical CTA sections on homepage | Repetitive without differentiation. Second CTA adds no new value. |
| No social proof beyond one generic statement | "Teams see measurable lift..." is vague. No logos, testimonials, or metrics. |
| No scroll-triggered entrance animations | Page feels static. Content appears all at once, reducing perceived quality. |
| Blog has no search or category filtering | Users can't find content by topic — only pagination and tag links. |

### C. Performance Gaps (Severity: Medium)

| Issue | Impact |
|-------|--------|
| No image lazy loading | All images load on page open, increasing initial page weight |
| No WebP format with fallback | Missing ~25-30% file size savings on images |
| No `loading="lazy"` or `decoding="async"` on images | Browser can't prioritize above-fold content |
| Font preload missing for Sprig Sans | Potential FOIT/FOUT on initial load |

### D. Information Architecture Gaps (Severity: Medium)

| Issue | Impact |
|-------|--------|
| Use cases are hardcoded in template | Not scalable. Can't be managed via markdown content files. |
| No breadcrumb navigation on service/blog pages | Users lose context of where they are in the site hierarchy. |
| Footer has minimal service links | Only "All Services" — no individual service deep links. |
| 404 page exists but no search suggestion | Dead-end experience for lost users. |

### E. Visual Polish Gaps (Severity: Low)

| Issue | Impact |
|-------|--------|
| No scroll-based reveal animations | Content loads flat — no progressive disclosure feel |
| Cards lack loading skeleton or transition | Abrupt appearance on slow connections |
| Hero proof statement is plain text | Could be stronger as a stat block or micro-testimonial |

## Goals

1. **Improve accessibility** to full WCAG 2.1 AA compliance
2. **Reduce conversion friction** with inline contact form and differentiated CTAs
3. **Enhance perceived performance** with lazy loading, entrance animations, and image optimization
4. **Strengthen social proof** with concrete metrics and trust signals
5. **Improve mobile UX** with proper responsive navigation
6. **Add wayfinding** with breadcrumbs and enriched footer navigation

## Non-Goals

- Adding a JavaScript framework or SPA behavior
- Building a CMS or admin panel
- Adding analytics/tracking (privacy decision)
- Redesigning the visual brand (colors, typography, logo)
- Building a contact form backend (mailto is acceptable for now)

## Acceptance Criteria

- [ ] Skip-to-content link visible on keyboard focus
- [ ] Mobile navigation collapses into hamburger menu at < 768px
- [ ] All images below the fold use `loading="lazy"` and `decoding="async"`
- [ ] Scroll-triggered CSS entrance animations on sections (respects `prefers-reduced-motion`)
- [ ] Hero section has a concrete social proof element (stat, metric, or named testimonial)
- [ ] CTA sections are differentiated (audit CTA vs. general contact CTA)
- [ ] Breadcrumb navigation on service detail and blog post pages
- [ ] Footer includes individual service links
- [ ] All interactive elements keyboard-accessible with visible focus states
- [ ] Lighthouse accessibility score >= 95
