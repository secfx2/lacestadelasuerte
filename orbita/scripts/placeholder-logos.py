"""Generate the typographic logo system for a brand (ÓRBITA edition: orbit motif).

Draws five marks with Pillow and traces them with scripts/vectorize.py, so the
result is path-only SVG (no <text>, no external fonts at runtime):

  wordmark  NAME in the display face (accents such as Ó are kept inside the canvas)
  monogram  SHORT name; its first O gets a centred dot (a planet in orbit)
  graphic   NAME wrapped by a tilted orbit ring (front arc knocked out over the letters)
            with a small satellite riding the ring
  emblem    planet + tilted ring + satellite (no text): favicon, placeholders
  seal      double ring, "NAME · TAGLINE · CITY · EST. YEAR" around, emblem in the middle

Requirements:  pip install potracer pillow numpy
Usage:
  python3 scripts/placeholder-logos.py --name "ÓRBITA" --short ORB --tagline "Fuera de órbita" \
      --year 2026 --city Madrid --font /path/to/Syncopate-Bold.ttf
  npm run logos            # -> public/brand/*-black|white.svg + src/components/brand/logoData.js

Options: --font /path/to/Bold.ttf (defaults try Inter ExtraBold, DejaVu Sans Bold, Arial Bold)
         --tracking 0.02 (em, wordmark) · --out public/brand · --city Madrid (seal)
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


def canvas(w, h):
    img = Image.new("L", (int(w), int(h)), PAPER)
    return img, ImageDraw.Draw(img)


def cap_metrics(font):
    l, t, r, b = font.getbbox("H")
    return t, b - t  # top offset, cap height


def text_run(font, text, tracking_px):
    """Width of a string drawn char by char with extra tracking."""
    return sum(font.getlength(ch) for ch in text) + tracking_px * (len(text) - 1)


def draw_text(draw, xy, font, text, tracking_px, fill=INK, stroke=0, stroke_fill=PAPER):
    """Draw `text` char by char from origin `xy`. Returns the list of (char, x, advance)."""
    x, y = xy
    out = []
    for ch in text:
        w = font.getlength(ch)
        draw.text((x, y), ch, font=font, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
        out.append((ch, x, w))
        x += w + tracking_px
    return out


# --------------------------------------------------------------------------- orbit geometry
def ellipse_pts(cx, cy, rx, ry, rot_deg, t0, t1, n=720):
    """Points of a rotated ellipse between parameters t0..t1 (radians). Image coords (y down)."""
    th = math.radians(rot_deg)
    ct, st = math.cos(th), math.sin(th)
    pts = []
    for i in range(n + 1):
        t = t0 + (t1 - t0) * i / n
        x, y = rx * math.cos(t), ry * math.sin(t)
        pts.append((cx + x * ct - y * st, cy + x * st + y * ct))
    return pts


def ellipse_point(cx, cy, rx, ry, rot_deg, t):
    return ellipse_pts(cx, cy, rx, ry, rot_deg, t, t, 1)[0]


def band(draw, cx, cy, rx, ry, rot_deg, t0, t1, width, fill, n=1440, caps=True):
    """A clean stroke of constant `width` along a rotated elliptical arc, drawn as one polygon
    (offset curves along the normal) so there are no polyline seams. Optional round caps."""
    th = math.radians(rot_deg)
    ct, st = math.cos(th), math.sin(th)
    outer, inner = [], []
    h = width / 2
    for i in range(n + 1):
        t = t0 + (t1 - t0) * i / n
        x, y = rx * math.cos(t), ry * math.sin(t)
        dx, dy = -rx * math.sin(t), ry * math.cos(t)  # tangent
        L = math.hypot(dx, dy) or 1
        nx, ny = dy / L, -dx / L  # outward normal (unrotated frame)
        for sgn, acc in ((1, outer), (-1, inner)):
            px, py = x + sgn * h * nx, y + sgn * h * ny
            acc.append((cx + px * ct - py * st, cy + px * st + py * ct))
    draw.polygon(outer + inner[::-1], fill=fill)
    for t in (t0, t1) if caps else ():
        x, y = ellipse_point(cx, cy, rx, ry, rot_deg, t)
        draw.ellipse([x - h, y - h, x + h, y + h], fill=fill)


def disc(draw, x, y, r, fill=INK):
    draw.ellipse([x - r, y - r, x + r, y + r], fill=fill)


# --------------------------------------------------------------------------- marks
def make_wordmark(fontp, name, tracking, size=1000):
    font = ImageFont.truetype(fontp, size)
    tr = tracking * size
    w = text_run(font, name, tr)
    img, d = canvas(w + 400, size * 2)  # generous: vectorize() crops to the ink (accents included)
    draw_text(d, (200, size * 0.5), font, name, tr)
    return img


def make_monogram(fontp, short, tracking, size=1000, dot=True):
    """SHORT in one row; the first O gets a planet dot in its counter."""
    font = ImageFont.truetype(fontp, size)
    top, cap = cap_metrics(font)
    tr = tracking * size
    w = text_run(font, short, tr)
    img, d = canvas(w + 400, size * 2)
    oy = size * 0.5
    runs = draw_text(d, (200, oy), font, short, tr)
    if dot:
        for ch, x, adv in runs:
            if ch in "OÓ0":
                l, t, r, b = font.getbbox("O")
                disc(d, x + (l + r) / 2, oy + (t + b) / 2, cap * 0.15)
                break
    return img


def make_graphic(fontp, name, tracking, size=1000):
    """NAME wrapped by a tilted orbit ring + satellite (garment / campaign graphic).
    The back half of the ring disappears behind the word block; the front half crosses the
    last letter with a paper knockout, so the one-colour mark stays legible."""
    font = ImageFont.truetype(fontp, size)
    top, cap = cap_metrics(font)
    tr = tracking * size
    w = text_run(font, name, tr)
    W, H = w + size * 1.6, size * 3.4
    img, d = canvas(W, H)
    x0, y0 = (W - w) / 2, H / 2 - top - cap / 2  # cap band centred vertically
    cx, cy = W / 2, H / 2

    rx, ry, rot = w * 0.6, cap * 0.8, -5
    ring = cap * 0.075
    gap = cap * 0.075

    # 1) back half of the ring, hidden behind the whole word block (accents included)
    band(d, cx, cy, rx, ry, rot, math.pi, 2 * math.pi, ring, INK)
    ink_top = min(font.getbbox(ch)[1] for ch in name)
    d.rectangle([x0 - gap, y0 + ink_top - gap, x0 + w + gap, y0 + top + cap + gap], fill=PAPER)
    # 2) letters
    draw_text(d, (x0, y0), font, name, tr)
    # 3) front half of the ring, with a paper halo where it crosses the letters
    band(d, cx, cy, rx, ry, rot, 0.04, math.pi - 0.04, ring + 2 * gap, PAPER, caps=False)
    band(d, cx, cy, rx, ry, rot, 0, math.pi, ring, INK)
    # 4) satellite riding the right end of the ring
    sx, sy = ellipse_point(cx, cy, rx, ry, rot, math.radians(20))
    disc(d, sx, sy, ring * 1.9 + gap, PAPER)
    disc(d, sx, sy, ring * 1.9)
    return img


def draw_emblem(d, c, R):
    """Orbit: tilted elliptical ring around a planet, with a satellite riding the ring
    (fits a circle of radius R centred at (c, c)). Reads down to 16 px."""
    rx, ry, rot = R * 0.98, R * 0.36, -24
    ring = R * 0.08
    band(d, c, c, rx, ry, rot, 0, 2 * math.pi, ring, INK, caps=False)
    disc(d, c, c, R * 0.24)  # planet
    sx, sy = ellipse_point(c, c, rx, ry, rot, math.radians(-60))  # satellite, upper right
    disc(d, sx, sy, R * 0.18, PAPER)
    disc(d, sx, sy, R * 0.12)


def make_emblem(size=1600):
    img, d = canvas(size, size)
    draw_emblem(d, size / 2, size * 0.47)
    return img


def make_seal(fontp, text, size=2400):
    img, d = canvas(size, size)
    c = size / 2
    R1, R2 = size * 0.47, size * 0.458  # outer ring
    R3, R4 = size * 0.322, size * 0.31  # inner ring
    for a, b in ((R1, R2), (R3, R4)):
        d.ellipse([c - a, c - a, c + a, c + a], fill=INK)
        d.ellipse([c - b, c - b, c + b, c + b], fill=PAPER)
    draw_emblem(d, c, R4 * 0.72)

    # Text around the band between the rings, filling the full circle.
    band_mid = (R2 + R3) / 2
    fs = int((R2 - R3) * 0.5)
    font = ImageFont.truetype(fontp, fs)
    top, cap = cap_metrics(font)
    widths = [font.getlength(ch) for ch in text]
    circ = 2 * math.pi * band_mid
    while sum(widths) > circ * 0.9 and fs > 10:
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
    ap.add_argument("--city", default="", help="optional city for the seal")
    ap.add_argument("--font", default=None)
    ap.add_argument("--tracking", type=float, default=0.02, help="letter spacing in em (wordmark)")
    ap.add_argument("--out", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "brand"))
    a = ap.parse_args()

    name = a.name.upper()
    short = (a.short or "".join(ch for ch in name if ch not in "AEIOUÁÉÍÓÚ")[:4] or name[:4]).upper()
    fontp = find_font(a.font)
    os.makedirs(a.out, exist_ok=True)
    parts = [name, a.tagline.upper()] + ([a.city.upper()] if a.city else []) + [f"EST. {a.year}"]
    seal_text = " \u00b7 ".join(parts) + " \u00b7 "

    marks = {
        "wordmark": make_wordmark(fontp, name, a.tracking),
        "monogram": make_monogram(fontp, short, a.tracking + 0.02),
        "graphic": make_graphic(fontp, name, a.tracking + 0.04),
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
