"use client";
import { useState } from "react";
import styles from "./login.module.css";

export default function LoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await fetch("/api/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: pw }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "No se pudo entrar");
      const next = new URLSearchParams(window.location.search).get("next");
      window.location.href = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  }
  return (
    <main className={styles.wrap}>
      <div className={styles.card}>
        <p className="eyebrow">Taller de marcas</p>
        <h1 className={styles.title}>Estudio</h1>
        <p className={styles.lede}>Nombres, logos, prendas y fotos de producto para las marcas de la casa.</p>
        <form onSubmit={submit} className="stack" style={{ marginTop: 28 }}>
          <label className="field">
            <span className="label">Contraseña</span>
            <input className="input" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus required />
          </label>
          {err && <p className="notice notice--err" role="alert">{err}</p>}
          <button className="btn btn--big btn--block" disabled={busy || !pw}>
            {busy && <span className="spin" />} Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
