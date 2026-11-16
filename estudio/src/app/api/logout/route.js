import { ADMIN_COOKIE, SESSION_COOKIE, cookieSecure } from "@/lib/session";

export async function POST() {
  const res = Response.json({ ok: true });
  const sec = cookieSecure() ? "; Secure" : "";
  res.headers.append("Set-Cookie", `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${sec}`);
  res.headers.append("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${sec}`);
  return res;
}
