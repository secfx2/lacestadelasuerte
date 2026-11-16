import { handler, readBody, UserError } from "@/lib/errors";
import { submitGeneration } from "@/lib/generation";
import { publicJob } from "@/lib/jobs";
import { BRANDS } from "@/config/brands";

export const runtime = "nodejs";
export const maxDuration = 120;

const TOOLS = new Set(["logos", "ideas", "prenda"]);

export const POST = handler(async (request) => {
  const body = await readBody(request);
  if (!TOOLS.has(body.tool)) throw new UserError("Herramienta desconocida.");
  const brand = BRANDS[body.brand] ? body.brand : "nueva";
  const jobs = await submitGeneration({ request, tool: body.tool, role: body.role, brand, items: body.items });
  return Response.json({ jobs: jobs.map(publicJob) });
});
