/* MOCK_MODE: respuestas de texto simuladas (sin llamar a Claude). */
import "server-only";
import { getBrand, IDEA_CATEGORIES, kindForCategory } from "@/config/brands";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const NAMES = [
  ["Bajo Cero", "Frío, seco y de calle: suena a pista de hielo y a actitud.", ["calle", "frío", "nocturno"], "Ni un grado más"],
  ["Santo Grial", "Juego irónico con lo sagrado; funciona en bordado gótico.", ["gótico", "ironía", "ritual"], "Lo que todos buscan"],
  ["Cuarto Oscuro", "Revelado de fotos y club: misterio con oficio.", ["noche", "foto", "club"], "Se revela despacio"],
  ["Mala Hierba", "Lo que nunca muere: barrio, resistencia, verde lavado.", ["barrio", "resistente", "verde"], "Nunca muere"],
  ["Orilla", "Corta, luminosa, mediterránea: minimal con sal.", ["minimal", "mar", "luz"], "Donde acaba el ruido"],
  ["Golpe Bajo", "Boxeo y descaro; wordmark potente en condensada.", ["deporte", "descaro", "boxeo"], "Sin aviso"],
  ["Nada Igual", "Promesa de pieza única: cada prenda, una vez.", ["exclusivo", "limpio", "lujo"], "Una vez y ya"],
  ["Velo Negro", "Romántico y oscuro, con encaje y plata.", ["romántico", "oscuro", "plata"], "Lo que no se ve"],
  ["Kilómetro Cero", "Hecho aquí, sin vueltas; suena a origen.", ["local", "origen", "honesto"], "Desde aquí"],
  ["Dios Menor", "Ironía de calle; perfecto para un monograma DM.", ["ironía", "calle", "gótico"], "Fe en lo pequeño"],
  ["Pólvora", "Una palabra, una chispa: explosivo y corto.", ["intenso", "corto", "fuego"], "Prende rápido"],
  ["Hora Punta", "Ciudad, prisa y metro: streetwear de diario.", ["ciudad", "diario", "metro"], "Siempre llena"],
  ["Lunes Eterno", "Humor seco: ropa para sobrevivir a la semana.", ["humor", "diario", "ironía"], "Otra vez"],
  ["Altar", "Corto y rotundo: lo que se venera.", ["ritual", "lujo", "gótico"], "Arrodíllate"],
  ["Baja Fidelidad", "Lo-fi, cintas y grano: nostalgia Y2K.", ["y2k", "música", "nostalgia"], "Suena mejor roto"],
  ["Cero Drama", "Divertido y ligero; funciona con tipografía redonda.", ["divertido", "ligero", "pop"], "Tranqui"],
  ["Contrabando", "Lo que se pasa de mano en mano: deseo y riesgo.", ["riesgo", "calle", "deseo"], "No preguntes"],
  ["Fiebre", "Una palabra, una temperatura: intensidad.", ["intenso", "noche", "pop"], "Sube"],
  ["Nube Negra", "Melancolía con estilo; gráfica de rayos y tormenta.", ["grunge", "tormenta", "oscuro"], "Llueve dentro"],
  ["Doble Filo", "Elegante y peligroso: sastrería con navaja.", ["lujo", "peligro", "sastrería"], "Corta en dos"],
];

export async function brandNames({ count }) {
  await wait(900);
  const n = Math.min(count || 8, NAMES.length);
  const names = NAMES.slice(0, n).map(([name, why, vibe, tagline]) => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "");
    return { name, why, vibe, tagline, handle: "@" + slug, domains: [`${slug}.com`, `${slug}.es`], caution: "Nombre genérico: comprobar registro en OEPM/EUIPO y disponibilidad del dominio y las redes antes de usarlo." };
  });
  return { data: { names }, usage: null };
}

const IDEAS = [
  ["Relic Boxy Hoodie", "sudaderas", "Sudadera boxy recortada en felpa pesada lavada, con una cruz alada bordada en el pecho.", "a cropped boxy heavyweight fleece hoodie in washed black with a tall hood, raw frayed hem and a large original winged cross embroidered in bone thread across the chest, no text", "worn with ultra-wide washed black jeans, chunky black skate shoes and a silver chain"],
  ["Halo Wide Pant", "pantalones", "Pantalón extra ancho de felpa con panel lateral de llamas en contraste.", "extra-wide heavyweight fleece sweatpants in washed burgundy with tribal flame appliqué panels down both legs in ecru, elastic waist with flat drawcord, slightly stacked hem, no text", "with a cropped grey hoodie, white chunky sneakers and a small silver hoop"],
  ["Static Tee", "camisetas", "Camiseta boxy con gráfico de rayos en serigrafía craquelada.", "a boxy cropped heavyweight cotton t-shirt in faded charcoal with a cracked screen-printed lightning storm graphic across the front, ribbed crew neck, no text", "layered over a white long-sleeve, with wide jeans and a studded belt"],
  ["Orbit Track Jacket", "chaquetas", "Chaqueta de chándal brillante con vivos en contraste y cremallera metálica.", "a cropped boxy nylon track jacket in safety orange with ecru piping along the sleeves, chunky silver zip and stand collar, no text", "with matching wide track pants and white retro runners"],
  ["Thorn Knit Polo", "punto", "Polo de punto jacquard con motivo de espinas.", "a boxy cropped jacquard knit polo shirt in bone and black with an all-over thorn vine pattern, contrast ribbed collar and cuffs, three-button placket, no text", "with wide black trousers and loafers"],
  ["Saint Denim", "vaqueros", "Vaquero ultra ancho con bolsillos traseros bordados.", "ultra-wide baggy jeans in raw indigo denim with thick contrast topstitching and oversized back pockets embroidered with ornate filigree crosses in white thread, flat lay shows the back, no text", "back view with a black boxy tee and black puffy skate shoes"],
  ["Chrome Charm Belt", "accesorios", "Cinturón de cuero con tachuelas piramidales y charms de plata.", "a black leather belt with silver pyramid studs and a hanging chrome heart charm, chunky silver buckle", "worn low on wide jeans, close-up at the hip"],
  ["Vein Ring", "joyeria", "Anillo de plata 925 con relieve de ramas y espinas.", "a chunky sterling silver ring sculpted with intertwined thorn branches, oxidised recesses and polished highlights", "on the index finger, hand resting on a denim pocket"],
];

export async function clothingIdeas({ count, categories, brand }) {
  await wait(1100);
  const b = getBrand(brand);
  let pool = IDEAS.filter((i) => !categories?.length || categories.includes(i[1]));
  if (!pool.length) pool = IDEAS;
  const concepts = Array.from({ length: count || 4 }, (_, i) => {
    const [name, category, d, g, s] = pool[i % pool.length];
    return { name: i >= pool.length ? `${name} ${i + 1}` : name, category, kind: kindForCategory(category), description_es: d, details_es: ["Corte boxy", "Felpa / algodón pesado", "Hecho en Portugal"], garment_en: g, styling_en: s, price_eur: b.id === "musketeer" ? 160 : 79 };
  });
  return { data: { concepts }, usage: null };
}

export async function improvePrompt({ text, kind, category }) {
  await wait(800);
  const k = kind && kind !== "auto" ? kind : kindForCategory(category);
  return {
    data: {
      garment_en: `a cropped boxy heavyweight cotton hoodie in washed black with a tall hood, dropped shoulders, ribbed cuffs, kangaroo pocket and a large original embroidered emblem on the chest in bone thread (from the description: ${String(text || "").slice(0, 120)}), no text`,
      styling_en: "worn with ultra-wide washed black jeans stacking on chunky black skate shoes, a silver chain and a black beanie, hands in pockets, relaxed attitude",
      kind: k,
      name: "Relic Hoodie",
      category: category || "sudaderas",
      description_es: "Sudadera boxy recortada en algodón pesado lavado, con emblema bordado en el pecho.",
      details_es: ["Corte boxy recortado", "Algodón 480 g/m²", "Bordado en hilo crudo", "Lavado a la piedra"],
      notes_es: "He interpretado una sudadera negra lavada con bordado; concreta el color del bordado si quieres otro.",
    },
    usage: null,
  };
}
