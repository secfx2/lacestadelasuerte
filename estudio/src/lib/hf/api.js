/* ==========================================================================
   Proveedor alternativo: API pública de Higgsfield (pago por uso, USD).
   Solo se usa si hay HF_API_KEY + HF_API_SECRET y el MCP no está conectado.
   Base https://api.higgsfield.ai · Authorization: Key <id>:<secret>
   ========================================================================== */
import "server-only";
import { UserError } from "../errors";
import { uuid } from "../secure";
import { fetchBytes } from "../storage";
import { isPublicHttpsUrl } from "../env";
import { apiModel, apiCredits, buildApiBody, ROLES } from "@/config/models";

const BASE = "https://api.higgsfield.ai";
const auth = () => `Key ${process.env.HF_API_KEY}:${process.env.HF_API_SECRET}`;

async function hfFetch(path, { method = "GET", body, idempotencyKey } = {}) {
  const headers = { Authorization: auth(), accept: "application/json" };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const res = await fetch(BASE + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store" });
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {}
  return { ok: res.ok, status: res.status, data, text, correlationId: res.headers.get("x-correlation-id") };
}

const apiErrorMessage = (status) =>
  ({
    400: "Parámetros no válidos para este modelo.",
    401: "Credenciales de la API de Higgsfield no válidas.",
    403: "Saldo insuficiente en la API de Higgsfield.",
    404: "Modelo no disponible para esta cuenta.",
    422: "La petición no pasa la validación del modelo.",
    423: "Modelo bloqueado temporalmente.",
    429: "Cola llena o límite de peticiones: espera un momento.",
    503: "Modelo no disponible ahora mismo.",
  })[status] || `Error de la API de Higgsfield (${status}).`;

export async function estimate(path, body) {
  const r = await hfFetch(`/estimate/${path}`, { method: "POST", body });
  const usd = r.data?.usd != null ? Number(r.data.usd) : null;
  return { ok: r.ok && usd != null, status: r.status, usd, error: r.ok ? null : r.text.slice(0, 1500) };
}

const uploadCache = new Map();

/** Sube bytes al almacén de Higgsfield si la URL no es pública. */
async function ensurePublic(url) {
  if (isPublicHttpsUrl(url)) return url;
  if (uploadCache.has(url)) return uploadCache.get(url);
  const { bytes, contentType } = await fetchBytes(url);
  const ct = /png/.test(contentType) ? "image/png" : /webp/.test(contentType) ? "image/webp" : "image/jpeg";
  const r = await hfFetch("/files/generate-upload-url", { method: "POST", body: { content_type: ct } });
  if (!r.ok || !r.data?.upload_url) throw new UserError("No se pudo subir la referencia a Higgsfield.", { status: 502, detail: r.text.slice(0, 1200) });
  const put = await fetch(r.data.upload_url, { method: "PUT", headers: r.data.upload_headers || { "Content-Type": ct }, body: bytes });
  if (!put.ok) throw new UserError("La subida de la referencia ha fallado.", { status: 502, detail: `PUT ${put.status}` });
  uploadCache.set(url, r.data.public_url);
  return r.data.public_url;
}

const norm = (s) => (["queued", "in_progress", "completed", "failed", "nsfw", "canceled"].includes(s) ? s : "in_progress");

export function apiProvider(settings) {
  const custom = settings?.api?.custom || [];
  const modelFor = (role) => {
    const path = settings?.api?.active?.[role];
    const m = apiModel(path, custom);
    if (!m) throw new UserError(`No hay modelo activo para «${ROLES[role]?.label || role}» en la API. Elige uno en Ajustes.`);
    return m;
  };
  return {
    kind: "api",
    label: "API de Higgsfield (pago por uso)",
    modelFor,
    async getCost(roleCfg, { role }) {
      return apiCredits(modelFor(role), (roleCfg.resolution || "2k").toUpperCase());
    },
    async importMedia(url) {
      return ensurePublic(url);
    },
    body(role, roleCfg, { prompt, aspect, refValues }) {
      return buildApiBody(modelFor(role), { prompt, aspect, resolution: (roleCfg.resolution || "2k").toUpperCase(), images: refValues });
    },
    async estimateUsd(role, body) {
      try {
        const e = await estimate(modelFor(role).path, body);
        return e.ok ? e.usd : null;
      } catch {
        return null;
      }
    },
    /** requests: [{ index, role, body }] */
    async generate(requests) {
      return Promise.all(
        requests.map(async (r) => {
          const key = uuid();
          let res = await hfFetch(`/${modelFor(r.role).path}`, { method: "POST", body: r.body, idempotencyKey: key });
          if (!res.ok && res.status >= 500) res = await hfFetch(`/${modelFor(r.role).path}`, { method: "POST", body: r.body, idempotencyKey: key });
          if (!res.ok || !res.data?.request_id) {
            return { index: r.index, jobId: null, status: "failed", error: `${apiErrorMessage(res.status)} ${res.text.slice(0, 1500)}`.trim() };
          }
          return { index: r.index, jobId: res.data.request_id, status: "queued", error: null };
        })
      );
    },
    async wait(jobs) {
      return Promise.all(
        jobs.map(async (j) => {
          const r = await hfFetch(`/requests/${encodeURIComponent(j.jobId)}/status`);
          if (!r.ok) return { index: j.index, jobId: j.jobId, status: r.status === 404 ? "failed" : "in_progress", resultUrl: null, error: r.status === 404 ? r.text.slice(0, 500) : null };
          const s = norm(r.data?.status);
          return { index: j.index, jobId: j.jobId, status: s, resultUrl: r.data?.images?.[0]?.url || null, error: r.data?.error || null };
        })
      );
    },
    async balance() {
      return null;
    },
    session: (fn) => fn(null),
  };
}
