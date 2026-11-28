// Utilidades de fecha en hora local. Formato canónico: 'YYYY-MM-DD'.

export const DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const DAY_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

const pad = (n) => String(n).padStart(2, '0');

export function toISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0); // mediodía: evita saltos por horario de verano
}

export function todayISO(now = new Date()) {
  return toISO(now);
}

export function addDays(iso, n) {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function daysBetween(aISO, bISO) {
  return Math.round((fromISO(bISO) - fromISO(aISO)) / 86400000);
}

// 0 = lunes … 6 = domingo
export function weekdayIdx(iso) {
  return (fromISO(iso).getDay() + 6) % 7;
}

export function mondayOf(iso) {
  return addDays(iso, -weekdayIdx(iso));
}

// Semana del programa (1-index) contando desde el lunes de la semana de inicio
export function programWeek(startISO, iso) {
  if (!startISO) return 1;
  const diff = daysBetween(mondayOf(startISO), iso);
  return Math.max(1, Math.floor(diff / 7) + 1);
}

export function prettyDate(iso, { weekday = true } = {}) {
  const d = fromISO(iso);
  const wd = DAY_NAMES[weekdayIdx(iso)];
  return `${weekday ? wd + ', ' : ''}${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function shortDate(iso) {
  const d = fromISO(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function minutesNow(now = new Date()) {
  return now.getHours() * 60 + now.getMinutes();
}

export function fmtClock(sec) {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

export function fmtRest(sec) {
  if (sec < 60) return `${sec} s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}:${pad(s)} min` : `${m} min`;
}
