/* Lectura de variables de entorno (solo servidor). */

const truthy = (v) => ["1", "true", "yes", "on"].includes(String(v || "").trim().toLowerCase());

export const isMock = () => truthy(process.env.MOCK_MODE);

export function dailyLimits() {
  const credits = Number(process.env.DAILY_CREDIT_LIMIT);
  const usd = Number(process.env.DAILY_USD_LIMIT);
  return {
    credits: Number.isFinite(credits) && credits > 0 ? credits : 500,
    usd: Number.isFinite(usd) && usd > 0 ? usd : null,
  };
}

export const hasApiKeys = () => Boolean(process.env.HF_API_KEY && process.env.HF_API_SECRET);
export const hasAnthropic = () => Boolean(process.env.ANTHROPIC_API_KEY);
export const hasBlob = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
export const adminPasswordSet = () => Boolean(process.env.ADMIN_PASSWORD);

/** Origen público (para URLs absolutas: castings, redirect_uri de OAuth). */
export function publicOrigin(request) {
  const fixed = (process.env.PUBLIC_BASE_URL || "").trim().replace(/\/+$/, "");
  if (fixed) return fixed;
  const h = request?.headers;
  const host = h?.get("x-forwarded-host") || h?.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") || (/^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(host) ? "http" : "https");
    return `${proto}://${host}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3600";
}

export function absoluteUrl(url, request) {
  if (!url) return url;
  if (/^https?:\/\//i.test(url)) return url;
  return publicOrigin(request) + (url.startsWith("/") ? url : `/${url}`);
}

/** URL alcanzable desde internet (no localhost / red privada). */
export function isPublicHttpsUrl(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return !/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|0\.0\.0\.0|\[::1\])/.test(u.hostname);
  } catch {
    return false;
  }
}
