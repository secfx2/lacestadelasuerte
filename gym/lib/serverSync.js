// Utilidades de servidor para el almacén en la nube (Supabase RPC ac_*). Solo se usa en rutas API.
import { cookies } from 'next/headers';
import { COOKIE, sessionToken, safeEqual, syncToken } from './auth.js';

// Comprobación de sesión dentro del propio handler (además del middleware)
export async function isAuthorized() {
  const pw = process.env.APP_PASSWORD;
  if (!pw) return process.env.NODE_ENV !== 'production';
  const c = (await cookies()).get(COOKIE)?.value;
  return !!c && safeEqual(c, await sessionToken(pw));
}

export function syncConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  const pw = process.env.APP_PASSWORD;
  return url && key && pw ? { url: url.replace(/\/$/, ''), key, pw } : null;
}

export async function rpc(cfg, fn, args = {}) {
  const res = await fetch(`${cfg.url}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: cfg.key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ p_token: await syncToken(cfg.pw), ...args }),
    cache: 'no-store',
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(`Supabase ${res.status}`);
    err.status = res.status;
    err.detail = text.slice(0, 300);
    throw err;
  }
  return text ? JSON.parse(text) : null;
}

export const noStore = { 'Cache-Control': 'no-store' };
