import { isAuthorized, syncConfig, rpc, noStore } from '../../../lib/serverSync.js';

// Estado de la app en la nube (un único documento JSON con control de versión).
// GET → { data, version, updatedAt }   PUT { data, baseVersion } → { ok, version } | 409 { conflict, data, version }

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BYTES = 4_000_000;

export async function GET() {
  if (!(await isAuthorized())) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  try {
    const r = await rpc(cfg, 'ac_get_state');
    return Response.json(r, { headers: noStore });
  } catch (e) {
    console.error('sync GET', e.status, e.detail);
    return Response.json({ error: 'No se pudo leer de la nube' }, { status: 502, headers: noStore });
  }
}

export async function PUT(req) {
  if (!(await isAuthorized())) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return Response.json({ error: 'Datos demasiado grandes' }, { status: 413 });
  let body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'JSON no válido' }, { status: 400 });
  }
  const { data, baseVersion } = body || {};
  if (!data || typeof data !== 'object' || Array.isArray(data) || typeof data.profile !== 'object' || typeof data.days !== 'object') {
    return Response.json({ error: 'Estado no válido' }, { status: 400 });
  }
  try {
    const r = await rpc(cfg, 'ac_put_state', { p_data: data, p_base_version: Number(baseVersion) || 0 });
    if (r?.conflict) return Response.json(r, { status: 409, headers: noStore });
    return Response.json(r, { headers: noStore });
  } catch (e) {
    console.error('sync PUT', e.status, e.detail);
    return Response.json({ error: 'No se pudo guardar en la nube' }, { status: 502, headers: noStore });
  }
}
