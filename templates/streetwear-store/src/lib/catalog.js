import data from "@/data/catalog.json";
import brand from "@/config/brand";
import { formatPrice as fmt } from "@/lib/shop";

/** All categories in display order: [{ slug, name, intro }] — source of truth is src/config/brand.js. */
export const categories = brand.categories;

/** All products (see src/data/catalog.json for the shape). `prompt` holds the image-generation brief, not for display. */
export const products = data.products;

/** Casting map (models used in the photos): { key: { job_id, desc } }. */
export const models = data.models || {};

/* Build-time sanity check: every product category must exist in brand.categories. */
{
  const known = new Set(categories.map((c) => c.slug));
  const orphans = products.filter((p) => !known.has(p.category)).map((p) => `${p.slug} → ${p.category}`);
  const listed = (data.categories || []).map((c) => c.slug).join(",");
  if (orphans.length) console.warn(`[catalog] Products with a category missing from brand.categories: ${orphans.join(", ")}`);
  if (listed && listed !== categories.map((c) => c.slug).join(",")) {
    console.warn("[catalog] catalog.json `categories` differs from brand.categories (src/config/brand.js is the one used).");
  }
}

export function getProduct(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function getCategory(slug) {
  return categories.find((c) => c.slug === slug) || null;
}

export function productsByCategory(slug) {
  return products.filter((p) => p.category === slug);
}

/** First image of the first colourway = flat lay (always shown first). Second = on-model (hover). */
export function primaryImages(product) {
  const imgs = product.colors[0].images;
  return { flat: imgs[0], hover: imgs[1] || imgs[0] };
}

/** Local currency formatting (same as @/lib/shop). */
export const formatPrice = fmt;
