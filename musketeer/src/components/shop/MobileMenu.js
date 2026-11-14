"use client";
import Link from "next/link";
import { useMemo, useRef } from "react";
import Logo from "@/components/brand/Logo";
import { useCatalog } from "./CartProvider";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconClose, IconSearch, IconArrow } from "./Icons";
import { CATEGORIES } from "@/lib/shop";
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
          <Link href="/" className={styles.logo} onClick={onClose} aria-label="MUSKETEER — inicio">
            <Logo variant="wordmark" title="MUSKETEER" style={{ height: 18, width: "auto", maxWidth: 160 }} />
          </Link>
          <button type="button" className={styles.icon} onClick={onSearch} aria-label="Buscar">
            <IconSearch />
          </button>
        </div>

        <nav className={styles.body} aria-label="Categorías">
          <p className={styles.heading}>Tienda</p>
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

          <ul className={styles.secondary}>
            <li><Link href="/lookbook" onClick={onClose}>Lookbook</Link></li>
            <li><Link href="/favoritos" onClick={onClose}>Favoritos</Link></li>
            <li><Link href="/la-maison" onClick={onClose}>La Maison</Link></li>
            <li><Link href="/cuenta" onClick={onClose}>Cuenta</Link></li>
            <li><Link href="/ayuda" onClick={onClose}>Ayuda</Link></li>
            <li><Link href="/brand" onClick={onClose}>Brand Book</Link></li>
          </ul>
        </nav>

        <div className={styles.foot}>
          <span className={styles.motto}>Tous pour un</span>
          <span>Envío gratuito desde 150 €</span>
        </div>
      </div>
    </div>
  );
}
