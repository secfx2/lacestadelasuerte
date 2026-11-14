"use client";
import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Non-functional contact form with validation and a success state. */
export default function ContactForm() {
  const [v, setV] = useState({ name: "", email: "", order: "", message: "" });
  const [sent, setSent] = useState(false);
  const [tried, setTried] = useState(false);
  const errors = {
    name: !v.name.trim() && "Introduce tu nombre.",
    email: !EMAIL_RE.test(v.email.trim()) && "Introduce un correo válido.",
    message: v.message.trim().length < 10 && "Cuéntanos algo más (mínimo 10 caracteres).",
  };
  const has = Object.values(errors).some(Boolean);
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.value }));

  if (sent) {
    return (
      <div role="status" style={{ padding: "20px 0" }}>
        <p className="caps" style={{ margin: 0, fontWeight: 500 }}>Mensaje recibido.</p>
        <p className="muted" style={{ margin: "8px 0 0", fontSize: 13 }}>
          Te responderemos en un plazo de 24–48 h laborables. <em className="serif" style={{ fontSize: 16, color: "var(--ink)" }}>Un pour tous.</em>
        </p>
      </div>
    );
  }

  const err = (k) => tried && errors[k];
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setTried(true);
        if (!has) setSent(true);
      }}
      style={{ display: "grid", gap: 14, maxWidth: 560 }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
        <div>
          <label className="mk-label" htmlFor="cf-name">Nombre</label>
          <input id="cf-name" className="mk-input" value={v.name} onChange={set("name")} aria-invalid={err("name") ? true : undefined} autoComplete="name" />
          {err("name") && <p className="mk-error">{errors.name}</p>}
        </div>
        <div>
          <label className="mk-label" htmlFor="cf-email">Correo electrónico</label>
          <input id="cf-email" type="email" className="mk-input" value={v.email} onChange={set("email")} aria-invalid={err("email") ? true : undefined} autoComplete="email" />
          {err("email") && <p className="mk-error">{errors.email}</p>}
        </div>
      </div>
      <div>
        <label className="mk-label" htmlFor="cf-order">Número de pedido (opcional)</label>
        <input id="cf-order" className="mk-input" value={v.order} onChange={set("order")} placeholder="MSK-0000" />
      </div>
      <div>
        <label className="mk-label" htmlFor="cf-msg">Mensaje</label>
        <textarea
          id="cf-msg"
          className="mk-input"
          style={{ height: 140, padding: 14, resize: "vertical" }}
          value={v.message}
          onChange={set("message")}
          aria-invalid={err("message") ? true : undefined}
        />
        {err("message") && <p className="mk-error">{errors.message}</p>}
      </div>
      <div>
        <button type="submit" className="mk-btn">Enviar mensaje</button>
      </div>
    </form>
  );
}
