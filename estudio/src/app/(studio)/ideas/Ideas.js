"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import RefPicker from "@/components/RefPicker";
import CostLine from "@/components/CostLine";
import ErrorNote from "@/components/ErrorNote";
import JobResults from "@/components/JobResults";
import { useStudio } from "@/components/Studio";
import { usePersisted } from "@/components/usePersisted";
import { api, emitUsage, store } from "@/lib/client";
import { BRANDS, IDEA_CATEGORIES, kindForCategory } from "@/config/brands";
import { flatLayPrompt } from "@/config/prompts";
import styles from "./ideas.module.css";

let seq = 0;
const cid = () => `c${Date.now().toString(36)}${(seq++).toString(36)}`;

export function modelShotAction(router) {
  return function ModelShot(job, out, close) {
    if (job.meta?.shot === "model" || job.role?.startsWith("logo")) return null;
    return (
      <button
        type="button"
        className="btn btn--ghost"
        onClick={() => {
          store.set("prenda.prefill", {
            base: { url: out.url, jobId: out.hfJobId || null },
            text: job.meta?.description || "",
            garment: job.meta?.garment || "",
            pose: job.meta?.pose || "",
            name: job.meta?.title || "",
            category: job.meta?.category || "",
            kind: job.meta?.kind || "garment",
            price: job.meta?.price || null,
            details: job.meta?.details || [],
          });
          close?.();
          router.push("/prenda");
        }}
      >
        Foto con modelo
      </button>
    );
  };
}

function Card({ card, brand, onChange, onRemove, onUseRef, extra }) {
  const b = BRANDS[brand];
  const cats = [...new Map([...b.categories, ...IDEA_CATEGORIES].map((c) => [c.slug, c])).values()];
  const set = (k, v) => onChange({ ...card, [k]: v });
  const setJobs = useCallback((fn) => onChange((c) => ({ ...c, jobs: typeof fn === "function" ? fn(c.jobs || []) : fn })), [onChange]);
  return (
    <article className={styles.card} data-selected={card.selected || undefined} data-testid="idea-card">
      <div className={styles.cardTop}>
        <label className="check" style={{ minHeight: 44 }}>
          <input type="checkbox" checked={card.selected} onChange={(e) => set("selected", e.target.checked)} aria-label={`Seleccionar ${card.name}`} />
        </label>
        <input className={`input ${styles.nameInput}`} value={card.name} onChange={(e) => set("name", e.target.value)} aria-label="Nombre" />
        <button type="button" className="btn btn--xs btn--quiet" onClick={onRemove} aria-label="Quitar idea">Quitar</button>
      </div>
      <div className="row" style={{ alignItems: "stretch" }}>
        <select className="select" style={{ flex: "1 1 140px" }} value={card.category} onChange={(e) => onChange({ ...card, category: e.target.value, kind: kindForCategory(e.target.value) })} aria-label="Categoría">
          {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        <input className="input" style={{ flex: "0 1 110px" }} type="number" min="0" inputMode="decimal" value={card.price_eur ?? ""} onChange={(e) => set("price_eur", Number(e.target.value))} aria-label="Precio en euros" />
      </div>
      <textarea className="textarea" style={{ minHeight: 70 }} value={card.description_es} onChange={(e) => set("description_es", e.target.value)} aria-label="Descripción" />
      <details>
        <summary className="caps" style={{ cursor: "pointer", minHeight: 36, display: "flex", alignItems: "center", color: "var(--muted)" }}>Prompt de la foto (inglés)</summary>
        <textarea className="textarea code" style={{ minHeight: 150, marginTop: 6 }} value={card.prompt} onChange={(e) => set("prompt", e.target.value)} aria-label="Prompt en inglés" />
        <button type="button" className="btn btn--xs btn--quiet" onClick={() => set("prompt", flatLayPrompt({ garment: card.garment_en, kind: card.kind, brand }))}>Regenerar desde la descripción</button>
      </details>
      {card.jobs?.length > 0 && <JobResults jobs={card.jobs} setJobs={setJobs} compact onUseRef={onUseRef} extraActions={extra} />}
    </article>
  );
}

export default function Ideas() {
  const router = useRouter();
  const { brand, toast } = useStudio();
  const [form, setForm] = usePersisted("ideas.form", { theme: "", count: 4, categories: [], refsInPhotos: false });
  const [refs, setRefs] = useState([]);
  const [cards, setCards] = usePersisted("ideas.cards", []);
  const [busy, setBusy] = useState(false);
  const [gen, setGen] = useState(false);
  const [err, setErr] = useState(null);
  const [cost, setCost] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function expand() {
    setBusy(true);
    setErr(null);
    try {
      const d = await api("/api/text/ideas", { method: "POST", body: { theme: form.theme, count: form.count, categories: form.categories, refs, brand } });
      const fresh = d.concepts.map((c) => ({ ...c, id: cid(), selected: true, jobs: [], brand, prompt: flatLayPrompt({ garment: c.garment_en, kind: c.kind, brand }) }));
      setCards((cs) => [...fresh, ...cs.filter((c) => c.jobs?.length)].slice(0, 24));
      toast(`${fresh.length} ideas nuevas`);
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
    } finally {
      setBusy(false);
    }
  }

  const selected = cards.filter((c) => c.selected);
  const useRefs = form.refsInPhotos && refs.length > 0;

  async function generate() {
    setGen(true);
    setErr(null);
    try {
      const items = selected.map((c) => ({
        prompt: c.prompt,
        refs: useRefs ? refs : [],
        n: 1,
        meta: { title: c.name, category: c.category, kind: c.kind, description: c.description_es, details: c.details_es, price: c.price_eur, garment: c.garment_en, pose: c.styling_en, ideaId: c.id, shot: "flat" },
      }));
      const d = await api("/api/generate", { method: "POST", body: { tool: "ideas", role: "garment", brand, items } });
      setCards((cs) => cs.map((c) => {
        const mine = d.jobs.filter((j) => j.meta?.ideaId === c.id);
        return mine.length ? { ...c, jobs: [...mine, ...(c.jobs || [])], selected: false } : c;
      }));
      emitUsage();
      toast(`Generando ${d.jobs.length} ${d.jobs.length === 1 ? "foto" : "fotos"}…`);
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
      emitUsage();
    } finally {
      setGen(false);
    }
  }

  const updateCard = useCallback((id) => (next) => setCards((cs) => cs.map((c) => (c.id === id ? (typeof next === "function" ? next(c) : next) : c))), [setCards]);
  const extra = modelShotAction(router);
  const addRef = (r) => setRefs((x) => (x.some((y) => y.url === r.url) ? x : [...x, r].slice(0, 4)));

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">03 · Claude + imagen 4:5</p>
        <h1 className="h1">Ideas de ropa</h1>
        <p className="lede">Paso 1: un tema y salen fichas de prendas que puedes editar. Paso 2: eliges cuáles y se hacen las fotos de producto.</p>
      </header>
      <div className="tool">
        <div className="tool-form stack">
          <label className="field">
            <span className="label">Tema</span>
            <textarea className="textarea" value={form.theme} onChange={(e) => set("theme", e.target.value)} maxLength={1500} placeholder="Colección de invierno inspirada en las verbenas de pueblo: lentejuelas, cuadros vichy, flores bordadas…" />
          </label>
          <div className="field">
            <span className="label">Cuántas ideas</span>
            <div className="seg" role="radiogroup">
              {[4, 6, 8].map((n) => <button key={n} type="button" role="radio" aria-checked={form.count === n} onClick={() => set("count", n)}>{n}</button>)}
            </div>
          </div>
          <div className="field">
            <span className="label">Mezcla de categorías</span>
            <div className="chips">
              {IDEA_CATEGORIES.map((c) => (
                <button key={c.slug} type="button" className="chip" aria-pressed={form.categories.includes(c.slug)} onClick={() => set("categories", form.categories.includes(c.slug) ? form.categories.filter((x) => x !== c.slug) : [...form.categories, c.slug])}>{c.name}</button>
              ))}
            </div>
            <span className="hint">Sin marcar: mezcla libre.</span>
          </div>
          <RefPicker refs={refs} onChange={setRefs} max={4} hint="Moodboard, prendas que te gusten, gráficos…" />
          {refs.length > 0 && (
            <label className="check">
              <input type="checkbox" checked={form.refsInPhotos} onChange={(e) => set("refsInPhotos", e.target.checked)} />
              Usar las referencias también en las fotos
            </label>
          )}
          <ErrorNote {...(err || {})} />
          <button type="button" className="btn btn--big btn--block btn--ghost" onClick={expand} disabled={busy || (form.theme.trim().length < 3 && !refs.length)}>
            {busy ? <><span className="spin" /> Pensando prendas…</> : "1 · Proponer ideas"}
          </button>
          <p className="hint">Las ideas son texto (Claude): 0 créditos.</p>
        </div>

        <div className="stack">
          <div className="row-between">
            <h2 className="h2">Fichas</h2>
            {cards.length > 0 && (
              <div className="row">
                <button type="button" className="btn btn--xs btn--quiet" onClick={() => setCards((cs) => cs.map((c) => ({ ...c, selected: true })))}>Todas</button>
                <button type="button" className="btn btn--xs btn--quiet" onClick={() => setCards((cs) => cs.map((c) => ({ ...c, selected: false })))}>Ninguna</button>
                <button type="button" className="btn btn--xs btn--quiet" onClick={() => setCards([])}>Vaciar</button>
              </div>
            )}
          </div>
          {busy && <p className="notice pulse">Claude está diseñando prendas…</p>}
          {!cards.length && !busy && <p className={styles.empty}>Aquí aparecerán las fichas para editar.</p>}
          <div className={styles.grid}>
            {cards.map((c) => (
              <Card key={c.id} card={c} brand={c.brand || brand} onChange={updateCard(c.id)} onRemove={() => setCards((cs) => cs.filter((x) => x.id !== c.id))} onUseRef={addRef} extra={extra} />
            ))}
          </div>
          {cards.length > 0 && (
            <div className={styles.bar}>
              <CostLine role="garment" n={selected.length} hasRefs={useRefs} onCost={setCost} label={`${selected.length} ${selected.length === 1 ? "foto" : "fotos"}`} />
              <button type="button" className="btn btn--big btn--block" onClick={generate} disabled={gen || !selected.length || (cost && !cost.ok)}>
                {gen ? <><span className="spin" /> Enviando…</> : `2 · Generar imágenes (${selected.length})`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
