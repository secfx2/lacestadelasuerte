import Link from "next/link";
import styles from "./PageIntro.module.css";

/** Page title block: breadcrumb, display title (MALA FAMA: blackletter), optional aside. */
export default function PageIntro({ crumbs = [], title, aside, children, compact = false }) {
  return (
    <header className={styles.intro} data-compact={compact || undefined}>
      {crumbs.length > 0 && (
        <nav aria-label="Ruta de navegación" className={styles.crumbs}>
          <ol>
            {crumbs.map((c, i) => (
              <li key={i}>{c.href ? <Link href={c.href} className="mk-link">{c.label}</Link> : <span aria-current="page">{c.label}</span>}</li>
            ))}
          </ol>
        </nav>
      )}
      <div className={styles.row}>
        <h1 className={styles.title}>{title}</h1>
        {aside && <p className={styles.aside}>{aside}</p>}
      </div>
      {children}
    </header>
  );
}
