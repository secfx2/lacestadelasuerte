/* Cifrado AES-256-GCM para secretos guardados en el almacén (tokens OAuth).
   Clave derivada de SESSION_SECRET (o de STUDIO_PASSWORD si no existe). */
import "server-only";
import crypto from "node:crypto";
import { sessionSecret } from "./session";

async function key(purpose) {
  const secret = await sessionSecret();
  if (!secret) throw new Error("Falta SESSION_SECRET / STUDIO_PASSWORD para cifrar");
  return crypto.createHash("sha256").update(`estudio:${purpose}:${secret}`).digest();
}

export async function encrypt(obj, purpose = "store") {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", await key(purpose), iv);
  const data = Buffer.concat([c.update(JSON.stringify(obj), "utf8"), c.final()]);
  return { v: 1, iv: iv.toString("base64url"), tag: c.getAuthTag().toString("base64url"), data: data.toString("base64url") };
}

export async function decrypt(box, purpose = "store") {
  if (!box || box.v !== 1) return null;
  try {
    const d = crypto.createDecipheriv("aes-256-gcm", await key(purpose), Buffer.from(box.iv, "base64url"));
    d.setAuthTag(Buffer.from(box.tag, "base64url"));
    const out = Buffer.concat([d.update(Buffer.from(box.data, "base64url")), d.final()]);
    return JSON.parse(out.toString("utf8"));
  } catch {
    return null; // clave cambiada o datos corruptos
  }
}

/** Cadena compacta (para cookies). */
export async function sealString(obj, purpose) {
  const b = await encrypt(obj, purpose);
  return `${b.iv}.${b.tag}.${b.data}`;
}

export async function unsealString(str, purpose) {
  const [iv, tag, data] = String(str || "").split(".");
  if (!iv || !tag || !data) return null;
  return decrypt({ v: 1, iv, tag, data }, purpose);
}

export const randomUrlSafe = (bytes = 32) => crypto.randomBytes(bytes).toString("base64url");
export const sha256Url = (s) => crypto.createHash("sha256").update(s).digest("base64url");
export const uuid = () => crypto.randomUUID();
