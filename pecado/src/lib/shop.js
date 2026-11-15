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
  { slug: "gris", name: "Gris y ceniza", hex: "#8c8a88" },
  { slug: "crudo", name: "Hueso y blanco", hex: "#e9e2d3" },
  { slug: "azul", name: "Índigo y azul", hex: "#2c3a5c" },
  { slug: "burdeos", name: "Burdeos", hex: "#4a1015" },
  { slug: "rosa", name: "Rosa", hex: "#f6c6d6" },
  { slug: "marron", name: "Marrón", hex: "#5a3b26" },
  { slug: "plata", name: "Plata", hex: "#c0c0c0" },
  { slug: "multi", name: "Multicolor", hex: "linear-gradient(135deg,#111 0 33%,#8c8a88 33% 66%,#e9e2d3 66%)" },
];

/** Family of a colourway, from its (English) name. Two-tone names ("Black / Oxblood") use the first colour. */
export function colorFamily(color) {
  const n = color.name.toLowerCase().split("/")[0].trim();
  if (/silver/.test(n)) return "plata";
  if (/pink|rose/.test(n)) return "rosa";
  if (/oxblood|blood|burgundy|wine/.test(n)) return "burdeos";
  if (/indigo|blue|navy|denim|ice/.test(n)) return "azul";
  if (/white|cream|ecru|bone|stone|optic|marble|sand/.test(n)) return "crudo";
  if (/grey|gray|charcoal|steel|slate|coal|ash|acid/.test(n) && !/black/.test(n)) return "gris";
  if (/black|ink/.test(n)) return "negro";
  if (/tobacco|chocolate|brown/.test(n)) return "marron";
  return "multi";
}

export function productFamilies(product) {
  return [...new Set(product.colors.map(colorFamily))];
}

/* --------------------------------------------------------------------------
   Sizes (filter facets)
   The same string can mean different things ("36" is a jeans waist AND a shoe
   size), so filters work on group-scoped keys: "cintura:36" vs "calzado:36".
   A product belongs to one group, worked out from its sizes, kind and category.
   -------------------------------------------------------------------------- */
const range = (a, b, step = 1) => Array.from({ length: Math.floor((b - a) / step) + 1 }, (_, i) => String(a + i * step));

export const SIZE_GROUPS = [
  { id: "ropa", label: "Ropa", sizes: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"] },
  { id: "cintura", label: "Cintura · vaqueros (pulgadas)", sizes: range(24, 44) },
  { id: "calzado", label: "Calzado (EU)", sizes: range(34, 48) },
  { id: "cinturon", label: "Cinturones (cm)", sizes: range(60, 130, 5) },
  { id: "anillo", label: "Anillos (ES)", sizes: range(6, 30) },
  { id: "largo", label: "Cadenas y gargantillas", sizes: range(30, 90, 5).map((n) => `${n} cm`) },
  { id: "otros", label: "Otros", sizes: ["S/M", "L/XL", "36-40", "41-46", "Par", "Unidad", "Talla única"] },
];
const GROUP_PREFIX = { cintura: "Cintura", calzado: "Calzado", cinturon: "Cinturón", anillo: "Anillo", largo: "Largo" };
const CLOTHING = new Set(SIZE_GROUPS[0].sizes);
const BOTTOMS = new Set(brand.bottomCategories || ["pantalones"]);

/** Size group of a product: ropa | cintura | calzado | cinturon | anillo | largo | otros. */
export function sizeGroupOf(product) {
  const s = product.sizes || [];
  if (s.length && s.every((x) => /^\d+\s*cm$/.test(x))) return "largo";
  if (s.length && s.every((x) => /^\d+$/.test(x))) {
    const nums = s.map(Number);
    if (product.kind === "jewellery") return "anillo";
    if (Math.min(...nums) >= 60) return "cinturon";
    if (BOTTOMS.has(product.category) || (Math.min(...nums) < 34 && Math.max(...nums) <= 44)) return "cintura";
    return "calzado";
  }
  if (s.some((x) => CLOTHING.has(x))) return "ropa";
  return "otros";
}

export const sizeKey = (group, size) => `${group}:${size}`;
export const splitSizeKey = (key) => {
  const i = key.indexOf(":");
  return i < 0 ? ["ropa", key] : [key.slice(0, i), key.slice(i + 1)];
};
/** Filter keys of a product ("cintura:32", "ropa:M"…). */
export function productSizeKeys(product) {
  const g = sizeGroupOf(product);
  return (product.sizes || []).map((s) => sizeKey(g, s));
}

/** Size encoded for URLs: keep it readable. */
export const sizeToParam = (s) => s.toLowerCase().replace(/\s+/g, "").replace("/", "-");
/** Clothing sizes stay bare in the URL (?talla=m,l); the rest carry their group (?talla=cintura-32,calzado-42). */
export function sizeKeyToParam(key) {
  const [g, s] = splitSizeKey(key);
  return g === "ropa" ? sizeToParam(s) : `${g}-${sizeToParam(s)}`;
}
const ALL_KEYS = SIZE_GROUPS.flatMap((g) => g.sizes.map((s) => sizeKey(g.id, s)));
export function sizeKeyFromParam(param) {
  return ALL_KEYS.find((k) => sizeKeyToParam(k) === param) || null;
}
/** Human label of a filter key: "Talla M", "Cintura 32", "Calzado 42", "Anillo 14", "Talla única". */
export function sizeKeyLabel(key) {
  const [g, s] = splitSizeKey(key);
  if (GROUP_PREFIX[g]) return `${GROUP_PREFIX[g]} ${s}`;
  return /^[A-Z/]+$/.test(s) ? `Talla ${s}` : s;
}

/** Every known size in display order (clothing, waist, shoes, belts, rings, lengths, others). */
const SIZE_ORDER = [...new Set(SIZE_GROUPS.flatMap((g) => g.sizes))];

/** Sorts a size list: known sizes in SIZE_ORDER, unknown ones after (numeric, then alphabetical). */
export function sortSizes(list) {
  const rank = (x) => {
    const i = SIZE_ORDER.indexOf(x);
    return i < 0 ? SIZE_ORDER.length : i;
  };
  return [...list].sort((a, b) => rank(a) - rank(b) || parseFloat(a) - parseFloat(b) || String(a).localeCompare(String(b), "es"));
}

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

/** «Top» (PECADO) counts as the template's best-seller badge. */
const BADGE_WEIGHT = { "Best seller": 4, Top: 4, Nuevo: 3, "Edición limitada": 2, "Pieza rara": 1 };
export const BEST_SELLER_BADGES = ["Best seller", "Top"];

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
  if (product.kind === "jewellery") {
    return sizeGroupOf(product) === "anillo" ? F.jewelleryRing : F.jewellery;
  }
  if (product.kind === "accessory") {
    const g = sizeGroupOf(product);
    if (g === "cinturon" && F.belts) return F.belts;
    if (g === "calzado" && F.shoes) return F.shoes;
    if (isOneSize(product)) return product.fit === "Ajustable" ? F.accessoryAdjustable : F.accessoryOneSize;
    return `${product.fit}.`;
  }
  if (F.byFit?.[product.fit]) return F.byFit[product.fit];
  if (F.byCategory?.[product.category]) return F.byCategory[product.category];
  const bottoms = BOTTOMS.has(product.category);
  if (product.line && product.line === brand.currentLine) return bottoms ? F.lineBottoms : F.lineTops;
  if (bottoms) return sizeGroupOf(product) === "cintura" ? F.bottomsWaist : F.bottoms;
  return F.default;
}

export function careText(product) {
  const C = brand.care;
  if (product.kind === "jewellery") return C.jewellery;
  if (/leather|piel|cuero/i.test(product.composition + product.name)) return C.leather;
  if (product.kind === "accessory") return C.accessory;
  return C.byCategory?.[product.category] || C.garment;
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
  vaquero: "denim jean baggy vaqueros",
  vaqueros: "denim jean baggy",
  baggy: "jean vaqueros",
  chandal: "sweatpant jogger chandal",
  pantalon: "sweatpant jogger jean jort",
  cruz: "cross",
  cruces: "cross",
  espinas: "thorn",
  alas: "wing",
  tachas: "pyramid spike grommet",
  calavera: "skull",
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
  jersey: "knit",
  polo: "polos",
  zapatillas: "skate",
  mochila: "backpack",
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
