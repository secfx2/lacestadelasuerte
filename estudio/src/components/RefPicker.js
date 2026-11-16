"use client";
import { useEffect, useRef, useState } from "react";
import GalleryPicker from "./GalleryPicker";
import { pendingRefs, uploadRef } from "@/lib/client";
import { useStudio } from "./Studio";
import styles from "./RefPicker.module.css";

/**
 * Imágenes de referencia: arrastrar y soltar, cámara, subir o elegir de la
 * Galería. Se redimensionan en el navegador (2048 px, JPEG 0,9) antes de subir.
 * refs: [{ url, jobId? }]
 */
export default function RefPicker({ refs, onChange, max = 4, label = "Referencias (opcional)", hint, absorbPending = true, testId = "refs" }) {
  const { toast } = useStudio();
  const [busy, setBusy] = useState(0);
  const [drag, setDrag] = useState(false);
  const [gallery, setGallery] = useState(false);
  const fileRef = useRef(null);
  const camRef = useRef(null);
  const refsRef = useRef(refs);
  refsRef.current = refs;

  useEffect(() => {
    if (!absorbPending) return;
    const p = pendingRefs.take();
    if (p.length) {
      const merged = [...refsRef.current];
      for (const r of p) if (!merged.some((x) => x.url === r.url) && merged.length < max) merged.push(r);
      onChange(merged);
      toast(`${p.length === 1 ? "Referencia añadida" : `${p.length} referencias añadidas`}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const add = (items) => {
    const cur = refsRef.current;
    const merged = [...cur];
    for (const r of items) if (!merged.some((x) => x.url === r.url) && merged.length < max) merged.push(r);
    if (cur.length + items.length > max) toast(`Máximo ${max} referencias`, "err");
    onChange(merged);
  };

  async function handleFiles(list) {
    const files = Array.from(list || []).filter((f) => /^image\//.test(f.type) || /\.(heic|heif)$/i.test(f.name));
    if (!files.length) return;
    const room = max - refsRef.current.length;
    if (room <= 0) {
      toast(`Máximo ${max} referencias`, "err");
      return;
    }
    const take = files.slice(0, room);
    setBusy((b) => b + take.length);
    for (const f of take) {
      try {
        const r = await uploadRef(f);
        add([r]);
      } catch (e) {
        toast(e.message || "No se pudo subir la imagen", "err");
      } finally {
        setBusy((b) => b - 1);
      }
    }
  }

  return (
    <div className="field" data-testid={testId}>
      <span className="label">{label}</span>
      <div
        className={styles.zone}
        data-drag={drag || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        {(refs.length > 0 || busy > 0) && (
          <ul className={styles.thumbs}>
            {refs.map((r, i) => (
              <li key={r.url} className={styles.thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.url} alt={`Referencia ${i + 1}`} />
                <span className={styles.num}>{i + 1}</span>
                <button type="button" className={styles.remove} onClick={() => onChange(refs.filter((x) => x.url !== r.url))} aria-label={`Quitar referencia ${i + 1}`}>
                  <span aria-hidden="true" />
                </button>
              </li>
            ))}
            {Array.from({ length: busy }).map((_, i) => (
              <li key={"b" + i} className={`${styles.thumb} ${styles.loading}`}>
                <span className="spin" />
              </li>
            ))}
          </ul>
        )}
        <div className={styles.actions}>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => fileRef.current?.click()} disabled={refs.length >= max}>
            Subir fotos
          </button>
          <button type="button" className={`btn btn--ghost btn--sm ${styles.camOnly}`} onClick={() => camRef.current?.click()} disabled={refs.length >= max}>
            Cámara
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setGallery(true)} disabled={refs.length >= max}>
            De la galería
          </button>
          <span className={styles.dropHint}>o arrastra aquí · {refs.length}/{max}</span>
        </div>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
        <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }} />
      </div>
      {hint && <span className="hint">{hint}</span>}
      <GalleryPicker open={gallery} onClose={() => setGallery(false)} max={Math.max(1, max - refs.length)} onPick={add} />
    </div>
  );
}
