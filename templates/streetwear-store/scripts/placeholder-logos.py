"""Generate PLACEHOLDER logos for a new brand (before the real logo is designed).

Draws five simple marks with Pillow and traces them with scripts/vectorize.py, so
the result is path-only SVG (no <text>, no external fonts at runtime):

  wordmark  NAME in a heavy sans
  monogram  SHORT name (2 x 2 grid when it has 4 letters)
  graphic   NAME with its middle letter replaced by a four-point star
  emblem    ring + four-point star (no text)
  seal      double ring, "NAME · TAGLINE · YEAR" around, star in the middle

Requirements:  pip install potracer pillow numpy
Usage:
  python3 scripts/placeholder-logos.py --name BRAND --short BRND --tagline "Your tagline" --year 2026
  npm run logos            # -> public/brand/*-black|white.svg + src/components/brand/logoData.js

Options: --font /path/to/Bold.ttf (any heavy sans; defaults try Inter ExtraBold,
DejaVu Sans Bold, Arial Bold) · --tracking -0.02 (em) · --out public/brand
Replace these with the real logo as soon as it exists (see TEMPLATE.md · Logo).
"""
import argparse
import math
import os
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFont

sys.dont_write_bytecode = True  # keep scripts/ free of __pycache__
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from vectorize import vectorize  # noqa: E402

FONT_CANDIDATES = [
    "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf",
    "/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]
INK, PAPER = 0, 255


def find_font(path):
    for p in [path] + FONT_CANDIDATES:
        if p and os.path.exists(p):
            return p
    raise SystemExit("No bold font found: pass --font /path/to/a/Bold.ttf")


def star(draw, cx, cy, R, r_ratio=0.3, fill=INK):
    pts = []
    for k in range(8):
        a = math.radians(-90 + 45 * k)
        rad = R if k % 2 == 0 else R * r_ratio
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    draw.polygon(pts, fill=fill)


def text_run(font, text, tracking_px):
    """Width of a string drawn char by char with extra tracking."""
    return sum(font.getlength(ch) for ch in text) + tracking_px * (len(text) - 1)


def draw_text(draw, xy, font, text, tracking_px, star_for=None, cap_h=None):
    """Draw `text` char by char from top-left `xy`; a char equal to `star_for` is drawn as a star."""
    x, y = xy
    for ch in text:
        w = font.getlength(ch if ch != star_for else "O")
        if ch == star_for:
            top = font.getbbox("H")[1]  # text origin -> cap top
            star(draw, x + w / 2, y + top + cap_h / 2, cap_h * 0.5, r_ratio=0.24)
        else:
            draw.text((x, y), ch, font=font, fill=INK)
        x += w + tracking_px


def canvas(w, h):
    img = Image.new("L", (int(w), int(h)), PAPER)
    return img, ImageDraw.Draw(img)


def cap_metrics(font):
    l, t, r, b = font.getbbox("H")
    return t, b - t  # top offset, cap height


def make_wordmark(fontp, name, tracking, size=1000, star_middle=False):
    font = ImageFont.truetype(fontp, size)
    top, cap = cap_metrics(font)
    tr = tracking * size
    text = name
    star_ch = None
    if star_middle and len(name) >= 3:
        mid = len(name) // 2
        star_ch = "\u2726"
        text = name[:mid] + star_ch + name[mid + 1 :]
    w = sum(font.getlength(c if c != star_ch else "O") for c in text) + tr * (len(text) - 1)
    img, d = canvas(w + 200, cap + 200)
    draw_text(d, (100, 100 - top), font, text, tr, star_for=star_ch, cap_h=cap)
    return img


def make_monogram(fontp, short, tracking, size=1000):
    font = ImageFont.truetype(fontp, size)
    top, cap = cap_metrics(font)
    tr = tracking * size
    if len(short) == 4:
        rows = [short[:2], short[2:]]
        gap = cap * 0.18
        w = max(text_run(font, r, tr) for r in rows)
        img, d = canvas(w + 200, cap * 2 + gap + 200)
        for i, row in enumerate(rows):
            rw = text_run(font, row, tr)
            draw_text(d, (100 + (w - rw) / 2, 100 - top + i * (cap + gap)), font, row, tr)
        return img
    w = text_run(font, short, tr)
    img, d = canvas(w + 200, cap + 200)
    draw_text(d, (100, 100 - top), font, short, tr)
    return img


def make_emblem(size=1200):
    img, d = canvas(size, size)
    c, R = size / 2, size * 0.46
    ring = size * 0.05
    d.ellipse([c - R, c - R, c + R, c + R], fill=INK)
    d.ellipse([c - R + ring, c - R + ring, c + R - ring, c + R - ring], fill=PAPER)
    star(d, c, c, R * 0.72, r_ratio=0.26)
    return img


def make_seal(fontp, text, size=2400, lead=""):
    img, d = canvas(size, size)
    c = size / 2
    R1, R2 = size * 0.47, size * 0.455  # outer ring
    R3, R4 = size * 0.335, size * 0.322  # inner ring
    for a, b in ((R1, R2), (R3, R4)):
        d.ellipse([c - a, c - a, c + a, c + a], fill=INK)
        d.ellipse([c - b, c - b, c + b, c + b], fill=PAPER)
    star(d, c, c, R4 * 0.62, r_ratio=0.26)

    # Text around the band between the rings, filling the full circle.
    band_mid = (R2 + R3) / 2
    fs = int((R2 - R3) * 0.62)
    font = ImageFont.truetype(fontp, fs)
    top, cap = cap_metrics(font)
    widths = [font.getlength(ch) for ch in text]
    circ = 2 * math.pi * band_mid
    while sum(widths) > circ * 0.94 and fs > 10:
        fs -= 2
        font = ImageFont.truetype(fontp, fs)
        top, cap = cap_metrics(font)
        widths = [font.getlength(ch) for ch in text]
    extra = (circ - sum(widths)) / len(text)
    # Centre the first word (the brand name) at the top of the seal.
    first = text.split(" ")[0]
    pos = -(sum(widths[: len(first)]) + extra * (len(first) - 1)) / 2
    for ch, w in zip(text, widths):
        theta = (pos + w / 2) / band_mid  # radians from top, clockwise
        pos += w + extra
        if ch == " ":
            continue
        glyph = Image.new("L", (int(w + fs), int(fs * 2)), 0)
        ImageDraw.Draw(glyph).text((fs / 2, fs - top - cap / 2), ch, font=font, fill=255)
        rot = glyph.rotate(-math.degrees(theta), resample=Image.BICUBIC, expand=True)
        x = c + band_mid * math.sin(theta) - rot.width / 2
        y = c - band_mid * math.cos(theta) - rot.height / 2
        img.paste(INK, (int(round(x)), int(round(y))), rot)
    return img


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--name", default="BRAND")
    ap.add_argument("--short", default=None, help="short mark, default: consonants of name (max 4)")
    ap.add_argument("--tagline", default="Your tagline")
    ap.add_argument("--year", default="2026")
    ap.add_argument("--font", default=None)
    ap.add_argument("--tracking", type=float, default=-0.01, help="letter spacing in em")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "brand"))
    a = ap.parse_args()

    name = a.name.upper()
    short = (a.short or "".join(ch for ch in name if ch not in "AEIOU")[:4] or name[:4]).upper()
    fontp = find_font(a.font)
    os.makedirs(a.out, exist_ok=True)
    seal_text = f"{name} \u00b7 {a.tagline.upper()} \u00b7 EST. {a.year} \u00b7 "

    marks = {
        "wordmark": make_wordmark(fontp, name, a.tracking),
        "monogram": make_monogram(fontp, short, a.tracking),
        "graphic": make_wordmark(fontp, name, a.tracking + 0.04, star_middle=True),
        "emblem": make_emblem(),
        "seal": make_seal(fontp, seal_text),
    }
    with tempfile.TemporaryDirectory() as tmp:
        for variant, img in marks.items():
            png = os.path.join(tmp, f"{variant}.png")
            img.save(png)
            dst = os.path.join(a.out, f"{variant}.svg")
            w, h, n = vectorize(png, dst)
            print(f"{variant:9s} -> {os.path.relpath(dst)}  ({w}x{h}, {n} bytes)")
    print(f"font: {fontp}\nNext: npm run logos")


if __name__ == "__main__":
    main()
