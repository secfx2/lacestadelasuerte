/* Exporta propuestas al formato de producto de <marca>/src/data/catalog.json
   (ver pecado/src/data/catalog.json). Las imágenes se declaran con la ruta que
   tendrán en la tienda (/products/<slug>/<color>-N.jpg) y la URL de origen va
   en _estudio.sourceImages para descargarlas al fusionar. */

export const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "pieza";

const FIT = { pecado: "Ultra baggy", malafama: "Boxy / extra ancho", musketeer: "Boxy", orbita: "Boxy", nueva: "Boxy" };

export function toCatalogEntry(p) {
  const slug = slugify(p.name);
  const color = slugify(p.colorName || "unico");
  const images = (p.images || []).slice(0, 4).map((im, i) => ({ path: `/products/${slug}/${color}-${i + 1}.jpg`, url: im.url || im }));
  const entry = {
    slug,
    name: p.name,
    category: p.category,
    price: Number(p.price) || 0,
    sizes: p.sizes?.length ? p.sizes : ["Talla única"],
    model: p.casting || null,
    description: p.description || "",
    details: p.details || [],
    composition: p.composition || "100% algodón",
    fit: p.fit || FIT[p.brand] || "Boxy",
    unisex: true,
    badge: p.badge || null,
  };
  if (p.brand !== "musketeer") Object.assign(entry, { featured: false });
  entry.kind = p.kind || "garment";
  if (p.brand !== "musketeer") Object.assign(entry, { line: "2026", batch: "E" });
  entry.prompt = { garment: p.prompt?.garment || "", back: "", detail: "", pose: p.prompt?.pose || "" };
  entry.colors = [{ name: p.colorName || "Único", slug: color, hex: p.colorHex || "#222222", variant: null, images: images.map((i) => i.path) }];
  entry._estudio = { proposalId: p.id, status: p.status, notes: p.notes || "", sourceImages: Object.fromEntries(images.map((i) => [i.path, i.url])) };
  return entry;
}

export function exportJSON(proposals) {
  return JSON.stringify(proposals.map(toCatalogEntry), null, 2);
}
