"use client";
import { useEffect, useRef, useState } from "react";
import { IconArrow } from "./Icons";
import styles from "./Rail.module.css";

/** Horizontal snap scroller with prev/next controls (desktop) and native swipe (touch). */
export default function Rail({ children, label, perView = 3.2, perViewMobile = 1.6 }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir) => {
    const el = ref.current;
    const item = el?.firstElementChild;
    if (!el || !item) return;
    el.scrollBy({ left: dir * (item.getBoundingClientRect().width + 8) * Math.max(1, Math.floor(perView)), behavior: "smooth" });
  };

  return (
    <div className={styles.wrap} style={{ "--per": perView, "--per-m": perViewMobile }}>
      <div ref={ref} className={styles.track} role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => step(-1)} disabled={edge.start} aria-label="Anterior">
          <IconArrow dir="left" />
        </button>
        <button type="button" onClick={() => step(1)} disabled={edge.end} aria-label="Siguiente">
          <IconArrow />
        </button>
      </div>
    </div>
  );
}
