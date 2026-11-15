import Link from "next/link";
import ShopShell from "@/components/shop/ShopShell";
import brand from "@/config/brand";
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
        <h1 className={styles.code}>{brand.notFound.title}</h1>
        <p className={styles.lead}>{brand.notFound.lead}</p>
        <div className={styles.actions}>
          <Link href="/tienda" className="mk-btn">Ver catálogo</Link>
          <Link href="/" className="mk-btn mk-btn--ghost">Volver al inicio</Link>
        </div>
        <p className={styles.motto}>{brand.tagline}</p>
      </section>
    </ShopShell>
  );
}
