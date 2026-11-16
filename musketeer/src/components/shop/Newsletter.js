"use client";
import { useId, useState } from "react";
import styles from "./Newsletter.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Fake signup: validates locally, shows a success state, sends nothing. */
export default function Newsletter({ variant = "footer" }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | error | done
  const [consent, setConsent] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setState("error");
      return;
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className={styles.done} data-variant={variant} role="status">
        <p className={styles.doneTitle}>Gracias. Ya formas parte de la hermandad.</p>
        <p className={styles.doneText}>
          <em>Un pour tous.</em> Recibirás una carta al mes, nunca más.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} data-variant={variant} onSubmit={submit} noValidate>
      <label htmlFor={`${id}-email`} className="sr-only">
        Correo electrónico
      </label>
      <div className={styles.row} data-invalid={state === "error" || undefined}>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Tu correo electrónico"
          className={styles.input}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
        />
        <button type="submit" className={styles.submit}>
          Suscribirme
        </button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className={styles.error} role="alert">
          Introduce un correo electrónico válido.
        </p>
      )}
      {variant === "feature" && (
        <label className={`mk-check ${styles.consent}`}>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>Acepto recibir comunicaciones de MUSKETEER. Puedes darte de baja cuando quieras.</span>
        </label>
      )}
    </form>
  );
}
