/* ==========================================================================
   MOCK_MODE=1 — simula el proveedor MCP sin gastar nada. Las "imágenes" son
   fotos reales de las tiendas en el hub (https://propuestas-flax.vercel.app),
   que se copian al almacén igual que en modo real.
   Pruebas: un prompt con "FALLO" termina en failed; con "NSFW" en nsfw.
   ========================================================================== */
import "server-only";
import { BRANDS, BRAND_IDS } from "@/config/brands";
import { fallbackCredits } from "@/config/models";

const HUB = "https://propuestas-flax.vercel.app";
const LOGOS = ["wordmark", "monogram", "emblem", "seal", "graphic"];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function pick(hint = {}, n = 0) {
  const real = BRAND_IDS.filter((b) => b !== "nueva");
  const brandId = real.includes(hint.brand) ? hint.brand : real[n % real.length];
  if (hint.role === "logo" || hint.role === "logoVector") {
    const b = brandId === "musketeer" ? "musketeer" : brandId;
    const name = LOGOS[n % (b === "musketeer" ? 4 : 5)];
    return `${HUB}/${b}/brand/${name}-black.svg`;
  }
  const samples = BRANDS[brandId].samples;
  const s = samples[n % samples.length];
  return hint.shot === "model" || hint.role === "garmentRef" ? s.img[1] : s.img[0];
}

let counter = 0;

export const mockProvider = {
  kind: "mock",
  label: "Higgsfield simulado (MOCK_MODE)",
  async getCost(roleCfg) {
    await wait(120);
    return fallbackCredits(roleCfg.model, roleCfg.resolution);
  },
  async importMedia(url) {
    await wait(80);
    return "mock-media-" + Buffer.from(String(url)).toString("base64url").slice(-16);
  },
  async generate(requests) {
    await wait(400);
    const ts = Date.now();
    return requests.map((r) => {
      const prompt = String(r.params?.prompt || "");
      const flag = /FALLO/.test(prompt) ? "f" : /NSFW/.test(prompt) ? "x" : "o";
      counter = (counter + 1) % 997;
      return { index: r.index, jobId: `mock-${ts}-${counter}-${r.index}-${flag}`, status: "queued", error: null };
    });
  },
  async wait(jobs) {
    await wait(900);
    return jobs.map((j) => {
      const m = /^mock-(\d+)-(\d+)-(\d+)-([fxo])$/.exec(j.jobId || "");
      if (!m) return { index: j.index, jobId: j.jobId, status: "failed", resultUrl: null, error: "Trabajo simulado desconocido" };
      const age = Date.now() - Number(m[1]);
      if (age < 3200) return { index: j.index, jobId: j.jobId, status: age < 1200 ? "queued" : "in_progress", resultUrl: null, error: null };
      if (m[4] === "f") return { index: j.index, jobId: j.jobId, status: "failed", resultUrl: null, error: "Generation failed (simulado)" };
      if (m[4] === "x") return { index: j.index, jobId: j.jobId, status: "nsfw", resultUrl: null, error: "Rechazado por moderación (simulado)" };
      return { index: j.index, jobId: j.jobId, status: "completed", resultUrl: pick(j.hint, Number(m[2]) + Number(m[3])), error: null };
    });
  },
  async balance() {
    return { credits: 4820, plan: "creator (simulado)" };
  },
  async listTools() {
    return ["generate_image", "generate_image_batch", "jobs_wait", "media_import_url", "media_upload", "media_confirm", "balance"].map((name) => ({ name, description: "(simulado)", inputSchema: {} }));
  },
  session: (fn) => fn(null),
};
