// Sesión mínima: la cookie guarda un hash de la contraseña (APP_PASSWORD en Vercel).
// Cambiar la contraseña invalida automáticamente todas las sesiones.

export const COOKIE = 'ac_session';
export const MAX_AGE = 60 * 60 * 24 * 180; // 180 días

export async function sessionToken(password) {
  const data = new TextEncoder().encode(`aesthetic-coach:v1:${password}`);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function safeNext(next) {
  return typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/';
}
