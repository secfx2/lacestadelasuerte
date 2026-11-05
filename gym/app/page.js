'use client';

import Link from 'next/link';
import { Suspense, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import FoodImg from '../components/FoodImg';
import { Bar, Check, PageSkeleton, Ring, Stepper, useToast } from '../components/ui';
import Sparkline from '../components/Sparkline';
import { useAppState, useHydrated, useNow, update, updateDay } from '../lib/store';
import { dayContext, setProgress, nextMeal, eatenMacros, weightStats, streak, dayCompleted, sortedWeights, workoutForDay } from '../lib/coach';
import { SLOTS, WEEK_MENU, getRecipe, recipeMacros } from '../lib/recipes';
import { SUPPLEMENTS, DAILY_TARGETS, TIPS, WEIGH_HOWTO, WEIGH_DAYS } from '../lib/program';
import { prettyDate, DAY_SHORT, DAY_NAMES, mondayOf, addDays, weekdayIdx, todayISO, minutesNow } from '../lib/dates';
import DateNav, { useViewDate, relLabel } from '../components/DateNav';
import { fmtKg } from '../lib/coach';
import Onboarding from '../components/Onboarding';
import { SyncBadge } from '../components/SyncAgent';
import { useSyncStatus } from '../lib/sync';
import { buildShoppingList, shoppingText, STORE_PLAN, CATEGORY_EMOJI } from '../lib/shopping';

export default function HomePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Home />
    </Suspense>
  );
}

function Home() {
  const hydrated = useHydrated();
  const s = useAppState();
  const now = useNow(30000);
  const viewIso = useViewDate();
  const [toast, showToast] = useToast();
  const sync = useSyncStatus();

  if (!hydrated) return <PageSkeleton />;
  if (!s.profile.startDate) {
    // Antes de pedir datos, mira si ya están en la nube (otro dispositivo)
    if (!sync.initialDone) {
      return (
        <div className="stack center" style={{ marginTop: 80, alignItems: 'center' }}>
          <Icon name="cloud" size={34} className="muted" />
          <p className="muted">Buscando tus datos en la nube…</p>
        </div>
      );
    }
    return <Onboarding />;
  }

  const ctx = dayContext(s, now, viewIso);
  const today = todayISO(now);
  const isToday = ctx.iso === today;
  const day = s.days[ctx.iso] || {};

  return (
    <>
      {toast}
      <header className="page-head">
        <div>
          <div className="eyebrow row" style={{ gap: 8 }}>
            {prettyDate(ctx.iso)} <SyncBadge />
          </div>
          <h1>
            Semana {ctx.week} <span className="muted" style={{ fontWeight: 500 }}>· {ctx.phase.name}</span>
          </h1>
        </div>
        <Link href="/ajustes" className="icon-btn" aria-label="Ajustes">
          <Icon name="settings" size={19} />
        </Link>
      </header>

      <DateNav iso={ctx.iso} />
      {!isToday && (
        <div className="hint warn" style={{ marginBottom: 12 }}>
          <Icon name="calendar" size={18} />
          <span>
            Estás viendo <b>{relLabel(ctx.iso).toLowerCase()}</b> ({prettyDate(ctx.iso).toLowerCase()}). Todo lo que marques aquí se guarda en ese día.
          </span>
        </div>
      )}

      <div className="bento">
        <WorkoutTile s={s} ctx={ctx} day={day} isToday={isToday} />
        <MealTile s={s} now={now} iso={ctx.iso} showToast={showToast} />
        <WeighTile s={s} ctx={ctx} isToday={isToday} showToast={showToast} />
        <WaterTile day={day} iso={ctx.iso} isToday={isToday} now={now} />
        <CardioTile ctx={ctx} day={day} />
        <StreakTile s={s} iso={today} />
        <MacrosTile s={s} iso={ctx.iso} />
        <SuppsTile ctx={ctx} day={day} />
        <StepsTile ctx={ctx} day={day} />
        <SleepTile day={day} iso={ctx.iso} />
        <ProgressTile s={s} />
        {ctx.isMeasure && <MeasureTile />}
        <WeekTile s={s} iso={ctx.iso} today={today} />
        <ShoppingTile s={s} iso={ctx.iso} showToast={showToast} />
        <TipTile iso={ctx.iso} />
        <Link href="/plan#michelines" className="tile w2 accent-amber" style={{ minHeight: 0 }}>
          <span className="tile-label" style={{ color: 'var(--amber)' }}>
            <Icon name="target" size={14} /> Michelines
          </span>
          <div className="tile-title" style={{ fontSize: 17 }}>Plan para los costados: glúteo, cintura y paciencia</div>
          <p className="small muted">Por qué es lo último en irse y qué hacer mientras (hip thrust, abducción, vacío abdominal).</p>
        </Link>
        <LinkTile href="/plan" icon="target" color="violet" label="Expectativas" title="¿Cuándo me veré aesthetic?" />
        <LinkTile href="/plan#mandibula" icon="face" color="pink" label="Mandíbula" title="Guía de cara y cuello" />
        <LinkTile href="/asesor" icon="sparkle" color="lime" label="Asesor IA" title="Pregúntale lo que quieras" />
        <LinkTile href="/plan#suplementos" icon="pill" color="cyan" label="Suplementos" title="Qué tomar y qué no" />
      </div>
    </>
  );
}

/* ───────────────────────── Tiles ───────────────────────── */

function WorkoutTile({ s, ctx, day, isToday }) {
  const { workout, items } = ctx;
  const href = isToday ? '/entreno' : `/entreno?fecha=${ctx.iso}`;
  const when = isToday ? 'Hoy' : relLabel(ctx.iso);
  if (workout.rest) {
    return (
      <Link href={href} className="tile w2 w2-lg h2-lg accent-lime" style={{ minHeight: 200 }}>
        <span className="tile-label" style={{ color: 'var(--lime)' }}>
          <Icon name="dumbbell" size={14} /> {when}
        </span>
        <div style={{ fontSize: 40 }}>{workout.emoji}</div>
        <div className="tile-title" style={{ fontSize: 26 }}>{workout.name}</div>
        <p className="muted small">{workout.focus}</p>
        <div className="tile-foot">
          <span className="pill lime">{ctx.cardio.title}</span>
          <Icon name="chevron" />
        </div>
      </Link>
    );
  }
  const prog = setProgress(s, ctx.iso, items);
  const mins = Math.round(8 + items.reduce((a, it) => a + it.sets * (0.75 + it.rest / 60), 0) + ctx.cardio.minutes);
  const cta = day.done ? 'Entreno completado' : prog.done > 0 ? 'Continuar entreno' : 'Empezar entreno';
  return (
    <Link href={href} className="tile w2 w2-lg h2-lg accent-lime" style={{ minHeight: 210 }}>
      <div className="spread" style={{ alignItems: 'flex-start' }}>
        <span className="tile-label" style={{ color: 'var(--lime)' }}>
          <Icon name="dumbbell" size={14} /> {isToday ? 'Entreno de hoy' : `Entreno · ${when}`}
        </span>
        <Ring pct={prog.pct} size={58} stroke={6} label={day.done ? '✓' : `${prog.done}/${prog.total}`} />
      </div>
      <div className="row" style={{ gap: 12, marginTop: -6 }}>
        <span style={{ fontSize: 34 }}>{workout.emoji}</span>
        <div className="grow">
          <div className="tile-title" style={{ fontSize: 26 }}>{workout.name}</div>
          <div className="muted small">{workout.subtitle}</div>
        </div>
      </div>
      <div className="row wrap" style={{ gap: 6 }}>
        <span className="pill">{items.length} ejercicios</span>
        <span className="pill">~{mins} min</span>
        <span className="pill lime">RIR {ctx.phase.rir}</span>
      </div>
      <div className="tile-foot">
        <span className={`btn ${day.done ? '' : 'primary'} sm`}>
          {day.done ? <Icon name="check" size={16} /> : <Icon name="play" size={14} fill="currentColor" />} {cta}
        </span>
        <span className="small muted">{ctx.phase.name}</span>
      </div>
    </Link>
  );
}

function MealTile({ s, now, iso, showToast }) {
  const nm = nextMeal(s, now, iso);
  const m = recipeMacros(nm.recipe);
  const href = `/receta/${nm.recipe.id}?pasos=1&slot=${nm.slot.key}&d=${nm.iso}`;
  const markEaten = () => {
    updateDay(nm.iso, (d) => {
      d.meals = { ...(d.meals || {}), [nm.slot.key]: true };
    });
    showToast(`${nm.slot.label} marcada ✓`);
  };
  return (
    <div className="tile photo w2 w2-lg" style={{ minHeight: 230 }}>
      <div className="bg">
        <FoodImg recipe={nm.recipe} priority style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div className="inner">
        <span className="tile-label" style={{ color: 'var(--amber)' }}>
          <span className="dot" /> {nm.otherDay ? (nm.allDone ? `${relLabel(iso)} · todo comido ✓` : `${relLabel(iso)} · pendiente`) : nm.tomorrow ? 'Mañana' : nm.now ? 'Ahora toca' : 'Próxima comida'} · {nm.slot.label} · {nm.slot.time}
        </span>
        <Link href={href} className="tile-title" style={{ fontSize: 22 }}>{nm.recipe.name}</Link>
        <div className="small" style={{ color: 'rgba(255,255,255,0.78)' }}>
          <b className="num">{m.kcal}</b> kcal · <b style={{ color: 'var(--lime)' }}>{m.p} g</b> proteína · {nm.recipe.time} min
        </div>
        <div className="row" style={{ marginTop: 6 }}>
          <Link href={href} className="btn primary sm">
            <Icon name="play" size={13} fill="currentColor" /> Receta paso a paso
          </Link>
          {!nm.tomorrow && !nm.allDone && (
            <button className="btn sm" onClick={markEaten} style={{ background: 'rgba(0,0,0,0.35)' }}>
              <Icon name="check" size={15} /> Hecha
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function WeighTile({ s, ctx, isToday, showToast }) {
  const ws = sortedWeights(s);
  const todayW = ws.find((w) => w.date === ctx.iso);
  const last = ws[ws.length - 1];
  const [val, setVal] = useState('');
  const nextDay = (() => {
    for (let i = 1; i <= 7; i++) {
      const di = (ctx.dayIdx + i) % 7;
      if (WEIGH_DAYS.includes(di)) return DAY_NAMES[di].toLowerCase();
    }
    return '';
  })();
  const save = () => {
    const kg = parseFloat(String(val).replace(',', '.'));
    if (!kg || kg < 30 || kg > 300) return showToast('Pon un peso válido');
    update((d) => {
      d.weights = d.weights.filter((w) => w.date !== ctx.iso).concat({ date: ctx.iso, kg });
    });
    setVal('');
    showToast('Peso guardado ⚖️');
  };
  const due = ctx.isWeigh && !todayW;
  return (
    <div className={`tile accent-cyan${due ? ' alert' : ''}`}>
      <span className="tile-label" style={{ color: 'var(--cyan)' }}>
        <Icon name="scale" size={14} /> Pesaje
      </span>
      {due ? (
        <>
          <div className="tile-title" style={{ fontSize: 17 }}>{isToday ? 'Hoy toca pesarse' : 'Ese día tocaba pesarse'}</div>
          <div className="row" style={{ gap: 6, marginTop: 'auto' }}>
            <input
              className="input sm"
              inputMode="decimal"
              placeholder={last ? fmtKg(last.kg) : '94,0'}
              value={val}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && save()}
              aria-label="Peso en kg"
            />
            <button className="icon-btn sm" onClick={save} aria-label="Guardar peso" style={{ background: 'var(--cyan)', color: '#04161b', borderColor: 'transparent' }}>
              <Icon name="check" size={16} stroke={2.4} />
            </button>
          </div>
          <p className="tiny muted" title={WEIGH_HOWTO}>En ayunas, tras ir al baño</p>
        </>
      ) : (
        <>
          <div className="tile-big num">
            {todayW ? fmtKg(todayW.kg) : last ? fmtKg(last.kg) : '—'}
            <span className="small muted" style={{ fontWeight: 500 }}> kg</span>
          </div>
          <p className="small muted" style={{ marginTop: 'auto' }}>
            {todayW ? `✓ Registrado${isToday ? ' hoy' : ''}: ${fmtKg(todayW.kg)} kg` : `Próximo: ${nextDay}`}
          </p>
        </>
      )}
    </div>
  );
}

function WaterTile({ day, iso, isToday, now }) {
  const glasses = day.water || 0;
  const target = Math.ceil(DAILY_TARGETS.waterMl / DAILY_TARGETS.glassMl);
  const ml = glasses * DAILY_TARGETS.glassMl;
  const pct = Math.min(1, glasses / target);
  const left = Math.max(0, target - glasses);
  // Ritmo: repartido entre las 8:00 y las 22:00
  const expected = isToday ? Math.round(target * Math.max(0, Math.min(1, (minutesNow(now) - 8 * 60) / (14 * 60)))) : target;
  const add = (n) =>
    updateDay(iso, (d) => {
      d.water = Math.max(0, (d.water || 0) + n);
    });
  return (
    <div className="tile accent-blue">
      <div className="water-fill" style={{ height: `${pct * 100}%` }} />
      <span className="tile-label" style={{ color: 'var(--blue)' }}>
        <Icon name="drop" size={14} /> Agua
      </span>
      <div className="tile-big num">
        {glasses}
        <span className="small muted" style={{ fontWeight: 500 }}> / {target} vasos</span>
      </div>
      <div className="glasses" aria-hidden="true">
        {Array.from({ length: target }).map((_, i) => (
          <i key={i} className={i < glasses ? 'on' : ''} />
        ))}
      </div>
      <p className="tiny muted">
        {left === 0
          ? `✓ ${(ml / 1000).toFixed(1).replace('.', ',')} L · objetivo cumplido`
          : `${(ml / 1000).toFixed(1).replace('.', ',')} de ${DAILY_TARGETS.waterMl / 1000} L · faltan ${left} vasos${isToday && glasses < expected ? ` · a esta hora ~${expected}` : ''}`}
      </p>
      <div className="tile-foot">
        <button className="icon-btn sm" onClick={() => add(-1)} aria-label="Quitar vaso">
          <Icon name="minus" size={15} />
        </button>
        <button className="btn sm" onClick={() => add(1)} style={{ background: 'var(--blue)', color: '#06101f', borderColor: 'transparent' }}>
          <Icon name="plus" size={15} stroke={2.4} /> Vaso
        </button>
      </div>
    </div>
  );
}

function CardioTile({ ctx, day }) {
  const toggle = () =>
    updateDay(ctx.iso, (d) => {
      d.cardio = !d.cardio;
    });
  return (
    <div className="tile accent-pink">
      <span className="tile-label" style={{ color: 'var(--pink)' }}>
        <Icon name="heart" size={14} /> Cardio
      </span>
      <div className="tile-title" style={{ fontSize: 17 }}>{ctx.cardio.title}</div>
      <p className="tiny muted">{ctx.workout.rest ? 'Paseo al aire libre' : 'Después de las pesas'}</p>
      <div className="tile-foot">
        {ctx.cardio.exerciseId ? (
          <Link href={`/ejercicio/${ctx.cardio.exerciseId}`} className="small muted">
            Cómo ›
          </Link>
        ) : (
          <span />
        )}
        <Check on={day.cardio} onClick={toggle} label="Cardio hecho" />
      </div>
    </div>
  );
}

function StreakTile({ s, iso }) {
  const n = streak(s, iso);
  return (
    <div className="tile accent-amber">
      <span className="tile-label" style={{ color: 'var(--amber)' }}>
        <Icon name="flame" size={14} /> Racha
      </span>
      <div className="tile-big num">
        {n}
        <span className="small muted" style={{ fontWeight: 500 }}> {n === 1 ? 'día' : 'días'}</span>
      </div>
      <p className="small muted" style={{ marginTop: 'auto' }}>
        {n === 0 ? 'Hoy empieza la racha' : n < 7 ? '¡No la rompas!' : 'Imparable 🔥'}
      </p>
    </div>
  );
}

function MacrosTile({ s, iso }) {
  const { eaten, target } = eatenMacros(s, iso);
  const meals = s.days[iso]?.meals || {};
  const menu = WEEK_MENU[weekdayIdx(iso)];
  const toggle = (k) =>
    updateDay(iso, (d) => {
      d.meals = { ...(d.meals || {}), [k]: !d.meals?.[k] };
    });
  return (
    <div className="tile w2">
      <div className="spread">
        <span className="tile-label">
          <Icon name="food" size={14} /> Comido hoy
        </span>
        <Link href="/dieta" className="small muted">
          Menú ›
        </Link>
      </div>
      <div className="stack" style={{ gap: 8 }}>
        <div>
          <div className="spread small">
            <span>Calorías</span>
            <span className="num muted">
              <b style={{ color: 'var(--text)' }}>{eaten.kcal}</b> / {target.kcal}
            </span>
          </div>
          <Bar pct={eaten.kcal / target.kcal} color="amber" />
        </div>
        <div>
          <div className="spread small">
            <span>Proteína</span>
            <span className="num muted">
              <b style={{ color: 'var(--text)' }}>{eaten.p}</b> / {target.p} g
            </span>
          </div>
          <Bar pct={eaten.p / target.p} />
        </div>
      </div>
      <div className="row" style={{ gap: 6, marginTop: 'auto', justifyContent: 'space-between' }}>
        {SLOTS.map((sl) => (
          <div key={sl.key} className="center" style={{ flex: 1 }} title={getRecipe(menu[sl.key]).name}>
            <button
              className={`check${meals[sl.key] ? ' on' : ''}`}
              style={{ margin: '0 auto', width: 36, height: 36, borderRadius: 12 }}
              onClick={() => toggle(sl.key)}
              aria-label={`${sl.label} ${meals[sl.key] ? 'hecha' : 'pendiente'}`}
            >
              {meals[sl.key] ? <Icon name="check" size={16} stroke={2.6} /> : <span style={{ opacity: 1, fontSize: 16 }}>{sl.emoji}</span>}
            </button>
            <div className="tiny faint" style={{ marginTop: 3 }}>{sl.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SuppsTile({ ctx, day }) {
  const list = SUPPLEMENTS.filter((x) => !x.optional && (x.daily || (x.training && !ctx.workout.rest)));
  const taken = day.supps || {};
  const n = list.filter((x) => taken[x.key]).length;
  const toggle = (k) =>
    updateDay(ctx.iso, (d) => {
      d.supps = { ...(d.supps || {}), [k]: !d.supps?.[k] };
    });
  return (
    <div className="tile w2 accent-violet">
      <div className="spread">
        <span className="tile-label" style={{ color: 'var(--violet)' }}>
          <Icon name="pill" size={14} /> Suplementos · {n}/{list.length}
        </span>
        <Link href="/plan#suplementos" className="small muted">
          Info ›
        </Link>
      </div>
      <div className="row wrap" style={{ gap: 6, marginTop: 'auto' }}>
        {list.map((x) => (
          <button
            key={x.key}
            className={`chip${taken[x.key] ? ' on' : ''}`}
            onClick={() => toggle(x.key)}
            style={taken[x.key] ? { background: 'var(--violet)', color: '#120a26' } : undefined}
          >
            {taken[x.key] ? '✓ ' : ''}
            {x.name.split(' (')[0].replace('Proteína whey', 'Whey').replace(' monohidrato', '').replace(' básico', '')} <span style={{ opacity: 0.65, fontWeight: 500 }}>{x.dose.split(' (')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepsTile({ ctx, day }) {
  const goal = ctx.workout.rest ? 12000 : ctx.phase.steps;
  const steps = Number(day.steps) || 0;
  const [edit, setEdit] = useState(false);
  const [val, setVal] = useState('');
  const save = () => {
    const n = parseInt(String(val).replace(/\D/g, ''), 10);
    if (!Number.isNaN(n)) updateDay(ctx.iso, (d) => (d.steps = n));
    setEdit(false);
  };
  return (
    <div className="tile">
      <span className="tile-label">
        <Icon name="steps" size={14} /> Pasos
      </span>
      {edit ? (
        <input
          autoFocus
          className="input sm"
          inputMode="numeric"
          placeholder={String(steps || 8000)}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          aria-label="Pasos de hoy"
        />
      ) : (
        <button onClick={() => { setVal(''); setEdit(true); }} style={{ background: 'none', border: 0, padding: 0, textAlign: 'left' }} aria-label="Editar pasos">
          <div className="tile-big num" style={{ fontSize: 28 }}>{steps.toLocaleString('es-ES')}</div>
        </button>
      )}
      <div style={{ marginTop: 'auto' }}>
        <Bar pct={steps / goal} color="pink" thin />
        <div className="tiny muted" style={{ marginTop: 5 }}>Objetivo {goal.toLocaleString('es-ES')}</div>
      </div>
    </div>
  );
}

function SleepTile({ day, iso }) {
  const v = day.sleep ?? 7.5;
  const set = (n) => updateDay(iso, (d) => (d.sleep = n));
  return (
    <div className="tile">
      <span className="tile-label">
        <Icon name="moon" size={14} /> Sueño anoche
      </span>
      <div className="tile-big num" style={{ fontSize: 28, color: v >= 7.5 ? 'var(--text)' : 'var(--amber)' }}>
        {String(v).replace('.', ',')} h
      </div>
      <div className="tile-foot">
        <Stepper value={v} onChange={set} step={0.5} min={3} max={12} format={() => ''} />
      </div>
    </div>
  );
}

function ProgressTile({ s }) {
  const st = weightStats(s);
  const ws = sortedWeights(s).slice(-30);
  return (
    <Link href="/progreso" className="tile w2">
      <div className="spread">
        <span className="tile-label">
          <Icon name="chart" size={14} /> Progreso
        </span>
        <Icon name="chevron" size={18} className="muted" />
      </div>
      <div className="row" style={{ alignItems: 'flex-end', gap: 14 }}>
        <div>
          <div className="tile-big num" style={{ color: st.lost > 0 ? 'var(--lime)' : 'var(--text)' }}>
            {st.lost > 0 ? '−' : ''}
            {fmtKg(Math.abs(st.lost))} kg
          </div>
          <div className="small muted">
            {fmtKg(st.current)} → objetivo {fmtKg(st.goal)} kg
          </div>
        </div>
        <div className="grow">
          <Sparkline values={ws.map((w) => Number(w.kg))} height={52} />
        </div>
      </div>
      <p className="small muted">
        {st.etaWeeks ? `A este ritmo: objetivo en ~${Math.ceil(st.etaWeeks)} semanas` : st.coach.title}
      </p>
    </Link>
  );
}

function MeasureTile() {
  return (
    <Link href="/progreso#medidas" className="tile accent-amber alert">
      <span className="tile-label" style={{ color: 'var(--amber)' }}>
        <Icon name="camera" size={14} /> Hoy toca
      </span>
      <div className="tile-title" style={{ fontSize: 17 }}>Medidas + fotos</div>
      <p className="tiny muted" style={{ marginTop: 'auto' }}>Cintura, hombros, brazo, cuello · 3 fotos</p>
    </Link>
  );
}

function WeekTile({ s, iso, today }) {
  const mon = mondayOf(iso);
  return (
    <div className="tile w2" style={{ minHeight: 0 }}>
      <div className="spread">
        <span className="tile-label">
          <Icon name="calendar" size={14} /> {mon === mondayOf(today) ? 'Esta semana' : `Semana del ${prettyDate(mon, { weekday: false })}`}
        </span>
        <span className="tiny faint">Toca un día para verlo</span>
      </div>
      <div className="week-strip">
        {DAY_SHORT.map((d, i) => {
          const di = addDays(mon, i);
          const wk = workoutForDay(s, di);
          const ok = dayCompleted(s, di);
          return (
            <Link
              key={d}
              href={di === today ? '/' : `/?fecha=${di}`}
              scroll={false}
              className={`d${di === iso ? ' today' : ''}${di === today ? ' isnow' : ''}${ok ? ' ok' : ''}`}
              aria-label={`${DAY_NAMES[i]} ${prettyDate(di, { weekday: false })}`}
            >
              <span>{d}</span>
              <span className="e">{ok ? '✅' : wk.emoji}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function ShoppingTile({ s, iso, showToast }) {
  const groups = useMemo(() => buildShoppingList(), []);
  const week = mondayOf(iso);
  const checked = s.shopping[week] || {};
  const all = groups.flatMap((g) => g.items.map((it) => ({ ...it, cat: g.cat })));
  const pending = all.filter((it) => !checked[it.k]);
  const done = all.length - pending.length;
  const copy = async () => {
    const text = shoppingText(groups, checked);
    try {
      if (navigator.share) await navigator.share({ title: 'Compra de la semana', text });
      else {
        await navigator.clipboard.writeText(text);
        showToast('Lista copiada 📋');
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        showToast('Lista copiada 📋');
      } catch {
        /* cancelado */
      }
    }
  };
  return (
    <div className="tile w2 w2-lg accent-amber">
      <div className="spread">
        <span className="tile-label" style={{ color: 'var(--amber)' }}>
          <Icon name="cart" size={14} /> Compra de la semana
        </span>
        <span className="pill amber num">
          {done}/{all.length}
        </span>
      </div>
      <div className="tile-title" style={{ fontSize: 17 }}>
        {pending.length === 0 ? '¡Todo comprado! ✓' : `Todo en ${STORE_PLAN.main} · te faltan ${pending.length} cosas`}
      </div>
      <Bar pct={done / all.length} color="amber" thin />
      {pending.length > 0 && (
        <p className="small muted" style={{ lineHeight: 1.5 }}>
          {pending.slice(0, 7).map((it, i) => (
            <span key={it.k}>
              {i ? ' · ' : ''}
              {CATEGORY_EMOJI[it.cat]} {it.name.split(' (')[0]} <b style={{ color: 'var(--text)' }}>{it.qty}</b>
            </span>
          ))}
          {pending.length > 7 ? ` · y ${pending.length - 7} más` : ''}
        </p>
      )}
      <div className="tile-foot" style={{ justifyContent: 'flex-start' }}>
        <Link href="/dieta?tab=compra" className="btn sm primary">
          <Icon name="cart" size={15} /> Ver lista y marcar
        </Link>
        {pending.length > 0 && (
          <button className="btn sm" onClick={copy}>
            Copiar
          </button>
        )}
      </div>
      <p className="tiny faint">Proteína y creatina: online (HSN, MyProtein…), mucho más baratas.</p>
    </div>
  );
}

function TipTile({ iso }) {
  const idx = useMemo(() => {
    let h = 0;
    for (const ch of iso) h = (h * 31 + ch.charCodeAt(0)) % 9973;
    return h % TIPS.length;
  }, [iso]);
  return (
    <div className="tile w2" style={{ minHeight: 0 }}>
      <span className="tile-label" style={{ color: 'var(--lime)' }}>
        <Icon name="sparkle" size={14} /> Tip del día
      </span>
      <p style={{ fontSize: 15.5 }}>{TIPS[idx]}</p>
    </div>
  );
}

function LinkTile({ href, icon, color, label, title }) {
  return (
    <Link href={href} className={`tile accent-${color}`} style={{ minHeight: 120 }}>
      <span className="tile-label" style={{ color: `var(--${color})` }}>
        <Icon name={icon} size={14} /> {label}
      </span>
      <div className="tile-title" style={{ fontSize: 16, marginTop: 'auto' }}>{title}</div>
    </Link>
  );
}
