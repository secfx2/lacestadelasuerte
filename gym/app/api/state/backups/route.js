import { isAuthorized, syncConfig, rpc, noStore } from '../../../../lib/serverSync.js';

// Copias de seguridad diarias guardadas en la nube. GET → lista; GET ?id=N → contenido de esa copia.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req) {
  if (!(await isAuthorized())) return Response.json({ error: 'No autorizado' }, { status: 401 });
  const cfg = syncConfig();
  if (!cfg) return Response.json({ error: 'SYNC_OFF' }, { status: 503, headers: noStore });
  const id = new URL(req.url).searchParams.get('id');
  try {
    if (id) {
      const n = Number(id);
      if (!Number.isInteger(n) || n <= 0) return Response.json({ error: 'id no válido' }, { status: 400 });
      const r = await rpc(cfg, 'ac_get_backup', { p_id: n });
      if (!r) return Response.json({ error: 'No encontrada' }, { status: 404 });
      return Response.json(r, { headers: noStore });
    }
    return Response.json({ backups: (await rpc(cfg, 'ac_list_backups')) || [] }, { headers: noStore });
  } catch (e) {
    console.error('sync backups', e.status, e.detail);
    return Response.json({ error: 'No se pudieron leer las copias' }, { status: 502, headers: noStore });
  }
}
