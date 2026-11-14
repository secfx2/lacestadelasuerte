import "server-only";
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
    kind: p.kind,
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

/** Flat lay of a representative product — used for category tiles. */
const COVERS = {
  chaquetas: "tabard-work-jacket",
  punto: "chainmail-knit",
  sudaderas: "tous-pour-un-hoodie",
  camisetas: "emblem-tee",
  camisas: "lace-up-poet-shirt",
  pantalones: "baggy-carpenter-denim",
  accesorios: "plume-cap",
  joyeria: "emblem-signet-ring",
};

export function categoryTiles() {
  return categories.map((c) => {
    const p = getSlimProduct(COVERS[c.slug]) || slimCatalog().find((x) => x.category === c.slug);
    return { ...c, image: p?.colors[0].images[0] || null, hover: p?.colors[0].images[1] || null, count: products.filter((x) => x.category === c.slug).length };
  });
}

/** "Completa el look": compatible categories, deterministic. */
const COMPLEMENTS = {
  chaquetas: ["pantalones", "camisetas", "joyeria", "accesorios"],
  punto: ["pantalones", "joyeria", "chaquetas", "accesorios"],
  sudaderas: ["pantalones", "accesorios", "joyeria", "chaquetas"],
  camisetas: ["pantalones", "chaquetas", "joyeria", "accesorios"],
  camisas: ["pantalones", "joyeria", "chaquetas", "accesorios"],
  pantalones: ["sudaderas", "camisetas", "chaquetas", "accesorios"],
  accesorios: ["sudaderas", "chaquetas", "joyeria", "pantalones"],
  joyeria: ["joyeria", "camisas", "punto", "accesorios"],
};

export function relatedProducts(slug, n = 4) {
  const product = getSlimProduct(slug);
  if (!product) return [];
  const cats = COMPLEMENTS[product.category] || [];
  const seed = product.slug.length;
  const out = [];
  for (let k = 0; out.length < n && k < 12; k++) {
    const cat = cats[k % cats.length];
    const pool = slimCatalog().filter((p) => p.category === cat && p.slug !== product.slug && !out.includes(p));
    if (pool.length) out.push(pool[(seed + k) % pool.length]);
  }
  return out;
}
