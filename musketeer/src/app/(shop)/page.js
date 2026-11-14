import Link from "next/link";
import Logo from "@/components/brand/Logo";
import HeroImage from "@/components/shop/HeroImage";
import SmartImage from "@/components/shop/SmartImage";
import ProductCard from "@/components/shop/ProductCard";
import SectionHead from "@/components/shop/SectionHead";
import ChipGrid from "@/components/shop/ChipGrid";
import Marquee from "@/components/shop/Marquee";
import Rail from "@/components/shop/Rail";
import Newsletter from "@/components/shop/Newsletter";
import { IconArrow } from "@/components/shop/Icons";
import { categoryTiles, slimByCategory, slimProducts } from "@/lib/shop-server";
import { CATEGORIES, sortProducts } from "@/lib/shop";
import campaign from "@/data/campaign.json";
import styles from "./home.module.css";

export const metadata = {
  title: { absolute: "MUSKETEER — Tous pour un" },
  description:
    "Ropa unisex de corte boxy y baggy, chaquetas, punto, accesorios y joyería de plata 925. Catálogo permanente, sin drops. Envío gratuito desde 150 €.",
  alternates: { canonical: "/" },
};

const NEW_IN = [
  "mantle-cropped-jacket",
  "brotherhood-varsity",
  "tabard-track-jacket",
  "boxy-emblem-tee",
  "riviera-knit-polo",
  "garde-rugby-shirt",
  "feint-windbreaker",
  "cropped-zip-hoodie",
  "tabard-cropped-cardigan",
  "barrel-denim",
];

const BEST_SELLERS = [
  "tous-pour-un-hoodie",
  "tabard-work-jacket",
  "mantle-cape",
  "emblem-signet-ring",
  "lace-up-poet-shirt",
  "baggy-carpenter-denim",
  "chainmail-knit",
  "cavalier-leather-bomber",
  "gothic-logo-tee",
  "plume-cap",
];

/** Chip sets for a ChipGrid: "Ver todo" + one per category. */
function chipSets(allSlugs, sort) {
  return [
    { id: "all", label: "Ver todo", slugs: allSlugs, href: sort === "novedades" ? "/tienda?orden=novedades" : "/tienda" },
    ...CATEGORIES.map((c) => ({
      id: c.slug,
      label: c.name,
      slugs: sortProducts(slimByCategory(c.slug), sort).slice(0, 10).map((p) => p.slug),
      href: `/categoria/${c.slug}`,
    })),
  ];
}

export default function HomePage() {
  const tiles = categoryTiles();
  const jewellery = slimProducts(["emblem-signet-ring", "gauntlet-ring", "fleur-link-chain", "hilt-pendant"]);
  const banner = (id) => campaign.banners.find((b) => b.id === id);
  const split = [banner("chaquetas"), banner("punto")].filter(Boolean);
  const silver = banner("joyeria");
  const wide = banner("wide");
  const looks = campaign.lookbook.slice(0, 4);

  return (
    <>
      {/* 1 — Hero (header sits transparent over it) */}
      <section className={styles.hero} data-hero aria-label="Campaña">
        <HeroImage desktop={campaign.hero.desktop} mobile={campaign.hero.mobile} alt={campaign.hero.alt} />
        <div className={styles.heroShade} aria-hidden="true" />
        <h1 className="sr-only">MUSKETEER — Tous pour un. Ropa unisex y joyería de plata 925.</h1>
        <div className={styles.heroCta}>
          <Link href="/tienda" className={styles.heroBtn}>
            Comprar
          </Link>
        </div>
        <p className={styles.heroCaption}>
          <span>Catálogo permanente</span>
          <span className={styles.heroBar} aria-hidden="true">|</span>
          <em>Tous pour un</em>
        </p>
      </section>

      {/* 2 — Novedades */}
      <div className={styles.first}>
        <ChipGrid id="h-new" title="Novedades" sets={chipSets(NEW_IN, "novedades")} />
      </div>

      {/* 3 — Split editorial banner */}
      <section className={`${styles.section} ${styles.split}`} aria-label="Colecciones">
        {split.map((b, i) => (
          <Link key={b.id} href={b.href} className={styles.splitItem}>
            <SmartImage src={b.image} alt={b.title} sizes="(min-width: 768px) 50vw, 100vw" className={styles.splitImg} tone="bone" />
            <span className={styles.splitShade} aria-hidden="true" />
            <span className={styles.splitText}>
              <span className={styles.splitTitle}>{b.title}</span>
              <span className={styles.splitKicker}>{b.kicker}</span>
              <span className={styles.splitCta}>
                Descubrir <IconArrow size={12} />
              </span>
            </span>
          </Link>
        ))}
      </section>

      {/* 4 — Best sellers */}
      <div className={styles.section}>
        <ChipGrid id="h-best" title="Best Sellers" sets={chipSets(BEST_SELLERS, "destacados")} />
      </div>

      {/* 5 — Category tiles */}
      <section className={`${styles.section} ${styles.catsSection}`} aria-labelledby="h-cats">
        <div className="mk-container">
          <SectionHead id="h-cats" title="Categorías" kicker="Todo, siempre disponible" href="/tienda" linkLabel="Ver catálogo" />
        </div>
        <Rail label="Categorías" perView={4} perViewMobile={1.55} gap={0}>
          {tiles.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className={styles.cat}>
              <SmartImage src={c.hover || c.image} alt="" sizes="(min-width: 768px) 25vw, 64vw" className={styles.catImg} blend />
              <span className={styles.catLabel}>
                <span>{c.name}</span>
                <sup>{c.count}</sup>
              </span>
            </Link>
          ))}
        </Rail>
      </section>

      {/* 6 — Marquee */}
      <div className={styles.section}>
        <Marquee items={["Tous pour un", "Un pour tous"]} />
      </div>

      {/* 7 — Plata 925 */}
      <section className={styles.section} aria-labelledby="h-silver">
        <div className="mk-container">
          <SectionHead id="h-silver" title="Plata 925" kicker="Forjada para durar más que la moda" href="/categoria/joyeria" linkLabel="Ver joyería" />
        </div>
        <div className={styles.silver}>
          {silver && (
            <Link href={silver.href} className={styles.silverFeature}>
              <SmartImage src={silver.image} alt={silver.title} sizes="(min-width: 1024px) 25vw, 100vw" className={styles.silverImg} tone="dark" />
              <span className={styles.splitShade} aria-hidden="true" />
              <span className={styles.splitText}>
                <span className={styles.silverKicker}>Sellos, guanteletes y cadenas en plata de ley maciza. Sin baños, sin atajos.</span>
                <span className={styles.splitCta}>
                  Descubrir <IconArrow size={12} />
                </span>
              </span>
            </Link>
          )}
          {jewellery.map((p) => (
            <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 25vw, 50vw" className={styles.silverCard} />
          ))}
        </div>
      </section>

      {/* 8 — Wide banner */}
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

      {/* 9 — Lookbook teaser */}
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

      {/* 10 — Newsletter */}
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
