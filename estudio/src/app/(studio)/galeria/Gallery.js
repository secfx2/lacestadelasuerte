"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ItemSheet from "@/components/ItemSheet";
import ErrorNote from "@/components/ErrorNote";
import { Tile, Placeholder, useJobPolling } from "@/components/JobResults";
import { api, isTerminal } from "@/lib/client";
import { BRANDS, BRAND_IDS } from "@/config/brands";
import { modelShotAction } from "@/components/modelShot";
import r from "@/components/Results.module.css";
import styles from "./gallery.module.css";

const TOOLS = [["", "Todo"], ["logos", "Logos"], ["ideas", "Ideas"], ["prenda", "Prenda"]];

export default function Gallery() {
  const router = useRouter();
  const [jobs, setJobs] = useState(null);
  const [err, setErr] = useState(null);
  const [tool, setTool] = useState("");
  const [brand, setBrand] = useState("");
  const [fav, setFav] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api("/api/jobs?type=images&limit=300").then((d) => setJobs(d.jobs)).catch((e) => setErr(e.message));
  }, []);
  const update = (job) => setJobs((list) => list.map((j) => (j.id === job.id ? job : j)));
  useJobPolling(jobs || [], update);

  const filtered = useMemo(() => (jobs || []).filter((j) => (!tool || j.tool === tool) && (!brand || j.brand === brand)), [jobs, tool, brand]);
  const items = filtered.flatMap((j) => (j.outputs || []).filter((o) => !fav || o.favourite).map((o) => ({ job: j, output: o })));
  const pending = fav ? [] : filtered.filter((j) => !isTerminal(j.status));
  const failed = filtered.filter((j) => ["failed", "nsfw"].includes(j.status));
  const openItem = open ? items.find((x) => x.job.id === open.jobId && x.output.k === open.k) : null;

  const toggleFav = async (job, out) => {
    try {
      const d = await api(`/api/jobs/${job.id}`, { method: "PATCH", body: { k: out.k, favourite: !out.favourite } });
      update(d.job);
    } catch {}
  };

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">06 · Todo lo generado</p>
        <h1 className="h1">Galería</h1>
        <p className="lede">Toca una imagen para descargarla, marcarla, apuntar notas, usarla como referencia o verla en la web.</p>
      </header>
      <div className={styles.filters}>
        <div className="seg" role="radiogroup" aria-label="Herramienta">
          {TOOLS.map(([id, l]) => <button key={id} type="button" role="radio" aria-checked={tool === id} onClick={() => setTool(id)}>{l}</button>)}
        </div>
        <select className="select" style={{ width: "auto", minWidth: 170 }} value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Marca">
          <option value="">Todas las marcas</option>
          {BRAND_IDS.map((id) => <option key={id} value={id}>{BRANDS[id].name}</option>)}
        </select>
        <button type="button" className="chip" aria-pressed={fav} onClick={() => setFav((v) => !v)}>Favoritos</button>
        {failed.length > 0 && <button type="button" className="chip" aria-pressed={showFailed} onClick={() => setShowFailed((v) => !v)}>Con errores ({failed.length})</button>}
        <span className="tiny muted">{items.length} {items.length === 1 ? "imagen" : "imágenes"}</span>
      </div>
      {err && <p className="notice notice--err">{err}</p>}
      {!jobs && !err && <p className="muted pulse">Cargando…</p>}
      {jobs && !items.length && !pending.length && <p className={r.empty}>{fav ? "Todavía no hay favoritos." : "Aquí aparecerá todo lo que generes."}</p>}
      <div className={styles.grid}>
        {pending.map((j) => <Placeholder key={j.id} job={j} req={{ status: j.status }} />)}
        {items.map(({ job, output }) => (
          <div key={`${job.id}-${output.k}`} className={styles.cell}>
            <Tile job={job} output={output} onOpen={() => setOpen({ jobId: job.id, k: output.k })} onFav={() => toggleFav(job, output)} />
            <p className={styles.caption}>
              <span>{job.meta?.title || "—"}</span>
              <span className="muted">{BRANDS[job.brand]?.name}</span>
            </p>
            {output.notes && <p className={styles.note}>{output.notes}</p>}
          </div>
        ))}
      </div>
      {showFailed && (
        <div className="stack" style={{ marginTop: 28 }}>
          <h2 className="h2">Con errores</h2>
          {failed.map((j) => (
            <div key={j.id} className="panel-tight stack-sm">
              <span className="caps">{j.meta?.title || j.tool} · {new Date(j.createdAt).toLocaleString("es-ES")}</span>
              <ErrorNote error={j.status === "nsfw" ? "Rechazado por moderación (créditos devueltos)." : "Ha fallado (créditos devueltos)."} detail={[j.error, j.errorDetail].filter(Boolean).join("\n\n")} />
              <button type="button" className="btn btn--xs btn--quiet" style={{ alignSelf: "flex-start" }} onClick={async () => { await api(`/api/jobs/${j.id}`, { method: "DELETE" }); setJobs((l) => l.filter((x) => x.id !== j.id)); }}>Borrar</button>
            </div>
          ))}
        </div>
      )}
      <ItemSheet
        item={openItem}
        onClose={() => setOpen(null)}
        onJobChange={update}
        showNotes
        showDelete
        extraActions={modelShotAction(router)}
        onDeleted={(job, out) => setJobs((l) => l.map((j) => (j.id === job.id ? { ...j, outputs: (j.outputs || []).filter((o) => o.k !== out.k) } : j)).filter((j) => (j.outputs || []).length || !isTerminal(j.status)))}
      />
    </div>
  );
}
