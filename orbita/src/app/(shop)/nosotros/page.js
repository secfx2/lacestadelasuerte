import Link from "next/link";
import Logo from "@/components/brand/Logo";
import PageIntro from "@/components/shop/PageIntro";
import SmartImage from "@/components/shop/SmartImage";
import { IconArrow } from "@/components/shop/Icons";
import { getSlimProduct } from "@/lib/shop-server";
import { productHref } from "@/lib/shop";
import brand from "@/config/brand";
import campaign from "@/data/campaign.json";
import styles from "./about.module.css";

/* Manifesto / about page. Copy: brand.about in src/config/brand.js; crew strip: campaign.json → maison.crew. */
const A = brand.about;

export const metadata = {
  title: A.title,
  description: brand.seo.about,
  alternates: { canonical: brand.routes.about },
};

export default function AboutPage() {
  // No campaign photography: the crew strip uses each model's on-model product shot (image 2).
  const crew = (campaign.maison?.crew || [])
    .map((m) => ({ ...m, product: getSlimProduct(m.slug) }))
    .filter((m) => m.product);
  return (
    <>
      <PageIntro crumbs={[{ label: "Inicio", href: "/" }, { label: A.title }]} title={A.title} aside={A.aside} />

      {crew.length > 0 ? (
        <section className={styles.crew} aria-label={A.crewTitle || campaign.maison?.alt}>
          <div className={styles.crewHead}>
            <span>{A.crewTitle}</span>
            <span>{A.crewText}</span>
          </div>
          <ol className={styles.crewGrid}>
            {crew.map((m, i) => (
              <li key={m.slug}>
                <Link href={productHref(m.product)} className={styles.crewItem}>
                  <SmartImage
                    src={m.product.colors[0].images[1] || m.product.colors[0].images[0]}
                    alt={`${m.name} — ${m.product.name}`}
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className={styles.crewImg}
                    tone="bone"
                    blend
                    priority
                  />
                  <span className={styles.crewCaption}>
                    <span>{String(i + 1).padStart(2, "0")} · {m.name}</span>
                    <span>{m.product.name}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : (
        <div className={styles.hero}>
          <SmartImage src={campaign.maison?.image} alt={campaign.maison?.alt || ""} sizes="100vw" className={styles.heroImg} tone="bone" priority />
        </div>
      )}

      <section className={styles.manifesto} aria-labelledby="h-manifesto">
        <p id="h-manifesto" className={styles.eyebrow}>
          {A.eyebrow}
        </p>
        <div className={styles.manifestoText}>
          <p className={styles.lead}>{A.lead}</p>
          {A.paragraphs.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <p className={styles.sign}>
            <em>{A.sign}.</em>
          </p>
        </div>
      </section>

      <section className={styles.values} aria-label="Valores">
        {A.values.map((v) => (
          <article key={v.n} className={styles.value}>
            <span className={styles.valueN}>{v.n}</span>
            <h2 className={styles.valueTitle}>{v.title}</h2>
            <p className={styles.valueText}>{v.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.seal} aria-label="Sello">
        <Logo variant="seal" title={`Sello ${brand.name}`} className={styles.sealLogo} />
        <p className={styles.sealText}>{A.sealText}</p>
      </section>

      <section className={styles.links} aria-label="Más">
        {A.links.map((l) => (
          <Link key={l.href} href={l.href} className={styles.linkCard}>
            <span className={styles.linkEyebrow}>{l.eyebrow}</span>
            <span className={styles.linkTitle}>{l.title}</span>
            <span className={styles.linkText}>{l.text}</span>
            <span className={styles.linkCta}>
              {l.cta} <IconArrow size={12} />
            </span>
          </Link>
        ))}
      </section>
    </>
  );
}
