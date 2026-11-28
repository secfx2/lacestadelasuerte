import { NextResponse } from 'next/server';
import { COOKIE, sessionToken, safeEqual } from './lib/auth.js';

const PUBLIC = ['/login', '/api/login'];

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(p + '/'))) return NextResponse.next();

  const password = process.env.APP_PASSWORD;
  if (!password) {
    // En local (npm run dev) sin contraseña configurada: acceso libre.
    if (process.env.NODE_ENV !== 'production') return NextResponse.next();
    return redirectToLogin(req, pathname + search);
  }

  const cookie = req.cookies.get(COOKIE)?.value;
  if (cookie && safeEqual(cookie, await sessionToken(password))) return NextResponse.next();

  if (pathname.startsWith('/api/')) return new NextResponse('No autorizado', { status: 401 });
  return redirectToLogin(req, pathname + search);
}

function redirectToLogin(req, next) {
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.search = next && next !== '/' ? `?next=${encodeURIComponent(next)}` : '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon-|apple-touch-icon|manifest.webmanifest|robots.txt).*)'],
};
