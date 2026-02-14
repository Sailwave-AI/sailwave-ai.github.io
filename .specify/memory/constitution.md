# Salewave UX Constitution

> Governing principles for all UX decisions on the Salewave marketing site.

## Brand Identity

- **Voice:** Professional, confident, accessible. We speak to SME decision-makers who are smart but not technical.
- **Palette:** Primary `#0057FF` (trust, technology), Accent `#00C9A7` (growth, action), Dark `#1A1A2E` (authority).
- **Typography:** Sprig Sans variable font for brand personality; Inter as fallback for readability.

## UX Principles

1. **Performance is a feature.** No JavaScript frameworks. CSS-only interactions. Every byte must earn its place.
2. **Accessibility is non-negotiable.** WCAG 2.1 AA minimum. Semantic HTML, keyboard navigation, reduced-motion support, proper ARIA.
3. **Mobile-first, always.** Design for the smallest viewport first. Enhance progressively.
4. **Content hierarchy drives decisions.** Every page must have a clear primary action and a logical reading flow.
5. **Consistency over novelty.** Reuse existing design tokens and component patterns. New components need justification.
6. **Static is a strength.** Zola generates static HTML. No client-side rendering. Interactions must degrade gracefully.

## Technical Constraints

- **Stack:** Zola (Rust SSG) + SCSS + zero JavaScript (unless strictly necessary)
- **Deployment:** GitHub Pages via GitHub Actions
- **Images:** JPEG/WebP at max 1600px width, lazy-loaded below the fold
- **CSS Architecture:** BEM naming, modular SCSS partials, design tokens in `_variables.scss`
- **No external dependencies:** No CDN libraries, no tracking scripts in templates

## Design System Boundaries

- All spacing uses the 8px-base scale (`$space-1` through `$space-12`)
- All colors reference SCSS variables — no hardcoded hex values in component files
- Breakpoints: sm(576) / md(768) / lg(992) / xl(1200) / xxl(1400)
- Border radius: sm(4) / default(8) / lg(12) / xl(16) / full(9999)
- Shadows: sm / default / md / lg / xl — no custom shadows outside this scale

## Quality Gates

- HTML must pass W3C validation
- Every interactive element must be keyboard-accessible
- All images must have descriptive alt text
- Color contrast ratios must meet WCAG AA (4.5:1 for body text, 3:1 for large text)
- Pages must score 90+ on Lighthouse Performance
