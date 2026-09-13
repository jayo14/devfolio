import asyncio
import io
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageColor, ImageChops


STATIC_MAGIC_DIR = Path(__file__).resolve().parent.parent.parent / "static" / "magic"
STATIC_MAGIC_DIR.mkdir(parents=True, exist_ok=True)


async def capture_web_screenshots(url: str, output_dir: Path) -> tuple[Path, Path]:
    """Captures real desktop (1440x900) and mobile (390x844) screenshots via Playwright."""
    output_dir.mkdir(parents=True, exist_ok=True)
    desktop_path = output_dir / "desktop.png"
    mobile_path = output_dir / "mobile.png"

    try:
        from playwright.async_api import async_playwright

        async with async_playwright() as p:
            # Launch chromium headless
            browser = await p.chromium.launch(
                headless=True,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            )

            # 1. Desktop screenshot (1440x900)
            context_desktop = await browser.new_context(
                viewport={"width": 1440, "height": 900},
                device_scale_factor=1,
            )
            page_desktop = await context_desktop.new_page()
            await page_desktop.goto(url, wait_until="networkidle", timeout=25000)
            await asyncio.sleep(1.5)  # Allow fonts and css animations to settle
            await page_desktop.screenshot(path=str(desktop_path), full_page=False)
            await context_desktop.close()

            # 2. Mobile screenshot (390x844 - modern phone aspect ratio)
            context_mobile = await browser.new_context(
                viewport={"width": 390, "height": 844},
                is_mobile=True,
                has_touch=True,
                device_scale_factor=2,
            )
            page_mobile = await context_mobile.new_page()
            await page_mobile.goto(url, wait_until="networkidle", timeout=25000)
            await asyncio.sleep(1.5)
            await page_mobile.screenshot(path=str(mobile_path), full_page=False)
            await context_mobile.close()

            await browser.close()
            return desktop_path, mobile_path

    except Exception as e:
        # Graceful deterministic fallback: render clean browser window preview
        render_fallback_screenshot(desktop_path, 1440, 900, url, is_mobile=False)
        render_fallback_screenshot(mobile_path, 390, 844, url, is_mobile=True)
        return desktop_path, mobile_path


def render_fallback_screenshot(path: Path, width: int, height: int, url: str, is_mobile: bool):
    """Draws a crisp, stylized digital screenshot representation if headless browser is unavailable."""
    img = Image.new("RGB", (width, height), color=(10, 10, 10))
    draw = ImageDraw.Draw(img)

    # Top header bar
    header_height = 40 if not is_mobile else 60
    draw.rectangle([0, 0, width, header_height], fill=(24, 24, 24))

    # Window dots on desktop
    if not is_mobile:
        draw.ellipse([16, 14, 28, 26], fill=(255, 95, 87))
        draw.ellipse([36, 14, 48, 26], fill=(254, 188, 46))
        draw.ellipse([56, 14, 68, 26], fill=(40, 200, 64))
        # Address bar
        draw.rounded_rectangle([120, 8, width - 120, 32], radius=6, fill=(35, 35, 35))

    # Grid / content placeholder
    for i in range(header_height + 40, height - 60, 80):
        draw.rounded_rectangle([40, i, width - 40, i + 50], radius=8, fill=(20, 20, 20))

    img.save(str(path))


# ── Color & Theme Extraction Pipeline ──────────────────────────────────────────

def parse_color_hex(hex_str: str | None) -> tuple[int, int, int] | None:
    """Parses a hex or rgb color string safely into an RGB integer tuple."""
    if not hex_str or not isinstance(hex_str, str):
        return None
    hex_str = hex_str.strip()
    if hex_str.startswith("#"):
        try:
            if len(hex_str) in (4, 7, 9):
                rgb = ImageColor.getrgb(hex_str)
                return rgb[:3]
        except Exception:
            return None
    elif hex_str.startswith("rgb"):
        try:
            parts = [
                int(p.strip())
                for p in hex_str.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(",")[:3]
            ]
            return (parts[0], parts[1], parts[2])
        except Exception:
            return None
    return None


def is_neutral_color(rgb: tuple[int, int, int]) -> bool:
    """Checks whether a color is essentially grayscale, near-black, or near-white."""
    r, g, b = rgb
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    if max_c < 30 or min_c > 235:
        return True
    sat = (max_c - min_c) / max(max_c, 1)
    return sat < 0.18


def extract_dominant_accent(desktop_path: Path | None, mobile_path: Path | None) -> tuple[int, int, int]:
    """Inspects screenshot pixels to identify the dominant brand accent color."""
    images_to_check = []
    for p in [desktop_path, mobile_path]:
        if p and Path(p).exists():
            try:
                images_to_check.append(Image.open(str(p)).convert("RGB"))
            except Exception:
                pass

    if not images_to_check:
        return (59, 130, 246)  # Sophisticated modern blue default

    candidates = []
    for im in images_to_check:
        thumb = im.resize((100, 100), Image.Resampling.BOX)
        for pixel in thumb.getdata():
            r, g, b = pixel[:3]
            max_c = max(r, g, b)
            min_c = min(r, g, b)
            if max_c < 35 or min_c > 235:
                continue
            sat = (max_c - min_c) / max(max_c, 1)
            if sat > 0.25:
                # Weight by saturation and luminance
                score = (sat ** 1.3) * (max_c / 255.0)
                candidates.append((score, (r, g, b)))

    if candidates:
        candidates.sort(key=lambda x: x[0], reverse=True)
        idx = min(len(candidates) // 10, len(candidates) - 1)
        return candidates[idx][1]

    # Neutral elegant fallback for purely monochrome projects
    return (150, 165, 185)


def resolve_theme_accent(
    theme: dict | None,
    desktop_path: Path | None,
    mobile_path: Path | None,
) -> tuple[int, int, int]:
    """Resolves project accent color from metadata or screenshot analysis."""
    if theme and isinstance(theme, dict):
        for key in ["accent", "primary", "secondary"]:
            val = theme.get(key)
            if val and isinstance(val, str):
                val_clean = val.strip().lower()
                if val_clean not in [
                    "#000", "#000000", "#fff", "#ffffff",
                    "#111", "#111111", "#222", "#222222",
                    "#333", "#333333", "black", "white",
                ]:
                    c = parse_color_hex(val)
                    if c and not is_neutral_color(c):
                        return c
    return extract_dominant_accent(desktop_path, mobile_path)


# ── Geometry & Frame Mask Helpers ──────────────────────────────────────────────

def create_rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    """Generates an antialiased 8-bit rounded rectangle mask."""
    w, h = size
    mask = Image.new("L", (w * 2, h * 2), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, w * 2 - 1, h * 2 - 1], radius=radius * 2, fill=255)
    return mask.resize((w, h), Image.Resampling.LANCZOS)


# ── Presentation Environment & Ambient Lighting ───────────────────────────────

def create_ambient_background(
    width: int,
    height: int,
    accent: tuple[int, int, int],
) -> Image.Image:
    """Renders a cinematic, dark studio presentation background with site-derived ambient bloom and surface reflections."""
    bg = Image.new("RGBA", (width, height), (7, 8, 10, 255))
    r_acc, g_acc, b_acc = accent

    # 1. Base vertical tonal gradient
    grad = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    grad_draw = ImageDraw.Draw(grad)
    for y in range(height):
        factor = 1.0 - abs(y - 500) / 950.0
        val = max(0, int(factor * 18))
        grad_draw.line([(0, y), (width, y)], fill=(val, val + 1, val + 3, 255))
    bg = Image.alpha_composite(bg, grad)

    # 2. Ambient Site-Colored Glow behind Devices
    glow_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)

    # Primary diffuse atmospheric bloom behind laptop
    lx, ly = int(width * 0.42), int(height * 0.42)
    for rx, ry, alpha in [
        (920, 580, 26),
        (620, 400, 42),
        (340, 220, 60),
    ]:
        glow_draw.ellipse(
            [lx - rx, ly - ry, lx + rx, ly + ry],
            fill=(r_acc, g_acc, b_acc, alpha),
        )

    # Secondary soft bloom behind phone
    px, py = int(width * 0.78), int(height * 0.48)
    for rx, ry, alpha in [
        (480, 620, 20),
        (280, 360, 36),
    ]:
        glow_draw.ellipse(
            [px - rx, py - ry, px + rx, py + ry],
            fill=(r_acc, g_acc, b_acc, alpha),
        )

    # Ground ambient light pool (reflected warm glow on the table surface)
    gx, gy = int(width * 0.45), int(height * 0.78)
    glow_draw.ellipse(
        [gx - 750, gy - 180, gx + 750, gy + 180],
        fill=(r_acc, g_acc, b_acc, 28),
    )

    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(110))
    bg = Image.alpha_composite(bg, glow_layer)

    # 3. Subtle Editorial Orbital Light Arc (inspired by reference image)
    arc_layer = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    arc_draw = ImageDraw.Draw(arc_layer)
    arc_draw.arc(
        [lx - 850, ly - 560, lx + 850, ly + 560],
        start=195,
        end=345,
        fill=(r_acc, g_acc, b_acc, 45),
        width=4,
    )
    arc_draw.arc(
        [lx - 1000, ly - 680, lx + 1000, ly + 680],
        start=205,
        end=330,
        fill=(r_acc, g_acc, b_acc, 24),
        width=2,
    )
    arc_layer = arc_layer.filter(ImageFilter.GaussianBlur(14))
    bg = Image.alpha_composite(bg, arc_layer)

    # 4. Reflective Ground / Tabletop Plane
    ground_y = int(height * 0.69)
    ground = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    ground_draw = ImageDraw.Draw(ground)

    for y in range(ground_y, height):
        progress = (y - ground_y) / (height - ground_y)
        surface_alpha = int((1.0 - progress * 0.8) * 16)
        tint_r = min(255, int(r_acc * 0.12 + 10))
        tint_g = min(255, int(g_acc * 0.12 + 10))
        tint_b = min(255, int(b_acc * 0.12 + 12))
        ground_draw.line([(0, y), (width, y)], fill=(tint_r, tint_g, tint_b, surface_alpha))

    bg = Image.alpha_composite(bg, ground)

    # 5. Soft Vignette around canvas corners
    vignette = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    vig_draw = ImageDraw.Draw(vignette)
    vig_draw.rectangle([0, 0, width, height], outline=(0, 0, 0, 95), width=180)
    vignette = vignette.filter(ImageFilter.GaussianBlur(120))
    bg = Image.alpha_composite(bg, vignette)

    return bg


# ── Realistic Device Renders ───────────────────────────────────────────────────

def render_laptop_frame(
    desktop_img: Image.Image,
    lid_width: int = 1560,
    lid_height: int = 980,
) -> tuple[Image.Image, Image.Image, int, int]:
    """Renders a modern MacBook Pro style laptop with display lid, notch, aluminum chassis base,
    and multi-layer shadows. Returns (laptop_surface, shadow_surface, total_width, total_height).
    """
    lid_radius = 24
    screen_radius = 12
    bezel_top = 26
    bezel_sides = 18
    bezel_bottom = 26

    base_extra_w = 90
    base_w = lid_width + base_extra_w
    base_h = 28
    notch_w = 116
    notch_h = 22

    total_w = base_w + 180
    total_h = lid_height + base_h + 180

    lid_x = (total_w - lid_width) // 2
    lid_y = 60
    base_x = (total_w - base_w) // 2
    base_y = lid_y + lid_height - 2

    # 1. Drop Shadows
    shadow_img = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(shadow_img)

    # Large ambient shadow
    sh_draw.rounded_rectangle(
        [lid_x + 10, lid_y + 40, lid_x + lid_width - 10, lid_y + lid_height + base_h + 24],
        radius=32,
        fill=(0, 0, 0, 140),
    )
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(55))

    # Base contact shadow
    sh_contact = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sh_c_draw = ImageDraw.Draw(sh_contact)
    sh_c_draw.rounded_rectangle(
        [base_x + 25, base_y + 8, base_x + base_w - 25, base_y + base_h + 18],
        radius=14,
        fill=(0, 0, 0, 200),
    )
    sh_contact = sh_contact.filter(ImageFilter.GaussianBlur(16))
    shadow_img = Image.alpha_composite(shadow_img, sh_contact)

    # Tight ground contact occlusion
    sh_tight = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sh_t_draw = ImageDraw.Draw(sh_tight)
    sh_t_draw.ellipse(
        [base_x + 40, base_y + base_h - 4, base_x + base_w - 40, base_y + base_h + 12],
        fill=(0, 0, 0, 245),
    )
    sh_tight = sh_tight.filter(ImageFilter.GaussianBlur(7))
    shadow_img = Image.alpha_composite(shadow_img, sh_tight)

    # 2. Laptop Body
    laptop_img = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    lap_draw = ImageDraw.Draw(laptop_img)

    # Display Lid Outer Chassis
    lap_draw.rounded_rectangle(
        [lid_x, lid_y, lid_x + lid_width, lid_y + lid_height],
        radius=lid_radius,
        fill=(23, 24, 28, 255),
    )

    # Metallic chamfer highlight rim
    lap_draw.rounded_rectangle(
        [lid_x, lid_y, lid_x + lid_width, lid_y + lid_height],
        radius=lid_radius,
        outline=(115, 120, 130, 180),
        width=1,
    )

    # Inner display bezel
    screen_x = lid_x + bezel_sides
    screen_y = lid_y + bezel_top
    screen_w = lid_width - bezel_sides * 2
    screen_h = lid_height - bezel_top - bezel_bottom

    lap_draw.rounded_rectangle(
        [screen_x - 1, screen_y - 1, screen_x + screen_w + 1, screen_y + screen_h + 1],
        radius=screen_radius,
        fill=(9, 9, 11, 255),
    )

    # Authentic Website Screenshot
    screen_layer = Image.new("RGBA", (screen_w, screen_h), (0, 0, 0, 0))
    scaled_desktop = desktop_img.convert("RGBA").resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    screen_layer.paste(scaled_desktop, (0, 0))

    # Subtle Glass Sheen / Specular reflection
    glass = Image.new("RGBA", (screen_w, screen_h), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glass)
    for i in range(160):
        alpha = int((1.0 - i / 160.0) * 14)
        g_draw.line([(screen_w - 280 + i * 2, 0), (screen_w, 280 - i * 2)], fill=(255, 255, 255, alpha), width=3)
    glass = glass.filter(ImageFilter.GaussianBlur(8))
    screen_layer = Image.alpha_composite(screen_layer, glass)

    # Corner clipping mask
    screen_mask = create_rounded_mask((screen_w, screen_h), screen_radius)
    screen_alpha = screen_layer.split()[3]
    final_alpha = ImageChops.multiply(screen_alpha, screen_mask)
    screen_layer.putalpha(final_alpha)

    laptop_img.alpha_composite(screen_layer, (screen_x, screen_y))

    # Display Inner Border
    lap_draw.rounded_rectangle(
        [screen_x, screen_y, screen_x + screen_w, screen_y + screen_h],
        radius=screen_radius,
        outline=(50, 52, 60, 160),
        width=1,
    )

    # Top Camera Notch
    notch_x1 = lid_x + (lid_width - notch_w) // 2
    notch_x2 = notch_x1 + notch_w
    notch_y1 = lid_y + bezel_top - 2
    notch_y2 = notch_y1 + notch_h

    lap_draw.rounded_rectangle(
        [notch_x1, notch_y1, notch_x2, notch_y2],
        radius=8,
        fill=(11, 11, 13, 255),
    )
    cam_cx = (notch_x1 + notch_x2) // 2
    cam_cy = notch_y1 + 10
    lap_draw.ellipse([cam_cx - 4, cam_cy - 4, cam_cx + 4, cam_cy + 4], fill=(20, 28, 38, 255))
    lap_draw.ellipse([cam_cx - 2, cam_cy - 2, cam_cx + 2, cam_cy + 2], fill=(45, 95, 145, 255))
    lap_draw.ellipse([cam_cx, cam_cy - 1, cam_cx + 1, cam_cy], fill=(255, 255, 255, 180))
    lap_draw.ellipse([cam_cx + 15, cam_cy - 1, cam_cx + 17, cam_cy + 1], fill=(18, 65, 35, 190))

    # Aluminum Lower Base / Keyboard Deck
    lap_draw.rounded_rectangle(
        [base_x, base_y, base_x + base_w, base_y + base_h],
        radius=10,
        fill=(30, 31, 36, 255),
    )

    # Top chamfer edge highlight
    lap_draw.line(
        [(base_x + 8, base_y), (base_x + base_w - 8, base_y)],
        fill=(170, 175, 185, 230),
        width=1,
    )
    lap_draw.line(
        [(base_x + 12, base_y + 1), (base_x + base_w - 12, base_y + 1)],
        fill=(95, 100, 110, 180),
        width=1,
    )

    # Center thumb indent notch
    thumb_w = 170
    thumb_h = 8
    thumb_x1 = base_x + (base_w - thumb_w) // 2
    thumb_x2 = thumb_x1 + thumb_w
    thumb_y = base_y
    lap_draw.rounded_rectangle(
        [thumb_x1, thumb_y, thumb_x2, thumb_y + thumb_h],
        radius=4,
        fill=(16, 17, 20, 255),
    )
    lap_draw.line(
        [(thumb_x1 + 4, thumb_y + thumb_h), (thumb_x2 - 4, thumb_y + thumb_h)],
        fill=(140, 145, 155, 210),
        width=1,
    )

    # Recessed bottom foot lip
    lap_draw.line(
        [(base_x + 10, base_y + base_h), (base_x + base_w - 10, base_y + base_h)],
        fill=(10, 10, 12, 255),
        width=1,
    )

    return laptop_img, shadow_img, total_w, total_h


def render_phone_frame(
    mobile_img: Image.Image,
    phone_width: int = 470,
    phone_height: int = 970,
) -> tuple[Image.Image, Image.Image, int, int]:
    """Renders a modern premium smartphone with titanium frame, bezel, Dynamic Island, and shadows.
    Returns (phone_surface, shadow_surface, total_width, total_height).
    """
    corner_radius = 52
    screen_radius = 44
    bezel = 14
    notch_w = 120
    notch_h = 32

    pad_w = 160
    pad_h = 160
    total_w = phone_width + pad_w * 2
    total_h = phone_height + pad_h * 2

    px = pad_w
    py = pad_h

    # 1. Drop Shadows
    shadow_img = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(shadow_img)

    # Wide ambient shadow
    sh_draw.rounded_rectangle(
        [px - 28, py + 26, px + phone_width + 16, py + phone_height + 48],
        radius=corner_radius + 4,
        fill=(0, 0, 0, 155),
    )
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(42))

    # Closer contact shadow
    sh_contact = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sh_c_draw = ImageDraw.Draw(sh_contact)
    sh_c_draw.rounded_rectangle(
        [px - 14, py + 14, px + phone_width + 6, py + phone_height + 24],
        radius=corner_radius,
        fill=(0, 0, 0, 195),
    )
    sh_contact = sh_contact.filter(ImageFilter.GaussianBlur(16))
    shadow_img = Image.alpha_composite(shadow_img, sh_contact)

    # Ground contact shadow
    sh_ground = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    sh_g_draw = ImageDraw.Draw(sh_ground)
    sh_g_draw.ellipse(
        [px + 20, py + phone_height - 6, px + phone_width - 20, py + phone_height + 18],
        fill=(0, 0, 0, 245),
    )
    sh_ground = sh_ground.filter(ImageFilter.GaussianBlur(8))
    shadow_img = Image.alpha_composite(shadow_img, sh_ground)

    # 2. Phone Body
    phone_img = Image.new("RGBA", (total_w, total_h), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(phone_img)

    # Titanium Outer Frame
    p_draw.rounded_rectangle(
        [px, py, px + phone_width, py + phone_height],
        radius=corner_radius,
        fill=(28, 29, 33, 255),
    )

    # Metallic outer rim specular highlight
    p_draw.rounded_rectangle(
        [px, py, px + phone_width, py + phone_height],
        radius=corner_radius,
        outline=(150, 155, 165, 215),
        width=2,
    )

    # Inner bezel
    screen_x = px + bezel
    screen_y = py + bezel
    screen_w = phone_width - bezel * 2
    screen_h = phone_height - bezel * 2

    p_draw.rounded_rectangle(
        [screen_x - 1, screen_y - 1, screen_x + screen_w + 1, screen_y + screen_h + 1],
        radius=screen_radius,
        fill=(10, 10, 12, 255),
    )

    # Authentic Mobile Screenshot
    mob_screen_layer = Image.new("RGBA", (screen_w, screen_h), (0, 0, 0, 0))
    scaled_mobile = mobile_img.convert("RGBA").resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    mob_screen_layer.paste(scaled_mobile, (0, 0))

    # Subtle Screen Glass Reflection
    p_glass = Image.new("RGBA", (screen_w, screen_h), (0, 0, 0, 0))
    pg_draw = ImageDraw.Draw(p_glass)
    for i in range(110):
        alpha = int((1.0 - i / 110.0) * 12)
        pg_draw.line([(0, i * 3), (screen_w - 60 + i * 2, 0)], fill=(255, 255, 255, alpha), width=2)
    p_glass = p_glass.filter(ImageFilter.GaussianBlur(6))
    mob_screen_layer = Image.alpha_composite(mob_screen_layer, p_glass)

    # Corner clipping
    mob_mask = create_rounded_mask((screen_w, screen_h), screen_radius)
    mob_alpha = mob_screen_layer.split()[3]
    final_mob_alpha = ImageChops.multiply(mob_alpha, mob_mask)
    mob_screen_layer.putalpha(final_mob_alpha)

    phone_img.alpha_composite(mob_screen_layer, (screen_x, screen_y))

    # Inner Screen Border
    p_draw.rounded_rectangle(
        [screen_x, screen_y, screen_x + screen_w, screen_y + screen_h],
        radius=screen_radius,
        outline=(50, 52, 60, 160),
        width=1,
    )

    # Dynamic Island Pill
    di_x1 = px + (phone_width - notch_w) // 2
    di_x2 = di_x1 + notch_w
    di_y1 = py + bezel + 12
    di_y2 = di_y1 + notch_h

    p_draw.rounded_rectangle(
        [di_x1, di_y1, di_x2, di_y2],
        radius=notch_h // 2,
        fill=(5, 5, 6, 255),
    )
    cam_x = di_x2 - 22
    cam_y = (di_y1 + di_y2) // 2
    p_draw.ellipse([cam_x - 4, cam_y - 4, cam_x + 4, cam_y + 4], fill=(16, 24, 34, 255))
    p_draw.ellipse([cam_x - 2, cam_y - 2, cam_x + 2, cam_y + 2], fill=(35, 75, 115, 240))
    p_draw.ellipse([cam_x, cam_y - 1, cam_x + 1, cam_y], fill=(255, 255, 255, 160))

    # Speaker micro-slit
    speaker_w = 58
    speaker_x1 = px + (phone_width - speaker_w) // 2
    speaker_y = py + 5
    p_draw.rounded_rectangle(
        [speaker_x1, speaker_y, speaker_x1 + speaker_w, speaker_y + 3],
        radius=2,
        fill=(14, 15, 18, 255),
    )

    return phone_img, shadow_img, total_w, total_h


# ── High-Resolution Master Composition ─────────────────────────────────────────

def create_mockup_composition(
    desktop_path: Path,
    mobile_path: Path,
    output_path: Path,
    theme: dict | None = None,
) -> Path:
    """Composites authentic desktop and mobile screenshots inside photorealistic dark-mode device frames

    onto a high-resolution portfolio presentation canvas (2400x1500) with site-derived ambient lighting.
    """
    CANVAS_W = 2400
    CANVAS_H = 1500

    # 1. Resolve site-derived theme accent
    accent = resolve_theme_accent(theme, desktop_path, mobile_path)

    # 2. Render atmospheric studio background
    canvas = create_ambient_background(CANVAS_W, CANVAS_H, accent)

    # 3. Load screenshots
    try:
        desk_img = Image.open(str(desktop_path)).convert("RGB")
    except Exception:
        desk_img = Image.new("RGB", (1440, 900), (18, 18, 20))

    try:
        mob_img = Image.open(str(mobile_path)).convert("RGB")
    except Exception:
        mob_img = Image.new("RGB", (390, 844), (20, 20, 22))

    # 4. Render Laptop & Shadow (Hero device: ~74% visual width)
    laptop_lid_w = 1560
    laptop_lid_h = 980
    laptop_img, laptop_shadow, lap_tot_w, lap_tot_h = render_laptop_frame(desk_img, laptop_lid_w, laptop_lid_h)

    lap_base_extra = 90
    lap_base_w = laptop_lid_w + lap_base_extra
    lap_canvas_x = 110
    lap_canvas_y = 135

    lid_offset_x = (lap_tot_w - laptop_lid_w) // 2
    lid_offset_y = 60
    paste_lap_x = lap_canvas_x - lid_offset_x
    paste_lap_y = lap_canvas_y - lid_offset_y

    # Paste laptop shadow
    canvas.paste(laptop_shadow, (paste_lap_x, paste_lap_y), laptop_shadow)

    # 5. Render Ground Reflection for Laptop Base
    base_deck_y = lap_canvas_y + laptop_lid_h - 2
    base_deck_bottom = base_deck_y + 28
    try:
        lap_crop = laptop_img.crop((
            max(0, (lap_tot_w - lap_base_w) // 2 - 20),
            lid_offset_y + laptop_lid_h - 40,
            min(lap_tot_w, (lap_tot_w + lap_base_w) // 2 + 20),
            lid_offset_y + laptop_lid_h + 30,
        ))
        lap_refl = lap_crop.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        refl_w, refl_h = lap_refl.size
        refl_mask = Image.new("L", (refl_w, refl_h), 0)
        refl_draw = ImageDraw.Draw(refl_mask)
        for ry in range(refl_h):
            f_alpha = int((1.0 - ry / max(refl_h, 1)) * 65)
            refl_draw.line([(0, ry), (refl_w, ry)], fill=f_alpha)
        lap_refl = lap_refl.filter(ImageFilter.GaussianBlur(6))
        canvas.paste(lap_refl, (lap_canvas_x - lap_base_extra // 2 - 20, base_deck_bottom - 2), refl_mask)
    except Exception:
        pass

    # Paste laptop body
    canvas.paste(laptop_img, (paste_lap_x, paste_lap_y), laptop_img)

    # 6. Render Mobile Phone & Shadow (Foreground device)
    phone_w = 470
    phone_h = 970
    phone_img, phone_shadow, mob_tot_w, mob_tot_h = render_phone_frame(mob_img, phone_w, phone_h)

    # Overlap positioning: sits on the right, slightly overlapping laptop base
    phone_canvas_x = 1710
    phone_canvas_y = base_deck_bottom - phone_h + 4

    pad_w = 160
    pad_h = 160
    paste_mob_x = phone_canvas_x - pad_w
    paste_mob_y = phone_canvas_y - pad_h

    # Paste phone shadow
    canvas.paste(phone_shadow, (paste_mob_x, paste_mob_y), phone_shadow)

    # Phone ground contact reflection
    try:
        phone_crop = phone_img.crop((pad_w - 10, pad_h + phone_h - 70, pad_w + phone_w + 10, pad_h + phone_h))
        phone_refl = phone_crop.transpose(Image.Transpose.FLIP_TOP_BOTTOM)
        pr_w, pr_h = phone_refl.size
        pr_mask = Image.new("L", (pr_w, pr_h), 0)
        pr_draw = ImageDraw.Draw(pr_mask)
        for ry in range(pr_h):
            pr_alpha = int((1.0 - ry / max(pr_h, 1)) * 75)
            pr_draw.line([(0, ry), (pr_w, ry)], fill=pr_alpha)
        phone_refl = phone_refl.filter(ImageFilter.GaussianBlur(6))
        canvas.paste(phone_refl, (phone_canvas_x - 10, phone_canvas_y + phone_h - 2), pr_mask)
    except Exception:
        pass

    # Paste phone body in foreground
    canvas.paste(phone_img, (paste_mob_x, paste_mob_y), phone_img)

    # 7. Convert to RGB and export
    final_img = canvas.convert("RGB")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    final_img.save(str(output_path), "JPEG", quality=94, subsampling=0)
    return output_path
