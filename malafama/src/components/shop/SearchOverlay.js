"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import SmartImage from "./SmartImage";
import { useCatalog } from "./CartProvider";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconClose, IconSearch, IconArrow } from "./Icons";
import { CATEGORIES, POPULAR_SEARCHES, categoryName, formatPrice, productHref, searchProducts } from "@/lib/shop";
import styles from "./SearchOverlay.module.css";
import brand from "@/config/brand";

export default function SearchOverlay({ open, onClose }) {
  const catalog = useCatalog();
  const router = useRouter();
  const ref = useRef(null);
  const inputRef = useRef(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const { mounted, visible } = usePresence(open, 450);
  useLockBody(open);
  useDialog(ref, open, onClose, inputRef);

  const all = useMemo(() => searchProducts(catalog, q, 100), [catalog, q]);
  const results = all.slice(0, 8);
  useEffect(() => setActive(-1), [q]);

  const seeAll = q.trim() ? `/tienda?q=${encodeURIComponent(q.trim())}` : "/tienda";

  function go(href) {
    router.push(href);
    onClose();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) go(productHref(results[active]));
      else if (q.trim()) go(seeAll);
    }
  }

  if (!mounted) return null;
  const hasQuery = q.trim().length > 0;

  return (
    <div className={styles.root} data-visible={visible || undefined}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div ref={ref} className={styles.panel} role="dialog" aria-modal="true" aria-label="Buscar en la tienda">
        <div className={styles.bar}>
          <IconSearch size={20} className={styles.barIcon} />
          <input
            ref={inputRef}
            className={styles.input}
            type="search"
            placeholder="Buscar"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-label="Buscar productos"
            aria-autocomplete="list"
            aria-expanded={hasQuery && results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={active >= 0 && results[active] ? `sr-${results[active].slug}` : undefined}
            autoComplete="off"
            spellCheck="false"
            enterKeyHint="search"
          />
          {hasQuery && (
            <button type="button" className={styles.clear} onClick={() => { setQ(""); inputRef.current?.focus(); }}>
              Borrar
            </button>
          )}
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar búsqueda">
            <IconClose size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {!hasQuery && (
            <div className={styles.suggest}>
              <div>
                <p className={styles.heading}>Búsquedas frecuentes</p>
                <ul className={styles.chips}>
                  {POPULAR_SEARCHES.map((s) => (
                    <li key={s}>
                      <button type="button" className={styles.chip} onClick={() => { setQ(s); inputRef.current?.focus(); }}>
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={styles.heading}>Categorías</p>
                <ul className={styles.catList}>
                  {CATEGORIES.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/categoria/${c.slug}`} onClick={onClose} className="mk-link">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {hasQuery && results.length > 0 && (
            <>
              <div className={styles.resultsHead} aria-live="polite">
                <span>
                  {all.length} {all.length === 1 ? "resultado" : "resultados"} para <em>“{q.trim()}”</em>
                </span>
                <Link href={seeAll} onClick={onClose} className={`${styles.seeAll} mk-link mk-link--on`}>
                  Ver todos <IconArrow size={12} />
                </Link>
              </div>
              <ul id="search-results" role="listbox" aria-label="Resultados" className={styles.results}>
                {results.map((p, i) => (
                  <li
                    key={p.slug}
                    id={`sr-${p.slug}`}
                    role="option"
                    aria-selected={i === active}
                    className={styles.result}
                    data-active={i === active || undefined}
                    onMouseEnter={() => setActive(i)}
                  >
                    <Link href={productHref(p)} onClick={onClose} tabIndex={-1} className={styles.resultLink}>
                      <SmartImage src={p.colors[0].images[0]} alt="" sizes="(min-width: 1024px) 12vw, 25vw" className={styles.resultImg} blend />
                      <span className={styles.resultName}>{p.name}</span>
                      <span className={styles.resultMeta}>
                        {categoryName(p.category)} · {formatPrice(p.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {hasQuery && results.length === 0 && (
            <div className={styles.empty} aria-live="polite">
              <p>
                Sin resultados para <em>“{q.trim()}”</em>.
              </p>
              <p className={styles.emptyHint}>{brand.search.emptyHint}</p>
              <Link href="/tienda" onClick={onClose} className="mk-btn mk-btn--ghost mk-btn--sm">
                Ver catálogo
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
