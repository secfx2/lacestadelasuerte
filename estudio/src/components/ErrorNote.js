"use client";
/** Mensaje de error con el detalle técnico desplegable (texto crudo de la API). */
export default function ErrorNote({ error, detail, tone = "err" }) {
  if (!error) return null;
  return (
    <div className={`notice notice--${tone}`} role="alert">
      {error}
      {detail && (
        <details>
          <summary>Detalle técnico</summary>
          <pre>{typeof detail === "string" ? detail : JSON.stringify(detail, null, 2)}</pre>
        </details>
      )}
    </div>
  );
}
