import { handler, readBody } from "@/lib/errors";
import { quote } from "@/lib/generation";
import { todaySummary } from "@/lib/usage";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Coste antes de generar: { perImage, total, remaining, limit } */
export const POST = handler(async (request) => {
  const body = await readBody(request);
  const n = Math.max(1, Math.min(32, Number(body.n) || 1));
  const [q, today] = await Promise.all([quote({ role: body.role, hasRefs: Boolean(body.hasRefs), n, request }), todaySummary()]);
  return Response.json({ ...q, used: today.credits, remaining: today.remaining, limit: today.limit });
});
