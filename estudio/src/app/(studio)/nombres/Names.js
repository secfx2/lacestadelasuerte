"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import RefPicker from "@/components/RefPicker";
import ErrorNote from "@/components/ErrorNote";
import { useStudio } from "@/components/Studio";
import { api, store } from "@/lib/client";
import { BRANDS } from "@/config/brands";
import styles from "./names.module.css";

const STYLES = ["calle", "lujo", "gótico", "minimal", "divertido", "retro", "deportivo", "romántico", "futurista", "y2k", "artesanal", "irónico"];
const LANGS = [["es", "Español"], ["en", "Inglés"], ["mix", "Mezcla"]];

function NameCard({ n, onFav }) {
  const { toast } = useStudio();
  return (
    <article className={styles.card} data-testid="name-card">
      <div className={styles.cardHead}>
        <h3 className={styles.name}>{n.name}</h3>
        <button type="button" className={styles.fav} aria-pressed={Boolean(n.favourite)} onClick={onFav} aria-label={n.favourite ? "Quitar de favoritos" : "Favorito"}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z" fill={n.favourite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
        </button>
      </div>
      {n.tagline && <p className={styles.tagline}>{n.tagline}</p>}
      <p className={styles.why}>{n.why}</p>
      <div className="row">{(n.vibe || []).map((v) => <span key={v} className="badge">{v}</span>)}</div>
      <p className={styles.handles}>
        <span>{n.handle}</span>
        {(n.domains || []).map((d) => <span key={d}>{d}</span>)}
      </p>
      <p className={styles.caution}>{n.caution || "Comprobar registro de marca (OEPM / EUIPO) antes de usarlo."}</p>
      <div className={styles.cardActions}>
        <Link className="btn btn--sm" href={`/logos?name=${encodeURIComponent(n.name)}`}>Generar logo con este nombre</Link>
        <button type="button" className="btn btn--sm btn--quiet" onClick={() => { navigator.clipboard?.writeText(n.name); toast("Copiado"); }}>Copiar</button>
      </div>
    </article>
  );
}

export default function Names() {
  const { brand, toast } = useStudio();
  const [idea, setIdea] = useState("");
  const [refs, setRefs] = useState([]);
  const [count, setCount] = useState(8);
  const [lang, setLang] = useState("es");
  const [styleSel, setStyleSel] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);
  const [onlyFav, setOnlyFav] = useState(false);

  useEffect(() => {
    const d = store.get("names.form");
    if (d) {
      setIdea(d.idea || "");
      setCount(d.count || 8);
      setLang(d.lang || "es");
      setStyleSel(d.styles || []);
    }
    api("/api/jobs?type=names&limit=60").then((r) => {
      setHistory(r.jobs);
      if (r.jobs[0]) setCurrent(r.jobs[0].id);
    }).catch(() => {});
  }, []);
  useEffect(() => store.set("names.form", { idea, count, lang, styles: styleSel }), [idea, count, lang, styleSel]);

  async function generate() {
    setBusy(true);
    setErr(null);
    try {
      const { job } = await api("/api/text/names", { method: "POST", body: { idea, refs, count, lang, styles: styleSel, brand } });
      setHistory((h) => [job, ...h]);
      setCurrent(job.id);
      setOnlyFav(false);
      toast(`${job.names.length} nombres nuevos`);
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
    } finally {
      setBusy(false);
    }
  }

  async function fav(job, i) {
    const n = job.names[i];
    try {
      const d = await api(`/api/jobs/${job.id}`, { method: "PATCH", body: { nameIndex: i, favourite: !n.favourite } });
      setHistory((h) => h.map((j) => (j.id === job.id ? d.job : j)));
    } catch (e) {
      toast(e.message, "err");
    }
  }

  const cur = history.find((j) => j.id === current);
  const favs = history.flatMap((j) => (j.names || []).map((n, i) => ({ n, i, job: j })).filter((x) => x.n.favourite));
  const list = onlyFav ? favs : cur ? cur.names.map((n, i) => ({ n, i, job: cur })) : [];

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">01 · Texto con Claude</p>
        <h1 className="h1">Nombres de marca</h1>
        <p className="lede">Cuenta la idea como se la contarías a una amiga. Salen nombres con su porqué, lema, @ y dominio.</p>
      </header>
      <div className="tool">
        <div className="tool-form stack">
          <label className="field">
            <span className="label">La idea</span>
            <textarea className="textarea" value={idea} onChange={(e) => setIdea(e.target.value)} maxLength={1500} placeholder="Ropa de calle oscura con bordados religiosos, para chicos y chicas de 18–25 en Madrid. Vaqueros muy anchos, sudaderas lavadas…" />
          </label>
          <RefPicker refs={refs} onChange={setRefs} max={4} hint="Fotos de ambiente, marcas que te gustan, texturas… Claude las usa para entender el tono." />
          <div className="field">
            <span className="label">Cantidad</span>
            <div className="seg" role="radiogroup">
              {[8, 12, 20].map((n) => <button key={n} type="button" role="radio" aria-checked={count === n} onClick={() => setCount(n)}>{n}</button>)}
            </div>
          </div>
          <div className="field">
            <span className="label">Idioma</span>
            <div className="seg" role="radiogroup">
              {LANGS.map(([id, l]) => <button key={id} type="button" role="radio" aria-checked={lang === id} onClick={() => setLang(id)}>{l}</button>)}
            </div>
          </div>
          <div className="field">
            <span className="label">Estilo</span>
            <div className="chips">
              {STYLES.map((s) => (
                <button key={s} type="button" className="chip" aria-pressed={styleSel.includes(s)} onClick={() => setStyleSel((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s].slice(-6)))}>{s}</button>
              ))}
            </div>
          </div>
          <div className="cost"><span>Coste: <strong>0</strong> créditos</span><span className="muted">Texto con Claude, no gasta créditos de imagen</span></div>
          <ErrorNote {...(err || {})} />
          <button type="button" className="btn btn--big btn--block" onClick={generate} disabled={busy || (idea.trim().length < 3 && !refs.length)}>
            {busy ? <><span className="spin" /> Pensando nombres…</> : "Generar nombres"}
          </button>
          <p className="hint">Marca activa: {BRANDS[brand].name === "MARCA NUEVA" ? "marca nueva (sin estilo fijo)" : `${BRANDS[brand].name} — se tiene en cuenta su estilo`}.</p>
        </div>

        <div className="stack">
          <div className="row-between">
            <div className="row">
              <button type="button" className="chip" aria-pressed={!onlyFav} onClick={() => setOnlyFav(false)}>Última tanda</button>
              <button type="button" className="chip" aria-pressed={onlyFav} onClick={() => setOnlyFav(true)}>Favoritos ({favs.length})</button>
            </div>
            {history.length > 1 && !onlyFav && (
              <select className="select" style={{ width: "auto", minWidth: 220 }} value={current || ""} onChange={(e) => setCurrent(e.target.value)} aria-label="Historial">
                {history.map((j) => (
                  <option key={j.id} value={j.id}>
                    {new Date(j.createdAt).toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })} · {(j.input?.idea || "").slice(0, 30) || "sin idea"} ({j.names?.length})
                  </option>
                ))}
              </select>
            )}
          </div>
          {busy && <p className="notice pulse">Claude está pensando nombres (puede tardar 20–40 s)…</p>}
          {!list.length && !busy && <p className={styles.empty}>{onlyFav ? "Marca con la estrella los nombres que te gusten." : "Aquí aparecerán los nombres."}</p>}
          <div className={styles.grid}>
            {list.map(({ n, i, job }) => <NameCard key={job.id + i} n={n} onFav={() => fav(job, i)} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
