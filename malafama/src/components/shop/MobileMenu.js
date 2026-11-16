"use client";
import Link from "next/link";
import { useMemo, useRef } from "react";
import Logo from "@/components/brand/Logo";
import { useCatalog } from "./CartProvider";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconClose, IconSearch, IconArrow } from "./Icons";
import SmartImage from "./SmartImage";
import { CATEGORIES, formatPrice, FREE_SHIPPING_FROM } from "@/lib/shop";
import brand from "@/config/brand";
import campaign from "@/data/campaign.json";
import styles from "./MobileMenu.module.css";

export default function MobileMenu({ open, onClose, onSearch }) {
  const ref = useRef(null);
  const catalog = useCatalog();
  const { mounted, visible } = usePresence(open, 500);
  useLockBody(open);
  useDialog(ref, open, onClose);
  const counts = useMemo(() => {
    const c = {};
    for (const p of catalog) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [catalog]);

  if (!mounted) return null;

  return (
    <div className={styles.root} data-visible={visible || undefined}>
      <div ref={ref} className={styles.panel} role="dialog" aria-modal="true" aria-label="Menú">
        <div className={styles.top}>
          <button type="button" className={styles.icon} onClick={onClose} aria-label="Cerrar menú">
            <IconClose size={18} />
          </button>
          <Link href="/" className={styles.logo} onClick={onClose} aria-label={`${brand.name} — inicio`}>
            <Logo variant="wordmark" title={brand.name} style={{ height: 26, width: "auto", maxWidth: 170 }} />
          </Link>
          <button type="button" className={styles.icon} onClick={onSearch} aria-label="Buscar">
            <IconSearch />
          </button>
        </div>

        <nav className={styles.body} aria-label="Categorías">
          <p className={styles.heading}>{brand.nav.shop}</p>
          <ul className={styles.cats}>
            {CATEGORIES.map((c, i) => (
              <li key={c.slug} style={{ "--i": i }}>
                <Link href={`/categoria/${c.slug}`} onClick={onClose} className={styles.cat}>
                  <span>{c.name}</span>
                  <sup>{counts[c.slug] || 0}</sup>
                </Link>
              </li>
            ))}
            <li style={{ "--i": CATEGORIES.length }}>
              <Link href="/tienda" onClick={onClose} className={styles.all}>
                Ver todo <IconArrow />
              </Link>
            </li>
          </ul>

          <p className={`${styles.heading} ${styles.collectionsHeading}`}>{brand.nav.collections}</p>
          <ul className={styles.collections}>
            {campaign.banners.filter((b) => b.image).map((b) => (
              <li key={b.id}>
                <Link href={b.href} onClick={onClose} className={styles.collection}>
                  <SmartImage src={b.image} alt="" sizes="40vw" className={styles.collectionImg} tone="bone" blend />
                  <span>{b.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className={styles.secondary}>
            <li><Link href="/lookbook" onClick={onClose}>{brand.nav.lookbook}</Link></li>
            <li><Link href="/favoritos" onClick={onClose}>Favoritos</Link></li>
            <li><Link href={brand.routes.about} onClick={onClose}>{brand.nav.about}</Link></li>
            <li><Link href="/cuenta" onClick={onClose}>Cuenta</Link></li>
            <li><Link href="/ayuda" onClick={onClose}>Ayuda</Link></li>
            <li><Link href="/brand" onClick={onClose}>{brand.nav.brandBook}</Link></li>
          </ul>
        </nav>

        <div className={styles.foot}>
          <span className={styles.motto}>{brand.tagline}</span>
          <span>Envío gratuito desde {formatPrice(FREE_SHIPPING_FROM)}</span>
        </div>
      </div>
    </div>
  );
}
