#!/usr/bin/env python3
"""Basic smoke tests for the generated English site output."""
from pathlib import Path
import re

PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public"
BASE_URL = "https://sailwave-ai.github.io"


def read(path: Path) -> str:
    if not path.exists():
        raise AssertionError(f"Missing file: {path}")
    return path.read_text(encoding="utf-8")


def assert_contains(haystack: str, needles: list[str], context: str) -> None:
    for needle in needles:
        if needle not in haystack:
            raise AssertionError(f"Missing '{needle}' in {context}")


def assert_h1_title(html: str, title: str, context: str) -> None:
    pattern = rf"<h1[^>]*class=\"?page-header__title\"?[^>]*>\s*{re.escape(title)}\s*</h1>"
    if not re.search(pattern, html):
        raise AssertionError(f"Missing H1 title '{title}' in {context}")


def test_core_pages_exist() -> None:
    required = [
        PUBLIC_DIR / "index.html",
        PUBLIC_DIR / "about" / "index.html",
        PUBLIC_DIR / "services" / "index.html",
        PUBLIC_DIR / "services" / "ai-prospecting" / "index.html",
        PUBLIC_DIR / "services" / "pipeline-intelligence" / "index.html",
        PUBLIC_DIR / "services" / "sales-automation" / "index.html",
        PUBLIC_DIR / "blog" / "index.html",
        PUBLIC_DIR / "404.html",
    ]
    for path in required:
        if not path.exists():
            raise AssertionError(f"Expected page missing: {path}")


def test_static_assets_exist() -> None:
    required = [
        PUBLIC_DIR / "style.css",
        PUBLIC_DIR / "images" / "logo.svg",
        PUBLIC_DIR / "images" / "favicon.svg",
        PUBLIC_DIR / "images" / "og-image.svg",
        PUBLIC_DIR / "images" / "services" / "crm-automation.svg",
        PUBLIC_DIR / "images" / "services" / "cx-consulting.svg",
        PUBLIC_DIR / "images" / "services" / "data-integration.svg",
    ]
    for path in required:
        if not path.exists():
            raise AssertionError(f"Expected asset missing: {path}")


def test_global_nav_links() -> None:
    html = read(PUBLIC_DIR / "index.html")
    assert_contains(
        html,
        ["/services/", "/about/", "/blog/", "mailto:"],
        "homepage navigation",
    )


def test_homepage_hero_and_cta() -> None:
    html = read(PUBLIC_DIR / "index.html")
    assert_contains(
        html,
        [
            "AI-Powered Sales Ops",
            "Explore Services",
            "Learn More",
            "Ready to Transform Your Sales?",
            "Get in Touch",
        ],
        "homepage hero/cta",
    )


def test_homepage_meta_and_og_tags() -> None:
    html = read(PUBLIC_DIR / "index.html")
    assert_contains(
        html,
        [
            "name=description",
            "property=og:title",
            "property=og:description",
            "property=og:url",
            "property=og:image",
            "rel=canonical",
        ],
        "homepage meta tags",
    )
    if BASE_URL not in html:
        raise AssertionError("Expected base_url in homepage HTML")


def test_rss_feed_link() -> None:
    html = read(PUBLIC_DIR / "index.html")
    assert_contains(html, ["atom.xml", "application/atom+xml"], "RSS feed link")


def test_services_listing_contains_three_cards() -> None:
    html = read(PUBLIC_DIR / "services" / "index.html")
    assert_contains(
        html,
        [
            "AI Prospecting",
            "Pipeline Intelligence",
            "Sales Automation",
        ],
        "services listing",
    )


def test_service_pages_have_titles() -> None:
    pages = {
        "AI Prospecting": PUBLIC_DIR / "services" / "ai-prospecting" / "index.html",
        "Pipeline Intelligence": PUBLIC_DIR / "services" / "pipeline-intelligence" / "index.html",
        "Sales Automation": PUBLIC_DIR / "services" / "sales-automation" / "index.html",
    }
    for title, path in pages.items():
        html = read(path)
        assert_h1_title(html, title, str(path))


def test_404_page_copy() -> None:
    html = read(PUBLIC_DIR / "404.html")
    assert_contains(
        html,
        ["Page Not Found", "Back to Home", "Read the Blog"],
        "404 page",
    )


def test_sitemap_and_robots() -> None:
    sitemap = PUBLIC_DIR / "sitemap.xml"
    if not sitemap.exists():
        raise AssertionError("Missing sitemap.xml")
    if "<urlset" not in read(sitemap):
        raise AssertionError("sitemap.xml does not include <urlset>")


def run_all() -> None:
    test_core_pages_exist()
    test_static_assets_exist()
    test_global_nav_links()
    test_homepage_hero_and_cta()
    test_homepage_meta_and_og_tags()
    test_rss_feed_link()
    test_services_listing_contains_three_cards()
    test_service_pages_have_titles()
    test_404_page_copy()
    test_sitemap_and_robots()


if __name__ == "__main__":
    run_all()
    print("site_smoke_tests: OK")
