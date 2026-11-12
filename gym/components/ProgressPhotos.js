'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from './Icon';
import { Sheet, useToast } from './ui';
import { todayISO, prettyDate, daysBetween } from '../lib/dates';
import styles from './ProgressPhotos.module.css';

// Fotos de progreso opcionales. Se comprimen en el móvil y se guardan solo en la nube (privadas).
const POSES = [
  { key: 'frente', label: 'Frente' },
  { key: 'perfil', label: 'Perfil' },
  { key: 'espalda', label: 'Espalda' },
];
const POSE_LABEL = { frente: 'Frente', perfil: 'Perfil', espalda: 'Espalda', otra: 'Otra' };
const MAX_SIDE = 1280;
const MAX_B64 = 2_900_000;

function newId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return `p${Date.now().toString(36)}${Array.from(bytes, (b) => (b % 36).toString(36)).join('')}`;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('No se pudo leer la imagen'));
    };
    img.src = url;
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] || '');
    r.onerror = () => reject(new Error('No se pudo procesar la imagen'));
    r.readAsDataURL(blob);
  });
}

// Reduce a 1280 px por el lado largo y JPEG ~0.82 (respetando la orientación EXIF)
async function compress(file) {
  let source;
  try {
    source = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    source = await loadImage(file);
  }
  const w0 = source.width;
  const h0 = source.height;
  const scale = Math.min(1, MAX_SIDE / Math.max(w0, h0));
  const w = Math.round(w0 * scale);
  const h = Math.round(h0 * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(source, 0, 0, w, h);
  if (source.close) source.close();
  for (const q of [0.82, 0.7, 0.55]) {
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', q));
    if (!blob) continue;
    const data = await blobToBase64(blob);
    if (data.length <= MAX_B64) return { data, mime: 'image/jpeg', previewUrl: URL.createObjectURL(blob) };
  }
  throw new Error('La foto es demasiado grande');
}

export default function ProgressPhotos() {
  const [toast, showToast] = useToast();
  const [photos, setPhotos] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ok | off | error
  const [loadError, setLoadError] = useState('');
  const [draft, setDraft] = useState(null); // { data, mime, previewUrl }
  const [pose, setPose] = useState('frente');
  const [date, setDate] = useState(todayISO());
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [view, setView] = useState(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePose, setComparePose] = useState('frente');
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const r = await fetch('/api/photos', { cache: 'no-store' });
      if (r.status === 503) {
        setStatus('off');
        setPhotos([]);
        return;
      }
      if (r.status === 401) throw new Error('Sesión caducada: vuelve a entrar.');
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
      setPhotos(Array.isArray(d.photos) ? d.photos : []);
      setStatus('ok');
    } catch (err) {
      setStatus('error');
      setLoadError(err?.message?.startsWith('Sesión') ? err.message : '');
      setPhotos([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => () => draft?.previewUrl && URL.revokeObjectURL(draft.previewUrl), [draft]);

  const groups = useMemo(() => {
    const m = new Map();
    for (const p of photos || []) {
      if (!m.has(p.takenOn)) m.set(p.takenOn, []);
      m.get(p.takenOn).push(p);
    }
    return [...m.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [photos]);

  const comparable = useMemo(() => {
    const by = {};
    for (const p of photos || []) (by[p.pose] = by[p.pose] || []).push(p);
    const out = {};
    for (const [k, arr] of Object.entries(by)) {
      if (arr.length < 2) continue;
      const sorted = [...arr].sort((a, b) => (a.takenOn < b.takenOn ? -1 : a.takenOn > b.takenOn ? 1 : 0));
      if (sorted[0].takenOn === sorted[sorted.length - 1].takenOn) continue;
      out[k] = { first: sorted[0], last: sorted[sorted.length - 1] };
    }
    return out;
  }, [photos]);

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.type && !file.type.startsWith('image/')) return showToast('Eso no es una imagen');
    setBusy(true);
    try {
      const c = await compress(file);
      setDraft(c);
      setDate(todayISO());
    } catch (err) {
      showToast(err.message || 'No se pudo procesar la foto');
    }
    setBusy(false);
  };

  const upload = async () => {
    if (!draft) return;
    setBusy(true);
    setProgress(0.15);
    const id = newId();
    const tick = setInterval(() => setProgress((p) => Math.min(0.9, p + 0.08)), 250);
    try {
      const r = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, takenOn: date, pose, mime: draft.mime, data: draft.data }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.status === 503) {
        setStatus('off');
        throw new Error('La nube no está configurada');
      }
      if (r.status === 401) throw new Error('Sesión caducada: vuelve a entrar.');
      if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
      setProgress(1);
      setPhotos((prev) => [{ id, takenOn: date, pose, bytes: Math.round((draft.data.length * 3) / 4) }, ...(prev || [])]);
      setDraft(null);
      showToast('Foto guardada 📸');
    } catch (err) {
      showToast(err.message || 'No se pudo subir la foto');
    } finally {
      clearInterval(tick);
      setBusy(false);
      setProgress(0);
    }
  };

  const remove = async (p) => {
    if (!confirm('¿Borrar esta foto? No se puede deshacer.')) return;
    try {
      const r = await fetch(`/api/photos/${encodeURIComponent(p.id)}`, { method: 'DELETE' });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `Error ${r.status}`);
      setPhotos((prev) => (prev || []).filter((x) => x.id !== p.id));
      setView(null);
      showToast('Foto borrada');
    } catch (err) {
      showToast(err.message || 'No se pudo borrar');
    }
  };

  const openCompare = () => {
    const keys = Object.keys(comparable);
    if (!keys.length) return;
    setComparePose(keys.includes(comparePose) ? comparePose : keys[0]);
    setCompareOpen(true);
  };

  const cmp = comparable[comparePose];
  const total = (photos || []).length;

  return (
    <div className="card" id="fotos" style={{ marginBottom: 12, scrollMarginTop: 20 }}>
      {toast}
      <div className="spread">
        <h3>Fotos de progreso</h3>
        <span className="tiny muted">opcional · {total} {total === 1 ? 'foto' : 'fotos'}</span>
      </div>

      {status === 'off' ? (
        <div className="hint" style={{ marginTop: 12 }}>
          <Icon name="info" size={18} />
          <span>La nube no está configurada, y las fotos se guardan solo ahí (no en el móvil), así que de momento no puedes subirlas.</span>
        </div>
      ) : status === 'error' ? (
        <div className="hint alert" style={{ marginTop: 12 }}>
          <Icon name="info" size={18} />
          <span>
            {loadError || 'No se pudieron cargar tus fotos.'}{' '}
            <button className="btn xs" onClick={() => { setStatus('loading'); load(); }}>
              Reintentar
            </button>
          </span>
        </div>
      ) : null}

      {draft ? (
        <div className="stack" style={{ marginTop: 12, gap: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={draft.previewUrl} alt="Vista previa" className={styles.preview} />
          <div className="chips">
            {POSES.map((p) => (
              <button key={p.key} type="button" className={`chip${pose === p.key ? ' on' : ''}`} onClick={() => setPose(p.key)} disabled={busy}>
                {p.label}
              </button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="photo-date">Fecha de la foto</label>
            <input id="photo-date" className="input sm" type="date" value={date} max={todayISO()} onChange={(e) => setDate(e.target.value || todayISO())} disabled={busy} />
          </div>
          {busy && progress > 0 && (
            <div className={styles.progress} aria-label="Subiendo">
              <i style={{ width: `${progress * 100}%` }} />
            </div>
          )}
          <div className="row">
            <button className="btn primary grow" onClick={upload} disabled={busy}>
              {busy ? 'Subiendo…' : 'Guardar foto'}
            </button>
            <button className="btn ghost" onClick={() => setDraft(null)} disabled={busy}>
              Cancelar
            </button>
          </div>
          <p className="tiny faint">Se guarda comprimida y privada en tu nube. Solo se ve dentro de la app con tu contraseña.</p>
        </div>
      ) : (
        <div className="row wrap" style={{ marginTop: 12 }}>
          <button className="btn primary sm" onClick={() => fileRef.current?.click()} disabled={busy || status === 'off' || status === 'loading'}>
            <Icon name="camera" size={15} /> {busy ? 'Procesando…' : 'Añadir foto'}
          </button>
          {Object.keys(comparable).length > 0 && (
            <button className="btn sm" onClick={openCompare}>
              <Icon name="swap" size={15} /> Comparar
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPick} />
        </div>
      )}

      {status === 'loading' && <p className="small muted" style={{ marginTop: 12 }}>Cargando fotos…</p>}

      {status !== 'loading' && total === 0 && !draft && status !== 'off' && (
        <div className="hint up" style={{ marginTop: 12 }}>
          <Icon name="camera" size={18} />
          <span>
            Las fotos enseñan el cambio mejor que la báscula. Truco: <b>cada 2 semanas</b>, por la <b>mañana</b> en ayunas, con la <b>misma luz y en el mismo sitio</b>.
            Frente, perfil y espalda, relajado y en bañador o calzoncillo.
          </span>
        </div>
      )}

      {groups.map(([d, list]) => (
        <div key={d}>
          <div className={styles.dateHead}>{prettyDate(d)}</div>
          <div className={styles.grid}>
            {list.map((p) => (
              <button key={p.id} className={styles.thumb} onClick={() => setView(p)} aria-label={`Ver foto ${POSE_LABEL[p.pose] || p.pose} del ${d}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/photos/${encodeURIComponent(p.id)}`} alt="" loading="lazy" decoding="async" />
                <span className={styles.tag}>{POSE_LABEL[p.pose] || p.pose}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <Sheet open={!!view} onClose={() => setView(null)} title={view ? `${POSE_LABEL[view.pose] || view.pose} · ${prettyDate(view.takenOn)}` : ''}>
        {view && (
          <div className="stack" style={{ gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/api/photos/${encodeURIComponent(view.id)}`} alt={`Foto ${POSE_LABEL[view.pose] || view.pose}`} className={styles.viewer} />
            <button className="btn danger" onClick={() => remove(view)}>
              <Icon name="x" size={15} /> Borrar foto
            </button>
          </div>
        )}
      </Sheet>

      <Sheet open={compareOpen} onClose={() => setCompareOpen(false)} title="Antes y ahora">
        <div className="stack" style={{ gap: 12 }}>
          <div className="chips">
            {POSES.filter((p) => comparable[p.key]).map((p) => (
              <button key={p.key} className={`chip${comparePose === p.key ? ' on' : ''}`} onClick={() => setComparePose(p.key)}>
                {p.label}
              </button>
            ))}
          </div>
          {cmp ? (
            <>
              <div className={styles.compare}>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/photos/${encodeURIComponent(cmp.first.id)}`} alt="Primera foto" />
                  <figcaption>{prettyDate(cmp.first.takenOn, { weekday: false })}</figcaption>
                </figure>
                <figure>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/photos/${encodeURIComponent(cmp.last.id)}`} alt="Última foto" />
                  <figcaption>{prettyDate(cmp.last.takenOn, { weekday: false })}</figcaption>
                </figure>
              </div>
              <p className="small muted center">{daysBetween(cmp.first.takenOn, cmp.last.takenOn)} días de diferencia</p>
            </>
          ) : (
            <p className="small muted">Necesitas al menos dos fotos de la misma pose en días distintos.</p>
          )}
        </div>
      </Sheet>
    </div>
  );
}
