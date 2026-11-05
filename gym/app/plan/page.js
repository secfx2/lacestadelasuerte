'use client';

import Link from 'next/link';
import Icon from '../../components/Icon';
import { PageSkeleton, useHashScroll } from '../../components/ui';
import { useAppState, useHydrated } from '../../lib/store';
import { dayContext, projection, weeksToGoal, fmtKg } from '../../lib/coach';
import { WORKOUTS, PHASES, SUPPLEMENTS, NO_SUPPLEMENTS, JAWLINE, LOVE_HANDLES, RULES, DOUBLE_SESSION } from '../../lib/program';
import { getExercise } from '../../lib/exercises';
import { DAY_NAMES, addDays, mondayOf, shortDate } from '../../lib/dates';

const MILESTONES = [
  {
    week: 2,
    title: 'Semanas 1-2 · El arranque',
    text: 'Bajas rápido (agua, glucógeno y menos hinchazón). La fuerza sube cada sesión porque tu sistema nervioso aprende los movimientos. Ojo: la creatina mete 1-2 kg de agua en el músculo y puede tapar parte de la bajada. Es buena señal.',
  },
  {
    week: 4,
    title: 'Semana 4 · Lo notas tú',
    text: 'Ropa más suelta y cara algo más fina. Con el pump los hombros ya se ven más redondos. Cintura −3/−4 cm.',
  },
  {
    week: 8,
    title: 'Semana 8 · Lo notan los demás',
    text: 'Cambio claro en fotos: deltoides separados del brazo, espalda más ancha, cintura −6/−8 cm. Empieza a asomar la línea de la mandíbula.',
  },
  {
    week: 12,
    title: 'Semana 12 · V-taper en camiseta',
    text: 'Forma de V clara con ropa. Venas en hombros y antebrazos con el pump. Abdomen superior se intuye con buena luz. Mandíbula bastante más marcada y los michelines ya claramente más pequeños.',
  },
  {
    week: 18,
    title: 'Semanas 16-20 · Aesthetic',
    text: '~12-14% de grasa: abdomen visible, mandíbula marcada, hombros "3D" y los costados limpios (los michelines son lo último en irse). Musculado y definido, nada de "gigante". Este es el objetivo.',
  },
  {
    week: 24,
    title: 'Mes 6+ · Seguir construyendo',
    text: 'Pasas a mantenimiento y luego a un superávit pequeño para seguir ganando músculo sin perder la definición. Un primer año bien hecho son +4-6 kg de músculo si empiezas casi de cero.',
  },
];

export default function PlanPage() {
  const hydrated = useHydrated();
  const s = useAppState();
  useHashScroll(hydrated);
  if (!hydrated) return <PageSkeleton />;
  const ctx = dayContext(s);
  const { startKg, goalKg, startDate } = s.profile;
  const proj = projection(startKg, goalKg, 30);
  const wk = weeksToGoal(startKg, goalKg);
  const monday = mondayOf(startDate || ctx.iso);

  return (
    <>
      <header className="page-head">
        <div>
          <div className="eyebrow">Tu plan · {fmtKg(startKg)} → {fmtKg(goalKg)} kg</div>
          <h1>El plan</h1>
          <p className="sub">Cómo funciona, qué esperar y cuándo.</p>
        </div>
        <Link href="/ajustes" className="icon-btn" aria-label="Ajustes">
          <Icon name="settings" size={19} />
        </Link>
      </header>

      <nav className="chips" style={{ marginBottom: 16 }}>
        {[
          ['#expectativas', 'Expectativas'],
          ['#como', 'Cómo funciona'],
          ['#semana', 'Semana tipo'],
          ['#fases', 'Fases'],
          ['#suplementos', 'Suplementos'],
          ['#michelines', 'Michelines'],
          ['#mandibula', 'Mandíbula'],
          ['#reglas', 'Reglas'],
        ].map(([h, l]) => (
          <a key={h} href={h} className="chip">
            {l}
          </a>
        ))}
      </nav>

      {/* ───── Expectativas ───── */}
      <section id="expectativas" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="card accent-lime" style={{ background: 'linear-gradient(150deg,#1d2410 0%,var(--card) 60%)' }}>
          <div className="tile-label" style={{ color: 'var(--lime)' }}>
            <Icon name="target" size={14} /> Respuesta corta
          </div>
          <h2 style={{ fontSize: 26, marginTop: 8 }}>
            ~{wk ?? 20} semanas para el look aesthetic (≈ {Math.round((wk ?? 20) / 4.3)}-{Math.round((wk ?? 20) / 4.3) + 1} meses)
          </h2>
          <p className="muted" style={{ marginTop: 8 }}>
            Con 1,74 m y ~95 kg, lo que te separa de verte ancho y definido es sobre todo grasa: unos 12-15 kg. El ritmo máximo sin perder músculo es ~0,7-1% del peso por semana.
            Cambios visibles en 6-8 semanas, V-taper clara en ~12, definición completa en 4-6 meses.
            <b style={{ color: 'var(--text)' }}> Ir más veces al gym no lo acelera: lo aceleran el déficit, los pasos, el sueño y la constancia.</b>
          </p>
        </div>

        <div className="timeline" style={{ marginTop: 16 }}>
          {MILESTONES.map((m) => {
            const p = proj[Math.min(m.week, proj.length - 1)];
            const state = ctx.week > m.week ? 'past' : ctx.week >= m.week - 3 && ctx.week <= m.week ? 'on' : '';
            return (
              <div key={m.week} className={`tl-item ${state}`}>
                <div className="card">
                  <div className="spread">
                    <h3 style={{ fontSize: 17 }}>{m.title}</h3>
                    <span className="pill violet num">~{fmtKg(Math.round(p.kg * 2) / 2)} kg</span>
                  </div>
                  <p className="small muted" style={{ marginTop: 6 }}>{m.text}</p>
                  <p className="tiny faint" style={{ marginTop: 6 }}>≈ {shortDate(addDays(monday, m.week * 7))}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="tiny faint" style={{ marginTop: 10 }}>
          Estimación con −0,75% del peso/semana. Depende de tu % de grasa real, tu genética, si ya entrenabas y sobre todo de la constancia. Si eres principiante ganarás músculo
          mientras bajas grasa (recomposición); si ya llevabas años entrenando, irá algo más lento.
        </p>
      </section>

      {/* ───── Cómo funciona ───── */}
      <section id="como" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Cómo funciona</div>
        <div className="grid-auto stack">
          {[
            ['🔥', 'Déficit de ~700 kcal/día', '~2.300 kcal los días de entreno y ~2.100 el domingo. Tu gasto estimado es ~3.000 kcal con este nivel de actividad. Así bajas ~0,7-0,9 kg/semana.'],
            ['🥩', '~190-210 g de proteína', 'Lo que protege (y construye) músculo en déficit. Va repartida en 5 comidas.'],
            ['🏋️', '6 días con especialización', 'Deltoide lateral 4 veces/semana (es lo que te hace ancho), espalda 2-3, brazos 3. Pierna 2 días con glúteo extra (hip thrust y abducción) para rellenar la zona de los michelines.'],
            ['🚶', 'Cardio suave + pasos', '20-40 min de cinta inclinada o bici tras las pesas y 8-12k pasos. Quema grasa sin robar recuperación.'],
            ['😴', 'Dormir 7,5-9 h', 'Con poco sueño pierdes más músculo y menos grasa con la misma dieta. No es negociable.'],
            ['📈', 'Ajuste automático', 'La app mira tu media semanal de peso y te dice si subir o bajar calorías.'],
          ].map(([e, t, d]) => (
            <div key={t} className="card">
              <div className="row" style={{ alignItems: 'flex-start' }}>
                <span style={{ fontSize: 26 }}>{e}</span>
                <div>
                  <h3 style={{ fontSize: 16 }}>{t}</h3>
                  <p className="small muted" style={{ marginTop: 4 }}>{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hint" style={{ marginTop: 12 }}>
          <Icon name="bolt" size={18} />
          <span>
            <b>{DOUBLE_SESSION.title}.</b> {DOUBLE_SESSION.text}
          </span>
        </div>
      </section>

      {/* ───── Semana tipo ───── */}
      <section id="semana" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Semana tipo (Fitness Park)</div>
        <div className="stack">
          {WORKOUTS.map((w, i) => (
            <details key={w.key} className="card" open={i === ctx.dayIdx}>
              <summary className="row" style={{ cursor: 'pointer', listStyle: 'none' }}>
                <span style={{ fontSize: 26 }}>{w.emoji}</span>
                <div className="grow">
                  <div className="tiny muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{DAY_NAMES[i]}</div>
                  <div style={{ fontWeight: 650 }}>
                    {w.name} <span className="muted" style={{ fontWeight: 500 }}>· {w.subtitle}</span>
                  </div>
                </div>
                <Icon name="chevron" size={18} className="muted" />
              </summary>
              <p className="small muted" style={{ margin: '10px 0' }}>{w.focus}</p>
              {w.items.length > 0 ? (
                <div className="list">
                  {w.items.map(([id, sets, lo, hi]) => (
                    <Link key={id} href={`/ejercicio/${id}`} className="list-item" style={{ padding: '8px 0' }}>
                      <img src={`/ex/${id}-1.webp`} alt="" className="thumb" loading="lazy" style={{ width: 44, height: 44, borderRadius: 10, background: '#fff' }} />
                      <span className="grow small">{getExercise(id)?.name}</span>
                      <span className="num small muted">
                        {sets}×{lo}-{hi}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="small">Paseo 45-60 min + 10 min de movilidad. Meal prep y compra.</p>
              )}
              {w.items.length > 0 && (
                <Link href={i === ctx.dayIdx ? '/entreno' : `/entreno?d=${w.key}`} className="btn sm" style={{ marginTop: 10 }}>
                  Abrir entreno
                </Link>
              )}
            </details>
          ))}
        </div>
      </section>

      {/* ───── Fases ───── */}
      <section id="fases" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Fases del plan</div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Semanas</th>
                <th>Fase</th>
                <th>RIR</th>
                <th>Cardio</th>
              </tr>
            </thead>
            <tbody>
              {PHASES.map((p) => {
                const on = p.key === ctx.phase.key;
                return (
                  <tr key={p.key} style={on ? { color: 'var(--lime)' } : undefined}>
                    <td className="num">{p.to >= 999 ? `${p.from}+` : p.from === p.to ? p.from : `${p.from}-${p.to}`}</td>
                    <td>
                      {p.name}
                      {on ? ' ← ahora' : ''}
                    </td>
                    <td className="num">{p.rir}</td>
                    <td className="num">{p.cardioMin}'</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="small muted" style={{ marginTop: 10 }}>
            <b style={{ color: 'var(--text)' }}>Ahora ({ctx.phase.name}):</b> {ctx.phase.note}
          </p>
        </div>
      </section>

      {/* ───── Suplementos ───── */}
      <section id="suplementos" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Suplementos (legales y con evidencia)</div>
        <div className="stack">
          {SUPPLEMENTS.map((x) => (
            <div key={x.key} className="card">
              <div className="spread" style={{ alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: 16 }}>
                    {x.name} {x.optional && <span className="pill">opcional</span>}
                  </h3>
                  <div className="small" style={{ marginTop: 4 }}>
                    <b style={{ color: 'var(--violet)' }}>{x.dose}</b> · <span className="muted">{x.when}</span>
                  </div>
                </div>
                <span className={`pill ${x.evidence === 'A' ? 'lime' : x.evidence === 'B' ? 'cyan' : ''}`} title="Nivel de evidencia">
                  {x.evidence}
                </span>
              </div>
              <p className="small muted" style={{ marginTop: 8 }}>{x.why}</p>
            </div>
          ))}
          <div className="card" style={{ borderColor: 'rgba(255,93,93,0.25)' }}>
            <h3 style={{ fontSize: 16, color: 'var(--red)' }}>No gastes en esto</h3>
            <ul className="ul small" style={{ marginTop: 8 }}>
              {NO_SUPPLEMENTS.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <p className="tiny faint">Presupuesto: creatina + whey + vitamina D + multi ≈ 35-45 €/mes. Si tomas medicación o tienes algún problema de salud, coméntalo con tu médico.</p>
        </div>
      </section>

      {/* ───── Michelines ───── */}
      <section id="michelines" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Michelines (costados y lumbar)</div>
        <div className="card" style={{ background: 'linear-gradient(150deg,#2a1f0e 0%,var(--card) 60%)', borderColor: 'rgba(255,181,71,0.18)' }}>
          <p>{LOVE_HANDLES.intro}</p>
        </div>
        <div className="stack" style={{ marginTop: 12 }}>
          {LOVE_HANDLES.items.map((it) => (
            <div key={it.t} className="card">
              <h3 style={{ fontSize: 16 }}>{it.t}</h3>
              <p className="small muted" style={{ marginTop: 4 }}>{it.d}</p>
            </div>
          ))}
          <div className="row wrap">
            <Link href="/ejercicio/abduccion-cadera" className="btn sm">
              <Icon name="cube" size={15} /> Abducción de cadera
            </Link>
            <Link href="/ejercicio/hip-thrust" className="btn sm">
              <Icon name="cube" size={15} /> Hip thrust
            </Link>
            <Link href="/ejercicio/vacio-abdominal" className="btn sm">
              <Icon name="cube" size={15} /> Vacío abdominal
            </Link>
          </div>
        </div>
      </section>

      {/* ───── Mandíbula ───── */}
      <section id="mandibula" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Mandíbula y cara</div>
        <div className="card accent-pink" style={{ background: 'linear-gradient(150deg,#2b1220 0%,var(--card) 60%)' }}>
          <p>{JAWLINE.intro}</p>
        </div>
        <div className="stack" style={{ marginTop: 12 }}>
          {JAWLINE.items.map((it) => (
            <div key={it.t} className="card">
              <h3 style={{ fontSize: 16 }}>{it.t}</h3>
              <p className="small muted" style={{ marginTop: 4 }}>{it.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── Reglas ───── */}
      <section id="reglas" className="section" style={{ scrollMarginTop: 16 }}>
        <div className="section-title">Reglas de oro</div>
        <div className="card">
          <ol className="stack" style={{ margin: 0, padding: 0, listStyle: 'none', gap: 10 }}>
            {RULES.map((r, i) => (
              <li key={i} className="row" style={{ alignItems: 'flex-start' }}>
                <span className="pill lime num" style={{ minWidth: 26, justifyContent: 'center' }}>{i + 1}</span>
                <span>{r}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="tiny faint" style={{ marginTop: 14 }}>
          Esto es una guía general de entrenamiento y nutrición, no consejo médico. Si tienes lesiones, hipertensión, problemas cardíacos o cualquier condición, consulta antes con un médico.
          Si notas dolor articular (no muscular), para y cambia el ejercicio.
        </p>
      </section>
    </>
  );
}
