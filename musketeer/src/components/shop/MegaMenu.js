"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import SmartImage from "./SmartImage";
import { useCatalog } from "./CartProvider";
import { CATEGORIES } from "@/lib/shop";
import campaign from "@/data/campaign.json";
import styles from "./MegaMenu.module.css";

const FEATURED = ["chaquetas", "joyeria"].map((id) => campaign.banners.find((b) => b.id === id)).filter(Boolean);

export default function MegaMenu({ open, onClose, onEnter }) {
  const catalog = useCatalog();
  const ref = useRef(null);
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
    <div
      id="mega-menu"
      ref={ref}
      className={styles.panel}
      data-open={open || undefined}
      onMouseEnter={onEnter}
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
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
            <li><Link href="/tienda?orden=novedades" className="mk-link">Novedades</Link></li>
            <li><Link href="/tienda" className="mk-link">Lo esencial</Link></li>
            <li><Link href="/categoria/joyeria" className="mk-link">Plata 925</Link></li>
            <li><Link href="/lookbook" className="mk-link">Lookbook</Link></li>
            <li><Link href="/ayuda#tallas" className="mk-link">Guía de tallas</Link></li>
          </ul>
          <p className={styles.motto}>
            <em>Tous pour un.</em> Catálogo permanente, sin drops: todo está siempre disponible.
          </p>
        </div>

        {FEATURED.map((b, i) => (
          <Link key={b.id} href={b.href} className={styles.feature} tabIndex={open ? 0 : -1}>
            <SmartImage src={b.image} alt={b.title} sizes="(min-width: 1024px) 22vw, 1px" className={styles.featureImg} tone="bone" />
            <span className={styles.featureText}>
              <span className={styles.featureTitle}>{b.title}</span>
              <span className={styles.featureKicker}>{b.kicker}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
