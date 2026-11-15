"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import SmartImage from "./SmartImage";
import Lightbox from "./Lightbox";
import Modal from "./Modal";
import SizeTables from "./SizeTables";
import Accordion, { AccordionItem } from "./Accordion";
import { useCart, useWishlist } from "./CartProvider";
import { IconStar, IconZoom } from "./Icons";
import { SHIPPING_METHODS, careText, categoryName, fitNote, formatPrice, getColor, isOneSize } from "@/lib/shop";
import { guidesFor } from "@/lib/sizeGuides";
import styles from "./ProductDetail.module.css";
import brand from "@/config/brand";

const VIEW_LABELS = ["Vista plana", "Con modelo", "Otra vista", "Detalle"];

/** "Envío estándar en 2–4 días laborables (4,95 €, gratuito desde 150 €). Express en 24–48 h por 9,95 €." — from brand.shipping. */
function shippingSummary() {
  return SHIPPING_METHODS.map((m, i) => {
    const free = m.freeFrom != null ? `, gratuito desde ${formatPrice(m.freeFrom)}` : "";
    return i === 0 ? `Envío ${m.name.toLowerCase()} en ${m.eta} (${formatPrice(m.price)}${free}).` : `${m.name} en ${m.eta} por ${formatPrice(m.price)}${free}.`;
  }).join(" ");
}

export default function ProductDetail({ product }) {
  const { add } = useCart();
  const wish = useWishlist();
  const [colorSlug, setColorSlug] = useState(product.colors[0].slug);
  const [size, setSize] = useState(isOneSize(product) ? product.sizes[0] : null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [guide, setGuide] = useState(false);
  const [slide, setSlide] = useState(0);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef(null);
  const sizesRef = useRef(null);
  const carouselRef = useRef(null);
  const color = getColor(product, colorSlug);
  const images = color.images;
  const guides = guidesFor(product);
  const saved = wish.has(product.slug);

  // Colour from ?color= on first load
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("color");
    if (c && product.colors.some((x) => x.slug === c)) setColorSlug(c);
  }, [product]);

  const pickColor = (slug) => {
    setColorSlug(slug);
    setSlide(0);
    carouselRef.current?.scrollTo({ left: 0 });
    const url = new URL(window.location.href);
    if (slug === product.colors[0].slug) url.searchParams.delete("color");
    else url.searchParams.set("color", slug);
    window.history.replaceState(window.history.state, "", url);
  };

  // Mobile sticky bar: visible once the main CTA has scrolled above the viewport
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const el = ctaRef.current;
      if (el) setShowBar(el.getBoundingClientRect().bottom < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const onCarouselScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setSlide(Math.round(el.scrollLeft / el.clientWidth));
  }, []);

  function addToCart() {
    if (!size) {
      setError(true);
      sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      sizesRef.current?.querySelector("button")?.focus({ preventScroll: true });
      return;
    }
    add({ slug: product.slug, color: color.slug, size });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const ctaLabel = added ? "Añadido a la cesta" : `Añadir a la cesta — ${formatPrice(product.price)}`;

  return (
    <>
      <div className={styles.pdp}>
        {/* Gallery — desktop grid */}
        <div className={styles.gallery} data-count={images.length}>
          {images.map((src, i) => (
            <button key={src} type="button" className={styles.shot} onClick={() => setLightbox(i)} aria-label={`Ampliar imagen ${i + 1}: ${VIEW_LABELS[i] || ""}`}>
              <SmartImage
                src={src}
                alt={`${product.name}, ${color.name} — ${VIEW_LABELS[i] || `imagen ${i + 1}`}`}
                sizes="(min-width: 1024px) 31vw, 100vw"
                priority={i < 2}
                className={styles.shotImg}
                fallback={null}
                blend
              />
              <span className={styles.zoomIcon} aria-hidden="true">
                <IconZoom />
              </span>
            </button>
          ))}
        </div>

        {/* Gallery — mobile carousel */}
        <div className={styles.carouselWrap}>
          <div ref={carouselRef} className={styles.carousel} onScroll={onCarouselScroll} aria-label="Imágenes del producto" role="region" tabIndex={0}>
            {images.map((src, i) => (
              <button key={src} type="button" className={styles.slide} onClick={() => setLightbox(i)} aria-label={`Ampliar imagen ${i + 1}`}>
                <SmartImage src={src} alt={`${product.name}, ${color.name} — ${VIEW_LABELS[i] || ""}`} sizes="100vw" priority={i === 0} className={styles.shotImg} fallback={null} blend />
              </button>
            ))}
          </div>
          {images.length > 1 && (
            <>
              <span className={styles.counter} aria-live="polite">
                {slide + 1} / {images.length}
              </span>
              <div className={styles.dots} aria-hidden="true">
                {images.map((src, i) => (
                  <span key={src} data-on={i === slide || undefined} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Info panel */}
        <aside className={styles.panel}>
          <div className={styles.sticky}>
            <nav aria-label="Ruta de navegación" className={styles.crumbs}>
              <Link href="/tienda" className="mk-link">Tienda</Link>
              <span aria-hidden="true">/</span>
              <Link href={`/categoria/${product.category}`} className="mk-link">{categoryName(product.category)}</Link>
            </nav>
            {product.badge && <p className={styles.badge} data-badge={product.badge}>{product.badge}</p>}
            <h1 className={styles.name}>{product.name}</h1>
            <p className={styles.price}>{formatPrice(product.price)}</p>
            <p className={styles.tax}>IVA incluido{product.unisex ? " · Unisex" : ""}</p>

            {/* Colour */}
            <div className={styles.block}>
              <p className={styles.label}>
                Color <span>{color.name}</span>
              </p>
              <div className={styles.swatches} role="radiogroup" aria-label="Color">
                {product.colors.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    role="radio"
                    aria-checked={c.slug === color.slug}
                    className={styles.swatch}
                    onClick={() => pickColor(c.slug)}
                    title={c.name}
                    aria-label={c.name}
                  >
                    <SmartImage src={c.images[0]} alt="" sizes="64px" className={styles.swatchImg} blend />
                    <span className={styles.swatchHex} style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className={styles.block}>
              <div className={styles.labelRow}>
                <p className={styles.label} id="size-label">
                  Talla {size && <span>{size}</span>}
                </p>
                {guides.length > 0 && (
                  <button type="button" className={`${styles.guideBtn} mk-link mk-link--on`} onClick={() => setGuide(true)}>
                    Guía de tallas
                  </button>
                )}
              </div>
              <div
                ref={sizesRef}
                className={styles.sizes}
                role="radiogroup"
                aria-labelledby="size-label"
                aria-describedby={error ? "size-error" : undefined}
                data-error={error || undefined}
                data-one={product.sizes.length === 1 || undefined}
              >
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    className={styles.size}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && (
                <p id="size-error" className={styles.error} role="alert">
                  Selecciona una talla para continuar.
                </p>
              )}
              <p className={styles.fit}>{fitNote(product)}</p>
            </div>

            <div className={styles.actions} ref={ctaRef}>
              <button type="button" className={`mk-btn mk-btn--block ${styles.cta}`} data-added={added || undefined} onClick={addToCart}>
                {ctaLabel}
              </button>
              <button
                type="button"
                className={styles.wish}
                aria-pressed={saved}
                onClick={() => wish.toggle(product.slug)}
                aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
                title={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
              >
                <IconStar filled={saved} />
              </button>
            </div>

            <ul className={styles.perks}>
              {brand.product.perks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            <Accordion className={styles.accordion}>
              <AccordionItem title="Descripción" defaultOpen>
                <p>{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Detalles y composición">
                <ul>
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p style={{ marginTop: 12 }}>
                  <strong>Composición:</strong> {product.composition}
                  <br />
                  <strong>Corte:</strong> {product.fit}
                  <br />
                  <strong>Referencia:</strong> {brand.skuPrefix}-{String(product.index + 1).padStart(3, "0")}-{color.slug.toUpperCase().replace(/-/g, "")}
                </p>
              </AccordionItem>
              <AccordionItem title="Envíos y devoluciones">
                <p>{shippingSummary()} {brand.shipping.zones}</p>
                <p>Tienes {brand.shipping.returnDays} días desde la entrega para devolver cualquier pieza sin usar y con sus etiquetas. La devolución es gratuita.</p>
                <p>
                  <Link href="/ayuda#envios" className="mk-link mk-link--on">Más información</Link>
                </p>
              </AccordionItem>
              <AccordionItem title="Cuidado">
                <ul>
                  {careText(product).map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
      </div>

      {/* Mobile sticky add-to-cart */}
      <div className={styles.bar} data-show={showBar || undefined} aria-hidden={!showBar}>
        <div className={styles.barInfo}>
          <span className={styles.barName}>{product.name}</span>
          <span className={styles.barMeta}>
            {formatPrice(product.price)} · {color.name}
            {size ? ` · ${size}` : ""}
          </span>
        </div>
        <button type="button" className="mk-btn mk-btn--sm" onClick={addToCart} tabIndex={showBar ? 0 : -1}>
          {added ? "Añadido" : size ? "Añadir" : "Elegir talla"}
        </button>
      </div>

      <Lightbox images={images} index={lightbox ?? 0} onIndex={setLightbox} open={lightbox !== null} onClose={() => setLightbox(null)} label={product.name} />

      <Modal open={guide} onClose={() => setGuide(false)} title="Guía de tallas" eyebrow={product.name} size="lg">
        <p className={styles.guideFit}>{fitNote(product)}</p>
        <SizeTables ids={guides} highlight={size} />
      </Modal>
    </>
  );
}
