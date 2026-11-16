import { handler, readBody, UserError } from "@/lib/errors";
import { textApi } from "@/lib/text";
import { recordText } from "@/lib/usage";
import { createJob, newJobId, publicJob } from "@/lib/jobs";
import { BRANDS } from "@/config/brands";

export const runtime = "nodejs";
export const maxDuration = 120;

const STYLES = ["calle", "lujo", "gótico", "minimal", "divertido", "retro", "deportivo", "romántico", "futurista", "y2k", "artesanal", "irónico"];

export const POST = handler(async (request) => {
  const b = await readBody(request);
  const idea = String(b.idea || "").trim().slice(0, 1500);
  const refs = (Array.isArray(b.refs) ? b.refs : []).slice(0, 4);
  if (idea.length < 3 && !refs.length) throw new UserError("Cuenta un poco la idea (o añade una referencia).");
  const count = [8, 12, 20].includes(Number(b.count)) ? Number(b.count) : 8;
  const lang = ["es", "en", "mix"].includes(b.lang) ? b.lang : "es";
  const styles = (Array.isArray(b.styles) ? b.styles : []).filter((s) => STYLES.includes(s)).slice(0, 6);
  const brand = BRANDS[b.brand] ? b.brand : "nueva";
  const api = await textApi();
  const { data, usage } = await api.brandNames({ idea, count, lang, styles, brand, refs }, request);
  await recordText({ tool: "nombres", brand, usage });
  const job = await createJob({
    id: newJobId("names"), tool: "nombres", brand, status: "completed", provider: "anthropic", model: "claude-opus-5-5",
    input: { idea, count, lang, styles, refs }, names: data.names.map((n) => ({ ...n, favourite: false })),
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  });
  return Response.json({ job: publicJob(job) });
});
