'use client';

import { useEffect, useRef, useState } from 'react';
import { getLocalKey, setLocalKey } from '../../lib/advisorStore';
import { syncNow, useSyncStatus } from '../../lib/sync';
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
          <p className="sub">Tus datos se guardan en la nube y en cada dispositivo.</p>
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

      <SyncCard showToast={showToast} />

      <AdvisorKeyCard showToast={showToast} />

      <div className="card stack">
        <h3>Copia en archivo</h3>
        <p className="small muted">Descarga todos tus datos en un archivo (por si acaso). Importarlo reemplaza lo que hay aquí y en la nube.</p>
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
              if (confirm('¿Borrar TODOS tus datos (en este dispositivo, en la nube y en tus otros dispositivos)? Quedará una copia diaria en la nube por si te arrepientes.')) {
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

function AdvisorKeyCard({ showToast }) {
  const [serverKey, setServerKey] = useState(null);
  const [local, setLocal] = useState('');
  const [draft, setDraft] = useState('');
  useEffect(() => {
    setLocal(getLocalKey());
    fetch('/api/coach')
      .then((r) => (r.ok ? r.json() : { serverKey: false }))
      .then((d) => setServerKey(!!d.serverKey))
      .catch(() => setServerKey(false));
  }, []);
  const save = () => {
    const k = draft.trim();
    if (!k.startsWith('sk-ant-')) return showToast('La key debe empezar por sk-ant-');
    setLocalKey(k);
    setLocal(k);
    setDraft('');
    showToast('API key guardada ✓');
  };
  return (
    <div className="card stack">
      <h3>Asesor IA (Claude)</h3>
      {serverKey ? (
        <div className="hint ok">
          <Icon name="check" size={18} />
          <span>Hay una API key configurada en el servidor (Vercel). Funciona en todos tus dispositivos.</span>
        </div>
      ) : local ? (
        <div className="hint ok">
          <Icon name="check" size={18} />
          <span>
            API key guardada en este dispositivo (<span className="kbd">{local.slice(0, 10)}…{local.slice(-4)}</span>).
          </span>
        </div>
      ) : (
        <p className="small muted">Sin API key todavía. Pégala aquí o configúrala en Vercel como ANTHROPIC_API_KEY.</p>
      )}
      {!serverKey && (
        <>
          <div className="row">
            <input className="input grow" type="password" autoComplete="off" placeholder={local ? 'Nueva key (sk-ant-...)' : 'sk-ant-...'} value={draft} onChange={(e) => setDraft(e.target.value)} />
            <button className="btn primary" onClick={save} disabled={!draft.trim()}>
              Guardar
            </button>
          </div>
          {local && (
            <button
              className="btn sm danger"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => {
                setLocalKey('');
                setLocal('');
                showToast('Key eliminada de este dispositivo');
              }}
            >
              Quitar key de este dispositivo
            </button>
          )}
        </>
      )}
      <p className="tiny faint">
        La key no se incluye al exportar tus datos. Cada pregunta con Opus 5.5 cuesta unos céntimos (el plan va cacheado); Sonnet 5.5 es aproximadamente la mitad.
      </p>
    </div>
  );
}

function SyncCard({ showToast }) {
  const st = useSyncStatus();
  const [backups, setBackups] = useState(null);
  const [busy, setBusy] = useState(false);
  const ago = (t) => {
    if (!t) return 'nunca';
    const m = Math.round((Date.now() - t) / 60000);
    if (m < 1) return 'hace un momento';
    if (m < 60) return `hace ${m} min`;
    const h = Math.round(m / 60);
    if (h < 24) return `hace ${h} h`;
    return new Date(t).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };
  const loadBackups = async () => {
    setBusy(true);
    try {
      const r = await fetch('/api/state/backups', { cache: 'no-store' });
      const d = await r.json();
      setBackups(r.ok ? d.backups || [] : []);
      if (!r.ok) showToast(d.error || 'No se pudieron cargar');
    } catch {
      showToast('Sin conexión');
    }
    setBusy(false);
  };
  const restore = async (b) => {
    const when = new Date(b.savedAt).toLocaleString('es-ES', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
    if (!confirm(`¿Restaurar la copia del ${when}? Lo que tienes ahora se sustituirá (se guarda antes una copia local).`)) return;
    try {
      const r = await fetch(`/api/state/backups?id=${b.id}`, { cache: 'no-store' });
      const d = await r.json();
      if (!r.ok || !d?.data) throw new Error(d?.error || 'Copia no encontrada');
      replaceState(d.data);
      showToast('Copia restaurada ✓');
    } catch (e) {
      showToast(e.message || 'No se pudo restaurar');
    }
  };
  const ok = st.phase === 'ok' && !st.dirty;
  return (
    <div className="card stack">
      <div className="spread">
        <h3>Sincronización en la nube</h3>
        <span className={`pill ${ok ? 'lime' : st.phase === 'error' ? 'red' : 'amber'}`}>
          {st.phase === 'off' ? 'desactivada' : ok ? '✓ al día' : st.phase === 'syncing' || st.dirty ? 'guardando…' : st.phase === 'offline' ? 'sin conexión' : 'error'}
        </span>
      </div>
      {st.phase === 'off' ? (
        <p className="small muted">El servidor no tiene configurado el almacén en la nube. Tus datos están solo en este dispositivo.</p>
      ) : (
        <p className="small muted">
          Tus datos (entrenos, comidas, pesos, medidas…) se guardan en la nube y aparecen en cualquier dispositivo donde entres con tu contraseña. Última sincronización:{' '}
          <b style={{ color: 'var(--text)' }}>{ago(st.lastSync)}</b>
          {st.error && st.phase !== 'ok' ? ` · ${st.error}` : ''}
        </p>
      )}
      <div className="row wrap">
        <button className="btn sm" onClick={() => syncNow()} disabled={st.phase === 'off'}>
          <Icon name="cloud" size={15} /> Sincronizar ahora
        </button>
        <button className="btn sm ghost" onClick={loadBackups} disabled={busy || st.phase === 'off'}>
          {busy ? 'Cargando…' : 'Ver copias diarias'}
        </button>
      </div>
      {backups && (
        <div className="list">
          {backups.length === 0 && <p className="small muted">Aún no hay copias (se crea una cada día que uses la app).</p>}
          {backups.slice(0, 20).map((b) => (
            <div key={b.id} className="list-item" style={{ padding: '8px 0' }}>
              <span className="grow small">{new Date(b.savedAt).toLocaleString('es-ES', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              <button className="btn xs" onClick={() => restore(b)}>
                Restaurar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
