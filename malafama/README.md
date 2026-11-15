# MALA FAMA — tienda online + Brand Book

**MALA FAMA** · *Que hablen* · *Mejor mala fama que ninguna* · *Hecho en el barrio*. Marca española de conjuntos de chándal Y2K (sudadera boxy recortada + pantalón extra ancho, a juego) hecha en Madrid. Catálogo permanente, sin drops: 64 productos en 8 categorías (conjuntos, sudaderas, pantalones, camisetas, punto, chaquetas, accesorios y joyería en plata 925).

Montada sobre la plantilla [`templates/streetwear-store`](../templates/streetwear-store) (Next.js 15, App Router, JS, CSS Modules). La guía completa de la plantilla está en [`TEMPLATE.md`](./TEMPLATE.md); el brief de la marca, en [`BRIEF.md`](./BRIEF.md).

## Arrancar

```bash
cd malafama
npm install
npm run dev          # http://localhost:3300
npm run build && npm start      # producción en :3300
# segundo build sin pisar .next:  NEXT_DIST_DIR=.next-otro npm run build
```

La tienda **nunca cobra**: el checkout termina en el aviso de modo demostración (código de prueba `QUEHABLEN`, 10 %). Envío gratuito desde 100 €.

## Dónde se cambia cada cosa

| Qué | Dónde |
|---|---|
| Nombre, lemas, textos, envíos, descuento, legal, FAQ, tallas, paleta, brand book | `src/config/brand.js` |
| Fuentes (UnifrakturMaguntia, Archivo, Pinyon Script) | `src/config/fonts.js` (+ descripción en `brand.fonts`) |
| Productos, casting y briefs de foto | `src/data/catalog.json` — **generado** por `scripts/build_catalog.py` (no lo edites a mano) |
| Hero (alineación de conjuntos), banners, lookbook, «Nosotros» | `src/data/campaign.json` (todo apunta a las fotos con modelo `-2.jpg`) |
| Logos | `scripts/placeholder-logos.py` → `public/brand/*.svg` → `npm run logos` |
| Fotos de producto | `public/products/<slug>/<color>-1.jpg` (flat lay) y `-2.jpg` (con modelo), protocolo en `scripts/IMAGE_PIPELINE.md` |

## Identidad en una línea

- **Paleta:** Asfalto `#111111`, Papel `#FFFFFF`, Niebla `#F4F2EE`, Crudo `#EDE6DA`, Cromo `#C7C9CC`, Burdeos `#6E2430` (acento), Cobalto `#2E4FA3` (segundo acento). Las fichas de producto siguen en gris claro `#F2F2F2` con *multiply* porque las fotos son sobre blanco; la noche entra en bloques (barra Burdeos, hero, cinta, banner, pie).
- **Tipografía:** gótica **UnifrakturMaguntia** para titulares grandes y el monograma; **Archivo** condensada negra (anchura 70, peso 800) para titulares de interfaz y Archivo normal para cuerpo; **Pinyon Script** para la firma y los lemas.
- **Logos** (tipográficos, dibujados en local, sin generación de imagen): firma «Mala Fama» en caligrafía, monograma gótico «MF», marca en arco «Mala ✦ Fama», daga tribal en llamas (símbolo/favicon) y sello «MALA FAMA ✦ MADRID ✦ 2026» con el MF.

## Scripts

| Comando | Hace |
|---|---|
| `npm run logos:placeholder` | Redibuja los 5 logos con `scripts/placeholder-logos.py` (fuentes en `brand-source/fonts/`) y ejecuta `npm run logos` |
| `npm run logos` | Regenera `logoData.js` y las variantes `-black` / `-white` desde `public/brand/*.svg` |
| `python3 scripts/build_catalog.py` | Regenera `src/data/catalog.json` |
| `npm run images:status` | Fotos de producto que faltan |
| `npm run brandbook:pdf` | Exporta `/brand` a `public/brand/brandbook.pdf` (Playwright) |

`brand-source/` guarda las fuentes OFL descargadas de la API CSS de Google Fonts para dibujar los logos; no se publica.

## Pendiente

- Datos legales reales (`brand.legal`: razón social, NIF, domicilio, correo).
- Mockups fotográficos del brand book (`public/brand/mockups/`); mientras no existan, el capítulo 08 dibuja aplicaciones tipográficas con los SVG.
- PDF del brand book (`npm run brandbook:pdf`) y despliegue en Vercel con Root Directory = `malafama/` y `NEXT_PUBLIC_SITE_URL`.
