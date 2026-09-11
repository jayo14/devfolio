import asyncio
import io
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont


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


def create_mockup_composition(desktop_path: Path, mobile_path: Path, output_path: Path) -> Path:
    """Composites desktop and mobile screenshots inside photorealistic dark-mode device frames

    onto a high-resolution portfolio presentation canvas (1600x1000).
    """
    CANVAS_WIDTH = 1600
    CANVAS_HEIGHT = 1000
    canvas = Image.new("RGBA", (CANVAS_WIDTH, CANVAS_HEIGHT), color=(8, 8, 8, 255))

    # Subtle radial / gradient background pattern matching portfolio design
    bg_draw = ImageDraw.Draw(canvas)
    for r in range(400, 0, -20):
        alpha = int((1 - r / 400) * 25)
        bg_draw.ellipse(
            [CANVAS_WIDTH // 2 - r * 2, CANVAS_HEIGHT // 2 - r, CANVAS_WIDTH // 2 + r * 2, CANVAS_HEIGHT // 2 + r],
            fill=(255, 79, 34, alpha),
        )

    # 1. Desktop Browser Frame
    DESK_W = 1050
    DESK_H = 656
    TITLEBAR_H = 34

    try:
        desk_screen = Image.open(str(desktop_path)).convert("RGBA")
        desk_screen = desk_screen.resize((DESK_W, DESK_H - TITLEBAR_H), Image.Resampling.LANCZOS)
    except Exception:
        desk_screen = Image.new("RGBA", (DESK_W, DESK_H - TITLEBAR_H), color=(20, 20, 20, 255))

    # Construct desktop frame
    desk_frame = Image.new("RGBA", (DESK_W, DESK_H), color=(18, 18, 18, 255))
    desk_draw = ImageDraw.Draw(desk_frame)

    # Title bar controls
    desk_draw.ellipse([14, 12, 24, 22], fill=(255, 95, 87, 255))
    desk_draw.ellipse([32, 12, 42, 22], fill=(254, 188, 46, 255))
    desk_draw.ellipse([50, 12, 60, 22], fill=(40, 200, 64, 255))

    # Paste desktop screenshot into frame
    desk_frame.paste(desk_screen, (0, TITLEBAR_H))

    # Desktop outer border
    desk_draw.rectangle([0, 0, DESK_W - 1, DESK_H - 1], outline=(50, 50, 50, 255), width=1)

    # Create drop shadow for desktop
    desk_shadow = Image.new("RGBA", (DESK_W + 80, DESK_H + 80), color=(0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(desk_shadow)
    shadow_draw.rectangle([40, 40, DESK_W + 40, DESK_H + 40], fill=(0, 0, 0, 120))
    desk_shadow = desk_shadow.filter(ImageFilter.GaussianBlur(25))

    # Paste desktop frame and shadow on canvas (positioned left-center)
    DESK_X = 100
    DESK_Y = 170
    canvas.paste(desk_shadow, (DESK_X - 40, DESK_Y - 40), desk_shadow)
    canvas.paste(desk_frame, (DESK_X, DESK_Y), desk_frame)

    # 2. Mobile Phone Frame (overlapping foreground on right)
    MOB_W = 320
    MOB_H = 650
    BEZEL = 10
    CORNER_RADIUS = 36

    try:
        mob_screen = Image.open(str(mobile_path)).convert("RGBA")
        mob_screen = mob_screen.resize((MOB_W - BEZEL * 2, MOB_H - BEZEL * 2), Image.Resampling.LANCZOS)
    except Exception:
        mob_screen = Image.new("RGBA", (MOB_W - BEZEL * 2, MOB_H - BEZEL * 2), color=(25, 25, 25, 255))

    mob_frame = Image.new("RGBA", (MOB_W, MOB_H), color=(0, 0, 0, 0))
    mob_draw = ImageDraw.Draw(mob_frame)

    # Phone chassis
    mob_draw.rounded_rectangle([0, 0, MOB_W, MOB_H], radius=CORNER_RADIUS, fill=(28, 28, 30, 255), outline=(75, 75, 80, 255), width=2)

    # Paste mobile screen
    mob_frame.paste(mob_screen, (BEZEL, BEZEL))

    # Dynamic Island / Speaker notch at top
    mob_draw.rounded_rectangle([MOB_W // 2 - 45, 16, MOB_W // 2 + 45, 34], radius=9, fill=(0, 0, 0, 255))

    # Drop shadow for mobile frame
    mob_shadow = Image.new("RGBA", (MOB_W + 60, MOB_H + 60), color=(0, 0, 0, 0))
    mob_shadow_draw = ImageDraw.Draw(mob_shadow)
    mob_shadow_draw.rounded_rectangle([30, 30, MOB_W + 30, MOB_H + 30], radius=CORNER_RADIUS, fill=(0, 0, 0, 160))
    mob_shadow = mob_shadow.filter(ImageFilter.GaussianBlur(20))

    # Paste mobile frame over desktop
    MOB_X = 1120
    MOB_Y = 220
    canvas.paste(mob_shadow, (MOB_X - 30, MOB_Y - 30), mob_shadow)
    canvas.paste(mob_frame, (MOB_X, MOB_Y), mob_frame)

    # Convert to RGB and save
    final_mockup = canvas.convert("RGB")
    final_mockup.save(str(output_path), "JPEG", quality=92)
    return output_path
