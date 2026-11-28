'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Sheet } from './ui';
import { kegelSteps, sessionSeconds } from '../lib/kegel';
import { unlockAudio } from '../lib/sound';

// Pitido corto (más agudo al apretar) + vibración en cada cambio
function cue(kind) {
  try {
    if (navigator.vibrate) navigator.vibrate(kind === 'hold' ? 60 : 25);
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    cue.ctx = cue.ctx || new Ctx();
    const ctx = cue.ctx;
    if (ctx.state === 'suspended') ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = kind === 'hold' ? 990 : 660;
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.18);
  } catch {
    /* sin audio */
  }
}

// Sesión guiada: aprieta / suelta con cuenta atrás, sonido y vibración
export default function KegelTrainer({ open, onClose, level, onDone }) {
  const steps = useMemo(() => kegelSteps(level), [level]);
  const [idx, setIdx] = useState(-1); // -1 = sin empezar
  const [left, setLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const endAt = useRef(0);
  const remain = useRef(0);

  // Al cerrar, vuelve al principio
  useEffect(() => {
    if (!open) {
      setIdx(-1);
      setPaused(false);
      setFinished(false);
    }
  }, [open]);

  useEffect(() => {
    if (idx < 0 || paused || finished) return;
    const t = setInterval(() => {
      const ms = endAt.current - Date.now();
      if (ms > 0) {
        setLeft(Math.ceil(ms / 1000));
        return;
      }
      const next = idx + 1;
      if (next >= steps.length) {
        clearInterval(t);
        setFinished(true);
        if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
        onDone?.();
        return;
      }
      endAt.current = Date.now() + steps[next].secs * 1000;
      setLeft(steps[next].secs);
      cue(steps[next].kind);
      setIdx(next);
    }, 100);
    return () => clearInterval(t);
  }, [idx, paused, finished, steps, onDone]);

  const start = () => {
    unlockAudio();
    endAt.current = Date.now() + steps[0].secs * 1000;
    setLeft(steps[0].secs);
    setFinished(false);
    setPaused(false);
    setIdx(0);
  };
  const togglePause = () => {
    if (paused) {
      endAt.current = Date.now() + remain.current;
      setPaused(false);
    } else {
      remain.current = Math.max(0, endAt.current - Date.now());
      setPaused(true);
    }
  };

  const step = idx >= 0 ? steps[idx] : null;
  const total = sessionSeconds(level);
  const doneSecs = idx >= 0 ? steps.slice(0, idx).reduce((a, s) => a + s.secs, 0) + (step.secs - left) : 0;
  const pct = finished ? 1 : Math.min(1, doneSecs / total);
  const holding = step?.kind === 'hold';
  const stepPct = step ? 1 - left / step.secs : 0;

  return (
    <Sheet open={open} onClose={onClose} title={`Suelo pélvico · nivel ${level.n}`}>
      <div className="stack" style={{ alignItems: 'center', textAlign: 'center' }}>
        {!step && !finished && (
          <>
            <p className="small muted" style={{ margin: 0 }}>
              <b style={{ color: 'var(--text)' }}>{level.name}.</b> {level.where}. {level.slow.reps} lentas de {level.slow.hold} s
              {level.fast ? ` + ${level.fast.reps} rápidas` : ''} · ~{Math.round(total / 60)} min
            </p>
            <p className="small muted" style={{ margin: 0 }}>{level.tip}</p>
          </>
        )}
        <div
          className={`kegel-orb${holding ? ' hold' : ''}`}
          style={{ '--p': finished ? 1 : holding ? stepPct : step?.kind === 'rest' ? 1 - stepPct : 0 }}
          aria-live="polite"
        >
          <div className="kegel-orb-inner">
            {finished ? (
              <>
                <div style={{ fontSize: 36 }}>✓</div>
                <div className="small">Sesión hecha</div>
              </>
            ) : step ? (
              <>
                <div className="kegel-word">{step.label}</div>
                <div className="kegel-num num">{left}</div>
                <div className="tiny muted">{step.rep ? `${step.set} · ${step.rep}/${step.of}` : step.sub || ''}</div>
              </>
            ) : (
              <div className="small muted">Pulsa empezar</div>
            )}
          </div>
        </div>
        <div className="bar thin" style={{ width: '100%' }}>
          <i style={{ width: `${pct * 100}%` }} />
        </div>
        {finished ? (
          <button className="btn primary block" onClick={onClose}>
            Listo
          </button>
        ) : step ? (
          <div className="row" style={{ gap: 8, width: '100%' }}>
            <button className="btn grow" onClick={togglePause}>
              {paused ? 'Seguir' : 'Pausa'}
            </button>
            <button className="btn" onClick={onClose}>
              Parar
            </button>
          </div>
        ) : (
          <button className="btn primary block" onClick={start}>
            Empezar
          </button>
        )}
        <p className="tiny faint" style={{ margin: 0 }}>Respira normal y suelta del todo entre repeticiones. Si duele, para.</p>
      </div>
    </Sheet>
  );
}
