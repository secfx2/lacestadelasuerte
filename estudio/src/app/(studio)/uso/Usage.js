"use client";
import { useEffect, useState } from "react";
import { api, fmt, fmtUsd } from "@/lib/client";
import { BRANDS } from "@/config/brands";
import styles from "./usage.module.css";

const TOOL = { logos: "Logos", ideas: "Ideas", prenda: "Prenda", nombres: "Nombres" };
const PROV = { mcp: "Plan Higgsfield", api: "API Higgsfield", mock: "Simulado", anthropic: "Claude" };

export default function Usage() {
  const [d, setD] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => {
    api("/api/usage").then(setD).catch((e) => setErr(e.message));
  }, []);
  if (err) return <div className="page"><p className="notice notice--err">{err}</p></div>;
  if (!d) return <div className="page"><p className="muted pulse">Cargando…</p></div>;
  const t = d.today;
  const pct = Math.min(100, (t.credits / t.limit) * 100);
  const max = Math.max(1, ...d.days.map((x) => x.credits));
  const week = d.days.reduce((a, x) => ({ credits: a.credits + x.credits, usd: a.usd + x.usd }), { credits: 0, usd: 0 });
  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Créditos</p>
        <h1 className="h1">Uso y límite</h1>
        <p className="lede">El límite diario protege la cuenta: se reinicia a medianoche (hora de Madrid). Lo que falla se devuelve.</p>
      </header>
      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <span className="label">Hoy</span>
          <span className={styles.big}>{fmt(t.credits)} <small>/ {fmt(t.limit)}</small></span>
          <span className={styles.bar}><span style={{ width: `${pct}%` }} data-high={pct > 85 || undefined} /></span>
          <span className="tiny muted">Quedan {fmt(t.remaining)} créditos · {t.images} imágenes</span>
        </div>
        <div className={styles.kpi}>
          <span className="label">Últimos 7 días</span>
          <span className={styles.big}>{fmt(week.credits)}</span>
          <span className="tiny muted">créditos · texto (Claude) ≈ {fmtUsd(week.usd)}</span>
        </div>
        <div className={styles.kpi}>
          <span className="label">Saldo del plan Higgsfield</span>
          <span className={styles.big}>{d.balance?.credits != null ? fmt(d.balance.credits, 0) : "—"}</span>
          <span className="tiny muted">{d.balance?.error ? d.balance.error : d.balance?.plan ? `Plan: ${d.balance.plan}` : d.provider ? "" : "Cuenta sin conectar"}</span>
        </div>
      </div>

      <section className="stack" style={{ marginTop: 32 }}>
        <h2 className="h2">Últimos 7 días</h2>
        <ul className={styles.days}>
          {d.days.map((x) => (
            <li key={x.day}>
              <span className={styles.day}>{new Date(x.day + "T12:00:00").toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" })}</span>
              <span className={styles.dayBar}><span style={{ width: `${(x.credits / max) * 100}%` }} /></span>
              <span className={styles.dayNum}>{fmt(x.credits)}</span>
              <span className={styles.dayUsd}>{x.usd ? fmtUsd(x.usd) : ""}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack" style={{ marginTop: 32 }}>
        <h2 className="h2">Hoy, una a una</h2>
        {!d.entries.length && <p className="muted">Nada todavía.</p>}
        {d.entries.length > 0 && (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Hora</th><th>Herramienta</th><th>Marca</th><th>Modelo</th><th className="num">Imágenes</th><th className="num">Créditos</th><th className="num">USD</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {d.entries.map((e) => (
                  <tr key={e.id}>
                    <td>{new Date(e.at).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</td>
                    <td>{TOOL[e.tool] || e.tool}</td>
                    <td>{BRANDS[e.brand]?.name || "—"}</td>
                    <td className="tiny">{e.model}<br /><span className="muted">{PROV[e.provider] || e.provider}</span></td>
                    <td className="num">{e.kind === "text" ? "—" : e.n}</td>
                    <td className="num">{fmt(e.credits - (e.refunded || 0))}{e.refunded ? <span className="muted"> (−{fmt(e.refunded)})</span> : null}</td>
                    <td className="num">{e.usd != null ? fmtUsd(e.usd) : "—"}</td>
                    <td>{e.status === "refunded" ? <span className="badge badge--warn">Devuelto</span> : e.status === "partial" ? <span className="badge badge--warn">Parcial</span> : <span className="badge">OK</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="tiny muted">Créditos = créditos reales del plan Higgsfield (coste que devuelve la propia cuenta antes de generar). El texto con Claude no gasta créditos; su coste aproximado en USD aparece aparte (factura de Anthropic).</p>
      </section>
    </div>
  );
}
