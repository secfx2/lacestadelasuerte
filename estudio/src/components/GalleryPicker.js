"use client";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { api } from "@/lib/client";
import { BRANDS } from "@/config/brands";
import styles from "./RefPicker.module.css";

/** Elegir imágenes ya generadas (Galería). onPick([{ url, jobId }]) */
export default function GalleryPicker({ open, onClose, onPick, max = 4, title = "Elegir de la galería" }) {
  const [items, setItems] = useState(null);
  const [sel, setSel] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!open) return;
    setSel([]);
    setError(null);
    api("/api/jobs?type=images&limit=200")
      .then((d) => setItems(d.jobs.flatMap((j) => (j.outputs || []).map((o) => ({ key: `${j.id}-${o.k}`, url: o.url, jobId: o.hfJobId || null, brand: j.brand, tool: j.tool, fav: o.favourite, title: j.meta?.title || "" })))))
      .catch((e) => setError(e.message));
  }, [open]);
  const toggle = (it) => setSel((s) => (s.some((x) => x.key === it.key) ? s.filter((x) => x.key !== it.key) : s.length >= max ? s : [...s, it]));
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      eyebrow={`Hasta ${max}`}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn" disabled={!sel.length} onClick={() => { onPick(sel.map(({ url, jobId }) => ({ url, jobId }))); onClose(); }}>
            Añadir {sel.length ? `(${sel.length})` : ""}
          </button>
        </>
      }
    >
      {error && <p className="notice notice--err">{error}</p>}
      {!items && !error && <p className="muted pulse">Cargando…</p>}
      {items && !items.length && <p className="muted">Todavía no hay imágenes en la galería.</p>}
      {items && items.length > 0 && (
        <div className={styles.pickGrid}>
          {items.map((it) => {
            const on = sel.some((x) => x.key === it.key);
            return (
              <button key={it.key} type="button" className={styles.pickItem} aria-pressed={on} onClick={() => toggle(it)} title={it.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.url} alt={it.title || "Imagen generada"} loading="lazy" />
                <span className={styles.pickMeta}>{BRANDS[it.brand]?.name || ""}</span>
                {on && <span className={styles.pickCheck}>{sel.findIndex((x) => x.key === it.key) + 1}</span>}
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
