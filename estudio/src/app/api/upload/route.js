import { handler, UserError } from "@/lib/errors";
import { putFile } from "@/lib/storage";
import { madridDay } from "@/lib/time";

export const runtime = "nodejs";

const TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX = 4.4 * 1024 * 1024;

/** Sube una imagen de referencia (cuerpo binario, ya redimensionada en el cliente). */
export const POST = handler(async (request) => {
  const type = (request.headers.get("content-type") || "").split(";")[0].trim();
  if (!TYPES[type]) throw new UserError("Formato no admitido: usa JPG, PNG o WebP.", { status: 415 });
  const len = Number(request.headers.get("content-length") || 0);
  if (len > MAX) throw new UserError("La imagen pesa demasiado (máx. 4,4 MB).", { status: 413 });
  const bytes = Buffer.from(await request.arrayBuffer());
  if (!bytes.length) throw new UserError("Imagen vacía.");
  if (bytes.length > MAX) throw new UserError("La imagen pesa demasiado (máx. 4,4 MB).", { status: 413 });
  const f = await putFile(`refs/${madridDay()}/ref.${TYPES[type]}`, bytes, type);
  return Response.json({ url: f.url });
});
