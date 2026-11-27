'use client';

// Todos los ejercicios de una sesión en una sola página (fotos reales, cómo se hace y enlace al 3D).
// /sesion            → el entreno de hoy (o el día de ?fecha= / ?d=)
// /sesion?ids=a,b,c  → una lista concreta (p. ej. un gym distinto un día suelto)

import Link from 'next/link';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Icon from '../../components/Icon';
import { BackLink, PageSkeleton } from '../../components/ui';
import { getExercise, MUSCLE_LABELS } from '../../lib/exercises';
import { WORKOUT_BY_KEY } from '../../lib/program';
import { dayContext, planItems } from '../../lib/coach';
import { workoutWithCustom } from '../../lib/plan';
import { useAppState, useHydrated } from '../../lib/store';

export default function SesionPage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Sesion />
    </Suspense>
  );
}

function Sesion() {
  const hydrated = useHydrated();
  const s = useAppState();
  const params = useSearchParams();
  if (!hydrated) return <PageSkeleton />;

  const idsParam = params.get('ids');
  let title = 'Tu sesión';
  let items;
  if (idsParam) {
    items = idsParam
      .split(',')
      .map((id) => id.trim())
      .filter((id) => getExercise(id))
      .map((id) => ({ id }));
    title = params.get('t') || 'Tu sesión de hoy';
  } else {
    const ctx = dayContext(s, new Date(), params.get('fecha') || null);
    const key = params.get('d');
    const workout = (key && workoutWithCustom(s, WORKOUT_BY_KEY[key])) || ctx.workout;
    items = workout.rest ? [] : planItems(workout, ctx.phase);
    title = `${workout.emoji || ''} ${workout.name}`.trim();
  }

  return (
    <>
      <BackLink href="/entreno" label="Entreno" />
      <header className="page-head" style={{ marginTop: 8 }}>
        <div>
          <div className="eyebrow">{items.length} ejercicios · todo en una página</div>
          <h1>{title}</h1>
          <p className="sub">Fotos del inicio y el final, cómo se hace y los errores típicos. Toca "Ver en 3D" para la animación.</p>
        </div>
      </header>

      {items.length === 0 && <div className="card">Hoy no hay pesas: toca descanso activo.</div>}

      <div className="stack" style={{ gap: 16 }}>
        {items.map((it, i) => {
          const ex = getExercise(it.id);
          if (!ex) return null;
          return (
            <section key={it.id} className="card stack" style={{ gap: 10 }}>
              <div className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                <span className="pill lime num" style={{ minWidth: 28, justifyContent: 'center' }}>{i + 1}</span>
                <div className="grow">
                  <h3 style={{ fontSize: 17, lineHeight: 1.25 }}>{ex.name}</h3>
                  <div className="small muted" style={{ marginTop: 2 }}>
                    {it.sets ? `${it.sets} × ${it.lo}-${it.hi} · ` : ''}
                    {ex.primary.map((m) => MUSCLE_LABELS[m] || m).join(', ')}
                  </div>
                </div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                {[0, 1].map((n) => (
                  <img
                    key={n}
                    src={`/ex/${it.id}-${n}.webp`}
                    alt={n === 0 ? 'Inicio' : 'Final'}
                    loading="lazy"
                    style={{ width: '50%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: 12, background: '#fff' }}
                  />
                ))}
              </div>
              {it.note && <div className="hint">{it.note}</div>}
              <div>
                <div className="tiny muted" style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cómo se hace</div>
                <ol className="small" style={{ margin: '6px 0 0', paddingLeft: 18, display: 'grid', gap: 4 }}>
                  {ex.steps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              </div>
              {ex.mistakes?.length > 0 && (
                <div className="small muted">
                  <b style={{ color: 'var(--amber)' }}>Evita:</b> {ex.mistakes.slice(0, 2).join(' · ')}
                </div>
              )}
              <div className="row wrap" style={{ gap: 8 }}>
                <Link href={`/ejercicio/${it.id}`} className="btn sm primary">
                  <Icon name="cube" size={15} /> Ver en 3D y ficha completa
                </Link>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
