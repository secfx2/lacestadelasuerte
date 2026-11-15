"use client";
import { useEffect, useState } from "react";
import styles from "./MissionHero.module.css";

const WORDS = ["Cero", "Uno", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete", "Ocho", "Nueve", "Diez"];

/**
 * Launch countdown for the home hero: "T–10 · Diez, nueve, ocho…" then ticks down
 * once a second (T–09 · Nueve …) and shows `liftoff` at zero before starting again.
 * Server render / reduced motion: the static first frame.
 */
export default function Countdown({ from = 10, intro, liftoff }) {
  const [n, setN] = useState(null); // null = static first frame

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let t = from;
    let hold = 0;
    const id = setInterval(() => {
      if (t > 0) {
        t -= 1;
        setN(t);
      } else if (++hold > 3) {
        hold = 0;
        t = from;
        setN(null);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [from]);

  const value = n === null ? from : n;
  const label = n === null ? intro : n === 0 ? liftoff : WORDS[n] || "";
  return (
    <p className={styles.countdown} aria-label={intro}>
      <span className={styles.t} aria-hidden="true">
        T–{String(value).padStart(2, "0")}
      </span>
      <span className={styles.tLabel} aria-hidden="true" data-liftoff={n === 0 || undefined}>
        {label}
      </span>
    </p>
  );
}
