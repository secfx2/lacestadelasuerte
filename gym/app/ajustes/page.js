'use client';

import { useRef, useState } from 'react';
import Icon from '../../components/Icon';
import { BackLink, PageSkeleton, useToast } from '../../components/ui';
import { getState, replaceState, resetState, update, useAppState, useHydrated } from '../../lib/store';
import { todayISO } from '../../lib/dates';
import { weeksToGoal } from '../../lib/coach';

export default function AjustesPage() {
  const hydrated = useHydrated();
  const s = useAppState();
  const [toast, showToast] = useToast();
  const fileRef = useRef(null);
  if (!hydrated) return <PageSkeleton />;
  const p = s.profile;

  const setP = (k, num) => (e) => {
    const raw = e.target.value;
    update((d) => {
      d.profile[k] = num ? Number(String(raw).replace(',', '.')) || 0 : raw;
    });
  };

  // Mifflin-St Jeor (hombre) × factor de actividad alto (6 días + cardio + pasos)
  const bmr = 10 * (Number(p.startKg) || 94) + 6.25 * (Number(p.heightCm) || 175) - 5 * (Number(p.age) || 25) + 5;
  const tdee = Math.round((bmr * 1.6) / 50) * 50;

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aesthetic-coach-${todayISO()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const importData = async (file) => {
    try {
      const data = JSON.parse(await file.text());
      if (!data || typeof data !== 'object' || !data.profile) throw new Error('formato');
      replaceState(data);
      showToast('Datos importados ✓');
    } catch {
      showToast('Archivo no válido');
    }
  };
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  return (
    <>
      {toast}
      <BackLink href="/" label="Hoy" />
      <header className="page-head" style={{ marginTop: 0 }}>
        <div>
          <h1>Ajustes</h1>
          <p className="sub">Tus datos se guardan en este dispositivo.</p>
        </div>
      </header>

      <div className="card stack">
        <h3>Perfil</h3>
        <div className="grid-2">
          <div className="field">
            <label htmlFor="a-start">Inicio del plan</label>
            <input id="a-start" className="input" type="date" value={p.startDate || ''} onChange={setP('startDate')} />
          </div>
          <div className="field">
            <label htmlFor="a-gym">Hora de gym</label>
            <input id="a-gym" className="input" type="time" value={p.gymTime || ''} onChange={setP('gymTime')} />
          </div>
          <div className="field">
            <label htmlFor="a-kg">Peso inicial (kg)</label>
            <input id="a-kg" className="input" inputMode="decimal" defaultValue={p.startKg} onBlur={setP('startKg', true)} />
          </div>
          <div className="field">
            <label htmlFor="a-goal">Objetivo (kg)</label>
            <input id="a-goal" className="input" inputMode="decimal" defaultValue={p.goalKg} onBlur={setP('goalKg', true)} />
          </div>
          <div className="field">
            <label htmlFor="a-h">Altura (cm)</label>
            <input id="a-h" className="input" inputMode="numeric" defaultValue={p.heightCm} onBlur={setP('heightCm', true)} />
          </div>
          <div className="field">
            <label htmlFor="a-age">Edad</label>
            <input id="a-age" className="input" inputMode="numeric" defaultValue={p.age} onBlur={setP('age', true)} />
          </div>
        </div>
        <div className="hint">
          <Icon name="flame" size={18} />
          <span>
            Gasto estimado: <b>~{tdee.toLocaleString('es-ES')} kcal/día</b>. El menú (~2.300) te deja un déficit de ~{(tdee - 2300).toLocaleString('es-ES')} kcal. Objetivo en ~
            {weeksToGoal(p.startKg, p.goalKg) ?? '—'} semanas.
          </span>
        </div>
      </div>

      <div className="card stack">
        <h3>Copia de seguridad</h3>
        <p className="small muted">Exporta un archivo para pasar tus datos a otro móvil o guardarlos. Importarlo reemplaza lo que hay aquí.</p>
        <div className="row wrap">
          <button className="btn" onClick={exportData}>
            Exportar datos
          </button>
          <button className="btn" onClick={() => fileRef.current?.click()}>
            Importar datos
          </button>
          <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importData(e.target.files[0])} />
        </div>
      </div>

      <div className="card stack">
        <h3>Instalar como app</h3>
        <p className="small muted">
          iPhone: Safari → Compartir → <b>Añadir a pantalla de inicio</b>. Android: Chrome → menú ⋮ → <b>Instalar app</b>. Se abre a pantalla completa como una app normal.
        </p>
      </div>

      <div className="card stack">
        <h3>Sesión</h3>
        <div className="row wrap">
          <button className="btn" onClick={logout}>
            <Icon name="logout" size={16} /> Cerrar sesión
          </button>
          <button
            className="btn danger"
            onClick={() => {
              if (confirm('¿Borrar TODOS tus datos de este dispositivo? No se puede deshacer.')) {
                resetState();
                showToast('Datos borrados');
              }
            }}
          >
            Borrar todo
          </button>
        </div>
      </div>
    </>
  );
}
