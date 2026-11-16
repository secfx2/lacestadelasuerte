import { handler, UserError } from "@/lib/errors";
import { requireAdmin } from "@/lib/auth";
import { providerSummary, providerFor } from "@/lib/hf";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Depuración: tools/list del servidor MCP. */
export const GET = handler(async (request) => {
  await requireAdmin(request);
  const prov = await providerSummary();
  if (prov.active !== "mcp" && prov.active !== "mock") throw new UserError("Conecta primero la cuenta de Higgsfield.", { status: 409 });
  const p = await providerFor(prov.active);
  return Response.json({ tools: await p.listTools() });
});
