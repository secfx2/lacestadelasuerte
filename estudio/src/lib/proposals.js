/* Propuestas para el catálogo: proposals/<id>.json */
import "server-only";
import { readJSON, writeJSON, updateJSON, list, deletePath } from "./storage";
import { compactTs, randomId } from "./time";

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
