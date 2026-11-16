"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import styles from "./home.module.css";

const TOOLS = [
  { href: "/nombres", n: "01", t: "Nombres de marca", d: "Cuenta la idea y salen nombres con lema, @ y dominio.", cost: "Texto" },
  { href: "/logos", n: "02", t: "Logos", d: "Wordmark, monograma o emblema, plano sobre blanco.", cost: "≈0,5 créditos" },
  { href: "/ideas", n: "03", t: "Ideas de ropa", d: "Un tema → fichas de prendas → fotos de producto.", cost: "≈1 crédito / foto" },
  { href: "/prenda", n: "04", t: "Prenda concreta", d: "Describe una pieza: flat lay y foto con modelo.", cost: "≈1 crédito / foto" },
  { href: "/vista", n: "05", t: "Vista en la web", d: "Cómo quedaría en la ficha y en la tienda de la marca.", cost: "Gratis" },
  { href: "/galeria", n: "06", t: "Galería", d: "Todo lo generado: favoritos, notas, descargas.", cost: "" },
  { href: "/propuestas", n: "07", t: "Propuestas", d: "Lo que propones para el catálogo, listo para exportar.", cost: "" },
  { href: "/guia", n: "08", t: "Guía", d: "Cómo pedir buenas imágenes y cómo funcionan los créditos.", cost: "" },
];

export default function Home() {
  const [prov, setProv] = useState(null);
  useEffect(() => {
    api("/api/higgsfield/status").then(setProv).catch(() => {});
  }, []);
  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">Taller de marcas</p>
        <h1 className="h1">Estudio</h1>
        <p className="lede">Elige la marca arriba y una herramienta. Todo lo que generes se guarda en la Galería.</p>
      </header>
      {prov && !prov.active && (
        <p className="notice notice--warn" style={{ marginBottom: 24 }}>
          Las imágenes todavía no están activadas: el propietario tiene que conectar su cuenta de Higgsfield en <Link href="/ajustes" style={{ textDecoration: "underline" }}>Ajustes</Link>. Los nombres de marca ya funcionan.
        </p>
      )}
      <ul className={styles.grid}>
        {TOOLS.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className={styles.card}>
              <span className={styles.n}>{t.n}</span>
              <span className={styles.t}>{t.t}</span>
              <span className={styles.d}>{t.d}</span>
              {t.cost && <span className={styles.cost}>{t.cost}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
