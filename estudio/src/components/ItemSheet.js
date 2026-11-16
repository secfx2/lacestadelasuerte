"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import ProposeDialog from "./ProposeDialog";
import { useStudio } from "./Studio";
import { api, downloadHref, pendingRefs, previewDraft, fmt } from "@/lib/client";
import { BRANDS } from "@/config/brands";
import styles from "./Results.module.css";

const TOOL_LABEL = { logos: "Logos", ideas: "Ideas de ropa", prenda: "Prenda concreta" };

export function previewFrom(job, output) {
  const imgs = [];
  if (job.meta?.flatUrl && job.meta.flatUrl !== output.url) imgs.push({ url: job.meta.flatUrl, jobId: job.meta.flatJobId || null });
  imgs.push({ url: output.url, jobId: output.hfJobId || null });
  if (job.meta?.shot !== "model" && imgs.length === 1 && job.meta?.modelUrl) imgs.push({ url: job.meta.modelUrl });
  return {
    brand: job.brand,
    name: job.meta?.title || "",
    category: job.meta?.category || "",
    price: job.meta?.price || null,
    description: job.meta?.description || "",
    details: job.meta?.details || [],
    images: imgs,
    kind: job.meta?.kind || null,
    prompt: job.meta?.garment ? { garment: job.meta.garment, pose: job.meta.pose || "" } : null,
  };
}

/** Detalle de una imagen con todas las acciones. */
export default function ItemSheet({ item, onClose, onJobChange, onUseRef, extraActions, showNotes = false, showDelete = false, onDeleted }) {
  const router = useRouter();
  const { toast } = useStudio();
  const [notes, setNotes] = useState("");
  const [propose, setPropose] = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const job = item?.job;
  const out = item?.output;
  useEffect(() => {
    setNotes(out?.notes || "");
    setConfirmDel(false);
  }, [out?.url, out?.notes]);
  if (!item) return null;

  const patch = async (body) => {
    try {
      const d = await api(`/api/jobs/${job.id}`, { method: "PATCH", body: { k: out.k, ...body } });
      onJobChange?.(d.job);
    } catch (e) {
      toast(e.message, "err");
    }
  };
  const ref = { url: out.url, jobId: out.hfJobId || null };
  const useAsRef = () => {
    if (onUseRef) {
      onUseRef(ref);
      toast("Añadida a las referencias");
      onClose();
    } else {
      pendingRefs.push(ref);
      toast("Guardada: se añadirá en la próxima herramienta que abras");
    }
  };
  const del = async () => {
    try {
      await api(`/api/jobs/${job.id}?k=${out.k}`, { method: "DELETE" });
      toast("Imagen borrada");
      onDeleted?.(job, out);
      onClose();
    } catch (e) {
      toast(e.message, "err");
    }
  };

  return (
    <>
      <Modal open={Boolean(item) && !propose} onClose={onClose} title={job.meta?.title || TOOL_LABEL[job.tool] || "Imagen"} eyebrow={`${BRANDS[job.brand]?.name || ""} · ${TOOL_LABEL[job.tool] || ""}`} size="lg">
        <div className={styles.sheet}>
          <div className={styles.sheetImg} data-logo={job.role?.startsWith("logo") || undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={out.url} alt={job.meta?.title || "Imagen generada"} />
          </div>
          <div className="stack">
            <div className={styles.sheetActions}>
              <a className="btn" href={downloadHref(out)} download>Descargar</a>
              <button type="button" className="btn btn--ghost" aria-pressed={out.favourite} onClick={() => patch({ favourite: !out.favourite })}>
                {out.favourite ? "Quitar favorito" : "Favorito"}
              </button>
              <button type="button" className="btn btn--ghost" onClick={useAsRef}>Usar como referencia</button>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  previewDraft.set(previewFrom(job, out));
                  router.push("/vista");
                }}
              >
                Ver en la web
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setPropose(previewFrom(job, out))}>Proponer al catálogo</button>
              {extraActions?.(job, out, onClose)}
            </div>
            {!onUseRef && (
              <div className="row tiny muted">
                Usar en:
                {[["/logos", "Logos"], ["/ideas", "Ideas"], ["/prenda", "Prenda"], ["/nombres", "Nombres"]].map(([href, label]) => (
                  <button key={href} type="button" className="btn btn--xs btn--quiet" onClick={() => { pendingRefs.push(ref); router.push(href); }}>{label}</button>
                ))}
              </div>
            )}
            {showNotes && (
              <label className="field">
                <span className="label">Notas</span>
                <textarea className="textarea" value={notes} onChange={(e) => setNotes(e.target.value)} onBlur={() => notes !== (out.notes || "") && patch({ notes })} placeholder="Qué te gusta, qué cambiarías…" style={{ minHeight: 80 }} />
              </label>
            )}
            <details className={styles.meta}>
              <summary>Prompt y datos</summary>
              <p className="mono" style={{ whiteSpace: "pre-wrap" }}>{job.prompt}</p>
              <p className="tiny muted">
                {job.model} · {job.resolution || ""} · {job.aspect} · {fmt(job.perImage)} créditos/imagen · {new Date(job.createdAt).toLocaleString("es-ES")}
              </p>
            </details>
            {showDelete && (
              <div className="row">
                {!confirmDel ? (
                  <button type="button" className="btn btn--danger btn--sm" onClick={() => setConfirmDel(true)}>Borrar</button>
                ) : (
                  <>
                    <span className="small">¿Seguro? Se borra también del almacén.</span>
                    <button type="button" className="btn btn--danger btn--sm" onClick={del}>Sí, borrar</button>
                    <button type="button" className="btn btn--quiet btn--sm" onClick={() => setConfirmDel(false)}>No</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Modal>
      <ProposeDialog open={Boolean(propose)} initial={propose} onClose={() => setPropose(null)} />
    </>
  );
}
