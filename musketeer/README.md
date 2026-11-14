# MUSKETEER — *Tous pour un*

Tienda online de una marca de ropa unisex de lujo callejero: cortes boxy y baggy, punto, chaquetas, accesorios y joyería de plata 925. Catálogo permanente, sin drops.

Todo el material visual (logotipos, fotografía de producto, campaña y mockups del brand book) se generó con **Higgsfield**.

**Web en vivo:** https://musketeer-eight.vercel.app

- **Logo v2:** `musketeer™` (principal), `msktr™` (marca corta), `msk✦tr` (gráfico), estrella de estoques (símbolo) y sello MSKTR.
- **Catálogo:** 53 piezas. 15 de la **línea 2026** (boxy recortado y color: varsity, chándal, rugby, polo de punto, Mantle Cropped Jacket…) y 38 del catálogo clásico.

## Arrancar

```bash
cd musketeer
npm install
npm run dev        # http://localhost:3100
npm run build && npm start
```

## Qué hay dentro

| Ruta | Qué es |
|---|---|
| `/` | Home: campaña, categorías, esenciales, banners editoriales, joyería, lookbook |
| `/tienda` · `/categoria/[slug]` | Catálogo con filtros (categoría, color, talla), orden y densidad de rejilla |
| `/producto/[slug]` | Ficha: galería (flat lay → modelo → otra vista → detalle), colores, tallas, guía de tallas |
| `/cesta` · `/checkout` | Cesta persistente y checkout completo **en modo demostración** (no se cobra nada) |
| `/lookbook` · `/la-maison` · `/ayuda` | Editorial, marca y ayuda |
| `/brand` | Brand Book online · PDF en `public/brand/musketeer-brandbook.pdf` |

Código de descuento de prueba: `TOUSPOURUN` (−10 %).

## Estructura

- `BRIEF.md` — concepto, logo, paleta, tipografía y reglas visuales.
- `src/data/catalog.json` — los 53 productos (los de `"line": "2026"` son la línea nueva) (precios, tallas, colores, imágenes y el brief de generación de cada foto).
- `src/data/campaign.json` — imágenes de campaña.
- `public/brand/` — logotipos SVG (wordmark, emblema, monograma, gótico, sello) en negro, blanco y `currentColor`.
- `brand-source/` — vectores originales de Recraft V4.1.
- `scripts/IMAGE_PIPELINE.md` y `scripts/IMAGE_PIPELINE_2026.md` — cómo se generaron las fotos de producto (modelos, prompts, orden, QA).
- `scripts/manifests/` — job ids de Higgsfield de cada imagen (para regenerar o reutilizar como referencia).
