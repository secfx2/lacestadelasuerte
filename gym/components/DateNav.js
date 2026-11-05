'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Icon from './Icon';
import { addDays, daysBetween, prettyDate, todayISO } from '../lib/dates';

// Navegador de días: ‹ Ayer · Hoy · Mañana › + selector de fecha. Guarda el día en ?fecha=YYYY-MM-DD
export function useViewDate() {
  const params = useSearchParams();
  const f = params.get('fecha');
  const today = todayISO();
  return f && /^\d{4}-\d{2}-\d{2}$/.test(f) ? f : today;
}

export function relLabel(iso) {
  const diff = daysBetween(todayISO(), iso);
  if (diff === 0) return 'Hoy';
  if (diff === -1) return 'Ayer';
  if (diff === 1) return 'Mañana';
  if (diff < 0) return `Hace ${-diff} días`;
  return `En ${diff} días`;
}

export default function DateNav({ iso }) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const today = todayISO();
  const go = (next) => {
    const q = new URLSearchParams(params.toString());
    if (next === today) q.delete('fecha');
    else q.set('fecha', next);
    const qs = q.toString();
    router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
  };
  const isToday = iso === today;
  return (
    <div className="datenav">
      <button className="icon-btn" onClick={() => go(addDays(iso, -1))} aria-label="Día anterior">
        <Icon name="back" size={18} />
      </button>
      <label className="datenav-mid">
        <span className={`datenav-rel${isToday ? '' : ' other'}`}>{relLabel(iso)}</span>
        <span className="datenav-date">{prettyDate(iso)}</span>
        <input type="date" value={iso} onChange={(e) => e.target.value && go(e.target.value)} aria-label="Elegir fecha" />
      </label>
      <button className="icon-btn" onClick={() => go(addDays(iso, 1))} aria-label="Día siguiente">
        <Icon name="chevron" size={18} />
      </button>
      {!isToday && (
        <button className="btn xs primary" onClick={() => go(today)} style={{ marginLeft: 4 }}>
          Hoy
        </button>
      )}
    </div>
  );
}
