import { handler, readBody, UserError } from "@/lib/errors";
import { getSettings, saveSettings } from "@/lib/settings";
import { requireAdmin, isAdmin } from "@/lib/auth";
import { providerSummary } from "@/lib/hf";
import { storageKind } from "@/lib/storage";
import { dailyLimits, hasAnthropic, isMock, adminPasswordSet } from "@/lib/env";
import { ROLES, ROLE_IDS, MCP_MODELS, API_MODELS, API_ROLE_CANDIDATES } from "@/config/models";

export const runtime = "nodejs";

export const GET = handler(async (request) => {
  const [settings, prov, admin] = await Promise.all([getSettings(), providerSummary(), isAdmin(request)]);
  return Response.json({
    settings,
    provider: prov,
    env: {
      mock: isMock(),
      storage: storageKind(),
      anthropic: hasAnthropic(),
      limits: dailyLimits(),
      publicBase: process.env.PUBLIC_BASE_URL || null,
      adminRequired: adminPasswordSet(),
      admin,
    },
    registry: {
      roles: ROLES,
      mcpModels: MCP_MODELS,
      apiModels: API_MODELS.map(({ path, label, status, roles, requiresImages }) => ({ path, label, status, roles, requiresImages: Boolean(requiresImages) })),
      apiCandidates: API_ROLE_CANDIDATES,
    },
  });
});

const clean = (s, max = 80) => String(s ?? "").trim().slice(0, max);

export const PUT = handler(async (request) => {
  await requireAdmin(request);
  const body = await readBody(request);
  const next = await saveSettings((cur) => {
    const roles = { ...cur.roles };
    for (const id of ROLE_IDS) {
      const r = body.roles?.[id];
      if (!r) continue;
      let extra = r.extra ?? roles[id].extra;
      if (typeof extra === "string") {
        try {
          extra = extra.trim() ? JSON.parse(extra) : {};
        } catch {
          throw new UserError(`Los parámetros extra de «${ROLES[id].label}» no son JSON válido.`);
        }
      }
      if (extra && (typeof extra !== "object" || Array.isArray(extra))) throw new UserError("Los parámetros extra deben ser un objeto JSON.");
      roles[id] = { model: clean(r.model) || roles[id].model, quality: r.quality === "" ? null : clean(r.quality, 20) || roles[id].quality || null, resolution: r.resolution === "" ? null : clean(r.resolution, 10) || roles[id].resolution || null, extra: extra || {} };
    }
    const api = { ...cur.api, active: { ...cur.api.active } };
    for (const id of ROLE_IDS) if (body.api?.active?.[id]) api.active[id] = clean(body.api.active[id], 120);
    if (Array.isArray(body.api?.custom)) {
      api.custom = body.api.custom.slice(0, 20).map((m) => {
        let extra = m.extra || {};
        if (typeof extra === "string") {
          try {
            extra = extra.trim() ? JSON.parse(extra) : {};
          } catch {
            throw new UserError(`Los parámetros JSON del modelo «${m.path}» no son válidos.`);
          }
        }
        const path = clean(m.path, 120).replace(/^\/+/, "");
        if (!/^[\w.\-/]+$/.test(path)) throw new UserError("Ruta de modelo no válida: " + m.path);
        return {
          path, label: clean(m.label) || path, status: "custom", roles: (m.roles || []).filter((r) => ROLE_IDS.includes(r)),
          aspect: m.aspectParam ? { param: clean(m.aspectParam, 40), values: null } : null,
          resolution: m.resolutionParam ? { param: clean(m.resolutionParam, 40), map: { "1K": clean(m.res1k || "1K", 10), "2K": clean(m.res2k || "2K", 10), "4K": clean(m.res4k || "4K", 10) } } : null,
          images: m.imageParam ? { param: clean(m.imageParam, 40), mode: m.imageMode === "single" ? "single" : "array", max: Math.max(1, Math.min(16, Number(m.imageMax) || 4)) } : null,
          extra, credits: m.credits != null && m.credits !== "" ? Math.max(0, Number(m.credits) || 0) : null,
          aspectParam: m.aspectParam || "", resolutionParam: m.resolutionParam || "", imageParam: m.imageParam || "", imageMode: m.imageMode || "array",
        };
      });
    }
    return { ...cur, roles, api };
  });
  return Response.json({ settings: next });
});
