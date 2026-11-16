/* Castings fijos (fotos en public/castings, 1200x1500). Descripciones de
   malafama/src/data/catalog.json y pecado/src/data/catalog.json → "models".
   set: "white" = estudio blanco (MALA FAMA) · "concrete" = pared de hormigón (PECADO). */

export const CASTINGS = [
  { id: "dani", name: "Dani", set: "white", from: "MALA FAMA", es: "Chico mediterráneo, rapado con perfilado, aro de plata", desc: "young Mediterranean man, buzz cut with sharp line-up, light stubble, small silver hoop earring", wearing: "grey t-shirt, black trousers or white sneakers" },
  { id: "nia", name: "Nia", set: "white", from: "MALA FAMA", es: "Chica negra, trenzas largas, piercing en el septum", desc: "young Black woman, long black box braids, small silver septum ring", wearing: "grey t-shirt, black trousers or white sneakers" },
  { id: "leo", name: "Leo", set: "white", from: "MALA FAMA", es: "Chico latino, mullet rizado, bigote fino", desc: "young Latino man, dark curly mullet, thin moustache, lanky", wearing: "grey t-shirt, black trousers or white sneakers" },
  { id: "yuna", name: "Yuna", set: "white", from: "MALA FAMA", es: "Chica asiática, flequillo cortina, piercings", desc: "young East Asian woman, black hair with wispy curtain bangs, silver ear piercings", wearing: "grey t-shirt, black trousers or white sneakers" },
  { id: "rizo", name: "Rizo", set: "concrete", from: "PECADO", es: "Chico espigado, piel clara, melena rizada", desc: "lanky young Spanish man, pale skin, big messy dark brown curly mop", wearing: "plain black t-shirt, black jeans or black sneakers" },
  { id: "sombra", name: "Sombra", set: "concrete", from: "PECADO", es: "Andrógino, flequillo emo negro, aro en el labio", desc: "androgynous young man, pale skin, layered jet-black hair with a long emo fringe over one eye, small silver lip ring", wearing: "plain black t-shirt, black jeans or black sneakers" },
  { id: "vera", name: "Vera", set: "concrete", from: "PECADO", es: "Chica, media melena negra con flequillo recto", desc: "young woman, light olive skin, black shoulder-length hair with a heavy blunt fringe, silver septum ring", wearing: "plain black t-shirt, black jeans or black sneakers" },
  { id: "lux", name: "Lux", set: "concrete", from: "PECADO", es: "Chica, wolf cut platino con raíces, tatuajes finos", desc: "young woman, light brown skin, bleached platinum wolf cut with dark roots, fine-line forearm tattoos", wearing: "plain black t-shirt, black jeans or black sneakers" },
];

export function getCasting(id) {
  return CASTINGS.find((c) => c.id === id) || null;
}

export function castingPath(id) {
  return `/castings/${id}.jpg`;
}
