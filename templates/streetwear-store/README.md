# streetwear-store — plantilla de tienda + brand book

Plantilla reutilizable nacida de la web de **MUSKETEER** (`musketeer/`): tienda online de ropa high-end (catálogo con filtros, ficha con galería flat lay → modelo → espalda → detalle, cesta, checkout en modo demostración, lookbook, ayuda) y **Brand Book** online imprimible en PDF. Next.js 15 (App Router), JavaScript, CSS Modules, sin dependencias extra.

Marca neutra de ejemplo: **BRAND** · *Your tagline* · 8 productos de muestra sin fotos (la web muestra placeholders hasta que existan).

## Arrancar

```bash
cp -r templates/streetwear-store <marca> && cd <marca>
npm install
npm run dev          # http://localhost:3100
npm run build && npm start
```

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Nombre, lemas, textos, envíos, descuento, legal, FAQ, tallas, paleta, brand book | `src/config/brand.js` |
| Fuentes | `src/config/fonts.js` (+ descripción en `brand.fonts`) |
| Productos, casting y briefs de foto | `src/data/catalog.json` |
| Hero, banners, lookbook | `src/data/campaign.json` |
| Logos | `public/brand/*.svg` → `npm run logos` |

## Scripts

| Comando | Hace |
|---|---|
| `npm run logos` | Regenera `logoData.js` y las variantes `-black` / `-white` desde `public/brand/*.svg` |
| `npm run logos:placeholder` | Logos provisionales con el nombre (`scripts/placeholder-logos.py --name …`) |
| `python3 scripts/vectorize.py in.png out.svg` | PNG → SVG de un trazado (`pip install potracer pillow numpy`) |
| `npm run images:status` | Fotos de producto / campaña / mockups que faltan |
| `npm run brandbook:pdf` | Exporta `/brand` a `public/brand/brandbook.pdf` (Playwright) |

**Guía completa para lanzar una marca nueva** (brief, logo con Higgsfield, catálogo, casting, protocolo de fotos, campaña, brand book, despliegue y costes): [`TEMPLATE.md`](./TEMPLATE.md).
