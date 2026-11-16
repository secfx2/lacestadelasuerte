"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStudio } from "./Studio";
import { BRANDS, BRAND_IDS } from "@/config/brands";
import { fmt } from "@/lib/client";
import styles from "./AppShell.module.css";

export const NAV = [
  { href: "/nombres", label: "Nombres de marca", n: "01" },
  { href: "/logos", label: "Logos", n: "02" },
  { href: "/ideas", label: "Ideas de ropa", n: "03" },
  { href: "/prenda", label: "Prenda concreta", n: "04" },
  { href: "/vista", label: "Vista en la web", n: "05" },
  { href: "/galeria", label: "Galería", n: "06" },
  { href: "/propuestas", label: "Propuestas", n: "07" },
  { href: "/guia", label: "Guía", n: "08" },
];
const NAV2 = [
  { href: "/uso", label: "Uso y límite" },
  { href: "/ajustes", label: "Ajustes" },
];

function Meter({ compact = false }) {
  const { usage } = useStudio();
  if (!usage) return <span className={styles.meter} data-compact={compact || undefined}><span className="muted">Hoy: —</span></span>;
  const pct = Math.min(100, (usage.credits / usage.limit) * 100);
  return (
    <Link href="/uso" className={styles.meter} data-compact={compact || undefined} data-high={pct > 85 || undefined} title="Créditos usados hoy">
      <span className={styles.meterText}>
        {compact ? "" : "Hoy: "}
        <strong>{fmt(usage.credits)}</strong> / {fmt(usage.limit)}
        {compact ? "" : " créditos"}
      </span>
      <span className={styles.meterBar} aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </span>
    </Link>
  );
}

function BrandBar() {
  const { brand, setBrand } = useStudio();
  const b = BRANDS[brand];
  return (
    <div className={styles.brandbar}>
      <div className={styles.brandRow} role="radiogroup" aria-label="Marca">
        <span className={styles.brandLabel}>Marca</span>
        {BRAND_IDS.map((id) => (
          <button key={id} type="button" role="radio" aria-checked={brand === id} className={styles.brandChip} onClick={() => setBrand(id)} data-new={id === "nueva" || undefined}>
            {id === "nueva" ? "Marca nueva" : BRANDS[id].name}
          </button>
        ))}
      </div>
      <p className={styles.brandHint}>{b.es}</p>
    </div>
  );
}

async function logout() {
  await fetch("/api/logout", { method: "POST" }).catch(() => {});
  window.location.href = "/login";
}

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);
  const isOn = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  const nav = (
    <>
      <ul className={styles.nav}>
        {NAV.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className={styles.navLink} aria-current={isOn(i.href) ? "page" : undefined}>
              <span className={styles.navN}>{i.n}</span>
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className={styles.nav2}>
        {NAV2.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className={styles.navLink2} aria-current={isOn(i.href) ? "page" : undefined}>
              {i.label}
            </Link>
          </li>
        ))}
        <li>
          <button type="button" className={styles.navLink2} onClick={logout}>
            Salir
          </button>
        </li>
      </ul>
    </>
  );

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <Link href="/" className={styles.logo}>
          Estudio
        </Link>
        <p className={styles.sub}>Taller de marcas</p>
        <Meter />
        <nav aria-label="Herramientas">{nav}</nav>
      </aside>

      <header className={styles.top}>
        <Link href="/" className={styles.logoSm}>
          Estudio
        </Link>
        <Meter compact />
        <button type="button" className={styles.menuBtn} aria-expanded={open} aria-controls="menu" onClick={() => setOpen((v) => !v)}>
          <span className={styles.burger} data-open={open || undefined} aria-hidden="true" />
          <span className="sr-only">Menú</span>
        </button>
      </header>
      <div id="menu" className={styles.sheet} data-open={open || undefined} hidden={!open}>
        <nav aria-label="Herramientas">{nav}</nav>
      </div>

      <main className={styles.main}>
        <BrandBar />
        {children}
      </main>
    </div>
  );
}
