import { requireAdmin } from "@/lib/auth";
import { beginConnect, mockConnect } from "@/lib/hf/oauth";
import { sealString } from "@/lib/secure";
import { isMock, publicOrigin } from "@/lib/env";
import { cookieSecure } from "@/lib/session";
import { UserError } from "@/lib/errors";

export const runtime = "nodejs";

/** Inicia la conexión OAuth (o la simula en MOCK_MODE) y redirige. */
export async function GET(request) {
  const origin = publicOrigin(request);
  try {
    await requireAdmin(request);
    if (isMock()) {
      await mockConnect();
      return Response.redirect(`${origin}/ajustes?hf=ok`, 303);
    }
    const { url, pkce } = await beginConnect(origin);
    const sealed = await sealString(pkce, "hf-pkce");
    const res = new Response(null, { status: 303, headers: { Location: url } });
    res.headers.append("Set-Cookie", `hf_pkce=${sealed}; Path=/api/higgsfield; HttpOnly; SameSite=Lax; Max-Age=600${cookieSecure() ? "; Secure" : ""}`);
    return res;
  } catch (e) {
    const msg = e instanceof UserError ? e.message : "No se pudo iniciar la conexión con Higgsfield.";
    const detail = e?.detail || e?.message || "";
    return Response.redirect(`${origin}/ajustes?hf=error&msg=${encodeURIComponent(msg)}&detail=${encodeURIComponent(String(detail).slice(0, 600))}`, 303);
  }
}
