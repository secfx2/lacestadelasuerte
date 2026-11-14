import { ANNOUNCEMENTS } from "@/lib/shop";
import styles from "./AnnouncementBar.module.css";

function Run({ hidden }) {
  return (
    <ul className={styles.run} aria-hidden={hidden || undefined}>
      {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((t, i) => (
        <li key={i} className={styles.item}>
          <span className={t === "Tous pour un" ? styles.serif : undefined}>{t}</span>
          <span className={styles.sep} aria-hidden="true" />
        </li>
      ))}
    </ul>
  );
}

export default function AnnouncementBar() {
  return (
    <div className={styles.bar} role="region" aria-label="Avisos">
      <div className={styles.track}>
        <Run />
        <Run hidden />
      </div>
      <p className={styles.static}>{ANNOUNCEMENTS[0]} · {ANNOUNCEMENTS[1]}</p>
    </div>
  );
}
