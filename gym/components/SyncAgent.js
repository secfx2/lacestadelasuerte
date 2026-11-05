'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { startSync, useSyncStatus } from '../lib/sync';
import Icon from './Icon';

// Arranca la sincronización con la nube en cualquier página (excepto login)
export default function SyncAgent() {
  const path = usePathname() || '/';
  useEffect(() => {
    if (!path.startsWith('/login')) startSync();
  }, [path]);
  return null;
}

export function SyncBadge() {
  const st = useSyncStatus();
  if (st.phase === 'off' || st.phase === 'idle') return null;
  const map = {
    ok: st.dirty ? ['Guardando…', 'var(--amber)', 'cloud'] : ['Guardado', 'var(--green)', 'cloud'],
    syncing: ['Sincronizando…', 'var(--muted)', 'cloud'],
    offline: ['Sin conexión · guardado en el móvil', 'var(--amber)', 'cloudOff'],
    error: ['Sin sincronizar', 'var(--red)', 'cloudOff'],
  };
  const [label, color, icon] = map[st.phase] || map.syncing;
  return (
    <span className="pill" style={{ color, gap: 5 }} title={st.error || label}>
      <Icon name={icon} size={13} /> {label}
    </span>
  );
}
