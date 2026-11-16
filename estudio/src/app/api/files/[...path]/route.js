import { readLocalFile, storageKind } from "@/lib/storage";

export const runtime = "nodejs";

/** Sirve los archivos del almacén local (.mockdata) cuando no hay Vercel Blob. */
export async function GET(request, { params }) {
  if (storageKind() !== "local") return new Response("No encontrado", { status: 404 });
  const { path } = await params;
  const f = await readLocalFile(path.join("/")).catch(() => null);
  if (!f) return new Response("No encontrado", { status: 404 });
  const download = new URL(request.url).searchParams.has("download");
  const headers = { "content-type": f.contentType, "cache-control": "private, max-age=3600" };
  if (download) headers["content-disposition"] = `attachment; filename="${path[path.length - 1]}"`;
  return new Response(f.bytes, { headers });
}
