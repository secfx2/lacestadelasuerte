"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import RefPicker from "@/components/RefPicker";
import CostLine from "@/components/CostLine";
import ErrorNote from "@/components/ErrorNote";
import JobResults from "@/components/JobResults";
import GalleryPicker from "@/components/GalleryPicker";
import { useStudio } from "@/components/Studio";
import { usePersisted } from "@/components/usePersisted";
import { api, emitUsage, store } from "@/lib/client";
import { BRANDS, kindForCategory } from "@/config/brands";
import { CASTINGS, castingPath, getCasting } from "@/config/castings";
import { flatLayPrompt, onModelPrompt } from "@/config/prompts";
import styles from "./garment.module.css";

const KINDS = [["garment", "Prenda"], ["accessory", "Accesorio"], ["jewellery", "Joyería"]];
const SHOTS = [["flat", "Flat lay"], ["model", "Con modelo"], ["both", "Ambas"]];

const EMPTY = { text: "", kind: "garment", shot: "both", garment: "", pose: "", casting: "", n: 1, name: "", category: "", description: "", details: [], price: null };

export default function Garment() {
  const { brand, toast } = useStudio();
  const [f, setF] = usePersisted("prenda.form", EMPTY);
  const [refs, setRefs] = useState([]);
  const [base, setBase] = usePersisted("prenda.base", null);
  const [jobs, setJobs] = usePersisted("prenda.jobs", [], { max: 16 });
  const [chain, setChain] = usePersisted("prenda.chain", null);
  const [improving, setImproving] = useState(false);
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [costFlat, setCostFlat] = useState(null);
  const [costModel, setCostModel] = useState(null);
  const [pickBase, setPickBase] = useState(false);
  const [customFlat, setCustomFlat] = useState(null);
  const [customModel, setCustomModel] = useState(null);
  const topRef = useRef(null);
  const b = BRANDS[brand];
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  // Prefill desde Ideas / Galería ("Foto con modelo")
  useEffect(() => {
    const p = store.get("prenda.prefill");
    if (!p) return;
    store.remove("prenda.prefill");
    setBase(p.base || null);
    setF((x) => ({ ...x, shot: "model", text: p.text || x.text, garment: p.garment || x.garment, pose: p.pose || x.pose, name: p.name || x.name, category: p.category || x.category, kind: p.kind || x.kind, description: p.text || x.description, details: p.details || x.details, price: p.price ?? x.price }));
    toast("Prenda cargada: elige casting y genera la foto con modelo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Casting por defecto según la marca
  const castings = useMemo(() => [...b.castings.map(getCasting), ...CASTINGS.filter((c) => !b.castings.includes(c.id))], [b]);
  const casting = getCasting(f.casting) || castings[0];

  const wantFlat = f.shot === "flat" || f.shot === "both";
  const wantModel = f.shot === "model" || f.shot === "both";
  const modelBase = f.shot === "model" ? base || refs[0] || null : null;
  const extraModelRefs = f.shot === "model" ? (base ? refs : refs.slice(1)).slice(0, 2) : [];

  const flatPrompt = customFlat ?? flatLayPrompt({ garment: f.garment || f.text, kind: f.kind, brand, hasRefs: refs.length > 0 });
  const modelPrompt = customModel ?? onModelPrompt({ casting, pose: f.pose, kind: f.kind, brand, extraRefs: f.shot === "model" ? extraModelRefs.length : 0 });

  async function improve() {
    setImproving(true);
    setErr(null);
    setNote(null);
    try {
      const imgs = [...(base ? [base] : []), ...refs].slice(0, 4);
      const { result } = await api("/api/text/improve", { method: "POST", body: { text: f.text, refs: imgs, kind: f.kind, shot: f.shot, brand, category: f.category } });
      setF((x) => ({ ...x, garment: result.garment_en, pose: result.styling_en, kind: result.kind || x.kind, name: result.name || x.name, category: result.category || x.category, description: result.description_es || x.description, details: result.details_es || x.details }));
      setCustomFlat(null);
      setCustomModel(null);
      setNote(result.notes_es || null);
      toast("Prompt mejorado: revísalo y edítalo si quieres");
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
    } finally {
      setImproving(false);
    }
  }

  const meta = (shot, extra = {}) => ({ shot, title: f.name || (shot === "model" ? "Foto con modelo" : "Flat lay"), category: f.category || "", kind: f.kind, description: f.description || f.text, details: f.details, price: f.price, garment: f.garment || f.text, pose: f.pose, ...extra });

  async function submitModel(baseRef, parentJobId) {
    const d = await api("/api/generate", {
      method: "POST",
      body: {
        tool: "prenda",
        role: "garmentRef",
        brand,
        items: [{ prompt: modelPrompt, refs: [baseRef, ...(parentJobId ? [] : extraModelRefs)], casting: casting.id, n: 1, meta: meta("model", { flatUrl: baseRef.url, flatJobId: baseRef.jobId || null, parentJobId: parentJobId || null, casting: casting.id }) }],
      },
    });
    setJobs((j) => [...d.jobs, ...j]);
    emitUsage();
  }

  async function generate() {
    setBusy(true);
    setErr(null);
    try {
      if (f.shot === "model") {
        if (!modelBase) throw new Error("Falta la imagen de la prenda: añade una referencia o elige un flat lay de la galería.");
        await submitModel(modelBase, null);
        toast("Generando la foto con modelo…");
      } else {
        const d = await api("/api/generate", {
          method: "POST",
          body: { tool: "prenda", role: "garment", brand, items: [{ prompt: flatPrompt, refs, n: f.n, meta: meta("flat") }] },
        });
        setJobs((j) => [...d.jobs, ...j]);
        if (f.shot === "both") setChain({ flatJobId: d.jobs[0].id, casting: casting.id, done: false });
        emitUsage();
        toast(f.shot === "both" ? "Primero el flat lay; luego la foto con modelo" : "Generando…");
      }
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
      emitUsage();
    } finally {
      setBusy(false);
    }
  }

  // "Ambas": cuando termina el flat lay, lanza la foto con modelo con el primero.
  useEffect(() => {
    if (!chain || chain.done) return;
    const flat = jobs.find((j) => j.id === chain.flatJobId);
    if (!flat) return;
    if (flat.outputs?.length && ["completed", "partial"].includes(flat.status)) {
      const o = flat.outputs[0];
      setChain({ ...chain, done: true });
      submitModel({ url: o.url, jobId: o.hfJobId || null }, flat.id).catch((e) => setErr({ error: "El flat lay está listo, pero la foto con modelo no se pudo enviar: " + e.message, detail: e.detail }));
    } else if (["failed", "nsfw"].includes(flat.status)) {
      setChain(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, chain]);

  const extra = (job, out, close) =>
    job.meta?.shot !== "model" ? (
      <button type="button" className="btn btn--ghost" onClick={() => { setBase({ url: out.url, jobId: out.hfJobId || null }); set("shot", "model"); close?.(); topRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
        Foto con modelo
      </button>
    ) : null;

  const canGo = (f.text.trim().length >= 3 || f.garment.trim().length >= 3 || refs.length > 0 || (f.shot === "model" && modelBase)) && !(costFlat && !costFlat.ok && wantFlat && f.shot !== "model") && !(costModel && !costModel.ok && f.shot === "model");

  return (
    <div className="page" ref={topRef}>
      <header className="page-head">
        <p className="eyebrow">04 · Imagen 4:5</p>
        <h1 className="h1">Prenda concreta</h1>
        <p className="lede">Describe una pieza con tus palabras. «Mejorar prompt» lo convierte en un prompt preciso en inglés que puedes editar.</p>
      </header>
      <div className="tool">
        <div className="tool-form stack">
          <label className="field">
            <span className="label">Describe la prenda</span>
            <textarea className="textarea" value={f.text} onChange={(e) => set("text", e.target.value)} maxLength={2000} placeholder="Una sudadera negra lavada, corta y ancha, con una calavera con rosas bordada grande en la espalda y los bajos deshilachados" />
          </label>
          <div className="field">
            <span className="label">Tipo</span>
            <div className="seg" role="radiogroup">
              {KINDS.map(([id, l]) => <button key={id} type="button" role="radio" aria-checked={f.kind === id} onClick={() => set("kind", id)}>{l}</button>)}
            </div>
          </div>
          <div className="field">
            <span className="label">Fotos</span>
            <div className="seg" role="radiogroup">
              {SHOTS.map(([id, l]) => <button key={id} type="button" role="radio" aria-checked={f.shot === id} onClick={() => set("shot", id)}>{l}</button>)}
            </div>
            <span className="hint">{b.photo === "concrete" ? "PECADO: flat lay sobre blanco y modelo frente a pared de hormigón." : "Flat lay cenital sobre blanco y modelo en estudio blanco."}</span>
          </div>

          {f.shot === "model" && (
            <div className="field">
              <span className="label">Imagen de la prenda (imagen 1)</span>
              {base ? (
                <div className={styles.base}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={base.url} alt="Prenda base" />
                  <div className="stack-sm">
                    <span className="small">Se usará esta prenda.</span>
                    <div className="row">
                      <button type="button" className="btn btn--xs btn--ghost" onClick={() => setPickBase(true)}>Cambiar</button>
                      <button type="button" className="btn btn--xs btn--quiet" onClick={() => setBase(null)}>Quitar</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="row">
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => setPickBase(true)}>Elegir flat lay de la galería</button>
                  <span className="hint">o sube una foto de la prenda abajo (la primera referencia).</span>
                </div>
              )}
              <GalleryPicker open={pickBase} onClose={() => setPickBase(false)} max={1} title="Elegir la prenda" onPick={(r) => r[0] && setBase(r[0])} />
            </div>
          )}

          <RefPicker refs={refs} onChange={setRefs} max={4} hint={f.shot === "model" && !base ? "La primera referencia es la prenda; el resto, estilo y ambiente." : "Fotos de prendas parecidas, gráficos, tejidos…"} />

          <button type="button" className="btn btn--ghost btn--block" onClick={improve} disabled={improving || (f.text.trim().length < 3 && !refs.length && !base)}>
            {improving ? <><span className="spin" /> Mejorando…</> : "Mejorar prompt (Claude, 0 créditos)"}
          </button>
          {note && <p className="notice">{note}</p>}

          <label className="field">
            <span className="label">Prompt de la prenda (inglés)</span>
            <textarea className="textarea code" value={f.garment} onChange={(e) => { set("garment", e.target.value); setCustomFlat(null); }} placeholder="Se rellena con «Mejorar prompt». Si lo dejas vacío se usa tu descripción tal cual." style={{ minHeight: 120 }} />
          </label>

          {wantModel && (
            <>
              <div className="field">
                <span className="label">Casting (imagen 2)</span>
                <div className={styles.castings} role="radiogroup" aria-label="Casting">
                  {castings.map((c) => (
                    <button key={c.id} type="button" role="radio" aria-checked={casting.id === c.id} className={styles.casting} onClick={() => { set("casting", c.id); setCustomModel(null); }} title={c.es}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={castingPath(c.id)} alt={`${c.name}: ${c.es}`} loading="lazy" />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
                <span className="hint">{casting.name}: {casting.es} · {casting.set === "concrete" ? "pared de hormigón" : "estudio blanco"} ({casting.from})</span>
              </div>
              <label className="field">
                <span className="label">Estilismo (inglés, opcional)</span>
                <textarea className="textarea code" value={f.pose} onChange={(e) => { set("pose", e.target.value); setCustomModel(null); }} placeholder="worn with ultra-wide black jeans, chunky skate shoes, silver chain, hands in pockets…" style={{ minHeight: 90 }} />
              </label>
            </>
          )}

          {wantFlat && f.shot !== "model" && (
            <div className="field">
              <span className="label">Variantes del flat lay</span>
              <div className="seg" role="radiogroup">
                {[1, 2, 3, 4].map((n) => <button key={n} type="button" role="radio" aria-checked={f.n === n} onClick={() => set("n", n)}>{n}</button>)}
              </div>
            </div>
          )}

          <details className="panel-tight">
            <summary className="caps" style={{ cursor: "pointer", minHeight: 32, display: "flex", alignItems: "center" }}>Ver prompts completos</summary>
            {wantFlat && f.shot !== "model" && (
              <label className="field" style={{ marginTop: 10 }}>
                <span className="label">Flat lay {customFlat != null && "(editado)"}</span>
                <textarea className="textarea code" style={{ minHeight: 150 }} value={flatPrompt} onChange={(e) => setCustomFlat(e.target.value)} />
              </label>
            )}
            {wantModel && (
              <label className="field" style={{ marginTop: 10 }}>
                <span className="label">Con modelo {customModel != null && "(editado)"}</span>
                <textarea className="textarea code" style={{ minHeight: 150 }} value={modelPrompt} onChange={(e) => setCustomModel(e.target.value)} />
              </label>
            )}
          </details>

          {f.shot !== "model" && <CostLine role="garment" n={f.n} hasRefs={refs.length > 0} onCost={setCostFlat} label="Flat lay" />}
          {wantModel && <CostLine role="garmentRef" n={1} hasRefs onCost={setCostModel} label="Con modelo" />}
          <ErrorNote {...(err || {})} />
          <button type="button" className="btn btn--big btn--block" onClick={generate} disabled={busy || !canGo}>
            {busy ? <><span className="spin" /> Enviando…</> : f.shot === "both" ? "Generar flat lay + modelo" : f.shot === "model" ? "Generar foto con modelo" : "Generar flat lay"}
          </button>
          {chain && !chain.done && <p className="notice pulse">Esperando al flat lay para hacer la foto con modelo…</p>}
        </div>
        <div className="stack">
          <div className="row-between">
            <h2 className="h2">Resultados</h2>
            {jobs.length > 0 && <button type="button" className="btn btn--xs btn--quiet" onClick={() => { setJobs([]); setChain(null); }}>Limpiar lista</button>}
          </div>
          <JobResults jobs={jobs} setJobs={setJobs} onUseRef={(r) => setRefs((x) => (x.some((y) => y.url === r.url) ? x : [...x, r].slice(0, 4)))} extraActions={extra} emptyText="Aquí aparecerán el flat lay y la foto con modelo." />
        </div>
      </div>
    </div>
  );
}
