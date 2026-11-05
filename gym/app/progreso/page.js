'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Icon from '../../components/Icon';
import { PageSkeleton, useToast } from '../../components/ui';
import { useAppState, useHydrated, update } from '../../lib/store';
import { weightStats, sortedWeights, weeklyAverages, navyBodyFat, targetWeightFor, adonis, fmtKg, personalRecords, sessionVolume, workoutForDay, projection } from '../../lib/coach';
import { getExercise } from '../../lib/exercises';
import { todayISO, shortDate, daysBetween, addDays, prettyDate } from '../../lib/dates';
import { MEASURE_HOWTO, WEIGH_HOWTO } from '../../lib/program';

export default function ProgresoPage() {
  const hydrated = useHydrated();
  const s = useAppState();
  const [toast, showToast] = useToast();
  if (!hydrated) return <PageSkeleton />;
  const st = weightStats(s);
  return (
    <>
      {toast}
      <header className="page-head">
        <div>
          <div className="eyebrow">Lo que no se mide no mejora</div>
          <h1>Progreso</h1>
        </div>
      </header>

      <div className="bento" style={{ marginBottom: 12 }}>
        <Stat label="Peso actual" value={`${fmtKg(st.current)} kg`} sub="media últimos 3 registros" />
        <Stat label="Perdido" value={`${st.lost > 0 ? '−' : ''}${fmtKg(Math.abs(st.lost))} kg`} sub={`desde ${fmtKg(st.start)} kg`} color={st.lost > 0 ? 'var(--lime)' : undefined} />
        <Stat label="Ritmo" value={st.trend != null ? `${st.trend > 0 ? '+' : ''}${fmtKg(st.trend)} kg/sem` : '—'} sub="tendencia 3 semanas" />
        <Stat label="Objetivo" value={`${fmtKg(st.goal)} kg`} sub={st.etaWeeks ? `~${Math.ceil(st.etaWeeks)} semanas` : 'faltan datos'} />
      </div>

      <div className={`hint ${st.coach.level}`} style={{ marginBottom: 12 }}>
        <Icon name={st.coach.level === 'ok' ? 'check' : st.coach.level === 'info' ? 'info' : 'bolt'} size={18} />
        <span>
          <b>{st.coach.title}.</b> {st.coach.text}
        </span>
      </div>

      <WeightCard s={s} showToast={showToast} />
      <MeasuresCard s={s} showToast={showToast} />
      <HistoryCard s={s} />
    </>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div className="tile" style={{ minHeight: 0 }}>
      <span className="tile-label">{label}</span>
      <div className="tile-big num" style={{ fontSize: 24, color }}>{value}</div>
      <span className="tiny muted">{sub}</span>
    </div>
  );
}

function WeightCard({ s, showToast }) {
  const [date, setDate] = useState(todayISO());
  const [kg, setKg] = useState('');
  const ws = sortedWeights(s);
  const save = () => {
    const v = parseFloat(String(kg).replace(',', '.'));
    if (!v || v < 30 || v > 300) return showToast('Pon un peso válido');
    update((d) => {
      d.weights = d.weights.filter((w) => w.date !== date).concat({ date, kg: v });
    });
    setKg('');
    showToast('Peso guardado ⚖️');
  };
  const del = (dt) => update((d) => (d.weights = d.weights.filter((w) => w.date !== dt)));
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="spread">
        <h3>Peso</h3>
        <span className="tiny muted">L · X · V en ayunas</span>
      </div>
      <WeightChart s={s} />
      <div className="row" style={{ marginTop: 12 }}>
        <input className="input sm" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 160 }} aria-label="Fecha" />
        <input className="input sm grow" inputMode="decimal" placeholder="kg" value={kg} onChange={(e) => setKg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} aria-label="Peso" />
        <button className="btn primary sm" onClick={save}>
          Guardar
        </button>
      </div>
      <p className="tiny faint" style={{ marginTop: 8 }}>{WEIGH_HOWTO}</p>
      {ws.length > 0 && (
        <details style={{ marginTop: 10 }}>
          <summary className="small muted" style={{ cursor: 'pointer' }}>
            Historial ({ws.length})
          </summary>
          <div className="list" style={{ marginTop: 6 }}>
            {[...ws].reverse().map((w) => (
              <div key={w.date} className="list-item" style={{ padding: '8px 0' }}>
                <span className="grow small">{prettyDate(w.date)}</span>
                <span className="num">{fmtKg(w.kg)} kg</span>
                <button className="icon-btn sm" onClick={() => del(w.date)} aria-label="Borrar">
                  <Icon name="x" size={14} />
                </button>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function WeightChart({ s }) {
  const ws = sortedWeights(s);
  const avgs = weeklyAverages(s);
  const start = s.profile.startDate || (ws[0] && ws[0].date) || todayISO();
  const goal = Number(s.profile.goalKg);
  const proj = projection(s.profile.startKg, goal, 24);
  const W = 420;
  const H = 240;
  const pad = { l: 30, r: 8, t: 24, b: 22 };
  const lastDay = Math.max(7 * 12, ...ws.map((w) => daysBetween(start, w.date) + 7));
  const projPts = proj.filter((p) => p.week * 7 <= lastDay).map((p) => [p.week * 7, p.kg]);
  const allKg = [...ws.map((w) => Number(w.kg)), ...projPts.map((p) => p[1]), goal];
  const minK = Math.floor(Math.min(...allKg) - 1);
  const maxK = Math.ceil(Math.max(...allKg) + 1);
  const x = (d) => pad.l + (d / lastDay) * (W - pad.l - pad.r);
  const y = (k) => pad.t + (1 - (k - minK) / (maxK - minK)) * (H - pad.t - pad.b);
  const avgPts = avgs.map((a) => [daysBetween(start, a.week) + 3, a.avg]).filter((p) => p[0] >= 0);
  const line = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  const ticks = [];
  for (let k = minK; k <= maxK; k += Math.max(1, Math.round((maxK - minK) / 4))) ticks.push(k);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" style={{ marginTop: 8 }} role="img" aria-label="Gráfica de peso">
      {ticks.map((k) => (
        <g key={k}>
          <line x1={pad.l} x2={W - pad.r} y1={y(k)} y2={y(k)} stroke="rgba(255,255,255,0.06)" />
          <text x={pad.l - 6} y={y(k) + 4} fontSize="12" textAnchor="end" fill="var(--faint)">
            {k}
          </text>
        </g>
      ))}
      {[0, 4, 8, 12, 16, 20, 24].filter((wk) => wk * 7 <= lastDay).map((wk) => (
        <text key={wk} x={x(wk * 7)} y={H - 6} fontSize="12" textAnchor="middle" fill="var(--faint)">
          S{wk}
        </text>
      ))}
      <line x1={pad.l} x2={W - pad.r} y1={y(goal)} y2={y(goal)} stroke="var(--lime)" strokeDasharray="5 5" opacity="0.6" />
      <text x={W - pad.r} y={y(goal) - 6} fontSize="12" textAnchor="end" fill="var(--lime)">
        objetivo {fmtKg(goal)}
      </text>
      <path d={line(projPts)} fill="none" stroke="var(--violet)" strokeWidth="1.6" strokeDasharray="3 5" opacity="0.8" />
      {avgPts.length > 1 && <path d={line(avgPts)} fill="none" stroke="var(--cyan)" strokeWidth="2.6" strokeLinejoin="round" />}
      {ws.map((w) => (
        <circle key={w.date} cx={x(daysBetween(start, w.date))} cy={y(Number(w.kg))} r="3.2" fill="var(--text)" opacity="0.85" />
      ))}
      <g fontSize="12" fill="var(--muted)">
        <circle cx={pad.l + 6} cy={pad.t + 4} r="3" fill="var(--text)" />
        <text x={pad.l + 14} y={pad.t + 8}>pesajes</text>
        <rect x={pad.l + 70} y={pad.t + 2} width="14" height="3" fill="var(--cyan)" />
        <text x={pad.l + 90} y={pad.t + 8}>media semanal</text>
        <rect x={pad.l + 186} y={pad.t + 2} width="14" height="3" fill="var(--violet)" />
        <text x={pad.l + 206} y={pad.t + 8}>plan</text>
      </g>
    </svg>
  );
}

function MeasuresCard({ s, showToast }) {
  const last = s.measures[s.measures.length - 1] || {};
  const first = s.measures[0];
  const [f, setF] = useState({ waist: '', neck: '', shoulders: '', chest: '', arm: '' });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value.replace(',', '.') }));
  const save = () => {
    const entry = { date: todayISO() };
    for (const k of Object.keys(f)) if (f[k]) entry[k] = Number(f[k]);
    if (Object.keys(entry).length === 1) return showToast('Rellena al menos una medida');
    update((d) => {
      const prev = d.measures.find((m) => m.date === entry.date) || {};
      d.measures = d.measures.filter((m) => m.date !== entry.date).concat({ ...prev, ...entry });
      d.measures.sort((a, b) => (a.date < b.date ? -1 : 1));
    });
    setF({ waist: '', neck: '', shoulders: '', chest: '', arm: '' });
    showToast('Medidas guardadas 📏');
  };
  const curW = sortedWeights(s).slice(-1)[0]?.kg || s.profile.startKg;
  const bf = navyBodyFat(last, s.profile.heightCm);
  const tgt = bf ? targetWeightFor(bf, curW, 12) : null;
  const ad = adonis(last);
  const fields = [
    ['waist', 'Cintura (ombligo)'],
    ['neck', 'Cuello'],
    ['shoulders', 'Hombros'],
    ['chest', 'Pecho'],
    ['arm', 'Brazo contraído'],
  ];
  return (
    <div className="card" id="medidas" style={{ marginBottom: 12, scrollMarginTop: 20 }}>
      <div className="spread">
        <h3>Medidas y composición</h3>
        <span className="tiny muted">cada 2 semanas</span>
      </div>
      <div className="bento" style={{ marginTop: 12 }}>
        <div className="tile accent-amber" style={{ minHeight: 0 }}>
          <span className="tile-label" style={{ color: 'var(--amber)' }}>% grasa (Navy)</span>
          <div className="tile-big num" style={{ fontSize: 26 }}>{bf ? `${bf.toFixed(1).replace('.', ',')}%` : '—'}</div>
          <span className="tiny muted">{bf ? (bf > 20 ? 'Fase de definición' : bf > 15 ? 'Ya se nota la forma' : bf > 12 ? 'Casi aesthetic' : 'Aesthetic ✓') : 'Mete cintura + cuello'}</span>
        </div>
        <div className="tile accent-lime" style={{ minHeight: 0 }}>
          <span className="tile-label" style={{ color: 'var(--lime)' }}>Hombros / cintura</span>
          <div className="tile-big num" style={{ fontSize: 26 }}>{ad ? ad.toFixed(2).replace('.', ',') : '—'}</div>
          <span className="tiny muted">Ideal "Adonis" ≈ 1,6</span>
        </div>
        <div className="tile w2" style={{ minHeight: 0 }}>
          <span className="tile-label">Peso para ~12% de grasa</span>
          <div className="tile-big num" style={{ fontSize: 26 }}>{tgt ? `${fmtKg(tgt)} kg` : '—'}</div>
          <span className="tiny muted">
            {tgt ? `Manteniendo tu músculo actual. Ajusta tu objetivo en Ajustes si difiere mucho de ${fmtKg(s.profile.goalKg)} kg.` : 'Calculado a partir de tu % de grasa estimado.'}
          </span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        {fields.map(([k, l]) => (
          <div key={k} className="field">
            <label htmlFor={`m-${k}`}>
              {l} {last[k] ? <span className="faint">· último {fmtKg(last[k])}</span> : null}
            </label>
            <input id={`m-${k}`} className="input sm" inputMode="decimal" placeholder="cm" value={f[k]} onChange={set(k)} />
          </div>
        ))}
        <div className="field" style={{ justifyContent: 'flex-end' }}>
          <button className="btn primary" onClick={save}>
            Guardar medidas
          </button>
        </div>
      </div>

      {first && last && first.date !== last.date && (
        <div className="hint ok" style={{ marginTop: 12 }}>
          <Icon name="chart" size={18} />
          <span>
            Desde el {shortDate(first.date)}:{' '}
            {fields
              .filter(([k]) => first[k] && last[k])
              .map(([k, l]) => `${l.split(' ')[0]} ${last[k] - first[k] > 0 ? '+' : ''}${fmtKg(last[k] - first[k])} cm`)
              .join(' · ')}
          </span>
        </div>
      )}

      <details style={{ marginTop: 12 }}>
        <summary className="small muted" style={{ cursor: 'pointer' }}>
          Cómo medir (y fotos)
        </summary>
        <ul className="ul small" style={{ marginTop: 8 }}>
          {MEASURE_HOWTO.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </details>
    </div>
  );
}

function HistoryCard({ s }) {
  const prs = useMemo(() => personalRecords(s), [s]);
  const sessions = Object.entries(s.days)
    .filter(([, d]) => d.done)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, 12);
  const top = Object.entries(prs)
    .sort((a, b) => b[1].est - a[1].est)
    .slice(0, 10);
  return (
    <div className="card">
      <h3>Entrenos y récords</h3>
      {sessions.length === 0 ? (
        <p className="small muted" style={{ marginTop: 8 }}>
          Aún no hay entrenos completados. <Link href="/entreno" style={{ color: 'var(--lime)' }}>Empieza hoy ›</Link>
        </p>
      ) : (
        <div className="list" style={{ marginTop: 6 }}>
          {sessions.map(([date, d]) => {
            const v = sessionVolume(d);
            const w = workoutForDay(s, date);
            return (
              <div key={date} className="list-item">
                <span style={{ fontSize: 22 }}>{w.emoji}</span>
                <div className="grow">
                  <div style={{ fontWeight: 600 }}>{w.name}</div>
                  <div className="tiny muted">{prettyDate(date)}</div>
                </div>
                <div className="num small muted" style={{ textAlign: 'right' }}>
                  {v.sets} series
                  <br />
                  {v.vol.toLocaleString('es-ES')} kg
                </div>
              </div>
            );
          })}
        </div>
      )}
      {top.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 16 }}>Mejores marcas (1RM estimado)</div>
          <table className="table">
            <tbody>
              {top.map(([id, p]) => (
                <tr key={id}>
                  <td>{getExercise(id)?.name || id}</td>
                  <td className="num muted" style={{ whiteSpace: 'nowrap' }}>
                    {fmtKg(p.kg)} × {p.reps}
                  </td>
                  <td className="num" style={{ textAlign: 'right', color: 'var(--lime)' }}>{Math.round(p.est)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
