# Test Inventory

This document tracks tests added to the repo and the files/behaviors they cover. Update it whenever a new test is created.

## tests/site_smoke_tests.py

**Purpose:** English-site smoke checks against generated `public/` HTML.

**Coverage**
- `templates/base.html`: header navigation links, canonical link, Open Graph basics, RSS link (verified via homepage output).
- `templates/index.html`: hero badge, primary CTAs, tagline, CTA copy (homepage output).
- `templates/services.html`: services listing includes three service cards (services index output).
- `templates/service-page.html`: service pages render the expected H1 title (service detail outputs).
- `templates/404.html`: 404 headline and CTA copy present (404 output).
- `content/services/*.md`: service pages output exists and carries correct titles.
- `static/images/*`: key brand + service images published to `public/`.
- `sitemap.xml`: generated and well-formed (contains `<urlset>`).

**How to run**
```bash
tests/run_site_tests.sh
```
