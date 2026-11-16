import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifyToken } from "./lib/session";

const PUBLIC = [/^\/login\/?$/, /^\/api\/login\/?$/, /^\/favicon\.(ico|svg)$/, /^\/icon\.svg$/];

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  if (PUBLIC.some((r) => r.test(pathname))) return NextResponse.next();
  const ok = await verifyToken(req.cookies.get(SESSION_COOKIE)?.value, "s");
  if (ok) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "La sesión ha caducado: vuelve a entrar.", code: "auth" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/|castings/|favicon\\.ico|favicon\\.svg).*)"],
};
