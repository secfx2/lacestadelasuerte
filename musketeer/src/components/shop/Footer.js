import Link from "next/link";
import Logo from "@/components/brand/Logo";
import FooterNewsletter from "./FooterNewsletter";
import RouteGate from "./RouteGate";
import { CATEGORIES } from "@/lib/shop";
import styles from "./Footer.module.css";

const HELP = [
  ["Envíos", "/ayuda#envios"],
  ["Devoluciones", "/ayuda#devoluciones"],
  ["Guía de tallas", "/ayuda#tallas"],
  ["Cuidado de la plata 925", "/ayuda#plata"],
  ["Pagos", "/ayuda#pagos"],
  ["Contacto", "/ayuda#contacto"],
];
const MAISON = [
  ["Manifiesto", "/la-maison"],
  ["Lookbook", "/lookbook"],
  ["Cuenta", "/cuenta"],
  ["Cesta", "/cesta"],
];
const SOCIAL = ["Instagram", "TikTok", "Pinterest", "YouTube"];
const PAYMENTS = ["Visa", "Mastercard", "Amex", "Apple Pay", "PayPal", "Bizum"];

function MinimalFooter() {
  return (
    <footer className={`${styles.footer} ${styles.minimal}`}>
      <div className={styles.bottom}>
        <p className={styles.copy}>
          © 2026 MUSKETEER <span className={styles.dot} aria-hidden="true">·</span> <em>Tous pour un</em>
        </p>
        <ul className={styles.legal}>
          <li><Link href="/ayuda#envios" className="mk-link">Envíos</Link></li>
          <li><Link href="/ayuda#devoluciones" className="mk-link">Devoluciones</Link></li>
          <li><Link href="/legal" className="mk-link">Aviso legal</Link></li>
          <li><Link href="/legal#privacidad" className="mk-link">Privacidad</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <RouteGate routes={["/checkout"]} alt={<MinimalFooter />}>
      <FullFooter />
    </RouteGate>
  );
}

function FullFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo variant="emblem" title="Emblema MUSKETEER" className={styles.emblem} />
          <FooterNewsletter
            title={
              <>
                <p className={styles.colTitle}>La carta del regimiento</p>
                <p className={styles.lead}>Reposiciones, piezas raras y notas del taller. Una carta al mes.</p>
              </>
            }
          />
        </div>

        <nav className={styles.col} aria-label="Tienda">
          <p className={styles.colTitle}>Tienda</p>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/categoria/${c.slug}`} className="mk-link">{c.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/tienda" className="mk-link">Ver todo</Link>
            </li>
          </ul>
        </nav>

        <nav className={styles.col} aria-label="Ayuda">
          <p className={styles.colTitle}>Ayuda</p>
          <ul>
            {HELP.map(([t, h]) => (
              <li key={h}>
                <Link href={h} className="mk-link">{t}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className={styles.col} aria-label="La Maison">
          <p className={styles.colTitle}>La Maison</p>
          <ul>
            {MAISON.map(([t, h]) => (
              <li key={h}>
                <Link href={h} className="mk-link">{t}</Link>
              </li>
            ))}
          </ul>
          <p className={`${styles.colTitle} ${styles.spaced}`}>Brand Book</p>
          <ul>
            <li><Link href="/brand" className="mk-link">Identidad de marca</Link></li>
            <li><a href="/brand/musketeer-brandbook.pdf" className="mk-link">Descargar PDF</a></li>
          </ul>
        </nav>

        <div className={styles.col}>
          <p className={styles.colTitle}>Síguenos</p>
          <ul>
            {SOCIAL.map((s) => (
              <li key={s}>
                <a href="#" className="mk-link" aria-label={`${s} (próximamente)`}>{s}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.mark} aria-hidden="true">
        <Logo variant="wordmark" title="MUSKETEER" className={styles.wordmark} />
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © 2026 MUSKETEER <span className={styles.dot} aria-hidden="true">·</span> <em>Tous pour un</em>
        </p>
        <ul className={styles.payments} aria-label="Métodos de pago">
          {PAYMENTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <ul className={styles.legal}>
          <li><Link href="/legal" className="mk-link">Aviso legal</Link></li>
          <li><Link href="/legal#privacidad" className="mk-link">Privacidad</Link></li>
          <li><Link href="/legal#cookies" className="mk-link">Cookies</Link></li>
          <li className={styles.region}>España · EUR €</li>
        </ul>
      </div>
    </footer>
  );
}
