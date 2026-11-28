'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Icon from './Icon';

export function Check({ on, onClick, round, label, size }) {
  return (
    <button
      type="button"
      className={`check${on ? ' on' : ''}${round ? ' round' : ''}`}
      onClick={onClick}
      aria-pressed={!!on}
      aria-label={label || (on ? 'Hecho' : 'Marcar como hecho')}
      style={size ? { width: size, height: size } : undefined}
    >
      <Icon name="check" size={16} stroke={2.6} />
    </button>
  );
}

export function Ring({ pct = 0, size = 64, stroke = 7, color = 'var(--lime)', label, track = 'rgba(255,255,255,0.08)' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, pct));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="lbl">{label ?? `${Math.round(p * 100)}%`}</div>
    </div>
  );
}

export function Bar({ pct = 0, color, thin }) {
  return (
    <div className={`bar${color ? ' ' + color : ''}${thin ? ' thin' : ''}`}>
      <i style={{ width: `${Math.max(0, Math.min(100, pct * 100))}%` }} />
    </div>
  );
}

export function Sheet({ open, onClose, children, title }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
  if (!open || typeof document === 'undefined') return null;
  // En un portal: así ninguna tarjeta (con su propio contexto de apilado) la tapa
  return createPortal(
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
        <div className="grab" />
        <div className="spread" style={{ marginBottom: 10 }}>
          <h3 style={{ fontSize: 20 }}>{title}</h3>
          <button className="icon-btn sm" onClick={onClose} aria-label="Cerrar">
            <Icon name="x" size={16} />
          </button>
        </div>
        {children}
      </div>
    </>,
    document.body
  );
}

export function useToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 2200);
    return () => clearTimeout(id);
  }, [msg]);
  const node = msg ? <div className="toast">{msg}</div> : null;
  return [node, setMsg];
}

export function BackLink({ href = '/', label = 'Volver' }) {
  return (
    <Link href={href} className="back">
      <Icon name="back" size={18} /> {label}
    </Link>
  );
}

export function Skeleton({ h = 150, style }) {
  return <div className="skeleton" style={{ height: h, ...style }} />;
}

export function PageSkeleton() {
  return (
    <div className="stack" style={{ marginTop: 60 }}>
      <Skeleton h={40} style={{ width: '60%' }} />
      <div className="bento">
        <Skeleton h={190} style={{ gridColumn: 'span 2' }} />
        <Skeleton h={150} />
        <Skeleton h={150} />
        <Skeleton h={150} style={{ gridColumn: 'span 2' }} />
      </div>
    </div>
  );
}

export function Stepper({ value, onChange, step = 1, min = 0, max = 9999, format = (v) => v }) {
  return (
    <div className="row" style={{ gap: 6 }}>
      <button className="icon-btn sm" onClick={() => onChange(Math.max(min, +(value - step).toFixed(2)))} aria-label="Menos">
        <Icon name="minus" size={15} />
      </button>
      <span className="num" style={{ minWidth: 44, textAlign: 'center', fontWeight: 700 }}>
        {format(value)}
      </span>
      <button className="icon-btn sm" onClick={() => onChange(Math.min(max, +(value + step).toFixed(2)))} aria-label="Más">
        <Icon name="plus" size={15} />
      </button>
    </div>
  );
}

export function MacroLine({ m, compact }) {
  return (
    <span className={compact ? 'small muted' : 'muted'}>
      <b className="num" style={{ color: 'var(--text)' }}>{m.kcal}</b> kcal · <b style={{ color: 'var(--lime)' }}>{m.p}g</b> P · {m.c}g C · {m.f}g G
    </span>
  );
}

// Las páginas se pintan en cliente tras hidratar: el salto a #ancla del navegador llega antes
// de que exista la sección. Este hook lo repite cuando el contenido ya está montado.
export function useHashScroll(ready) {
  useEffect(() => {
    if (!ready || typeof window === 'undefined') return;
    const go = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const t = setTimeout(go, 60);
    window.addEventListener('hashchange', go);
    return () => {
      clearTimeout(t);
      window.removeEventListener('hashchange', go);
    };
  }, [ready]);
}
