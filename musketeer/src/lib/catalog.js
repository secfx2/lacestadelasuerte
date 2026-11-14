import data from "@/data/catalog.json";

/** All categories in display order: [{ slug, name }] */
export const categories = data.categories;

/** All products (see src/data/catalog.json for the shape). `prompt` holds the image-generation brief, not for display. */
export const products = data.products;

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

export function formatPrice(eur) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(eur);
}
