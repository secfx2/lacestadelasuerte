import { handler } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth";
import { disconnect } from "@/lib/hf/oauth";

export const runtime = "nodejs";

export const POST = handler(async (request) => {
  await requireAdmin(request);
  await disconnect();
  return Response.json({ ok: true });
});
