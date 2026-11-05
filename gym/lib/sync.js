'use client';

// Sincronización con la nube (/api/state → Supabase).
// - Al abrir la app, al volver a ella y cada minuto: descarga y combina (lib/merge.js).
// - Cada cambio local se sube a los ~1,5 s (agrupando cambios). Al cerrar/ocultar, se sube ya.
// - Conflictos (otro dispositivo guardó antes): se combinan ambos y se vuelve a subir.
// - Sin conexión: todo sigue funcionando en local y se sube cuando vuelve la red.

import { useSyncExternalStore } from 'react';
import { applyRemote, backupLocal, getState, subscribeLocalChanges } from './store.js';
import { mergeStates, sameData } from './merge.js';

const META_K = 'aesthetic-coach-sync-meta';

let status = { phase: 'idle', initialDone: false, lastSync: 0, error: null, version: 0, dirty: false };
const statusListeners = new Set();
let started = false;
let meta = { version: 0, dirty: false, lastSync: 0 };
let pushTimer = null;
let retryTimer = null;
let inflight = false;
let again = false;
let localSeq = 0;
let lastPull = 0;

function loadMeta() {
  try {
    meta = { ...meta, ...JSON.parse(localStorage.getItem(META_K) || '{}') };
  } catch {
    /* sin meta */
  }
}
function saveMeta() {
  try {
    localStorage.setItem(META_K, JSON.stringify(meta));
  } catch {
    /* nada */
  }
}
function setStatus(patch) {
  status = { ...status, ...patch, version: meta.version, dirty: meta.dirty, lastSync: meta.lastSync };
  statusListeners.forEach((l) => l());
}

export function useSyncStatus() {
  return useSyncExternalStore(
    (l) => {
      statusListeners.add(l);
      return () => statusListeners.delete(l);
    },
    () => status,
    () => status
  );
}

const hasData = (s) => !!s?.profile?.startDate || Object.keys(s?.days || {}).length > 0;

async function fetchWithTimeout(url, opts = {}, ms = 12000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, cache: 'no-store' });
  } finally {
    clearTimeout(t);
  }
}

export async function pull() {
  if (inflight) return;
  setStatus({ phase: 'syncing' });
  try {
    const res = await fetchWithTimeout('/api/state');
    if (res.status === 503) return setStatus({ phase: 'off', error: null });
    if (res.status === 401) return setStatus({ phase: 'error', error: 'Sesión caducada: vuelve a entrar.' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const remote = await res.json();
    lastPull = Date.now();
    const local = getState();

    if (!remote?.data) {
      meta.version = remote?.version || 0;
      if (hasData(local)) {
        meta.dirty = true;
        saveMeta();
        await push();
      } else {
        setStatus({ phase: 'ok', error: null });
      }
      return;
    }

    if (remote.version === meta.version && !meta.dirty) {
      meta.lastSync = Date.now();
      saveMeta();
      return setStatus({ phase: 'ok', error: null });
    }

    let merged;
    if (hasData(local)) {
      merged = mergeStates(local, remote.data);
      if (!sameData(merged, local)) backupLocal('antes de combinar con la nube');
    } else {
      merged = remote.data;
    }
    applyRemote(merged);
    meta.version = remote.version;
    meta.lastSync = Date.now();
    if (!sameData(merged, remote.data)) {
      meta.dirty = true;
      saveMeta();
      await push();
    } else {
      meta.dirty = false;
      saveMeta();
      setStatus({ phase: 'ok', error: null });
    }
  } catch (e) {
    setStatus({ phase: navigator.onLine === false ? 'offline' : 'error', error: e?.message || 'Sin conexión' });
    scheduleRetry();
  } finally {
    if (!status.initialDone) setStatus({ initialDone: true });
  }
}

export async function push({ keepalive = false } = {}) {
  if (inflight) {
    again = true;
    return;
  }
  inflight = true;
  const seq = localSeq;
  setStatus({ phase: 'syncing' });
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      const body = JSON.stringify({ data: getState(), baseVersion: meta.version });
      const res = await fetchWithTimeout('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: keepalive && body.length < 60000,
      });
      if (res.status === 503) {
        setStatus({ phase: 'off' });
        return;
      }
      if (res.status === 409) {
        const remote = await res.json();
        const merged = mergeStates(getState(), remote.data);
        applyRemote(merged);
        meta.version = remote.version;
        saveMeta();
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const r = await res.json();
      meta.version = r.version;
      meta.lastSync = Date.now();
      if (localSeq === seq) meta.dirty = false;
      saveMeta();
      setStatus({ phase: 'ok', error: null });
      return;
    }
    throw new Error('Demasiados conflictos seguidos');
  } catch (e) {
    setStatus({ phase: navigator.onLine === false ? 'offline' : 'error', error: e?.message || 'Sin conexión' });
    scheduleRetry();
  } finally {
    inflight = false;
    if (again || (meta.dirty && localSeq !== seq)) {
      again = false;
      schedulePush(800);
    }
  }
}

function schedulePush(delay = 1500) {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => push(), delay);
}

function scheduleRetry() {
  clearTimeout(retryTimer);
  retryTimer = setTimeout(() => (meta.dirty ? push() : pull()), 15000);
}

export function syncNow() {
  return meta.dirty ? push() : pull();
}

export function startSync() {
  if (started || typeof window === 'undefined') return;
  started = true;
  loadMeta();
  setStatus({});
  subscribeLocalChanges(() => {
    localSeq += 1;
    meta.dirty = true;
    saveMeta();
    setStatus({});
    schedulePush();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (meta.dirty) {
        clearTimeout(pushTimer);
        push({ keepalive: true });
      }
    } else if (Date.now() - lastPull > 10000) {
      meta.dirty ? push() : pull();
    }
  });
  window.addEventListener('online', () => (meta.dirty ? push() : pull()));
  setInterval(() => {
    if (document.visibilityState === 'visible' && !inflight && Date.now() - lastPull > 60000) pull();
  }, 30000);
  // Por si la red tarda mucho: no bloquear el arranque más de 8 s
  setTimeout(() => !status.initialDone && setStatus({ initialDone: true }), 8000);
  pull();
}
