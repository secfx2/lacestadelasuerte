import { handler, readBody, UserError } from "@/lib/errors";
import { textApi } from "@/lib/text";
import { recordText } from "@/lib/usage";
import { BRANDS } from "@/config/brands";

export const runtime = "nodejs";
export const maxDuration = 120;

export const POST = handler(async (request) => {
  const b = await readBody(request);
  const text = String(b.text || "").trim().slice(0, 2000);
  const refs = (Array.isArray(b.refs) ? b.refs : []).slice(0, 4);
  if (text.length < 3 && !refs.length) throw new UserError("Describe la prenda (o añade una referencia).");
  const brand = BRANDS[b.brand] ? b.brand : "nueva";
  const api = await textApi();
  const { data, usage } = await api.improvePrompt({ text, kind: b.kind, shot: b.shot, brand, refs, category: b.category }, request);
  await recordText({ tool: "prenda", brand, usage });
  return Response.json({ result: data });
});
