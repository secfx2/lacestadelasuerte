"use client";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { useCatalog, useWishlist } from "./CartProvider";
import styles from "./Favorites.module.css";

export default function Favorites() {
  const catalog = useCatalog();
  const wish = useWishlist();
  if (!wish.ready) return <div style={{ minHeight: "40vh" }} aria-busy="true" />;
  const items = wish.slugs.map((s) => catalog.find((p) => p.slug === s)).filter(Boolean);

  if (!items.length) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Aún no has guardado nada.</p>
        <p className={styles.emptyText}>Pulsa la estrella de cualquier pieza para guardarla aquí. Se conserva en este dispositivo.</p>
        <Link href="/tienda" className="mk-btn">Ver catálogo</Link>
      </div>
    );
  }
  return (
    <>
      <p className={styles.count}>
        {items.length} {items.length === 1 ? "pieza guardada" : "piezas guardadas"}
      </p>
      <div className={styles.grid}>
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </>
  );
}
