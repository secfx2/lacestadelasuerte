import { isAuthorized, syncConfig, rpc, noStore } from '../../../lib/serverSync.js';

// Fotos de progreso (privadas, en Supabase). GET → { photos: [{id, takenOn, pose, bytes}] }
// POST { id, takenOn 'YYYY-MM-DD', pose, mime, data (base64 sin prefijo) } → { ok, id }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const POSES = new Set(['frente', 'perfil', 'espalda', 'otra']);
const MIMES = new Set(['image/jpeg', 'image/webp', 'image/png']);
const MAX_B64 = 3_000_000;

export async function GET() {
  if (!(await isAuthorized())) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  try {
    const rows = (await rpc(cfg, 'ac_list_photos')) || [];
    // Normaliza nombres (la RPC puede devolver snake_case)
    const photos = (Array.isArray(rows) ? rows : []).map((p) => ({
      id: p.id,
      takenOn: String(p.takenOn ?? p.taken_on ?? '').slice(0, 10),
      pose: p.pose,
      bytes: Number(p.bytes ?? p.size ?? 0) || 0,
      createdAt: p.createdAt ?? p.created_at ?? null,
    }));
    return Response.json({ photos }, { headers: noStore });
  } catch (e) {
    console.error('photos GET', e.status, e.detail);
    return Response.json({ error: 'No se pudieron cargar las fotos' }, { status: 502, headers: noStore });
  }
}

export async function POST(req) {
  if (!(await isAuthorized())) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  const raw = await req.text();
  if (raw.length > MAX_B64 + 2000) return Response.json({ error: 'La foto es demasiado grande' }, { status: 413 });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'JSON no válido' }, { status: 400 });
  }
  const { id, takenOn, pose, mime, data } = body || {};
  if (typeof id !== 'string' || !ID_RE.test(id)) return Response.json({ error: 'id no válido' }, { status: 400 });
  if (typeof takenOn !== 'string' || !DATE_RE.test(takenOn) || Number.isNaN(Date.parse(takenOn))) {
    return Response.json({ error: 'Fecha no válida' }, { status: 400 });
  }
  if (!POSES.has(pose)) return Response.json({ error: 'Pose no válida' }, { status: 400 });
  if (!MIMES.has(mime)) return Response.json({ error: 'Formato no válido' }, { status: 400 });
  if (typeof data !== 'string' || !data.length || !/^[A-Za-z0-9+/]+=*$/.test(data)) {
    return Response.json({ error: 'Imagen no válida' }, { status: 400 });
  }
  if (data.length > MAX_B64) return Response.json({ error: 'La foto es demasiado grande' }, { status: 413 });
  try {
    const r = await rpc(cfg, 'ac_put_photo', { p_id: id, p_taken_on: takenOn, p_pose: pose, p_mime: mime, p_data: data });
    return Response.json(r || { ok: true, id }, { headers: noStore });
  } catch (e) {
    console.error('photos POST', e.status, e.detail);
    const tooMany = /too many photos/i.test(e.detail || '');
    return Response.json(
      { error: tooMany ? 'Has llegado al máximo de 500 fotos' : 'No se pudo guardar la foto' },
      { status: tooMany ? 409 : 502, headers: noStore }
    );
  }
}
