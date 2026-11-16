"use client";
import { useId, useRef } from "react";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconClose } from "./Icons";
import styles from "./Modal.module.css";

/** Accessible dialog: centred panel on desktop, bottom sheet on mobile. */
export default function Modal({ open, onClose, title, eyebrow, children, footer, size = "md", dismissible = true }) {
  const ref = useRef(null);
  const id = useId();
  const { mounted, visible } = usePresence(open, 400);
  useLockBody(open);
  useDialog(ref, open, dismissible ? onClose : () => {});
  if (!mounted) return null;
  return (
    <div className={styles.root} data-visible={visible || undefined}>
      <div className={styles.backdrop} onClick={dismissible ? onClose : undefined} aria-hidden="true" />
      <div ref={ref} className={styles.panel} data-size={size} role="dialog" aria-modal="true" aria-labelledby={`${id}-t`}>
        <header className={styles.head}>
          <div>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            <h2 id={`${id}-t`} className={styles.title}>{title}</h2>
          </div>
          {dismissible && (
            <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
              <IconClose />
            </button>
          )}
        </header>
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.foot}>{footer}</footer>}
      </div>
    </div>
  );
}
