"use client";
/* Utilidades del navegador: llamadas a la API, almacenamiento local,
   redimensionado de imágenes y "bandejas" compartidas entre herramientas. */

export class ApiError extends Error {
  constructor(message, { status, detail, code } = {}) {
    super(message);
    this.status = status;
    this.detail = detail;
    this.code = code;
  }
}

export async function api(path, { method = "GET", body, headers } = {}) {
  const init = { method, headers: { ...(headers || {}) }, cache: "no-store" };
  if (body !== undefined) {
    if (body instanceof Blob) init.body = body;
    else {
      init.headers["content-type"] = "application/json";
      init.body = JSON.stringify(body);
    }
  }
  let res;
  try {
    res = await fetch(path, init);
  } catch {
    throw new ApiError("Sin conexión con el estudio. Revisa internet y vuelve a probar.", { status: 0 });
  }
  let data = null;
  try {
    data = await res.json();
  } catch {}
  if (res.status === 401 && data?.code === "auth") {
    window.location.href = "/login?next=" + encodeURIComponent(window.location.pathname);
  }
  if (!res.ok) throw new ApiError(data?.error || `Error ${res.status}`, { status: res.status, detail: data?.detail, code: data?.code });
  return data;
}

export const store = {
  get(key, fallback = null) {
    try {
      const v = localStorage.getItem("estudio." + key);
      return v == null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("estudio." + key, JSON.stringify(value));
    } catch {}
  },
  remove(key) {
    try {
      localStorage.removeItem("estudio." + key);
    } catch {}
  },
};

export const emitUsage = () => window.dispatchEvent(new Event("estudio:usage"));

/** Referencias pendientes ("usar como referencia" desde otra pantalla). */
export const pendingRefs = {
  push(ref) {
    const cur = store.get("pendingRefs", []);
    if (!cur.some((r) => r.url === ref.url)) store.set("pendingRefs", [...cur, ref].slice(-6));
  },
  take() {
    const cur = store.get("pendingRefs", []);
    store.remove("pendingRefs");
    return cur;
  },
};

/** Borrador de la vista previa en la web. */
export const previewDraft = {
  set(d) {
    store.set("preview", { ...d, at: Date.now() });
  },
  get() {
    return store.get("preview", null);
  },
};

export const fmt = (n, d = 1) => {
  const v = Number(n) || 0;
  return v.toLocaleString("es-ES", { maximumFractionDigits: d, minimumFractionDigits: 0 });
};
export const fmtUsd = (n) => (n == null ? "—" : `${Number(n).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 3 })} $`);
export const eur = (n) => `${Number(n || 0).toLocaleString("es-ES", { maximumFractionDigits: 2 })} €`;
export const plural = (n, one, many) => `${fmt(n)} ${Number(n) === 1 ? one : many}`;

/** Redimensiona en el navegador (máx. 2048 px, JPEG ≈0,9) para no pasar de 4,5 MB. */
export async function resizeImage(file, { max = 2048, quality = 0.9 } = {}) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("No se puede leer la imagen (¿formato HEIC? prueba con JPG o PNG)."));
      i.src = url;
    });
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    let q = quality;
    let blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", q));
    while (blob && blob.size > 4.2 * 1024 * 1024 && q > 0.5) {
      q -= 0.1;
      blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", q));
    }
    if (!blob) throw new Error("No se pudo preparar la imagen.");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function uploadRef(file) {
  const blob = await resizeImage(file);
  const { url } = await api("/api/upload", { method: "POST", body: blob, headers: { "content-type": "image/jpeg" } });
  return { url, source: "upload" };
}

export const downloadHref = (o) => o?.downloadUrl || o?.url;

export const isTerminal = (s) => ["completed", "failed", "nsfw", "canceled", "partial"].includes(s);
