"use client";
import { useEffect, useRef, useState } from "react";
import ItemSheet from "./ItemSheet";
import ErrorNote from "./ErrorNote";
import { api, emitUsage, isTerminal } from "@/lib/client";
import styles from "./Results.module.css";

const STATUS = { submitting: "Enviando…", queued: "En cola", in_progress: "Generando…", completed: "Listo", partial: "Parcial", failed: "Ha fallado", nsfw: "Rechazado por moderación", canceled: "Cancelado" };

/** Sondea los trabajos no terminados cada ~4 s y avisa con onJob(job). */
export function useJobPolling(jobs, onJob) {
  const pending = jobs.filter((j) => !isTerminal(j.status)).map((j) => j.id).join(",");
  const cb = useRef(onJob);
  cb.current = onJob;
  useEffect(() => {
    if (!pending) return;
    let alive = true;
    const ids = pending.split(",");
    (async () => {
      await new Promise((r) => setTimeout(r, 2500));
      const left = new Set(ids);
      while (alive && left.size) {
        for (const id of [...left]) {
          if (!alive) return;
          try {
            const { job } = await api(`/api/jobs/${id}`);
            if (!alive) return;
            cb.current(job);
            if (isTerminal(job.status)) {
              left.delete(id);
              if (job.status !== "completed") emitUsage();
            }
          } catch (e) {
            if (e.status === 404) left.delete(id);
          }
        }
        await new Promise((r) => setTimeout(r, 3500));
      }
    })();
    return () => {
      alive = false;
    };
  }, [pending]);
}

export function Tile({ job, output, onOpen, onFav }) {
  return (
    <div className={styles.tile} data-logo={job.role?.startsWith("logo") || undefined}>
      <button type="button" className={styles.tileImg} onClick={onOpen} aria-label="Abrir imagen y acciones">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={output.url} alt={job.meta?.title || "Imagen generada"} loading="lazy" />
      </button>
      <button type="button" className={styles.star} aria-pressed={Boolean(output.favourite)} onClick={onFav} aria-label={output.favourite ? "Quitar de favoritos" : "Marcar favorito"}>
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill={output.favourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </button>
      <button type="button" className={styles.more} onClick={onOpen}>Acciones</button>
    </div>
  );
}

export function Placeholder({ job, req }) {
  const failed = ["failed", "nsfw", "canceled"].includes(req?.status);
  return (
    <div className={styles.tile} data-logo={job.role?.startsWith("logo") || undefined}>
      <div className={styles.ph} data-failed={failed || undefined}>
        {!failed && <span className="spin" />}
        <span className={styles.phText}>{STATUS[req?.status || job.status] || "…"}</span>
      </div>
    </div>
  );
}

/**
 * Resultados de una o varias generaciones. jobs: estado del padre.
 * setJobs(updater) para actualizar tras sondeo / favoritos.
 */
export default function JobResults({ jobs, setJobs, onUseRef, extraActions, compact = false, emptyText }) {
  const [open, setOpen] = useState(null);
  const update = (job) => setJobs((list) => list.map((j) => (j.id === job.id ? job : j)));
  useJobPolling(jobs, update);

  const fav = async (job, out) => {
    try {
      const d = await api(`/api/jobs/${job.id}`, { method: "PATCH", body: { k: out.k, favourite: !out.favourite } });
      update(d.job);
    } catch {}
  };

  if (!jobs.length) return emptyText ? <p className={styles.empty}>{emptyText}</p> : null;

  const openItem = open ? (() => {
    const j = jobs.find((x) => x.id === open.jobId);
    const o = j?.outputs?.find((x) => x.k === open.k);
    return j && o ? { job: j, output: o } : null;
  })() : null;

  return (
    <div className={styles.results} data-compact={compact || undefined}>
      {jobs.map((job) => {
        const reqs = job.requests?.length ? job.requests : Array.from({ length: job.n || 1 }, (_, k) => ({ k, status: job.status }));
        const failedAll = ["failed", "nsfw"].includes(job.status);
        return (
          <section key={job.id} className={styles.job} data-testid="job" data-status={job.status}>
            {!compact && (
              <header className={styles.jobHead}>
                <span className="caps">
                  {job.meta?.title || job.meta?.label || "Generación"}
                  {job.meta?.shot && <span className="muted"> · {job.meta.shot === "model" ? "Con modelo" : "Flat lay"}</span>}
                </span>
                <span className={`badge ${job.status === "completed" ? "badge--ok" : failedAll ? "badge--err" : job.status === "partial" ? "badge--warn" : ""}`}>
                  {!isTerminal(job.status) && <span className="spin" style={{ width: 10, height: 10, borderWidth: 1.5 }} />}
                  {STATUS[job.status] || job.status}
                </span>
              </header>
            )}
            <div className={styles.grid} data-logo={job.role?.startsWith("logo") || undefined}>
              {reqs.map((req) => {
                const out = job.outputs?.find((o) => o.k === req.k);
                if (out) return <Tile key={req.k} job={job} output={out} onOpen={() => setOpen({ jobId: job.id, k: out.k })} onFav={() => fav(job, out)} />;
                if ((job.deletedK || []).includes(req.k)) return null;
                return <Placeholder key={req.k} job={job} req={req} />;
              })}
            </div>
            {(failedAll || job.status === "partial") && job.error && (
              <ErrorNote error={job.status === "nsfw" ? "Higgsfield lo ha rechazado por moderación. Los créditos se han devuelto." : `No se ha podido generar${job.status === "partial" ? " alguna imagen" : ""}. Los créditos se han devuelto.`} detail={[job.error, job.errorDetail].filter(Boolean).join("\n\n")} />
            )}
            {job.warning && <p className="notice notice--warn">{job.warning}</p>}
            {job.pollError && <p className="tiny muted">Reintentando: {job.pollError}</p>}
          </section>
        );
      })}
      <ItemSheet item={openItem} onClose={() => setOpen(null)} onJobChange={update} onUseRef={onUseRef} extraActions={extraActions} />
    </div>
  );
}
