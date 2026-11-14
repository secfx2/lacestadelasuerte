# MUSKETEER — Brief de marca y del proyecto

> *Tous pour un.* Ropa unisex de lujo callejero. Catálogo permanente, sin drops.

## Concepto
MUSKETEER traduce el código de los mosqueteros (hermandad, lealtad, esgrima, plata, el tabardo azul con la cruz) a ropa de calle contemporánea: cortes **boxy, baggy y oversize**, tejidos pesados, lavados vintage y joyería de plata 925. Referentes de energía: Cold Culture (web limpia, catálogo, minimalismo blanco), Two Jeys / Project Paris (joyería y accesorios con carácter), Diesel (lavados y efectos). Nada de copiar: todo es diseño original.

- **Unisex** en casi todo. Cortes boxy/baggy actuales.
- **Catálogo, no drops.** Todo está siempre disponible, organizado por categorías.
- **Tono**: sobrio, seguro, ligeramente literario. Español con guiños en francés (*Tous pour un*, *En garde*, *Un pour tous*). Nunca gritón, sin emojis, sin signos de exclamación.

## Sistema de logo (generado con Recraft V4.1 en Higgsfield)
| Pieza | Archivo | Uso |
|---|---|---|
| Wordmark (principal) | `public/brand/wordmark*.svg` | Header, footer, etiquetas, todo lo institucional |
| Emblema — tres estoques | `public/brand/emblem*.svg` | Favicon, bordados, anillo de sello, sello pequeño |
| Monograma M | `public/brand/monogram*.svg` | Packaging, botones, herrajes |
| Gótico | `public/brand/gothic*.svg` | Solo gráficos de prenda (camisetas, strass) |
| Sello *Tous pour un* | `public/brand/seal*.svg` | Packaging, pegatinas, certificado de joyería |

Cada SVG existe en `-black`, `-white` y `currentColor` (sin sufijo). En React usa `<Logo variant="wordmark|emblem|monogram|gothic|seal" />` de `src/components/brand/Logo.js` (hereda `color`).
Originales sin procesar: `brand-source/`.

## Paleta
| Nombre | Hex | Rol |
|---|---|---|
| Tinta | `#0A0A0A` | Texto, logo, botones |
| Papel | `#FFFFFF` | Fondo de la web (siempre blanco) |
| Niebla | `#F4F4F2` | Superficies suaves, placeholders |
| Hueso | `#ECE8E1` | Bloques editoriales |
| Acero | `#9A9DA1` | Plata, texto secundario sobre oscuro |
| Azul Tabardo | `#1F2B4D` | Acento de marca (el tabardo del mosquetero) |
| Lacre | `#7A1F1F` | Acento raro: rebajas, avisos |

## Tipografía
- **Archivo** (Google Fonts, eje de anchura `wdth`): UI, navegación, precios, cuerpo. Mayúsculas con tracking (`.caps`) para nav y metadatos. Titulares en *expanded* (`font-stretch:125%`).
- **Instrument Serif** (normal + itálica): acentos editoriales, citas, el lema.
- Variables CSS: `--font-sans`, `--font-serif`. Tokens en `src/app/globals.css`.

## Reglas visuales
- Fondo blanco, mucho aire, retícula estricta, sin esquinas redondeadas (`--radius: 0`).
- Fotografía de producto: **1ª foto siempre la prenda tendida plana sobre superficie blanca (flat lay cenital)**; 2ª con modelo sobre fondo blanco; 3ª otra vista de la prenda sola (espalda/ángulo); 4ª detalle o macro.
- Casting fijo de 4 modelos (marco, yuna, nia, kofi) para coherencia.
- Hover en la rejilla: cambia de flat lay a foto con modelo.

## Estructura del repo
- `src/data/catalog.json` — catálogo (38 productos, categorías, colores, tallas, rutas de imágenes y briefs de generación en `prompt`).
- `public/products/<slug>/<color>-<n>.jpg` — fotos (1200×1500, 4:5).
- `public/campaign/` — imágenes editoriales/campaña.
- `src/app/brand` — Brand Book online. PDF en `public/brand/musketeer-brandbook.pdf`.
