import { finishConnect } from "@/lib/hf/oauth";
import { unsealString } from "@/lib/secure";
import { publicOrigin } from "@/lib/env";
import { readCookie, cookieSecure } from "@/lib/session";
import { isAdmin } from "@/lib/auth";

export const runtime = "nodejs";

/** Vuelta de Higgsfield: comprueba state + PKCE y canjea el code. */
export async function GET(request) {
  const origin = publicOrigin(request);
  const u = new URL(request.url);
  const back = (q) => {
    const res = new Response(null, { status: 303, headers: { Location: `${origin}/ajustes?${q}` } });
    res.headers.append("Set-Cookie", `hf_pkce=; Path=/api/higgsfield; HttpOnly; SameSite=Lax; Max-Age=0${cookieSecure() ? "; Secure" : ""}`);
    return res;
  };
  if (!(await isAdmin(request))) return back("hf=error&msg=" + encodeURIComponent("Solo el propietario puede conectar Higgsfield."));
  if (u.searchParams.get("error")) {
    return back(`hf=error&msg=${encodeURIComponent("Higgsfield ha cancelado la conexión.")}&detail=${encodeURIComponent(u.searchParams.get("error_description") || u.searchParams.get("error"))}`);
  }
  const pkce = await unsealString(readCookie(request, "hf_pkce"), "hf-pkce");
  const state = u.searchParams.get("state");
  const code = u.searchParams.get("code");
  if (!pkce || pkce.exp < Date.now() || !state || pkce.state !== state || !code) {
    return back("hf=error&msg=" + encodeURIComponent("La conexión ha caducado o no coincide. Vuelve a pulsar «Conectar Higgsfield»."));
  }
  try {
    await finishConnect({ code, pkce });
    return back("hf=ok");
  } catch (e) {
    return back(`hf=error&msg=${encodeURIComponent(e.message || "Error al conectar")}&detail=${encodeURIComponent(String(e.detail || "").slice(0, 600))}`);
  }
}
