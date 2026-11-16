/* Sesión firmada con HMAC (Web Crypto: funciona en middleware edge y en Node). */

export const SESSION_COOKIE = "estudio_session";
export const ADMIN_COOKIE = "estudio_admin";
export const SESSION_DAYS = 30;

const enc = new TextEncoder();

const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

export async function sha256Hex(text) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

/** SESSION_SECRET, o uno derivado de STUDIO_PASSWORD si no existe. */
export async function sessionSecret() {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.STUDIO_PASSWORD) return "derived:" + (await sha256Hex("estudio-session:" + process.env.STUDIO_PASSWORD));
  return null;
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Token "v1.<kind>.<exp>.<sig>". kind: "s" (sesión) o "a" (admin). */
export async function signToken(kind, days = SESSION_DAYS) {
  const secret = await sessionSecret();
  if (!secret) throw new Error("Falta STUDIO_PASSWORD");
  const exp = Math.floor(Date.now() / 1000) + days * 86400;
  const payload = `v1.${kind}.${exp}`;
  return `${payload}.${await hmac(secret, "estudio:" + payload)}`;
}

export async function verifyToken(token, kind) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1" || parts[1] !== kind) return false;
  const exp = Number(parts[2]);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;
  const secret = await sessionSecret();
  if (!secret) return false;
  const expected = await hmac(secret, "estudio:" + parts.slice(0, 3).join("."));
  return safeEqual(expected, parts[3]);
}

/** Compara contraseñas en tiempo constante (vía hash). */
export async function passwordMatches(input, expected) {
  if (!expected) return false;
  const [a, b] = await Promise.all([sha256Hex("pw:" + String(input || "")), sha256Hex("pw:" + expected)]);
  return safeEqual(a, b);
}

export function readCookie(request, name) {
  const raw = request.headers.get("cookie") || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

export const cookieSecure = () => process.env.NODE_ENV === "production" && !/^http:\/\//.test(process.env.PUBLIC_BASE_URL || "");
