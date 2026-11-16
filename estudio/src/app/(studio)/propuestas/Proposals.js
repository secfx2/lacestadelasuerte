"use client";
import { useEffect, useMemo, useState } from "react";
import { useStudio } from "@/components/Studio";
import { api, eur } from "@/lib/client";
import { exportJSON } from "@/lib/catalogExport";
import { BRANDS, BRAND_IDS, categoryName } from "@/config/brands";
import styles from "./proposals.module.css";

const STATUS = [["nueva", "Nueva"], ["aprobada", "Aprobada"], ["descartada", "Descartada"]];

function ProposalCard({ p, onChange, onDelete }) {
  const { toast } = useStudio();
  const [edit, setEdit] = useState(false);
  const [f, setF] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const save = async (body) => {
    try {
      const d = await api(`/api/proposals/${p.id}`, { method: "PATCH", body });
      onChange(d.proposal);
      return true;
    } catch (e) {
      toast(e.message, "err");
      return false;
    }
  };
  return (
    <article className={styles.card} data-status={p.status} data-testid="proposal">
      <div className={styles.imgs}>
        {(p.images || []).slice(0, 2).map((im) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={im.url} src={im.url} alt="" loading="lazy" />
        ))}
      </div>
      <div className={styles.body}>
        <p className="eyebrow">{BRANDS[p.brand]?.name} · {categoryName(p.brand, p.category)}</p>
        <h3 className={styles.name}>{p.name}</h3>
        <p className="small">{eur(p.price)} · {(p.sizes || []).join(" · ")}</p>
        {!edit && p.description && <p className="small muted">{p.description}</p>}
        {edit && f && (
          <div className="stack-sm">
            <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="Nombre" />
            <input className="input" type="number" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} aria-label="Precio" />
            <textarea className="textarea" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} aria-label="Descripción" />
            <textarea className="textarea" value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} aria-label="Detalles" style={{ minHeight: 80 }} />
            <div className="row">
              <button type="button" className="btn btn--sm" onClick={async () => (await save({ ...f, details: f.details.split("\n") })) && setEdit(false)}>Guardar</button>
              <button type="button" className="btn btn--sm btn--quiet" onClick={() => setEdit(false)}>Cancelar</button>
            </div>
          </div>
        )}
        <div className={`seg seg--block ${styles.status}`} role="radiogroup" aria-label="Estado">
          {STATUS.map(([id, l]) => <button key={id} type="button" role="radio" aria-checked={p.status === id} onClick={() => save({ status: id })}>{l}</button>)}
        </div>
        <textarea className="textarea" defaultValue={p.notes || ""} placeholder="Notas" style={{ minHeight: 60 }} onBlur={(e) => e.target.value !== (p.notes || "") && save({ notes: e.target.value })} aria-label="Notas" />
        <div className="row">
          {!edit && <button type="button" className="btn btn--xs btn--ghost" onClick={() => { setF({ name: p.name, price: p.price, description: p.description || "", details: (p.details || []).join("\n") }); setEdit(true); }}>Editar</button>}
          {!confirm ? (
            <button type="button" className="btn btn--xs btn--quiet" onClick={() => setConfirm(true)}>Borrar</button>
          ) : (
            <>
              <button type="button" className="btn btn--xs btn--danger" onClick={async () => { await api(`/api/proposals/${p.id}`, { method: "DELETE" }); onDelete(p.id); }}>Sí, borrar</button>
              <button type="button" className="btn btn--xs btn--quiet" onClick={() => setConfirm(false)}>No</button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default function Proposals() {
  const { brand: globalBrand, toast } = useStudio();
  const [list, setList] = useState(null);
  const [err, setErr] = useState(null);
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [exp, setExp] = useState({ brand: "", which: "aprobada" });
  const [json, setJson] = useState(null);

  useEffect(() => {
    api("/api/proposals").then((d) => setList(d.proposals)).catch((e) => setErr(e.message));
  }, []);
  useEffect(() => setExp((x) => ({ ...x, brand: x.brand || (globalBrand !== "nueva" ? globalBrand : "musketeer") })), [globalBrand]);

  const shown = useMemo(() => (list || []).filter((p) => (!brand || p.brand === brand) && (!status || p.status === status)), [list, brand, status]);
  const forExport = (list || []).filter((p) => p.brand === exp.brand && (exp.which === "todas" ? p.status !== "descartada" : p.status === "aprobada"));

  const change = (p) => setList((l) => l.map((x) => (x.id === p.id ? p : x)));

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">07 · Para el catálogo</p>
        <h1 className="h1">Propuestas</h1>
        <p className="lede">Lo que propones para cada marca. Apruébalo o descártalo y exporta el JSON para añadirlo al catálogo.</p>
      </header>
      <div className={styles.filters}>
        <select className="select" style={{ width: "auto", minWidth: 170 }} value={brand} onChange={(e) => setBrand(e.target.value)} aria-label="Marca">
          <option value="">Todas las marcas</option>
          {BRAND_IDS.map((id) => <option key={id} value={id}>{BRANDS[id].name}</option>)}
        </select>
        <div className="seg" role="radiogroup" aria-label="Estado">
          <button type="button" role="radio" aria-checked={!status} onClick={() => setStatus("")}>Todas</button>
          {STATUS.map(([id, l]) => <button key={id} type="button" role="radio" aria-checked={status === id} onClick={() => setStatus(id)}>{l}</button>)}
        </div>
      </div>
      {err && <p className="notice notice--err">{err}</p>}
      {!list && !err && <p className="muted pulse">Cargando…</p>}
      {list && !shown.length && <p className={styles.empty}>Sin propuestas todavía. Usa «Proponer al catálogo» en cualquier imagen.</p>}
      <div className={styles.grid}>
        {shown.map((p) => <ProposalCard key={p.id} p={p} onChange={change} onDelete={(id) => setList((l) => l.filter((x) => x.id !== id))} />)}
      </div>

      <section className="panel stack" style={{ marginTop: 36 }}>
        <div className="section-title"><h2 className="h2">Exportar al catálogo</h2></div>
        <p className="small muted">Genera entradas con el mismo esquema que <span className="mono">&lt;marca&gt;/src/data/catalog.json</span>. Las fotos se nombran <span className="mono">/products/&lt;slug&gt;/&lt;color&gt;-N.jpg</span>; la URL original de cada una va en <span className="mono">_estudio.sourceImages</span> para descargarla al fusionar.</p>
        <div className="row">
          <select className="select" style={{ width: "auto", minWidth: 170 }} value={exp.brand} onChange={(e) => setExp({ ...exp, brand: e.target.value })} aria-label="Marca a exportar">
            {BRAND_IDS.map((id) => <option key={id} value={id}>{BRANDS[id].name}</option>)}
          </select>
          <div className="seg" role="radiogroup">
            <button type="button" role="radio" aria-checked={exp.which === "aprobada"} onClick={() => setExp({ ...exp, which: "aprobada" })}>Solo aprobadas</button>
            <button type="button" role="radio" aria-checked={exp.which === "todas"} onClick={() => setExp({ ...exp, which: "todas" })}>Todas menos descartadas</button>
          </div>
          <button type="button" className="btn" onClick={() => setJson(exportJSON(forExport))} disabled={!forExport.length}>Exportar ({forExport.length})</button>
        </div>
        {json && (
          <>
            <textarea className="textarea code" readOnly value={json} style={{ minHeight: 260 }} data-testid="export-json" />
            <div className="row">
              <button type="button" className="btn btn--sm" onClick={() => { navigator.clipboard?.writeText(json); toast("JSON copiado"); }}>Copiar JSON</button>
              <a className="btn btn--sm btn--ghost" download={`propuestas-${exp.brand}.json`} href={`data:application/json;charset=utf-8,${encodeURIComponent(json)}`}>Descargar .json</a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
