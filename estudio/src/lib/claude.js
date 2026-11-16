/* ==========================================================================
   Texto con Claude (servidor): nombres de marca, ideas de ropa y
   "mejorar prompt". claude-opus-5-5 + salidas estructuradas (zod).
   ========================================================================== */
import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { UserError } from "./errors";
import { fetchBytes, isLocalUrl } from "./storage";
import { absoluteUrl, isPublicHttpsUrl } from "./env";
import { NamesSchema, IdeasSchema, ImproveSchema } from "./textSchemas";
import { getBrand, IDEA_CATEGORIES } from "@/config/brands";

const MODEL = "claude-opus-5-5";
let client = null;
const anthropic = () => {
  if (!process.env.ANTHROPIC_API_KEY) throw new UserError("Falta ANTHROPIC_API_KEY: las funciones de texto (nombres, ideas, mejorar prompt) no están disponibles.", { status: 503 });
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 2, timeout: 110000 });
  return client;
};

/** Bloques de imagen: URL pública directa o base64 si es local / privada. */
async function imageBlocks(refs = [], request) {
  const blocks = [];
  for (const r of refs.slice(0, 6)) {
    const url = typeof r === "string" ? r : r?.url;
    if (!url) continue;
    const abs = absoluteUrl(url, request);
    if (!isLocalUrl(url) && isPublicHttpsUrl(abs) && !/\.svg(\?|$)/i.test(abs)) {
      blocks.push({ type: "image", source: { type: "url", url: abs } });
      continue;
    }
    try {
      const { bytes, contentType } = await fetchBytes(isLocalUrl(url) ? url : abs);
      const mt = /png/.test(contentType) ? "image/png" : /webp/.test(contentType) ? "image/webp" : /gif/.test(contentType) ? "image/gif" : /jpe?g/.test(contentType) ? "image/jpeg" : null;
      if (mt) blocks.push({ type: "image", source: { type: "base64", media_type: mt, data: Buffer.from(bytes).toString("base64") } });
    } catch {}
  }
  return blocks;
}

async function run({ system, text, refs, schema, request, maxTokens = 16000 }) {
  const content = [...(await imageBlocks(refs, request)), { type: "text", text }];
  let res;
  try {
    res = await anthropic().messages.parse({
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content }],
      output_config: { format: zodOutputFormat(schema), effort: "medium" },
    });
  } catch (e) {
    if (e instanceof UserError) throw e;
    if (e instanceof Anthropic.RateLimitError) throw new UserError("Claude está recibiendo demasiadas peticiones. Espera un minuto y vuelve a probar.", { status: 429, detail: e.message });
    if (e instanceof Anthropic.AuthenticationError) throw new UserError("La clave de Claude (ANTHROPIC_API_KEY) no es válida.", { status: 503, detail: e.message });
    if (e instanceof Anthropic.PermissionDeniedError) throw new UserError("La clave de Claude no tiene permiso para este modelo.", { status: 503, detail: e.message });
    if (e instanceof Anthropic.BadRequestError) throw new UserError("Claude no ha aceptado la petición (¿alguna imagen no válida?).", { status: 400, detail: e.message });
    if (e instanceof Anthropic.APIConnectionError) throw new UserError("No se pudo conectar con Claude. Revisa la conexión y prueba otra vez.", { status: 502, detail: e.message });
    if (e instanceof Anthropic.InternalServerError) throw new UserError("Claude tiene un problema temporal. Prueba otra vez en un momento.", { status: 502, detail: e.message });
    if (e instanceof Anthropic.APIError) throw new UserError(`Error de Claude (${e.status ?? "?"}).`, { status: 502, detail: e.message });
    throw e;
  }
  if (res.stop_reason === "refusal") {
    throw new UserError("Claude no ha querido responder a esta petición. Reformúlala (sin marcas reales ni contenido delicado) y prueba otra vez.", { status: 422, detail: res.stop_details?.explanation || null });
  }
  if (res.stop_reason === "max_tokens") throw new UserError("La respuesta ha salido demasiado larga. Pide menos resultados.", { status: 422 });
  if (!res.parsed_output) throw new UserError("Claude ha devuelto una respuesta que no se puede leer. Prueba otra vez.", { status: 502 });
  return { data: res.parsed_output, usage: res.usage };
}

const brandContext = (brandId) => {
  const b = getBrand(brandId);
  if (brandId === "nueva" || !b.hint) return "The brand is new: no fixed style yet, follow the user's idea.";
  return `Brand: ${b.name}. ${b.hint}. Photo direction: ${b.photoHint}. Fit language: ${b.fit}.`;
};

const LANG = { es: "Spanish (Spain)", en: "English", mix: "a mix of Spanish and English (some names in each, or bilingual wordplay)" };

export async function brandNames({ idea, count, lang, styles, brand, refs }, request) {
  const system = `You are a senior naming strategist for fashion and streetwear brands in Spain. You write in Spanish (Spain) for explanations. You invent ORIGINAL names: never existing famous brands, no trademarks of others, nothing offensive. Names must be short, easy to say in Spanish and English, memorable, and work as a logo, a woven label and an Instagram handle.`;
  const text = `Create exactly ${count} brand name proposals.
Idea / description: ${idea || "(none given)"}
Language of the names: ${LANG[lang] || LANG.es}.
Desired style: ${(styles || []).join(", ") || "open"}.
${brandContext(brand)}
${refs?.length ? "The attached images are mood references: use them for tone and aesthetics." : ""}
Vary the approach (invented words, real words with a twist, short punchy, two-word, wordplay). For each, write the reasoning in Spanish.`;
  return run({ system, text, refs, schema: NamesSchema, request });
}

export async function clothingIdeas({ theme, count, categories, brand, refs }, request) {
  const b = getBrand(brand);
  const cats = (categories?.length ? categories : IDEA_CATEGORIES.map((c) => c.slug)).join(", ");
  const system = `You are a fashion designer and art director for streetwear e-commerce. You design original, commercial, photogenic pieces. Product copy is in Spanish (Spain); image descriptions in precise English. Never use real brands, band names or legible text unless the user asks for a specific text.`;
  const text = `Design exactly ${count} product concepts for a collection.
Theme: ${theme || "(open)"}
Allowed category slugs (use only these, mix them as asked): ${cats}.
${brandContext(brand)}
${refs?.length ? "The attached images are references: take inspiration from them (shapes, graphics, colours) without copying logos." : ""}
Rules for garment_en: it is inserted into a flat-lay product photo template (top-down, seamless pure white, blank label). Describe ONLY the item: type, colour/wash, fabric, ${b.fit}, every graphic, embroidery, print, hardware; say "no text" unless a text is part of the design (then give it exactly). Keep each under 90 words.
Prices in euros coherent with the brand (${b.id === "musketeer" || b.id === "orbita" ? "high-end: 90–490 €" : "streetwear: 35–180 €"}).`;
  return run({ system, text, refs, schema: IdeasSchema, request });
}

export async function improvePrompt({ text: userText, kind, shot, brand, refs, category }, request) {
  const b = getBrand(brand);
  const cats = b.categories.map((c) => c.slug).join(", ");
  const system = `You turn casual Spanish descriptions of clothing (and reference photos) into precise English image prompts for e-commerce product photography. You never invent brand logos or real brands; text on garments only if the user gives it.`;
  const text = `The user describes a piece (in Spanish, casually): """${userText || ""}"""
Requested type: ${kind || "auto"}; shot(s): ${shot || "flat lay"}; current category: ${category || "auto"}.
${brandContext(brand)}
${refs?.length ? "Attached images are the user's references: describe what matters from them (shape, colour, graphics, details) so an image model can recreate a similar NEW product." : ""}
garment_en is inserted into a flat-lay template (top-down, white background, blank label): only describe the item, with the fit language "${b.fit}" when it applies. Keep it under 110 words.
styling_en is for the on-model photo: a complete styled look that matches the brand.
Allowed category slugs: ${cats}.`;
  return run({ system, text, refs, schema: ImproveSchema, request, maxTokens: 8000 });
}
