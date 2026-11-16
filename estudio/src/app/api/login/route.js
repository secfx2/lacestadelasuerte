import { SESSION_COOKIE, SESSION_DAYS, cookieSecure, passwordMatches, signToken } from "@/lib/session";

export const runtime = "nodejs";

const fails = new Map();

export async function POST(request) {
  if (!process.env.STUDIO_PASSWORD) {
    return Response.json({ error: "Falta configurar STUDIO_PASSWORD en el servidor." }, { status: 503 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const f = fails.get(ip) || { n: 0, until: 0 };
  if (f.until > Date.now()) return Response.json({ error: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  let body = {};
  try {
    body = await request.json();
  } catch {}
  const ok = await passwordMatches(String(body.password || "").slice(0, 200), process.env.STUDIO_PASSWORD);
  if (!ok) {
    f.n += 1;
    if (f.n >= 6) {
      f.until = Date.now() + 60_000;
      f.n = 0;
    }
    fails.set(ip, f);
    await new Promise((r) => setTimeout(r, 600));
    return Response.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }
  fails.delete(ip);
  const token = await signToken("s", SESSION_DAYS);
  const res = Response.json({ ok: true });
  res.headers.append("Set-Cookie", `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${cookieSecure() ? "; Secure" : ""}`);
  return res;
}
