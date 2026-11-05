'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import FoodImg from './FoodImg';
import { BackLink, Check, useToast } from './ui';
import { getRecipe, recipeMacros, SLOT_BY_KEY, SLOTS, WEEK_MENU } from '../lib/recipes';
import { qtyLabel, FOODS } from '../lib/foods';
import { useAppState, useHydrated, updateDay } from '../lib/store';
import { todayISO, weekdayIdx, fmtClock } from '../lib/dates';
import { beep, unlockAudio } from '../lib/sound';

export default function RecipeView({ id }) {
  const r = getRecipe(id);
  const params = useSearchParams();
  const router = useRouter();
  const hydrated = useHydrated();
  const s = useAppState();
  const [toast, showToast] = useToast();
  const [mult, setMult] = useState(1);
  const [have, setHave] = useState({});
  const [stepMode, setStepMode] = useState(params.get('pasos') === '1');

  // ¿A qué comida (día/slot) corresponde? Por la URL o porque está en el menú de hoy
  const iso = params.get('d') || todayISO();
  let slotKey = params.get('slot');
  if (!slotKey) {
    const menu = WEEK_MENU[weekdayIdx(iso)];
    slotKey = SLOTS.find((sl) => menu[sl.key] === id)?.key || null;
  }
  const slot = slotKey ? SLOT_BY_KEY[slotKey] : null;
  const eaten = hydrated && slot ? !!s.days[iso]?.meals?.[slot.key] : false;
  const m = recipeMacros(r);

  const markEaten = (val = true) => {
    if (!slot) return;
    updateDay(iso, (d) => {
      d.meals = { ...(d.meals || {}), [slot.key]: val };
    });
    if (val) showToast(`${slot.label} hecha ✓`);
  };

  return (
    <>
      {toast}
      <BackLink href="/dieta" label="Dieta" />
      <FoodImg recipe={r} priority rounded="var(--r-lg)" style={{ aspectRatio: '4 / 3', width: '100%', maxHeight: 420 }} sizes="(max-width: 760px) 100vw, 760px" />

      <header className="page-head" style={{ marginTop: 16 }}>
        <div className="grow">
          <div className="eyebrow">
            {slot ? `${slot.emoji} ${slot.label} · ${slot.time}` : 'Receta'} · {r.time} min
          </div>
          <h1 style={{ fontSize: 28 }}>{r.name}</h1>
          <div className="row wrap" style={{ gap: 6, marginTop: 10 }}>
            {r.tags.map((t) => (
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
        </div>
      </header>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
        {[
          ['kcal', m.kcal * mult, 'var(--text)'],
          ['prot.', `${m.p * mult}g`, 'var(--lime)'],
          ['hidr.', `${m.c * mult}g`, 'var(--amber)'],
          ['grasa', `${m.f * mult}g`, 'var(--cyan)'],
          ['fibra', `${m.fib * mult}g`, 'var(--violet)'],
        ].map(([l, v, c]) => (
          <div key={l} className="card soft center" style={{ padding: '10px 4px' }}>
            <div className="num" style={{ fontWeight: 700, fontSize: 17, color: c }}>{v}</div>
            <div className="tiny muted">{l}</div>
          </div>
        ))}
      </div>

      <button className="btn primary block" style={{ marginTop: 16, height: 54, fontSize: 16 }} onClick={() => setStepMode(true)}>
        <Icon name="play" size={15} fill="currentColor" /> Cocinar paso a paso
      </button>

      <div className="section">
        <div className="spread" style={{ marginBottom: 10 }}>
          <div className="section-title" style={{ margin: 0 }}>Ingredientes</div>
          <div className="tabs" style={{ padding: 3 }}>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className={`tab${mult === n ? ' on' : ''}`} style={{ height: 30, padding: '0 10px', fontSize: 13 }} onClick={() => setMult(n)}>
                ×{n}
              </button>
            ))}
          </div>
        </div>
        {mult > 1 && <p className="small muted" style={{ marginBottom: 8 }}>Cantidades para {mult} raciones (meal prep). Los macros de arriba son del total.</p>}
        <div className="card">
          <div className="list">
            {r.ingredients.map(([k, g, note], i) => (
              <div key={k + i} className="list-item" style={{ padding: '10px 0' }}>
                <Check on={have[i]} round onClick={() => setHave((h) => ({ ...h, [i]: !h[i] }))} label="Lo tengo" />
                <div className="grow" style={{ opacity: have[i] ? 0.5 : 1 }}>
                  <div style={{ fontWeight: 550 }}>{FOODS[k]?.name || k}</div>
                  {note && <div className="tiny muted">{note}</div>}
                </div>
                <span className="num muted small" style={{ textAlign: 'right' }}>{k === 'especias' ? 'al gusto' : qtyLabel(k, g * mult)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Pasos</div>
        <div className="card">
          <ol className="stack" style={{ gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
            {r.steps.map((st, i) => (
              <li key={i} className="row" style={{ alignItems: 'flex-start' }}>
                <span className="pill lime num" style={{ minWidth: 26, justifyContent: 'center' }}>{i + 1}</span>
                <span className="grow">
                  {st.t}
                  {st.timer ? <span className="pill" style={{ marginLeft: 6 }}>⏱ {fmtClock(st.timer)}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {r.tip && (
        <div className="hint up">
          <Icon name="sparkle" size={18} />
          <span>{r.tip}</span>
        </div>
      )}

      {slot && hydrated && (
        <button className={`btn block ${eaten ? '' : 'primary'}`} style={{ marginTop: 16, height: 50 }} onClick={() => markEaten(!eaten)}>
          <Icon name="check" size={17} stroke={2.4} /> {eaten ? 'Marcada como hecha (deshacer)' : `Marcar ${slot.label.toLowerCase()} como hecha`}
        </button>
      )}

      {stepMode && (
        <StepMode
          recipe={r}
          onClose={() => {
            setStepMode(false);
            if (params.get('pasos')) router.replace(`/receta/${id}${slot ? `?slot=${slot.key}&d=${iso}` : ''}`, { scroll: false });
          }}
          onFinish={() => {
            markEaten(true);
            setStepMode(false);
            router.push('/');
          }}
          canMark={!!slot}
          mult={mult}
        />
      )}
    </>
  );
}

function StepMode({ recipe, onClose, onFinish, canMark, mult }) {
  const [i, setI] = useState(-1); // -1 = ingredientes
  const [timerEnd, setTimerEnd] = useState(null);
  const [left, setLeft] = useState(0);
  const fired = useRef(false);
  const total = recipe.steps.length;
  const step = i >= 0 ? recipe.steps[i] : null;

  useEffect(() => {
    if (!timerEnd) return;
    fired.current = false;
    const id = setInterval(() => {
      const l = (timerEnd - Date.now()) / 1000;
      setLeft(l);
      if (l <= 0 && !fired.current) {
        fired.current = true;
        beep();
      }
    }, 250);
    return () => clearInterval(id);
  }, [timerEnd]);

  useEffect(() => {
    setTimerEnd(null);
  }, [i]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="step-view" role="dialog" aria-modal="true" aria-label={`Paso a paso: ${recipe.name}`}>
      <div className="spread">
        <span className="small muted" style={{ maxWidth: '75%' }}>{recipe.name}</span>
        <button className="icon-btn sm" onClick={onClose} aria-label="Cerrar">
          <Icon name="x" size={16} />
        </button>
      </div>
      <div className="step-dots" style={{ marginTop: 12 }}>
        <i className={i >= -1 ? 'on' : ''} />
        {recipe.steps.map((_, k) => (
          <i key={k} className={k <= i ? 'on' : ''} />
        ))}
      </div>

      <div className="step-body">
        {i === -1 ? (
          <>
            <div className="step-n">🧾</div>
            <div className="step-t" style={{ fontSize: 22 }}>Prepara esto antes de empezar{mult > 1 ? ` (×${mult})` : ''}:</div>
            <div className="card" style={{ maxHeight: '45dvh', overflowY: 'auto' }}>
              {recipe.ingredients.map(([k, g, note], n) => (
                <div key={n} className="spread" style={{ padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
                  <span>
                    {FOODS[k]?.name || k}
                    {note ? <span className="tiny muted"> · {note}</span> : null}
                  </span>
                  <span className="num muted small">{k === 'especias' ? 'al gusto' : qtyLabel(k, g * mult)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="step-n">{i + 1}</div>
            <div className="step-t">{step.t}</div>
            {step.timer ? (
              timerEnd ? (
                <div className="card center" style={{ background: left <= 0 ? 'rgba(255,181,71,0.15)' : 'var(--card)' }}>
                  <div className="num" style={{ fontSize: 54, fontWeight: 700, color: left <= 0 ? 'var(--amber)' : 'var(--lime)' }}>
                    {left <= 0 ? '¡Listo!' : fmtClock(left)}
                  </div>
                  <button className="btn sm" style={{ marginTop: 8 }} onClick={() => setTimerEnd(null)}>
                    Parar temporizador
                  </button>
                </div>
              ) : (
                <button
                  className="btn block"
                  style={{ height: 54 }}
                  onClick={() => {
                    unlockAudio();
                    setLeft(step.timer);
                    setTimerEnd(Date.now() + step.timer * 1000);
                  }}
                >
                  <Icon name="timer" size={18} /> Temporizador {fmtClock(step.timer)}
                </button>
              )
            ) : null}
          </>
        )}
      </div>

      <div className="row" style={{ maxWidth: 640, margin: '0 auto', width: '100%' }}>
        <button className="btn" style={{ height: 54, flex: 1 }} onClick={() => setI((x) => Math.max(-1, x - 1))} disabled={i === -1}>
          <Icon name="back" size={18} /> Atrás
        </button>
        {i < total - 1 ? (
          <button className="btn primary" style={{ height: 54, flex: 2 }} onClick={() => setI((x) => x + 1)}>
            {i === -1 ? 'Empezar' : 'Siguiente'} <Icon name="chevron" size={18} />
          </button>
        ) : (
          <button className="btn primary" style={{ height: 54, flex: 2 }} onClick={canMark ? onFinish : onClose}>
            <Icon name="check" size={18} stroke={2.4} /> {canMark ? '¡Hecho! A comer' : 'Terminar'}
          </button>
        )}
      </div>
    </div>
  );
}
