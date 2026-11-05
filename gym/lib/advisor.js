// Resumen de los datos del usuario para el asesor IA (se construye en el móvil y viaja con cada pregunta).

import { dayContext, weightStats, sortedWeights, weeklyAverages, navyBodyFat, adonis, personalRecords, sessionVolume, workoutForDay, eatenMacros, fmtKg } from './coach.js';
import { getExercise } from './exercises.js';
import { SLOTS, WEEK_MENU, getRecipe } from './recipes.js';
import { SUPPLEMENTS, DAILY_TARGETS } from './program.js';
import { addDays, prettyDate, todayISO, weekdayIdx } from './dates.js';

const n1 = (v) => (v == null || Number.isNaN(Number(v)) ? '—' : fmtKg(v));

export function buildAdvisorContext(s, now = new Date()) {
  const lines = [];
  const iso = todayISO(now);
  const ctx = dayContext(s, now);
  const p = s.profile;
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');

  lines.push(`FECHA Y HORA: ${prettyDate(iso)} ${now.getFullYear()}, ${hh}:${mm}`);
  lines.push(
    `PERFIL: ${p.age} años · ${p.heightCm} cm · peso inicial ${n1(p.startKg)} kg · objetivo ${n1(p.goalKg)} kg · inicio del plan ${p.startDate || 'sin configurar'} · suele entrenar a las ${p.gymTime || '—'}`
  );
  lines.push(
    `HOY: semana ${ctx.week} del plan · fase ${ctx.phase.name} (RIR ${ctx.phase.rir}, cardio ${ctx.phase.cardioMin} min, ${ctx.phase.steps} pasos) · entreno ${ctx.workout.name}${ctx.workout.rest ? '' : ` (${ctx.items.map((it) => `${getExercise(it.id)?.name} ${it.sets}×${it.lo}-${it.hi}`).join('; ')})`} · cardio: ${ctx.cardio.title} · ${ctx.isWeigh ? 'hoy toca pesarse' : 'hoy no toca pesarse'}${ctx.isMeasure ? ' · hoy tocan medidas y fotos' : ''}`
  );

  // Peso
  const st = weightStats(s);
  lines.push(
    `PESO: actual ${n1(st.current)} kg (media de los 3 últimos) · perdido ${n1(st.lost)} kg desde ${n1(st.start)} · tendencia ${st.trend != null ? `${n1(st.trend)} kg/semana` : 'sin datos suficientes'} · objetivo ${n1(st.goal)} kg${st.etaWeeks ? ` · al ritmo actual ~${Math.ceil(st.etaWeeks)} semanas` : ''} · aviso de la app: ${st.coach.title}`
  );
  const ws = sortedWeights(s).slice(-20);
  if (ws.length) lines.push(`PESAJES (últimos ${ws.length}): ${ws.map((w) => `${w.date} ${n1(w.kg)}`).join('; ')}`);
  const avgs = weeklyAverages(s).slice(-8);
  if (avgs.length) lines.push(`MEDIAS SEMANALES: ${avgs.map((a) => `semana del ${a.week}: ${n1(a.avg)} kg (${a.n} pesajes)`).join('; ')}`);

  // Medidas
  if (s.measures.length) {
    const ms = s.measures.slice(-4).map((m) => {
      const parts = [['cintura', m.waist], ['cuello', m.neck], ['hombros', m.shoulders], ['pecho', m.chest], ['brazo', m.arm]].filter(([, v]) => v).map(([k, v]) => `${k} ${n1(v)}`);
      return `${m.date}: ${parts.join(', ')} cm`;
    });
    lines.push(`MEDIDAS: ${ms.join(' | ')}`);
    const last = s.measures[s.measures.length - 1];
    const bf = navyBodyFat(last, p.heightCm);
    const ad = adonis(last);
    if (bf || ad) lines.push(`COMPOSICIÓN: ${bf ? `grasa estimada (Navy) ${bf.toFixed(1)}%` : ''}${bf && ad ? ' · ' : ''}${ad ? `ratio hombros/cintura ${ad.toFixed(2)} (ideal ~1,6)` : ''}`);
  } else {
    lines.push('MEDIDAS: aún no registradas.');
  }

  // Últimos 7 días
  const week = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(iso, -i);
    const day = s.days[d] || {};
    const w = workoutForDay(s, d);
    const v = sessionVolume(day);
    const meals = SLOTS.filter((sl) => day.meals?.[sl.key]).length;
    const supps = SUPPLEMENTS.filter((x) => day.supps?.[x.key]).map((x) => x.key);
    const parts = [
      `${prettyDate(d)}: ${w.name}${w.rest ? '' : day.done ? ` (hecho, ${v.sets} series, ${v.vol} kg)` : v.sets ? ` (a medias, ${v.sets} series)` : ' (no registrado)'}`,
      `comidas ${meals}/5`,
      `agua ${day.water || 0}/${Math.ceil(DAILY_TARGETS.waterMl / DAILY_TARGETS.glassMl)} vasos`,
      day.steps ? `${day.steps} pasos` : null,
      day.sleep != null ? `sueño ${n1(day.sleep)} h` : null,
      day.cardio ? 'cardio ✓' : null,
      supps.length ? `suplementos: ${supps.join(', ')}` : null,
    ].filter(Boolean);
    week.push(parts.join(' · '));
  }
  lines.push(`ÚLTIMOS 7 DÍAS:\n${week.join('\n')}`);

  // Hoy comido
  const em = eatenMacros(s, iso);
  const menu = WEEK_MENU[weekdayIdx(iso)];
  const eaten = s.days[iso]?.meals || {};
  lines.push(
    `COMIDAS DE HOY (menú): ${SLOTS.map((sl) => `${sl.label}: ${getRecipe(menu[sl.key]).name}${eaten[sl.key] ? ' ✓' : ''}`).join(' | ')} · llevado ${em.eaten.kcal}/${em.target.kcal} kcal y ${em.eaten.p}/${em.target.p} g proteína`
  );

  // Entrenos recientes con detalle
  const sessions = Object.entries(s.days)
    .filter(([d, v]) => d <= iso && Object.values(v.sets || {}).some((arr) => (arr || []).some((x) => x?.done)))
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 8);
  if (sessions.length) {
    const det = sessions.map(([d, v]) => {
      const w = workoutForDay(s, d);
      const ex = Object.entries(v.sets || {})
        .map(([id, arr]) => {
          const done = (arr || []).filter((x) => x?.done);
          if (!done.length) return null;
          return `${getExercise(id)?.name || id} ${done.map((x) => `${n1(x.kg || 0)}×${x.reps || 0}`).join(', ')}`;
        })
        .filter(Boolean)
        .join('; ');
      return `${d} ${w.name}: ${ex}`;
    });
    lines.push(`ENTRENOS RECIENTES (kg×reps):\n${det.join('\n')}`);
  } else {
    lines.push('ENTRENOS RECIENTES: aún no ha registrado ninguno.');
  }

  const prs = Object.entries(personalRecords(s))
    .sort((a, b) => b[1].est - a[1].est)
    .slice(0, 10);
  if (prs.length) lines.push(`MEJORES MARCAS: ${prs.map(([id, r]) => `${getExercise(id)?.name || id} ${n1(r.kg)}×${r.reps}`).join('; ')}`);

  return lines.join('\n');
}
