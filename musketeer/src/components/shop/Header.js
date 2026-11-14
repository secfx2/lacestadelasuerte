"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import { useCart } from "./CartProvider";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import { IconBag, IconMenu, IconSearch } from "./Icons";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const { count, ready, openCart } = useCart();
  const [mega, setMega] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const hoverTimer = useRef(null);
  const shopBtn = useRef(null);
  const checkout = pathname === "/checkout";

  // Close everything on navigation
  useEffect(() => {
    setMega(false);
    setMobile(false);
    setSearch(false);
  }, [pathname]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const openMega = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMega(true), 90);
  };
  const closeMega = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMega(false), 160);
  };

  const shopActive = pathname === "/tienda" || pathname.startsWith("/categoria") || pathname.startsWith("/producto");
  const countLabel = ready ? count : 0;

  if (checkout) {
    return (
      <header className={`${styles.header} ${styles.checkout}`}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link href="/cesta" className={`${styles.navLink} mk-link`}>
              <span aria-hidden="true">←</span> Volver a la cesta
            </Link>
          </div>
          <Link href="/" className={styles.logo} aria-label="MUSKETEER — inicio">
            <Logo variant="wordmark" title="MUSKETEER" className={styles.wordmark} />
          </Link>
          <div className={styles.right}>
            <span className={styles.secure}>Pago seguro · SSL</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={styles.header} data-mega={mega || undefined} onMouseLeave={closeMega}>
        <div className={styles.inner}>
          {/* Left — desktop nav / mobile triggers */}
          <nav className={styles.left} aria-label="Principal">
            <button type="button" className={styles.iconBtn + " " + styles.mobileOnly} onClick={() => setMobile(true)} aria-label="Abrir menú" aria-expanded={mobile}>
              <IconMenu />
            </button>
            <button type="button" className={styles.iconBtn + " " + styles.mobileOnly} onClick={() => setSearch(true)} aria-label="Buscar">
              <IconSearch />
            </button>
            <ul className={styles.navList}>
              <li onMouseEnter={openMega}>
                <button
                  ref={shopBtn}
                  type="button"
                  className={`${styles.navLink} mk-link ${shopActive || mega ? "mk-link--on" : ""}`}
                  aria-expanded={mega}
                  aria-controls="mega-menu"
                  onClick={() => setMega((v) => !v)}
                  onKeyDown={(e) => e.key === "ArrowDown" && (e.preventDefault(), setMega(true))}
                >
                  Tienda
                </button>
              </li>
              <li onMouseEnter={closeMega}>
                <Link href="/lookbook" className={`${styles.navLink} mk-link`} aria-current={pathname === "/lookbook" ? "page" : undefined}>
                  Lookbook
                </Link>
              </li>
              <li onMouseEnter={closeMega}>
                <Link href="/la-maison" className={`${styles.navLink} mk-link`} aria-current={pathname === "/la-maison" ? "page" : undefined}>
                  La Maison
                </Link>
              </li>
            </ul>
          </nav>

          <Link href="/" className={styles.logo} aria-label="MUSKETEER — inicio" onMouseEnter={closeMega}>
            <Logo variant="wordmark" title="MUSKETEER" className={styles.wordmark} />
          </Link>

          <div className={styles.right} onMouseEnter={closeMega}>
            <button type="button" className={`${styles.navLink} ${styles.desktopOnly} mk-link`} onClick={() => setSearch(true)}>
              Buscar
            </button>
            <Link href="/cuenta" className={`${styles.navLink} ${styles.desktopOnly} mk-link`} aria-current={pathname === "/cuenta" ? "page" : undefined}>
              Cuenta
            </Link>
            <button type="button" className={`${styles.navLink} ${styles.desktopOnly} mk-link`} onClick={openCart} aria-label={`Cesta, ${countLabel} artículos`}>
              Cesta <span className={styles.count}>({countLabel})</span>
            </button>
            <button type="button" className={`${styles.iconBtn} ${styles.mobileOnly} ${styles.bagBtn}`} onClick={openCart} aria-label={`Cesta, ${countLabel} artículos`}>
              <IconBag />
              <span className={styles.bagCount}>{countLabel}</span>
            </button>
          </div>
        </div>

        <MegaMenu open={mega} onClose={() => { setMega(false); shopBtn.current?.focus(); }} onEnter={openMega} />
      </header>
      <div className={styles.veil} data-open={mega || undefined} aria-hidden="true" onMouseEnter={closeMega} onClick={() => setMega(false)} />

      <MobileMenu open={mobile} onClose={() => setMobile(false)} onSearch={() => { setMobile(false); setSearch(true); }} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
