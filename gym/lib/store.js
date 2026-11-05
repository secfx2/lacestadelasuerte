'use client';

// Estado de la app guardado en localStorage (privado en tu dispositivo).
// Exporta/importa un JSON desde Ajustes para pasarlo a otro móvil o hacer copia.

import { useEffect, useState, useSyncExternalStore } from 'react';

const KEY = 'aesthetic-coach-v1';

export const DEFAULT_STATE = {
  version: 1,
  profile: {
    startDate: null, // 'YYYY-MM-DD' (lunes recomendado)
    age: 25,
    heightCm: 175,
    startKg: 94,
    goalKg: 80,
    gymTime: '18:30',
    doubleSession: false,
  },
  days: {}, // 'YYYY-MM-DD' → { sets, done, startedAt, finishedAt, cardio, cardioAm, warmup, meals, water, supps, steps, sleep, workoutKey }
  weights: [], // { date, kg }
  measures: [], // { date, waist, neck, shoulders, chest, arm }
  shopping: {}, // 'YYYY-MM-DD(lunes)' → { [foodKey]: true }
};

let state = null;
const listeners = new Set();

function load() {
  if (state) return state;
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    state = merge(parsed);
  } catch {
    state = structuredClone(DEFAULT_STATE);
  }
  return state;
}

function merge(parsed) {
  const base = structuredClone(DEFAULT_STATE);
  if (!parsed || typeof parsed !== 'object') return base;
  return {
    ...base,
    ...parsed,
    profile: { ...base.profile, ...(parsed.profile || {}) },
    days: parsed.days || {},
    weights: Array.isArray(parsed.weights) ? parsed.weights : [],
    measures: Array.isArray(parsed.measures) ? parsed.measures : [],
    shopping: parsed.shopping || {},
  };
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* almacenamiento lleno o bloqueado: seguimos en memoria */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

export function getState() {
  return load();
}

// update(draft => { ...mutaciones... })
export function update(fn) {
  const draft = structuredClone(load());
  fn(draft);
  state = draft;
  save();
  emit();
}

export function replaceState(next) {
  state = merge(next);
  save();
  emit();
}

export function resetState() {
  state = structuredClone(DEFAULT_STATE);
  save();
  emit();
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
