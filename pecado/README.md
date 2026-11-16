# PECADO — tienda + brand book

> Marca configurada desde la plantilla `streetwear-store`: **PECADO** · *Sin perdón* · streetwear Y2K grunge / mall-goth desde Madrid. Vaqueros ultra baggy bordados, sudaderas pesadas lavadas con el bajo deshilachado, chándal, camisetas gráficas, tachas y plata 925. Catálogo, no drops. Brief en [`BRIEF.md`](./BRIEF.md).

72 productos en 9 categorías (`src/data/catalog.json`, generado por `scripts/build_catalog.py`), dos fotos por pieza: `-1.jpg` flat lay sobre blanco y `-2.jpg` con modelo contra una pared de hormigón. Sin fotos de campaña: el hero, los banners, el lookbook y «Nosotros» usan las fotos con modelo (`src/data/campaign.json`).

## Arrancar

```bash
npm install
npm run dev          # http://localhost:3100
npm run build && npm start
```

## Lo propio de PECADO

| Qué | Dónde / cómo |
|---|---|
| **Web oscura** | Los tokens de la plantilla están invertidos: `--paper` = Asfalto `#0B0B0C` (fondo), `--ink` = Hueso `#E9E2D3` (texto y botones), `--accent` = Burdeos `#4A1015` (barra superior, insignias, banner ancho), `--ash` = Ceniza (texto secundario), `--alert` = Herida (solo errores). Todo en `brand.palette`; `globals.css` añade `--text-soft`, `--chip`, `--on-tile` y `font-synthesis: none` (la blackletter no tiene cursiva ni negrita: nunca se fingen). |
| **Fichas de producto** | Tile claro `brand.tile` (`#E2E0DB`). Solo los flat lays (`-1`, sobre blanco) se multiplican sobre él; las fotos con modelo (`-2`, hormigón) se ven tal cual (`ON_WALL` en `SmartImage.js`, también en el `Lightbox`). Si falta una foto con modelo, `SmartImage` enseña su flat lay; si falta todo, un placeholder con la cruz alada. |
| **Tipografía** | `src/config/fonts.js`: Grenze Gotisch (`--font-display`, titulares en caja alta y baja), Archivo con eje `wdth` (`--font-sans`, UI, precios, tallas, navegación y checkout) y UnifrakturMaguntia (`--font-serif`, solo lemas grandes: hero, marquee, banner ancho, 404, brand book). |
| **Logos** | Tipográficos y vectoriales, sin Higgsfield: `scripts/placeholder-logos.py` (edición PECADO) dibuja con Pillow y traza con potrace el wordmark en fraktur, el monograma «P» en el anillo de espinas, la marca alada, la cruz alada y el sello `PECADO · SIN PERDÓN · MADRID · 2026`. Luego `npm run logos`. `brand.logoInk` mantiene en Asfalto los `-black.svg` (favicon, máscaras). `public/favicon.svg` es la cruz alada adaptada a pestañas claras y oscuras. |
| **9 categorías** | `vaqueros, sudaderas, chandal, camisetas, polos-y-camisas, chaquetas, capas, accesorios, joyeria`. `brand.bottomCategories = ["vaqueros", "chandal"]` sustituye al «pantalones» de la plantilla (notas de corte y guía de tallas). |
| **Tallas** | `src/lib/shop.js`: los filtros usan claves por grupo (`cintura:36` ≠ `calzado:36`), con grupos ropa, cintura (vaqueros), calzado, cinturones, anillos, largos de cadena y otros (`Talla única`, `Par`…). URL legible: `?talla=m,cintura-32,calzado-42`. `sortSizes` ordena cualquier talla, conocida o no. Guías en `src/lib/sizeGuides.js`: vaqueros 28–38, tops XS–XXL, chándal, chaquetas, anillos 12–22, cadenas 35–60 cm, cinturones 80–110 y calzado 36–45. |
| **Etiquetas** | `"Top"` cuenta como el «Best seller» de la plantilla (orden «Destacados», lista de la home) y se pinta en Burdeos. |
| **Notas de corte y cuidado** | `brand.fitNotes.byCategory` / `byFit` / `bySlug` y `brand.care.byCategory` (vaqueros). |
| **Home** | Hero «la pared»: cuatro fotos con modelo de `campaign.hero.wall` (en móvil, `hero.mobileSlug`) con *Sin perdón* en fraktur; bloque doble vaqueros + sudaderas; carrusel de 9 categorías; bloque «Conjuntos» de chándal; banner ancho tipográfico en Burdeos. Para pasar a fotos de campaña, añade `hero.desktop` / `hero.mobile` en `campaign.json`. |
| **Brand book** | `/brand` en oscuro (hojas Asfalto, alguna en Hueso y el cierre en Burdeos), con la hoja de Grenze Gotisch, la secuencia de 2 fotos de dos productos y aplicaciones dibujadas con los logos mientras no haya mockups. |

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Nombre, lemas, textos, envíos (gratis desde 100 €), descuento `SINPERDON`, legal, FAQ, tallas, paleta, brand book | `src/config/brand.js` |
| Fuentes | `src/config/fonts.js` (+ descripción en `brand.fonts`) |
| Productos, casting y briefs de foto | `src/data/catalog.json` ← `scripts/build_catalog.py` (no editar a mano) |
| Hero, banners, lookbook, casting de «Nosotros» | `src/data/campaign.json` |
| Logos | `scripts/placeholder-logos.py` → `public/brand/*.svg` → `npm run logos` |

## Scripts

| Comando | Hace |
|---|---|
| `npm run logos` | Regenera `logoData.js` y las variantes `-black` / `-white` desde `public/brand/*.svg` |
| `npm run logos:placeholder` | Redibuja los logos (necesita `UnifrakturMaguntia.ttf` y `GrenzeGotisch-900.ttf` en la carpeta; se descargan con la API CSS de Google Fonts, ver el docstring del script) |
| `python3 scripts/vectorize.py in.png out.svg` | PNG → SVG de un trazado (`pip install potracer pillow numpy`) |
| `npm run images:status` | Fotos de producto / campaña / mockups que faltan |
| `npm run brandbook:pdf` | Exporta `/brand` a `public/brand/brandbook.pdf` (Playwright) |
| `python3 scripts/build_catalog.py` | Genera `src/data/catalog.json` |

Protocolo de fotos: [`scripts/IMAGE_PIPELINE.md`](./scripts/IMAGE_PIPELINE.md). Guía completa de la plantilla (brief, logo, catálogo, casting, campaña, brand book, despliegue y costes): [`TEMPLATE.md`](./TEMPLATE.md).
