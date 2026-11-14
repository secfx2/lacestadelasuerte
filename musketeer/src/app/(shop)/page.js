import Link from "next/link";
import Logo from "@/components/brand/Logo";
import HeroImage from "@/components/shop/HeroImage";
import SmartImage from "@/components/shop/SmartImage";
import ProductCard from "@/components/shop/ProductCard";
import SectionHead from "@/components/shop/SectionHead";
import Marquee from "@/components/shop/Marquee";
import Rail from "@/components/shop/Rail";
import Newsletter from "@/components/shop/Newsletter";
import { IconArrow } from "@/components/shop/Icons";
import { categoryTiles, slimByCategory, slimProducts } from "@/lib/shop-server";
import campaign from "@/data/campaign.json";
import styles from "./home.module.css";

export const metadata = {
  title: { absolute: "MUSKETEER — Tous pour un" },
  description:
    "Ropa unisex de corte boxy y baggy, chaquetas, punto, accesorios y joyería de plata 925. Catálogo permanente, sin drops. Envío gratuito desde 150 €.",
  alternates: { canonical: "/" },
};

const ESSENTIALS = [
  "tous-pour-un-hoodie",
  "tabard-work-jacket",
  "mantle-cape",
  "emblem-signet-ring",
  "lace-up-poet-shirt",
  "baggy-carpenter-denim",
  "chainmail-knit",
  "cavalier-leather-bomber",
];

export default function HomePage() {
  const tiles = categoryTiles();
  const essentials = slimProducts(ESSENTIALS);
  const jewellery = slimByCategory("joyeria");
  const banners = campaign.banners.filter((b) => b.ratio === "4:5");
  const wide = campaign.banners.find((b) => b.id === "wide");
  const looks = campaign.lookbook.slice(0, 4);

  return (
    <>
      {/* 1 — Hero */}
      <section className={styles.hero} aria-label="Campaña">
        <HeroImage desktop={campaign.hero.desktop} mobile={campaign.hero.mobile} alt={campaign.hero.alt} />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>Catálogo permanente</p>
          <h1 className={styles.heroTitle}>Tous pour un</h1>
          <div className={styles.heroCtas}>
            <Link href="/tienda" className="mk-btn mk-btn--light">
              Ver catálogo
            </Link>
            <Link href="/lookbook" className={`${styles.heroLink} mk-link mk-link--on`}>
              Lookbook
            </Link>
          </div>
        </div>
        <p className={styles.heroCorner}>
          <span>MUSKETEER</span>
          <span>Ropa unisex · Plata 925</span>
        </p>
      </section>

      {/* 2 — Categories */}
      <section className={`${styles.section} mk-container`} aria-labelledby="h-cats">
        <SectionHead id="h-cats" title="Categorías" kicker="Todo, siempre disponible" href="/tienda" linkLabel="Ver catálogo" />
        <ul className={styles.cats}>
          {tiles.map((c) => (
            <li key={c.slug}>
              <Link href={`/categoria/${c.slug}`} className={styles.cat}>
                <SmartImage src={c.hover || c.image} alt="" sizes="(min-width: 1024px) 12.5vw, 42vw" className={styles.catImg} />
                <span className={styles.catLabel}>
                  <span>{c.name}</span>
                  <sup>{c.count}</sup>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 3 — Lo esencial */}
      <section className={`${styles.section} mk-container`} aria-labelledby="h-ess">
        <SectionHead id="h-ess" title="Lo esencial" kicker="Las piezas que definen la casa" href="/tienda" />
        <div className={styles.grid}>
          {essentials.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* 4 — Editorial banners */}
      <section className={`${styles.section} ${styles.banners}`} aria-label="Colecciones">
        {banners.map((b) => (
          <Link key={b.id} href={b.href} className={styles.banner}>
            <SmartImage src={b.image} alt={b.title} sizes="(min-width: 768px) 33vw, 86vw" className={styles.bannerImg} tone="bone" />
            <span className={styles.bannerText}>
              <span className={styles.bannerTitle}>{b.title}</span>
              <span className={styles.bannerKicker}>{b.kicker}</span>
              <span className={styles.bannerCta}>
                Descubrir <IconArrow size={12} />
              </span>
            </span>
          </Link>
        ))}
      </section>

      {/* 5 — Marquee */}
      <div className={styles.section}>
        <Marquee items={["Tous pour un", "Un pour tous"]} />
      </div>

      {/* 6 — Plata 925 */}
      <section className={`${styles.section} ${styles.silver} mk-container`} aria-labelledby="h-silver">
        <div className={styles.silverText}>
          <p className="mk-eyebrow">Joyería</p>
          <h2 id="h-silver" className={styles.silverTitle}>
            Plata 925
          </h2>
          <p className={styles.silverLead}>Forjada para durar más que la moda.</p>
          <p className={styles.silverBody}>
            Sellos, guanteletes y cadenas en plata de ley maciza, con el emblema de las tres espadas grabado a mano. Sin baños, sin
            atajos. Cada pieza llega con su certificado sellado.
          </p>
          <Link href="/categoria/joyeria" className="mk-btn mk-btn--ghost">
            Ver joyería
          </Link>
        </div>
        <div className={styles.silverRail}>
          <Rail label="Joyería de plata 925" perView={3} perViewMobile={1.7}>
            {jewellery.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 20vw, 60vw" />
            ))}
          </Rail>
        </div>
      </section>

      {/* 7 — Wide banner */}
      {wide && (
        <section className={styles.section} aria-label={wide.title}>
          <Link href={wide.href} className={styles.wide}>
            <SmartImage src={wide.image} alt="" sizes="100vw" className={styles.wideImg} tone="dark" />
            <span className={styles.wideShade} aria-hidden="true" />
            <span className={styles.wideText}>
              <span className={styles.wideTitle}>{wide.title}</span>
              <span className={styles.wideKicker}>{wide.kicker}</span>
              <span className={`${styles.wideCta} mk-link mk-link--on`}>Ver catálogo</span>
            </span>
          </Link>
        </section>
      )}

      {/* 8 — Lookbook teaser */}
      <section className={`${styles.section} mk-container`} aria-labelledby="h-look">
        <SectionHead id="h-look" title="Lookbook" kicker="Cuatro mosqueteros, un uniforme" href="/lookbook" linkLabel="Ver lookbook" />
        <div className={styles.looks}>
          {looks.map((l, i) => (
            <Link key={l.image} href={`/lookbook#look-${String(i + 1).padStart(2, "0")}`} className={styles.look}>
              <SmartImage src={l.image} alt={l.caption} sizes="(min-width: 768px) 25vw, 50vw" className={styles.lookImg} tone="bone" />
              <span className={styles.lookCaption}>{l.caption}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9 — Newsletter */}
      <section className={`${styles.section} mk-container`} aria-labelledby="h-news">
        <div className={styles.news}>
          <Logo variant="seal" title="Sello Tous pour un" className={styles.newsSeal} />
          <div className={styles.newsText}>
            <p className="mk-eyebrow">La carta del regimiento</p>
            <h2 id="h-news" className={styles.newsTitle}>
              Únete a la hermandad
            </h2>
            <p className={styles.newsLead}>Reposiciones, piezas raras y notas del taller. Una carta al mes, nunca más.</p>
          </div>
          <div className={styles.newsForm}>
            <Newsletter variant="feature" />
          </div>
        </div>
      </section>
    </>
  );
}
