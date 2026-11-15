"""Vectorize a black-on-white logo PNG into a clean single-path SVG (fill=currentColor).

The vectorizer used for the MUSKETEER logo system (Higgsfield PNG -> potrace -> SVG).

Requirements:   pip install potracer pillow numpy
Usage:          python3 scripts/vectorize.py <in.png> <out.svg> [scale]
                  scale: optional upscale factor before tracing (e.g. 2 for small PNGs)
Then:           npm run logos   (regenerates logoData.js and the -black / -white SVGs)

Tips
- Input must be dark ink on a light background (threshold 128). For a white logo on
  black, invert first:  convert in.png -negate out.png
- Clean the PNG before tracing (crop, remove stray specks, flatten to pure B/W with
  `convert in.png -colorspace gray -threshold 55% clean.png`).
- Colour SVGs from Recraft (several paths, a background rect, transforms) also go
  through here: rasterize them first, e.g.
  `rsvg-convert -w 2400 -b white in.svg > in.png` or ImageMagick `convert -density 300`.
"""
import sys

import numpy as np
import potrace  # provided by the `potracer` package
from PIL import Image


def _f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")


def vectorize(src, dst, scale=1.0, threshold=128, turdsize=8):
    """Trace `src` (PNG/JPG, dark ink on light ground) into `dst` (single-path SVG). Returns (w, h, bytes)."""
    img = Image.open(src).convert("L")
    if scale != 1.0:
        img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
    a = np.array(img)
    mask = a < threshold  # ink
    ys, xs = np.where(mask)
    if not len(xs):
        raise SystemExit(f"{src}: no dark pixels found (is the logo white on black? invert it first)")
    pad = 4
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, a.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, a.shape[1])
    mask = mask[y0:y1, x0:x1]

    bmp = potrace.Bitmap(~mask)
    path = bmp.trace(turdsize=turdsize, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)

    parts = []
    for curve in path:
        s = curve.start_point
        d = [f"M{_f(s.x)} {_f(s.y)}"]
        for seg in curve.segments:
            if seg.is_corner:
                d.append(f"L{_f(seg.c.x)} {_f(seg.c.y)}L{_f(seg.end_point.x)} {_f(seg.end_point.y)}")
            else:
                d.append(f"C{_f(seg.c1.x)} {_f(seg.c1.y)} {_f(seg.c2.x)} {_f(seg.c2.y)} {_f(seg.end_point.x)} {_f(seg.end_point.y)}")
        d.append("Z")
        parts.append("".join(d))

    h, w = mask.shape
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path fill="currentColor" fill-rule="evenodd" d="{"".join(parts)}"/></svg>'
    with open(dst, "w") as fh:
        fh.write(svg)
    return w, h, len(svg)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        raise SystemExit(__doc__)
    src, dst = sys.argv[1], sys.argv[2]
    scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
    w, h, n = vectorize(src, dst, scale)
    print(dst, w, h, n)
