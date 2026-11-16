"use client";
import { useId, useState } from "react";
import styles from "./Accordion.module.css";

export function AccordionItem({ title, children, defaultOpen = false, id: anchor }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={styles.item} data-open={open || undefined} id={anchor}>
      <h3 className={styles.heading}>
        <button type="button" className={styles.trigger} aria-expanded={open} aria-controls={`${id}-p`} id={`${id}-b`} onClick={() => setOpen((v) => !v)}>
          <span>{title}</span>
          <span className={styles.icon} aria-hidden="true" />
        </button>
      </h3>
      <div id={`${id}-p`} role="region" aria-labelledby={`${id}-b`} className={styles.panel} inert={!open ? true : undefined}>
        <div className={styles.inner}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ children, className = "" }) {
  return <div className={`${styles.accordion} ${className}`}>{children}</div>;
}
