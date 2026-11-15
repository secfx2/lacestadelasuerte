import Link from "next/link";
import Logo from "@/components/brand/Logo";
import HeroImage from "@/components/shop/HeroImage";
import LineupHero from "@/components/shop/LineupHero";
import SmartImage from "@/components/shop/SmartImage";
import ProductCard from "@/components/shop/ProductCard";
import SectionHead from "@/components/shop/SectionHead";
import ChipGrid from "@/components/shop/ChipGrid";
import Marquee from "@/components/shop/Marquee";
import Rail from "@/components/shop/Rail";
import Newsletter from "@/components/shop/Newsletter";
import { IconArrow } from "@/components/shop/Icons";
import { bestSellerSlugs, categoryTiles, featureProducts, newInSlugs, slimByCategory, slimProducts } from "@/lib/shop-server";
import { CATEGORIES, sortProducts } from "@/lib/shop";
import brand from "@/config/brand";
import campaign from "@/data/campaign.json";
import styles from "./home.module.css";

const H = brand.home;

export const metadata = {
  title: { absolute: brand.seo.title },
  description: brand.seo.home,
  alternates: { canonical: "/" },
};

/** Chip sets for a ChipGrid: "Ver todo" + one per category (categories without products are skipped). */
function chipSets(allSlugs, sort) {
  return [
    { id: "all", label: "Ver todo", slugs: allSlugs, href: sort === "novedades" ? "/tienda?orden=novedades" : "/tienda" },
    ...CATEGORIES.map((c) => ({
      id: c.slug,
      label: c.name,
      slugs: sortProducts(slimByCategory(c.slug), sort).slice(0, 10).map((p) => p.slug),
      href: `/categoria/${c.slug}`,
    })).filter((s) => s.slugs.length),
  ];
}

/**
 * Editorial banner from a product shot (shot on white): the photo multiplies onto the tile grey
 * and the copy sits in a coloured label box (banner.tone: accent | ink | bone | steel | alert).
 */
function LabelBanner({ b, n, sizes, className = "", imgClassName = "", compact = false, children }) {
  return (
    <Link href={b.href} className={`${styles.labelBanner} ${className}`}>
      <SmartImage src={b.image} alt={b.title} sizes={sizes} className={imgClassName} tone="bone" blend />
      {n && <span className={styles.labelIndex}>{n}</span>}
      <span className={styles.label} data-tone={b.tone || "ink"} data-compact={compact || undefined}>
        <span className={styles.labelTitle}>{b.title}</span>
        <span className={styles.labelKicker}>{children || b.kicker}</span>
        <span className={styles.labelCta}>
          {H.splitCta} <IconArrow size={12} />
        </span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  const tiles = categoryTiles();
  const banner = (id) => campaign.banners.find((b) => b.id === id);
  const split = (H.split || []).map(banner).filter(Boolean);
  const feature = H.feature?.category ? H.feature : null;
  const featured = feature ? featureProducts(4) : [];
  const featureBanner = feature ? banner(feature.banner) : null;
  const wide = banner(H.wide?.banner);
  const looks = campaign.lookbook.slice(0, H.lookbook?.count ?? 4);
  const lineup = slimProducts(campaign.hero.strip || []);
  const photoHero = campaign.hero.desktop;
  const sets = H.sets?.chips?.length
    ? H.sets.chips.map((c) => ({ ...c, href: H.sets.href, more: H.sets.more })).filter((c) => c.slugs.length)
    : null;

  return (
    <>
      {/* 1 — Hero: lineup of sets on the night field (or a campaign photo if campaign.hero.desktop exists) */}
      {photoHero ? (
        <section className={styles.hero} data-hero aria-label="Campaña">
          <HeroImage desktop={campaign.hero.desktop} mobile={campaign.hero.mobile} alt={campaign.hero.alt} />
          <h1 className="sr-only">{H.hero.srTitle}</h1>
        </section>
      ) : (
        <LineupHero products={lineup} />
      )}

      {/* 2 — Conjuntos, la pieza estrella */}
      {sets && (
        <div className={styles.first}>
          <ChipGrid id="h-sets" title={H.sets.title} kicker={H.sets.kicker} sets={sets} cols={H.sets.cols || 4} />
        </div>
      )}

      {/* 3 — Split editorial banners (product shots + label boxes) */}
      {split.length > 0 && (
        <section className={`${styles.section} ${styles.split}`} aria-label={brand.nav.collections}>
          {split.map((b, i) => (
            <LabelBanner key={b.id} b={b} n={`0${i + 1}`} sizes="(min-width: 768px) 50vw, 100vw" imgClassName={styles.splitImg} />
          ))}
        </section>
      )}

      {/* 4 — Novedades */}
      <div className={styles.section}>
        <ChipGrid id="h-new" title={H.newIn.title} sets={chipSets(newInSlugs(), "novedades")} />
      </div>

      {/* 5 — Marquee */}
      <div className={styles.section}>
        <Marquee items={H.marquee} />
      </div>

      {/* 6 — Best sellers */}
      <div className={styles.section}>
        <ChipGrid id="h-best" title={H.bestSellers.title} sets={chipSets(bestSellerSlugs(), "destacados")} />
      </div>

      {/* 7 — Category tiles */}
      <section className={`${styles.section} ${styles.catsSection}`} aria-labelledby="h-cats">
        <div className="mk-container">
          <SectionHead id="h-cats" title={H.categories.title} kicker={H.categories.kicker} href="/tienda" linkLabel={H.categories.linkLabel} />
        </div>
        <Rail label={H.categories.title} perView={4} perViewMobile={1.55} gap={0}>
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

      {/* 8 — Feature category: Plata 925 */}
      {feature && featured.length > 0 && (
        <section className={styles.section} aria-labelledby="h-feature">
          <div className="mk-container">
            <SectionHead id="h-feature" title={feature.title} kicker={feature.kicker} href={`/categoria/${feature.category}`} linkLabel={feature.linkLabel} />
          </div>
          <div className={styles.silver}>
            {featureBanner && (
              <LabelBanner b={featureBanner} sizes="(min-width: 1024px) 25vw, 100vw" className={styles.silverFeature} imgClassName={styles.silverImg} compact>
                {feature.text}
              </LabelBanner>
            )}
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 25vw, 50vw" className={styles.silverCard} />
            ))}
          </div>
        </section>
      )}

      {/* 9 — Wide typographic banner (no photo needed) */}
      {wide && (
        <section className={`${styles.section} mk-container`} aria-label={wide.title}>
          <Link href={wide.href} className={styles.wide} data-tone={wide.tone || "accent"}>
            <span className={styles.wideMeta}>
              <span>{wide.kicker}</span>
              <span>{H.wide.note}</span>
            </span>
            <span className={styles.wideTitle}>
              {(H.wide.lines || [wide.title]).map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className={styles.wideSide}>
              {H.wide.text && <span className={styles.wideText}>{H.wide.text}</span>}
              <span className={styles.wideCta}>
                {H.wide.cta} <IconArrow size={12} />
              </span>
            </span>
            <span className={styles.wideEmblem} aria-hidden="true">
              <Logo variant="emblem" title="" />
            </span>
          </Link>
        </section>
      )}

      {/* 10 — Lookbook teaser */}
      {looks.length > 0 && (
        <section className={`${styles.section} mk-container`} aria-labelledby="h-look">
          <SectionHead id="h-look" title={H.lookbook.title} kicker={H.lookbook.kicker} href="/lookbook" linkLabel={H.lookbook.linkLabel} />
          <div className={styles.looks}>
            {looks.map((l, i) => (
              <Link key={l.image} href={`/lookbook#look-${String(i + 1).padStart(2, "0")}`} className={styles.look}>
                <SmartImage src={l.image} alt={`${l.caption} — ${l.title}`} sizes="(min-width: 768px) 25vw, 50vw" className={styles.lookImg} tone="bone" blend />
                <span className={styles.lookCaption}>
                  <span>{l.caption}</span>
                  <span>{l.title}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 11 — Newsletter */}
      <section className={`${styles.section} mk-container`} aria-labelledby="h-news">
        <div className={styles.news}>
          <Logo variant="seal" title={H.newsletter.sealTitle} className={styles.newsSeal} />
          <div className={styles.newsText}>
            <p className="mk-eyebrow">{brand.newsletter.name}</p>
            <h2 id="h-news" className={styles.newsTitle}>
              {H.newsletter.title}
            </h2>
            <p className={styles.newsLead}>{brand.newsletter.lead}</p>
          </div>
          <div className={styles.newsForm}>
            <Newsletter variant="feature" />
          </div>
        </div>
      </section>
    </>
  );
}
