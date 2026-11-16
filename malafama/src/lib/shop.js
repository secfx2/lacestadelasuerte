/* Pure, client-safe shop helpers. Never import "@/lib/catalog" here: that module pulls
   the full catalog JSON (incl. internal generation prompts) into the client bundle.
   Catalog-dependent helpers live in "@/lib/shop-server".
   Brand-specific values (categories, shipping, discount, copy) come from src/config/brand.js. */
import brand from "@/config/brand";

/** Categories in display order: [{ slug, name, intro }] (src/config/brand.js). */
export const CATEGORIES = brand.categories;

const { locale: LOCALE, currency: CURRENCY } = brand.locale;

/** Local currency formatting. Whole amounts without decimals ("260 €"), others with two ("4,95 €"). */
export function formatPrice(amount) {
  const whole = Math.abs(amount - Math.round(amount)) < 0.005;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(whole ? Math.round(amount) : amount);
}

/* --------------------------------------------------------------------------
   Shop-wide constants (edit them in src/config/brand.js)
   -------------------------------------------------------------------------- */
export const FREE_SHIPPING_FROM = brand.shipping.freeFrom;
export const SHIPPING_METHODS = brand.shipping.methods;
export const DISCOUNT_CODES = brand.discount?.code
  ? { [brand.discount.code.toUpperCase()]: { rate: brand.discount.rate, label: brand.discount.label } }
  : {};
export const VAT_RATE = brand.locale.vatRate;

export const ANNOUNCEMENTS = brand.announcements;

/** Editorial line per category. */
export const CATEGORY_COPY = Object.fromEntries(brand.categories.map((c) => [c.slug, c.intro || ""]));

/* --------------------------------------------------------------------------
   Lookups
   -------------------------------------------------------------------------- */
export function categoryName(slug) {
  return CATEGORIES.find((c) => c.slug === slug)?.name || "";
}

export function getColor(product, colorSlug) {
  return product.colors.find((c) => c.slug === colorSlug) || product.colors[0];
}

export function productHref(product, colorSlug) {
  const base = `/producto/${product.slug}`;
  return colorSlug && colorSlug !== product.colors[0].slug ? `${base}?color=${colorSlug}` : base;
}


/* --------------------------------------------------------------------------
   Colour families (filter facets)
   -------------------------------------------------------------------------- */
export const COLOR_FAMILIES = [
  { slug: "negro", name: "Negro", hex: "#111111" },
  { slug: "gris", name: "Gris y carbón", hex: "#7c7e80" },
  { slug: "crudo", name: "Blanco y crudo", hex: "#ede6da" },
  { slug: "rojo", name: "Burdeos y rojo", hex: "#6e2430" },
  { slug: "azul", name: "Azul", hex: "#2e4fa3" },
  { slug: "marron", name: "Marrón", hex: "#4b2e22" },
  { slug: "verde", name: "Oliva", hex: "#5e5f45" },
  { slug: "rosa", name: "Rosa", hex: "#d9a6ae" },
  { slug: "plata", name: "Plata", hex: "#c7c9cc" },
  { slug: "multi", name: "Multicolor", hex: "linear-gradient(135deg,#111 0 33%,#6e2430 33% 66%,#ede6da 66%)" },
];

/** MALA FAMA names its colours in Spanish ("Burdeos Lavado", "Crudo Racing"): the first word sets the family. */
const FIRST_WORD_FAMILY = {
  negro: "negro", carbon: "gris", gris: "gris", pizarra: "gris",
  crudo: "crudo", blanco: "crudo", hielo: "crudo",
  burdeos: "rojo", rojo: "rojo", ladrillo: "rojo",
  cobalto: "azul", azul: "azul", indigo: "azul",
  chocolate: "marron", marron: "marron",
  oliva: "verde", rosa: "rosa", plata: "plata",
};

export function colorFamily(color) {
  const n = color.name.toLowerCase();
  const first = n.normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(/\s+/)[0];
  if (FIRST_WORD_FAMILY[first]) return FIRST_WORD_FAMILY[first];
  if (/silver/.test(n)) return "plata";
  if (/multi/.test(n)) return "multi";
  if (/tobacco|chocolate|brown/.test(n)) return "marron";
  if (/blue|navy|indigo|denim|wash/.test(n) && !/washed black/.test(n)) return "azul";
  if (/white|cream|ecru|bone|stone|optic/.test(n)) return "crudo";
  if (/grey|gray|charcoal|steel|slate|acid/.test(n)) return "gris";
  if (/black|ink/.test(n)) return "negro";
  return "multi";
}

export function productFamilies(product) {
  return [...new Set(product.colors.map(colorFamily))];
}

/* --------------------------------------------------------------------------
   Sizes (filter facets)
   -------------------------------------------------------------------------- */
const SIZE_ORDER = [
  "XS", "S", "M", "L", "XL", "XXL",
  "28", "30", "32", "34", "36",
  "10", "12", "14", "16", "18", "20",
  "S/M", "L/XL", "36-40", "41-46",
  "80", "90", "100", "110",
  "45 cm", "50 cm", "55 cm", "60 cm",
  "Talla única", "Unidad",
];

export const SIZE_GROUPS = [
  { id: "ropa", label: "Ropa", sizes: ["XS", "S", "M", "L", "XL", "XXL"] },
  { id: "cintura", label: "Cintura (denim y lona)", sizes: ["28", "30", "32", "34", "36"] },
  { id: "anillo", label: "Anillos (ES)", sizes: ["10", "12", "14", "16", "18", "20"] },
  { id: "otros", label: "Otros", sizes: ["S/M", "L/XL", "36-40", "41-46", "80", "90", "100", "110", "45 cm", "50 cm", "55 cm", "60 cm", "Talla única", "Unidad"] },
];

export function sortSizes(list) {
  return [...list].sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
}

/** Size encoded for URLs: keep it readable. */
export const sizeToParam = (s) => s.toLowerCase().replace(/\s+/g, "").replace("/", "-");
export function sizeFromParam(param) {
  return SIZE_ORDER.find((s) => sizeToParam(s) === param) || null;
}

export function isOneSize(product) {
  return product.sizes.length === 1;
}

/* --------------------------------------------------------------------------
   Sorting
   -------------------------------------------------------------------------- */
export const SORTS = [
  { id: "destacados", label: "Destacados" },
  { id: "novedades", label: "Novedades" },
  { id: "precio-asc", label: "Precio ↑" },
  { id: "precio-desc", label: "Precio ↓" },
];

const BADGE_WEIGHT = { "Best seller": 4, Top: 4, Nuevo: 3, "Edición limitada": 2, "Pieza rara": 1 };

/** Products carry `index` (catalog order) in the slim catalog. */
export function sortProducts(list, sort) {
  const indexed = list.map((p, k) => ({ p, i: p.index ?? k }));
  switch (sort) {
    case "precio-asc":
      indexed.sort((a, b) => a.p.price - b.p.price || a.i - b.i);
      break;
    case "precio-desc":
      indexed.sort((a, b) => b.p.price - a.p.price || a.i - b.i);
      break;
    case "novedades":
      indexed.sort((a, b) => (b.p.badge === "Nuevo") - (a.p.badge === "Nuevo") || b.i - a.i);
      break;
    default:
      indexed.sort((a, b) => (BADGE_WEIGHT[b.p.badge] || 0) - (BADGE_WEIGHT[a.p.badge] || 0) || a.i - b.i);
  }
  return indexed.map((x) => x.p);
}

/* --------------------------------------------------------------------------
   Copy helpers for the product page
   -------------------------------------------------------------------------- */
export function fitNote(product) {
  const F = brand.fitNotes;
  if (F.bySlug?.[product.slug]) return F.bySlug[product.slug];
  if (F.byCategory?.[product.category]) return F.byCategory[product.category];
  if (product.kind === "jewellery") {
    return product.sizes.some((s) => /^\d+$/.test(s)) ? F.jewelleryRing : F.jewellery;
  }
  if (product.kind === "accessory") {
    if (isOneSize(product)) return product.fit === "Ajustable" ? F.accessoryAdjustable : F.accessoryOneSize;
    return `${product.fit}.`;
  }
  if (product.line && product.line === brand.currentLine) {
    return product.category === "pantalones" ? F.lineBottoms : F.lineTops;
  }
  if (product.category === "pantalones") return product.sizes[0] === "28" ? F.bottomsWaist : F.bottoms;
  return F.default;
}

export function careText(product) {
  const C = brand.care;
  if (product.kind === "jewellery") return C.jewellery;
  if (/leather|piel/i.test(product.composition + product.name)) return C.leather;
  if (product.kind === "accessory") return C.accessory;
  return C.garment;
}


/* --------------------------------------------------------------------------
   Search
   -------------------------------------------------------------------------- */
export const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const SYNONYMS = {
  sudadera: "sudaderas hoodie crewneck",
  capucha: "hoodie",
  vaquero: "denim",
  vaqueros: "denim",
  plata: "joyeria silver",
  anillo: "ring",
  anillos: "ring",
  cadena: "chain",
  collar: "pendant chain",
  pulsera: "bracelet",
  pendiente: "earring",
  gorra: "cap",
  gorro: "beanie",
  cinturon: "belt",
  bolso: "bag",
  bolsa: "bag",
  calcetines: "socks",
  capa: "cape",
  chaqueta: "jacket",
  camiseta: "tee",
  camisa: "shirt",
  pantalon: "pant",
  pantalones: "pant",
  jersey: "knit",
  conjunto: "set conjuntos",
  conjuntos: "set",
  chandal: "set track",
  polo: "polo",
  punto: "knit polo cardigan",
  pedreria: "crystal",
  cristales: "crystal",
  brillo: "crystal chrome",
  llamas: "flame",
  llama: "flame",
  alas: "wing",
  corazon: "heart",
  espinas: "thorn",
  daga: "dagger",
  colgante: "pendant",
  gafas: "shades",
  pasamontanas: "balaclava",
  chaqueton: "jacket puffer",
  plumifero: "puffer",
  cuero: "leather",
  vaquera: "denim",
  carreras: "racing paddock pit",
  cremallera: "zip",
};

export function searchProducts(products, query, limit = 12) {
  const q = normalize(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  const scored = [];
  for (const p of products) {
    const name = normalize(p.name);
    const cat = normalize(categoryName(p.category));
    const hay = `${name} ${cat} ${p.category} ${normalize(p.colors.map((c) => c.name).join(" "))} ${normalize(p.composition || "")} ${normalize(p.fit || "")}`;
    let score = 0;
    let all = true;
    for (const t of terms) {
      const alts = [t, ...(SYNONYMS[t] ? SYNONYMS[t].split(" ") : [])];
      let hit = 0;
      for (const a of alts) {
        if (name.startsWith(a)) hit = Math.max(hit, 5);
        else if (name.includes(a)) hit = Math.max(hit, 4);
        else if (cat.includes(a)) hit = Math.max(hit, 3);
        else if (hay.includes(a)) hit = Math.max(hit, 1);
      }
      if (!hit) all = false;
      score += hit;
    }
    if (all) scored.push({ p, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((x) => x.p);
}

export const POPULAR_SEARCHES = brand.search.popular;

/* --------------------------------------------------------------------------
   Money
   -------------------------------------------------------------------------- */
export function roundMoney(n) {
  return Math.round(n * 100) / 100;
}
