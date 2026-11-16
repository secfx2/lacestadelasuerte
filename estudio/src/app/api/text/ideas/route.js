import { handler, readBody, UserError } from "@/lib/errors";
import { textApi } from "@/lib/text";
import { recordText } from "@/lib/usage";
import { BRANDS, IDEA_CATEGORIES } from "@/config/brands";

export const runtime = "nodejs";
export const maxDuration = 120;

export const POST = handler(async (request) => {
  const b = await readBody(request);
  const theme = String(b.theme || "").trim().slice(0, 1500);
  const refs = (Array.isArray(b.refs) ? b.refs : []).slice(0, 4);
  if (theme.length < 3 && !refs.length) throw new UserError("Escribe un tema (o añade una referencia).");
  const count = [4, 6, 8].includes(Number(b.count)) ? Number(b.count) : 4;
  const valid = new Set([...IDEA_CATEGORIES.map((c) => c.slug), ...Object.values(BRANDS).flatMap((x) => x.categories.map((c) => c.slug))]);
  const categories = (Array.isArray(b.categories) ? b.categories : []).filter((c) => valid.has(c));
  const brand = BRANDS[b.brand] ? b.brand : "nueva";
  const api = await textApi();
  const { data, usage } = await api.clothingIdeas({ theme, count, categories, brand, refs }, request);
  await recordText({ tool: "ideas", brand, usage });
  return Response.json({ concepts: data.concepts.slice(0, count) });
});
