import Link from "next/link";
import Logo from "@/components/brand/Logo";
import SmartImage from "./SmartImage";
import { formatPrice, productHref } from "@/lib/shop";
import brand from "@/config/brand";
import styles from "./LineupHero.module.css";

const H = brand.home.hero;

/**
 * Home hero for a brand without campaign photography (MALA FAMA):
 * night field with a washed-burgundy glow, the script wordmark in Crudo, the tagline in
 * blackletter, the CTAs, and "la alineación": the featured sets worn by the casting
 * (image 2 of each product, shot on white and multiplied onto the light product tile).
 * Missing photos degrade to the tile placeholder with the dagger emblem.
 */
export default function LineupHero({ products = [] }) {
  return (
    <section className={styles.hero} data-hero aria-label="Campaña">
      <div className={styles.inner}>
        <div className={styles.meta}>
          <span>{H.eyebrow}</span>
          <span className={styles.metaRight}>{H.caption}</span>
        </div>

        <h1 className="sr-only">{H.srTitle}</h1>
        <div className={styles.mark}>
          <Logo variant="wordmark" title={brand.name} className={styles.wordmark} />
        </div>

        <div className={styles.row}>
          <p className={styles.tagline}>
            <span className={styles.taglineGothic}>{brand.tagline}.</span>
            {H.kicker && <span className={styles.kicker}>{H.kicker}</span>}
          </p>
          <div className={styles.ctas}>
            <Link href={H.ctaHref || "/tienda"} className={styles.btn}>
              {H.cta}
            </Link>
            {H.secondary && (
              <Link href={H.secondaryHref || "/tienda"} className={`${styles.textLink} mk-link mk-link--on`}>
                {H.secondary}
              </Link>
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div className={styles.lineup}>
            <p className={styles.stripLabel}>
              <span className={styles.dagger} aria-hidden="true" />
              {H.stripLabel}
              <span className={styles.stripCount}>{String(products.length).padStart(2, "0")} conjuntos</span>
            </p>
            <ol className={styles.strip}>
              {products.map((p, i) => (
                <li key={p.slug} className={styles.cell}>
                  <Link href={productHref(p)} className={styles.tile}>
                    <span className={styles.tileHead}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>{p.colors[0].name}</span>
                    </span>
                    <SmartImage
                      src={p.colors[0].images[1] || p.colors[0].images[0]}
                      alt={`${p.name} — con modelo`}
                      sizes="(min-width: 1024px) 19vw, 46vw"
                      className={styles.tileImg}
                      blend
                      priority={i < 3}
                    />
                    <span className={styles.tileFoot}>
                      <span className={styles.tileName}>{p.name}</span>
                      <span>{formatPrice(p.price)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
