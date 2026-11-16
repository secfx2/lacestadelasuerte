/* Size guides (cm unless stated). Pure data, client-safe. Measurements are generic;
   the note under each table comes from src/config/brand.js (brand.sizeGuideNotes). */
import brand from "@/config/brand";

const note = (id, fallback) => brand.sizeGuideNotes?.[id] ?? fallback;

export const GUIDES = {
  tops: {
    title: "Partes de arriba",
    note: note("tops", "Medidas de la prenda en plano, en centímetros. Corte boxy: hombro caído y cuerpo amplio."),
    head: ["Talla", "Ancho de pecho", "Largo (recortado)", "Manga"],
    rows: [
      ["XS", "60", "58", "58"],
      ["S", "62", "60", "59"],
      ["M", "64", "62", "60"],
      ["L", "66", "64", "61"],
      ["XL", "68", "66", "62"],
      ["XXL", "70", "68", "63"],
    ],
  },
  outer: {
    title: "Chaquetas y capas",
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
    title: "Pantalones (XS–XXL por cintura)",
    note: note("bottoms", "Cintura elástica medida en reposo. Corte baggy de tiro relajado."),
    head: ["Talla", "Cintura", "Cadera", "Largo exterior", "Ancho de bajo"],
    rows: [
      ["XS", "64–68", "112", "104", "30"],
      ["S", "68–72", "116", "106", "31"],
      ["M", "72–76", "120", "108", "32"],
      ["L", "76–80", "124", "110", "33"],
      ["XL", "80–84", "128", "112", "34"],
      ["XXL", "84–88", "132", "114", "35"],
    ],
  },
  waist: {
    title: "Denim y lona (talla de cintura)",
    note: note("waist", "Talla en pulgadas de cintura. Pierna amplia; recomendamos tu talla habitual."),
    head: ["Talla", "Cintura", "Cadera", "Tiro", "Largo exterior"],
    rows: [
      ["28", "72", "110", "32", "104"],
      ["30", "77", "114", "33", "105"],
      ["32", "82", "118", "34", "106"],
      ["34", "87", "122", "35", "107"],
      ["36", "92", "126", "36", "108"],
    ],
  },
  rings: {
    title: "Anillos — tallaje español",
    note: note("rings", "Rodea la base del dedo con un hilo, marca el punto de cruce y mide la longitud en milímetros. La talla española equivale a la circunferencia menos 40."),
    head: ["Talla ES", "Circunferencia (mm)", "Diámetro interior (mm)"],
    rows: [
      ["10", "50", "15,9"],
      ["12", "52", "16,6"],
      ["14", "54", "17,2"],
      ["16", "56", "17,8"],
      ["18", "58", "18,5"],
      ["20", "60", "19,1"],
    ],
  },
  chains: {
    title: "Cadenas y colgantes",
    note: note("chains", "Longitud total con el cierre. Caída orientativa sobre un cuello medio."),
    head: ["Largo", "Caída"],
    rows: [
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
    title: "Cinturones",
    note: note("belts", "Elige la talla que corresponde a tu cintura medida sobre el pantalón."),
    head: ["Talla", "Cintura", "Largo total"],
    rows: [
      ["80", "70–80 cm", "98 cm"],
      ["90", "80–90 cm", "108 cm"],
      ["100", "90–100 cm", "118 cm"],
      ["110", "100–110 cm", "128 cm"],
    ],
  },
};

/** Which guide(s) apply to a product. */
export function guidesFor(product) {
  const s = product.sizes;
  if (s.includes("10")) return ["rings"];
  if (s.some((x) => /cm$/.test(x))) return ["chains"];
  if (s.includes("S/M")) return ["bracelets"];
  if (s.includes("36-40")) return ["socks"];
  if (s.includes("80")) return ["belts"];
  if (s.includes("28")) return ["waist"];
  if (product.category === "conjuntos") return ["tops", "bottoms"];
  if (product.category === "pantalones") return ["bottoms"];
  if (product.category === "chaquetas") return ["outer", "tops"];
  if (s.length === 1) return [];
  return ["tops", "outer"];
}

/* MALA FAMA: tops XS–XXL, pantalones XS–XXL por cintura y anillos 10–20 (el resto de piezas es talla única). */
export const ALL_GUIDES_ORDER = ["tops", "outer", "bottoms", "rings"];
