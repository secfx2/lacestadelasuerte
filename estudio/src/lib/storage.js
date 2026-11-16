/* ==========================================================================
   Almacenamiento: Vercel Blob (BLOB_READ_WRITE_TOKEN) o, si falta el token,
   un almacén local en .mockdata/ (para pruebas). Misma interfaz:
     putFile(pathname, bytes, contentType) → { url, pathname, downloadUrl }
     readJSON(pathname) → { data, etag }      (data null si no existe)
     writeJSON(pathname, data, { ifMatch, create })
     updateJSON(pathname, fn)                (reintenta con ETag si hay carrera)
     list(prefix) · deleteUrls(urls) · deletePath(pathname) · fetchBytes(url)
   Los JSON se leen siempre desde el origen (useCache: false) para que el
   límite diario y los ajustes no lean una versión cacheada.
   ========================================================================== */
import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { put, del, list as blobList, get as blobGet, BlobPreconditionFailedError } from "@vercel/blob";
import { randomId } from "./time";

const useBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
export const storageKind = () => (useBlob() ? "blob" : "local");

const LOCAL_ROOT = process.env.VERCEL ? "/tmp/estudio-data" : path.join(process.cwd(), ".mockdata");
const LOCAL_PREFIX = "/api/files/";

export const isLocalUrl = (url) => typeof url === "string" && url.startsWith(LOCAL_PREFIX);

const safePath = (p) => {
  const clean = String(p).replace(/^\/+/, "");
  if (!/^[\w./-]+$/.test(clean) || clean.includes("..")) throw new Error("Ruta de almacenamiento no válida: " + p);
  return clean;
};

const withSuffix = (pathname) => {
  const ext = path.extname(pathname);
  return `${pathname.slice(0, pathname.length - ext.length)}-${randomId(10)}${ext}`;
};

/* ---------------------------------------------------------------- files */
export async function putFile(pathname, bytes, contentType) {
  pathname = safePath(pathname);
  if (useBlob()) {
    const r = await put(pathname, bytes, { access: "public", addRandomSuffix: true, contentType });
    return { url: r.url, pathname: r.pathname, downloadUrl: r.downloadUrl };
  }
  const p = withSuffix(pathname);
  const file = path.join(LOCAL_ROOT, p);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, Buffer.from(bytes));
  await fs.writeFile(file + ".type", contentType || "application/octet-stream");
  return { url: LOCAL_PREFIX + p, pathname: p, downloadUrl: LOCAL_PREFIX + p + "?download=1" };
}

/** Lee un archivo local (para la ruta /api/files/...). */
export async function readLocalFile(pathname) {
  const p = safePath(pathname);
  const file = path.join(LOCAL_ROOT, p);
  try {
    const [bytes, type] = await Promise.all([fs.readFile(file), fs.readFile(file + ".type", "utf8").catch(() => "application/octet-stream")]);
    return { bytes, contentType: type };
  } catch {
    return null;
  }
}

export function downloadUrl(url) {
  if (!url) return url;
  if (isLocalUrl(url)) return url + (url.includes("?") ? "&" : "?") + "download=1";
  if (/\.blob\.vercel-storage\.com\//.test(url)) return url + (url.includes("?") ? "&" : "?") + "download=1";
  return url;
}

/** Bytes de una URL (local o remota). */
export async function fetchBytes(url, { timeoutMs = 45000 } = {}) {
  if (isLocalUrl(url)) {
    const f = await readLocalFile(url.slice(LOCAL_PREFIX.length).split("?")[0]);
    if (!f) throw new Error("Archivo local no encontrado: " + url);
    return { bytes: f.bytes, contentType: f.contentType };
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo descargar la imagen (${res.status})`);
    return { bytes: Buffer.from(await res.arrayBuffer()), contentType: res.headers.get("content-type") || "image/jpeg" };
  } finally {
    clearTimeout(t);
  }
}

export async function deleteUrls(urls) {
  const list = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);
  if (!list.length) return;
  const remote = list.filter((u) => !isLocalUrl(u) && /\.blob\.vercel-storage\.com\//.test(u));
  const local = list.filter(isLocalUrl);
  if (remote.length && useBlob()) await del(remote);
  for (const u of local) {
    const p = safePath(u.slice(LOCAL_PREFIX.length).split("?")[0]);
    await fs.rm(path.join(LOCAL_ROOT, p), { force: true });
    await fs.rm(path.join(LOCAL_ROOT, p + ".type"), { force: true });
  }
}

/* ---------------------------------------------------------------- JSON */
const localLocks = new Map();
async function withLocalLock(key, fn) {
  const prev = localLocks.get(key) || Promise.resolve();
  let release;
  const next = new Promise((r) => (release = r));
  localLocks.set(key, prev.then(() => next));
  await prev;
  try {
    return await fn();
  } finally {
    release();
    if (localLocks.get(key) === next) localLocks.delete(key);
  }
}

export async function readJSON(pathname) {
  pathname = safePath(pathname);
  if (useBlob()) {
    const r = await blobGet(pathname, { access: "public", useCache: false }).catch((e) => {
      if (e?.name === "BlobNotFoundError") return null;
      throw e;
    });
    if (!r || r.statusCode !== 200) return { data: null, etag: null };
    const text = await new Response(r.stream).text();
    try {
      return { data: JSON.parse(text), etag: r.blob.etag };
    } catch {
      return { data: null, etag: r.blob.etag };
    }
  }
  const file = path.join(LOCAL_ROOT, pathname);
  try {
    const [text, st] = await Promise.all([fs.readFile(file, "utf8"), fs.stat(file)]);
    return { data: JSON.parse(text), etag: `${st.mtimeMs}-${st.size}` };
  } catch {
    return { data: null, etag: null };
  }
}

export class ConflictError extends Error {}

export async function writeJSON(pathname, data, { ifMatch = null, create = false } = {}) {
  pathname = safePath(pathname);
  const body = JSON.stringify(data, null, 1);
  if (useBlob()) {
    try {
      await put(pathname, body, {
        access: "public",
        addRandomSuffix: false,
        allowOverwrite: !create,
        contentType: "application/json",
        cacheControlMaxAge: 60,
        ...(ifMatch ? { ifMatch } : {}),
      });
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError || (create && /already exists/i.test(String(e?.message)))) throw new ConflictError(e.message);
      throw e;
    }
    return;
  }
  const file = path.join(LOCAL_ROOT, pathname);
  await fs.mkdir(path.dirname(file), { recursive: true });
  if (ifMatch || create) {
    const cur = await readJSON(pathname);
    if (create && cur.etag) throw new ConflictError("exists");
    if (ifMatch && cur.etag !== ifMatch) throw new ConflictError("etag");
  }
  const tmp = file + "." + randomId(6) + ".tmp";
  await fs.writeFile(tmp, body);
  await fs.rename(tmp, file);
}

/**
 * Lee-modifica-escribe con control optimista (ETag). fn(data) devuelve el
 * nuevo documento (o lanza). Reintenta si otra petición escribió antes.
 */
export async function updateJSON(pathname, fn, { retries = 6 } = {}) {
  const run = async () => {
    let lastErr;
    for (let i = 0; i < retries; i++) {
      const { data, etag } = await readJSON(pathname);
      const next = await fn(data);
      if (next === undefined) return data;
      try {
        await writeJSON(pathname, next, etag ? { ifMatch: etag } : { create: true });
        return next;
      } catch (e) {
        if (!(e instanceof ConflictError)) throw e;
        lastErr = e;
        await new Promise((r) => setTimeout(r, 60 + Math.random() * 140 * (i + 1)));
      }
    }
    throw lastErr || new Error("Conflicto al guardar " + pathname);
  };
  return useBlob() ? run() : withLocalLock(pathname, run);
}

export async function deletePath(pathname) {
  pathname = safePath(pathname);
  if (useBlob()) {
    await del(pathname).catch(() => {});
    return;
  }
  await fs.rm(path.join(LOCAL_ROOT, pathname), { force: true });
}

/** Lista archivos bajo un prefijo: [{ pathname, url, uploadedAt }]. */
export async function list(prefix, { max = 2000 } = {}) {
  prefix = safePath(prefix);
  if (useBlob()) {
    const out = [];
    let cursor;
    do {
      const r = await blobList({ prefix, cursor, limit: 1000 });
      for (const b of r.blobs) out.push({ pathname: b.pathname, url: b.url, uploadedAt: b.uploadedAt });
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor && out.length < max);
    return out;
  }
  const dir = path.join(LOCAL_ROOT, prefix.endsWith("/") ? prefix : path.dirname(prefix));
  const base = prefix.endsWith("/") ? "" : path.basename(prefix);
  const out = [];
  async function walk(d, rel) {
    let entries = [];
    try {
      entries = await fs.readdir(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) await walk(path.join(d, e.name), r);
      else if (!e.name.endsWith(".type") && !e.name.endsWith(".tmp")) {
        const st = await fs.stat(path.join(d, e.name));
        out.push({ pathname: r, uploadedAt: st.mtime });
      }
    }
  }
  const rootRel = prefix.endsWith("/") ? prefix.replace(/\/$/, "") : path.dirname(prefix);
  await walk(dir, rootRel === "." ? "" : rootRel);
  return out.filter((f) => !base || f.pathname.startsWith(prefix)).map((f) => ({ ...f, url: LOCAL_PREFIX + f.pathname }));
}
