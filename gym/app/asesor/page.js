'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/Icon';
import Markdown from '../../components/Markdown';
import { PageSkeleton } from '../../components/ui';
import { getState, update, useHydrated } from '../../lib/store';
import { applyOps } from '../../lib/planOps';
import { todayISO } from '../../lib/dates';
import { buildAdvisorContext } from '../../lib/advisor';
import { getChat, getLocalKey, getModelPref, saveChat, setLocalKey, setModelPref } from '../../lib/advisorStore';

const TRAILER = '\u001e';

// Aplica en tus datos los cambios que ha hecho el asesor y devuelve lo necesario para deshacerlos
function applyChanges(ops) {
  const prev = getState();
  const undo = { custom: JSON.parse(JSON.stringify(prev.custom || {})), profile: {} };
  for (const o of ops) if (o.op === 'profile') for (const k of Object.keys(o.patch || {})) undo.profile[k] = prev.profile[k] ?? null;
  update((s) => {
    const r = applyOps(s.custom || {}, s.profile, ops, todayISO());
    s.custom = r.custom;
    s.profile = r.profile;
  });
  return undo;
}

function undoChanges(undo) {
  update((s) => {
    s.custom = undo.custom;
    for (const [k, v] of Object.entries(undo.profile || {})) {
      if (v === null) delete s.profile[k];
      else s.profile[k] = v;
    }
  });
}

const SUGGESTIONS = [
  '¿Cómo voy? Analiza mi progreso de estas semanas',
  'Hoy no me apetece la cena del menú, cámbiamela por otra cosa',
  'Quítame el aguacate y la fruta de todo el menú y recuérdalo',
  'El press francés me molesta en el codo, cámbialo por otro',
  'El press de hombro está ocupado, ¿qué hago?',
  'Esta noche ceno fuera con amigos, ¿qué pido?',
  'Me noto estancado en el peso, ¿qué ajusto?',
  '¿Qué ejercicios me ayudan más con los michelines y el culo?',
  'Hoy solo tengo 45 minutos, adáptame el entreno',
  '¿Qué creatina y proteína compro y cómo las tomo?',
  'Anoche dormí 5 horas, ¿cómo adapto el entreno de hoy?',
];

const MODELS = [
  { key: 'opus', label: 'Opus 5.5', sub: 'máxima calidad' },
  { key: 'sonnet', label: 'Sonnet 5.5', sub: 'más rápido y barato' },
];

export default function AsesorPage() {
  const hydrated = useHydrated();
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState('opus');
  const [serverKey, setServerKey] = useState(null);
  const [localKey, setLocalKeyState] = useState('');
  const [keyDraft, setKeyDraft] = useState('');
  const [error, setError] = useState('');
  const abortRef = useRef(null);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => {
    setMsgs(getChat());
    setModel(getModelPref());
    setLocalKeyState(getLocalKey());
    fetch('/api/coach')
      .then((r) => (r.ok ? r.json() : { serverKey: false }))
      .then((d) => setServerKey(!!d.serverKey))
      .catch(() => setServerKey(false));
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  if (!hydrated || serverKey === null) return <PageSkeleton />;
  const hasKey = serverKey || !!localKey;

  const send = async (textArg) => {
    const text = (textArg ?? input).trim();
    if (!text || busy) return;
    setError('');
    setInput('');
    if (taRef.current) taRef.current.style.height = '';
    const history = [...msgs, { role: 'user', content: text }];
    const withReply = [...history, { role: 'assistant', content: '' }];
    setMsgs(withReply);
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    let reply = '';
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(!serverKey && localKey ? { 'x-anthropic-key': localKey } : {}) },
        body: JSON.stringify({
          model,
          messages: history.slice(-24).map((m) => ({ role: m.role, content: m.content })),
          context: buildAdvisorContext(getState()),
          custom: getState().custom || {},
          profile: getState().profile,
          today: todayISO(),
        }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error === 'NO_KEY' ? 'Falta la API key.' : data.error || `Error ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        reply += dec.decode(value, { stream: true });
        setMsgs([...history, { role: 'assistant', content: reply.split(TRAILER)[0] }]);
      }
      // Cambios del plan que ha hecho el asesor (van al final de la respuesta)
      const [text, trailer] = reply.split(TRAILER);
      let extra = {};
      if (trailer) {
        try {
          const { ops, changes } = JSON.parse(trailer);
          if (Array.isArray(ops) && ops.length) extra = { changes: changes || [], undo: applyChanges(ops) };
        } catch {
          /* resumen ilegible: no se aplica nada */
        }
      }
      const final = [...history, { role: 'assistant', content: text || (extra.changes ? 'Hecho.' : '…'), ...extra }];
      setMsgs(final);
      saveChat(final);
    } catch (e) {
      if (e.name === 'AbortError') {
        const final = reply ? [...history, { role: 'assistant', content: reply.split(TRAILER)[0] + '\n\n_(parado)_' }] : history;
        setMsgs(final);
        saveChat(final);
      } else {
        setMsgs(history);
        saveChat(history);
        setError(e.message || 'No se pudo conectar');
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };

  // Solo se puede deshacer el último bloque de cambios (deshacer uno antiguo pisaría los posteriores)
  const lastChangeIdx = msgs.reduce((acc, m, i) => (m.changes?.length && !m.undone ? i : acc), -1);
  const undo = (i) => {
    const m = msgs[i];
    if (!m?.undo) return;
    undoChanges(m.undo);
    const next = msgs.map((x, j) => (j === i ? { ...x, undone: true } : x));
    setMsgs(next);
    saveChat(next);
  };

  const clear = () => {
    if (busy) abortRef.current?.abort();
    setMsgs([]);
    saveChat([]);
    setError('');
  };

  const saveKey = () => {
    const k = keyDraft.trim();
    if (!k.startsWith('sk-ant-')) {
      setError('Eso no parece una API key de Anthropic (empieza por sk-ant-).');
      return;
    }
    setLocalKey(k);
    setLocalKeyState(k);
    setKeyDraft('');
    setError('');
  };

  return (
    <>
      <header className="page-head" style={{ marginBottom: 10 }}>
        <div>
          <div className="eyebrow">Conoce tu plan y todos tus datos</div>
          <h1>Asesor IA</h1>
        </div>
        {msgs.length > 0 && (
          <button className="icon-btn" onClick={clear} aria-label="Nueva conversación" title="Nueva conversación">
            <Icon name="plus" size={18} />
          </button>
        )}
      </header>

      <div className="tabs" style={{ marginBottom: 12 }}>
        {MODELS.map((m) => (
          <button
            key={m.key}
            className={`tab${model === m.key ? ' on' : ''}`}
            onClick={() => {
              setModel(m.key);
              setModelPref(m.key);
            }}
            style={{ height: 'auto', padding: '7px 6px', lineHeight: 1.15 }}
          >
            {m.label}
            <span className="tiny muted" style={{ display: 'block', fontWeight: 500 }}>{m.sub}</span>
          </button>
        ))}
      </div>

      {!hasKey ? (
        <div className="card stack">
          <h3>Conecta tu API key de Claude</h3>
          <p className="small muted">
            Crea una key en <b>console.anthropic.com</b> → API Keys y pégala aquí. Se guarda <b>solo en este móvil</b> y se usa únicamente para hablar con el
            asesor.
          </p>
          <input className="input" type="password" autoComplete="off" placeholder="sk-ant-..." value={keyDraft} onChange={(e) => setKeyDraft(e.target.value)} />
          <button className="btn primary" onClick={saveKey} disabled={!keyDraft.trim()}>
            Guardar key
          </button>
          <p className="tiny faint">
            Para que funcione en todos tus dispositivos sin pegarla en cada uno: añade la variable <span className="kbd">ANTHROPIC_API_KEY</span> en Vercel → aesthetic-coach →
            Settings → Environment Variables y vuelve a desplegar.
          </p>
          {error && <div className="hint alert">{error}</div>}
        </div>
      ) : (
        <>
          <div className="chat">
            {msgs.length === 0 && (
              <div className="stack" style={{ gap: 10 }}>
                <div className="hint up">
                  <Icon name="sparkle" size={18} />
                  <span>
                    Pregúntame lo que quieras. Veo tu plan, tu peso, tus medidas, tus entrenos con kilos y repeticiones, lo que has comido, el agua y el sueño. Y si me lo pides, <b>cambio tu menú, tus recetas o tu rutina</b> directamente en la app.
                  </span>
                </div>
                <div className="row wrap" style={{ gap: 8 }}>
                  {SUGGESTIONS.map((q) => (
                    <button key={q} className="chip" style={{ height: 'auto', padding: '8px 12px', whiteSpace: 'normal', textAlign: 'left' }} onClick={() => send(q)}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`bubble ${m.role === 'user' ? 'me' : 'ai'}`}>
                {m.role === 'user' ? (
                  <p style={{ whiteSpace: 'pre-wrap' }}>{m.content}</p>
                ) : m.content ? (
                  <>
                    <Markdown text={m.content} />
                    {m.changes?.length > 0 && (
                      <div className="changes">
                        <div className="tiny" style={{ fontWeight: 700, color: m.undone ? 'var(--muted)' : 'var(--lime)', marginBottom: 4 }}>
                          {m.undone ? '↩︎ Cambios deshechos' : '✓ Cambios aplicados en tu plan'}
                        </div>
                        <ul className="tiny" style={{ margin: 0, paddingLeft: 16, textDecoration: m.undone ? 'line-through' : 'none' }}>
                          {m.changes.map((c, j) => (
                            <li key={j}>{c}</li>
                          ))}
                        </ul>
                        {!m.undone && i === lastChangeIdx && (
                          <button className="btn xs" style={{ marginTop: 8 }} onClick={() => undo(i)}>
                            Deshacer
                          </button>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <span className="typing" aria-label="Pensando">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </div>
            ))}
            {error && (
              <div className="hint alert">
                {error}{' '}
                {/key|401/i.test(error) && !serverKey && (
                  <button
                    className="btn xs"
                    onClick={() => {
                      setLocalKey('');
                      setLocalKeyState('');
                    }}
                  >
                    Cambiar key
                  </button>
                )}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <textarea
              ref={taRef}
              rows={1}
              className="input"
              placeholder="Pregunta a tu asesor…"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(140, e.target.scrollHeight)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              aria-label="Mensaje"
            />
            {busy ? (
              <button type="button" className="icon-btn" onClick={() => abortRef.current?.abort()} aria-label="Parar" style={{ background: 'var(--card-3)' }}>
                <Icon name="pause" size={18} />
              </button>
            ) : (
              <button type="submit" className="icon-btn" disabled={!input.trim()} aria-label="Enviar" style={{ background: 'var(--lime)', color: 'var(--lime-ink)', borderColor: 'transparent' }}>
                <Icon name="chevron" size={20} stroke={2.4} />
              </button>
            )}
          </form>
          <p className="tiny faint center" style={{ marginTop: 6 }}>
            {model === 'opus' ? 'Opus 5.5' : 'Sonnet 5.5'} · {serverKey ? 'key del servidor' : 'key guardada en este móvil'} · no sustituye a un médico ·{' '}
            <Link href="/ajustes" style={{ textDecoration: 'underline' }}>
              ajustes
            </Link>
          </p>
        </>
      )}
    </>
  );
}
