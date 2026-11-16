"use client";
import { useEffect, useMemo, useState } from "react";
import RefPicker from "@/components/RefPicker";
import CostLine from "@/components/CostLine";
import ErrorNote from "@/components/ErrorNote";
import JobResults from "@/components/JobResults";
import { useStudio } from "@/components/Studio";
import { usePersisted } from "@/components/usePersisted";
import { api, emitUsage } from "@/lib/client";
import { LOGO_STYLES, logoPrompt } from "@/config/prompts";

export default function Logos() {
  const { brand, toast } = useStudio();
  const [form, setForm] = usePersisted("logos.form", { name: "", description: "", styles: ["wordmark"], colors: "", n: 2, vector: false });
  const [refs, setRefs] = useState([]);
  const [jobs, setJobs] = usePersisted("logos.jobs", [], { max: 12 });
  const [custom, setCustom] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [cost, setCost] = useState(null);

  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("name");
    if (name) setForm((f) => ({ ...f, name: name.slice(0, 60) }));
  }, [setForm]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const auto = useMemo(() => logoPrompt({ name: form.name, description: form.description, styles: form.styles, colors: form.colors, brand, hasRefs: refs.length > 0 }), [form, brand, refs.length]);
  const prompt = custom ?? auto;
  const role = form.vector ? "logoVector" : "logo";

  async function generate() {
    setBusy(true);
    setErr(null);
    try {
      const d = await api("/api/generate", {
        method: "POST",
        body: { tool: "logos", role, brand, items: [{ prompt, refs, n: form.n, meta: { title: form.name ? `Logo ${form.name}` : "Logo", label: form.styles.join(" · ") } }] },
      });
      setJobs((j) => [...d.jobs, ...j]);
      emitUsage();
      toast("Generando logos…");
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
      emitUsage();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">02 · Imagen 1:1</p>
        <h1 className="h1">Logos</h1>
        <p className="lede">Logo plano sobre blanco, sin maquetas. Pide pocas variantes y repite con lo que te guste como referencia.</p>
      </header>
      <div className="tool">
        <div className="tool-form stack">
          <label className="field">
            <span className="label">Nombre de la marca</span>
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={60} placeholder="Mala Fama" />
            <span className="hint">Se pide escrito exactamente así. Revisa siempre las letras.</span>
          </label>
          <div className="field">
            <span className="label">Estilo</span>
            <div className="chips">
              {LOGO_STYLES.map((s) => (
                <button key={s.id} type="button" className="chip" aria-pressed={form.styles.includes(s.id)} onClick={() => set("styles", form.styles.includes(s.id) ? form.styles.filter((x) => x !== s.id) : [...form.styles, s.id].slice(-4))}>
                  {s.es}
                </button>
              ))}
            </div>
          </div>
          <label className="field">
            <span className="label">Qué quieres (opcional)</span>
            <textarea className="textarea" value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={800} placeholder="Letras góticas afiladas con una cruz pequeña sobre la i, aire de tatuaje fino…" />
          </label>
          <label className="field">
            <span className="label">Colores</span>
            <input className="input" value={form.colors} onChange={(e) => set("colors", e.target.value)} maxLength={80} placeholder="negro (por defecto) · burdeos y crudo…" />
          </label>
          <RefPicker refs={refs} onChange={setRefs} max={4} hint="Logos o letras que te gusten, bocetos a mano, fotos de tu cuaderno." />
          <div className="field">
            <span className="label">Variantes</span>
            <div className="seg" role="radiogroup">
              {[1, 2, 3, 4].map((n) => <button key={n} type="button" role="radio" aria-checked={form.n === n} onClick={() => set("n", n)}>{n}</button>)}
            </div>
          </div>
          <label className="check">
            <input type="checkbox" checked={form.vector} onChange={(e) => set("vector", e.target.checked)} />
            Versión vectorial (Recraft, bastante más cara)
          </label>
          <details className="panel-tight">
            <summary className="caps" style={{ cursor: "pointer", minHeight: 32, display: "flex", alignItems: "center" }}>Prompt final {custom != null && "(editado)"}</summary>
            <textarea className="textarea code" style={{ marginTop: 10, minHeight: 160 }} value={prompt} onChange={(e) => setCustom(e.target.value)} />
            {custom != null && <button type="button" className="btn btn--xs btn--quiet" onClick={() => setCustom(null)}>Volver al automático</button>}
          </details>
          <CostLine role={role} n={form.n} hasRefs={refs.length > 0} onCost={setCost} />
          <ErrorNote {...(err || {})} />
          <button type="button" className="btn btn--big btn--block" onClick={generate} disabled={busy || prompt.trim().length < 3 || (cost && !cost.ok)}>
            {busy ? <><span className="spin" /> Enviando…</> : `Generar ${form.n === 1 ? "logo" : `${form.n} logos`}`}
          </button>
        </div>
        <div className="stack">
          <div className="row-between">
            <h2 className="h2">Resultados</h2>
            {jobs.length > 0 && <button type="button" className="btn btn--xs btn--quiet" onClick={() => setJobs([])}>Limpiar lista</button>}
          </div>
          <JobResults jobs={jobs} setJobs={setJobs} onUseRef={(r) => setRefs((x) => (x.some((y) => y.url === r.url) ? x : [...x, r].slice(0, 4)))} emptyText="Aquí aparecerán los logos. Se guardan también en la Galería." />
        </div>
      </div>
    </div>
  );
}
