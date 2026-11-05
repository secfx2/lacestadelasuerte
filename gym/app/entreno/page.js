'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import ExerciseDetail from '../../components/ExerciseDetail';
import { Check, PageSkeleton, Ring, Sheet, useToast } from '../../components/ui';
import { useAppState, useHydrated, updateDay, getState } from '../../lib/store';
import { dayContext, planItems, setProgress, lastPerformance, overloadHint, fmtKg, sessionVolume, personalRecords, e1rm } from '../../lib/coach';
import { WORKOUTS, WORKOUT_BY_KEY, WARMUP, cardioForDay, DOUBLE_SESSION } from '../../lib/program';
import { getExercise } from '../../lib/exercises';
import { DAY_SHORT, fmtClock, fmtRest, todayISO, prettyDate } from '../../lib/dates';
import DateNav, { useViewDate, relLabel } from '../../components/DateNav';
import { beep, unlockAudio } from '../../lib/sound';

const MOBILITY = [
  '2 min gato-camello en cuadrupedia (despacio, respirando).',
  '1 min estiramiento de dorsal agarrado a un marco de puerta, cadera hacia atrás.',
  '1 min por lado estiramiento de pectoral en el marco de la puerta.',
  '10 dislocaciones de hombro con toalla o banda (brazos rectos por encima de la cabeza).',
  '1 min por lado estiramiento de flexor de cadera (rodilla en el suelo, glúteo apretado).',
  '2 × 10 chin tucks (barbilla atrás 3 s) para la postura y la mandíbula.',
];

export default function EntrenoPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Entreno />
    </Suspense>
  );
}

function Entreno() {
  const hydrated = useHydrated();
  const s = useAppState();
  const params = useSearchParams();
  const router = useRouter();
  const [toast, showToast] = useToast();
  const [open, setOpen] = useState(null); // índice expandido
  const [tech, setTech] = useState(null); // id para la hoja de técnica
  const [timer, setTimer] = useState(null); // { endAt, total, label }
  const [summary, setSummary] = useState(null);
  useWakeLock(hydrated);

  const viewIso = useViewDate();
  const isToday = viewIso === todayISO();
  const ctx = useMemo(() => (hydrated ? dayContext(s, new Date(), viewIso) : null), [hydrated, s, viewIso]);
  const viewKey = params.get('d');
  const workout = ctx ? (viewKey && WORKOUT_BY_KEY[viewKey]) || ctx.workout : null;
  const items = useMemo(() => (ctx && workout ? planItems(workout, ctx.phase) : []), [ctx, workout]);
  const iso = ctx?.iso;
  const day = (iso && s.days[iso]) || {};
  const isOther = ctx && workout && workout.key !== ctx.workout.key;

  // abre automáticamente el primer ejercicio sin terminar
  useEffect(() => {
    if (!ctx) return;
    const idx = items.findIndex((it) => (day.sets?.[it.id] || []).filter((x) => x?.done).length < it.sets);
    setOpen(idx === -1 ? null : idx);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.iso, workout?.key, hydrated]);

  const startRest = useCallback((sec, label) => {
    unlockAudio();
    setTimer({ endAt: Date.now() + sec * 1000, total: sec, label });
  }, []);

  if (!hydrated || !ctx) return <PageSkeleton />;
  if (!s.profile.startDate) {
    return (
      <div className="card center stack" style={{ marginTop: 40 }}>
        <p>Primero configura tu plan.</p>
        <Link href="/" className="btn primary">Ir al inicio</Link>
      </div>
    );
  }

  const prog = setProgress(s, iso, items);
  const cardio = cardioForDay(workout, ctx.phase);
  const mins = Math.round(8 + items.reduce((a, it) => a + it.sets * (0.75 + it.rest / 60), 0) + cardio.minutes);

  const ensureOverride = (d) => {
    if (isOther) d.workoutKey = workout.key;
  };

  const finish = () => {
    const before = personalRecords({ days: Object.fromEntries(Object.entries(getState().days).filter(([k]) => k !== iso)) });
    updateDay(iso, (d) => {
      d.done = true;
      d.finishedAt = Date.now();
      ensureOverride(d);
    });
    const dd = getState().days[iso] || {};
    const vol = sessionVolume(dd);
    const prs = [];
    for (const [exId, arr] of Object.entries(dd.sets || {})) {
      const best = Math.max(0, ...arr.filter((x) => x?.done).map((x) => e1rm(x.kg, x.reps)));
      if (best > 0 && (!before[exId] || best > before[exId].est + 0.01)) prs.push(exId);
    }
    const dur = dd.startedAt ? Math.round((Date.now() - dd.startedAt) / 60000) : null;
    setTimer(null);
    setSummary({ ...vol, prs, dur });
  };

  return (
    <>
      {toast}
      <header className="page-head" style={{ marginBottom: 12 }}>
        <div className="grow">
          <div className="eyebrow">
            Semana {ctx.week} · {ctx.phase.name}
          </div>
          <h1>
            {workout.emoji} {workout.name}
          </h1>
          <p className="sub">{workout.subtitle}</p>
        </div>
        {!workout.rest && <Ring pct={prog.pct} size={66} label={day.done && !isOther ? '✓' : `${prog.done}/${prog.total}`} />}
      </header>

      <DateNav iso={iso} />
      {!isToday && (
        <div className="hint warn" style={{ marginBottom: 12 }}>
          <Icon name="calendar" size={18} />
          <span>
            Estás en <b>{relLabel(iso).toLowerCase()}</b> ({prettyDate(iso).toLowerCase()}). Las series que marques se guardan en ese día.
          </span>
        </div>
      )}
      <div className="chips" style={{ marginBottom: 14 }}>
        {WORKOUTS.map((w, i) => (
          <button
            key={w.key}
            className={`chip${w.key === workout.key ? ' on' : ''}${i === ctx.dayIdx ? ' today' : ''}`}
            onClick={() => {
              setOpen(null);
              const q = new URLSearchParams();
              if (!isToday) q.set('fecha', iso);
              if (w.key !== ctx.workout.key) q.set('d', w.key);
              const qs = q.toString();
              router.replace(qs ? `/entreno?${qs}` : '/entreno', { scroll: false });
            }}
          >
            {DAY_SHORT[i]} · {w.emoji} {w.name}
          </button>
        ))}
      </div>

      {isOther && (
        <div className="hint warn" style={{ marginBottom: 12 }}>
          <Icon name="swap" size={18} />
          <span>
            {isToday ? 'Hoy' : 'Ese día'} tocaba <b>{ctx.workout.name}</b>. Si registras series aquí, {isToday ? 'hoy' : 'ese día'} contará como <b>{workout.name}</b> (útil si te saltaste un día).
          </span>
        </div>
      )}

      {workout.rest ? (
        <RestDay ctx={ctx} day={day} iso={iso} />
      ) : (
        <>
          <div className="row wrap" style={{ gap: 6, marginBottom: 12 }}>
            <span className="pill">~{mins} min</span>
            <span className="pill lime">RIR {ctx.phase.rir}</span>
            <span className="pill">{items.reduce((a, it) => a + it.sets, 0)} series</span>
          </div>
          <div className="hint" style={{ marginBottom: 14 }}>
            <Icon name="info" size={18} />
            <span>
              <b>{ctx.phase.name}:</b> {ctx.phase.note} <span className="muted">RIR = repeticiones que te quedan en recámara.</span>
            </span>
          </div>

          <WarmupCard day={day} iso={iso} />

          <div className="section-title" style={{ marginTop: 22 }}>Ejercicios</div>
          <div className="stack">
            {items.map((it, idx) => (
              <ExerciseCard
                key={it.id + idx}
                idx={idx}
                item={it}
                s={s}
                iso={iso}
                open={open === idx}
                onToggle={() => setOpen(open === idx ? null : idx)}
                onTech={() => setTech(it.id)}
                onSetDone={(isLast) => {
                  if (isLast) {
                    showToast('Ejercicio completado 💪');
                    const nextIdx = items.findIndex((x, j) => j > idx && (getState().days[iso]?.sets?.[x.id] || []).filter((y) => y?.done).length < x.sets);
                    setOpen(nextIdx === -1 ? null : nextIdx);
                  }
                  startRest(it.rest, getExercise(it.id)?.name);
                }}
                ensureOverride={ensureOverride}
              />
            ))}
          </div>

          <div className="section-title" style={{ marginTop: 22 }}>Cardio</div>
          <div className="card">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="grow">
                <h3>{cardio.title}</h3>
                <p className="small muted" style={{ marginTop: 4 }}>{cardio.detail}</p>
                {cardio.exerciseId && (
                  <button className="btn xs" style={{ marginTop: 10 }} onClick={() => setTech(cardio.exerciseId)}>
                    <Icon name="info" size={13} /> Cómo hacerlo
                  </button>
                )}
              </div>
              <Check on={day.cardio} onClick={() => updateDay(iso, (d) => (d.cardio = !d.cardio))} label="Cardio hecho" />
            </div>
            <hr className="divider" />
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="grow">
                <div style={{ fontWeight: 600 }}>{DOUBLE_SESSION.title}</div>
                <p className="small muted" style={{ marginTop: 4 }}>{DOUBLE_SESSION.text}</p>
              </div>
              <Check on={day.cardioAm} onClick={() => updateDay(iso, (d) => (d.cardioAm = !d.cardioAm))} label="Sesión de mañana hecha" />
            </div>
          </div>

          <button className="btn primary block" style={{ marginTop: 18, height: 54, fontSize: 16 }} onClick={finish} disabled={prog.done === 0}>
            <Icon name="check" size={18} stroke={2.4} /> {day.done && !isOther ? 'Actualizar resumen' : 'Terminar entreno'}
          </button>
          <p className="tiny faint center" style={{ marginTop: 8 }}>Los datos se guardan solos según marcas cada serie.</p>
        </>
      )}

      {timer && <RestTimer timer={timer} onClose={() => setTimer(null)} onAdd={(n) => setTimer((t) => ({ ...t, endAt: t.endAt + n * 1000, total: t.total + n }))} />}

      <Sheet open={!!tech} onClose={() => setTech(null)} title={tech ? getExercise(tech)?.name : ''}>
        {tech && <ExerciseDetail id={tech} compact />}
      </Sheet>

      <Sheet open={!!summary} onClose={() => setSummary(null)} title="Entreno completado">
        {summary && (
          <div className="stack center" style={{ gap: 14, paddingBottom: 10 }}>
            <div className="confetti">🏆</div>
            <div className="grid-3">
              <div className="card soft">
                <div className="tile-big num" style={{ fontSize: 26 }}>{summary.sets}</div>
                <div className="tiny muted">series</div>
              </div>
              <div className="card soft">
                <div className="tile-big num" style={{ fontSize: 26 }}>{summary.vol.toLocaleString('es-ES')}</div>
                <div className="tiny muted">kg movidos</div>
              </div>
              <div className="card soft">
                <div className="tile-big num" style={{ fontSize: 26 }}>{summary.dur ?? '—'}</div>
                <div className="tiny muted">minutos</div>
              </div>
            </div>
            {summary.prs.length > 0 && (
              <div className="hint up" style={{ textAlign: 'left' }}>
                <Icon name="bolt" size={18} />
                <span>
                  <b>¡Récords hoy!</b> {summary.prs.map((id) => getExercise(id)?.name).join(', ')}
                </span>
              </div>
            )}
            <p className="muted small">Ahora: comida post-entreno con proteína y a dormir 8 h. Así se construye el físico.</p>
            <Link href="/" className="btn primary block">Volver a Hoy</Link>
          </div>
        )}
      </Sheet>
    </>
  );
}

/* ───────── Ejercicio con series ───────── */

function ExerciseCard({ idx, item, s, iso, open, onToggle, onTech, onSetDone, ensureOverride }) {
  const ex = getExercise(item.id);
  const sets = s.days[iso]?.sets?.[item.id] || [];
  const doneCount = sets.filter((x) => x?.done).length;
  const complete = doneCount >= item.sets;
  const last = useMemo(() => lastPerformance(s, item.id, iso), [s, item.id, iso]);
  const hint = overloadHint(last, item);

  const setField = (i, field, value) =>
    updateDay(iso, (d) => {
      d.sets = d.sets || {};
      const arr = [...(d.sets[item.id] || [])];
      arr[i] = { ...(arr[i] || {}), [field]: value };
      d.sets[item.id] = arr;
      ensureOverride(d);
    });

  const placeholder = (i) => {
    const prev = sets[i - 1];
    const lastSet = last?.sets?.[i] || last?.sets?.[last.sets.length - 1];
    const kg = prev?.kg || (hint?.type === 'up' ? hint.kg : lastSet?.kg) || '';
    const reps = lastSet?.reps || item.hi;
    return { kg: kg === '' ? '' : String(kg), reps: String(reps) };
  };

  const toggleDone = (i) => {
    const cur = sets[i] || {};
    const wasDone = !!cur.done;
    const ph = placeholder(i);
    updateDay(iso, (d) => {
      d.sets = d.sets || {};
      const arr = [...(d.sets[item.id] || [])];
      arr[i] = {
        ...(arr[i] || {}),
        kg: arr[i]?.kg ?? ph.kg,
        reps: arr[i]?.reps ?? ph.reps,
        done: !wasDone,
      };
      d.sets[item.id] = arr;
      if (!d.startedAt) d.startedAt = Date.now();
      ensureOverride(d);
    });
    if (!wasDone) {
      if (navigator.vibrate) navigator.vibrate(30);
      const nowDone = doneCount + 1;
      onSetDone(nowDone >= item.sets);
    }
  };

  return (
    <div className={`ex-card${complete ? ' complete' : ''}`}>
      <button className="ex-head" onClick={onToggle} aria-expanded={open}>
        <span className="idx">{complete ? '✓' : idx + 1}</span>
        <img src={`/ex/${item.id}-1.webp`} alt="" className="thumb" loading="lazy" style={{ background: '#fff', objectFit: 'cover' }} />
        <div className="grow">
          <div style={{ fontWeight: 650, lineHeight: 1.25 }}>{ex?.name}</div>
          <div className="small muted" style={{ marginTop: 3 }}>
            {item.sets} × {item.lo}-{item.hi} · descanso {fmtRest(item.rest)}
          </div>
          <div className="bar thin" style={{ marginTop: 7, maxWidth: 160 }}>
            <i style={{ width: `${(doneCount / item.sets) * 100}%` }} />
          </div>
        </div>
        <Icon name="chevron" size={18} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', color: 'var(--muted)' }} />
      </button>

      {open && (
        <div className="ex-body">
          {item.note && (
            <div className="hint" style={{ marginBottom: 8 }}>
              <Icon name="bolt" size={16} />
              <span>{item.note}</span>
            </div>
          )}
          {hint ? (
            <div className={`hint ${hint.type === 'up' ? 'up' : ''}`} style={{ marginBottom: 8 }}>
              <Icon name={hint.type === 'up' ? 'bolt' : 'info'} size={16} />
              <span>
                <span className="muted">Última vez:</span> {last.sets.map((x) => `${fmtKg(x.kg || 0)}×${x.reps || 0}`).join(' · ')}
                <br />
                <b>{hint.text}</b>
              </span>
            </div>
          ) : (
            <div className="hint" style={{ marginBottom: 8 }}>
              <Icon name="info" size={16} />
              <span>Primera vez: elige un peso con el que llegues a {item.hi} reps dejando 2-3 en recámara. Apunta lo que hagas.</span>
            </div>
          )}
          <div className="set-row head">
            <span className="center">#</span>
            <span>kg</span>
            <span>reps ({item.lo}-{item.hi})</span>
            <span />
          </div>
          {Array.from({ length: item.sets }).map((_, i) => {
            const v = sets[i] || {};
            const ph = placeholder(i);
            return (
              <div key={i} className={`set-row${v.done ? ' done' : ''}`}>
                <span className="n">{i + 1}</span>
                <input
                  className="input sm num"
                  inputMode="decimal"
                  placeholder={ph.kg || 'kg'}
                  value={v.kg ?? ''}
                  onChange={(e) => setField(i, 'kg', e.target.value.replace(',', '.'))}
                  aria-label={`Serie ${i + 1} kilos`}
                />
                <input
                  className="input sm num"
                  inputMode="numeric"
                  placeholder={ph.reps}
                  value={v.reps ?? ''}
                  onChange={(e) => setField(i, 'reps', e.target.value.replace(/\D/g, ''))}
                  aria-label={`Serie ${i + 1} repeticiones`}
                />
                <Check on={v.done} onClick={() => toggleDone(i)} label={`Serie ${i + 1} hecha`} />
              </div>
            );
          })}
          <div className="row" style={{ marginTop: 10, justifyContent: 'space-between' }}>
            <button className="btn sm" onClick={onTech}>
              <Icon name="cube" size={15} /> Técnica · 3D
            </button>
            <Link href={`/ejercicio/${item.id}`} className="small muted">
              Ficha completa ›
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function WarmupCard({ day, iso }) {
  const done = day.warmup || [];
  const all = WARMUP.every((_, i) => done[i]);
  const [open, setOpen] = useState(!all);
  return (
    <div className="card" style={{ padding: 0 }}>
      <button className="ex-head" onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{ padding: 14 }}>
        <span className="idx" style={all ? { background: 'var(--lime)', color: 'var(--lime-ink)' } : undefined}>{all ? '✓' : '0'}</span>
        <div className="grow">
          <div style={{ fontWeight: 650 }}>Calentamiento · 8 min</div>
          <div className="small muted">No te lo saltes: más fuerza y cero lesiones.</div>
        </div>
        <Icon name="chevron" size={18} style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .2s', color: 'var(--muted)' }} />
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px' }} className="stack">
          {WARMUP.map((t, i) => (
            <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
              <Check
                on={done[i]}
                round
                onClick={() =>
                  updateDay(iso, (d) => {
                    const w = [...(d.warmup || [])];
                    w[i] = !w[i];
                    d.warmup = w;
                  })
                }
              />
              <span className="small" style={{ paddingTop: 5 }}>{t}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RestDay({ ctx, day, iso }) {
  const mob = day.mobility || [];
  return (
    <div className="stack">
      <div className="card">
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <div className="grow">
            <h3>{ctx.cardio.title}</h3>
            <p className="small muted" style={{ marginTop: 4 }}>{ctx.cardio.detail}</p>
          </div>
          <Check on={day.cardio} onClick={() => updateDay(iso, (d) => (d.cardio = !d.cardio))} label="Paseo hecho" />
        </div>
      </div>
      <div className="card">
        <h3>Movilidad · 10 min</h3>
        <p className="small muted" style={{ margin: '4px 0 12px' }}>Hombros sanos = más rango en laterales y presses.</p>
        <div className="stack">
          {MOBILITY.map((t, i) => (
            <div key={i} className="row" style={{ alignItems: 'flex-start' }}>
              <Check
                on={mob[i]}
                round
                onClick={() =>
                  updateDay(iso, (d) => {
                    const w = [...(d.mobility || [])];
                    w[i] = !w[i];
                    d.mobility = w;
                  })
                }
              />
              <span className="small" style={{ paddingTop: 5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="hint up">
        <Icon name="sparkle" size={18} />
        <span>Domingo = día ideal para meal prep: cocina el curry o la boloñesa para lunes-miércoles y haz la compra con la lista.</span>
      </div>
      <p className="small muted center">¿Te saltaste un entreno esta semana? Elige el día arriba y hazlo hoy.</p>
    </div>
  );
}

/* ───────── Temporizador de descanso ───────── */

function RestTimer({ timer, onClose, onAdd }) {
  const [left, setLeft] = useState(() => (timer.endAt - Date.now()) / 1000);
  const fired = useRef(false);
  useEffect(() => {
    fired.current = false;
  }, [timer.endAt]);
  useEffect(() => {
    const id = setInterval(() => {
      const l = (timer.endAt - Date.now()) / 1000;
      setLeft(l);
      if (l <= 0 && !fired.current) {
        fired.current = true;
        beep();
      }
      if (l < -20) onClose();
    }, 250);
    return () => clearInterval(id);
  }, [timer.endAt, onClose]);
  const over = left <= 0;
  return (
    <div className={`rest-timer${over ? ' over' : ''}`} role="timer" aria-live="polite">
      <Icon name="timer" size={22} />
      <div className="grow">
        <div className="tiny" style={{ fontWeight: 700, opacity: 0.75 }}>{over ? '¡A por la siguiente serie!' : 'Descanso'}</div>
        <div className="t">{over ? '0:00' : fmtClock(left)}</div>
      </div>
      {!over && (
        <button className="btn sm" onClick={() => onAdd(15)}>
          +15 s
        </button>
      )}
      <button className="btn sm" onClick={onClose}>
        {over ? 'Vale' : 'Saltar'}
      </button>
    </div>
  );
}

// Mantiene la pantalla encendida mientras entrenas (si el navegador lo permite)
function useWakeLock(active) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return;
    let lock = null;
    const req = async () => {
      try {
        lock = await navigator.wakeLock.request('screen');
      } catch {
        /* denegado */
      }
    };
    const onVis = () => document.visibilityState === 'visible' && req();
    req();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      lock?.release?.().catch(() => {});
    };
  }, [active]);
}
