"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import CartLines, { FreeShippingBar } from "./CartLines";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconClose, IconArrow } from "./Icons";
import { CATEGORIES, formatPrice } from "@/lib/shop";
import styles from "./CartDrawer.module.css";

export default function CartDrawer() {
  const { isOpen, closeCart, lines, count, subtotal } = useCart();
  const pathname = usePathname();
  const ref = useRef(null);
  const { mounted, visible } = usePresence(isOpen, 500);
  useLockBody(isOpen);
  useDialog(ref, isOpen, closeCart);

  useEffect(() => {
    closeCart();
  }, [pathname, closeCart]);

  if (!mounted) return null;

  return (
    <div className={styles.root} data-visible={visible || undefined}>
      <div className={styles.backdrop} onClick={closeCart} aria-hidden="true" />
      <aside ref={ref} className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="cart-title">
        <header className={styles.head}>
          <h2 id="cart-title" className={styles.title}>
            Cesta <span>({count})</span>
          </h2>
          <button type="button" className={styles.close} onClick={closeCart} aria-label="Cerrar cesta">
            <IconClose size={16} />
          </button>
        </header>

        {lines.length > 0 ? (
          <>
            <FreeShippingBar subtotal={subtotal} className={styles.ship} />
            <div className={styles.scroll}>
              <CartLines onNavigate={closeCart} />
            </div>
            <footer className={styles.foot}>
              <div className={styles.subtotal}>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p className={styles.note}>Impuestos incluidos. El envío y los códigos de descuento se aplican en el checkout.</p>
              <Link href="/checkout" className="mk-btn mk-btn--block" onClick={closeCart}>
                Finalizar compra
              </Link>
              <div className={styles.secondary}>
                <button type="button" className="mk-link mk-link--on" onClick={closeCart}>
                  Seguir comprando
                </button>
                <Link href="/cesta" className="mk-link" onClick={closeCart}>
                  Ver cesta
                </Link>
              </div>
              <p className={styles.pay}>Tarjeta · Apple Pay · PayPal · Bizum</p>
            </footer>
          </>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Tu cesta está vacía.</p>
            <p className={styles.emptyText}>
              <em>Tous pour un</em> — empieza por lo esencial.
            </p>
            <ul className={styles.emptyCats}>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categoria/${c.slug}`} onClick={closeCart}>
                    <span>{c.name}</span>
                    <IconArrow size={12} />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/tienda" className="mk-btn mk-btn--block" onClick={closeCart}>
              Ver catálogo
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
