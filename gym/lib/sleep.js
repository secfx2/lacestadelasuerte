// Sueño y horario del día.
// Cada noche se guarda en el día en que te LEVANTAS: days[fecha] = { bed: 'HH:MM', wake: 'HH:MM', sleep: horas }.
// Si te acuestas a partir de las 12:00, la noche cuenta para el día siguiente (23:40 del martes → miércoles);
// si es de madrugada (01:30), para ese mismo día.
// Con la hora a la que te levantas se recoloca el horario de comidas, y con las horas dormidas el consejo del día.

import { SLOTS } from './recipes.js';
import { addDays, todayISO } from './dates.js';

export const SLEEP_TARGET_H = 8;
export const DEFAULT_WAKE = '08:00';
const FALL_ASLEEP_MIN = 15;

export const isTime = (v) => typeof v === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
export const fromMin = (min) => {
  const x = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
};
export const clockOf = (d = new Date()) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

// Día al que pertenece una noche si te acuestas a esta hora
export function wakeDayForBed(now = new Date(), bedTime = clockOf(now)) {
  const iso = todayISO(now);
  return toMin(bedTime) >= 12 * 60 ? addDays(iso, 1) : iso;
}

// Horas entre acostarse y levantarse (de cuarto en cuarto de hora)
export function sleepHours(bed, wake) {
  if (!isTime(bed) || !isTime(wake)) return null;
  let d = toMin(wake) - toMin(bed);
  if (d <= 0) d += 1440;
  if (d > 16 * 60) return null;
  return Math.round(d / 15) / 4;
}

export const fmtHours = (h) => (h == null ? '—' : String(Math.round(h * 4) / 4).replace('.', ','));

// Noche "abierta": te has acostado y aún no te has levantado
export function pendingNight(state, now = new Date()) {
  const today = todayISO(now);
  const cands = now.getHours() >= 12 ? [addDays(today, 1), today] : [today];
  for (const iso of cands) {
    const d = state.days[iso];
    if (d && isTime(d.bed) && !isTime(d.wake)) return { iso, bed: d.bed };
  }
  return null;
}

// Hora a la que sueles levantarte: la de tu perfil o la mediana de las últimas 2 semanas
export function usualWake(state, iso) {
  if (isTime(state.profile?.wakeTime)) return state.profile.wakeTime;
  const mins = [];
  for (let i = 1; i <= 14; i++) {
    const w = state.days[addDays(iso, -i)]?.wake;
    if (isTime(w)) mins.push(toMin(w));
  }
  if (mins.length < 3) return DEFAULT_WAKE;
  mins.sort((a, b) => a - b);
  return fromMin(Math.round(mins[Math.floor(mins.length / 2)] / 5) * 5);
}

// A qué hora acostarte esta noche para dormir 8 h (para levantarte a tu hora mañana)
export function bedtimeFor(state, wakeIso) {
  const wake = isTime(state.days[wakeIso]?.plannedWake) ? state.days[wakeIso].plannedWake : usualWake(state, wakeIso);
  return { wake, bed: fromMin(toMin(wake) - SLEEP_TARGET_H * 60 - FALL_ASLEEP_MIN) };
}

// Horas dormidas la noche que termina en `iso` (las de los botones o las apuntadas a mano)
export function nightOf(state, iso) {
  const d = state.days[iso] || {};
  const hours = sleepHours(d.bed, d.wake) ?? (Number(d.sleep) > 0 ? Number(d.sleep) : null);
  return { bed: isTime(d.bed) ? d.bed : null, wake: isTime(d.wake) ? d.wake : null, hours };
}

// Media de las últimas 7 noches registradas
export function sleepAverage(state, iso, n = 7) {
  const hs = [];
  for (let i = 0; i < n; i++) {
    const h = nightOf(state, addDays(iso, -i)).hours;
    if (h != null) hs.push(h);
  }
  return hs.length ? Math.round((hs.reduce((a, b) => a + b, 0) / hs.length) * 10) / 10 : null;
}

// Consejo del día según cómo has dormido → { level, title, text } | null
export function sleepAdvice(state, iso, { rest = false } = {}) {
  const { hours } = nightOf(state, iso);
  if (hours == null) return null;
  const tonight = bedtimeFor(state, addDays(iso, 1)).bed;
  const h = fmtHours(hours);
  if (hours < 5.5) {
    return {
      level: 'alert',
      title: `Has dormido poco (${h} h)`,
      text: rest
        ? `Hoy toca descanso: perfecto. Paseo suave, nada de cafeína después de las 16:00 y a la cama sobre las ${tonight}. Si te da sueño, siesta de 20 min antes de las 17:00.`
        : `Entrena igual, pero sin series al fallo: deja 2-3 reps en recámara y baja un 10 % el peso si te notas flojo. Cafeína solo antes de las 16:00. Si notas mareo o el cuello cargado, haz solo cardio suave y movilidad. Esta noche, a la cama sobre las ${tonight}.`,
    };
  }
  if (hours < 7) {
    return {
      level: 'warn',
      title: `Dormiste ${h} h`,
      text: rest
        ? `Algo justo. Hoy aprovecha para recuperar: acuéstate sobre las ${tonight}.`
        : `Entreno normal pero sin buscar récords hoy. Dormir poco da más hambre: si aprieta, tira de queso batido o gazpacho. Esta noche, a la cama sobre las ${tonight}.`,
    };
  }
  return { level: 'ok', title: `Has dormido ${h} h`, text: 'Bien descansado: hoy es buen día para intentar subir peso o reps.' };
}

// ───────── Horario de comidas del día ─────────
// Se mueve con la hora a la que te has levantado (y la hora del gym). Devuelve SLOTS con time/from/to ajustados.
export function slotsFor(state, iso) {
  const base = Object.fromEntries(SLOTS.map((s) => [s.key, toMin(s.time)]));
  const wake = state.days[iso]?.wake;
  const gym = state.profile?.gymTime;
  const t = { ...base };
  let note = null;

  if (isTime(wake)) {
    // Desayuno ~30 min después de levantarte
    t.desayuno = Math.min(Math.max(toMin(wake) + 30, 5 * 60 + 30), 13 * 60);
  }
  if (isTime(gym)) {
    const g = toMin(gym);
    // Merienda/pre-entreno ~1 h antes del gym (si el gym es por la tarde) y cena al volver
    if (g >= 15 * 60 && g <= 21 * 60) {
      t.merienda = g - 60;
      t.cena = Math.max(base.cena, g + 120);
    }
  }
  // La comida, al menos 3 h después del desayuno; la media mañana, en medio
  t.comida = Math.max(base.comida, t.desayuno + 180);
  t.media = t.desayuno + Math.round((t.comida - t.desayuno) / 2 / 15) * 15;
  if (t.comida - t.desayuno < 4 * 60 && isTime(wake) && toMin(wake) >= 10 * 60) {
    note = 'Te has levantado tarde: junta la media mañana con la comida o pásala a la merienda.';
  }
  t.merienda = Math.max(t.merienda, t.comida + 150);
  t.cena = Math.max(t.cena, t.merienda + 150);
  if (t.cena > 23 * 60) t.cena = 23 * 60;

  const order = SLOTS.map((s) => s.key);
  const shifted = order.some((k) => t[k] !== base[k]);
  return SLOTS.map((s, i) => {
    const prev = i > 0 ? t[order[i - 1]] : null;
    const next = i < order.length - 1 ? t[order[i + 1]] : null;
    const from = prev == null ? Math.min(t[s.key] - 120, isTime(wake) ? toMin(wake) : 5 * 60) : Math.round((prev + t[s.key]) / 2);
    const to = next == null ? 24 * 60 : Math.round((t[s.key] + next) / 2);
    return { ...s, time: fromMin(t[s.key]), from, to, shifted: t[s.key] !== base[s.key], ...(i === 1 && note ? { note } : {}), ...(i === 0 && shifted ? { dayShifted: true } : {}) };
  });
}
