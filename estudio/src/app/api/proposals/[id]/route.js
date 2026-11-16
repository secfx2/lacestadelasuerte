import { handler, readBody, UserError } from "@/lib/errors";
import { updateProposal, deleteProposal, cleanProposal } from "@/lib/proposals";

export const runtime = "nodejs";

export const PATCH = handler(async (request, { params }) => {
  const { id } = await params;
  const b = await readBody(request);
  const doc = await updateProposal(id, (cur) => ({ ...cleanProposal(b, cur), updatedAt: new Date().toISOString() }));
  if (!doc) throw new UserError("Esa propuesta no existe.", { status: 404 });
  return Response.json({ proposal: doc });
});

export const DELETE = handler(async (request, { params }) => {
  const { id } = await params;
  await deleteProposal(id);
  return Response.json({ ok: true });
});
