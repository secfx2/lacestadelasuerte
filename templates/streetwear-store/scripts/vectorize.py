"""Vectorize a black-on-white logo PNG into a clean single-path SVG (fill=currentColor)."""
import sys
import numpy as np
from PIL import Image
import potrace

src, dst = sys.argv[1], sys.argv[2]
scale = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0

img = Image.open(src).convert("L")
if scale != 1.0:
    img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)
a = np.array(img)
mask = a < 128  # ink
ys, xs = np.where(mask)
pad = 4
y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad, a.shape[0])
x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad, a.shape[1])
mask = mask[y0:y1, x0:x1]

bmp = potrace.Bitmap(~mask)
path = bmp.trace(turdsize=8, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY, alphamax=1.0, opticurve=True, opttolerance=0.2)

def f(v):
    return f"{v:.1f}".rstrip("0").rstrip(".")

parts = []
for curve in path:
    s = curve.start_point
    d = [f"M{f(s.x)} {f(s.y)}"]
    for seg in curve.segments:
        if seg.is_corner:
            d.append(f"L{f(seg.c.x)} {f(seg.c.y)}L{f(seg.end_point.x)} {f(seg.end_point.y)}")
        else:
            d.append(f"C{f(seg.c1.x)} {f(seg.c1.y)} {f(seg.c2.x)} {f(seg.c2.y)} {f(seg.end_point.x)} {f(seg.end_point.y)}")
    d.append("Z")
    parts.append("".join(d))

h, w = mask.shape
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"><path fill="currentColor" fill-rule="evenodd" d="{"".join(parts)}"/></svg>'
open(dst, "w").write(svg)
print(dst, w, h, len(svg))
