/* Size guides (cm unless stated). Pure data, client-safe. Measurements are generic;
   the note under each table comes from src/config/brand.js (brand.sizeGuideNotes). */
import brand from "@/config/brand";
import { sizeGroupOf } from "@/lib/shop";

const note = (id, fallback) => brand.sizeGuideNotes?.[id] ?? fallback;

export const GUIDES = {
  tops: {
    title: "Sudaderas, camisetas y capas (XS–XXL)",
    note: note("tops", "Medidas de la prenda en plano, en centímetros. Corte boxy: hombro caído y cuerpo amplio."),
    head: ["Talla", "Ancho de pecho", "Largo", "Manga"],
    rows: [
      ["XS", "58", "62", "58"],
      ["S", "61", "64", "59"],
      ["M", "64", "66", "60"],
      ["L", "67", "68", "61"],
      ["XL", "70", "70", "62"],
      ["XXL", "73", "72", "63"],
    ],
  },
  outer: {
    title: "Chaquetas (XS–XXL)",
    note: note("outer", "Medidas de la prenda en plano. Pensadas para llevar sobre punto o sudadera."),
    head: ["Talla", "Ancho de pecho", "Largo", "Hombro"],
    rows: [
      ["XS", "62", "64", "54"],
      ["S", "65", "66", "56"],
      ["M", "68", "68", "58"],
      ["L", "71", "70", "60"],
      ["XL", "74", "72", "62"],
      ["XXL", "77", "74", "64"],
    ],
  },
  bottoms: {
    title: "Chándal (XS–XXL)",
    note: note("bottoms", "Cintura elástica medida en reposo. Corte baggy de tiro relajado."),
    head: ["Talla", "Cintura", "Cadera", "Largo exterior"],
    rows: [
      ["XS", "66", "108", "102"],
      ["S", "70", "112", "104"],
      ["M", "74", "116", "106"],
      ["L", "78", "120", "108"],
      ["XL", "82", "124", "110"],
      ["XXL", "86", "128", "112"],
    ],
  },
  waist: {
    title: "Vaqueros (talla de cintura 28–38)",
    note: note("waist", "Talla en pulgadas de cintura. Pierna amplia; recomendamos tu talla habitual."),
    head: ["Talla", "Cintura", "Cadera", "Tiro", "Bajo", "Largo exterior"],
    rows: [
      ["28", "72", "112", "29", "33", "106"],
      ["30", "77", "116", "30", "33,5", "107"],
      ["32", "82", "120", "31", "34", "108"],
      ["34", "87", "124", "32", "34,5", "109"],
      ["36", "92", "128", "33", "35", "110"],
      ["38", "97", "132", "34", "35,5", "111"],
    ],
  },
  rings: {
    title: "Anillos — tallaje español (12–22)",
    note: note("rings", "Rodea la base del dedo con un hilo, marca el punto de cruce y mide la longitud en milímetros. La talla española equivale a la circunferencia menos 40."),
    head: ["Talla ES", "Circunferencia (mm)", "Diámetro interior (mm)"],
    rows: [
      ["10", "50", "15,9"],
      ["12", "52", "16,6"],
      ["14", "54", "17,2"],
      ["16", "56", "17,8"],
      ["18", "58", "18,5"],
      ["20", "60", "19,1"],
      ["22", "62", "19,7"],
    ],
  },
  chains: {
    title: "Cadenas, gargantillas y colgantes",
    note: note("chains", "Longitud total con el cierre. Caída orientativa sobre un cuello medio."),
    head: ["Largo", "Caída"],
    rows: [
      ["35 cm", "Gargantilla, pegada al cuello"],
      ["40 cm", "Gargantilla, sobre la nuez"],
      ["45 cm", "Base del cuello"],
      ["50 cm", "Sobre la clavícula"],
      ["55 cm", "Bajo la clavícula"],
      ["60 cm", "Parte alta del pecho"],
    ],
  },
  bracelets: {
    title: "Pulseras",
    note: note("bracelets", "Mide el contorno de la muñeca justo por encima del hueso."),
    head: ["Talla", "Contorno de muñeca", "Largo de la pieza"],
    rows: [
      ["S/M", "15–17 cm", "19 cm"],
      ["L/XL", "17–19 cm", "21 cm"],
    ],
  },
  socks: {
    title: "Calcetines",
    note: note("socks", "Equivalencia con la talla de calzado europea."),
    head: ["Talla", "Calzado EU"],
    rows: [
      ["36-40", "36 — 40"],
      ["41-46", "41 — 46"],
    ],
  },
  belts: {
    title: "Cinturones (80–110)",
    note: note("belts", "Elige la talla que corresponde a tu cintura medida sobre el pantalón."),
    head: ["Talla", "Cintura", "Largo total"],
    rows: [
      ["80", "70–80 cm", "98 cm"],
      ["90", "80–90 cm", "108 cm"],
      ["100", "90–100 cm", "118 cm"],
      ["110", "100–110 cm", "128 cm"],
    ],
  },
  shoes: {
    title: "Calzado — tallaje europeo (36–45)",
    note: note("shoes", "Tallaje europeo. Mide el pie de talón a dedo, de pie y por la tarde."),
    head: ["EU", "UK", "US", "Largo del pie (cm)"],
    rows: [
      ["36", "3,5", "5", "23"],
      ["37", "4", "5,5", "23,7"],
      ["38", "5", "6,5", "24,3"],
      ["39", "6", "7", "25"],
      ["40", "6,5", "7,5", "25,7"],
      ["41", "7,5", "8,5", "26,3"],
      ["42", "8", "9", "27"],
      ["43", "9", "10", "27,7"],
      ["44", "9,5", "10,5", "28,3"],
      ["45", "10,5", "11,5", "29"],
    ],
  },
};

const BOTTOMS = new Set(brand.bottomCategories || ["pantalones"]);

/** Which guide(s) apply to a product (by size group: waist, shoes, belts, rings, lengths, clothing). */
export function guidesFor(product) {
  const s = product.sizes;
  switch (sizeGroupOf(product)) {
    case "anillo":
      return ["rings"];
    case "largo":
      return ["chains"];
    case "cinturon":
      return ["belts"];
    case "calzado":
      return ["shoes"];
    case "cintura":
      return ["waist"];
    default:
  }
  if (s.includes("S/M")) return ["bracelets"];
  if (s.includes("36-40")) return ["socks"];
  if (BOTTOMS.has(product.category)) return ["bottoms"];
  if (product.category === "chaquetas") return ["outer", "tops"];
  if (s.length === 1) return [];
  return ["tops", "outer"];
}

/** Tables shown in /ayuda#tallas (bracelets and socks stay available for future products). */
export const ALL_GUIDES_ORDER = ["waist", "tops", "bottoms", "outer", "rings", "chains", "belts", "shoes"];
