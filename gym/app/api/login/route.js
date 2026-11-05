import { NextResponse } from 'next/server';
import { COOKIE, MAX_AGE, sessionToken, safeEqual, safeNext } from '../../../lib/auth.js';

export async function POST(req) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'Falta configurar APP_PASSWORD en Vercel.' }, { status: 500 });
  }
  let body = {};
  try {
    body = await req.json();
  } catch {
    /* cuerpo vacío */
  }
  const given = typeof body.password === 'string' ? body.password : '';
  const ok = safeEqual(await sessionToken(given), await sessionToken(expected));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 600)); // frena fuerza bruta
    return NextResponse.json({ ok: false, error: 'Contraseña incorrecta' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, next: safeNext(body.next) });
  res.cookies.set(COOKIE, await sessionToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
  return res;
}
