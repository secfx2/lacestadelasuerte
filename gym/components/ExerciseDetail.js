'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Icon from './Icon';
import { MUSCLE_LABELS, getExercise } from '../lib/exercises';

const Exercise3D = dynamic(() => import('./Exercise3D'), {
  ssr: false,
  loading: () => (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }} className="muted small">
      Cargando 3D…
    </div>
  ),
});

export function Flip({ id, name }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((x) => 1 - x), 1400);
    return () => clearInterval(t);
  }, [paused]);
  return (
    <button className="flip" onClick={() => setPaused((p) => !p)} aria-label="Pausar o reanudar fotos" style={{ border: 0, padding: 0, width: '100%' }}>
      <img src={`/ex/${id}-0.webp`} alt={`${name}: posición inicial`} style={{ opacity: i === 0 ? 1 : 0 }} loading="lazy" />
      <img src={`/ex/${id}-1.webp`} alt={`${name}: posición final`} style={{ opacity: i === 1 ? 1 : 0 }} loading="lazy" />
      <span className="tag pill" style={{ background: 'rgba(0,0,0,0.65)', color: '#fff' }}>
        {i === 0 ? '1 · Inicio' : '2 · Final'} {paused ? '· pausa' : ''}
      </span>
    </button>
  );
}

export function MuscleChips({ ex }) {
  return (
    <div className="row wrap" style={{ gap: 6 }}>
      {ex.primary.map((m) => (
        <span key={m} className="pill lime">{MUSCLE_LABELS[m] || m}</span>
      ))}
      {(ex.secondary || []).map((m) => (
        <span key={m} className="pill cyan">{MUSCLE_LABELS[m] || m}</span>
      ))}
    </div>
  );
}

export default function ExerciseDetail({ id, compact = false }) {
  const ex = getExercise(id);
  const [view, setView] = useState('3d');
  if (!ex) return <p className="muted">Ejercicio no encontrado.</p>;
  const alt = ex.alt && typeof ex.alt === 'object' ? ex.alt : ex.alt ? { id: null, text: String(ex.alt) } : null;
  const altEx = alt?.id ? getExercise(alt.id) : null;
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className="tabs" role="tablist">
        <button className={`tab${view === '3d' ? ' on' : ''}`} onClick={() => setView('3d')} role="tab" aria-selected={view === '3d'}>
          <Icon name="cube" size={15} style={{ verticalAlign: -2 }} /> Animación 3D
        </button>
        <button className={`tab${view === 'foto' ? ' on' : ''}`} onClick={() => setView('foto')} role="tab" aria-selected={view === 'foto'}>
          <Icon name="camera" size={15} style={{ verticalAlign: -2 }} /> Fotos reales
        </button>
      </div>

      {view === '3d' ? (
        <div className="viewer">
          <Exercise3D anim={ex.anim} primary={ex.primary} secondary={ex.secondary || []} style={{ position: 'absolute', inset: 0 }} />
        </div>
      ) : (
        <Flip id={ex.id} name={ex.name} />
      )}

      <div className="stack" style={{ gap: 8 }}>
        <MuscleChips ex={ex} />
        <p className="small muted">
          <Icon name="dumbbell" size={14} style={{ verticalAlign: -2 }} /> {ex.equip}
          {ex.zone ? <> · {ex.zone}</> : null}
        </p>
      </div>

      {ex.cardioHow && (
        <div className="hint up">
          <Icon name="heart" size={18} />
          <span>{ex.cardioHow}</span>
        </div>
      )}

      {ex.setup?.length > 0 && (
        <div className="card soft">
          <div className="section-title" style={{ margin: '0 0 8px' }}>Colócate</div>
          <ul className="ul">
            {ex.setup.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {ex.steps?.length > 0 && (
        <div className="card soft">
          <div className="section-title" style={{ margin: '0 0 8px' }}>Ejecución</div>
          <ol className="stack" style={{ gap: 10, margin: 0, padding: 0, listStyle: 'none' }}>
            {ex.steps.map((t, i) => (
              <li key={i} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                <span className="pill lime num" style={{ minWidth: 26, justifyContent: 'center' }}>{i + 1}</span>
                <span>{t}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {ex.mistakes?.length > 0 && (
        <div className="card soft">
          <div className="section-title" style={{ margin: '0 0 8px', color: 'var(--amber)' }}>Errores típicos</div>
          <ul className="ul">
            {ex.mistakes.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}

      {ex.tip && (
        <div className="hint up">
          <Icon name="sparkle" size={18} />
          <span>
            <b>Clave:</b> {ex.tip}
          </span>
        </div>
      )}

      {alt && (
        <div className="hint">
          <Icon name="swap" size={18} />
          <span>
            <b>¿Máquina ocupada?</b> {alt.text}
            {altEx && !compact ? (
              <>
                {' '}
                → <Link href={`/ejercicio/${altEx.id}`} style={{ color: 'var(--lime)' }}>{altEx.name}</Link>
              </>
            ) : null}
          </span>
        </div>
      )}
    </div>
  );
}
