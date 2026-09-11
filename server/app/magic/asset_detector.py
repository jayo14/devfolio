from urllib.parse import urlparse
import httpx


def generate_initials_svg(name: str, bg_color: str = "#ff4f22", text_color: str = "#000000") -> str:
    """Generates a clean, modern SVG badge placeholder with initials."""
    clean_name = name.strip() or "Project"
    words = clean_name.split()
    if len(words) >= 2:
        initials = (words[0][0] + words[1][0]).upper()
    else:
        initials = clean_name[:2].upper()

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <rect width="100" height="100" rx="16" fill="{bg_color}"/>
  <text x="50" y="58" font-family="Poppins, sans-serif" font-size="36" font-weight="700" fill="{text_color}" text-anchor="middle" dominant-baseline="central">{initials}</text>
</svg>"""
    return svg


async def detect_logo(website_data: dict, project_name: str) -> str:
    """Detects best available logo or brand icon using prioritized candidate verification."""
    candidates = []

    # 1. Favicon / Apple touch icons from website data
    for icon_url in website_data.get("icons", []):
        if any(keyword in icon_url.lower() for keyword in ["logo", "apple-touch-icon", "brand", "icon-192", "icon-512"]):
            candidates.insert(0, icon_url)
        else:
            candidates.append(icon_url)

    # 2. OpenGraph image
    og_img = website_data.get("ogImage")
    if og_img:
        candidates.append(og_img)

    # Verify accessibility of candidate URLs
    headers = {"User-Agent": "DevfolioBot/1.0"}
    async with httpx.AsyncClient(timeout=8.0, follow_redirects=True) as client:
        for candidate in candidates:
            try:
                resp = await client.head(candidate, headers=headers)
                if resp.status_code == 200:
                    content_type = resp.headers.get("content-type", "").lower()
                    if any(t in content_type for t in ["image", "svg", "octet-stream", "icon"]):
                        return candidate
            except Exception:
                continue

    # Fallback: generate data URI of initials SVG
    theme_accent = website_data.get("theme", {}).get("accent", "#ff4f22")
    svg = generate_initials_svg(project_name, bg_color=theme_accent, text_color="#000000")
    import base64
    b64 = base64.b64encode(svg.encode("utf-8")).decode("utf-8")
    return f"data:image/svg+xml;base64,{b64}"
