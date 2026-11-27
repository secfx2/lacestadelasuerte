'use client';

import { suppsForSlot } from '../lib/program';
import { updateDay } from '../lib/store';

// Suplementos que tocan con una comida, para marcarlos como tomados (los mismos que la tarjeta de Hoy)
export default function SuppChips({ s, iso, slot, rest = false, label = 'Con esta comida', dark = false, style }) {
  const list = suppsForSlot(slot, { rest });
  if (!list.length) return null;
  const taken = s.days[iso]?.supps || {};
  const toggle = (k) =>
    updateDay(iso, (d) => {
      d.supps = { ...(d.supps || {}), [k]: !d.supps?.[k] };
    });
  return (
    <div className={`supp-chips${dark ? ' dark' : ''}`} style={style}>
      <span className="tiny" style={{ opacity: 0.75 }}>💊 {label}:</span>
      {list.map((x) => (
        <button key={x.key} type="button" className={`supp-chip${taken[x.key] ? ' on' : ''}`} onClick={() => toggle(x.key)} aria-pressed={!!taken[x.key]}>
          {taken[x.key] ? '✓ ' : ''}
          {x.chip}
        </button>
      ))}
    </div>
  );
}
