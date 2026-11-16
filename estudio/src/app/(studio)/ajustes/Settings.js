"use client";
import { useCallback, useEffect, useState } from "react";
import ErrorNote from "@/components/ErrorNote";
import { useStudio } from "@/components/Studio";
import { api, fmt, fmtUsd } from "@/lib/client";
import styles from "./settings.module.css";

const QUALITIES = ["", "low", "medium", "high"];
const RESOLUTIONS = ["", "1k", "2k", "4k"];
const ROLE_ORDER = ["garment", "garmentRef", "logo", "logoVector"];

function Ok({ ok, children }) {
  return <span className={`badge ${ok ? "badge--ok" : "badge--err"}`}>{ok ? "✓" : "✗"} {children}</span>;
}

function AdminGate({ onUnlock }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(null);
  return (
    <form className="panel stack" onSubmit={async (e) => { e.preventDefault(); try { await api("/api/admin", { method: "POST", body: { password: pw } }); onUnlock(); } catch (x) { setErr(x.message); } }}>
      <h2 className="h2">Solo propietario</h2>
      <p className="small muted">Conectar la cuenta de Higgsfield y cambiar modelos requiere la contraseña de administrador.</p>
      <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Contraseña de administrador" autoComplete="current-password" />
      {err && <p className="notice notice--err">{err}</p>}
      <button className="btn" disabled={!pw}>Desbloquear</button>
    </form>
  );
}

export default function Settings() {
  const { toast } = useStudio();
  const [d, setD] = useState(null);
  const [roles, setRoles] = useState(null);
  const [api2, setApi2] = useState(null);
  const [err, setErr] = useState(null);
  const [flash, setFlash] = useState(null);
  const [checking, setChecking] = useState(false);
  const [balance, setBalance] = useState(null);
  const [tools, setTools] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const x = await api("/api/settings");
      setD(x);
      setRoles(Object.fromEntries(ROLE_ORDER.map((id) => [id, { ...x.settings.roles[id], extra: JSON.stringify(x.settings.roles[id].extra || {}, null, 0) === "{}" ? "" : JSON.stringify(x.settings.roles[id].extra, null, 1) }])));
      setApi2({ active: { ...x.settings.api.active }, custom: x.settings.api.custom.map((m) => ({ ...m, extra: JSON.stringify(m.extra || {}), roles: m.roles || [] })) });
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
    }
  }, []);

  useEffect(() => {
    load();
    const q = new URLSearchParams(window.location.search);
    if (q.get("hf") === "ok") setFlash({ tone: "ok", text: "Cuenta de Higgsfield conectada." });
    if (q.get("hf") === "error") setFlash({ tone: "err", text: q.get("msg") || "No se pudo conectar", detail: q.get("detail") });
    if (q.get("hf")) window.history.replaceState(null, "", "/ajustes");
  }, [load]);

  if (err) return <div className="page"><ErrorNote {...err} /></div>;
  if (!d || !roles) return <div className="page"><p className="muted pulse">Cargando…</p></div>;
  const { env, provider: prov, registry, settings } = d;
  const locked = env.adminRequired && !env.admin;
  const conn = prov.connection;
  const mcpCheck = settings.checks?.mcp;
  const apiCheck = settings.checks?.api;

  const saveRoles = async () => {
    setSaving(true);
    try {
      await api("/api/settings", { method: "PUT", body: { roles, api: { active: api2.active, custom: api2.custom } } });
      toast("Ajustes guardados");
      await load();
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setSaving(false);
    }
  };
  const check = async () => {
    setChecking(true);
    try {
      await api("/api/models/check", { method: "POST" });
      await load();
      toast("Comprobación terminada");
    } catch (e) {
      toast(e.message, "err");
    } finally {
      setChecking(false);
    }
  };
  const setRole = (id, k, v) => setRoles((r) => ({ ...r, [id]: { ...r[id], [k]: v } }));

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Propietario</p>
        <h1 className="h1">Ajustes</h1>
        <p className="lede">Conexión con Higgsfield, modelos por tipo de imagen y estado del servidor.</p>
      </header>
      {flash && <div style={{ marginBottom: 20 }}><ErrorNote error={flash.text} detail={flash.detail} tone={flash.tone} /></div>}
      {locked ? (
        <AdminGate onUnlock={load} />
      ) : (
        <div className="stack-lg">
          {/* ------------------------------------------------ Higgsfield */}
          <section className="panel stack" data-testid="hf-panel">
            <div className="section-title">
              <h2 className="h2">Higgsfield</h2>
              {conn.connected ? <Ok ok>Conectado{conn.mock ? " (simulado)" : ""}</Ok> : <Ok ok={false}>Sin conectar</Ok>}
            </div>
            {conn.connected ? (
              <div className="stack-sm small">
                <p style={{ margin: 0 }}>Cuenta: <strong>{conn.email || conn.name || "conectada"}</strong>{conn.connectedAt && <span className="muted"> · desde {new Date(conn.connectedAt).toLocaleString("es-ES")}</span>}</p>
                <p className="muted" style={{ margin: 0 }}>Las imágenes se pagan con los créditos del plan de esta cuenta (vía MCP). {conn.hasRefresh ? "La sesión se renueva sola." : "Sin token de renovación: habrá que reconectar cuando caduque."}</p>
                <div className="row">
                  <button type="button" className="btn btn--sm btn--ghost" onClick={async () => { setBalance({ loading: true }); try { const x = await api("/api/higgsfield/status?balance=1"); setBalance(x.balance); } catch (e) { setBalance({ error: e.message }); } }}>Ver saldo</button>
                  {balance?.loading && <span className="spin" />}
                  {balance && !balance.loading && (balance.error ? <ErrorNote error={balance.error} detail={balance.detail} /> : <span>Saldo: <strong>{fmt(balance.credits, 0)}</strong> créditos {balance.plan && <span className="muted">· plan {balance.plan}</span>}</span>)}
                </div>
                <div className="row">
                  <a className="btn btn--sm btn--quiet" href="/api/higgsfield/connect">Reconectar</a>
                  <button type="button" className="btn btn--sm btn--danger" onClick={async () => { await api("/api/higgsfield/disconnect", { method: "POST" }); toast("Desconectado"); load(); }}>Desconectar</button>
                </div>
              </div>
            ) : (
              <div className="stack-sm">
                <p className="small muted" style={{ margin: 0 }}>Conecta una vez tu cuenta de Higgsfield: se abre su página de inicio de sesión, apruebas el acceso y vuelves aquí. Los tokens se guardan cifrados en el servidor; nunca llegan al navegador.</p>
                {conn.error && <p className="notice notice--warn">{conn.error}</p>}
                {prov.apiKeys && <p className="notice">Mientras tanto se usa la API de pago por uso (HF_API_KEY).</p>}
                <a className="btn" href="/api/higgsfield/connect" data-testid="hf-connect">Conectar Higgsfield</a>
              </div>
            )}
          </section>

          {/* ------------------------------------------------ Roles */}
          <section className="panel stack">
            <div className="section-title">
              <h2 className="h2">Modelos por tipo de imagen</h2>
              <button type="button" className="btn btn--sm btn--ghost" onClick={check} disabled={checking || !(conn.connected || prov.apiKeys)} data-testid="check-models">
                {checking ? <><span className="spin" /> Comprobando…</> : "Comprobar modelos"}
              </button>
            </div>
            <p className="small muted" style={{ margin: 0 }}>«Comprobar modelos» pide a Higgsfield el coste de cada configuración sin generar nada (no gasta). {(mcpCheck?.at || apiCheck?.at) && `Última comprobación: ${new Date(mcpCheck?.at || apiCheck?.at).toLocaleString("es-ES")}.`}</p>
            <div className={styles.roles}>
              {ROLE_ORDER.map((id) => {
                const r = roles[id];
                const known = registry.mcpModels.some((m) => m.id === r.model);
                const c = mcpCheck?.roles?.[id];
                return (
                  <div key={id} className={styles.role}>
                    <div className="row-between">
                      <h3 className="h3">{registry.roles[id].label}</h3>
                      {c && (c.ok ? <Ok ok>{fmt(c.credits)} {c.credits === 1 ? "crédito" : "créditos"}</Ok> : <Ok ok={false}>error</Ok>)}
                    </div>
                    <p className="tiny muted" style={{ margin: 0 }}>{registry.roles[id].help} Aspecto {registry.roles[id].aspect}.</p>
                    <div className={styles.roleRow}>
                      <label className="field">
                        <span className="label">Modelo</span>
                        <select className="select" value={known ? r.model : "__custom"} onChange={(e) => setRole(id, "model", e.target.value === "__custom" ? "" : e.target.value)}>
                          {registry.mcpModels.map((m) => <option key={m.id} value={m.id}>{m.label}{m.verified ? "" : " (sin verificar)"}</option>)}
                          <option value="__custom">Otro…</option>
                        </select>
                      </label>
                      {!known && (
                        <label className="field">
                          <span className="label">ID del modelo</span>
                          <input className="input" value={r.model} onChange={(e) => setRole(id, "model", e.target.value)} placeholder="p. ej. nano_banana_pro" />
                        </label>
                      )}
                      <label className="field">
                        <span className="label">Calidad</span>
                        <select className="select" value={r.quality || ""} onChange={(e) => setRole(id, "quality", e.target.value)}>
                          {QUALITIES.map((q) => <option key={q} value={q}>{q || "—"}</option>)}
                        </select>
                      </label>
                      <label className="field">
                        <span className="label">Resolución</span>
                        <select className="select" value={r.resolution || ""} onChange={(e) => setRole(id, "resolution", e.target.value)}>
                          {RESOLUTIONS.map((q) => <option key={q} value={q}>{q || "—"}</option>)}
                        </select>
                      </label>
                    </div>
                    <details>
                      <summary className="tiny muted" style={{ cursor: "pointer" }}>Parámetros extra (JSON)</summary>
                      <textarea className="textarea code" style={{ minHeight: 70, marginTop: 6 }} value={r.extra} onChange={(e) => setRole(id, "extra", e.target.value)} placeholder='{"output_format": "png"}' />
                    </details>
                    {c && !c.ok && <ErrorNote error={c.error} detail={c.detail} />}
                  </div>
                );
              })}
            </div>
            {mcpCheck?.models && (
              <div className="stack-sm">
                <span className="label">Coste por modelo (2K, 4:5, sin referencias)</span>
                <div className="row">
                  {registry.mcpModels.map((m) => {
                    const c = mcpCheck.models[m.id];
                    if (!c) return null;
                    return <span key={m.id} title={c.detail || c.error || ""}><Ok ok={c.ok}>{m.label}{c.ok ? ` · ${fmt(c.credits)}` : " · no disponible"}</Ok></span>;
                  })}
                </div>
              </div>
            )}
            <div className="row"><button type="button" className="btn" onClick={saveRoles} disabled={saving}>{saving ? <span className="spin" /> : null} Guardar ajustes</button></div>
          </section>

          {/* ------------------------------------------------ API alternativa */}
          <section className="panel stack">
            <details>
              <summary className={styles.sum}>
                <span className="h2">API de pago por uso (alternativa)</span>
                {prov.apiKeys ? <Ok ok>Claves configuradas</Ok> : <span className="badge">Sin claves</span>}
              </summary>
              <div className="stack" style={{ marginTop: 14 }}>
                <p className="small muted" style={{ margin: 0 }}>Solo se usa si hay <span className="mono">HF_API_KEY</span> + <span className="mono">HF_API_SECRET</span> y la cuenta no está conectada por MCP. Factura en USD aparte del plan. El catálogo depende de la cuenta: «documentado» = aparece en docs.higgsfield.ai; «sin verificar» = nombre supuesto. «Comprobar modelos» llama a <span className="mono">/estimate</span> de cada uno.</p>
                {ROLE_ORDER.map((id) => {
                  const cands = [...registry.apiCandidates[id], ...api2.custom.filter((m) => m.roles.includes(id)).map((m) => m.path)];
                  return (
                    <div key={id} className={styles.apiRole}>
                      <h3 className="h3">{registry.roles[id].label}</h3>
                      <ul className={styles.cands}>
                        {cands.map((path) => {
                          const m = registry.apiModels.find((x) => x.path === path) || api2.custom.find((x) => x.path === path);
                          const c = apiCheck?.results?.[path];
                          return (
                            <li key={path}>
                              <label className="check">
                                <input type="radio" name={`api-${id}`} checked={api2.active[id] === path} onChange={() => setApi2((a) => ({ ...a, active: { ...a.active, [id]: path } }))} />
                                <span className="mono">{path}</span>
                              </label>
                              <span className="row">
                                <span className="badge">{m?.status === "documented" ? "documentado" : m?.status === "custom" ? "propio" : "sin verificar"}</span>
                                {c && (c.ok ? <Ok ok>{fmtUsd(c.usd)}</Ok> : <span title={c.error || ""}><Ok ok={false}>{c.status === 404 ? "no disponible" : `error ${c.status || ""}`}</Ok></span>)}
                              </span>
                              {c && !c.ok && c.error && <pre className={styles.raw}>{c.error}</pre>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
                <div className="stack-sm">
                  <span className="label">Modelos propios</span>
                  {api2.custom.map((m, i) => (
                    <div key={i} className={styles.custom}>
                      {["path", "label", "imageParam", "aspectParam", "resolutionParam", "credits"].map((k) => (
                        <label key={k} className="field">
                          <span className="label">{{ path: "Ruta", label: "Nombre", imageParam: "Parámetro de imágenes", aspectParam: "Parámetro de aspecto", resolutionParam: "Parámetro de resolución", credits: "Créditos / imagen" }[k]}</span>
                          <input className="input" value={m[k] ?? ""} onChange={(e) => setApi2((a) => ({ ...a, custom: a.custom.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)) }))} placeholder={{ path: "proveedor/modelo/variante", imageParam: "image_urls", aspectParam: "aspect_ratio", resolutionParam: "resolution", credits: "1" }[k] || ""} />
                        </label>
                      ))}
                      <label className="field">
                        <span className="label">Imágenes</span>
                        <select className="select" value={m.imageMode || "array"} onChange={(e) => setApi2((a) => ({ ...a, custom: a.custom.map((x, j) => (j === i ? { ...x, imageMode: e.target.value } : x)) }))}>
                          <option value="array">Lista (image_urls)</option>
                          <option value="single">Una (image_url)</option>
                        </select>
                      </label>
                      <div className="field">
                        <span className="label">Roles</span>
                        <div className="chips">
                          {ROLE_ORDER.map((r) => <button key={r} type="button" className="chip" aria-pressed={m.roles.includes(r)} onClick={() => setApi2((a) => ({ ...a, custom: a.custom.map((x, j) => (j === i ? { ...x, roles: x.roles.includes(r) ? x.roles.filter((y) => y !== r) : [...x.roles, r] } : x)) }))}>{registry.roles[r].label}</button>)}
                        </div>
                      </div>
                      <label className="field" style={{ gridColumn: "1 / -1" }}>
                        <span className="label">Parámetros extra (JSON)</span>
                        <textarea className="textarea code" style={{ minHeight: 60 }} value={m.extra || ""} onChange={(e) => setApi2((a) => ({ ...a, custom: a.custom.map((x, j) => (j === i ? { ...x, extra: e.target.value } : x)) }))} placeholder='{"quality": "medium"}' />
                      </label>
                      <button type="button" className="btn btn--xs btn--danger" onClick={() => setApi2((a) => ({ ...a, custom: a.custom.filter((_, j) => j !== i) }))}>Quitar</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn--sm btn--ghost" style={{ alignSelf: "flex-start" }} onClick={() => setApi2((a) => ({ ...a, custom: [...a.custom, { path: "", label: "", roles: ["garment"], imageParam: "", aspectParam: "aspect_ratio", resolutionParam: "", imageMode: "array", credits: "1", extra: "" }] }))}>Añadir modelo propio</button>
                </div>
                <div className="row"><button type="button" className="btn" onClick={saveRoles} disabled={saving}>Guardar ajustes</button></div>
              </div>
            </details>
          </section>

          {/* ------------------------------------------------ Entorno */}
          <section className="panel stack">
            <h2 className="h2">Servidor</h2>
            <ul className={styles.env}>
              <li><span>Modo simulado (MOCK_MODE)</span>{env.mock ? <span className="badge badge--warn">Activo</span> : <span className="badge">No</span>}</li>
              <li><span>Almacén</span>{env.storage === "blob" ? <Ok ok>Vercel Blob</Ok> : <span className="badge badge--warn">Local (.mockdata) — solo pruebas</span>}</li>
              <li><span>Claude (texto)</span><Ok ok={env.anthropic}>{env.anthropic ? "ANTHROPIC_API_KEY" : "falta ANTHROPIC_API_KEY"}</Ok></li>
              <li><span>Proveedor de imágenes</span><span className="badge">{prov.active === "mcp" ? "Cuenta conectada (MCP)" : prov.active === "api" ? "API pago por uso" : prov.active === "mock" ? "Simulado" : "Ninguno"}</span></li>
              <li><span>Límite diario</span><span>{fmt(env.limits.credits)} créditos{env.limits.usd ? ` · ${env.limits.usd} $` : ""}</span></li>
              <li><span>URL pública</span><span className="mono">{env.publicBase || "(la del navegador)"}</span></li>
              <li><span>Contraseña de administrador</span><span className="badge">{env.adminRequired ? "Sí" : "No (cualquiera con acceso)"}</span></li>
            </ul>
          </section>

          {/* ------------------------------------------------ Depuración */}
          <section className="panel stack">
            <div className="section-title">
              <h2 className="h2">Depuración</h2>
              <button type="button" className="btn btn--sm btn--ghost" disabled={!conn.connected} onClick={async () => { try { setTools((await api("/api/higgsfield/tools")).tools); } catch (e) { setTools({ error: e.message, detail: e.detail }); } }}>Ver herramientas del MCP</button>
            </div>
            {tools?.error && <ErrorNote error={tools.error} detail={tools.detail} />}
            {Array.isArray(tools) && (
              <ul className={styles.tools}>
                {tools.map((t) => (
                  <li key={t.name}>
                    <details>
                      <summary><span className="mono">{t.name}</span> <span className="tiny muted">{t.description?.slice(0, 120)}</span></summary>
                      <pre className={styles.raw}>{JSON.stringify(t.inputSchema, null, 1)}</pre>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
