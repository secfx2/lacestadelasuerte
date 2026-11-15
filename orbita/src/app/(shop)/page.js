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
import { bestSellerSlugs, categoryTiles, featureProducts, newInSlugs, slimByCategory } from "@/lib/shop-server";
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

export default function HomePage() {
  const tiles = categoryTiles();
  const banner = (id) => campaign.banners.find((b) => b.id === id);
  const split = (H.split || []).map(banner).filter(Boolean);
  const feature = H.feature?.category ? H.feature : null;
  const featured = feature ? featureProducts(4) : [];
  const featureBanner = feature ? banner(feature.banner) : null;
  const wide = banner(H.wide?.banner);
  const looks = campaign.lookbook.slice(0, H.lookbook?.count ?? 4);

  return (
    <>
      {/* 1 — Hero (header sits transparent over it) */}
      <section className={styles.hero} data-hero aria-label="Campaña">
        <HeroImage desktop={campaign.hero.desktop} mobile={campaign.hero.mobile} alt={campaign.hero.alt} />
        <div className={styles.heroShade} aria-hidden="true" />
        <h1 className="sr-only">{H.hero.srTitle}</h1>
        <div className={styles.heroCta}>
          <Link href={H.hero.ctaHref || "/tienda"} className={styles.heroBtn}>
            {H.hero.cta}
          </Link>
        </div>
        <p className={styles.heroCaption}>
          <span>{H.hero.caption}</span>
          <span className={styles.heroBar} aria-hidden="true">|</span>
          <em>{brand.tagline}</em>
        </p>
      </section>

      {/* 2 — Novedades */}
      <div className={styles.first}>
        <ChipGrid id="h-new" title={H.newIn.title} sets={chipSets(newInSlugs(), "novedades")} />
      </div>

      {/* 3 — Split editorial banner */}
      {split.length > 0 && (
        <section className={`${styles.section} ${styles.split}`} aria-label={brand.nav.collections}>
          {split.map((b) => (
            <Link key={b.id} href={b.href} className={styles.splitItem}>
              <SmartImage src={b.image} alt={b.title} sizes="(min-width: 768px) 50vw, 100vw" className={styles.splitImg} tone="bone" />
              <span className={styles.splitShade} aria-hidden="true" />
              <span className={styles.splitText}>
                <span className={styles.splitTitle}>{b.title}</span>
                <span className={styles.splitKicker}>{b.kicker}</span>
                <span className={styles.splitCta}>
                  {H.splitCta} <IconArrow size={12} />
                </span>
              </span>
            </Link>
          ))}
        </section>
      )}

      {/* 4 — Best sellers */}
      <div className={styles.section}>
        <ChipGrid id="h-best" title={H.bestSellers.title} sets={chipSets(bestSellerSlugs(), "destacados")} />
      </div>

      {/* 5 — Category tiles */}
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

      {/* 6 — Marquee */}
      <div className={styles.section}>
        <Marquee items={H.marquee} />
      </div>

      {/* 7 — Feature category (MUSKETEER: «Plata 925») */}
      {feature && featured.length > 0 && (
        <section className={styles.section} aria-labelledby="h-feature">
          <div className="mk-container">
            <SectionHead id="h-feature" title={feature.title} kicker={feature.kicker} href={`/categoria/${feature.category}`} linkLabel={feature.linkLabel} />
          </div>
          <div className={styles.silver}>
            {featureBanner && (
              <Link href={featureBanner.href} className={styles.silverFeature}>
                <SmartImage src={featureBanner.image} alt={featureBanner.title} sizes="(min-width: 1024px) 25vw, 100vw" className={styles.silverImg} tone="dark" />
                <span className={styles.splitShade} aria-hidden="true" />
                <span className={styles.splitText}>
                  <span className={styles.silverKicker}>{feature.text}</span>
                  <span className={styles.splitCta}>
                    {H.splitCta} <IconArrow size={12} />
                  </span>
                </span>
              </Link>
            )}
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} sizes="(min-width: 1024px) 25vw, 50vw" className={styles.silverCard} />
            ))}
          </div>
        </section>
      )}

      {/* 8 — Wide banner */}
      {wide && (
        <section className={styles.section} aria-label={wide.title}>
          <Link href={wide.href} className={styles.wide}>
            <SmartImage src={wide.image} alt="" sizes="100vw" className={styles.wideImg} tone="dark" />
            <span className={styles.wideShade} aria-hidden="true" />
            <span className={styles.wideText}>
              <span className={styles.wideTitle}>{wide.title}</span>
              <span className={styles.wideKicker}>{wide.kicker}</span>
              <span className={`${styles.wideCta} mk-link mk-link--on`}>{H.wide.cta}</span>
            </span>
          </Link>
        </section>
      )}

      {/* 9 — Lookbook teaser */}
      {looks.length > 0 && (
        <section className={`${styles.section} mk-container`} aria-labelledby="h-look">
          <SectionHead id="h-look" title={H.lookbook.title} kicker={H.lookbook.kicker} href="/lookbook" linkLabel={H.lookbook.linkLabel} />
          <div className={styles.looks}>
            {looks.map((l, i) => (
              <Link key={l.image} href={`/lookbook#look-${String(i + 1).padStart(2, "0")}`} className={styles.look}>
                <SmartImage src={l.image} alt={l.caption} sizes="(min-width: 768px) 25vw, 50vw" className={styles.lookImg} tone="bone" />
                <span className={styles.lookCaption}>{l.caption}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 10 — Newsletter */}
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
