import Link from "next/link";
import Logo from "@/components/brand/Logo";
import FooterNewsletter from "./FooterNewsletter";
import RouteGate from "./RouteGate";
import { CATEGORIES } from "@/lib/shop";
import { publicFileExists } from "@/lib/shop-server";
import { asset } from "@/lib/asset";
import brand from "@/config/brand";
import styles from "./Footer.module.css";

const F = brand.footer;

/** Links flagged `file: true` only render once the file exists in /public (e.g. the brand-book PDF). */
const visible = (links) => links.filter((l) => !l.file || publicFileExists(l.href));

function FooterLink({ l }) {
  return l.file || /^https?:/.test(l.href) ? (
    <a href={asset(l.href)} className="mk-link">{l.label}</a>
  ) : (
    <Link href={l.href} className="mk-link">{l.label}</Link>
  );
}

function MinimalFooter() {
  return (
    <footer className={`${styles.footer} ${styles.minimal}`}>
      <div className={styles.bottom}>
        <p className={styles.copy}>
          {F.copyright} <span className={styles.dot} aria-hidden="true">·</span> <em>{brand.tagline}</em>
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
          <Logo variant="emblem" title={`Emblema ${brand.name}`} className={styles.emblem} />
          <FooterNewsletter
            title={
              <>
                <p className={styles.colTitle}>{brand.newsletter.name}</p>
                <p className={styles.lead}>{brand.newsletter.footerLead}</p>
              </>
            }
          />
        </div>

        <nav className={styles.col} aria-label={brand.nav.shop}>
          <p className={styles.colTitle}>{brand.nav.shop}</p>
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

        {F.columns.map((col) => (
          <nav key={col.title} className={styles.col} aria-label={col.title}>
            <p className={styles.colTitle}>{col.title}</p>
            <ul>
              {visible(col.links).map((l) => (
                <li key={l.href}>
                  <FooterLink l={l} />
                </li>
              ))}
            </ul>
            {col.sub && (
              <>
                <p className={`${styles.colTitle} ${styles.spaced}`}>{col.sub.title}</p>
                <ul>
                  {visible(col.sub.links).map((l) => (
                    <li key={l.href}>
                      <FooterLink l={l} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>
        ))}

        <div className={styles.col}>
          <p className={styles.colTitle}>{F.socialsTitle}</p>
          <ul>
            {F.socials.map((s) => (
              <li key={s.label}>
                {s.href && s.href !== "#" ? (
                  <a href={s.href} className="mk-link" target="_blank" rel="noopener noreferrer">{s.label}</a>
                ) : (
                  <a href="#" className="mk-link" aria-label={`${s.label} (próximamente)`}>{s.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.mark} aria-hidden="true">
        <Logo variant="wordmark" title={brand.name} className={styles.wordmark} />
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          {F.copyright} <span className={styles.dot} aria-hidden="true">·</span> <em>{brand.tagline}</em>
        </p>
        <ul className={styles.payments} aria-label="Métodos de pago">
          {brand.paymentBrands.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <ul className={styles.legal}>
          <li><Link href="/legal" className="mk-link">Aviso legal</Link></li>
          <li><Link href="/legal#privacidad" className="mk-link">Privacidad</Link></li>
          <li><Link href="/legal#cookies" className="mk-link">Cookies</Link></li>
          <li className={styles.region}>{brand.locale.region}</li>
        </ul>
      </div>
    </footer>
  );
}
