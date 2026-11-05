// "Cerebro" de la app: qué toca hoy, progresión de cargas, estadísticas de peso y proyecciones.

import { WORKOUTS, WORKOUT_BY_KEY, phaseForWeek, setsForPhase, cardioForDay, isWeighDay, isMeasureDay } from './program.js';
import { SLOTS, WEEK_MENU, getRecipe, recipeMacros, dayMacros } from './recipes.js';
import { todayISO, weekdayIdx, programWeek, minutesNow, addDays, daysBetween, mondayOf } from './dates.js';

export function workoutForDay(state, iso) {
  const override = state.days[iso]?.workoutKey;
  if (override && WORKOUT_BY_KEY[override]) return WORKOUT_BY_KEY[override];
  return WORKOUTS[weekdayIdx(iso)];
}

export function planItems(workout, phase) {
  return workout.items.map(([id, sets, lo, hi, rest, note]) => ({
    id,
    sets: setsForPhase(sets, phase),
    baseSets: sets,
    lo,
    hi,
    rest,
    note,
  }));
}

// Contexto de un día. Por defecto hoy; `isoOverride` permite ver/editar otro día (ayer, mañana…)
export function dayContext(state, now = new Date(), isoOverride = null) {
  const iso = isoOverride || todayISO(now);
  const dayIdx = weekdayIdx(iso);
  const week = programWeek(state.profile.startDate || iso, iso);
  const phase = phaseForWeek(week);
  const workout = workoutForDay(state, iso);
  const items = planItems(workout, phase);
  const cardio = cardioForDay(workout, phase);
  return {
    iso,
    dayIdx,
    week,
    phase,
    workout,
    items,
    cardio,
    isWeigh: isWeighDay(dayIdx),
    isMeasure: isMeasureDay(dayIdx, week),
    menu: WEEK_MENU[dayIdx],
    started: !!state.profile.startDate && daysBetween(state.profile.startDate, iso) >= 0,
  };
}

export function setProgress(state, iso, items) {
  const sets = state.days[iso]?.sets || {};
  let total = 0;
  let done = 0;
  for (const it of items) {
    total += it.sets;
    const arr = sets[it.id] || [];
    done += Math.min(it.sets, arr.filter((s) => s?.done).length);
  }
  return { total, done, pct: total ? done / total : 0 };
}

// Última vez que hiciste este ejercicio (antes de `iso`)
export function lastPerformance(state, exId, iso) {
  const dates = Object.keys(state.days)
    .filter((d) => d < iso && state.days[d]?.sets?.[exId]?.some((s) => s?.done))
    .sort();
  const last = dates[dates.length - 1];
  if (!last) return null;
  return { date: last, sets: state.days[last].sets[exId].filter((s) => s?.done) };
}

// Doble progresión: si en la última sesión llegaste al tope de reps en todas las series → sube peso
export function overloadHint(last, item) {
  if (!last || !last.sets.length) return null;
  const kgs = last.sets.map((s) => Number(s.kg) || 0);
  const maxKg = Math.max(...kgs);
  const allTop = last.sets.length >= item.sets && last.sets.every((s) => Number(s.reps) >= item.hi);
  if (allTop && maxKg > 0) {
    const inc = maxKg < 20 ? 1 : 2.5;
    return { type: 'up', text: `Llegaste a ${item.hi} reps en todas: sube a ${fmtKg(maxKg + inc)} kg`, kg: maxKg + inc };
  }
  const anyLow = last.sets.some((s) => Number(s.reps) < item.lo);
  if (anyLow && maxKg > 0) {
    return { type: 'keep', text: `Mantén ${fmtKg(maxKg)} kg y busca llegar a ${item.lo}+ reps en todas`, kg: maxKg };
  }
  return { type: 'keep', text: `Mismo peso (${fmtKg(maxKg)} kg) e intenta +1 rep por serie`, kg: maxKg };
}

export function fmtKg(n) {
  const v = Math.round(Number(n) * 10) / 10;
  return String(v).replace('.', ',');
}

// 1RM estimado (Epley)
export function e1rm(kg, reps) {
  const k = Number(kg) || 0;
  const r = Number(reps) || 0;
  if (!k || !r) return 0;
  return k * (1 + r / 30);
}

export function personalRecords(state) {
  const best = {};
  for (const [date, d] of Object.entries(state.days)) {
    for (const [exId, sets] of Object.entries(d.sets || {})) {
      for (const s of sets || []) {
        if (!s?.done) continue;
        const est = e1rm(s.kg, s.reps);
        if (!best[exId] || est > best[exId].est) best[exId] = { est, kg: Number(s.kg), reps: Number(s.reps), date };
      }
    }
  }
  return best;
}

export function sessionVolume(dayData) {
  let vol = 0;
  let sets = 0;
  for (const arr of Object.values(dayData?.sets || {})) {
    for (const s of arr || []) {
      if (s?.done) {
        sets += 1;
        vol += (Number(s.kg) || 0) * (Number(s.reps) || 0);
      }
    }
  }
  return { vol: Math.round(vol), sets };
}

// ───────── Comidas ─────────

export function nextMeal(state, now = new Date(), viewIso = null) {
  const iso = viewIso || todayISO(now);
  const eaten = state.days[iso]?.meals || {};
  const menu = WEEK_MENU[weekdayIdx(iso)];
  // Otro día (no hoy): la primera comida sin marcar de ese día
  if (viewIso && viewIso !== todayISO(now)) {
    const slot = SLOTS.find((sl) => !eaten[sl.key]) || SLOTS[SLOTS.length - 1];
    return { slot, recipe: getRecipe(menu[slot.key]), iso, tomorrow: false, now: false, otherDay: true, allDone: SLOTS.every((sl) => eaten[sl.key]) };
  }
  const mins = minutesNow(now);
  for (const slot of SLOTS) {
    if (mins < slot.to && !eaten[slot.key]) {
      const late = mins >= slot.from;
      return { slot, recipe: getRecipe(menu[slot.key]), iso, tomorrow: false, now: late };
    }
  }
  const tIso = addDays(iso, 1);
  const tMenu = WEEK_MENU[weekdayIdx(tIso)];
  return { slot: SLOTS[0], recipe: getRecipe(tMenu.desayuno), iso: tIso, tomorrow: true, now: false };
}

export function eatenMacros(state, iso) {
  const eaten = state.days[iso]?.meals || {};
  const menu = WEEK_MENU[weekdayIdx(iso)];
  const tot = { kcal: 0, p: 0, c: 0, f: 0 };
  for (const slot of SLOTS) {
    if (eaten[slot.key]) {
      const m = recipeMacros(getRecipe(menu[slot.key]));
      tot.kcal += m.kcal;
      tot.p += m.p;
      tot.c += m.c;
      tot.f += m.f;
    }
  }
  return { eaten: tot, target: dayMacros(weekdayIdx(iso)) };
}

// ───────── Peso ─────────

export function sortedWeights(state) {
  return [...state.weights].filter((w) => w && w.date && Number(w.kg) > 0).sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function weeklyAverages(state) {
  const map = new Map();
  for (const w of sortedWeights(state)) {
    const wk = mondayOf(w.date);
    if (!map.has(wk)) map.set(wk, []);
    map.get(wk).push(Number(w.kg));
  }
  return [...map.entries()].map(([week, arr]) => ({ week, avg: arr.reduce((a, b) => a + b, 0) / arr.length, n: arr.length }));
}

// Pendiente (kg/semana) por regresión lineal de los últimos `days` días
export function trendPerWeek(state, days = 21) {
  const ws = sortedWeights(state);
  if (ws.length < 3) return null;
  const lastDate = ws[ws.length - 1].date;
  const pts = ws.filter((w) => daysBetween(w.date, lastDate) <= days).map((w) => [daysBetween(ws[0].date, w.date), Number(w.kg)]);
  if (pts.length < 3) return null;
  const n = pts.length;
  const sx = pts.reduce((a, p) => a + p[0], 0);
  const sy = pts.reduce((a, p) => a + p[1], 0);
  const sxx = pts.reduce((a, p) => a + p[0] * p[0], 0);
  const sxy = pts.reduce((a, p) => a + p[0] * p[1], 0);
  const den = n * sxx - sx * sx;
  if (!den) return null;
  const slope = (n * sxy - sx * sy) / den; // kg/día
  return slope * 7;
}

export function weightStats(state) {
  const ws = sortedWeights(state);
  const { startKg, goalKg } = state.profile;
  const start = ws.length ? Number(ws[0].kg) : Number(startKg);
  const recent = ws.slice(-3);
  const current = recent.length ? recent.reduce((a, w) => a + Number(w.kg), 0) / recent.length : Number(startKg);
  const lost = start - current;
  const trend = trendPerWeek(state);
  let etaWeeks = null;
  if (trend && trend < -0.05 && current > goalKg) etaWeeks = (current - goalKg) / -trend;
  const avgs = weeklyAverages(state);
  let coach = {
    level: 'info',
    title: 'Registra tu peso',
    text: 'Pésate lunes, miércoles y viernes. Con 2 semanas de datos te digo si hay que ajustar algo.',
  };
  if (avgs.length >= 2) {
    const a = avgs[avgs.length - 2].avg;
    const b = avgs[avgs.length - 1].avg;
    const pct = ((a - b) / a) * 100; // % perdido la última semana
    const weeksIn = avgs.length;
    if (weeksIn <= 2 && pct > 1.2) {
      coach = { level: 'ok', title: 'Bajada inicial rápida', text: 'Normal las 2 primeras semanas: es agua y glucógeno. A partir de la 3ª se estabiliza en 0,5-1% por semana.' };
    } else if (pct > 1.2) {
      coach = { level: 'warn', title: 'Vas demasiado rápido', text: `Has bajado un ${pct.toFixed(1).replace('.', ',')}% esta semana. Para no perder músculo, añade ~150 kcal al día (un plátano + 10 g de crema de cacahuete en la merienda).` };
    } else if (pct >= 0.5) {
      coach = { level: 'ok', title: 'Ritmo perfecto', text: `−${pct.toFixed(1).replace('.', ',')}% esta semana. Es justo lo que buscamos: grasa fuera y el músculo se queda. No toques nada.` };
    } else if (pct >= 0.2) {
      coach = { level: 'warn', title: 'Un poco lento', text: 'Si se repite otra semana: +2.000 pasos al día o quita 20 g de arroz/pasta en la comida (~-75 kcal). Revisa también aceite "a ojo" y picoteo.' };
    } else {
      coach = { level: 'alert', title: 'Estancado', text: 'Media igual o más alta que la semana pasada. Si coincide con empezar la creatina o una comida salada, espera 1 semana. Si no: −150 kcal (−30 g de arroz/pasta en la comida y sin miel) y 30 min más de pasos.' };
    }
  }
  return { start, current, lost, trend, etaWeeks, goal: Number(goalKg), coach, count: ws.length };
}

// Proyección semanal: −0,75% del peso por semana + ~1,5 kg de agua las 2 primeras semanas
export function projection(startKg, goalKg, weeks = 26) {
  const out = [];
  let w = Number(startKg);
  for (let i = 0; i <= weeks; i++) {
    const water = i === 0 ? 0 : Math.min(i, 2) * 0.75;
    out.push({ week: i, kg: Math.max(Number(goalKg), w - water) });
    w = w * (1 - 0.0075);
  }
  return out;
}

export function weeksToGoal(startKg, goalKg) {
  const p = projection(startKg, goalKg, 60);
  const hit = p.find((x) => x.kg <= goalKg);
  return hit ? hit.week : null;
}

// ───────── Composición corporal ─────────

// Método US Navy (hombre, cm): % grasa
export function navyBodyFat({ waist, neck }, heightCm) {
  const w = Number(waist);
  const n = Number(neck);
  const h = Number(heightCm);
  if (!w || !n || !h || w <= n) return null;
  const bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
  return Math.max(3, Math.min(60, bf));
}

export function targetWeightFor(bfPct, weightKg, targetBf = 12) {
  if (!bfPct || !weightKg) return null;
  const lean = weightKg * (1 - bfPct / 100);
  return lean / (1 - targetBf / 100);
}

// Índice Adonis: hombros / cintura (ideal ≈ 1,6)
export function adonis({ shoulders, waist }) {
  const s = Number(shoulders);
  const w = Number(waist);
  if (!s || !w) return null;
  return s / w;
}

// ───────── Racha ─────────

export function dayCompleted(state, iso) {
  const d = state.days[iso];
  if (!d) return false;
  const wk = workoutForDay(state, iso);
  if (wk.rest) return !!d.cardio || Number(d.steps) >= 8000;
  return !!d.done;
}

export function streak(state, iso) {
  let n = 0;
  let cur = dayCompleted(state, iso) ? iso : addDays(iso, -1);
  while (dayCompleted(state, cur)) {
    n += 1;
    cur = addDays(cur, -1);
    if (n > 999) break;
  }
  return n;
}
