# salewave.github.io

Salewave website — AI-powered sales operations for SMEs.

Built with [Zola](https://www.getzola.org/), a fast Rust-based static site generator.

## Local Development

```bash
# Install Zola (https://www.getzola.org/documentation/getting-started/installation/)
brew install zola  # macOS
# or download from https://github.com/getzola/zola/releases

# Serve locally with live reload
zola serve

# Build for production
zola build

# Check for broken links
zola check
```

## Tests

```bash
# Build the site and run smoke tests
./tests/run_site_tests.sh
```

## Structure

- `content/` — Markdown content (pages, blog posts, services)
- `templates/` — Tera HTML templates
- `sass/` — SCSS stylesheets (compiled by Zola)
- `static/` — Static assets (images, favicon)
- `.github/workflows/` — CI/CD (deploy to GitHub Pages, weekly link check)

## Deployment

Automatic via GitHub Actions on push to `main`. Site lives at [salewave.github.io](https://salewave.github.io).
