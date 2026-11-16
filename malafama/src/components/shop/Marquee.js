import styles from "./Marquee.module.css";
import brand from "@/config/brand";

/** Big marquee (MALA FAMA: blackletter / script alternating), emblem separators. Pure CSS; static under reduced motion. */
export default function Marquee({ items = [brand.tagline, brand.motto], repeat = 4, size = "xl", reverse = false, label }) {
  const run = Array.from({ length: repeat }, () => items).flat();
  const Run = ({ hidden }) => (
    <div className={styles.run} aria-hidden={hidden || undefined}>
      {run.map((t, i) => (
        <span key={i} className={styles.item}>
          {t}
          <span className={styles.sep} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <section className={styles.marquee} data-size={size} aria-label={label || items.join(" · ")}>
      <div className={styles.track} data-reverse={reverse || undefined}>
        <Run hidden />
        <Run hidden />
      </div>
    </section>
  );
}
