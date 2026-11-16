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
      <ul className="sr-only">
        {ANNOUNCEMENTS.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <div className={styles.track} aria-hidden="true">
        <Run hidden />
        <Run hidden />
      </div>
      <p className={styles.static} aria-hidden="true">{ANNOUNCEMENTS[0]} · {ANNOUNCEMENTS[1]}</p>
    </div>
  );
}
