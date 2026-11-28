'use client';

// QA de animaciones 3D.
//  /dev/anim                 → rejilla paginada de todos los patrones (?page=N)
//  /dev/anim?p=<key>&t=0..1  → un único patrón congelado en ese progreso (capturas)
//  /dev/anim?p=<key>         → un único patrón animado
import { use } from 'react';
import Exercise3D from '@/components/Exercise3D';
import { PATTERN_KEYS } from '@/lib/anim/patterns';
import { EXERCISES } from '@/lib/exercises';

const PER_PAGE = 6;

function musclesFor(key) {
  const ex = EXERCISES.find((e) => e.anim === key);
  return { primary: ex?.primary || [], secondary: ex?.secondary || [], name: ex?.name || key };
}

export default function AnimQA({ searchParams }) {
  const sp = use(searchParams) || {};
  const p = typeof sp.p === 'string' ? sp.p : null;
  const t = sp.t !== undefined ? Number(sp.t) : undefined;
  const page = Math.max(0, Number(sp.page || 0) || 0);

  const shell = { minHeight: '100vh', background: '#0b0b10', color: '#f2f2f5', padding: 16, fontFamily: 'system-ui, sans-serif' };

  if (p) {
    const m = musclesFor(p);
    return (
      <main style={shell}>
        <div id="qa-single" style={{ width: Number(sp.w || 640), maxWidth: '100%' }}>
          <Exercise3D anim={p} primary={m.primary} secondary={m.secondary} freezeAt={t} showControls={sp.controls === '1'} />
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>
            {p} · {m.name} {t !== undefined ? `· t=${t}` : ''}
          </div>
        </div>
      </main>
    );
  }

  const keys = PATTERN_KEYS.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const pages = Math.ceil(PATTERN_KEYS.length / PER_PAGE);
  return (
    <main style={shell}>
      <h1 style={{ fontSize: 18, margin: '0 0 12px' }}>
        Animaciones 3D · página {page + 1}/{pages} ({PATTERN_KEYS.length} patrones)
      </h1>
      <nav style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {Array.from({ length: pages }, (_, i) => (
          <a key={i} href={`/dev/anim?page=${i}`} style={{ color: i === page ? '#c8ff3d' : '#9aa0ad' }}>
            {i + 1}
          </a>
        ))}
      </nav>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {keys.map((k) => {
          const m = musclesFor(k);
          return (
            <div key={k}>
              <Exercise3D anim={k} primary={m.primary} secondary={m.secondary} />
              <div style={{ marginTop: 6, fontSize: 13 }}>
                <a href={`/dev/anim?p=${k}&controls=1`} style={{ color: '#c8ff3d' }}>
                  {k}
                </a>{' '}
                <span style={{ opacity: 0.6 }}>· {m.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
