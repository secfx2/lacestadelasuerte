"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { useCatalog } from "./CartProvider";
import { useDialog, useLockBody, usePresence } from "./hooks";
import { IconClose, IconGrid } from "./Icons";
import {
  CATEGORIES,
  COLOR_FAMILIES,
  SIZE_GROUPS,
  SORTS,
  productFamilies,
  searchProducts,
  sizeFromParam,
  sizeToParam,
  sortProducts,
} from "@/lib/shop";
import styles from "./ShopCatalog.module.css";

const DENSITY_KEY = "musketeer.density";

function parseQuery(sp) {
  const sort = sp.get("orden");
  return {
    colors: (sp.get("color") || "").split(",").filter((c) => COLOR_FAMILIES.some((f) => f.slug === c)),
    sizes: (sp.get("talla") || "").split(",").map(sizeFromParam).filter(Boolean),
    sort: SORTS.some((s) => s.id === sort) ? sort : "destacados",
    q: (sp.get("q") || "").trim(),
  };
}
const EMPTY = new URLSearchParams();

/** Grid page for /tienda and /categoria/[slug]. Filters live in the URL (?color=&talla=&orden=&q=). */
export default function ShopCatalog(props) {
  return (
    <Suspense fallback={<CatalogView {...props} params={EMPTY} />}>
      <WithParams {...props} />
    </Suspense>
  );
}

function WithParams(props) {
  const params = useSearchParams();
  return <CatalogView {...props} params={params} />;
}

function CatalogView({ category = null, params }) {
  const catalog = useCatalog();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const chipsRef = useRef(null);

  // Bring the active category chip into view on narrow screens
  useEffect(() => {
    const ul = chipsRef.current;
    const el = ul?.querySelector('[aria-current="page"]');
    if (ul && el && ul.scrollWidth > ul.clientWidth) ul.scrollLeft = Math.max(0, el.parentElement.offsetLeft - 16);
  }, [category]);
  const [density, setDensity] = useState("compact");

  useEffect(() => {
    try {
      const d = window.localStorage.getItem(DENSITY_KEY);
      if (d === "large" || d === "compact") setDensity(d);
    } catch {}
  }, []);
  const changeDensity = (d) => {
    setDensity(d);
    try {
      window.localStorage.setItem(DENSITY_KEY, d);
    } catch {}
  };

  // ---- URL state. A local mirror of the query string keeps rapid consecutive
  // updates consistent (router.replace is async); external navigations are adopted.
  const paramsStr = params.toString();
  const [qs, setQs] = useState(paramsStr);
  const qsRef = useRef(paramsStr);
  const pushed = useRef(new Set());
  useEffect(() => {
    if (pushed.current.has(paramsStr)) {
      pushed.current.delete(paramsStr);
      return;
    }
    qsRef.current = paramsStr;
    setQs(paramsStr);
  }, [paramsStr]);

  const current = useMemo(() => parseQuery(new URLSearchParams(qs)), [qs]);
  const { colors, sizes, sort, q } = current;

  const update = useCallback(
    (patchOrFn) => {
      const cur = new URLSearchParams(qsRef.current);
      const patch = typeof patchOrFn === "function" ? patchOrFn(parseQuery(cur)) : patchOrFn;
      for (const [k, v] of Object.entries(patch)) {
        if (!v || (Array.isArray(v) && !v.length)) cur.delete(k);
        else cur.set(k, Array.isArray(v) ? v.join(",") : v);
      }
      const next = cur.toString();
      if (next === qsRef.current) return;
      qsRef.current = next;
      setQs(next);
      pushed.current.add(next);
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  const toggleColor = (slug) => update((c) => ({ color: c.colors.includes(slug) ? c.colors.filter((x) => x !== slug) : [...c.colors, slug] }));
  const toggleSize = (size) =>
    update((c) => ({ talla: (c.sizes.includes(size) ? c.sizes.filter((x) => x !== size) : [...c.sizes, size]).map(sizeToParam) }));
  const clearAll = () => update({ color: null, talla: null, q: null });

  // ---- Data
  const base = useMemo(() => {
    const inCat = category ? catalog.filter((p) => p.category === category) : catalog;
    return q ? searchProducts(inCat, q, 100) : inCat;
  }, [catalog, category, q]);

  const matchColor = (p) => !colors.length || productFamilies(p).some((f) => colors.includes(f));
  const matchSize = (p) => !sizes.length || p.sizes.some((s) => sizes.includes(s));

  const visible = useMemo(() => {
    const list = base.filter((p) => matchColor(p) && matchSize(p));
    return q && sort === "destacados" ? list : sortProducts(list, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, colors, sizes, sort, q]);

  // Facet counts (respecting the other facet)
  const colorCounts = useMemo(() => {
    const c = {};
    for (const p of base.filter(matchSize)) for (const f of productFamilies(p)) c[f] = (c[f] || 0) + 1;
    return c;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, sizes]);
  const availableSizes = useMemo(() => {
    const set = new Set();
    for (const p of base.filter(matchColor)) p.sizes.forEach((s) => set.add(s));
    return set;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, colors]);

  const catCounts = useMemo(() => {
    const c = {};
    for (const p of catalog) c[p.category] = (c[p.category] || 0) + 1;
    return c;
  }, [catalog]);

  const activeCount = colors.length + sizes.length;
  const chipHref = (path) => {
    const keep = new URLSearchParams(qs);
    keep.delete("q");
    const s = keep.toString();
    return s ? `${path}?${s}` : path;
  };

  return (
    <>
      {/* Category chips */}
      <nav className={styles.chips} aria-label="Categorías">
        <ul ref={chipsRef}>
          <li>
            <Link href={chipHref("/tienda")} className={styles.chip} aria-current={!category ? "page" : undefined}>
              Todo <sup>{catalog.length}</sup>
            </Link>
          </li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={chipHref(`/categoria/${c.slug}`)} className={styles.chip} aria-current={category === c.slug ? "page" : undefined}>
                {c.name} <sup>{catCounts[c.slug] || 0}</sup>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolLeft}>
          <button type="button" className={styles.tool} onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
            Filtrar{activeCount ? ` (${activeCount})` : ""}
          </button>
          <div className={styles.pills}>
            {q && (
              <button type="button" className={styles.pill} onClick={() => update({ q: null })} aria-label={`Quitar búsqueda ${q}`}>
                “{q}” <IconClose size={8} />
              </button>
            )}
            {colors.map((c) => (
              <button key={c} type="button" className={styles.pill} onClick={() => toggleColor(c)} aria-label={`Quitar filtro ${COLOR_FAMILIES.find((f) => f.slug === c)?.name}`}>
                <span className={styles.pillSw} style={{ background: COLOR_FAMILIES.find((f) => f.slug === c)?.hex }} />
                {COLOR_FAMILIES.find((f) => f.slug === c)?.name} <IconClose size={8} />
              </button>
            ))}
            {sizes.map((s) => (
              <button key={s} type="button" className={styles.pill} onClick={() => toggleSize(s)} aria-label={`Quitar talla ${s}`}>
                Talla {s} <IconClose size={8} />
              </button>
            ))}
            {(activeCount > 0 || q) && (
              <button type="button" className={styles.clear} onClick={clearAll}>
                Borrar todo
              </button>
            )}
          </div>
        </div>
        <div className={styles.toolRight}>
          <p className={styles.count} aria-live="polite">
            {visible.length} {visible.length === 1 ? "pieza" : "piezas"}
          </p>
          <label className={styles.sort}>
            <span className={styles.sortLabel}>Ordenar</span>
            <select value={sort} onChange={(e) => update({ orden: e.target.value === "destacados" ? null : e.target.value })} aria-label="Ordenar por">
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.density} role="group" aria-label="Densidad de la rejilla">
            <button type="button" onClick={() => changeDensity("large")} aria-pressed={density === "large"} aria-label="Vista amplia">
              <IconGrid cols={1} className={styles.mOnly} />
              <IconGrid cols={2} className={styles.dOnly} />
            </button>
            <button type="button" onClick={() => changeDensity("compact")} aria-pressed={density === "compact"} aria-label="Vista compacta">
              <IconGrid cols={2} className={styles.mOnly} />
              <IconGrid cols={4} className={styles.dOnly} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {visible.length > 0 ? (
        <div key={`${density}-${colors.join()}-${sizes.join()}-${sort}-${q}`} className={styles.grid} data-density={density}>
          {visible.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              priority={i < 4}
              sizes={density === "large" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Ninguna pieza coincide.</p>
          <p className={styles.emptyText}>Prueba a quitar algún filtro o explora el catálogo completo.</p>
          <div className={styles.emptyActions}>
            <button type="button" className="mk-btn" onClick={clearAll}>
              Borrar filtros
            </button>
            <Link href="/tienda" className="mk-btn mk-btn--ghost">
              Ver todo
            </Link>
          </div>
        </div>
      )}

      <FilterDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        colors={colors}
        sizes={sizes}
        colorCounts={colorCounts}
        availableSizes={availableSizes}
        toggleColor={toggleColor}
        toggleSize={toggleSize}
        clearAll={clearAll}
        resultCount={visible.length}
        sort={sort}
        setSort={(v) => update({ orden: v === "destacados" ? null : v })}
      />
    </>
  );
}

function FilterDrawer({ open, onClose, colors, sizes, colorCounts, availableSizes, toggleColor, toggleSize, clearAll, resultCount, sort, setSort }) {
  const ref = useRef(null);
  const { mounted, visible } = usePresence(open, 500);
  useLockBody(open);
  useDialog(ref, open, onClose);
  if (!mounted) return null;

  const groups = SIZE_GROUPS.map((g) => ({ ...g, sizes: g.sizes.filter((s) => availableSizes.has(s) || sizes.includes(s)) })).filter((g) => g.sizes.length);

  return (
    <div className={styles.fRoot} data-visible={visible || undefined}>
      <div className={styles.fBackdrop} onClick={onClose} aria-hidden="true" />
      <div ref={ref} className={styles.fPanel} role="dialog" aria-modal="true" aria-labelledby="filters-title">
        <header className={styles.fHead}>
          <h2 id="filters-title">Filtrar y ordenar</h2>
          <button type="button" onClick={onClose} aria-label="Cerrar filtros" className={styles.fClose}>
            <IconClose />
          </button>
        </header>
        <div className={styles.fBody}>
          <fieldset className={styles.fSet}>
            <legend>Ordenar</legend>
            <div className={styles.fSorts}>
              {SORTS.map((s) => (
                <label key={s.id} className="mk-check">
                  <input type="radio" name="sort" checked={sort === s.id} onChange={() => setSort(s.id)} />
                  <span>{s.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className={styles.fSet}>
            <legend>Color</legend>
            <ul className={styles.fColors}>
              {COLOR_FAMILIES.filter((f) => colorCounts[f.slug] || colors.includes(f.slug)).map((f) => (
                <li key={f.slug}>
                  <button type="button" className={styles.fColor} aria-pressed={colors.includes(f.slug)} onClick={() => toggleColor(f.slug)}>
                    <span className={styles.fSw} style={{ background: f.hex }} />
                    <span>{f.name}</span>
                    <span className={styles.fCount}>{colorCounts[f.slug] || 0}</span>
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <fieldset className={styles.fSet}>
            <legend>Talla</legend>
            {groups.map((g) => (
              <div key={g.id} className={styles.fGroup}>
                <p className={styles.fGroupLabel}>{g.label}</p>
                <div className={styles.fSizes}>
                  {g.sizes.map((s) => (
                    <button key={s} type="button" className={styles.fSize} aria-pressed={sizes.includes(s)} onClick={() => toggleSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>
        </div>
        <footer className={styles.fFoot}>
          <button type="button" className="mk-btn mk-btn--ghost" onClick={clearAll}>
            Borrar
          </button>
          <button type="button" className="mk-btn" onClick={onClose}>
            Ver {resultCount} {resultCount === 1 ? "pieza" : "piezas"}
          </button>
        </footer>
      </div>
    </div>
  );
}

