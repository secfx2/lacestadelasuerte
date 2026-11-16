"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { useCatalog } from "./CartProvider";
import styles from "./ChipGrid.module.css";

/**
 * Home section: title, pill chips that filter in place, edge-to-edge gapless grid, "Ver todo".
 * `sets`: [{ id, label, slugs, href }] — the first set is the default ("Ver todo").
 */
export default function ChipGrid({ id, title, kicker, sets, cols = 5 }) {
  const catalog = useCatalog();
  const bySlug = useMemo(() => new Map(catalog.map((p) => [p.slug, p])), [catalog]);
  const [active, setActive] = useState(sets[0].id);
  const set = sets.find((s) => s.id === active) || sets[0];
  const items = set.slugs.map((s) => bySlug.get(s)).filter(Boolean);

  return (
    <section className={styles.section} aria-labelledby={id}>
      <div className={styles.head}>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {kicker && <p className={styles.kicker}>{kicker}</p>}
      </div>
      <div className={styles.chips} role="group" aria-label={`Filtrar ${title} por categoría`}>
        {sets.map((s) => (
          <button key={s.id} type="button" className={styles.chip} aria-pressed={s.id === active} onClick={() => setActive(s.id)}>
            {s.label}
          </button>
        ))}
      </div>
      <div key={set.id} className={styles.grid} style={{ "--cols": cols }} aria-live="polite">
        {items.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={false} sizes={`(min-width: 1024px) ${Math.round(100 / cols)}vw, 50vw`} />
        ))}
      </div>
      <div className={styles.more}>
        <Link href={set.href || "/tienda"} className="mk-btn mk-btn--ghost">
          {set.id === sets[0].id ? "Ver todo" : `Ver ${set.label.toLowerCase()}`}
        </Link>
      </div>
    </section>
  );
}
