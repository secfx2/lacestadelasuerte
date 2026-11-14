"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import SmartImage from "./SmartImage";
import { useCart, useWishlist } from "./CartProvider";
import { IconClose, IconPlus, IconStar } from "./Icons";
import { formatPrice, getColor, productHref, isOneSize } from "@/lib/shop";
import styles from "./ProductCard.module.css";

/**
 * Grid tile (grey #f2f2f2, photo multiplied onto it): flat lay crossfades to the
 * on-model shot on hover. Colour dots switch the colourway; "+" opens a quick size picker.
 */
export default function ProductCard({ product, sizes = "(min-width: 1024px) 25vw, 50vw", priority = false, quickAdd = true, className = "" }) {
  const { add } = useCart();
  const wish = useWishlist();
  const [colorSlug, setColorSlug] = useState(product.colors[0].slug);
  const [picking, setPicking] = useState(false);
  const pickerRef = useRef(null);
  const color = getColor(product, colorSlug);
  const href = productHref(product, color.slug);
  const [flat, hover] = color.images;
  const oneSize = isOneSize(product);
  const saved = wish.has(product.slug);

  function quick() {
    if (oneSize) {
      add({ slug: product.slug, color: color.slug, size: product.sizes[0] });
      return;
    }
    setPicking(true);
    setTimeout(() => pickerRef.current?.querySelector("button[data-size]")?.focus({ preventScroll: true }), 30);
  }

  return (
    <article className={`${styles.card} ${className}`} onMouseLeave={() => setPicking(false)}>
      <div className={styles.media}>
        <Link href={href} className={styles.mediaLink} tabIndex={-1} aria-hidden="true">
          <SmartImage src={flat} alt={`${product.name} — ${color.name}`} sizes={sizes} priority={priority} className={styles.frame} blend />
          {hover && <SmartImage src={hover} alt="" sizes={sizes} hideOnError className={styles.hover} blend />}
        </Link>

        {product.badge && <span className={styles.badge}>{product.badge}</span>}

        <button
          type="button"
          className={styles.star}
          data-on={saved || undefined}
          onClick={() => wish.toggle(product.slug)}
          aria-pressed={saved}
          aria-label={saved ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`}
        >
          <IconStar size={15} filled={saved} />
        </button>

        {quickAdd && (
          <>
            <button
              type="button"
              className={styles.plus}
              onClick={quick}
              aria-label={oneSize ? `Añadir ${product.name} a la cesta` : `Añadir rápido: ${product.name}`}
              aria-expanded={oneSize ? undefined : picking}
              hidden={picking}
            >
              <IconPlus />
            </button>
            {picking && (
              <div
                ref={pickerRef}
                className={styles.picker}
                role="group"
                aria-label={`Elige talla de ${product.name}`}
                onKeyDown={(e) => e.key === "Escape" && setPicking(false)}
              >
                <div className={styles.pickerHead}>
                  <span>Selecciona talla</span>
                  <button type="button" onClick={() => setPicking(false)} aria-label="Cerrar selector de talla" className={styles.pickerClose}>
                    <IconClose size={10} />
                  </button>
                </div>
                <div className={styles.sizes}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      data-size={s}
                      className={styles.size}
                      onClick={() => {
                        add({ slug: product.slug, color: color.slug, size: s });
                        setPicking(false);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link href={href}>{product.name}</Link>
        </h3>
        <p className={styles.price}>{formatPrice(product.price)}</p>
        {product.colors.length > 1 && (
          <div className={styles.dots}>
            {product.colors.map((c) => (
              <button
                key={c.slug}
                type="button"
                className={styles.dot}
                style={{ "--sw": c.hex }}
                aria-label={`Color ${c.name}`}
                aria-pressed={c.slug === color.slug}
                title={c.name}
                onMouseEnter={() => setColorSlug(c.slug)}
                onFocus={() => setColorSlug(c.slug)}
                onClick={() => setColorSlug(c.slug)}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
