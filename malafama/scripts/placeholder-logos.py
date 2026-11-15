"""Generate the typographic logo system of MALA FAMA (built locally, no image generation).

Draws five marks with Pillow from three Google Fonts (OFL) and traces them with
scripts/vectorize.py, so the result is path-only SVG (no <text>, no fonts at runtime):

  wordmark  "Mala Fama" in a copperplate script (Pinyon Script), hairlines slightly
            thickened so the signature survives at header size
  monogram  "MF" in blackletter (UnifrakturMaguntia)
  graphic   "Mala ✦ Fama" in blackletter set on an arch (back print / campaign graphic)
  emblem    tribal flame-dagger: a dagger pointing down with three flame blades on each
            side (no text) — favicon, separators, placeholders
  seal      double ring, "MALA FAMA ✦ MADRID ✦ 2026 ✦" around (condensed grotesk caps),
            the MF monogram in the middle

Fonts live in brand-source/fonts/ (downloaded from the Google Fonts CSS API; the same
families are loaded on the web by src/config/fonts.js).

Requirements:  pip install potracer pillow numpy
Usage:
  python3 scripts/placeholder-logos.py            # defaults: MALA FAMA · Madrid · 2026
  npm run logos                                   # -> *-black|white.svg + src/components/brand/logoData.js
Options: --name "Mala Fama" --short MF --city Madrid --year 2026 --out public/brand
         --script/--blackletter/--grotesk /path/to/font.ttf
"""
import argparse
import math
import os
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFont

sys.dont_write_bytecode = True  # keep scripts/ free of __pycache__
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from vectorize import vectorize  # noqa: E402

FONTS = os.path.join(HERE, "..", "brand-source", "fonts")
INK, PAPER = 0, 255


def canvas(w, h):
    img = Image.new("L", (int(w), int(h)), PAPER)
    return img, ImageDraw.Draw(img)


def cap_metrics(font, ref="H"):
    l, t, r, b = font.getbbox(ref)
    return t, b - t  # top offset, cap height


def star(draw, cx, cy, R, r_ratio=0.28, rot=0, fill=INK):
    """Four-point sparkle star."""
    pts = []
    for k in range(8):
        a = math.radians(-90 + rot + 45 * k)
        rad = R if k % 2 == 0 else R * r_ratio
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    draw.polygon(pts, fill=fill)


def qbez(p0, p1, p2, t):
    u = 1 - t
    return (u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])


def qbez_d(p0, p1, p2, t):
    return (2 * (1 - t) * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]), 2 * (1 - t) * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]))


def spike(draw, p0, p1, p2, w0, fill=INK, n=240, belly=0.35):
    """A tapered, curved blade along a quadratic Bézier p0→p2 (control p1): width w0 at the root,
    a slight belly, a needle tip. The tribal-tattoo flame/wing stroke."""
    left, right = [], []
    for i in range(n + 1):
        t = i / n
        x, y = qbez(p0, p1, p2, t)
        dx, dy = qbez_d(p0, p1, p2, t)
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        # width profile: root w0, swelling a bit, then a long taper to 0 at the tip
        w = w0 * (1 - t) ** 1.25 * (1 + belly * math.sin(math.pi * min(t * 1.6, 1)))
        left.append((x + nx * w / 2, y + ny * w / 2))
        right.append((x - nx * w / 2, y - ny * w / 2))
    draw.polygon(left + right[::-1], fill=fill)


def thick_text(draw, xy, text, font, grow=0, fill=INK):
    draw.text(xy, text, font=font, fill=fill, stroke_width=int(grow), stroke_fill=fill)


# --------------------------------------------------------------------------- marks
def make_wordmark(script, name, size=1000, grow=0.011):
    font = ImageFont.truetype(script, size)
    l, t, r, b = font.getbbox(name)
    pad = size
    img, d = canvas(r - l + 2 * pad, b - t + 2 * pad)
    thick_text(d, (pad - l, pad - t), name, font, grow * size)
    return img


def make_monogram(blackletter, short, size=1000, tracking=-0.03):
    font = ImageFont.truetype(blackletter, size)
    tr = tracking * size
    w = sum(font.getlength(ch) for ch in short) + tr * (len(short) - 1)
    img, d = canvas(w + 2 * size, size * 2.4)
    x = size
    for ch in short:
        d.text((x, size * 0.6), ch, font=font, fill=INK)
        x += font.getlength(ch) + tr
    return img


def make_graphic(blackletter, words, size=1000, span_deg=58):
    """Words in blackletter on an upward arch, separated by a sparkle star (back print)."""
    font = ImageFont.truetype(blackletter, size)
    top, xh = cap_metrics(font, "x")
    _, cap = cap_metrics(font, "H")
    star_w = size * 0.42
    gap = size * 0.12
    tokens = []
    for i, wd in enumerate(words):
        if i:
            tokens += [("gap", gap), ("star", star_w), ("gap", gap)]
        tokens += [(ch, font.getlength(ch)) for ch in wd]
    total = sum(w for _, w in tokens)
    R = total / math.radians(span_deg)  # baseline radius
    W = total * 1.08 + size * 1.2
    H = R * (1 - math.cos(math.radians(span_deg / 2))) + size * 2.6
    img, d = canvas(W, H)
    cx, cy = W / 2, size * 1.35 + R  # circle centre below the canvas top: baseline apex near the top
    asc = font.getmetrics()[0]
    pos = -total / 2
    for ch, w in tokens:
        theta = (pos + w / 2) / R  # radians from the apex, clockwise
        pos += w
        if ch == "gap":
            continue
        bx = cx + R * math.sin(theta)
        by = cy - R * math.cos(theta)
        if ch == "star":
            # centred on the x-height band
            rr = R + xh * 0.5
            star(d, cx + rr * math.sin(theta), cy - rr * math.cos(theta), star_w * 0.5, r_ratio=0.22, rot=math.degrees(theta))
            continue
        gw, gh = int(w + size), int(size * 2.2)
        glyph = Image.new("L", (gw, gh), 0)
        # baseline at y = gh/2, glyph centred horizontally on gw/2
        ImageDraw.Draw(glyph).text((gw / 2 - w / 2, gh / 2 - asc), ch, font=font, fill=255)
        rot = glyph.rotate(-math.degrees(theta), resample=Image.BICUBIC, expand=True, center=(gw / 2, gh / 2))
        img.paste(INK, (int(round(bx - rot.width / 2)), int(round(by - rot.height / 2))), rot)
    return img


def draw_emblem(d, cx, cy, s, halo=True):
    """Tribal flame-dagger centred on (cx, cy); s = half of the emblem height."""
    u = s / 800.0  # design grid: 1600 units tall, origin top-left at (cx-800u, cy-800u)
    X = lambda x: cx + (x - 800) * u  # noqa: E731
    Y = lambda y: cy + (y - 800) * u  # noqa: E731
    P = lambda x, y: (X(x), Y(y))  # noqa: E731

    # flame blades: three per side, rooted behind the grip just above the guard, sweeping out and up
    flames = [
        ((790, 470), (625, 400), (575, 60), 150),   # tall inner flame beside the grip
        ((790, 505), (500, 480), (255, 230), 165),  # middle
        ((790, 540), (430, 580), (130, 470), 150),  # low, almost horizontal
    ]
    for (p0, p1, p2, w0) in flames:
        for mirror in (False, True):
            m = (lambda p: (1600 - p[0], p[1])) if mirror else (lambda p: p)
            spike(d, P(*m(p0)), P(*m(p1)), P(*m(p2)), w0 * u)

    def dagger(fill, grow=0.0):
        g = grow
        # pommel (rhombus)
        d.polygon([P(800, 150 - g), P(860 + g, 235), P(800, 320 + g), P(740 - g, 235)], fill=fill)
        # grip
        d.rectangle([X(768 - g), Y(300 - g), X(832 + g), Y(560 + g)], fill=fill)
        # guard: recurved bar with pointed tips
        guard = [P(800, 540 - g)]
        for i in range(1, 21):
            t = i / 20
            guard.append(P(800 + (300 + g) * t, 540 - g + 70 * t * t))
        guard += [P(1130 + g, 690 + g), P(1060, 640 + g), P(800, 625 + g), P(540, 640 + g), P(470 - g, 690 + g)]
        for i in range(20, 0, -1):
            t = i / 20
            guard.append(P(800 - (300 + g) * t, 540 - g + 70 * t * t))
        d.polygon(guard, fill=fill)
        # blade
        d.polygon([P(728 - g, 620), P(872 + g, 620), P(888 + g, 720), P(800, 1540 + g * 1.6), P(712 - g, 720)], fill=fill)

    if halo:
        dagger(PAPER, grow=34)
    dagger(INK)
    # details knocked out of the dagger (they disappear harmlessly at favicon size)
    for y in (360, 420, 480):  # grip wraps
        d.polygon([P(768, y), P(832, y + 26), P(832, y + 44), P(768, y + 18)], fill=PAPER)
    d.polygon([P(796, 700), P(804, 700), P(803, 1300), P(797, 1300)], fill=PAPER)  # fuller
    star(d, X(800), Y(235), 34 * u, r_ratio=0.3, fill=PAPER)  # spark in the pommel


def make_emblem(size=1800):
    img, d = canvas(size, size)
    draw_emblem(d, size / 2, size / 2, size * 0.46)
    return img


def make_seal(grotesk, blackletter, tokens, short, size=2400):
    img, d = canvas(size, size)
    c = size / 2
    R1, R2 = size * 0.47, size * 0.455  # outer ring
    R3, R4 = size * 0.322, size * 0.31  # inner ring
    for a, b in ((R1, R2), (R3, R4)):
        d.ellipse([c - a, c - a, c + a, c + a], fill=INK)
        d.ellipse([c - b, c - b, c + b, c + b], fill=PAPER)

    # MF monogram in the middle
    mono = ImageFont.truetype(blackletter, int(R4 * 1.0))
    l, t, r, b = mono.getbbox(short)
    d.text((c - (l + r) / 2, c - (t + b) / 2), short, font=mono, fill=INK)

    # text around the band between the rings
    band_mid = (R2 + R3) / 2
    fs = int((R2 - R3) * 0.62)
    font = ImageFont.truetype(grotesk, fs)
    top, cap = cap_metrics(font)
    star_w = cap * 1.1
    tracking = fs * 0.16
    widths = [(star_w if tk == "*" else font.getlength(tk)) + tracking for tk in tokens]
    circ = 2 * math.pi * band_mid
    extra = (circ - sum(widths)) / len(tokens)
    if extra < 0:
        raise SystemExit("seal text too long for the ring")
    # centre the first word (the brand name) at the top
    first = 0
    while first < len(tokens) and tokens[first] != "*":
        first += 1
    pos = -(sum(widths[:first]) + extra * (first - 1)) / 2
    for tk, w in zip(tokens, widths):
        theta = (pos + w / 2) / band_mid
        pos += w + extra
        if tk == " ":
            continue
        x = c + band_mid * math.sin(theta)
        y = c - band_mid * math.cos(theta)
        if tk == "*":
            star(d, x, y, star_w * 0.5, r_ratio=0.24, rot=math.degrees(theta))
            continue
        gw = int(w + fs)
        glyph = Image.new("L", (gw, int(fs * 2)), 0)
        ImageDraw.Draw(glyph).text((gw / 2 - font.getlength(tk) / 2, fs - top - cap / 2), tk, font=font, fill=255)
        rot = glyph.rotate(-math.degrees(theta), resample=Image.BICUBIC, expand=True)
        img.paste(INK, (int(round(x - rot.width / 2)), int(round(y - rot.height / 2))), rot)
    return img


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--name", default="Mala Fama")
    ap.add_argument("--short", default="MF")
    ap.add_argument("--city", default="Madrid")
    ap.add_argument("--year", default="2026")
    ap.add_argument("--script", default=os.path.join(FONTS, "PinyonScript.ttf"))
    ap.add_argument("--blackletter", default=os.path.join(FONTS, "UnifrakturMaguntia.ttf"))
    ap.add_argument("--grotesk", default=os.path.join(FONTS, "Archivo-Condensed-800.ttf"))
    ap.add_argument("--out", default=os.path.join(HERE, "..", "public", "brand"))
    a = ap.parse_args()
    for f in (a.script, a.blackletter, a.grotesk):
        if not os.path.exists(f):
            raise SystemExit(f"Missing font: {f}")

    os.makedirs(a.out, exist_ok=True)
    seal_tokens = []
    for part in (a.name.upper(), a.city.upper(), a.year):
        seal_tokens += list(part) + [" ", "*", " "]

    marks = {
        "wordmark": make_wordmark(a.script, a.name),
        "monogram": make_monogram(a.blackletter, a.short),
        "graphic": make_graphic(a.blackletter, a.name.split(" ")),
        "emblem": make_emblem(),
        "seal": make_seal(a.grotesk, a.blackletter, seal_tokens, a.short),
    }
    with tempfile.TemporaryDirectory() as tmp:
        for variant, img in marks.items():
            png = os.path.join(tmp, f"{variant}.png")
            img.save(png)
            dst = os.path.join(a.out, f"{variant}.svg")
            w, h, n = vectorize(png, dst)
            print(f"{variant:9s} -> {os.path.relpath(dst)}  ({w}x{h}, {n} bytes)")
    print("Next: npm run logos")


if __name__ == "__main__":
    main()
