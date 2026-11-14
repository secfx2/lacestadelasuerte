"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart, useWishlist } from "./CartProvider";
import styles from "./AccountForms.module.css";
import brand from "@/config/brand";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function useForm(initial, rules) {
  const [v, setV] = useState(initial);
  const [tried, setTried] = useState(false);
  const errors = Object.fromEntries(Object.entries(rules).map(([k, fn]) => [k, fn(v[k], v)]).filter(([, e]) => e));
  const set = (k) => (e) => setV((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  return { v, set, errors, tried, setTried, ok: Object.keys(errors).length === 0 };
}

/** Login / register UI. Accounts are not live yet: valid submissions show an informative notice. */
export default function AccountForms() {
  const [tab, setTab] = useState("login");
  const [notice, setNotice] = useState(null);
  const { count } = useCart();
  const wish = useWishlist();

  const login = useForm(
    { email: "", password: "" },
    { email: (x) => !EMAIL_RE.test(x.trim()) && "Introduce un correo válido.", password: (x) => x.length < 6 && "Mínimo 6 caracteres." }
  );
  const reg = useForm(
    { name: "", email: "", password: "", terms: false },
    {
      name: (x) => !x.trim() && "Introduce tu nombre.",
      email: (x) => !EMAIL_RE.test(x.trim()) && "Introduce un correo válido.",
      password: (x) => x.length < 8 && "Mínimo 8 caracteres.",
      terms: (x) => !x && "Debes aceptar la política de privacidad.",
    }
  );

  const submit = (form, kind) => (e) => {
    e.preventDefault();
    form.setTried(true);
    if (form.ok) setNotice(kind);
  };

  const input = (form, name, label, type = "text", autoComplete) => (
    <div className={styles.field}>
      <label className="mk-label" htmlFor={`${tab}-${name}`}>
        {label}
      </label>
      <input
        id={`${tab}-${name}`}
        type={type}
        className="mk-input"
        value={form.v[name]}
        onChange={form.set(name)}
        autoComplete={autoComplete}
        aria-invalid={form.tried && form.errors[name] ? true : undefined}
      />
      {form.tried && form.errors[name] && <p className="mk-error">{form.errors[name]}</p>}
    </div>
  );

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.tabs} role="tablist" aria-label="Cuenta">
          <button type="button" role="tab" aria-selected={tab === "login"} className={styles.tab} onClick={() => { setTab("login"); setNotice(null); }}>
            Iniciar sesión
          </button>
          <button type="button" role="tab" aria-selected={tab === "register"} className={styles.tab} onClick={() => { setTab("register"); setNotice(null); }}>
            Crear cuenta
          </button>
        </div>

        {notice ? (
          <div className={styles.notice} role="status">
            <p className={styles.noticeTitle}>{notice === "login" ? "Las cuentas abrirán pronto." : brand.account.registerThanks}</p>
            <p>
              Las cuentas de cliente todavía no están activas en esta demostración. Mientras tanto, tu cesta ({count}) y tus favoritos ({wish.count}) se
              guardan en este dispositivo.
            </p>
            <div className={styles.noticeActions}>
              <Link href="/tienda" className="mk-btn">Ver catálogo</Link>
              <Link href="/favoritos" className="mk-btn mk-btn--ghost">Mis favoritos</Link>
            </div>
          </div>
        ) : tab === "login" ? (
          <form noValidate onSubmit={submit(login, "login")} className={styles.form} role="tabpanel" aria-label="Iniciar sesión">
            {input(login, "email", "Correo electrónico", "email", "email")}
            {input(login, "password", "Contraseña", "password", "current-password")}
            <button type="button" className={`${styles.forgot} mk-link mk-link--on`}>¿Has olvidado tu contraseña?</button>
            <button type="submit" className="mk-btn mk-btn--block">Entrar</button>
          </form>
        ) : (
          <form noValidate onSubmit={submit(reg, "register")} className={styles.form} role="tabpanel" aria-label="Crear cuenta">
            {input(reg, "name", "Nombre", "text", "name")}
            {input(reg, "email", "Correo electrónico", "email", "email")}
            {input(reg, "password", "Contraseña", "password", "new-password")}
            <div>
              <label className="mk-check">
                <input type="checkbox" checked={reg.v.terms} onChange={reg.set("terms")} aria-invalid={reg.tried && reg.errors.terms ? true : undefined} />
                <span>
                  Acepto la <Link href="/legal#privacidad" className="mk-link mk-link--on">política de privacidad</Link>.
                </span>
              </label>
              {reg.tried && reg.errors.terms && <p className="mk-error">{reg.errors.terms}</p>}
            </div>
            <button type="submit" className="mk-btn mk-btn--block">Crear cuenta</button>
          </form>
        )}
      </div>

      <aside className={styles.aside}>
        <p className={styles.asideTitle}>{brand.account.benefitsTitle}</p>
        <ul>
          {brand.account.benefits.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <p className={styles.motto}>
          <em>{brand.tagline}.</em>
        </p>
      </aside>
    </div>
  );
}
