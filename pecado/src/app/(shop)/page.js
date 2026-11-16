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
import { bestSellerSlugs, categoryTiles, featureProducts, newInSlugs, slimByCategory, slimProducts } from "@/lib/shop-server";
import { CATEGORIES, productHref, sortProducts } from "@/lib/shop";
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

/** On-model shot (image 2, concrete wall) of a product; SmartImage falls back to the flat lay if it is missing. */
const wallShot = (p) => p.colors[0].images[1] || p.colors[0].images[0];

/**
 * Hero without campaign photography: the four models side by side against the same
 * concrete wall (campaign.hero.wall → their on-model product shots), the tagline in fraktur.
 */
function WallHero() {
  const crew = slimProducts(campaign.hero.wall || []);
  const mobile = campaign.hero.mobileSlug || crew[0]?.slug;
  return (
    <section className={styles.hero} data-hero aria-label="Campaña">
      <h1 className="sr-only">{H.hero.srTitle}</h1>
      <div className={styles.wall}>
        {crew.map((p, i) => (
          <Link key={p.slug} href={productHref(p)} className={styles.wallItem} data-mobile={p.slug === mobile || undefined}>
            <SmartImage
              src={wallShot(p)}
              alt={`${p.name} — ${campaign.hero.alt}`}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              className={styles.wallImg}
              tone="dark"
              priority={i < 2 || p.slug === mobile}
            />
            <span className={styles.wallCaption}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{p.name}</span>
            </span>
          </Link>
        ))}
      </div>
      <div className={styles.heroShade} aria-hidden="true" />
      <div className={styles.heroText}>
        <p className={styles.heroEyebrow}>{H.hero.eyebrow}</p>
        <p className={styles.heroTagline}>{brand.tagline}</p>
        <p className={styles.heroMotto}>{brand.motto}.</p>
        <div className={styles.heroCtas}>
          <Link href={H.hero.ctaHref || "/tienda"} className={`mk-btn ${styles.heroBtn}`}>
            {H.hero.cta}
          </Link>
          {H.hero.secondary && (
            <Link href={H.hero.secondaryHref} className={styles.heroGhost}>
              {H.hero.secondary}
            </Link>
          )}
        </div>
      </div>
    </section>
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
  const photoHero = campaign.hero.desktop;

  return (
    <>
      {/* 1 — Hero: the wall (or a campaign photo if campaign.hero.desktop exists). Header sits transparent over it. */}
      {photoHero ? (
        <section className={styles.hero} data-hero aria-label="Campaña">
          <HeroImage desktop={campaign.hero.desktop} mobile={campaign.hero.mobile} alt={campaign.hero.alt} />
          <h1 className="sr-only">{H.hero.srTitle}</h1>
        </section>
      ) : (
        <WallHero />
      )}

      {/* 2 — Novedades */}
      <div className={styles.first}>
        <ChipGrid id="h-new" title={H.newIn.title} sets={chipSets(newInSlugs(), "novedades")} />
      </div>

      {/* 3 — Split editorial banner: the two stars (jeans, hoodies) */}
      {split.length > 0 && (
        <section className={`${styles.section} ${styles.split}`} aria-label={brand.nav.collections}>
          {split.map((b, i) => (
            <Link key={b.id} href={b.href} className={styles.splitItem}>
              <SmartImage src={b.image} alt={b.title} sizes="(min-width: 768px) 50vw, 100vw" className={styles.splitImg} tone="dark" blend />
              <span className={styles.splitShade} aria-hidden="true" />
              <span className={styles.splitIndex} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
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

      {/* 5 — Category tiles (9 categories: the rail scrolls) */}
      <section className={`${styles.section} ${styles.catsSection}`} aria-labelledby="h-cats">
        <div className="mk-container">
          <SectionHead id="h-cats" title={H.categories.title} kicker={H.categories.kicker} href="/tienda" linkLabel={H.categories.linkLabel} />
        </div>
        <Rail label={H.categories.title} perView={4.5} perViewMobile={1.55} gap={2}>
          {tiles.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className={styles.cat}>
              <SmartImage src={c.hover || c.image} fallback={c.image} alt="" sizes="(min-width: 768px) 23vw, 64vw" className={styles.catImg} tone="dark" blend />
              <span className={styles.catShade} aria-hidden="true" />
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

      {/* 7 — Feature block (PECADO: the tracksuit sets) */}
      {feature && featured.length > 0 && (
        <section className={styles.section} aria-labelledby="h-feature">
          <div className="mk-container">
            <SectionHead id="h-feature" title={feature.title} kicker={feature.kicker} href={`/categoria/${feature.category}`} linkLabel={feature.linkLabel} />
          </div>
          <div className={styles.silver}>
            {featureBanner && (
              <Link href={featureBanner.href} className={styles.silverFeature}>
                <SmartImage src={featureBanner.image} alt={featureBanner.title} sizes="(min-width: 1024px) 25vw, 100vw" className={styles.silverImg} tone="dark" blend />
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

      {/* 8 — Wide typographic banner (no photo needed) */}
      {wide && (
        <section className={`${styles.section} mk-container`} aria-label={wide.title}>
          <Link href={wide.href} className={styles.wide}>
            <span className={styles.wideMeta}>
              <span>{wide.kicker}</span>
              <span>{brand.city} · {brand.year}</span>
            </span>
            <span className={styles.wideTitle}>
              {(H.wide.lines || [wide.title]).map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
            <span className={styles.wideSide}>
              {H.wide.text && <span className={styles.wideText}>{H.wide.text}</span>}
              {H.wide.note && <span className={styles.wideNote}>{H.wide.note}</span>}
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

      {/* 9 — Lookbook teaser */}
      {looks.length > 0 && (
        <section className={`${styles.section} mk-container`} aria-labelledby="h-look">
          <SectionHead id="h-look" title={H.lookbook.title} kicker={H.lookbook.kicker} href="/lookbook" linkLabel={H.lookbook.linkLabel} />
          <div className={styles.looks}>
            {looks.map((l, i) => (
              <Link key={l.image} href={`/lookbook#look-${String(i + 1).padStart(2, "0")}`} className={styles.look}>
                <SmartImage src={l.image} alt={`${l.caption} — ${l.title}`} sizes="(min-width: 768px) 25vw, 50vw" className={styles.lookImg} tone="dark" blend />
                <span className={styles.lookCaption}>
                  <span>{l.caption}</span>
                  <span className={styles.lookTitle}>{l.title}</span>
                </span>
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
