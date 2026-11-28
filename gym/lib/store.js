'use client';

// Estado de la app. Copia local en localStorage (funciona sin conexión) y copia en la nube
// sincronizada por lib/sync.js. Cada cambio local se marca con fecha (lib/merge.js) para poder
// combinar datos de varios dispositivos sin perder nada.

import { useEffect, useState, useSyncExternalStore } from 'react';
import { stampChanges } from './merge.js';

const KEY = 'aesthetic-coach-v1';
const BACKUP_KEY = 'aesthetic-coach-v1-localbackups';

export const DEFAULT_STATE = {
  version: 1,
  profile: {
    startDate: null, // 'YYYY-MM-DD'
    age: 25,
    heightCm: 174,
    startKg: 95,
    goalKg: 80,
    gymTime: '18:30',
    doubleSession: false,
  },
  days: {}, // 'YYYY-MM-DD' → { sets, done, startedAt, finishedAt, cardio, cardioAm, warmup, meals, water, supps, steps, sleep, workoutKey, _ts }
  weights: [], // { date, kg, ts }
  measures: [], // { date, waist, neck, shoulders, chest, arm, ts }
  shopping: {}, // 'YYYY-MM-DD(lunes)' → { [foodKey]: true, _ts }
  deletedWeights: {}, // fecha → ts del borrado
  custom: {}, // tus cambios del plan (ver lib/plan.js)
};

let state = null;
const listeners = new Set(); // UI (cualquier cambio)
const localListeners = new Set(); // sincronización (solo cambios hechos en este dispositivo)

function load() {
  if (state) return state;
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    state = normalize(parsed);
  } catch {
    state = structuredClone(DEFAULT_STATE);
  }
  return state;
}

export function normalize(parsed) {
  const base = structuredClone(DEFAULT_STATE);
  if (!parsed || typeof parsed !== 'object') return base;
  return {
    ...base,
    ...parsed,
    profile: { ...base.profile, ...(parsed.profile || {}) },
    days: parsed.days && typeof parsed.days === 'object' ? parsed.days : {},
    weights: Array.isArray(parsed.weights) ? parsed.weights : [],
    measures: Array.isArray(parsed.measures) ? parsed.measures : [],
    shopping: parsed.shopping && typeof parsed.shopping === 'object' ? parsed.shopping : {},
    deletedWeights: parsed.deletedWeights && typeof parsed.deletedWeights === 'object' ? parsed.deletedWeights : {},
    custom: parsed.custom && typeof parsed.custom === 'object' && !Array.isArray(parsed.custom) ? parsed.custom : {},
  };
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento lleno o bloqueado: seguimos en memoria */
  }
}

function emit({ local }) {
  listeners.forEach((l) => l());
  if (local) localListeners.forEach((l) => l());
}

export function getState() {
  return load();
}

// update(draft => { ...mutaciones... }) — cambio hecho en este dispositivo
export function update(fn) {
  const prev = load();
  const draft = structuredClone(prev);
  fn(draft);
  stampChanges(prev, draft, Date.now());
  state = draft;
  save();
  emit({ local: true });
}

// Importar/restaurar: todo cuenta como modificado ahora (gana al combinar)
export function replaceState(next) {
  const now = Date.now();
  const n = normalize(next);
  n.profile = { ...n.profile, _ts: now };
  for (const d of Object.keys(n.days)) n.days[d] = { ...n.days[d], _ts: now };
  n.weights = n.weights.map((w) => ({ ...w, ts: now }));
  n.measures = n.measures.map((m) => ({ ...m, ts: now }));
  for (const w of Object.keys(n.shopping)) n.shopping[w] = { ...n.shopping[w], _ts: now };
  backupLocal('antes de importar/restaurar');
  state = n;
  save();
  emit({ local: true });
}

// Borrar todo (también en la nube y en los demás dispositivos)
export function resetState() {
  backupLocal('antes de borrar todo');
  const now = Date.now();
  state = structuredClone(DEFAULT_STATE);
  state.resetAt = now;
  state.profile._ts = now;
  save();
  emit({ local: true });
}

// Estado que llega de la nube (ya combinado): no se vuelve a marcar ni dispara subida
export function applyRemote(next) {
  state = normalize(next);
  save();
  emit({ local: false });
}

// Copias locales de seguridad (últimas 3) antes de operaciones delicadas
export function backupLocal(reason = '') {
  try {
    const cur = load();
    if (!cur.profile.startDate && !Object.keys(cur.days).length) return;
    const list = JSON.parse(window.localStorage.getItem(BACKUP_KEY) || '[]');
    list.unshift({ at: Date.now(), reason, data: cur });
    window.localStorage.setItem(BACKUP_KEY, JSON.stringify(list.slice(0, 3)));
  } catch {
    /* sin espacio: no pasa nada */
  }
}

function subscribe(l) {
  listeners.add(l);
  const onStorage = (e) => {
    if (e.key === KEY) {
      state = null;
      load();
      l();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener('storage', onStorage);
  };
}

export function subscribeLocalChanges(l) {
  localListeners.add(l);
  return () => localListeners.delete(l);
}

export function useAppState() {
  return useSyncExternalStore(subscribe, load, () => DEFAULT_STATE);
}

// Datos de un día concreto (con valores por defecto)
export function dayData(s, iso) {
  return s.days[iso] || {};
}

export function updateDay(iso, fn) {
  update((d) => {
    if (!d.days[iso]) d.days[iso] = {};
    fn(d.days[iso], d);
  });
}

// true una vez montado en cliente (para no pintar datos de localStorage en el SSR)
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}

// Reloj que se refresca cada `ms` (para "próxima comida" y temporizadores)
export function useNow(ms = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
}
