'use client';

import { useState } from 'react';
import Icon from './Icon';
import { update } from '../lib/store';
import { todayISO } from '../lib/dates';
import { weeksToGoal } from '../lib/coach';

export default function Onboarding() {
  const [f, setF] = useState({ startDate: todayISO(), age: 25, heightCm: 174, startKg: 95, goalKg: 80, gymTime: '18:30' });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));
  const weeks = weeksToGoal(Number(f.startKg) || 94, Number(f.goalKg) || 80);
  const start = () => {
    const kg = Number(String(f.startKg).replace(',', '.')) || 94;
    update((d) => {
      d.profile = {
        ...d.profile,
        startDate: f.startDate || todayISO(),
        age: Number(f.age) || 25,
        heightCm: Number(f.heightCm) || 175,
        startKg: kg,
        goalKg: Number(String(f.goalKg).replace(',', '.')) || 80,
        gymTime: f.gymTime || '18:30',
      };
      if (!d.weights.some((w) => w.date === f.startDate)) d.weights.push({ date: f.startDate, kg });
    });
  };
  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <header className="page-head" style={{ marginTop: 18 }}>
        <div>
          <div className="eyebrow">Aesthetic Coach</div>
          <h1>Vamos a ponerte ancho y definido 💎</h1>
          <p className="sub">
            Plan de 6 días con especialización en hombro, espalda y brazos + dieta sin verdura "rara". Configúralo en 20 segundos.
          </p>
        </div>
      </header>
      <div className="card stack">
        <div className="grid-2">
          <div className="field">
            <label htmlFor="ob-start">Empiezo el</label>
            <input id="ob-start" className="input" type="date" value={f.startDate} onChange={set('startDate')} />
          </div>
          <div className="field">
            <label htmlFor="ob-gym">Hora habitual de gym</label>
            <input id="ob-gym" className="input" type="time" value={f.gymTime} onChange={set('gymTime')} />
          </div>
          <div className="field">
            <label htmlFor="ob-kg">Peso actual (kg)</label>
            <input id="ob-kg" className="input" inputMode="decimal" value={f.startKg} onChange={set('startKg')} />
          </div>
          <div className="field">
            <label htmlFor="ob-goal">Peso objetivo (kg)</label>
            <input id="ob-goal" className="input" inputMode="decimal" value={f.goalKg} onChange={set('goalKg')} />
          </div>
          <div className="field">
            <label htmlFor="ob-h">Altura (cm)</label>
            <input id="ob-h" className="input" inputMode="numeric" value={f.heightCm} onChange={set('heightCm')} />
          </div>
          <div className="field">
            <label htmlFor="ob-age">Edad</label>
            <input id="ob-age" className="input" inputMode="numeric" value={f.age} onChange={set('age')} />
          </div>
        </div>
        <div className="hint up">
          <Icon name="target" size={18} />
          <span>
            Con el plan bien hecho, de {f.startKg} a {f.goalKg} kg son unas <b>{weeks ?? '—'} semanas</b> (~{weeks ? Math.round(weeks / 4.3) : '—'} meses).
            El objetivo de ~80 kg es una estimación para ~12-13% de grasa; lo afinamos con tus medidas.
          </span>
        </div>
        <button className="btn primary block" onClick={start} style={{ height: 52, fontSize: 16 }}>
          Empezar el plan <Icon name="chevron" size={18} />
        </button>
        <p className="tiny faint center">Tus datos se guardan solo en este dispositivo. Puedes exportarlos en Ajustes.</p>
      </div>
    </div>
  );
}
