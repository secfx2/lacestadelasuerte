/* ==========================================================================
   Orquestación de generaciones de imagen (independiente del proveedor):
   coste → límite diario (reserva) → trabajos → referencias → envío → sondeo
   → copia de resultados al almacén → devolución de créditos si falla.
   ========================================================================== */
import "server-only";
import { getSettings } from "./settings";
import { getProvider, providerFor } from "./hf";
import { mcpParams } from "./hf/mcp";
import { readJSON, updateJSON, putFile, fetchBytes, downloadUrl } from "./storage";
import { reserve, refund } from "./usage";
import { createJob, getJob, updateJob, newJobId, REQ_TERMINAL } from "./jobs";
import { absoluteUrl, isPublicHttpsUrl } from "./env";
import { madridDay } from "./time";
import { UserError } from "./errors";
import { ROLES, mcpModel } from "@/config/models";
import { getCasting, castingPath } from "@/config/castings";

export const MAX_ITEMS = 8;
export const MAX_IMAGES = 4;
export const MAX_REFS = 6;

export function effectiveRole(role, hasRefs) {
  if (role === "garment" && hasRefs) return "garmentRef";
  return role;
}

/** ¿Acepta referencias el modelo de este rol? */
function refsAllowed(provider, settings, role) {
  if (provider.kind === "api") {
    try {
      return Boolean(provider.modelFor(role).images);
    } catch {
      return false;
    }
  }
  return mcpModel(settings.roles[role].model).refs !== false;
}

/* ------------------------------------------------------ referencias */
const MEDIA_PATH = "cache/media.json";

async function cachedMedia(kind, key) {
  const { data } = await readJSON(MEDIA_PATH);
  const hit = data?.items?.[`${kind}|${key}`];
  if (hit && Date.now() - new Date(hit.at).getTime() < 6 * 86400e3) return hit.id;
  return null;
}

async function storeMedia(kind, key, id) {
  await updateJSON(MEDIA_PATH, (cur) => {
    const items = { ...(cur?.items || {}), [`${kind}|${key}`]: { id, at: new Date().toISOString() } };
    const keys = Object.keys(items);
    if (keys.length > 600) keys.sort((a, b) => (items[a].at < items[b].at ? -1 : 1)).slice(0, keys.length - 600).forEach((k) => delete items[k]);
    return { items };
  }).catch(() => {});
}

/** Valor de referencia para el proveedor: job_id, media_id o URL pública. */
async function refValue(provider, ref, request, client) {
  if (ref.jobId && provider.kind !== "api") return ref.jobId;
  const abs = absoluteUrl(ref.url, request);
  if (provider.kind === "api") return provider.importMedia(abs);
  const hit = await cachedMedia(provider.kind, abs);
  if (hit) return hit;
  let id;
  if (provider.kind === "mcp" && !isPublicHttpsUrl(abs)) {
    const { bytes, contentType } = await fetchBytes(ref.url);
    id = await provider.uploadBytes(bytes, contentType, client);
  } else {
    id = await provider.importMedia(abs, client);
  }
  await storeMedia(provider.kind, abs, id);
  return id;
}

/* ------------------------------------------------------------ coste */
const COST_PATH = "cache/costs.json";

export async function costPerImage(provider, settings, role, hasRefs, request, client) {
  const roleCfg = settings.roles[role];
  const key = [provider.kind, role, roleCfg.model, roleCfg.quality || "", roleCfg.resolution || "", JSON.stringify(roleCfg.extra || {}), provider.kind === "api" ? settings.api.active[role] : "", hasRefs ? 1 : 0].join("|");
  const day = madridDay();
  const { data } = await readJSON(COST_PATH);
  if (data?.day === day && data.items?.[key] != null) return data.items[key];
  let refValues = [];
  if (hasRefs && provider.kind !== "api") refValues = [await refValue(provider, { url: castingPath("dani") }, request, client)];
  const credits = Number(await provider.getCost(roleCfg, { role, aspect: ROLES[role].aspect, refValues }, client));
  await updateJSON(COST_PATH, (cur) => {
    const base = cur?.day === day ? cur : { day, items: {} };
    return { ...base, items: { ...base.items, [key]: credits } };
  }).catch(() => {});
  return credits;
}

/** Coste estimado (para mostrar antes de generar). */
export async function quote({ role, hasRefs, n = 1, request }) {
  const settings = await getSettings();
  const provider = await getProvider(settings);
  let eff = effectiveRole(role, hasRefs);
  const refs = hasRefs && refsAllowed(provider, settings, eff);
  const perImage = await provider.session((client) => costPerImage(provider, settings, eff, refs, request, client));
  return { perImage, total: Math.round(perImage * n * 1000) / 1000, role: eff, model: provider.kind === "api" ? settings.api.active[eff] : settings.roles[eff].model, provider: provider.kind, refsIgnored: hasRefs && !refs };
}

/* ------------------------------------------------------------- envío */
const TYPE_BY = { logo: "logo", logoVector: "logo" };

/**
 * items: [{ prompt, refs:[{url, jobId?}], casting?, n, meta }]
 * Devuelve los trabajos creados (doc completo).
 */
export async function submitGeneration({ request, tool, role, brand, items }) {
  if (!ROLES[role]) throw new UserError("Tipo de generación desconocido.");
  if (!Array.isArray(items) || !items.length) throw new UserError("No hay nada que generar.");
  if (items.length > MAX_ITEMS) throw new UserError(`Máximo ${MAX_ITEMS} prendas por envío.`);
  const settings = await getSettings();
  const provider = await getProvider(settings);

  const plan = items.map((it) => {
    const prompt = String(it.prompt || "").trim();
    if (prompt.length < 3) throw new UserError("Falta el prompt.");
    if (prompt.length > 4500) throw new UserError("El prompt es demasiado largo (máx. 4500 caracteres).");
    const n = Math.max(1, Math.min(MAX_IMAGES, Number(it.n) || 1));
    let refs = (Array.isArray(it.refs) ? it.refs : []).filter((r) => r && typeof r.url === "string").map((r) => ({ url: r.url, jobId: typeof r.jobId === "string" ? r.jobId : null }));
    for (const r of refs) if (!/^(https:\/\/|\/api\/files\/|\/castings\/)/.test(r.url) && !/^http:\/\/(localhost|127\.0\.0\.1)/.test(r.url)) throw new UserError("Referencia no válida.");
    const casting = it.casting ? getCasting(it.casting) : null;
    if (casting) refs.splice(Math.min(1, refs.length), 0, { url: castingPath(casting.id), jobId: null, casting: casting.id });
    if (refs.length > MAX_REFS) throw new UserError(`Máximo ${MAX_REFS} imágenes de referencia.`);
    const eff = effectiveRole(role, refs.length > 0);
    let warning = null;
    if (refs.length && !refsAllowed(provider, settings, eff)) {
      refs = [];
      warning = "Este modelo no admite referencias: se han ignorado.";
    }
    return { prompt, n, refs, casting: casting?.id || null, role: eff, meta: it.meta && typeof it.meta === "object" ? it.meta : {}, warning };
  });

  return provider.session(async (client) => {
    const costs = {};
    for (const p of plan) {
      const k = `${p.role}|${p.refs.length > 0}`;
      if (costs[k] == null) costs[k] = await costPerImage(provider, settings, p.role, p.refs.length > 0, request, client);
      p.perImage = costs[k];
    }
    // Referencias antes de reservar (si fallan, no se cobra nada).
    for (const p of plan) p.refValues = await Promise.all(p.refs.map((r) => refValue(provider, r, request, client)));

    for (const p of plan) {
      const cfg = settings.roles[p.role];
      p.cfg = cfg;
      p.aspect = ROLES[p.role].aspect;
      if (provider.kind === "api") {
        p.body = provider.body(p.role, cfg, { prompt: p.prompt, aspect: p.aspect, refValues: p.refValues });
        const usd = await provider.estimateUsd(p.role, p.body);
        p.usd = usd != null ? usd * p.n : null;
        p.model = settings.api.active[p.role];
      } else {
        p.params = mcpParams(cfg, { prompt: p.prompt, aspect: p.aspect, refValues: p.refValues });
        p.usd = null;
        p.model = cfg.model;
      }
      p.id = newJobId(TYPE_BY[p.role] || (p.meta.shot === "model" ? "model" : tool === "ideas" ? "idea" : "flat"));
      p.credits = Math.round(p.perImage * p.n * 1000) / 1000;
    }

    const ledgers = await reserve(plan.map((p) => ({ jobId: p.id, tool, brand, model: p.model, provider: provider.kind, n: p.n, credits: p.credits, usd: p.usd })));

    const now = new Date().toISOString();
    const jobs = [];
    let index = 0;
    const requests = [];
    plan.forEach((p, pi) => {
      p.requests = [];
      for (let k = 0; k < p.n; k++) {
        const req = { index: index++, k, pi };
        p.requests.push(req);
        requests.push(provider.kind === "api" ? { index: req.index, role: p.role, body: p.body } : { index: req.index, params: p.params });
      }
    });
    for (let i = 0; i < plan.length; i++) {
      const p = plan[i];
      jobs.push(
        await createJob({
          id: p.id, tool, brand, role: p.role, provider: provider.kind, model: p.model,
          quality: p.cfg.quality || null, resolution: p.cfg.resolution || null, aspect: p.aspect,
          prompt: p.prompt, refs: p.refs, casting: p.casting, n: p.n, perImage: p.perImage, credits: p.credits, usd: p.usd,
          ledger: ledgers[i], status: "submitting", requests: [], outputs: [], refundedN: 0,
          meta: p.meta, warning: p.warning, createdAt: now, updatedAt: now,
        })
      );
    }

    let results;
    try {
      results = await provider.generate(requests, client);
    } catch (e) {
      await Promise.all(plan.map((p, i) => refund(ledgers[i], { n: p.n, reason: "submit_error" })));
      await Promise.all(plan.map((p) => updateJob(p.id, (cur) => ({ ...cur, status: "failed", refundedN: p.n, error: e.message, errorDetail: e.detail || null, updatedAt: new Date().toISOString() }))));
      throw e;
    }

    const final = [];
    for (let i = 0; i < plan.length; i++) {
      const p = plan[i];
      const reqs = p.requests.map((r) => {
        const res = results.find((x) => x.index === r.index) || { status: "failed", error: "Sin respuesta" };
        return { index: r.index, k: r.k, jobId: res.jobId || null, status: res.jobId ? res.status : "failed", error: res.error || null };
      });
      const failed = reqs.filter((r) => r.status === "failed").length;
      if (failed) await refund(ledgers[i], { credits: p.perImage * failed, n: failed, reason: "submit_rejected" });
      const job = await updateJob(p.id, (cur) => ({
        ...cur,
        requests: reqs,
        refundedN: failed,
        status: failed === p.n ? "failed" : "queued",
        error: failed ? reqs.find((r) => r.error)?.error || "Envío rechazado" : null,
        updatedAt: new Date().toISOString(),
      }));
      final.push(job);
    }
    return final;
  });
}

/* ------------------------------------------------------------ sondeo */
const extFor = (ct, url) => (/png/.test(ct) ? "png" : /webp/.test(ct) ? "webp" : /svg/.test(ct) ? "svg" : /gif/.test(ct) ? "gif" : /\.png(\?|$)/.test(url) ? "png" : "jpg");
const locks = new Map();
const STALE_MS = 3 * 3600e3;

function overall(job) {
  const reqs = job.requests || [];
  if (!reqs.length) return job.status;
  if (reqs.some((r) => !REQ_TERMINAL.has(r.status))) return reqs.every((r) => r.status === "queued" || REQ_TERMINAL.has(r.status)) && !reqs.some((r) => r.status === "completed") ? "queued" : "in_progress";
  const ok = (job.outputs || []).length;
  if (ok >= reqs.length) return "completed";
  if (ok > 0) return "partial";
  return reqs.some((r) => r.status === "nsfw") ? "nsfw" : "failed";
}

export async function pollJob(id) {
  if (locks.has(id)) return locks.get(id);
  const p = doPoll(id).finally(() => locks.delete(id));
  locks.set(id, p);
  return p;
}

async function doPoll(id) {
  const job = await getJob(id);
  if (!job) throw new UserError("Ese trabajo no existe.", { status: 404 });
  const pending = (job.requests || []).filter((r) => r.jobId && !REQ_TERMINAL.has(r.status));
  if (!pending.length) return job;

  const stale = Date.now() - new Date(job.createdAt).getTime() > STALE_MS;
  let results;
  const settings = await getSettings();
  const provider = await providerFor(job.provider, settings);
  try {
    results = await provider.session((client) => provider.wait(pending.slice(0, 12).map((r) => ({ index: r.index, jobId: r.jobId, hint: { role: job.role, brand: job.brand, shot: job.meta?.shot } })), { timeout: stale ? 0 : 10 }, client));
  } catch (e) {
    if (!stale) return { ...job, pollError: e.message };
    results = pending.map((r) => ({ index: r.index, jobId: r.jobId, status: "in_progress", resultUrl: null, error: null }));
  }
  // Si tras 3 horas Higgsfield sigue sin terminarlo, se da por perdido (y se devuelve).
  if (stale) results = results.map((r) => (REQ_TERMINAL.has(r.status) ? r : { ...r, status: "failed", error: "Sin respuesta de Higgsfield tras 3 horas" }));

  // Copia de resultados (las URLs de Higgsfield caducan a los 7 días).
  const copies = {};
  for (const r of results) {
    if (r.status !== "completed" || !r.resultUrl) continue;
    const req = job.requests.find((x) => x.index === r.index);
    if (!req || (job.outputs || []).some((o) => o.k === req.k)) continue;
    try {
      const { bytes, contentType } = await fetchBytes(r.resultUrl);
      const ext = extFor(contentType, r.resultUrl);
      const stored = await putFile(`outputs/${job.id}-${req.k + 1}.${ext}`, bytes, contentType);
      copies[r.index] = { k: req.k, url: stored.url, downloadUrl: stored.downloadUrl || downloadUrl(stored.url), sourceUrl: r.resultUrl, hfJobId: r.jobId, favourite: false, notes: "", createdAt: new Date().toISOString() };
    } catch (e) {
      r.status = "in_progress"; // se reintenta la copia en el siguiente sondeo
      r.copyError = e.message;
    }
  }

  let refundDelta = 0;
  const updated = await updateJob(id, (cur) => {
    const outputs = [...(cur.outputs || [])];
    const requests = cur.requests.map((req) => {
      const r = results.find((x) => x.index === req.index);
      if (!r || REQ_TERMINAL.has(req.status)) return req;
      const c = copies[req.index];
      if (c && !outputs.some((o) => o.k === c.k)) outputs.push(c);
      return { ...req, status: r.status, error: r.error || r.copyError || null };
    });
    outputs.sort((a, b) => a.k - b.k);
    const failedNow = requests.filter((r) => ["failed", "nsfw", "canceled"].includes(r.status)).length;
    refundDelta = Math.max(0, failedNow - (cur.refundedN || 0));
    const next = { ...cur, requests, outputs, refundedN: Math.max(cur.refundedN || 0, failedNow), updatedAt: new Date().toISOString() };
    next.status = overall(next);
    if (["failed", "nsfw"].includes(next.status)) next.error = requests.find((r) => r.error)?.error || (next.status === "nsfw" ? "Rechazado por moderación" : "La generación ha fallado");
    return next;
  });
  if (refundDelta > 0) await refund(job.ledger, { credits: job.perImage * refundDelta, n: refundDelta, reason: "job_failed" });
  return updated;
}
