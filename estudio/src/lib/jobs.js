/* Trabajos de generación: jobs/<ts>_<tipo>_<id>.json (el id ES el nombre). */
import "server-only";
import { readJSON, updateJSON, writeJSON, list, deletePath } from "./storage";
import { compactTs, randomId } from "./time";

const jobPath = (id) => {
  if (!/^[0-9TZ]+_[a-z]+_[a-z0-9]+$/.test(id)) throw new Error("Id de trabajo no válido");
  return `jobs/${id}.json`;
};

export const newJobId = (type) => `${compactTs()}_${type}_${randomId(8)}`;

export const TERMINAL = new Set(["completed", "failed", "nsfw", "canceled", "partial"]);
export const REQ_TERMINAL = new Set(["completed", "failed", "nsfw", "canceled"]);

export async function createJob(job) {
  await writeJSON(jobPath(job.id), job);
  return job;
}

export async function getJob(id) {
  const { data } = await readJSON(jobPath(id));
  return data;
}

export async function updateJob(id, fn) {
  return updateJSON(jobPath(id), (cur) => (cur ? fn(cur) : undefined));
}

export async function deleteJob(id) {
  await deletePath(jobPath(id));
}

/** Últimos trabajos (más recientes primero). */
export async function listJobs({ limit = 200 } = {}) {
  const files = (await list("jobs/")).filter((f) => f.pathname.endsWith(".json"));
  files.sort((a, b) => (a.pathname < b.pathname ? 1 : -1));
  const slice = files.slice(0, limit);
  const out = [];
  for (let i = 0; i < slice.length; i += 16) {
    const chunk = await Promise.all(slice.slice(i, i + 16).map((f) => readJSON(f.pathname).then((r) => r.data).catch(() => null)));
    out.push(...chunk.filter(Boolean));
  }
  return out;
}

/** Vista pública de un trabajo (sin cuerpos internos pesados). */
export function publicJob(job) {
  if (!job) return null;
  const { ledger, ...rest } = job;
  return rest;
}
