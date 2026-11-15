"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Logo from "@/components/brand/Logo";
import { useCart, useWishlist } from "./CartProvider";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import { IconBag, IconMenu, IconSearch, IconStar, IconUser } from "./Icons";
import brand from "@/config/brand";
import styles from "./Header.module.css";

const MENUS = [
  { id: "shop", label: brand.nav.shop },
  { id: "collections", label: brand.nav.collections },
];

export default function Header() {
  const pathname = usePathname();
  const { count, ready, openCart } = useCart();
  const wish = useWishlist();
  const [menu, setMenu] = useState(null); // null | "shop" | "collections"
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [hovering, setHovering] = useState(false);
  const isHome = pathname === "/";
  const [overHero, setOverHero] = useState(isHome);
  const hoverTimer = useRef(null);
  const triggers = useRef({});
  const headerRef = useRef(null);
  const checkout = pathname === "/checkout";

  // Close everything on navigation
  useEffect(() => {
    setMenu(null);
    setMobile(false);
    setSearch(false);
    setHovering(false);
  }, [pathname]);

  // Transparent over the home hero; solid once scrolled past it (layout effect: no flash on client navigation)
  useLayoutEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
      setOverHero(false);
      return;
    }
    const onScroll = () => {
      const h = headerRef.current?.offsetHeight || 56;
      setOverHero(hero.getBoundingClientRect().bottom > h + 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const openMenu = (id) => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMenu(id), 90);
  };
  const closeMenu = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setMenu(null), 160);
  };

  const shopActive = pathname === "/tienda" || pathname.startsWith("/categoria") || pathname.startsWith("/producto");
  const n = ready ? count : 0;
  const w = wish.ready ? wish.count : 0;
  const transparent = overHero && !menu && !hovering && !search && !mobile;

  if (checkout) {
    return (
      <header className={`${styles.header} ${styles.checkout}`}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <Link href="/cesta" className={`${styles.navLink} mk-link`}>
              <span aria-hidden="true">←</span> Volver a la cesta
            </Link>
          </div>
          <Link href="/" className={styles.logo} aria-label={`${brand.name} — inicio`}>
            <Logo variant="wordmark" title={brand.name} className={styles.wordmark} />
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
      <header
        ref={headerRef}
        className={styles.header}
        data-transparent={transparent || undefined}
        data-home={isHome || undefined}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => {
          setHovering(false);
          closeMenu();
        }}
      >
        <div className={styles.inner}>
          <nav className={styles.left} aria-label="Principal">
            <button type="button" className={`${styles.iconBtn} ${styles.mobileOnly}`} onClick={() => setMobile(true)} aria-label="Abrir menú" aria-expanded={mobile}>
              <IconMenu />
            </button>
            <button type="button" className={`${styles.iconBtn} ${styles.mobileOnly}`} onClick={() => setSearch(true)} aria-label="Buscar">
              <IconSearch />
            </button>
            <ul className={styles.navList}>
              {MENUS.map((m) => (
                <li key={m.id} onMouseEnter={() => openMenu(m.id)}>
                  <button
                    ref={(el) => (triggers.current[m.id] = el)}
                    type="button"
                    className={`${styles.navLink} mk-link ${menu === m.id || (m.id === "shop" && shopActive && !menu) ? styles.active : ""}`}
                    aria-expanded={menu === m.id}
                    aria-controls={`menu-${m.id}`}
                    onClick={() => setMenu((v) => (v === m.id ? null : m.id))}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setMenu(m.id);
                      }
                    }}
                  >
                    {m.label}
                  </button>
                </li>
              ))}
              <li onMouseEnter={closeMenu}>
                <Link href="/lookbook" className={`${styles.navLink} mk-link`} aria-current={pathname === "/lookbook" ? "page" : undefined}>
                  {brand.nav.lookbook}
                </Link>
              </li>
              <li onMouseEnter={closeMenu}>
                <Link href={brand.routes.about} className={`${styles.navLink} mk-link`} aria-current={pathname === brand.routes.about ? "page" : undefined}>
                  {brand.nav.about}
                </Link>
              </li>
            </ul>
          </nav>

          <Link href="/" className={styles.logo} aria-label={`${brand.name} — inicio`} onMouseEnter={closeMenu}>
            <Logo variant="wordmark" title={brand.name} className={styles.wordmark} />
          </Link>

          <div className={styles.right} onMouseEnter={closeMenu}>
            <button type="button" className={`${styles.iconBtn} ${styles.desktopOnly}`} onClick={() => setSearch(true)} aria-label="Buscar" title="Buscar">
              <IconSearch />
            </button>
            <Link href="/favoritos" className={styles.iconBtn} aria-label={`Favoritos, ${w} guardados`} title="Favoritos">
              <IconStar />
              {w > 0 && <span className={styles.badgeCount}>{w}</span>}
            </Link>
            <Link href="/cuenta" className={`${styles.iconBtn} ${styles.desktopOnly}`} aria-label="Cuenta" title="Cuenta">
              <IconUser />
            </Link>
            <button type="button" className={`${styles.iconBtn} ${styles.bagBtn}`} onClick={openCart} aria-label={`Cesta, ${n} artículos`} title="Cesta">
              <IconBag />
              <span className={styles.bagCount}>{n}</span>
            </button>
          </div>
        </div>

        {MENUS.map((m) => (
          <MegaMenu
            key={m.id}
            id={`menu-${m.id}`}
            variant={m.id}
            open={menu === m.id}
            onEnter={() => openMenu(m.id)}
            onClose={() => {
              setMenu(null);
              triggers.current[m.id]?.focus();
            }}
          />
        ))}
      </header>
      <div className={styles.veil} data-open={menu ? true : undefined} aria-hidden="true" onMouseEnter={closeMenu} onClick={() => setMenu(null)} />

      <MobileMenu open={mobile} onClose={() => setMobile(false)} onSearch={() => { setMobile(false); setSearch(true); }} />
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
