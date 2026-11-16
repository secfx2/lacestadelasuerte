/* ==========================================================================
   Conexión OAuth con el servidor MCP de Higgsfield (cuenta del propietario).
   - Registro dinámico de cliente (RFC 7591) → client_id
   - Authorization code + PKCE (S256), scopes "openid email offline_access"
   - Tokens guardados CIFRADOS (AES-GCM) en secure/hf-oauth.json
   - Refresco automático antes de caducar o tras un 401
   ========================================================================== */
import "server-only";
import { readJSON, updateJSON, deletePath } from "../storage";
import { encrypt, decrypt, randomUrlSafe, sha256Url } from "../secure";
import { UserError } from "../errors";
import { isMock } from "../env";

export const MCP_URL = process.env.HF_MCP_URL || "https://mcp.higgsfield.ai/mcp";
const ISSUER = (process.env.HF_MCP_AUTH_ISSUER || "https://mcp.higgsfield.ai").replace(/\/+$/, "");
const SCOPE = "openid email offline_access";
const PATH = "secure/hf-oauth.json";
const PURPOSE = "hf-oauth";

/* ---------------------------------------------------------- registro */
async function loadRecord() {
  const { data, etag } = await readJSON(PATH);
  if (!data) return { rec: {}, etag: null };
  const rec = await decrypt(data, PURPOSE);
  return { rec: rec || {}, etag, undecryptable: !rec };
}

async function saveRecord(mutator) {
  return updateJSON(PATH, async (box) => {
    const cur = box ? (await decrypt(box, PURPOSE)) || {} : {};
    const next = await mutator(cur);
    return encrypt(next, PURPOSE);
  });
}

async function discover() {
  const urls = [`${ISSUER}/.well-known/oauth-authorization-server`, `${ISSUER}/.well-known/openid-configuration`];
  let last;
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "no-store", headers: { accept: "application/json" } });
      if (r.ok) {
        const m = await r.json();
        if (m.authorization_endpoint && m.token_endpoint) return m;
      }
      last = `${u} → ${r.status}`;
    } catch (e) {
      last = `${u} → ${e.message}`;
    }
  }
  throw new UserError("No se pudo leer la configuración OAuth de Higgsfield.", { status: 502, detail: last });
}

async function registerClient(meta, redirectUri) {
  if (!meta.registration_endpoint) throw new UserError("Higgsfield no ofrece registro dinámico de clientes.", { status: 502 });
  const r = await fetch(meta.registration_endpoint, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_name: "Estudio de marcas",
      redirect_uris: [redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: SCOPE,
    }),
  });
  const text = await r.text();
  if (!r.ok) throw new UserError(`El registro del cliente OAuth ha fallado (${r.status}).`, { status: 502, detail: text.slice(0, 1500) });
  const j = JSON.parse(text);
  return { client_id: j.client_id, client_secret: j.client_secret || null, redirect_uri: redirectUri, registered_at: new Date().toISOString() };
}

/** Paso 1: devuelve la URL de autorización y el estado PKCE para la cookie. */
export async function beginConnect(origin) {
  const redirectUri = `${origin}/api/higgsfield/callback`;
  const meta = await discover();
  const { rec } = await loadRecord();
  let client = rec.client;
  if (!client || client.redirect_uri !== redirectUri || client.issuer !== (meta.issuer || ISSUER)) {
    client = { ...(await registerClient(meta, redirectUri)), issuer: meta.issuer || ISSUER };
    await saveRecord((cur) => ({ ...cur, client, meta: pickMeta(meta) }));
  } else {
    await saveRecord((cur) => ({ ...cur, meta: pickMeta(meta) }));
  }
  const verifier = randomUrlSafe(48);
  const state = randomUrlSafe(24);
  const u = new URL(meta.authorization_endpoint);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("client_id", client.client_id);
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("scope", SCOPE);
  u.searchParams.set("state", state);
  u.searchParams.set("code_challenge", sha256Url(verifier));
  u.searchParams.set("code_challenge_method", "S256");
  u.searchParams.set("resource", MCP_URL);
  u.searchParams.set("prompt", "consent");
  return { url: u.toString(), pkce: { state, verifier, redirectUri, exp: Date.now() + 10 * 60 * 1000 } };
}

const pickMeta = (m) => ({
  issuer: m.issuer || ISSUER,
  token_endpoint: m.token_endpoint,
  userinfo_endpoint: m.userinfo_endpoint || null,
  revocation_endpoint: m.revocation_endpoint || null,
});

function decodeJwt(token) {
  try {
    const part = String(token).split(".")[1];
    return JSON.parse(Buffer.from(part, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

async function tokenRequest(meta, client, params) {
  const body = new URLSearchParams({ ...params, client_id: client.client_id, resource: MCP_URL });
  const headers = { "content-type": "application/x-www-form-urlencoded", accept: "application/json" };
  if (client.client_secret) body.set("client_secret", client.client_secret);
  const r = await fetch(meta.token_endpoint, { method: "POST", headers, body });
  const text = await r.text();
  let j = null;
  try {
    j = JSON.parse(text);
  } catch {}
  if (!r.ok || !j?.access_token) {
    const err = new UserError(`Higgsfield ha rechazado la autorización (${r.status}).`, { status: 502, detail: text.slice(0, 1500) });
    err.oauthError = j?.error || null;
    throw err;
  }
  return j;
}

function tokensFrom(j, prev = {}) {
  const now = Date.now();
  return {
    access_token: j.access_token,
    refresh_token: j.refresh_token || prev.refresh_token || null,
    id_token: j.id_token || prev.id_token || null,
    token_type: j.token_type || "Bearer",
    scope: j.scope || prev.scope || SCOPE,
    expires_at: j.expires_in ? now + Number(j.expires_in) * 1000 : now + 55 * 60 * 1000,
    obtained_at: now,
  };
}

async function fetchAccount(meta, tokens) {
  const claims = decodeJwt(tokens.id_token) || {};
  let email = claims.email || null;
  let name = claims.name || claims.preferred_username || null;
  if (!email && meta.userinfo_endpoint) {
    try {
      const r = await fetch(meta.userinfo_endpoint, { headers: { authorization: `Bearer ${tokens.access_token}` } });
      if (r.ok) {
        const u = await r.json();
        email = u.email || email;
        name = u.name || name;
      }
    } catch {}
  }
  return { email, name, sub: claims.sub || null };
}

/** Paso 2 (callback): canjea el code por tokens y los guarda cifrados. */
export async function finishConnect({ code, pkce }) {
  const { rec } = await loadRecord();
  if (!rec.client || !rec.meta) throw new UserError("Falta el registro OAuth: vuelve a pulsar «Conectar Higgsfield».");
  const j = await tokenRequest(rec.meta, rec.client, {
    grant_type: "authorization_code",
    code,
    redirect_uri: pkce.redirectUri,
    code_verifier: pkce.verifier,
  });
  const tokens = tokensFrom(j);
  const account = await fetchAccount(rec.meta, tokens);
  await saveRecord((cur) => ({ ...cur, tokens, account, connected_at: new Date().toISOString() }));
  return account;
}

let refreshing = null;

async function refresh(force = false) {
  const { rec } = await loadRecord();
  if (!rec.tokens) throw new UserError("Higgsfield no está conectado. El propietario debe conectarlo en Ajustes.", { status: 409, code: "hf_not_connected" });
  if (!force && rec.tokens.expires_at - Date.now() > 90 * 1000) return rec.tokens.access_token;
  if (!rec.tokens.refresh_token || !rec.meta?.token_endpoint || !rec.client?.client_id) {
    if (force) await saveRecord((cur) => ({ ...cur, tokens: null, expired_at: new Date().toISOString() }));
    throw new UserError("La sesión de Higgsfield ha caducado. Vuelve a conectarla en Ajustes.", { status: 409, code: "hf_expired" });
  }
  const usedRefresh = rec.tokens.refresh_token;
  try {
    const j = await tokenRequest(rec.meta, rec.client, { grant_type: "refresh_token", refresh_token: usedRefresh });
    const tokens = tokensFrom(j, rec.tokens);
    await saveRecord((cur) => ({ ...cur, tokens }));
    return tokens.access_token;
  } catch (e) {
    // Otra petición puede haber refrescado (y rotado) el token mientras tanto.
    const again = await loadRecord();
    if (again.rec.tokens && again.rec.tokens.refresh_token !== usedRefresh && again.rec.tokens.expires_at > Date.now()) return again.rec.tokens.access_token;
    if (e.oauthError === "invalid_grant") {
      await saveRecord((cur) => ({ ...cur, tokens: null, expired_at: new Date().toISOString() }));
      throw new UserError("La sesión de Higgsfield ha caducado. Vuelve a conectarla en Ajustes.", { status: 409, code: "hf_expired", detail: e.detail });
    }
    throw e;
  }
}

/** Token de acceso válido (refresca si caduca en < 90 s). */
export async function getAccessToken({ force = false } = {}) {
  if (!refreshing) refreshing = refresh(force).finally(() => (refreshing = null));
  return refreshing;
}

export async function disconnect() {
  await saveRecord((cur) => ({ ...cur, tokens: null, account: null, mock: false, disconnected_at: new Date().toISOString() }));
}

export async function connectionStatus() {
  const { rec, undecryptable } = await loadRecord();
  if (undecryptable) return { connected: false, error: "No se pueden descifrar los tokens guardados (¿ha cambiado SESSION_SECRET?). Vuelve a conectar." };
  const connected = Boolean(rec.tokens?.access_token) && (Boolean(rec.tokens.refresh_token) || rec.tokens.expires_at > Date.now());
  return {
    connected,
    mock: Boolean(rec.mock),
    email: rec.account?.email || null,
    name: rec.account?.name || null,
    connectedAt: rec.connected_at || null,
    expiresAt: rec.tokens?.expires_at || null,
    hasRefresh: Boolean(rec.tokens?.refresh_token),
    registered: Boolean(rec.client?.client_id),
  };
}

export async function isConnected() {
  return (await connectionStatus()).connected;
}

/* ----------------------------------------------------- modo simulado */
export async function mockConnect() {
  if (!isMock()) throw new Error("mockConnect solo en MOCK_MODE");
  await saveRecord((cur) => ({
    ...cur,
    mock: true,
    tokens: { access_token: "mock-access", refresh_token: "mock-refresh", expires_at: Date.now() + 3600e3, scope: SCOPE },
    account: { email: "propietario@ejemplo.com", name: "Cuenta simulada" },
    connected_at: new Date().toISOString(),
  }));
}

export async function resetOAuth() {
  await deletePath(PATH);
}

