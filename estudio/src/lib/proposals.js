/* Propuestas para el catálogo: proposals/<id>.json */
import "server-only";
import { readJSON, writeJSON, updateJSON, list, deletePath } from "./storage";
import { compactTs, randomId } from "./time";
import { UserError } from "./errors";
import { BRANDS } from "@/config/brands";

const p = (id) => {
  if (!/^[0-9TZ]+_[a-z0-9]+$/.test(id)) throw new Error("Id de propuesta no válido");
  return `proposals/${id}.json`;
};

export const newProposalId = () => `${compactTs()}_${randomId(8)}`;

export async function listProposals() {
  const files = (await list("proposals/")).filter((f) => f.pathname.endsWith(".json"));
  files.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
  const docs = await Promise.all(files.slice(0, 500).map((f) => readJSON(f.pathname).then((r) => r.data).catch(() => null)));
  return docs.filter(Boolean);
}

export async function getProposal(id) {
  return (await readJSON(p(id))).data;
}

export async function saveProposal(doc) {
  await writeJSON(p(doc.id), doc);
  return doc;
}

export async function updateProposal(id, fn) {
  return updateJSON(p(id), (cur) => (cur ? fn(cur) : undefined));
}

export async function deleteProposal(id) {
  await deletePath(p(id));
}

export const STATUSES = ["nueva", "aprobada", "descartada"];

export function cleanProposal(b, base = {}) {
  const s = (v, max = 300) => (v == null ? "" : String(v).trim().slice(0, max));
  const out = { ...base };
  if (b.brand != null) out.brand = BRANDS[b.brand] ? b.brand : "nueva";
  if (b.category != null) out.category = s(b.category, 40);
  if (b.name != null) out.name = s(b.name, 80);
  if (b.price != null) out.price = Math.max(0, Math.min(5000, Number(b.price) || 0));
  if (b.description != null) out.description = s(b.description, 1200);
  if (b.details != null) out.details = (Array.isArray(b.details) ? b.details : String(b.details).split("\n")).map((d) => s(d, 140)).filter(Boolean).slice(0, 10);
  if (b.sizes != null) out.sizes = (Array.isArray(b.sizes) ? b.sizes : String(b.sizes).split(/[,\s]+/)).map((d) => s(d, 20)).filter(Boolean).slice(0, 12);
  if (b.colorName != null) out.colorName = s(b.colorName, 40);
  if (b.colorHex != null) out.colorHex = /^#[0-9a-f]{6}$/i.test(b.colorHex) ? b.colorHex : "#222222";
  if (b.images != null) out.images = (Array.isArray(b.images) ? b.images : []).map((i) => ({ url: s(i.url || i, 600), jobId: i.jobId ? s(i.jobId, 80) : null })).filter((i) => i.url).slice(0, 6);
  if (b.notes != null) out.notes = s(b.notes, 2000);
  if (b.composition != null) out.composition = s(b.composition, 120);
  if (b.fit != null) out.fit = s(b.fit, 60);
  if (b.badge != null) out.badge = s(b.badge, 30);
  if (b.prompt != null) out.prompt = { garment: s(b.prompt.garment, 1500), pose: s(b.prompt.pose, 800) };
  if (b.casting != null) out.casting = /^[a-z]{2,20}$/.test(String(b.casting)) ? String(b.casting) : null;
  if (b.kind != null) out.kind = ["garment", "accessory", "jewellery"].includes(b.kind) ? b.kind : "garment";
  if (b.status != null) {
    if (!STATUSES.includes(b.status)) throw new UserError("Estado no válido.");
    out.status = b.status;
  }
  return out;
}

