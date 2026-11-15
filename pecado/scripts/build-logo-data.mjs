#!/usr/bin/env node
/* ==========================================================================
   Regenerates the logo system from the master SVGs in public/brand/.

     node scripts/build-logo-data.mjs        (or: npm run logos)

   Input   public/brand/<variant>.svg  — one file per <Logo variant>, path-only
           (the output of scripts/vectorize.py). Expected variants:
           wordmark, monogram, graphic, emblem, seal. Any other <name>.svg
           (not ending in -black / -white) becomes an extra variant.
   Output  - public/brand/<variant>.svg        normalized: ONE <path>, fill="currentColor"
           - public/brand/<variant>-black.svg  fill = brand.palette.ink
           - public/brand/<variant>-white.svg  fill = #FFFFFF
           - src/components/brand/logoData.js  { variant: { viewBox, inner } } for <Logo/>

   Only <path> elements are accepted (no <text>, <rect>, <circle>, transforms…):
   rasterize + trace anything else with scripts/vectorize.py first.
   ========================================================================== */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BRAND_DIR = path.join(ROOT, "public", "brand");
const OUT = path.join(ROOT, "src", "components", "brand", "logoData.js");
const EXPECTED = ["wordmark", "monogram", "graphic", "emblem", "seal"];

/* Ink colour for the -black files: brand.palette.ink (falls back to #0A0A0A). */
let INK = "#0A0A0A";
let BRAND_NAME = "BRAND";
try {
  const mod = await import(pathToFileURL(path.join(ROOT, "src", "config", "brand.js")).href);
  INK = mod.default?.palette?.ink?.hex || INK;
  BRAND_NAME = mod.default?.name || BRAND_NAME;
} catch (e) {
  console.warn(`! Could not read src/config/brand.js (${e.message}); using ${INK} for -black files.`);
}
const WHITE = "#FFFFFF";

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3]) : null;
};

function parse(file) {
  const src = fs.readFileSync(file, "utf8");
  const svgTag = src.match(/<svg\b[^>]*>/i)?.[0];
  if (!svgTag) throw new Error("no <svg> element");
  let viewBox = attr(svgTag, "viewBox");
  if (!viewBox) {
    const w = parseFloat(attr(svgTag, "width"));
    const h = parseFloat(attr(svgTag, "height"));
    if (!w || !h) throw new Error("no viewBox (and no width/height)");
    viewBox = `0 0 ${w} ${h}`;
  }
  viewBox = viewBox.trim().split(/[\s,]+/).map(Number).join(" ");

  const body = src.replace(/<\?xml[^>]*>|<!--[\s\S]*?-->|<title>[\s\S]*?<\/title>|<desc>[\s\S]*?<\/desc>|<defs\/>/gi, "");
  const shapes = body.match(/<(rect|circle|ellipse|polygon|polyline|line|text|image|use)\b/gi);
  if (shapes) throw new Error(`contains <${shapes[0].slice(1)}>: only <path> is supported — trace it with scripts/vectorize.py`);
  if (/\stransform\s*=/.test(body)) throw new Error("contains transforms — trace it with scripts/vectorize.py");

  const paths = [...body.matchAll(/<path\b[^>]*>/gi)].map((m) => m[0]);
  if (!paths.length) throw new Error("no <path> found");
  const ds = [];
  let evenodd = false;
  for (const p of paths) {
    const fill = (attr(p, "fill") || "").toLowerCase();
    // Skip white/none background paths (common in exported files).
    if (fill === "none" || fill === "#fff" || fill === "#ffffff" || fill === "white") continue;
    const d = attr(p, "d");
    if (d) ds.push(d.trim());
    if ((attr(p, "fill-rule") || "").toLowerCase() === "evenodd") evenodd = true;
  }
  if (!ds.length) throw new Error("only white/transparent paths found");
  if (paths.length > 1) evenodd = true; // merged sub-paths: evenodd keeps counters open
  return { viewBox, d: ds.join(""), rule: evenodd ? "evenodd" : "nonzero" };
}

const svg = (viewBox, fill, d, rule) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path fill="${fill}"${rule === "evenodd" ? ' fill-rule="evenodd"' : ""} d="${d}"/></svg>`;

const sources = fs
  .readdirSync(BRAND_DIR)
  .filter((f) => f.endsWith(".svg") && !/-(black|white)\.svg$/.test(f))
  .map((f) => f.replace(/\.svg$/, ""));
const order = [...EXPECTED.filter((v) => sources.includes(v)), ...sources.filter((v) => !EXPECTED.includes(v)).sort()];

const missing = EXPECTED.filter((v) => !sources.includes(v));
if (missing.length) console.warn(`! Missing master SVGs: ${missing.join(", ")} — <Logo variant> falls back to the wordmark for them.`);
if (!order.includes("wordmark")) {
  console.error("✗ public/brand/wordmark.svg is required.");
  process.exit(1);
}

const LOGOS = {};
let failed = 0;
for (const v of order) {
  const file = path.join(BRAND_DIR, `${v}.svg`);
  try {
    const { viewBox, d, rule } = parse(file);
    fs.writeFileSync(file, svg(viewBox, "currentColor", d, rule));
    fs.writeFileSync(path.join(BRAND_DIR, `${v}-black.svg`), svg(viewBox, INK, d, rule));
    fs.writeFileSync(path.join(BRAND_DIR, `${v}-white.svg`), svg(viewBox, WHITE, d, rule));
    LOGOS[v] = { viewBox, inner: `<path fill="currentColor"${rule === "evenodd" ? ' fill-rule="evenodd"' : ""} d="${d}"/>` };
    const [, , w, h] = viewBox.split(" ").map(Number);
    console.log(`✓ ${v.padEnd(9)} ${String(Math.round(w)).padStart(5)}×${Math.round(h)}  ${(d.length / 1024).toFixed(1)} KB`);
  } catch (e) {
    failed++;
    console.error(`✗ ${v}: ${e.message}`);
  }
}

const header = `// Auto-generated by scripts/build-logo-data.mjs from public/brand/*.svg — ${BRAND_NAME} logo system.
// Variants: ${Object.keys(LOGOS).join(", ")}. Do not edit by hand: replace the SVGs and run \`npm run logos\`.
`;
fs.writeFileSync(OUT, `${header}const LOGOS = ${JSON.stringify(LOGOS)};\nexport default LOGOS;\n`);
console.log(`→ ${path.relative(ROOT, OUT)} (${Object.keys(LOGOS).length} variants)`);
if (failed) process.exit(1);
