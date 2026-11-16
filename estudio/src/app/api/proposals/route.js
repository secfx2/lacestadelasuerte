import { handler, readBody, UserError } from "@/lib/errors";
import { listProposals, newProposalId, saveProposal, cleanProposal } from "@/lib/proposals";

export const runtime = "nodejs";

export const GET = handler(async () => Response.json({ proposals: await listProposals() }));

export const POST = handler(async (request) => {
  const b = await readBody(request);
  const p = cleanProposal(b, { status: "nueva" });
  if (!p.name) throw new UserError("Ponle un nombre a la propuesta.");
  if (!p.images?.length) throw new UserError("La propuesta necesita al menos una imagen.");
  const doc = { id: newProposalId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...p };
  await saveProposal(doc);
  return Response.json({ proposal: doc });
});
