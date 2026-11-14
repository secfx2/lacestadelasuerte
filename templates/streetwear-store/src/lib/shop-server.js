import "server-only";
import fs from "node:fs";
import path from "node:path";
import brand from "@/config/brand";
import { products, categories } from "@/lib/catalog";

/* Server-side catalog helpers. Everything that touches the full catalog JSON lives here. */

/** Client-safe product shape (drops the internal generation brief). */
export function slimProduct(p) {
  return {
    index: products.indexOf(p),
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    sizes: p.sizes,
    description: p.description,
    details: p.details,
    composition: p.composition,
    fit: p.fit,
    unisex: p.unisex,
    badge: p.badge,
    featured: !!p.featured,
    kind: p.kind,
    line: p.line || null,
    colors: p.colors.map((c) => ({ name: c.name, slug: c.slug, hex: c.hex, images: c.images })),
  };
}

let _slim;
export function slimCatalog() {
  if (!_slim) _slim = products.map(slimProduct);
  return _slim;
}

export function getSlimProduct(slug) {
  return slimCatalog().find((p) => p.slug === slug) || null;
}

export function slimProducts(slugs) {
  return slugs.map(getSlimProduct).filter(Boolean);
}

export function slimByCategory(slug) {
  return slimCatalog().filter((p) => p.category === slug);
}

/** Cover product of a category tile: brand.home.categories.covers[slug] → first `featured` → first product. */
function coverProduct(slug) {
  const chosen = brand.home.categories.covers?.[slug];
  const inCat = slimCatalog().filter((x) => x.category === slug);
  return (chosen && getSlimProduct(chosen)) || inCat.find((x) => x.featured) || inCat[0] || null;
}

export function categoryTiles() {
  return categories.map((c) => {
    const p = coverProduct(c.slug);
    return { ...c, image: p?.colors[0].images[0] || null, hover: p?.colors[0].images[1] || null, count: products.filter((x) => x.category === c.slug).length };
  });
}

/* --------------------------------------------------------------------------
   Home lists — explicit slugs in brand.home.* win; otherwise derived from catalog flags.
   -------------------------------------------------------------------------- */
const ordered = (list, pred) => [...list.filter(pred), ...list.filter((p) => !pred(p))];

/** "Novedades": brand.home.newIn.slugs, else badge "Nuevo" / current line (newest first in catalog order). */
export function newInSlugs() {
  const { slugs = [], limit = 10 } = brand.home.newIn || {};
  if (slugs.length) return slugs;
  const all = slimCatalog();
  const fresh = all.filter((p) => p.badge === "Nuevo" || (p.line && p.line === brand.currentLine));
  return (fresh.length ? fresh : [...all].reverse()).slice(0, limit).map((p) => p.slug);
}

/** "Best sellers": brand.home.bestSellers.slugs, else `featured: true`, badge "Best seller", then catalog order. */
export function bestSellerSlugs() {
  const { slugs = [], limit = 10 } = brand.home.bestSellers || {};
  if (slugs.length) return slugs;
  const all = ordered(ordered(slimCatalog(), (p) => p.badge === "Best seller"), (p) => p.featured);
  return all.slice(0, limit).map((p) => p.slug);
}

/** Products of the home feature block (brand.home.feature). */
export function featureProducts(n = 4) {
  const f = brand.home.feature;
  if (!f?.category) return [];
  if (f.slugs?.length) return slimProducts(f.slugs).slice(0, n);
  return ordered(slimByCategory(f.category), (p) => p.featured).slice(0, n);
}

/** "Completa el look": compatible categories (brand.relatedCategories), deterministic. */
function complementsOf(category) {
  const mapped = brand.relatedCategories?.[category];
  if (mapped?.length) return mapped;
  return categories.map((c) => c.slug).filter((c) => c !== category);
}

export function relatedProducts(slug, n = 4) {
  const product = getSlimProduct(slug);
  if (!product) return [];
  const cats = complementsOf(product.category);
  const seed = product.slug.length;
  const out = [];
  for (let k = 0; out.length < n && k < 12; k++) {
    const cat = cats[k % cats.length];
    const all = slimCatalog().filter((p) => p.category === cat && p.slug !== product.slug && !out.includes(p));
    // Pieces of a line (e.g. "2026") suggest pieces of the same line first (accessories/jewellery are shared)
    const sameLine = product.line ? all.filter((p) => p.line === product.line) : [];
    const pool = sameLine.length ? sameLine : all;
    if (pool.length) out.push(pool[(seed + k) % pool.length]);
  }
  // Small catalogs: top up with any other piece so the row is always full.
  for (const p of slimCatalog()) {
    if (out.length >= n) break;
    if (p.slug !== product.slug && !out.includes(p)) out.push(p);
  }
  return out;
}

/* --------------------------------------------------------------------------
   Files
   -------------------------------------------------------------------------- */
/** True if `/public${p}` exists at build/render time (used to hide links to files not generated yet). */
export function publicFileExists(p) {
  if (!p || /^https?:/.test(p)) return !!p;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", p));
  } catch {
    return false;
  }
}
