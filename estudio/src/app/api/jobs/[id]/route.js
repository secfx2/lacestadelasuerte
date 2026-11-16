import { handler, readBody, UserError } from "@/lib/errors";
import { getJob, updateJob, deleteJob, publicJob } from "@/lib/jobs";
import { pollJob } from "@/lib/generation";
import { deleteUrls } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Sondea el trabajo (y copia resultados al almacén cuando terminan). */
export const GET = handler(async (request, { params }) => {
  const { id } = await params;
  const job = await pollJob(id);
  return Response.json({ job: publicJob(job) });
});

/** Favorito / notas de una imagen (output) o de un nombre (names). */
export const PATCH = handler(async (request, { params }) => {
  const { id } = await params;
  const body = await readBody(request);
  const notes = body.notes != null ? String(body.notes).slice(0, 2000) : null;
  const job = await updateJob(id, (cur) => {
    if (body.nameIndex != null && Array.isArray(cur.names)) {
      const names = cur.names.map((n, i) => (i === Number(body.nameIndex) ? { ...n, favourite: Boolean(body.favourite) } : n));
      return { ...cur, names };
    }
    const k = Number(body.k);
    const outputs = (cur.outputs || []).map((o) => (o.k === k ? { ...o, ...(body.favourite != null ? { favourite: Boolean(body.favourite) } : {}), ...(notes != null ? { notes } : {}) } : o));
    return { ...cur, outputs, updatedAt: new Date().toISOString() };
  });
  if (!job) throw new UserError("Ese trabajo no existe.", { status: 404 });
  return Response.json({ job: publicJob(job) });
});

/** Borra una imagen (?k=) o el trabajo entero (también del almacén). */
export const DELETE = handler(async (request, { params }) => {
  const { id } = await params;
  const u = new URL(request.url);
  const job = await getJob(id);
  if (!job) return Response.json({ ok: true });
  if (u.searchParams.has("k")) {
    const k = Number(u.searchParams.get("k"));
    const out = (job.outputs || []).find((o) => o.k === k);
    if (out) await deleteUrls([out.url]).catch(() => {});
    const left = (job.outputs || []).filter((o) => o.k !== k);
    if (!left.length && (job.requests || []).every((r) => r.status !== "queued" && r.status !== "in_progress")) {
      await deleteJob(id);
      return Response.json({ ok: true, deleted: "job" });
    }
    const updated = await updateJob(id, (cur) => ({ ...cur, outputs: (cur.outputs || []).filter((o) => o.k !== k), deletedK: [...(cur.deletedK || []), k] }));
    return Response.json({ ok: true, job: publicJob(updated) });
  }
  await deleteUrls((job.outputs || []).map((o) => o.url)).catch(() => {});
  await deleteJob(id);
  return Response.json({ ok: true, deleted: "job" });
});
