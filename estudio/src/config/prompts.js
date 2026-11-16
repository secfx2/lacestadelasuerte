/* ==========================================================================
   Plantillas de prompt (inglés) — protocolo de 2 fotos de las marcas:
   pecado/scripts/IMAGE_PIPELINE.md y malafama/scripts/IMAGE_PIPELINE.md.
   Funciones puras: las usa el cliente (vista previa del prompt, editable) y
   el servidor (Claude "Mejorar prompt" / "Ideas de ropa").
   ========================================================================== */
import { getBrand } from "./brands";

const clean = (s) => String(s || "").replace(/\s+/g, " ").trim().replace(/[.\s]+$/, "");

/** Pista de estilo de la marca para añadir al final de un prompt. */
export function brandHint(brandId) {
  const b = getBrand(brandId);
  return b.hint ? `Brand direction: ${b.hint}.` : "";
}

/** Shot 1 — flat lay cenital sobre blanco (sin refs) o guiado por referencias. */
export function flatLayPrompt({ garment, kind = "garment", brand, hasRefs = false }) {
  const b = getBrand(brand);
  const g = clean(garment) || "a boxy cropped heavyweight cotton hoodie";
  const refNote = hasRefs
    ? " Use the reference image(s) only as design inspiration (shape, colour, graphics, details); create a clean new product shot, do not copy backgrounds, people or logos from them."
    : "";
  if (kind === "jewellery") {
    return `Sharp macro e-commerce product photo, shot from slightly above: ${g}, sterling silver, on a seamless pure white surface. Even diffused high-key studio light, soft natural contact shadow, ultra detailed metal texture, no text, no logos, nothing else in frame.${refNote} ${brandHint(brand)}`.trim();
  }
  if (kind === "accessory") {
    return `Professional e-commerce product photo shot from directly above: ${g}, on a seamless pure white surface, neatly arranged and centered. Even diffused high-key studio light, soft natural contact shadow, ultra detailed material texture, no legible text, numbers or logos unless described above, contemporary 2026 streetwear catalog, nothing else in frame.${refNote} ${brandHint(brand)}`.trim();
  }
  return `Professional streetwear e-commerce flat lay product photo shot from directly above. ${g}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds. Fit: ${b.fit}. Blank woven neck label with no text. No legible text, numbers or logos anywhere except exactly what is described above; ornamental elements must be illegible flourishes. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric texture (weave, wash, stitching, embroidery, prints, hardware), contemporary 2026 streetwear catalog, nothing else in frame.${refNote} ${brandHint(brand)}`.trim();
}

/** Shot 2 — con modelo. image 1 = la prenda (flat lay o foto), image 2 = el casting. */
export function onModelPrompt({ casting, pose, kind = "garment", brand, extraRefs = 0 }) {
  const b = getBrand(brand);
  const desc = casting?.desc || "a young model";
  const wearing = casting?.wearing || "plain basics";
  const look = clean(pose) || "a simple styled look with complementary basics that match the brand, relaxed confident attitude";
  const concrete = b.photo === "concrete";
  const extra = extraRefs > 0 ? ` Use any further images only as styling and mood reference.` : "";
  if (kind === "accessory" || kind === "jewellery") {
    const bg = concrete ? "against a raw grey concrete wall, soft overcast daylight" : "seamless pure white background, soft high-key studio light";
    return `Close-up e-commerce photo: the exact person from image 2 (${desc}; same skin tone, and same face/hair if visible) wearing the exact item from image 1 (identical colour, material, shape and details). Framing: ${look}. ${bg}, sharp focus on the item. No other logos.${extra}`;
  }
  if (concrete) {
    return `Full-body street-style lookbook photo: the exact person from image 2 (${desc}; same face, hair and skin tone) standing in front of the same raw grey concrete wall on a concrete floor, wearing the exact item from image 1 (identical colour, wash, cut, stitching, embroidery, print, studs and hardware) as the hero piece of a styled look: ${look}. Do not copy the ${wearing} from image 2 unless the look asks for them. The hero piece stays fully visible; ${b.fit}. Soft overcast daylight, straight-on framing, head to toe in frame, realistic candid street-style photo. No logos or brand marks on any garment or shoe.${extra}`;
  }
  return `Full-body streetwear e-commerce studio photo: the exact person from image 2 (${desc}; same face, hair and skin tone) wearing the exact item from image 1 (identical colour, wash, cut, panels, prints, embroidery and hardware) as the hero piece of a styled look: ${look}. Do not copy the ${wearing} from image 2 unless the look asks for them. The hero piece stays fully visible; ${b.fit}. ${b.photoHint ? b.photoHint.charAt(0).toUpperCase() + b.photoHint.slice(1) : "Seamless pure white background, soft high-key studio light"}, subtle floor shadow, head to toe in frame. No logos or brand marks other than those on the hero piece.${extra}`;
}

export const LOGO_STYLES = [
  { id: "wordmark", es: "Wordmark", en: "a typographic wordmark logotype" },
  { id: "monograma", es: "Monograma", en: "an interlocking monogram of the initials" },
  { id: "emblema", es: "Emblema", en: "an emblem / badge mark with a symbol" },
  { id: "simbolo", es: "Símbolo", en: "a standalone pictorial symbol" },
  { id: "gotico", es: "Gótico", en: "blackletter / gothic lettering" },
  { id: "script", es: "Script", en: "flowing copperplate script lettering" },
  { id: "minimal", es: "Minimal", en: "minimal, geometric, generous spacing" },
  { id: "retro", es: "Retro", en: "retro 60s–70s lettering" },
  { id: "grafiti", es: "Grafiti", en: "street graffiti tag lettering, clean and legible" },
  { id: "serif", es: "Serif clásica", en: "classic high-contrast serif lettering, luxury fashion house" },
  { id: "sello", es: "Sello", en: "a circular seal / stamp with lettering around the edge" },
  { id: "deportivo", es: "Deportivo", en: "varsity / racing sports lettering" },
];

/** Logo plano tipo vector sobre blanco, sin mockup. */
export function logoPrompt({ name, description, styles = [], colors, brand, hasRefs = false }) {
  const st = LOGO_STYLES.filter((s) => styles.includes(s.id)).map((s) => s.en);
  const n = clean(name);
  const what = n ? `the clothing brand name "${n}"` : "a clothing brand";
  const nameRule = n ? ` The only text is "${n}", spelled exactly like that, letter by letter.` : " No text unless described.";
  const col = clean(colors) || "solid black";
  const refNote = hasRefs ? " Use the reference image(s) only as inspiration for style, not as a template to copy." : "";
  const b = getBrand(brand);
  const brandMood = b.hint && brand !== "nueva" ? ` Mood: ${b.hint.split(":")[1]?.split(";")[0]?.trim() || ""}.` : "";
  return `Flat vector-style logo design for ${what}${st.length ? `, ${st.join(", ")}` : ""}. ${clean(description) ? clean(description) + ". " : ""}Centered on a plain pure white background with generous margins, ${col} flat colour, crisp clean edges, balanced proportions, no gradients, no 3D, no shadows, no texture, no mockup, no photo, no extra elements.${nameRule}${refNote}${brandMood}`.replace(/\s+/g, " ").trim();
}
