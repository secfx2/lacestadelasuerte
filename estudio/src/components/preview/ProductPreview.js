"use client";
import { useEffect, useRef, useState } from "react";
import { BRANDS, categoryName } from "@/config/brands";
import { brandFontClasses, FONT_STACK } from "@/config/brandFonts";
import s from "./preview.module.css";

const price = (n) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: Number(n) % 1 ? 2 : 0, maximumFractionDigits: 2 }).format(Number(n) || 0);

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
const ICONS = {
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L21 21",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6",
  bag: "M5 8h14l-1 13H6L5 8zM9 8V6a3 3 0 0 1 6 0v2",
  star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z",
  menu: "M3 7h18M3 12h18M3 17h18",
};

function themeVars(brand, accent) {
  const t = brand.theme;
  const f = brand.fonts;
  return {
    "--p-paper": t.paper, "--p-ink": t.ink, "--p-fog": t.fog, "--p-bone": t.bone, "--p-tile": t.tile,
    "--p-muted": t.muted, "--p-line": t.line, "--p-accent": accent || t.accent, "--p-alert": t.alert,
    "--p-sans": FONT_STACK[f.sans], "--p-display": FONT_STACK[f.display], "--p-serif": FONT_STACK[f.serif],
    "--p-name-font": f.name.font === "display" ? FONT_STACK[f.display] : FONT_STACK[f.sans],
    "--p-name-stretch": f.name.stretch, "--p-name-weight": f.name.weight,
    "--p-name-case": f.name.upper ? "uppercase" : "none", "--p-name-size": f.name.size,
  };
}

function Wordmark({ brand, name }) {
  if (brand.wordmark) {
    return <span className={s.wordmark} style={{ "--wm": `url("${brand.wordmark}")`, aspectRatio: brand.wordmarkRatio }} role="img" aria-label={brand.name} />;
  }
  return <span className={s.wordText}>{name || "TU MARCA"}</span>;
}

function Header({ brand, name, mobile }) {
  const cats = brand.categories.slice(0, 5);
  return (
    <>
      <div className={s.announce}>Envío gratuito desde {brand.freeFrom} €{mobile ? "" : " · Devoluciones en 30 días"}</div>
      <header className={s.header}>
        {mobile ? (
          <span className={s.hIcon}><Icon d={ICONS.menu} /></span>
        ) : (
          <nav className={s.nav}>
            <span>Novedades</span>
            {cats.slice(0, 4).map((c) => <span key={c.slug}>{c.name}</span>)}
          </nav>
        )}
        <span className={s.logo}><Wordmark brand={brand} name={name} /></span>
        <span className={s.hIcons}>
          {!mobile && <span className={s.hIcon}><Icon d={ICONS.search} /></span>}
          {!mobile && <span className={s.hIcon}><Icon d={ICONS.user} /></span>}
          <span className={s.hIcon}><Icon d={ICONS.bag} /></span>
        </span>
      </header>
    </>
  );
}

function Img({ src, blend, className, alt = "" }) {
  if (!src) return <div className={`${s.frame} ${className || ""}`}><span className={s.noimg}>Sin imagen</span></div>;
  return (
    <div className={`${s.frame} ${className || ""}`} data-blend={blend || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className={s.acc}>
      {items.map((it, i) => (
        <div key={it.t} className={s.accItem} data-open={open === i || undefined}>
          <button type="button" className={s.accBtn} onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{it.t}</span>
            <span className={s.accIcon} aria-hidden="true" />
          </button>
          {open === i && <div className={s.accBody}>{it.c}</div>}
        </div>
      ))}
    </div>
  );
}

function Ficha({ brand, brandId, p, mobile }) {
  const imgs = p.images.filter(Boolean);
  const [slide, setSlide] = useState(0);
  const blendFor = (i) => !(brandId === "pecado" && i > 0);
  const sku = `${brand.skuPrefix}-0XX-${(p.colorName || "COLOR").toUpperCase().replace(/[^A-Z0-9]/g, "")}`;
  return (
    <div className={s.pdp}>
      {mobile ? (
        <div className={s.carWrap}>
          <div className={s.carousel} onScroll={(e) => setSlide(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
            {(imgs.length ? imgs : [null]).map((src, i) => <Img key={i} src={src} blend={blendFor(i)} className={s.slide} alt={p.name} />)}
          </div>
          {imgs.length > 1 && (
            <>
              <span className={s.counter}>{slide + 1} / {imgs.length}</span>
              <div className={s.dots}>{imgs.map((_, i) => <span key={i} data-on={i === slide || undefined} />)}</div>
            </>
          )}
        </div>
      ) : (
        <div className={s.gallery} data-count={imgs.length}>
          {(imgs.length ? imgs : [null, null]).map((src, i) => <Img key={i} src={src} blend={blendFor(i)} className={s.shot} alt={p.name} />)}
        </div>
      )}
      <aside className={s.panel}>
        <nav className={s.crumbs}><span>Tienda</span><span aria-hidden="true">/</span><span>{categoryName(brandId, p.category) || "Categoría"}</span></nav>
        {p.badge && <p className={s.badge}>{p.badge}</p>}
        <h1 className={s.name}>{p.name || "Nombre de la prenda"}</h1>
        <p className={s.price}>{price(p.price)}</p>
        <p className={s.tax}>IVA incluido · Unisex</p>
        <div className={s.block}>
          <p className={s.label}>Color <span>{p.colorName || "—"}</span></p>
          <div className={s.swatches}>
            <span className={s.swatch} data-on>
              <Img src={imgs[0]} blend className={s.swatchImg} />
              <span className={s.swatchHex} style={{ background: p.colorHex || "#222" }} />
            </span>
          </div>
        </div>
        <div className={s.block}>
          <div className={s.labelRow}>
            <p className={s.label}>Talla</p>
            <span className={s.guide}>Guía de tallas</span>
          </div>
          <div className={s.sizes} data-one={p.sizes.length === 1 || undefined}>
            {p.sizes.map((z) => <span key={z} className={s.size}>{z}</span>)}
          </div>
          <p className={s.fit}>Corte {brandId === "pecado" ? "ultra ancho" : "boxy"}: si dudas entre dos tallas, elige la tuya de siempre.</p>
        </div>
        <div className={s.actions}>
          <button type="button" className={s.cta} disabled aria-disabled="true">Añadir a la cesta — {price(p.price)}</button>
          <span className={s.wish}><Icon d={ICONS.star} /></span>
        </div>
        <ul className={s.perks}>
          <li>Envío gratuito desde {brand.freeFrom} €</li>
          <li>Devoluciones gratuitas en 30 días</li>
          <li>Catálogo permanente — siempre disponible</li>
        </ul>
        <Accordion
          items={[
            { t: "Descripción", c: <p>{p.description || "Descripción de la prenda."}</p> },
            { t: "Detalles y composición", c: <><ul>{(p.details.length ? p.details : ["Detalle"]).map((d) => <li key={d}>{d}</li>)}</ul><p><strong>Composición:</strong> {brand.composition}<br /><strong>Referencia:</strong> {sku}</p></> },
            { t: "Envíos y devoluciones", c: <p>Envío estándar en 2–4 días laborables (4,95 €, gratuito desde {brand.freeFrom} €). Express en 24–48 h por 9,95 €. Tienes 30 días para devolver cualquier pieza sin usar.</p> },
            { t: "Cuidado", c: <ul><li>Lavar del revés a 30 °C</li><li>No usar secadora</li><li>Planchar a temperatura baja sin tocar los gráficos</li></ul> },
          ]}
        />
      </aside>
    </div>
  );
}

function Card({ item, highlight }) {
  return (
    <article className={s.card} data-mine={highlight || undefined}>
      <div className={s.cardMedia}>
        <Img src={item.img[0]} blend className={s.cardFrame} alt={item.name} />
        {item.img[1] && <Img src={item.img[1]} blend className={s.cardHover} />}
        {item.badge && <span className={s.cardBadge}>{item.badge}</span>}
      </div>
      <div className={s.cardInfo}>
        <h3 className={s.cardName}>{item.name}</h3>
        <p className={s.cardPrice}>{price(item.price)}</p>
      </div>
    </article>
  );
}

function Tienda({ brand, brandId, p, mobile, highlight }) {
  const samples = [...brand.samples].sort((a, b) => (a.category === p.category ? -1 : 0) - (b.category === p.category ? -1 : 0));
  const real = samples.slice(0, mobile ? 5 : 7);
  const mine = { name: p.name || "Tu prenda", price: p.price, badge: p.badge || "Nuevo", img: [p.images[0], p.images[1] || null] };
  const list = [...real];
  list.splice(Math.min(1, list.length), 0, { ...mine, mine: true });
  return (
    <div className={s.shop}>
      <div className={s.intro}>
        <p className={s.introEyebrow}>Tienda</p>
        <h1 className={s.introTitle}>{categoryName(brandId, p.category) || "Todo"}</h1>
      </div>
      <div className={s.toolbar}>
        <span>{list.length} productos</span>
        <span className={s.toolbarR}><span>Filtrar</span><span>Ordenar</span></span>
      </div>
      <div className={s.grid}>
        {list.map((it, i) => <Card key={(it.slug || "mine") + i} item={it} highlight={it.mine && highlight} />)}
      </div>
    </div>
  );
}

/**
 * Maqueta fiel a la plantilla de las tiendas (ficha + rejilla), escalada para
 * caber en pantalla. device: "desktop" (1280 px) | "mobile" (390 px).
 */
export default function ProductPreview({ brandId, product, view = "ficha", device = "desktop", brandName, accent, highlight = true }) {
  const brand = BRANDS[brandId] || BRANDS.nueva;
  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [h, setH] = useState(800);
  const width = device === "mobile" ? 390 : 1280;
  useEffect(() => {
    const el = wrapRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const ro = new ResizeObserver(() => {
      const sc = Math.min(1, el.clientWidth / width);
      setScale(sc);
      setH(inner.offsetHeight * sc);
    });
    ro.observe(el);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [width]);
  const mobile = device === "mobile";
  return (
    <div ref={wrapRef} className={s.stage} data-device={device} style={{ height: h }}>
      <div
        ref={innerRef}
        className={`${s.site} ${brandFontClasses}`}
        data-dark={brand.theme.dark || undefined}
        data-mobile={mobile || undefined}
        data-testid="preview-site"
        style={{ ...themeVars(brand, brandId === "nueva" ? accent : null), width, transform: `scale(${scale})` }}
      >
        <Header brand={brand} name={brandName} mobile={mobile} />
        {view === "tienda" ? <Tienda brand={brand} brandId={brandId} p={product} mobile={mobile} highlight={highlight} /> : <Ficha brand={brand} brandId={brandId} p={product} mobile={mobile} />}
      </div>
    </div>
  );
}
