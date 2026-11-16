/* ==========================================================================
   src/config/models.js — registro de modelos de imagen.

   Proveedor por defecto: la cuenta Higgsfield del propietario vía MCP
   (créditos del plan). Cada "rol" tiene parámetros por defecto que se pueden
   cambiar en Ajustes (se guardan en config/settings.json).

   Proveedor alternativo (solo si hay HF_API_KEY/HF_API_SECRET y el MCP no
   está conectado): API pública de pago por uso. Su catálogo depende de la
   cuenta: "documented" = aparece en docs.higgsfield.ai (no garantiza acceso);
   "guessed" = SIN VERIFICAR, nombre y parámetros supuestos. Comprobar en
   Ajustes → "Comprobar modelos" (llama a /estimate, no gasta).
   ========================================================================== */

/* ---------------------------------------------------------------- Roles */
export const ROLES = {
  garment: {
    label: "Prenda · flat lay",
    help: "Texto a imagen, sin referencias. Fotos de producto 2K, 4:5.",
    aspect: "4:5",
    mcp: { model: "gpt_image_2_6", quality: "medium", resolution: "2k" },
  },
  garmentRef: {
    label: "Con referencias · foto con modelo",
    help: "Imagen(es) + prompt: referencias, flat lay → modelo.",
    aspect: "4:5",
    mcp: { model: "gpt_image_2_6", quality: "medium", resolution: "2k" },
  },
  logo: {
    label: "Logo",
    help: "1:1, 1K. Logo plano sobre blanco.",
    aspect: "1:1",
    mcp: { model: "gpt_image_2_6", quality: "medium", resolution: "1k" },
  },
  logoVector: {
    label: "Logo vectorial",
    help: "Variante opcional con Recraft (más cara).",
    aspect: "1:1",
    mcp: { model: "recraft_v4_1", resolution: "2k" },
  },
};
export const ROLE_IDS = Object.keys(ROLES);

/* ------------------------------------------------- Modelos del MCP (plan) */
// gpt_image_2_6 y recraft_v4_1: usados por las marcas / indicados por el
// propietario. El resto aparecen en la descripción de la herramienta
// generate_image del MCP; sus parámetros exactos están SIN VERIFICAR.
export const MCP_MODELS = [
  { id: "gpt_image_2_6", label: "GPT Image 2.6", refs: true, quality: ["low", "medium", "high"], resolution: ["1k", "2k", "4k"], verified: true },
  { id: "gpt_image_2_6_flare", label: "GPT Image 2.6 Flare", refs: true, quality: ["low", "medium", "high"], resolution: ["1k", "2k", "4k"], verified: false },
  { id: "recraft_v4_1", label: "Recraft V4.1 (vector)", refs: false, quality: null, resolution: ["1k", "2k"], verified: true },
  { id: "marketing_studio_image", label: "Marketing Studio Image", refs: true, quality: ["low", "medium", "high"], resolution: ["1k", "2k", "4k"], verified: false },
  { id: "soul_2", label: "Soul 2 (retrato / moda)", refs: true, quality: null, resolution: null, verified: false },
];

export function mcpModel(id) {
  return MCP_MODELS.find((m) => m.id === id) || { id, label: id, refs: true, quality: ["low", "medium", "high"], resolution: ["1k", "2k", "4k"], verified: false, custom: true };
}

/** Coste interno de respaldo (créditos por imagen) cuando no hay get_cost. */
export function fallbackCredits(model, resolution) {
  const r = String(resolution || "2k").toLowerCase();
  const base = r === "1k" ? 0.5 : r === "4k" ? 2 : 1;
  return /recraft/.test(model || "") ? base * 10 : base;
}

/* -------------------------------------------- API pública (alternativa) */
const ASPECTS_STD = ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16"];

/**
 * Cada modelo describe cómo construir el cuerpo JSON:
 *  - aspect: { param, values }  (se elige el más cercano si falta 4:5)
 *  - resolution: { param, map }  (map: "1K"/"2K"/"4K" → valor del modelo)
 *  - images: { param, mode: "array"|"single", max }
 *  - extra: parámetros fijos
 *  - credits: coste interno por imagen
 */
export const API_MODELS = [
  {
    path: "marketing-studio/image/flare", label: "Marketing Studio Image 2.5 Flare", status: "documented",
    roles: ["garment", "garmentRef", "logo"],
    aspect: { param: "aspect_ratio", values: ["1:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16", "21:9"] },
    resolution: { param: "resolution", map: { "1K": "1k", "2K": "2k", "4K": "4k" } },
    images: { param: "image_urls", mode: "array", max: 16 },
    extra: { quality: "medium", enhance_prompt: false },
  },
  {
    path: "xai/grok-imagine-image-2.0", label: "Grok Image 2.0", status: "documented",
    roles: ["garment", "garmentRef", "logo"],
    aspect: { param: "aspect_ratio", values: ["1:1", "1:2", "2:1", "3:2", "2:3", "4:3", "3:4", "16:9", "9:16"] },
    resolution: { param: "resolution", map: { "1K": "1k", "2K": "2k", "4K": "2k" } },
    images: { param: "image_urls", mode: "array", max: 10 },
    extra: { quality: "medium" },
  },
  {
    path: "alibaba/qwen-image-3/edit", label: "Qwen Image 3 · edición", status: "documented",
    roles: ["garmentRef"], requiresImages: true,
    aspect: { param: "aspect_ratio", values: ["1:1", "2:3", "3:2", "3:4", "4:3", "7:9", "9:7", "9:16", "16:9", "21:9"] },
    resolution: { param: "resolution", map: { "1K": "1k", "2K": "2k", "4K": "2k" } },
    images: { param: "image_urls", mode: "array", max: 3 },
    extra: {},
  },
  {
    path: "alibaba/qwen-image-3/text-to-image", label: "Qwen Image 3", status: "documented",
    roles: ["garment", "logo"],
    aspect: { param: "aspect_ratio", values: ["1:1", "2:3", "3:2", "3:4", "4:3", "7:9", "9:7", "9:16", "16:9", "21:9"] },
    resolution: { param: "resolution", map: { "1K": "1k", "2K": "2k", "4K": "2k" } },
    images: null,
    extra: {},
  },
  {
    path: "recraft/v4.1/text-to-image", label: "Recraft V4.1 (1K)", status: "documented",
    roles: ["logo", "logoVector"], fixedResolution: "1K",
    aspect: { param: "aspect_ratio", values: ["1:1", "2:1", "1:2", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5", "16:9", "9:16"] },
    resolution: { param: "resolution", map: { "1K": "1k", "2K": "1k", "4K": "1k" } },
    images: null,
    extra: { output_format: "png", background_color: { rgb: [255, 255, 255] } },
  },
  {
    path: "recraft/v4.1/pro/text-to-image", label: "Recraft V4.1 Pro (2K)", status: "documented",
    roles: ["garment", "logo", "logoVector"], fixedResolution: "2K",
    aspect: { param: "aspect_ratio", values: ["1:1", "2:1", "1:2", "3:2", "2:3", "4:3", "3:4", "5:4", "4:5", "16:9", "9:16"] },
    resolution: { param: "resolution", map: { "1K": "2k", "2K": "2k", "4K": "2k" } },
    images: null,
    extra: { output_format: "png" },
  },
  {
    path: "ideogram/v4.0", label: "Ideogram 4.0", status: "documented",
    roles: ["garment", "garmentRef", "logo"], fixedResolution: "2K",
    aspect: { param: "aspect_ratio", values: ["1:1", "1:2", "2:1", "2:3", "3:2", "4:5", "5:4", "9:16", "16:9", "3:4", "4:3"] },
    resolution: null,
    images: { param: "image_url", mode: "single", max: 1 },
    extra: { rendering_speed: "DEFAULT" },
  },
  {
    path: "higgsfield-ai/soul/standard", label: "Higgsfield Soul", status: "documented",
    roles: ["garment"], fixedResolution: "1K",
    aspect: { param: "aspect_ratio", values: ["9:16", "16:9", "4:3", "3:4", "1:1", "2:3", "3:2"] },
    resolution: { param: "resolution", map: { "1K": "1080p", "2K": "1080p", "4K": "1080p" } },
    images: null,
    extra: { batch_size: 1 },
  },
  // ---- SIN VERIFICAR (nombres y parámetros supuestos) ----
  { path: "bytedance/seedream/v4/text-to-image", label: "Seedream 4", status: "guessed", roles: ["garment", "logo"], aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4", "21:9"]) }, resolution: { param: "resolution", map: { "1K": "1K", "2K": "2K", "4K": "4K" } }, images: null, extra: {} },
  { path: "bytedance/seedream/v4/edit", label: "Seedream 4 · edición", status: "guessed", roles: ["garmentRef"], requiresImages: true, aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4", "21:9"]) }, resolution: { param: "resolution", map: { "1K": "1K", "2K": "2K", "4K": "4K" } }, images: { param: "image_urls", mode: "array", max: 10 }, extra: {} },
  { path: "bytedance/seedream/v4.5/text-to-image", label: "Seedream 4.5", status: "guessed", roles: ["garment", "logo"], aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4", "21:9"]) }, resolution: { param: "resolution", map: { "1K": "1K", "2K": "2K", "4K": "4K" } }, images: null, extra: {} },
  { path: "bytedance/seedream/v4.5/edit", label: "Seedream 4.5 · edición", status: "guessed", roles: ["garmentRef"], requiresImages: true, aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4", "21:9"]) }, resolution: { param: "resolution", map: { "1K": "1K", "2K": "2K", "4K": "4K" } }, images: { param: "image_urls", mode: "array", max: 10 }, extra: {} },
  { path: "google/nano-banana/edit", label: "Nano Banana · edición", status: "guessed", roles: ["garmentRef"], requiresImages: true, aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4", "21:9"]) }, resolution: null, images: { param: "image_urls", mode: "array", max: 8 }, extra: {} },
  { path: "google/nano-banana-pro/edit", label: "Nano Banana Pro · edición", status: "guessed", roles: ["garmentRef"], requiresImages: true, aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4", "21:9"]) }, resolution: { param: "resolution", map: { "1K": "1K", "2K": "2K", "4K": "4K" } }, images: { param: "image_urls", mode: "array", max: 8 }, extra: {} },
  { path: "openai/gpt-image-2/text-to-image", label: "GPT Image 2", status: "guessed", roles: ["garment", "logo"], aspect: { param: "aspect_ratio", values: ["1:1", "2:3", "3:2"] }, resolution: null, images: null, extra: { quality: "medium" } },
  { path: "openai/gpt-image-2/edit", label: "GPT Image 2 · edición", status: "guessed", roles: ["garmentRef"], requiresImages: true, aspect: { param: "aspect_ratio", values: ["1:1", "2:3", "3:2"] }, resolution: null, images: { param: "image_urls", mode: "array", max: 10 }, extra: { quality: "medium" } },
  { path: "openai/gpt-image-1.5/edit", label: "GPT Image 1.5 · edición", status: "guessed", roles: ["garmentRef"], requiresImages: true, aspect: { param: "aspect_ratio", values: ["1:1", "2:3", "3:2"] }, resolution: null, images: { param: "image_urls", mode: "array", max: 10 }, extra: { quality: "medium" } },
  { path: "flux-pro/kontext/max/text-to-image", label: "FLUX Kontext Max", status: "guessed", roles: ["garment", "logo"], aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["21:9"]) }, resolution: null, images: null, extra: {} },
  { path: "reve/text-to-image", label: "Reve", status: "guessed", roles: ["garment", "logo"], aspect: { param: "aspect_ratio", values: ASPECTS_STD }, resolution: null, images: null, extra: {} },
  { path: "recraft/v3/text-to-image", label: "Recraft V3", status: "guessed", roles: ["logo", "logoVector"], aspect: { param: "aspect_ratio", values: ASPECTS_STD.concat(["4:5", "5:4"]) }, resolution: null, images: null, extra: {} },
  { path: "higgsfield-ai/soul/v2/standard", label: "Soul V2", status: "documented", roles: ["garment"], fixedResolution: "1K", aspect: { param: "aspect_ratio", values: ["9:16", "16:9", "4:3", "3:4", "1:1", "2:3", "3:2"] }, resolution: { param: "resolution", map: { "1K": "1080p", "2K": "1080p", "4K": "1080p" } }, images: null, extra: { batch_size: 1 } },
];

/** Orden de candidatos por rol (el primero es el activo por defecto). */
export const API_ROLE_CANDIDATES = {
  garment: ["marketing-studio/image/flare", "xai/grok-imagine-image-2.0", "recraft/v4.1/pro/text-to-image", "ideogram/v4.0", "alibaba/qwen-image-3/text-to-image", "higgsfield-ai/soul/standard", "bytedance/seedream/v4.5/text-to-image", "bytedance/seedream/v4/text-to-image", "openai/gpt-image-2/text-to-image", "flux-pro/kontext/max/text-to-image", "reve/text-to-image", "higgsfield-ai/soul/v2/standard"],
  garmentRef: ["marketing-studio/image/flare", "xai/grok-imagine-image-2.0", "alibaba/qwen-image-3/edit", "ideogram/v4.0", "bytedance/seedream/v4.5/edit", "bytedance/seedream/v4/edit", "google/nano-banana-pro/edit", "google/nano-banana/edit", "openai/gpt-image-2/edit", "openai/gpt-image-1.5/edit"],
  logo: ["recraft/v4.1/text-to-image", "ideogram/v4.0", "marketing-studio/image/flare", "xai/grok-imagine-image-2.0", "alibaba/qwen-image-3/text-to-image", "openai/gpt-image-2/text-to-image", "recraft/v3/text-to-image"],
  logoVector: ["recraft/v4.1/text-to-image", "recraft/v4.1/pro/text-to-image", "recraft/v3/text-to-image"],
};

export const API_CREDITS = { "1K": 0.5, "2K": 1, "4K": 2 };

const ratio = (a) => {
  const [w, h] = String(a).split(":").map(Number);
  return w && h ? w / h : 1;
};

/** Aspect más cercano que acepta el modelo (p. ej. 4:5 → 3:4). */
export function nearestAspect(wanted, values) {
  if (!values || !values.length || values.includes(wanted)) return wanted;
  const r = ratio(wanted);
  return values.filter((v) => v !== "auto").reduce((best, v) => (Math.abs(ratio(v) - r) < Math.abs(ratio(best) - r) ? v : best), values[0]);
}

/** Resolución efectiva ("1K"/"2K"/"4K") de un modelo de la API. */
export function apiResolution(model, wanted) {
  return model.fixedResolution || wanted || "2K";
}

export function apiCredits(model, wanted) {
  if (model.credits != null) return Number(model.credits);
  return API_CREDITS[apiResolution(model, wanted)] ?? 1;
}

/** Construye el cuerpo JSON para la API pública. images = URLs públicas. */
export function buildApiBody(model, { prompt, aspect, resolution, images = [] }) {
  const body = { ...(model.extra || {}) };
  body[model.promptParam || "prompt"] = prompt;
  if (model.aspect?.param && aspect) body[model.aspect.param] = nearestAspect(aspect, model.aspect.values);
  if (model.resolution?.param) {
    const r = apiResolution(model, resolution);
    body[model.resolution.param] = model.resolution.map?.[r] ?? r;
  }
  if (model.images?.param && images.length) {
    const list = images.slice(0, model.images.max || images.length);
    body[model.images.param] = model.images.mode === "single" ? list[0] : list;
  }
  return body;
}

export function apiModel(path, custom = []) {
  return custom.find((m) => m.path === path) || API_MODELS.find((m) => m.path === path) || null;
}
