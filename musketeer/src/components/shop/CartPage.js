"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import CartLines, { FreeShippingBar } from "./CartLines";
import { CATEGORIES, FREE_SHIPPING_FROM, SHIPPING_METHODS, formatPrice } from "@/lib/shop";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const { ready, lines, count, subtotal, freeShipping } = useCart();
  const std = SHIPPING_METHODS[0];

  if (!ready) return <div className={styles.loading} aria-busy="true" />;

  if (!lines.length) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Tu cesta está vacía.</p>
        <p className={styles.emptyText}>
          <em>Tous pour un</em> — el catálogo completo está siempre disponible.
        </p>
        <div className={styles.emptyCats}>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/categoria/${c.slug}`} className={styles.emptyChip}>
              {c.name}
            </Link>
          ))}
        </div>
        <Link href="/tienda" className="mk-btn">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <section className={styles.lines} aria-label="Artículos en la cesta">
        <div className={styles.linesHead}>
          <span>
            {count} {count === 1 ? "artículo" : "artículos"}
          </span>
          <Link href="/tienda" className="mk-link mk-link--on">
            Seguir comprando
          </Link>
        </div>
        <CartLines variant="page" />
      </section>

      <aside className={styles.summary} aria-label="Resumen">
        <div className={styles.summaryInner}>
          <h2 className={styles.summaryTitle}>Resumen</h2>
          <FreeShippingBar subtotal={subtotal} className={styles.ship} />
          <dl className={styles.totals}>
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div>
              <dt>Envío estándar</dt>
              <dd>{freeShipping ? "Gratis" : formatPrice(std.price)}</dd>
            </div>
            <div className={styles.total}>
              <dt>Total estimado</dt>
              <dd>{formatPrice(subtotal + (freeShipping ? 0 : std.price))}</dd>
            </div>
          </dl>
          <p className={styles.note}>IVA incluido. Los códigos de descuento se aplican en el checkout. Envío gratuito desde {formatPrice(FREE_SHIPPING_FROM)}.</p>
          <Link href="/checkout" className="mk-btn mk-btn--block">
            Finalizar compra
          </Link>
          <ul className={styles.perks}>
            <li>Devoluciones gratuitas en 30 días</li>
            <li>Pago seguro: tarjeta, Apple Pay, PayPal y Bizum</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
