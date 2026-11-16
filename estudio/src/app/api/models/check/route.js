import { handler } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";
import { providerSummary, providerFor } from "@/lib/hf";
import { hasApiKeys } from "@/lib/env";
import { ROLES, ROLE_IDS, MCP_MODELS, API_MODELS, API_ROLE_CANDIDATES, buildApiBody, apiModel } from "@/config/models";

export const runtime = "nodejs";
export const maxDuration = 120;

const SAMPLE_PROMPT = "Flat lay product photo of a plain white cotton t-shirt on a seamless pure white background.";
const SAMPLE_IMAGE = "https://propuestas-flax.vercel.app/musketeer/products/tous-pour-un-hoodie/washed-black-1.jpg";

/**
 * "Comprobar modelos":
 *  - Cuenta conectada (MCP): coste en créditos de cada rol y de cada modelo conocido (get_cost, no gasta).
 *  - API (si hay claves): /estimate de cada candidato → disponible / no disponible + USD.
 */
export const POST = handler(async (request) => {
  await requireAdmin(request);
  const settings = await getSettings();
  const prov = await providerSummary();
  const out = { at: new Date().toISOString(), mcp: null, api: null };

  if (prov.active === "mcp" || prov.active === "mock") {
    const p = await providerFor(prov.active, settings);
    out.mcp = { provider: prov.active, roles: {}, models: {} };
    await p.session(async (client) => {
      for (const id of ROLE_IDS) {
        try {
          out.mcp.roles[id] = { ok: true, credits: await p.getCost(settings.roles[id], { role: id, aspect: ROLES[id].aspect }, client) };
        } catch (e) {
          out.mcp.roles[id] = { ok: false, error: e.message, detail: e.detail || null };
        }
      }
      for (const m of MCP_MODELS) {
        const cfg = { model: m.id, quality: m.quality ? "medium" : null, resolution: m.resolution ? "2k" : null, extra: {} };
        try {
          out.mcp.models[m.id] = { ok: true, credits: await p.getCost(cfg, { aspect: "4:5" }, client) };
        } catch (e) {
          out.mcp.models[m.id] = { ok: false, error: e.message, detail: e.detail || null };
        }
      }
    });
  }

  if (hasApiKeys()) {
    const { estimate } = await import("@/lib/hf/api");
    const models = [...API_MODELS, ...(settings.api.custom || [])];
    const results = {};
    await Promise.all(
      models.map(async (m) => {
        const role = m.roles?.[0] || "garment";
        const imgs = m.images ? [SAMPLE_IMAGE] : [];
        const body = buildApiBody(apiModel(m.path, settings.api.custom) || m, { prompt: SAMPLE_PROMPT, aspect: ROLES[role]?.aspect || "1:1", resolution: "2K", images: imgs });
        try {
          const e = await estimate(m.path, body);
          results[m.path] = { ok: e.ok, usd: e.usd, status: e.status, error: e.error, body };
        } catch (err) {
          results[m.path] = { ok: false, status: 0, error: String(err.message || err), body };
        }
      })
    );
    out.api = { results, candidates: API_ROLE_CANDIDATES };
  }

  await saveSettings((cur) => ({ ...cur, checks: { mcp: out.mcp || cur.checks?.mcp || null, api: out.api || cur.checks?.api || null } }));
  return Response.json(out);
});
