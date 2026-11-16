"use client";
import { useEffect, useState } from "react";
import ProductPreview from "@/components/preview/ProductPreview";
import GalleryPicker from "@/components/GalleryPicker";
import ProposeDialog from "@/components/ProposeDialog";
import { useStudio } from "@/components/Studio";
import { usePersisted } from "@/components/usePersisted";
import { previewDraft, store } from "@/lib/client";
import { BRANDS, defaultSizes } from "@/config/brands";
import styles from "./vista.module.css";

const EMPTY = { name: "", price: 89, category: "", description: "", details: "", sizes: [], colorName: "Negro lavado", colorHex: "#2B2A2D", badge: "Nuevo", images: [], brandName: "", accent: "#111111" };
const BADGES = ["", "Nuevo", "Top", "Edición limitada"];

export default function Preview() {
  const { brand, setBrand, toast } = useStudio();
  const [p, setP] = usePersisted("vista.product", EMPTY);
  const [view, setView] = usePersisted("vista.view", "ficha");
  const [device, setDevice] = usePersisted("vista.device", "desktop");
  const [pick, setPick] = useState(null);
  const [propose, setPropose] = useState(null);
  const [sizeInput, setSizeInput] = useState("");
  const b = BRANDS[brand];
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  // Borrador de "Ver en la web"
  useEffect(() => {
    const d = previewDraft.get();
    if (!d || d.at < (store.get("vista.consumed", 0) || 0)) return;
    store.set("vista.consumed", Date.now());
    if (d.brand && BRANDS[d.brand] && d.brand !== brand) setBrand(d.brand);
    const br = BRANDS[d.brand] || b;
    const cat = d.category || br.categories[0].slug;
    setP((x) => ({
      ...x,
      name: d.name || x.name,
      category: cat,
      price: d.price ?? x.price,
      description: d.description || x.description,
      details: (d.details || []).join("\n") || x.details,
      sizes: defaultSizes(d.brand || brand, cat),
      images: (d.images || []).map((i) => (typeof i === "string" ? i : i.url)).slice(0, 4),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Categoría y tallas válidas para la marca elegida
  useEffect(() => {
    setP((x) => {
      if (b.categories.some((c) => c.slug === x.category) && x.sizes?.length) return x;
      const cat = b.categories.some((c) => c.slug === x.category) ? x.category : b.categories[0].slug;
      return { ...x, category: cat, sizes: x.sizes?.length ? x.sizes : defaultSizes(brand, cat) };
    });
  }, [brand, b, setP]);

  const product = { ...p, details: String(p.details || "").split("\n").map((d) => d.trim()).filter(Boolean), images: p.images };

  return (
    <div className="page">
      <header className="page-head">
        <p className="eyebrow">05 · Maqueta</p>
        <h1 className="h1">Vista en la web</h1>
        <p className="lede">Así quedaría la prenda en la ficha de producto y en la tienda de {brand === "nueva" ? "la marca nueva" : b.name}, con sus colores y tipografías.</p>
      </header>
      <div className={styles.wrap}>
        <div className={`${styles.editor} stack`}>
          <div className="field">
            <span className="label">Imágenes</span>
            <div className={styles.imgs}>
              {[0, 1].map((i) => (
                <div key={i} className={styles.imgSlot}>
                  {p.images[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[i]} alt={i === 0 ? "Flat lay" : "Con modelo"} />
                  ) : (
                    <span className="tiny muted">{i === 0 ? "Flat lay" : "Con modelo"}</span>
                  )}
                  <div className="row">
                    <button type="button" className="btn btn--xs btn--ghost" onClick={() => setPick(i)}>{p.images[i] ? "Cambiar" : "Elegir"}</button>
                    {p.images[i] && <button type="button" className="btn btn--xs btn--quiet" onClick={() => set("images", p.images.filter((_, j) => j !== i))}>Quitar</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {brand === "nueva" && (
            <div className="row" style={{ alignItems: "stretch" }}>
              <label className="field" style={{ flex: "2 1 160px" }}>
                <span className="label">Nombre de la marca</span>
                <input className="input" value={p.brandName} onChange={(e) => set("brandName", e.target.value)} placeholder="TU MARCA" maxLength={40} />
              </label>
              <label className="field" style={{ flex: "0 0 80px" }}>
                <span className="label">Acento</span>
                <input className="input" type="color" value={p.accent} onChange={(e) => set("accent", e.target.value)} style={{ padding: 4 }} />
              </label>
            </div>
          )}
          <label className="field">
            <span className="label">Nombre</span>
            <input className="input" value={p.name} onChange={(e) => set("name", e.target.value)} maxLength={80} placeholder="Seraph Baggy" data-testid="vista-name" />
          </label>
          <div className="row" style={{ alignItems: "stretch" }}>
            <label className="field" style={{ flex: "1 1 100px" }}>
              <span className="label">Precio (€)</span>
              <input className="input" type="number" min="0" inputMode="decimal" value={p.price} onChange={(e) => set("price", e.target.value)} />
            </label>
            <label className="field" style={{ flex: "2 1 150px" }}>
              <span className="label">Categoría</span>
              <select className="select" value={p.category} onChange={(e) => setP((x) => ({ ...x, category: e.target.value, sizes: defaultSizes(brand, e.target.value) }))}>
                {b.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
              </select>
            </label>
          </div>
          <div className="row" style={{ alignItems: "stretch" }}>
            <label className="field" style={{ flex: "2 1 150px" }}>
              <span className="label">Color</span>
              <input className="input" value={p.colorName} onChange={(e) => set("colorName", e.target.value)} maxLength={40} />
            </label>
            <label className="field" style={{ flex: "0 0 72px" }}>
              <span className="label">Tono</span>
              <input className="input" type="color" value={p.colorHex} onChange={(e) => set("colorHex", e.target.value)} style={{ padding: 4 }} />
            </label>
            <label className="field" style={{ flex: "1 1 120px" }}>
              <span className="label">Etiqueta</span>
              <select className="select" value={p.badge} onChange={(e) => set("badge", e.target.value)}>
                {BADGES.map((x) => <option key={x} value={x}>{x || "Ninguna"}</option>)}
              </select>
            </label>
          </div>
          <label className="field">
            <span className="label">Descripción</span>
            <textarea className="textarea" value={p.description} onChange={(e) => set("description", e.target.value)} maxLength={1200} />
          </label>
          <label className="field">
            <span className="label">Detalles (uno por línea)</span>
            <textarea className="textarea" value={p.details} onChange={(e) => set("details", e.target.value)} style={{ minHeight: 90 }} />
          </label>
          <div className="field">
            <span className="label">Tallas</span>
            <div className="chips">
              {[...new Set([...defaultSizes(brand, p.category), ...(p.sizes || [])])].map((z) => (
                <button key={z} type="button" className="chip" aria-pressed={(p.sizes || []).includes(z)} onClick={() => set("sizes", (p.sizes || []).includes(z) ? p.sizes.filter((x) => x !== z) : [...(p.sizes || []), z])}>{z}</button>
              ))}
            </div>
            <div className="row">
              <input className="input" style={{ flex: 1 }} value={sizeInput} onChange={(e) => setSizeInput(e.target.value)} placeholder="Otra talla (p. ej. 40)" maxLength={12} />
              <button type="button" className="btn btn--sm btn--ghost" onClick={() => { if (sizeInput.trim()) { set("sizes", [...(p.sizes || []), sizeInput.trim()]); setSizeInput(""); } }}>Añadir</button>
            </div>
          </div>
          <button type="button" className="btn btn--block" onClick={() => setPropose({ brand, category: p.category, name: p.name, price: Number(p.price) || 0, description: p.description, details: product.details, sizes: p.sizes, colorName: p.colorName, colorHex: p.colorHex, images: p.images.map((url) => ({ url })) })} disabled={!p.images.length}>
            Proponer al catálogo
          </button>
        </div>

        <div className="stack">
          <div className="row-between">
            <div className="seg" role="radiogroup" aria-label="Vista">
              <button type="button" role="radio" aria-checked={view === "ficha"} onClick={() => setView("ficha")}>Ficha</button>
              <button type="button" role="radio" aria-checked={view === "tienda"} onClick={() => setView("tienda")}>En la tienda</button>
            </div>
            <div className="seg" role="radiogroup" aria-label="Dispositivo">
              <button type="button" role="radio" aria-checked={device === "desktop"} onClick={() => setDevice("desktop")}>Escritorio</button>
              <button type="button" role="radio" aria-checked={device === "mobile"} onClick={() => setDevice("mobile")}>Móvil</button>
            </div>
          </div>
          {!p.images.length && <p className="notice">Elige imágenes (o pulsa «Ver en la web» en cualquier resultado) para ver tu prenda en la tienda.</p>}
          <ProductPreview brandId={brand} product={product} view={view} device={device} brandName={p.brandName} accent={p.accent} />
          {b.live && <p className="tiny muted">Tienda real: <a href={b.live} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>{b.live}</a></p>}
        </div>
      </div>
      <GalleryPicker open={pick !== null} onClose={() => setPick(null)} max={1} title={pick === 0 ? "Imagen 1 · flat lay" : "Imagen 2 · con modelo"} onPick={(r) => { if (!r[0]) return; const imgs = [...p.images]; imgs[pick] = r[0].url; set("images", imgs.filter(Boolean)); toast("Imagen cambiada"); }} />
      <ProposeDialog open={Boolean(propose)} initial={propose} onClose={() => setPropose(null)} />
    </div>
  );
}
