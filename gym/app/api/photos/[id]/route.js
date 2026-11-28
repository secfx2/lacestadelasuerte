import { isAuthorized, syncConfig, rpc, noStore } from '../../../../lib/serverSync.js';

// Una foto de progreso. GET → bytes de la imagen; DELETE → la borra.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const MIMES = new Set(['image/jpeg', 'image/webp', 'image/png']);

export async function GET(_req, { params }) {
  if (!(await isAuthorized())) return new Response('No autorizado', { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  const { id } = await params;
  if (!ID_RE.test(id || '')) return Response.json({ error: 'id no válido' }, { status: 400 });
  try {
    const r = await rpc(cfg, 'ac_get_photo', { p_id: id });
    if (!r?.data) return new Response('No encontrada', { status: 404 });
    const mime = MIMES.has(r.mime) ? r.mime : 'image/jpeg';
    const bytes = Buffer.from(r.data, 'base64');
    return new Response(bytes, {
      headers: {
        'Content-Type': mime,
        'Content-Length': String(bytes.length),
        'Cache-Control': 'private, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    console.error('photo GET', e.status, e.detail);
    return new Response('No se pudo cargar la foto', { status: 502 });
  }
}

export async function DELETE(_req, { params }) {
  if (!(await isAuthorized())) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  const { id } = await params;
  if (!ID_RE.test(id || '')) return Response.json({ error: 'id no válido' }, { status: 400 });
  try {
    await rpc(cfg, 'ac_delete_photo', { p_id: id });
    return Response.json({ ok: true }, { headers: noStore });
  } catch (e) {
    console.error('photo DELETE', e.status, e.detail);
    return Response.json({ error: 'No se pudo borrar la foto' }, { status: 502, headers: noStore });
  }
}
