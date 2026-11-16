/* Fechas en hora de Madrid (el "día" del límite diario). */

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" });

export function madridDay(date = new Date()) {
  return fmt.format(date); // YYYY-MM-DD
}

/** Últimos n días (hoy incluido), del más reciente al más antiguo. */
export function lastDays(n = 7, from = new Date()) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(madridDay(new Date(from.getTime() - i * 86400000)));
  return [...new Set(out)];
}

/** Marca de tiempo compacta y ordenable para nombres de archivo: 20261116T101500Z */
export function compactTs(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

export function randomId(len = 8) {
  const abc = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, (b) => abc[b % abc.length]).join("");
}
