"use client";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import SmartImage from "./SmartImage";
import { useCatalog } from "./CartProvider";
import { CATEGORIES } from "@/lib/shop";
import brand from "@/config/brand";
import campaign from "@/data/campaign.json";
import styles from "./MegaMenu.module.css";

const M = brand.megaMenu;
const banner = (id) => campaign.banners.find((b) => b.id === id);
const SHOP_FEATURED = (M.shopBanners || []).map(banner).filter(Boolean).slice(0, 2);
const COLLECTIONS = (M.collectionBanners?.length ? M.collectionBanners.map(banner) : campaign.banners).filter((b) => b?.image).slice(0, 4);

export default function MegaMenu({ id, variant = "shop", open, onClose, onEnter }) {
  const catalog = useCatalog();
  const counts = useMemo(() => {
    const c = {};
    for (const p of catalog) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [catalog]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div id={id} className={styles.panel} data-open={open || undefined} onMouseEnter={onEnter} inert={!open ? true : undefined}>
      {variant === "shop" ? (
        <div className={styles.grid}>
          <div className={styles.col}>
            <p className={styles.heading}>Categorías</p>
            <ul className={styles.cats}>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categoria/${c.slug}`} className={styles.cat}>
                    <span className="mk-link">{c.name}</span>
                    <sup>{counts[c.slug] || 0}</sup>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/tienda" className={`${styles.all} mk-link mk-link--on`}>
              Ver todo — {catalog.length} piezas
            </Link>
          </div>

          <div className={styles.col}>
            <p className={styles.heading}>Selección</p>
            <ul className={styles.links}>
              {M.selection.map((l) => (
                <li key={l.label}><Link href={l.href} className="mk-link">{l.label}</Link></li>
              ))}
            </ul>
            <p className={styles.motto}>
              <em>{brand.tagline}.</em> {M.note}
            </p>
          </div>

          {SHOP_FEATURED.map((b) => (
            <Link key={b.id} href={b.href} className={styles.feature}>
              <SmartImage src={b.image} alt={b.title} sizes="(min-width: 1024px) 22vw, 1px" className={styles.featureImg} tone="dark" blend />
              <span className={styles.featureText}>
                <span className={styles.featureTitle}>{b.title}</span>
                <span className={styles.featureKicker}>{b.kicker}</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className={styles.gridCollections}>
          <div className={styles.col}>
            <p className={styles.heading}>{brand.nav.collections}</p>
            <ul className={styles.links}>
              {COLLECTIONS.map((b) => (
                <li key={b.id}><Link href={b.href} className="mk-link">{b.title}</Link></li>
              ))}
              <li><Link href="/lookbook" className="mk-link">{brand.nav.lookbook}</Link></li>
              <li><Link href={brand.routes.about} className="mk-link">{brand.nav.about}</Link></li>
              <li><Link href="/brand" className="mk-link">{brand.nav.brandBook}</Link></li>
            </ul>
          </div>
          {COLLECTIONS.map((b) => (
            <Link key={b.id} href={b.href} className={styles.feature}>
              <SmartImage src={b.image} alt={b.title} sizes="(min-width: 1024px) 18vw, 1px" className={styles.featureImg} tone="dark" blend />
              <span className={styles.featureText}>
                <span className={styles.featureTitle}>{b.title}</span>
                <span className={styles.featureKicker}>{b.kicker}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
