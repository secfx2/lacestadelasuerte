import { handler } from "@/lib/errors";
import { providerSummary, providerFor } from "@/lib/hf";

export const runtime = "nodejs";
export const maxDuration = 60;

/** Estado de la conexión + saldo del plan (herramienta balance). */
export const GET = handler(async (request) => {
  const prov = await providerSummary();
  let balance = null;
  if (new URL(request.url).searchParams.has("balance") && (prov.active === "mcp" || prov.active === "mock")) {
    try {
      const p = await providerFor(prov.active);
      balance = await p.balance();
    } catch (e) {
      balance = { error: e.message, detail: e.detail || null };
    }
  }
  return Response.json({ ...prov, balance });
});
