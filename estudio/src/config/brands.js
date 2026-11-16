/* ==========================================================================
   src/config/brands.js — las 4 marcas de la casa + "Marca nueva".
   Paleta y fuentes copiadas de <marca>/src/config/brand.js y fonts.js; las
   pistas de estilo (en inglés) se añaden a los prompts de imagen.
   SAMPLES: productos reales elegidos de <marca>/src/data/catalog.json, con las
   fotos del hub en vivo (https://propuestas-flax.vercel.app/<marca>/...).
   ========================================================================== */

const HUB = "https://propuestas-flax.vercel.app";

const SAMPLES = {
  musketeer: [
    {"slug": "cavalier-leather-bomber", "name": "Cavalier Leather Bomber", "category": "chaquetas", "price": 490, "badge": "Edición limitada", "color": "Tobacco", "hex": "#5C3A21", "img": ["https://propuestas-flax.vercel.app/musketeer/products/cavalier-leather-bomber/tobacco-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/cavalier-leather-bomber/tobacco-2.jpg"]},
    {"slug": "tous-pour-un-hoodie", "name": "Tous Pour Un Hoodie", "category": "sudaderas", "price": 135, "badge": "Best seller", "color": "Washed Black", "hex": "#2B2B2B", "img": ["https://propuestas-flax.vercel.app/musketeer/products/tous-pour-un-hoodie/washed-black-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/tous-pour-un-hoodie/washed-black-2.jpg"]},
    {"slug": "lace-up-poet-shirt", "name": "Lace-Up Poet Shirt", "category": "camisas", "price": 150, "badge": "Pieza rara", "color": "Optic White", "hex": "#F7F7F5", "img": ["https://propuestas-flax.vercel.app/musketeer/products/lace-up-poet-shirt/optic-white-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/lace-up-poet-shirt/optic-white-2.jpg"]},
    {"slug": "tabard-track-pant", "name": "Tabard Track Pant", "category": "pantalones", "price": 110, "badge": "Nuevo", "color": "Tabard Blue", "hex": "#2340A0", "img": ["https://propuestas-flax.vercel.app/musketeer/products/tabard-track-pant/tabard-blue-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/tabard-track-pant/tabard-blue-2.jpg"]},
    {"slug": "boxy-emblem-tee", "name": "Boxy Emblem Tee", "category": "camisetas", "price": 55, "badge": "Nuevo", "color": "Butter", "hex": "#F2D98A", "img": ["https://propuestas-flax.vercel.app/musketeer/products/boxy-emblem-tee/butter-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/boxy-emblem-tee/butter-2.jpg"]},
    {"slug": "riviera-knit-polo", "name": "Riviera Knit Polo", "category": "punto", "price": 120, "badge": "Nuevo", "color": "Sky", "hex": "#A9C6E8", "img": ["https://propuestas-flax.vercel.app/musketeer/products/riviera-knit-polo/sky-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/riviera-knit-polo/sky-2.jpg"]},
    {"slug": "tabard-work-jacket", "name": "Tabard Work Jacket", "category": "chaquetas", "price": 260, "badge": null, "color": "Washed Black", "hex": "#2A2A2A", "img": ["https://propuestas-flax.vercel.app/musketeer/products/tabard-work-jacket/washed-black-1.jpg", "https://propuestas-flax.vercel.app/musketeer/products/tabard-work-jacket/washed-black-2.jpg"]},
  ],
  orbita: [
    {"slug": "capsule-flight-jacket", "name": "Capsule Flight Jacket", "category": "chaquetas", "price": 290, "badge": "Nuevo", "color": "Safety Orange", "hex": "#FF5A1F", "img": ["https://propuestas-flax.vercel.app/orbita/products/capsule-flight-jacket/safety-orange-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/capsule-flight-jacket/safety-orange-2.jpg"]},
    {"slug": "starfield-knit", "name": "Starfield Knit", "category": "punto", "price": 160, "badge": "Nuevo", "color": "Midnight", "hex": "#0E1A3A", "img": ["https://propuestas-flax.vercel.app/orbita/products/starfield-knit/midnight-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/starfield-knit/midnight-2.jpg"]},
    {"slug": "mission-patch-hoodie", "name": "Mission Patch Hoodie", "category": "sudaderas", "price": 140, "badge": "Nuevo", "color": "Suit White", "hex": "#F4F2EC", "img": ["https://propuestas-flax.vercel.app/orbita/products/mission-patch-hoodie/suit-white-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/mission-patch-hoodie/suit-white-2.jpg"]},
    {"slug": "blueprint-tee", "name": "Blueprint Tee", "category": "camisetas", "price": 60, "badge": null, "color": "Blueprint", "hex": "#1E4FA0", "img": ["https://propuestas-flax.vercel.app/orbita/products/blueprint-tee/blueprint-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/blueprint-tee/blueprint-2.jpg"]},
    {"slug": "engineer-shirt", "name": "Engineer Shirt", "category": "camisas", "price": 110, "badge": "Nuevo", "color": "Suit White", "hex": "#F4F2EC", "img": ["https://propuestas-flax.vercel.app/orbita/products/engineer-shirt/suit-white-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/engineer-shirt/suit-white-2.jpg"]},
    {"slug": "flight-suit-trouser", "name": "Flight Suit Trouser", "category": "pantalones", "price": 150, "badge": "Nuevo", "color": "Safety Orange", "hex": "#FF5A1F", "img": ["https://propuestas-flax.vercel.app/orbita/products/flight-suit-trouser/safety-orange-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/flight-suit-trouser/safety-orange-2.jpg"]},
    {"slug": "moonwalk-puffer", "name": "Moonwalk Puffer", "category": "chaquetas", "price": 320, "badge": "Nuevo", "color": "Suit White", "hex": "#F4F2EC", "img": ["https://propuestas-flax.vercel.app/orbita/products/moonwalk-puffer/suit-white-1.jpg", "https://propuestas-flax.vercel.app/orbita/products/moonwalk-puffer/suit-white-2.jpg"]},
  ],
  malafama: [
    {"slug": "tribal-panel-set", "name": "Tribal Panel Set", "category": "conjuntos", "price": 149, "badge": "Top", "color": "Burdeos Lavado", "hex": "#6E2430", "img": ["https://propuestas-flax.vercel.app/malafama/products/tribal-panel-set/burdeos-lavado-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/tribal-panel-set/burdeos-lavado-2.jpg"]},
    {"slug": "mask-zip-hoodie", "name": "Mask Zip Hoodie", "category": "sudaderas", "price": 95, "badge": "Top", "color": "Negro Estrellas", "hex": "#111111", "img": ["https://propuestas-flax.vercel.app/malafama/products/mask-zip-hoodie/negro-estrellas-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/mask-zip-hoodie/negro-estrellas-2.jpg"]},
    {"slug": "paddock-racing-pant", "name": "Paddock Racing Pant", "category": "pantalones", "price": 89, "badge": "Top", "color": "Crudo Rojo", "hex": "#E6DFD1", "img": ["https://propuestas-flax.vercel.app/malafama/products/paddock-racing-pant/crudo-rojo-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/paddock-racing-pant/crudo-rojo-2.jpg"]},
    {"slug": "xray-heart-tee", "name": "X-Ray Heart Tee", "category": "camisetas", "price": 45, "badge": null, "color": "Crudo Rosa", "hex": "#EDE6DA", "img": ["https://propuestas-flax.vercel.app/malafama/products/xray-heart-tee/crudo-rosa-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/xray-heart-tee/crudo-rosa-2.jpg"]},
    {"slug": "spray-tribal-polo", "name": "Spray Tribal Polo", "category": "punto", "price": 95, "badge": null, "color": "Pizarra Negro", "hex": "#4A4F57", "img": ["https://propuestas-flax.vercel.app/malafama/products/spray-tribal-polo/pizarra-negro-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/spray-tribal-polo/pizarra-negro-2.jpg"]},
    {"slug": "ice-puffer", "name": "Ice Puffer", "category": "chaquetas", "price": 229, "badge": null, "color": "Hielo Translúcido", "hex": "#E9ECEF", "img": ["https://propuestas-flax.vercel.app/malafama/products/ice-puffer/hielo-translucido-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/ice-puffer/hielo-translucido-2.jpg"]},
    {"slug": "halo-airbrush-set", "name": "Halo Airbrush Set", "category": "conjuntos", "price": 145, "badge": null, "color": "Negro", "hex": "#111111", "img": ["https://propuestas-flax.vercel.app/malafama/products/halo-airbrush-set/negro-1.jpg", "https://propuestas-flax.vercel.app/malafama/products/halo-airbrush-set/negro-2.jpg"]},
  ],
  pecado: [
    {"slug": "seraph-baggy", "name": "Seraph Baggy", "category": "vaqueros", "price": 95, "badge": "Top", "color": "Washed Black", "hex": "#2B2A2D", "img": ["https://propuestas-flax.vercel.app/pecado/products/seraph-baggy/washed-black-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/seraph-baggy/washed-black-2.jpg"]},
    {"slug": "spine-hoodie", "name": "Spine Hoodie", "category": "sudaderas", "price": 85, "badge": "Nuevo", "color": "Washed Charcoal", "hex": "#3F3E3D", "img": ["https://propuestas-flax.vercel.app/pecado/products/spine-hoodie/washed-charcoal-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/spine-hoodie/washed-charcoal-2.jpg"]},
    {"slug": "thornstorm-sweatpant", "name": "Thornstorm Sweatpant", "category": "chandal", "price": 69, "badge": "Nuevo", "color": "Grey Acid", "hex": "#7E7D7B", "img": ["https://propuestas-flax.vercel.app/pecado/products/thornstorm-sweatpant/grey-acid-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/thornstorm-sweatpant/grey-acid-2.jpg"]},
    {"slug": "second-skin-tee", "name": "Second Skin Tee", "category": "camisetas", "price": 45, "badge": "Nuevo", "color": "Black / Stripe", "hex": "#0B0B0C", "img": ["https://propuestas-flax.vercel.app/pecado/products/second-skin-tee/black-stripe-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/second-skin-tee/black-stripe-2.jpg"]},
    {"slug": "chapel-polo", "name": "Chapel Polo", "category": "polos-y-camisas", "price": 49, "badge": null, "color": "Black", "hex": "#0B0B0C", "img": ["https://propuestas-flax.vercel.app/pecado/products/chapel-polo/black-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/chapel-polo/black-2.jpg"]},
    {"slug": "sinner-biker", "name": "Sinner Biker", "category": "chaquetas", "price": 240, "badge": "Top", "color": "Black", "hex": "#0B0B0C", "img": ["https://propuestas-flax.vercel.app/pecado/products/sinner-biker/black-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/sinner-biker/black-2.jpg"]},
    {"slug": "insomnia-stripe-ls", "name": "Insomnia Stripe LS", "category": "capas", "price": 35, "badge": null, "color": "Black / White Stripe", "hex": "#0B0B0C", "img": ["https://propuestas-flax.vercel.app/pecado/products/insomnia-stripe-ls/black-white-stripe-1.jpg", "https://propuestas-flax.vercel.app/pecado/products/insomnia-stripe-ls/black-white-stripe-2.jpg"]},
  ],
};
const CATEGORIES = {
  musketeer: [{"slug": "chaquetas", "name": "Chaquetas"}, {"slug": "punto", "name": "Punto"}, {"slug": "sudaderas", "name": "Sudaderas"}, {"slug": "camisetas", "name": "Camisetas"}, {"slug": "camisas", "name": "Camisas"}, {"slug": "pantalones", "name": "Pantalones"}, {"slug": "accesorios", "name": "Accesorios"}, {"slug": "joyeria", "name": "Joyería"}],
  orbita: [{"slug": "chaquetas", "name": "Chaquetas"}, {"slug": "punto", "name": "Punto"}, {"slug": "sudaderas", "name": "Sudaderas"}, {"slug": "camisetas", "name": "Camisetas"}, {"slug": "camisas", "name": "Camisas"}, {"slug": "pantalones", "name": "Pantalones"}, {"slug": "accesorios", "name": "Accesorios"}, {"slug": "joyeria", "name": "Joyería"}],
  malafama: [{"slug": "conjuntos", "name": "Conjuntos"}, {"slug": "sudaderas", "name": "Sudaderas"}, {"slug": "pantalones", "name": "Pantalones"}, {"slug": "camisetas", "name": "Camisetas"}, {"slug": "punto", "name": "Punto"}, {"slug": "chaquetas", "name": "Chaquetas"}, {"slug": "accesorios", "name": "Accesorios"}, {"slug": "joyeria", "name": "Joyería"}],
  pecado: [{"slug": "vaqueros", "name": "Vaqueros"}, {"slug": "sudaderas", "name": "Sudaderas"}, {"slug": "chandal", "name": "Chándal"}, {"slug": "camisetas", "name": "Camisetas"}, {"slug": "polos-y-camisas", "name": "Polos y camisas"}, {"slug": "chaquetas", "name": "Chaquetas"}, {"slug": "capas", "name": "Capas"}, {"slug": "accesorios", "name": "Accesorios"}, {"slug": "joyeria", "name": "Joyería"}],
};

const TOPS = ["XS", "S", "M", "L", "XL"];
const TOPS_WIDE = ["XS", "S", "M", "L", "XL", "XXL"];

export const BRANDS = {
  musketeer: {
    id: "musketeer",
    name: "MUSKETEER",
    display: "Musketeer",
    tagline: "Tous pour un",
    live: `${HUB}/musketeer/`,
    wordmark: `${HUB}/musketeer/brand/wordmark-black.svg`,
    wordmarkRatio: 2596 / 291,
    skuPrefix: "MSK",
    freeFrom: 150,
    photo: "white",
    castings: ["dani", "nia", "leo", "yuna"],
    theme: {
      paper: "#ffffff", ink: "#0a0a0a", fog: "#f4f4f2", bone: "#ece8e1", tile: "#f2f2f2",
      muted: "#6b6b6b", line: "rgba(10,10,10,0.12)", accent: "#1f2b4d", alert: "#7a1f1f", dark: false,
    },
    fonts: { sans: "archivo", display: "archivo", serif: "instrument", name: { font: "display", stretch: "125%", weight: 600, upper: true, size: 1 } },
    palette: ["#0A0A0A", "#FFFFFF", "#ECE8E1", "#1F2B4D", "#7A1F1F", "#9A9DA1"],
    es: "Unisex high-end de corte boxy: punto pesado, chaquetas con capa, plata 925. Estudio blanco.",
    hint: "MUSKETEER — high-end unisex label inspired by the musketeers: heavyweight knits, boxy cropped jackets with cape and tabard details, washed cotton, refined hardware and 925 silver; quiet luxury, muted palette of ink black, ecru, bone, washed navy and tobacco",
    photoHint: "seamless pure white studio, high-end luxury catalog lighting",
    fit: "boxy cropped tops that end at the waist, wide straight trousers",
    sizes: TOPS,
    bottoms: ["XS", "S", "M", "L", "XL"],
    composition: "100% algodón",
  },
  orbita: {
    id: "orbita",
    name: "ÓRBITA",
    display: "Órbita",
    tagline: "Fuera de órbita",
    live: `${HUB}/orbita/`,
    wordmark: `${HUB}/orbita/brand/wordmark-black.svg`,
    wordmarkRatio: 5015 / 978,
    skuPrefix: "ORB",
    freeFrom: 150,
    photo: "white",
    castings: ["yuna", "leo", "nia", "dani"],
    theme: {
      paper: "#ffffff", ink: "#0E1A3A", fog: "#F4F2EC", bone: "#A9C6E8", tile: "#F2F3F5",
      muted: "#5b6275", line: "rgba(14,26,58,0.13)", accent: "#FF5A1F", alert: "#D7263D", dark: false,
    },
    fonts: { sans: "spaceGrotesk", display: "syncopate", serif: "spaceMono", name: { font: "display", stretch: "100%", weight: 700, upper: true, size: 0.86 } },
    palette: ["#FF5A1F", "#0E1A3A", "#F4F2EC", "#C3C7CC", "#E2A72E", "#A9C6E8"],
    es: "Retro space-age de los 60: naranja seguridad, plata, siluetas de cápsula. Estudio blanco.",
    hint: "ÓRBITA — retro 1960s space-age fashion: safety-orange flight jackets, metallic silver nylon, capsule silhouettes, mission patches, ribbed knits and technical fabrics; palette of safety orange, night-ink navy, suit white, silver, capsule mustard and sky blue; optimistic 60s space-age mood",
    photoHint: "seamless pure white studio, crisp optimistic 1960s space-age catalog",
    fit: "boxy cropped tops, wide straight trousers",
    sizes: TOPS,
    bottoms: ["XS", "S", "M", "L", "XL"],
    composition: "100% nailon reciclado",
  },
  malafama: {
    id: "malafama",
    name: "MALA FAMA",
    display: "Mala Fama",
    tagline: "Que hablen",
    live: `${HUB}/malafama/`,
    wordmark: `${HUB}/malafama/brand/wordmark-black.svg`,
    wordmarkRatio: 4482 / 810,
    skuPrefix: "MF",
    freeFrom: 100,
    photo: "white",
    castings: ["dani", "nia", "leo", "yuna"],
    theme: {
      paper: "#ffffff", ink: "#111111", fog: "#F4F2EE", bone: "#EDE6DA", tile: "#F2F2F2",
      muted: "#6b6b6b", line: "rgba(10,10,10,0.12)", accent: "#6E2430", alert: "#2E4FA3", dark: false,
    },
    fonts: { sans: "archivo", display: "unifraktur", serif: "pinyon", name: { font: "sans", stretch: "70%", weight: 800, upper: true, size: 1.08 } },
    palette: ["#6E2430", "#111111", "#EDE6DA", "#2E4FA3", "#C7C9CC", "#4B2E22"],
    es: "Conjuntos Y2K de chándal lavado, paneles tribales, strass. Estudio blanco.",
    hint: "MALA FAMA — Y2K streetwear tracksuit-set brand: vintage-washed heavyweight fleece, cropped boxy hoodies with tall hoods and gathered hems, extra-wide sweatpants, tribal and flame appliqué panels, airbrush, rhinestones, puff print, racing colour blocking, jacquard knit polos; washed burgundy, washed black, charcoal, cobalt, racing ecru",
    photoHint: "seamless pure white studio, soft high-key light, streetwear lookbook energy",
    fit: "cropped boxy tops that end at the waist, extra-wide trousers with a clean slightly stacked hem",
    sizes: TOPS_WIDE,
    bottoms: TOPS_WIDE,
    composition: "100% algodón",
  },
  pecado: {
    id: "pecado",
    name: "PECADO",
    display: "Pecado",
    tagline: "Sin perdón",
    live: `${HUB}/pecado/`,
    wordmark: `${HUB}/pecado/brand/wordmark-black.svg`,
    wordmarkRatio: 2546 / 787,
    skuPrefix: "PCD",
    freeFrom: 100,
    photo: "concrete",
    castings: ["rizo", "sombra", "vera", "lux"],
    theme: {
      paper: "#0B0B0C", ink: "#E9E2D3", fog: "#18171A", bone: "#2B2A2D", tile: "#E2E0DB",
      muted: "#8C8A88", line: "rgba(233,226,211,0.14)", accent: "#4A1015", alert: "#E0574D", dark: true,
    },
    fonts: { sans: "archivo", display: "grenze", serif: "unifraktur", name: { font: "display", stretch: "100%", weight: 700, upper: false, size: 1.45 } },
    palette: ["#2B2A2D", "#1F2A44", "#8C8A88", "#E9E2D3", "#B3121B", "#BFC2C6"],
    es: "Grunge Y2K y mall goth: vaqueros ultra baggy bordados, sudaderas deshiladas. Flat lay en blanco, modelo frente a pared de hormigón.",
    hint: "PECADO — Y2K grunge / mall-goth street brand: ultra-wide baggy jeans with big embroidered or printed gothic art (winged crosses, thorns, filigree, flames, skulls with roses), heavy washed boxy hoodies with raw frayed distressed hems, all-over grunge prints, studded belts and 925 silver jewellery; washed black, raw indigo, ash grey, bone and blood red",
    photoHint: "flat lay on seamless pure white; on-model shots against a raw grey concrete wall in soft overcast daylight",
    fit: "boxy tops, ULTRA-WIDE baggy jeans whose leg opening swallows the shoe",
    sizes: TOPS_WIDE,
    bottoms: ["28", "30", "32", "34", "36", "38"],
    composition: "100% algodón",
  },
  nueva: {
    id: "nueva",
    name: "MARCA NUEVA",
    display: "Marca nueva",
    tagline: "",
    live: null,
    wordmark: null,
    wordmarkRatio: 4,
    skuPrefix: "NEW",
    freeFrom: 100,
    photo: "white",
    castings: ["dani", "nia", "leo", "yuna"],
    theme: {
      paper: "#ffffff", ink: "#111111", fog: "#f3f3f1", bone: "#ebe7df", tile: "#f2f2f2",
      muted: "#6b6b6b", line: "rgba(10,10,10,0.12)", accent: "#111111", alert: "#9b2c2c", dark: false,
    },
    fonts: { sans: "archivo", display: "archivo", serif: "instrument", name: { font: "display", stretch: "110%", weight: 700, upper: true, size: 1 } },
    palette: ["#111111", "#FFFFFF", "#EBE7DF"],
    es: "Sin estilo fijado: el prompt manda. Estudio blanco.",
    hint: "",
    photoHint: "seamless pure white studio, soft high-key light",
    fit: "boxy cropped tops that end at the waist, extra-wide trousers",
    sizes: TOPS,
    bottoms: ["XS", "S", "M", "L", "XL"],
    composition: "100% algodón",
  },
};

BRANDS.musketeer.samples = SAMPLES.musketeer;
BRANDS.orbita.samples = SAMPLES.orbita;
BRANDS.malafama.samples = SAMPLES.malafama;
BRANDS.pecado.samples = SAMPLES.pecado;
BRANDS.nueva.samples = SAMPLES.musketeer;

BRANDS.musketeer.categories = CATEGORIES.musketeer;
BRANDS.orbita.categories = CATEGORIES.orbita;
BRANDS.malafama.categories = CATEGORIES.malafama;
BRANDS.pecado.categories = CATEGORIES.pecado;
BRANDS.nueva.categories = [
  { slug: "sudaderas", name: "Sudaderas" },
  { slug: "camisetas", name: "Camisetas" },
  { slug: "pantalones", name: "Pantalones" },
  { slug: "vaqueros", name: "Vaqueros" },
  { slug: "chaquetas", name: "Chaquetas" },
  { slug: "punto", name: "Punto" },
  { slug: "conjuntos", name: "Conjuntos" },
  { slug: "accesorios", name: "Accesorios" },
  { slug: "joyeria", name: "Joyería" },
];

export const BRAND_IDS = ["musketeer", "orbita", "malafama", "pecado", "nueva"];
export const DEFAULT_BRAND = "nueva";

export function getBrand(id) {
  return BRANDS[id] || BRANDS[DEFAULT_BRAND];
}

/** Categorías de prenda para "Ideas de ropa" (mezcla). */
export const IDEA_CATEGORIES = [
  { slug: "sudaderas", name: "Sudaderas" },
  { slug: "camisetas", name: "Camisetas" },
  { slug: "pantalones", name: "Pantalones" },
  { slug: "vaqueros", name: "Vaqueros" },
  { slug: "chaquetas", name: "Chaquetas" },
  { slug: "punto", name: "Punto" },
  { slug: "conjuntos", name: "Conjuntos" },
  { slug: "camisas", name: "Camisas" },
  { slug: "accesorios", name: "Accesorios" },
  { slug: "joyeria", name: "Joyería" },
];

const BOTTOM_CATS = new Set(["pantalones", "vaqueros", "chandal"]);
const ONE_SIZE_CATS = new Set(["accesorios", "joyeria"]);

/** Tallas por defecto según marca y categoría (lo que usa la tienda). */
export function defaultSizes(brandId, category) {
  const b = getBrand(brandId);
  if (ONE_SIZE_CATS.has(category)) return ["Talla única"];
  if (BOTTOM_CATS.has(category)) return b.bottoms;
  return b.sizes;
}

export function categoryName(brandId, slug) {
  const b = getBrand(brandId);
  return b.categories.find((c) => c.slug === slug)?.name || IDEA_CATEGORIES.find((c) => c.slug === slug)?.name || slug || "";
}

export function kindForCategory(category) {
  if (category === "joyeria") return "jewellery";
  if (category === "accesorios") return "accessory";
  return "garment";
}
