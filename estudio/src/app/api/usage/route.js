import { handler } from "@/lib/errors";
import { readDay, todaySummary, history } from "@/lib/usage";
import { providerSummary } from "@/lib/hf";

export const runtime = "nodejs";

export const GET = handler(async (request) => {
  const u = new URL(request.url);
  const today = await todaySummary();
  if (u.searchParams.has("summary")) return Response.json({ today });
  const [doc, days, prov] = await Promise.all([readDay(today.day), history(7), providerSummary()]);
  let balance = null;
  if (prov.active === "mcp" || prov.active === "mock") {
    try {
      const { providerFor } = await import("@/lib/hf");
      const p = await providerFor(prov.active);
      balance = await p.balance();
      if (balance) delete balance.raw;
    } catch (e) {
      balance = { error: e.message };
    }
  }
  return Response.json({ today, entries: [...doc.entries].reverse(), days, provider: prov.active, balance });
});
