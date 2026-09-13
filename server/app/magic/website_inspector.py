import re
from urllib.parse import urljoin, urlparse
import httpx
from bs4 import BeautifulSoup


def extract_color_palette(html: str, soup: BeautifulSoup) -> dict:
    """Extracts background, text, and accent color candidates from inline styles,

    CSS link tags, and SVG attributes.
    """
    colors = {
        "mode": "dark",
        "primary": "",
        "accent": "",
        "background": "#000000",
        "text": "#ffffff",
    }

    # Detect theme-color meta tag
    theme_meta = soup.find("meta", attrs={"name": "theme-color"})
    if theme_meta and theme_meta.get("content"):
        colors["accent"] = theme_meta["content"].strip()
        colors["primary"] = theme_meta["content"].strip()

    # Search for hex colors in style tags
    style_content = " ".join([s.get_text() for s in soup.find_all("style")])
    hex_colors = re.findall(r"#(?:[0-9a-fA-F]{3}){1,2}\b", style_content + " " + html[:100000])

    dark_bg_indicators = ["#000", "#000000", "#0a0a0a", "#111", "#111111", "#121212", "#080808", "#1a1a1a"]
    light_bg_indicators = ["#fff", "#ffffff", "#f8f9fa", "#f5f5f5", "#fafafa"]

    found_dark = any(c.lower() in dark_bg_indicators for c in hex_colors)
    found_light = any(c.lower() in light_bg_indicators for c in hex_colors)

    if found_dark and not found_light:
        colors["mode"] = "dark"
        colors["background"] = "#000000"
        colors["text"] = "#ffffff"
    elif found_light and not found_dark:
        colors["mode"] = "light"
        colors["background"] = "#ffffff"
        colors["text"] = "#111111"

    # Identify candidate vibrant accent color (not pure black/white/grey)
    for c in hex_colors:
        clean = c.lower()
        if len(clean) in (4, 7) and clean not in (
            "#fff",
            "#ffffff",
            "#000",
            "#000000",
            "#111",
            "#111111",
            "#222",
            "#222222",
            "#333",
            "#333333",
            "#444",
            "#444444",
            "#555",
            "#555555",
            "#666",
            "#888",
            "#999",
            "#aaa",
            "#bbb",
            "#ccc",
            "#ddd",
            "#eee",
        ):
            if not colors["accent"]:
                colors["accent"] = clean
            if not colors["primary"]:
                colors["primary"] = clean
            break

    return colors


async def inspect_website(url: str, timeout: float = 15.0) -> dict:
    """Fetches and parses a website using an HTTP client, extracting rich structured facts."""
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 DevfolioBot/1.0"
        ),
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
    }

    async with httpx.AsyncClient(follow_redirects=True, timeout=timeout) as client:
        res = await client.get(url, headers=headers)
        res.raise_for_status()

    html = res.text
    final_url = str(res.url)
    soup = BeautifulSoup(html, "html.parser")

    # Title extraction
    title = ""
    if soup.title and soup.title.string:
        title = soup.title.string.strip()
    og_title = soup.find("meta", property="og:title")
    if og_title and og_title.get("content"):
        title = og_title["content"].strip() or title

    # Description extraction
    description = ""
    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc and meta_desc.get("content"):
        description = meta_desc["content"].strip()
    og_desc = soup.find("meta", property="og:description")
    if og_desc and og_desc.get("content"):
        description = og_desc["content"].strip() or description

    # OpenGraph image
    og_image = ""
    og_img_tag = soup.find("meta", property="og:image") or soup.find("meta", attrs={"name": "twitter:image"})
    if og_img_tag and og_img_tag.get("content"):
        og_image = urljoin(final_url, og_img_tag["content"].strip())

    # Favicon / Icons
    icons = []
    icon_links = soup.find_all("link", rel=lambda r: r and any(i in str(r).lower() for i in ["icon", "apple-touch-icon"]))
    for link in icon_links:
        href = link.get("href")
        if href:
            icons.append(urljoin(final_url, href.strip()))

    # If no icon found, try standard /favicon.ico
    if not icons:
        icons.append(urljoin(final_url, "/favicon.ico"))

    # Extract headings (h1, h2, h3)
    headings = []
    for tag in ["h1", "h2", "h3"]:
        for h in soup.find_all(tag):
            text = h.get_text(separator=" ", strip=True)
            if text and len(text) < 120 and text not in headings:
                headings.append(text)
                if len(headings) >= 8:
                    break

    # Extract navigation labels
    nav_links = []
    for nav in soup.find_all(["nav", "header"]):
        for a in nav.find_all("a"):
            t = a.get_text(strip=True)
            if t and len(t) < 30 and t not in nav_links:
                nav_links.append(t)
                if len(nav_links) >= 10:
                    break

    # Extract visible body text preview
    for script in soup(["script", "style", "svg", "noscript"]):
        script.extract()
    body_text = soup.get_text(separator=" ", strip=True)
    clean_text = " ".join(body_text.split())[:1500]

    # Theme & colors
    palette = extract_color_palette(html, soup)

    return {
        "url": final_url,
        "title": title,
        "description": description,
        "ogImage": og_image,
        "icons": icons,
        "headings": headings[:8],
        "navigation": nav_links[:10],
        "textPreview": clean_text,
        "theme": palette,
    }
