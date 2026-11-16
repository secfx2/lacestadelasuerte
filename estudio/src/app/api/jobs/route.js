import { handler } from "@/lib/errors";
import { listJobs, publicJob } from "@/lib/jobs";

export const runtime = "nodejs";

export const GET = handler(async (request) => {
  const u = new URL(request.url);
  const limit = Math.min(400, Number(u.searchParams.get("limit")) || 200);
  const type = u.searchParams.get("type"); // "images" | "names"
  let jobs = await listJobs({ limit });
  if (type === "names") jobs = jobs.filter((j) => j.tool === "nombres");
  else if (type === "images") jobs = jobs.filter((j) => j.tool !== "nombres");
  return Response.json({ jobs: jobs.map(publicJob) });
});
