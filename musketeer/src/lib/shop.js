/* Pure, client-safe shop helpers. Never import "@/lib/catalog" here: that module pulls
   the full catalog JSON (incl. internal generation prompts) into the client bundle.
   Catalog-dependent helpers live in "@/lib/shop-server". */

export const CATEGORIES = [
  { slug: "chaquetas", name: "Chaquetas" },
  { slug: "punto", name: "Punto" },
  { slug: "sudaderas", name: "Sudaderas" },
  { slug: "camisetas", name: "Camisetas" },
  { slug: "camisas", name: "Camisas" },
  { slug: "pantalones", name: "Pantalones" },
  { slug: "accesorios", name: "Accesorios" },
  { slug: "joyeria", name: "Joyería" },
];

/** Spanish EUR formatting. Whole amounts without decimals ("260 €"), others with two ("4,95 €"). */
export function formatPrice(eur) {
  const whole = Math.abs(eur - Math.round(eur)) < 0.005;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(whole ? Math.round(eur) : eur);
}

/* --------------------------------------------------------------------------
   Shop-wide constants
   -------------------------------------------------------------------------- */
export const FREE_SHIPPING_FROM = 150;
export const SHIPPING_METHODS = [
  { id: "estandar", name: "Estándar", eta: "2–4 días laborables", price: 4.95, freeFrom: FREE_SHIPPING_FROM },
  { id: "express", name: "Express", eta: "24–48 h", price: 9.95, freeFrom: null },
];
export const DISCOUNT_CODES = { TOUSPOURUN: { rate: 0.1, label: "TOUSPOURUN — 10 %" } };

export const ANNOUNCEMENTS = [
  "Envío gratuito desde 150 €",
  "Devoluciones gratuitas en 30 días",
  "Catálogo permanente — sin drops",
  "Tous pour un",
];

/** Editorial line per category (Spanish, sober). */
export const CATEGORY_COPY = {
  chaquetas: "Capas, bombers, piel y lona pesada. Abrigo con oficio, hecho para durar temporadas.",
  punto: "Punto pesado, cota de malla y mohair. Volumen boxy y tacto denso.",
  sudaderas: "Felpa gruesa, lavados vintage y el lema bordado. La base del uniforme.",
  camisetas: "Algodón de gramaje alto, corte boxy y gráficos de esgrima.",
  camisas: "Camisas de poeta y sobrecamisas. La parte más literaria del armario.",
  pantalones: "Denim baggy, cargos y lona de carpintero. Caída amplia, tiro relajado.",
  accesorios: "Gorras, cinturones, bolsas y calcetines. Los detalles del regimiento.",
  joyeria: "Plata 925 maciza. Sellos, guanteletes y cadenas, sin baño ni atajos.",
};

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
  { slug: "gris", name: "Gris", hex: "#8e8f92" },
  { slug: "crudo", name: "Blanco y crudo", hex: "#efe9dc" },
  { slug: "azul", name: "Azul", hex: "#2f4470" },
  { slug: "marron", name: "Marrón", hex: "#5a3b26" },
  { slug: "plata", name: "Plata", hex: "#c0c0c0" },
  { slug: "multi", name: "Multicolor", hex: "linear-gradient(135deg,#111 0 33%,#9a9da1 33% 66%,#efe9dc 66%)" },
];

export function colorFamily(color) {
  const n = color.name.toLowerCase();
  if (/silver/.test(n)) return "plata";
  if (/multi/.test(n)) return "multi";
  if (/tobacco|chocolate|brown/.test(n)) return "marron";
  if (/blue|navy|tabard|wash/.test(n) && !/washed black/.test(n)) return "azul";
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

const BADGE_WEIGHT = { "Best seller": 4, Nuevo: 3, "Edición limitada": 2, "Pieza rara": 1 };

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
  if (product.kind === "jewellery") {
    if (product.sizes.some((s) => /^\d+$/.test(s))) return "Plata 925 maciza — tallaje español de anillo. Si dudas entre dos tallas, elige la mayor.";
    return "Plata 925 maciza — hipoalergénica, sin baños.";
  }
  if (product.kind === "accessory") {
    if (isOneSize(product)) return product.fit === "Ajustable" ? "Talla única ajustable." : "Talla única.";
    return `${product.fit}.`;
  }
  if (product.slug === "mantle-cape") return "Corte amplio tipo capa — recomendamos tu talla habitual.";
  if (product.category === "pantalones") {
    return product.sizes[0] === "28"
      ? "Corte baggy — recomendamos tu talla habitual de cintura."
      : "Corte baggy — recomendamos tu talla habitual.";
  }
  return "Corte boxy — recomendamos tu talla habitual. Una talla más para un volumen extra.";
}

export function careText(product) {
  if (product.kind === "jewellery") {
    return [
      "Plata de ley 925. Evita el contacto con perfumes, cloro y agua salada.",
      "Limpia con un paño suave de plata. La pátina oscura de los relieves es intencionada.",
      "Guárdala en su bolsa de algodón, separada de otras piezas.",
    ];
  }
  if (/leather|piel/i.test(product.composition + product.name)) {
    return [
      "Limpieza en seco especializada en piel.",
      "No mojar. Si se humedece, dejar secar a temperatura ambiente.",
      "Guardar en percha ancha, lejos de la luz directa.",
    ];
  }
  if (product.kind === "accessory") {
    return ["Limpieza en seco o lavado a mano en frío.", "No usar secadora.", "Secar en plano."];
  }
  return [
    "Lavar del revés a 30 °C con colores similares.",
    "No usar secadora. Secar en plano o en percha.",
    "Planchar a temperatura media del revés. No planchar bordados ni estampados.",
  ];
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
  jersey: "knit",
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

export const POPULAR_SEARCHES = ["Hoodie", "Plata 925", "Denim", "Capa", "Anillo", "Punto"];

/* --------------------------------------------------------------------------
   Money
   -------------------------------------------------------------------------- */
export function roundMoney(n) {
  return Math.round(n * 100) / 100;
}
