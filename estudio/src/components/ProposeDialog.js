"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import ErrorNote from "./ErrorNote";
import { useStudio } from "./Studio";
import { api } from "@/lib/client";
import { BRANDS, BRAND_IDS, defaultSizes, kindForCategory } from "@/config/brands";

/** "Proponer al catálogo": guarda una propuesta para una marca. */
export default function ProposeDialog({ open, onClose, initial }) {
  const { brand: globalBrand, toast } = useStudio();
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!open) return;
    const brand = initial?.brand && BRANDS[initial.brand] ? initial.brand : globalBrand;
    const cats = BRANDS[brand].categories;
    const category = initial?.category && cats.some((c) => c.slug === initial.category) ? initial.category : initial?.category || cats[0].slug;
    setF({
      brand,
      category,
      name: initial?.name || "",
      price: initial?.price ?? (brand === "musketeer" || brand === "orbita" ? 160 : 79),
      description: initial?.description || "",
      details: (initial?.details || []).join("\n"),
      sizes: (initial?.sizes || defaultSizes(brand, category)).join(", "),
      colorName: initial?.colorName || "",
      colorHex: initial?.colorHex || "#222222",
      images: initial?.images || [],
      notes: initial?.notes || "",
      prompt: initial?.prompt || null,
      kind: initial?.kind || kindForCategory(category),
      casting: initial?.casting || null,
    });
    setErr(null);
  }, [open, initial, globalBrand]);

  if (!open || !f) return null;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const cats = BRANDS[f.brand].categories;

  async function save() {
    setBusy(true);
    setErr(null);
    try {
      await api("/api/proposals", {
        method: "POST",
        body: { ...f, details: f.details.split("\n"), sizes: f.sizes.split(","), kind: kindForCategory(f.category) },
      });
      toast("Propuesta guardada");
      onClose();
    } catch (e) {
      setErr({ error: e.message, detail: e.detail });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Proponer al catálogo"
      eyebrow="Propuesta"
      footer={
        <>
          <Link href="/propuestas" className="btn btn--quiet">Ver propuestas</Link>
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn" onClick={save} disabled={busy || !f.name.trim()}>
            {busy ? <span className="spin" /> : null} Guardar propuesta
          </button>
        </>
      }
    >
      <div className="stack">
        {f.images.length > 0 && (
          <div className="row">
            {f.images.map((im, i) => (
              <div key={im.url} style={{ position: "relative" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt="" style={{ width: 76, aspectRatio: "4/5", objectFit: "cover", background: "#f2f2f2" }} />
                <button type="button" className="btn btn--xs btn--quiet" onClick={() => setF((x) => ({ ...x, images: x.images.filter((_, j) => j !== i) }))}>Quitar</button>
              </div>
            ))}
          </div>
        )}
        <div className="row" style={{ alignItems: "stretch" }}>
          <label className="field" style={{ flex: "1 1 160px" }}>
            <span className="label">Marca</span>
            <select className="select" value={f.brand} onChange={(e) => setF((x) => ({ ...x, brand: e.target.value, category: BRANDS[e.target.value].categories[0].slug, sizes: defaultSizes(e.target.value, BRANDS[e.target.value].categories[0].slug).join(", ") }))}>
              {BRAND_IDS.map((id) => <option key={id} value={id}>{BRANDS[id].name}</option>)}
            </select>
          </label>
          <label className="field" style={{ flex: "1 1 160px" }}>
            <span className="label">Categoría</span>
            <select className="select" value={f.category} onChange={(e) => setF((x) => ({ ...x, category: e.target.value, sizes: defaultSizes(x.brand, e.target.value).join(", ") }))}>
              {!cats.some((c) => c.slug === f.category) && <option value={f.category}>{f.category}</option>}
              {cats.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <div className="row" style={{ alignItems: "stretch" }}>
          <label className="field" style={{ flex: "3 1 200px" }}>
            <span className="label">Nombre</span>
            <input className="input" value={f.name} onChange={set("name")} placeholder="Seraph Baggy" maxLength={80} />
          </label>
          <label className="field" style={{ flex: "1 1 100px" }}>
            <span className="label">Precio (€)</span>
            <input className="input" type="number" inputMode="decimal" min="0" value={f.price} onChange={set("price")} />
          </label>
        </div>
        <label className="field">
          <span className="label">Descripción</span>
          <textarea className="textarea" value={f.description} onChange={set("description")} maxLength={1200} />
        </label>
        <label className="field">
          <span className="label">Detalles (uno por línea)</span>
          <textarea className="textarea" value={f.details} onChange={set("details")} style={{ minHeight: 90 }} />
        </label>
        <div className="row" style={{ alignItems: "stretch" }}>
          <label className="field" style={{ flex: "2 1 180px" }}>
            <span className="label">Tallas</span>
            <input className="input" value={f.sizes} onChange={set("sizes")} />
          </label>
          <label className="field" style={{ flex: "1 1 120px" }}>
            <span className="label">Color</span>
            <input className="input" value={f.colorName} onChange={set("colorName")} placeholder="Negro lavado" />
          </label>
          <label className="field" style={{ flex: "0 0 72px" }}>
            <span className="label">Tono</span>
            <input className="input" type="color" value={f.colorHex} onChange={set("colorHex")} style={{ padding: 4 }} />
          </label>
        </div>
        <label className="field">
          <span className="label">Notas</span>
          <textarea className="textarea" value={f.notes} onChange={set("notes")} style={{ minHeight: 70 }} placeholder="Por qué encaja, dudas, variantes de color…" />
        </label>
        <ErrorNote {...(err || {})} />
      </div>
    </Modal>
  );
}
