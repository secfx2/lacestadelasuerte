/* ==========================================================================
   Proveedor por defecto: servidor MCP de Higgsfield con la cuenta del
   propietario (créditos del plan). Un cliente MCP nuevo por petición
   (serverless), con Authorization: Bearer y reintento tras refrescar el token.
   Herramientas: generate_image (get_cost), generate_image_batch, jobs_wait,
   media_import_url, balance.
   ========================================================================== */
import "server-only";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { MCP_URL, getAccessToken } from "./oauth";
import { UserError } from "../errors";
import { mcpModel } from "@/config/models";

const CONTEXT = "Product photos and logos for a clothing brand catalog.";

function isUnauthorized(e) {
  const code = e?.code ?? e?.status;
  return code === 401 || e?.name === "UnauthorizedError" || /\b401\b|unauthori[sz]ed|invalid_token/i.test(String(e?.message || ""));
}

async function openClient(token) {
  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
    requestInit: { headers: { Authorization: `Bearer ${token}` } },
  });
  const client = new Client({ name: "estudio-de-marcas", version: "1.0.0" });
  await client.connect(transport);
  return client;
}

/** Ejecuta fn(client) con un cliente MCP autenticado; reintenta una vez tras 401. */
export async function withClient(fn) {
  let token = await getAccessToken();
  for (let attempt = 0; attempt < 2; attempt++) {
    let client = null;
    try {
      client = await openClient(token);
      return await fn(client);
    } catch (e) {
      if (attempt === 0 && isUnauthorized(e)) {
        token = await getAccessToken({ force: true });
        continue;
      }
      if (e instanceof UserError) throw e;
      throw new UserError("Error al hablar con Higgsfield (MCP).", { status: 502, detail: String(e?.message || e).slice(0, 2000) });
    } finally {
      if (client) await client.close().catch(() => {});
    }
  }
  throw new UserError("Higgsfield no acepta la sesión. Vuelve a conectarla en Ajustes.", { status: 409, code: "hf_expired" });
}

const textOf = (r) => (r?.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n");

function tryJSON(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {}
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a >= 0 && b > a) {
    try {
      return JSON.parse(text.slice(a, b + 1));
    } catch {}
  }
  return null;
}

/** Normaliza el resultado de una herramienta → objeto JSON (o lanza con el texto). */
export function parseToolResult(r, name) {
  const text = textOf(r);
  if (r?.isError) throw new UserError(`Higgsfield ha devuelto un error (${name}).`, { status: 502, detail: text.slice(0, 2000) || JSON.stringify(r).slice(0, 2000) });
  const data = r?.structuredContent && typeof r.structuredContent === "object" ? r.structuredContent : tryJSON(text);
  return data || { text };
}

export async function callTool(name, args, client) {
  const run = async (c) => parseToolResult(await c.callTool({ name, arguments: args }, undefined, { timeout: 55000 }), name);
  return client ? run(client) : withClient(run);
}

/* ------------------------------------------------------------ helpers */
const NUM_KEYS = ["credits", "cost", "total_cost", "credit_cost", "cost_credits", "price", "amount", "total"];
export function findNumber(obj, depth = 0) {
  if (obj == null || depth > 4) return null;
  if (typeof obj === "number") return obj;
  if (typeof obj === "string" && /^\d+(\.\d+)?$/.test(obj.trim())) return Number(obj);
  if (typeof obj !== "object") return null;
  for (const k of NUM_KEYS) if (k in obj) {
    const v = findNumber(obj[k], depth + 1);
    if (v != null) return v;
  }
  for (const v of Object.values(obj)) if (v && typeof v === "object") {
    const n = findNumber(v, depth + 1);
    if (n != null) return n;
  }
  return null;
}

/** Parámetros MCP de un rol: { model, quality, resolution, aspect_ratio, ...extra } */
export function mcpParams(roleCfg, { prompt, aspect, refValues = [] }) {
  const m = mcpModel(roleCfg.model);
  const p = { model: roleCfg.model, prompt };
  if (roleCfg.quality && m.quality !== null) p.quality = roleCfg.quality;
  if (roleCfg.resolution && m.resolution !== null) p.resolution = roleCfg.resolution;
  if (aspect) p.aspect_ratio = aspect;
  Object.assign(p, roleCfg.extra || {});
  if (refValues.length) p.medias = refValues.map((value) => ({ role: "image_references", value }));
  p.use_unlim = false;
  return p;
}

const normStatus = (s, url) => {
  const v = String(s || "").toLowerCase();
  if (url && (!v || v === "completed" || v === "succeeded" || v === "success" || v === "done")) return "completed";
  if (["completed", "succeeded", "success", "done"].includes(v)) return url ? "completed" : "failed";
  if (["failed", "error", "rejected"].includes(v)) return "failed";
  if (["nsfw", "moderated", "blocked"].includes(v)) return "nsfw";
  if (["canceled", "cancelled"].includes(v)) return "canceled";
  if (["queued", "pending", "waiting", "created"].includes(v)) return "queued";
  return "in_progress";
};

const resultUrlOf = (j) => j.result_url || j.url || j.result?.url || j.results?.[0]?.url || j.images?.[0]?.url || j.output?.url || null;

/* ----------------------------------------------------------- provider */
export const mcpProvider = {
  kind: "mcp",
  label: "Higgsfield (cuenta conectada)",

  async getCost(roleCfg, { aspect, refValues = [] } = {}, client) {
    const params = { ...mcpParams(roleCfg, { prompt: "Cost check for a clothing product photo.", aspect, refValues }), get_cost: true };
    const data = await callTool("generate_image", { context: CONTEXT, params }, client);
    const n = findNumber(data);
    if (n == null) throw new UserError("No se pudo leer el coste de Higgsfield.", { status: 502, detail: JSON.stringify(data).slice(0, 1500) });
    return n;
  },

  async importMedia(url, client) {
    const data = await callTool("media_import_url", { url, type: "image" }, client);
    const id = data.media_id || data.id || data.media?.id || data.media?.media_id;
    if (!id) throw new UserError("Higgsfield no ha devuelto un media_id para la referencia.", { status: 502, detail: JSON.stringify(data).slice(0, 1500) });
    return id;
  },

  /** requests: [{ index, params }] → [{ index, jobId, status, error }] */
  async generate(requests, client) {
    const out = [];
    for (let i = 0; i < requests.length; i += 12) {
      const chunk = requests.slice(i, i + 12);
      const data = await callTool("generate_image_batch", { context: CONTEXT, requests: chunk.map((r) => ({ index: r.index, params: r.params })) }, client);
      if (data.unlim_choice) {
        throw new UserError("Higgsfield pide elegir entre generaciones ilimitadas y créditos; el Estudio siempre usa créditos. Revisa la cuenta en Higgsfield.", { status: 409, detail: JSON.stringify(data.unlim_choice).slice(0, 1500) });
      }
      const jobs = Array.isArray(data.jobs) ? data.jobs : Array.isArray(data.results) ? data.results : [];
      for (const r of chunk) {
        const j = jobs.find((x) => Number(x.index) === r.index);
        if (j?.job_id || j?.id) out.push({ index: r.index, jobId: j.job_id || j.id, status: normStatus(j.status) === "failed" ? "failed" : "queued", error: j.error || null });
        else out.push({ index: r.index, jobId: null, status: "failed", error: j?.error || j?.message || "Higgsfield no ha creado el trabajo: " + JSON.stringify(j || data).slice(0, 800) });
      }
    }
    return out;
  },

  /** jobs: [{ index, jobId }] → [{ index, jobId, status, resultUrl, error }] */
  async wait(jobs, { timeout = 10 } = {}, client) {
    const data = await callTool("jobs_wait", { jobs: jobs.slice(0, 12).map((j) => ({ index: j.index, job_id: j.jobId })), timeout_seconds: timeout }, client);
    const list = Array.isArray(data.jobs) ? data.jobs : [];
    return jobs.slice(0, 12).map((j) => {
      const r = list.find((x) => x.job_id === j.jobId) || list.find((x) => Number(x.index) === j.index);
      if (!r) return { index: j.index, jobId: j.jobId, status: "in_progress", resultUrl: null, error: null };
      const url = resultUrlOf(r);
      return { index: j.index, jobId: j.jobId, status: normStatus(r.status, url), resultUrl: url, error: r.error || r.message || null };
    });
  },

  /** Sube bytes (referencia no pública, p. ej. en local) con media_upload + PUT + media_confirm. */
  async uploadBytes(bytes, contentType, client) {
    const ext = /png/.test(contentType) ? "png" : /webp/.test(contentType) ? "webp" : "jpg";
    const data = await callTool("media_upload", { filename: `referencia.${ext}`, content_type: contentType }, client);
    const item = Array.isArray(data.files) ? data.files[0] : Array.isArray(data.uploads) ? data.uploads[0] : data;
    const uploadUrl = item?.upload_url || item?.url;
    const mediaId = item?.media_id || item?.id;
    if (!uploadUrl || !mediaId) throw new UserError("Higgsfield no ha devuelto una URL de subida.", { status: 502, detail: JSON.stringify(data).slice(0, 1500) });
    const headers = item.headers || item.upload_headers || { "Content-Type": contentType };
    const put = await fetch(uploadUrl, { method: "PUT", headers, body: bytes });
    if (!put.ok) throw new UserError("La subida de la referencia a Higgsfield ha fallado.", { status: 502, detail: `PUT ${put.status}` });
    await callTool("media_confirm", { media_id: mediaId, type: "image" }, client);
    return mediaId;
  },

  async balance(client) {
    const data = await callTool("balance", {}, client);
    return { credits: findNumber(data.credits ?? data) ?? null, plan: data.subscription_plan_type || data.plan || null, raw: data };
  },

  async listTools() {
    return withClient(async (c) => {
      const r = await c.listTools();
      return (r.tools || []).map((t) => ({ name: t.name, description: (t.description || "").slice(0, 400), inputSchema: t.inputSchema }));
    });
  },

  session: withClient,
};
