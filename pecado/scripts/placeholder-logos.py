"""Generate the typographic logo system for PECADO (blackletter + thorns + wings).

Draws five marks with Pillow and traces them with scripts/vectorize.py, so the
result is path-only SVG (no <text>, no external fonts at runtime):

  wordmark  "Pecado" in UnifrakturMaguntia, slightly emboldened so the hairlines hold
            at header size, tight spacing, a thorn on the stem of the P and on the
            ascender of the d (the brief's hand-retouched blackletter)
  monogram  blackletter "P" inside the thorn ring
  graphic   the wordmark flanked by two feathered wings (5 feathers each) over a
            thorn vine: garment / campaign graphic only
  emblem    pointed-arm cross with two wings of 5 feathers inside the thorn ring:
            favicon, hardware, woven label, placeholders and separators
  seal      thorn ring + inner ring, "PECADO · SIN PERDÓN · MADRID · 2026" around
            (Grenze Gotisch Black caps), winged cross in the middle

Fonts (Google Fonts, not committed). Download the TTFs through the CSS API, e.g.
  curl -s -A "Mozilla/4.0" "https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Grenze+Gotisch:wght@900"
and fetch the fonts.gstatic.com URLs it lists.

Requirements:  pip install potracer pillow numpy
Usage:
  python3 scripts/placeholder-logos.py --font UnifrakturMaguntia.ttf --font-caps GrenzeGotisch-900.ttf \
      --name Pecado --tagline "Sin perdón" --city Madrid --year 2026
  npm run logos            # -> public/brand/*-black|white.svg + src/components/brand/logoData.js
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

INK, PAPER = 0, 255


def canvas(w, h):
    img = Image.new("L", (int(w), int(h)), PAPER)
    return img, ImageDraw.Draw(img)


def rot(px, py, cx, cy, a):
    """Rotate point (px, py) around (cx, cy) by angle a (radians, image coords)."""
    c, s = math.cos(a), math.sin(a)
    dx, dy = px - cx, py - cy
    return cx + dx * c - dy * s, cy + dx * s + dy * c


def disc(d, x, y, r, fill=INK):
    d.ellipse([x - r, y - r, x + r, y + r], fill=fill)


# --------------------------------------------------------------------------- text
def text_img(fontp, text, size, tracking=0.0, embolden=0.0):
    """Black text on white, cropped generously. Returns (img, font, origin_x, origin_y, runs)."""
    font = ImageFont.truetype(fontp, size)
    tr = tracking * size
    sw = int(round(embolden * size))
    w = sum(font.getlength(ch) for ch in text) + tr * (len(text) - 1)
    img, d = canvas(w + size, size * 2)
    x, y = size / 2, size * 0.45
    runs = []
    for ch in text:
        adv = font.getlength(ch)
        d.text((x, y), ch, font=font, fill=INK, stroke_width=sw, stroke_fill=INK)
        runs.append((ch, x, adv))
        x += adv + tr
    return img, font, size / 2, size * 0.45, runs


def ink_bbox(img):
    """Bounding box of the dark pixels of an L image."""
    inv = img.point(lambda v: 255 if v < 128 else 0)
    return inv.getbbox()


def glyph_ink_box(font, ch, x, y, sw=0):
    l, t, r, b = font.getbbox(ch, stroke_width=sw)
    return x + l, y + t, x + r, y + b


# --------------------------------------------------------------------------- thorns
def thorn(d, bx, by, ang, base, length, hook=0.35, fill=INK):
    """A rose thorn: a triangle with its base centred at (bx, by), pointing along `ang`
    (radians, image coords), its tip pushed sideways by `hook` × length (a curved barb)."""
    ux, uy = math.cos(ang), math.sin(ang)
    nx, ny = -uy, ux
    h = base / 2
    p1 = (bx + nx * h, by + ny * h)
    p2 = (bx - nx * h, by - ny * h)
    tip = (bx + ux * length + nx * length * hook, by + uy * length + ny * length * hook)
    mid = (bx + ux * length * 0.45 + nx * length * hook * 0.15, by + uy * length * 0.45 + ny * length * hook * 0.15)
    # slightly concave outer edge for a hooked look
    d.polygon([p1, tip, mid, p2], fill=fill)
    d.polygon([p1, tip, p2], fill=fill)


def thorn_ring(d, cx, cy, R, width, n=16, length=None, base=None, fill=INK):
    """Ring band of radius R (centre line) and `width`, with `n` thorns alternating
    outward / inward, each hooked the same way round (clockwise)."""
    length = length or width * 2.6
    base = base or width * 1.9
    ro, ri = R + width / 2, R - width / 2
    d.ellipse([cx - ro, cy - ro, cx + ro, cy + ro], fill=fill)
    d.ellipse([cx - ri, cy - ri, cx + ri, cy + ri], fill=PAPER)
    for k in range(n):
        a = -math.pi / 2 + (2 * math.pi) * (k + 0.5) / n
        out = k % 2 == 0
        r = ro - width * 0.15 if out else ri + width * 0.15
        bx, by = cx + r * math.cos(a), cy + r * math.sin(a)
        ang = a if out else a + math.pi
        thorn(d, bx, by, ang, base, length, hook=0.45 if out else -0.45, fill=fill)


# --------------------------------------------------------------------------- wings + cross
def mirror(pts, axis_x):
    return [(2 * axis_x - x, y) for x, y in pts]


def polar(sx, sy, deg, r):
    a = math.radians(deg)
    return sx + r * math.cos(a), sy + r * math.sin(a)


def bezier(p0, p1, p2, n=40):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in (i / n for i in range(n + 1))]


def wing(d, sx, sy, span, side=1, feathers=5, gap=None, fill=INK):
    """A heraldic wing silhouette rooted at the shoulder (sx, sy): a convex leading edge
    rising to the wrist, `feathers` pointed primaries along the trailing edge (each tip
    hooked slightly downwards) and paper cut lines between them.
    side = 1 → spreads to the right, -1 → mirrored to the left."""
    gap = gap if gap is not None else span * 0.026
    L = span
    tips_deg = [-30 + 64 * i / (feathers - 1) for i in range(feathers)]  # -30° (up) … +34° (down)
    tips_r = [L * (1.0 - 0.42 * i / (feathers - 1)) for i in range(feathers)]
    tips = [polar(sx, sy, a, r) for a, r in zip(tips_deg, tips_r)]
    valleys = []
    for i in range(feathers - 1):
        a = (tips_deg[i] + tips_deg[i + 1]) / 2 + 3
        r = min(tips_r[i], tips_r[i + 1]) * 0.7
        valleys.append(polar(sx, sy, a, r))
    lead = bezier((sx, sy), polar(sx, sy, -62, L * 0.62), tips[0])
    pts = list(lead)
    for i in range(feathers):
        if i > 0:  # convex outer edge of the feather, from the previous valley up to its tip
            pts += bezier(valleys[i - 1], polar(sx, sy, tips_deg[i] - 7, tips_r[i] * 0.9), tips[i], 16)[1:]
        nxt = valleys[i] if i < feathers - 1 else polar(sx, sy, 62, L * 0.2)
        # the tip hooks back: concave trailing edge down to the next valley
        mid_deg = tips_deg[i] + (8 if i < feathers - 1 else 14)
        pts += bezier(tips[i], polar(sx, sy, mid_deg, tips_r[i] * 0.72), nxt, 16)[1:]
    pts.append((sx, sy + L * 0.02))
    cuts = []
    for v in valleys:
        root = polar(sx, sy, math.degrees(math.atan2(v[1] - sy, v[0] - sx)), L * 0.2)
        cuts.append((root, v))
    if side < 0:
        pts = mirror(pts, sx)
        cuts = [(mirror([a], sx)[0], mirror([b], sx)[0]) for a, b in cuts]
    d.polygon(pts, fill=fill)
    for a, b in cuts:  # tapered paper cut: thin at the root, gap-wide at the valley
        ax, ay = a
        bx, by = b
        ux, uy = bx - ax, by - ay
        ln = math.hypot(ux, uy) or 1
        nx, ny = -uy / ln, ux / ln
        w0, w1 = gap * 0.15, gap * 0.5
        ext = 1.04  # run slightly past the valley so the notch opens cleanly
        ex, ey = ax + ux * ext, ay + uy * ext
        d.polygon([(ax + nx * w0, ay + ny * w0), (ex + nx * w1, ey + ny * w1), (ex - nx * w1, ey - ny * w1), (ax - nx * w0, ay - ny * w0)], fill=PAPER)


def cross_polys(cx, cy, h, grow=0.0):
    """Spear-pointed Latin cross of height h centred on (cx, cy), as polygons; `grow`
    offsets every edge outwards (used for the paper halo)."""
    t = h * 0.14 + 2 * grow  # bar thickness
    arm = h * 0.36 + grow  # half span of the cross bar (to the tip)
    top, bot = cy - h / 2 - grow, cy + h / 2 + grow
    yb = cy - h * 0.16  # cross-bar centre (upper third)
    tip = (h * 0.14) * 1.25 + grow * 0.6
    w = (h * 0.14) * 0.8 + grow  # spear head half width
    polys = [
        [(cx - t / 2, top + tip), (cx + t / 2, top + tip), (cx + t / 2, bot - tip), (cx - t / 2, bot - tip)],
        [(cx - arm + tip, yb - t / 2), (cx + arm - tip, yb - t / 2), (cx + arm - tip, yb + t / 2), (cx - arm + tip, yb + t / 2)],
    ]
    for ex, ey, dx, dy in ((cx, top, 0, 1), (cx, bot, 0, -1), (cx - arm, yb, 1, 0), (cx + arm, yb, -1, 0)):
        bx, by = ex + dx * tip, ey + dy * tip
        nx, ny = -dy, dx
        back = (h * 0.14) * 0.5 + grow * 0.5
        polys.append([(ex, ey), (bx + nx * w, by + ny * w), (bx + dx * back, by + dy * back), (bx - nx * w, by - ny * w)])
    return polys, yb, h * 0.14


def pointed_cross(d, cx, cy, h, fill=INK, halo=0.0, knock=True):
    if halo:
        for poly in cross_polys(cx, cy, h, halo)[0]:
            d.polygon(poly, fill=PAPER)
    polys, yb, t = cross_polys(cx, cy, h)
    for poly in polys:
        d.polygon(poly, fill=fill)
    if knock:  # small diamond knockout at the crossing
        k = t * 0.24
        d.polygon([(cx, yb - k * 1.6), (cx + k, yb), (cx, yb + k * 1.6), (cx - k, yb)], fill=PAPER)


def winged_cross(d, cx, cy, R, fill=INK):
    """Cross + two wings, fitting a circle of radius R."""
    span = R * 0.98
    h = R * 1.72
    sy = cy - h * 0.16 + R * 0.04
    wing(d, cx + R * 0.04, sy, span, side=1, fill=fill)
    wing(d, cx - R * 0.04, sy, span, side=-1, fill=fill)
    pointed_cross(d, cx, cy, h, fill=fill, halo=R * 0.045)


# --------------------------------------------------------------------------- marks
def stem_of(font, ch, x, y):
    """(left edge x, top y, bottom y) of the longest vertical ink run of glyph `ch` drawn at (x, y)."""
    l, t, r, b = font.getbbox(ch)
    g = Image.new("L", (int(r - l) + 4, int(b - t) + 4), 0)
    ImageDraw.Draw(g).text((-l + 2, -t + 2), ch, font=font, fill=255)
    W, H = g.size
    px = g.load()
    best = (0, 0, 0, 0)  # run length, column, start, end
    for cx in range(W):
        run = start = 0
        for cy in range(H):
            if px[cx, cy] > 128:
                if run == 0:
                    start = cy
                run += 1
                if run > best[0]:
                    best = (run, cx, start, cy)
            else:
                run = 0
    _, col, y0, y1 = best
    # walk left from the stem column to its left edge (at the middle of the run)
    mid = (y0 + y1) // 2
    while col > 0 and px[col - 1, mid] > 128:
        col -= 1
    return x + l - 2 + col, y + t - 2 + y0, y + t - 2 + y1


def make_wordmark(fontp, name, size=900, tracking=-0.015, thorns=False):
    img, font, ox, oy, runs = text_img(fontp, name, size, tracking)
    if thorns:
        d = ImageDraw.Draw(img)
        for ch, x, adv in runs:
            if ch in "Pp":  # two rose thorns on the left of the P stem, hooked downwards
                ex, y0, y1 = stem_of(font, ch, x, oy)
                hgt = y1 - y0
                for f, k in ((0.5, 1.0), (0.7, 0.8)):
                    thorn(d, ex + size * 0.012, y0 + hgt * f, math.pi, size * 0.05 * k, size * 0.085 * k, hook=-0.55)
                break
    return img


def make_monogram(fontp, size=1600):
    img, d = canvas(size, size)
    c = size / 2
    R = size * 0.4
    thorn_ring(d, c, c, R, size * 0.032, n=18)
    letter = Image.new("L", (size, size), 0)
    fs = int(size * 0.62)
    font = ImageFont.truetype(fontp, fs)
    ld = ImageDraw.Draw(letter)
    sw = int(fs * 0.012)
    l, t, r, b = font.getbbox("P", stroke_width=sw)
    ld.text((c - (l + r) / 2, c - (t + b) / 2 + size * 0.01), "P", font=font, fill=255, stroke_width=sw, stroke_fill=255)
    img.paste(INK, (0, 0), letter)
    return img


def make_graphic(fontp, name, size=700):
    word = make_wordmark(fontp, name, size)
    word = word.crop(ink_bbox(word))
    ww, wh = word.size
    span = wh * 1.25
    W, H = ww + span * 2.3, wh * 1.75
    img, d = canvas(W, H)
    x0, y0 = (W - ww) / 2, wh * 0.18
    # wings rise from just outside the word, shoulders level with the x-height
    wing(d, x0 + ww - wh * 0.06, y0 + wh * 0.5, span, side=1)
    wing(d, x0 + wh * 0.06, y0 + wh * 0.5, span, side=-1)
    # paper block behind the word, then the word
    d.rectangle([x0 - wh * 0.04, y0 - wh * 0.04, x0 + ww + wh * 0.04, y0 + wh * 1.04], fill=PAPER)
    img.paste(INK, (int(x0), int(y0)), word.point(lambda v: 255 - v))
    # thorn vine underneath: a thin bar with alternating hooked barbs, tapering ends
    vy = y0 + wh * 1.22
    vx0, vx1 = x0 + ww * 0.1, x0 + ww * 0.9
    t = wh * 0.035
    d.polygon([(vx0 - t * 4, vy), (vx0, vy - t / 2), (vx1, vy - t / 2), (vx1 + t * 4, vy), (vx1, vy + t / 2), (vx0, vy + t / 2)], fill=INK)
    n = 9
    for k in range(n):
        bx = vx0 + (vx1 - vx0) * (k + 0.5) / n
        up = k % 2 == 0
        thorn(d, bx, vy + (-t * 0.4 if up else t * 0.4), -math.pi / 2 if up else math.pi / 2, t * 2.2, t * 3.4, hook=0.6 if up else -0.6)
    return img


def make_emblem(size=1600):
    img, d = canvas(size, size)
    c = size / 2
    R = size * 0.4
    thorn_ring(d, c, c, R, size * 0.034, n=16)
    winged_cross(d, c, c + size * 0.01, R * 0.74)
    return img


def make_seal(capsp, text, size=2400):
    img, d = canvas(size, size)
    c = size / 2
    R_out = size * 0.43  # thorn ring centre line
    R2 = size * 0.405  # inner edge of the text band
    R3 = size * 0.295  # inner ring
    thorn_ring(d, c, c, R_out, size * 0.014, n=40, length=size * 0.03, base=size * 0.022)
    for a, b in ((R3, R3 - size * 0.011),):
        d.ellipse([c - a, c - a, c + a, c + a], fill=INK)
        d.ellipse([c - b, c - b, c + b, c + b], fill=PAPER)
    winged_cross(d, c, c + size * 0.01, R3 * 0.72)

    band_mid = (R2 + R3) / 2 + size * 0.004
    fs = int((R2 - R3) * 0.62)
    font = ImageFont.truetype(capsp, fs)

    def metrics(f):
        l, t, r, b = f.getbbox("H")
        return t, b - t

    top, cap = metrics(font)
    widths = [font.getlength(ch) for ch in text]
    circ = 2 * math.pi * band_mid
    while sum(widths) > circ * 0.86 and fs > 10:
        fs -= 2
        font = ImageFont.truetype(capsp, fs)
        top, cap = metrics(font)
        widths = [font.getlength(ch) for ch in text]
    extra = (circ - sum(widths)) / len(text)
    first = text.split(" ")[0]
    pos = -(sum(widths[: len(first)]) + extra * (len(first) - 1)) / 2
    for ch, w in zip(text, widths):
        theta = (pos + w / 2) / band_mid
        pos += w + extra
        if ch == " ":
            continue
        glyph = Image.new("L", (int(w + fs), int(fs * 2.2)), 0)
        ImageDraw.Draw(glyph).text((fs / 2, fs * 1.1 - top - cap / 2), ch, font=font, fill=255)
        r = glyph.rotate(-math.degrees(theta), resample=Image.BICUBIC, expand=True)
        x = c + band_mid * math.sin(theta) - r.width / 2
        y = c - band_mid * math.cos(theta) - r.height / 2
        img.paste(INK, (int(round(x)), int(round(y))), r)
    return img


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--name", default="Pecado")
    ap.add_argument("--tagline", default="Sin perdón")
    ap.add_argument("--city", default="Madrid")
    ap.add_argument("--year", default="2026")
    ap.add_argument("--font", required=True, help="blackletter TTF for wordmark / monogram (UnifrakturMaguntia)")
    ap.add_argument("--font-caps", required=True, help="TTF for the seal text (Grenze Gotisch Black)")
    ap.add_argument("--out", default=os.path.join(here, "..", "public", "brand"))
    ap.add_argument("--preview", default=None, help="optional: also save the raw PNGs in this folder")
    a = ap.parse_args()

    os.makedirs(a.out, exist_ok=True)
    seal_text = " · ".join([a.name.upper(), a.tagline.upper(), a.city.upper(), a.year]) + " · "
    marks = {
        "wordmark": make_wordmark(a.font, a.name),
        "monogram": make_monogram(a.font),
        "graphic": make_graphic(a.font, a.name),
        "emblem": make_emblem(),
        "seal": make_seal(a.font_caps, seal_text),
    }
    with tempfile.TemporaryDirectory() as tmp:
        for variant, img in marks.items():
            png = os.path.join(a.preview or tmp, f"{variant}.png")
            img.save(png)
            dst = os.path.join(a.out, f"{variant}.svg")
            w, h, n = vectorize(png, dst)
            print(f"{variant:9s} -> {os.path.relpath(dst)}  ({w}x{h}, {n} bytes)")
    print("Next: npm run logos")


if __name__ == "__main__":
    main()
