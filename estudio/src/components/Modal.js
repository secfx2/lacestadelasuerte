"use client";
import { useEffect, useId, useRef } from "react";
import styles from "./Modal.module.css";

export default function Modal({ open, onClose, title, eyebrow, children, footer, size = "md" }) {
  const id = useId();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    setTimeout(() => ref.current?.focus(), 20);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className={styles.backdrop} onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={styles.dialog} data-size={size} role="dialog" aria-modal="true" aria-labelledby={id} ref={ref} tabIndex={-1}>
        <div className={styles.head}>
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id={id} className={styles.title}>{title}</h2>
          </div>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <span aria-hidden="true" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.foot}>{footer}</div>}
      </div>
    </div>
  );
}
