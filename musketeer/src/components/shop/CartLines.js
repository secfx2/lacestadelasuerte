"use client";
import Link from "next/link";
import SmartImage from "./SmartImage";
import { useCart } from "./CartProvider";
import { IconMinus, IconPlus } from "./Icons";
import { FREE_SHIPPING_FROM, formatPrice, productHref } from "@/lib/shop";
import styles from "./CartLines.module.css";

export function FreeShippingBar({ subtotal, className = "" }) {
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);
  const remaining = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  return (
    <div className={`${styles.ship} ${className}`}>
      <p className={styles.shipText} aria-live="polite">
        {remaining > 0 ? (
          <>Te faltan <strong>{formatPrice(remaining)}</strong> para el envío gratuito</>
        ) : (
          <>Tu pedido tiene <strong>envío gratuito</strong></>
        )}
      </p>
      <div className={styles.track} role="progressbar" aria-label="Progreso hacia el envío gratuito" aria-valuemin={0} aria-valuemax={FREE_SHIPPING_FROM} aria-valuenow={Math.min(subtotal, FREE_SHIPPING_FROM)}>
        <span className={styles.fill} style={{ transform: `scaleX(${pct / 100})` }} />
      </div>
    </div>
  );
}

export function QtyStepper({ value, onChange, max = 10, label, size = "md" }) {
  return (
    <div className={styles.qty} data-size={size} role="group" aria-label={`Cantidad${label ? ` de ${label}` : ""}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label="Restar una unidad">
        <IconMinus size={10} />
      </button>
      <span aria-live="polite" aria-atomic="true">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Añadir una unidad">
        <IconPlus size={10} />
      </button>
    </div>
  );
}

export default function CartLines({ onNavigate, variant = "drawer" }) {
  const { lines, setQty, remove, maxQty, lastAdded } = useCart();
  return (
    <ul className={styles.list} data-variant={variant}>
      {lines.map((l) => (
        <li key={l.key} className={styles.line} data-fresh={lastAdded?.key === l.key && Date.now() - lastAdded.at < 1500 ? "true" : undefined}>
          <Link href={productHref(l.product, l.color)} onClick={onNavigate} className={styles.thumb} tabIndex={-1} aria-hidden="true">
            <SmartImage src={l.image} alt="" sizes="120px" className={styles.thumbImg} />
          </Link>
          <div className={styles.meta}>
            <div className={styles.row}>
              <Link href={productHref(l.product, l.color)} onClick={onNavigate} className={styles.name}>
                {l.product.name}
              </Link>
              <span className={styles.total}>{formatPrice(l.total)}</span>
            </div>
            <p className={styles.variant}>
              {l.colorObj.name} <span aria-hidden="true">·</span> Talla {l.size}
              {l.qty > 1 && <span className={styles.unit}> · {formatPrice(l.unit)} / ud.</span>}
            </p>
            <div className={styles.actions}>
              <QtyStepper value={l.qty} max={maxQty} label={l.product.name} onChange={(q) => setQty(l.key, q)} size="sm" />
              <button type="button" className={styles.remove} onClick={() => remove(l.key)} aria-label={`Eliminar ${l.product.name}, talla ${l.size}`}>
                Eliminar
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
