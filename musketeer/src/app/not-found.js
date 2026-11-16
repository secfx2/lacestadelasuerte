import Link from "next/link";
import ShopShell from "@/components/shop/ShopShell";
import styles from "./not-found.module.css";

export const metadata = {
  title: "Página no encontrada",
  robots: { index: false },
};

/** Global 404 — rendered with the shop chrome (the root layout itself stays chrome-free). */
export default function NotFound() {
  return (
    <ShopShell>
      <section className={styles.wrap}>
        <p className={styles.eyebrow}>Error 404</p>
        <h1 className={styles.code}>Perdido</h1>
        <p className={styles.lead}>Esta página se ha perdido por el camino. Ni el mejor mosquetero la encontraría.</p>
        <div className={styles.actions}>
          <Link href="/tienda" className="mk-btn">Ver catálogo</Link>
          <Link href="/" className="mk-btn mk-btn--ghost">Volver al inicio</Link>
        </div>
        <p className={styles.motto}>Tous pour un</p>
      </section>
    </ShopShell>
  );
}
