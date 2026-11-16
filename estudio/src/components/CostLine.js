"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api, fmt } from "@/lib/client";

/** Coste en créditos ANTES de generar. onCost({ total, remaining, ok }) */
export default function CostLine({ role, n = 1, hasRefs = false, onCost, label = "Coste" }) {
  const [state, setState] = useState({ loading: true });
  const seq = useRef(0);
  useEffect(() => {
    if (!role || n < 1) {
      setState({ loading: false, none: true });
      onCost?.(null);
      return;
    }
    const my = ++seq.current;
    setState((s) => ({ ...s, loading: true }));
    const t = setTimeout(async () => {
      try {
        const d = await api("/api/cost", { method: "POST", body: { role, n, hasRefs } });
        if (my !== seq.current) return;
        setState({ loading: false, data: d });
        onCost?.({ total: d.total, remaining: d.remaining, ok: d.total <= d.remaining + 1e-9 });
      } catch (e) {
        if (my !== seq.current) return;
        setState({ loading: false, error: e.message, code: e.code });
        onCost?.({ error: e.message, ok: false });
      }
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, n, hasRefs]);

  if (state.none) return null;
  if (state.error) {
    return (
      <div className="notice notice--warn" role="status">
        {state.error}
        {state.code === "hf_not_connected" && (
          <>
            {" "}
            <Link href="/ajustes" style={{ textDecoration: "underline" }}>
              Ir a Ajustes
            </Link>
          </>
        )}
      </div>
    );
  }
  const d = state.data;
  const over = d && d.total > d.remaining + 1e-9;
  return (
    <div className="cost" data-testid="cost" aria-live="polite">
      <span>
        {label}: <strong>{d ? fmt(d.total) : "…"}</strong> {d && d.total === 1 ? "crédito" : "créditos"}
        {d && n > 1 && <span className="muted"> ({fmt(d.perImage)} por imagen)</span>}
      </span>
      <span className={over ? "" : "muted"} style={over ? { color: "var(--err)" } : undefined}>
        {state.loading ? <span className="pulse">calculando…</span> : d ? `Quedan ${fmt(d.remaining)} de ${fmt(d.limit)} hoy` : ""}
      </span>
      {d?.refsIgnored && <span className="tiny muted" style={{ width: "100%" }}>Este modelo no admite referencias: se ignorarán.</span>}
      {over && <span className="tiny" style={{ width: "100%", color: "var(--err)" }}>Supera el límite diario: reduce el número de imágenes o espera a mañana.</span>}
    </div>
  );
}
