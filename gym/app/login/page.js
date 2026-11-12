'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Icon from '../../components/Icon';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}

function Login() {
  const params = useSearchParams();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw, next: params.get('next') || '/' }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        window.location.href = data.next || '/';
        return;
      }
      setErr(data.error || 'No se pudo entrar');
    } catch {
      setErr('Sin conexión');
    }
    setBusy(false);
  };
  return (
    <div style={{ minHeight: '80dvh', display: 'grid', placeItems: 'center' }}>
      <form onSubmit={submit} className="card stack" style={{ width: 'min(400px, 100%)', padding: 24, gap: 16 }}>
        <div className="center stack" style={{ gap: 10, alignItems: 'center' }}>
          <img src="/icon-192.png" alt="" width={64} height={64} style={{ borderRadius: 18 }} />
          <h1 style={{ fontSize: 26 }}>Aesthetic Coach</h1>
          <p className="small muted">Página privada. Introduce tu contraseña.</p>
        </div>
        <div className="field">
          <label htmlFor="pw">Contraseña</label>
          <input id="pw" className="input" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus />
        </div>
        {err && <div className="hint alert">{err}</div>}
        <button className="btn primary block" disabled={busy || !pw} style={{ height: 50 }}>
          <Icon name="lock" size={16} /> {busy ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
