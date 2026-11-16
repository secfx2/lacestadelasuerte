import { ADMIN_COOKIE, cookieSecure, passwordMatches, signToken } from "@/lib/session";
import { isAdmin } from "@/lib/auth";

export async function GET(request) {
  return Response.json({ required: Boolean(process.env.ADMIN_PASSWORD), unlocked: await isAdmin(request) });
}

export async function POST(request) {
  if (!process.env.ADMIN_PASSWORD) return Response.json({ ok: true, unlocked: true });
  let body = {};
  try {
    body = await request.json();
  } catch {}
  if (!(await passwordMatches(String(body.password || "").slice(0, 200), process.env.ADMIN_PASSWORD))) {
    await new Promise((r) => setTimeout(r, 600));
    return Response.json({ error: "Contraseña de administrador incorrecta." }, { status: 401 });
  }
  const res = Response.json({ ok: true, unlocked: true });
  res.headers.append("Set-Cookie", `${ADMIN_COOKIE}=${await signToken("a", 7)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 86400}${cookieSecure() ? "; Secure" : ""}`);
  return res;
}
