# Plantilla `streetwear-store` — guía para lanzar una marca nueva

Esta plantilla es la web de **MUSKETEER** (`musketeer/`, la marca en vivo) convertida en una base neutra y configurable: tienda online de ropa (Next.js 15, App Router, JS, CSS Modules) + Brand Book online imprimible en PDF. Todo lo que es «de marca» vive en **un solo archivo**, `src/config/brand.js`; el catálogo y la campaña son JSON; los logotipos son SVG de un solo trazado.

> Regla de oro: **nunca** edites `musketeer/` ni esta plantilla para una marca concreta. Copia la carpeta y trabaja en la copia.

Tiempo orientativo con imágenes generadas en Higgsfield: 1 día de configuración + logo, 1–2 días de fotografía (40 productos), medio día de campaña, brand book y despliegue.

---

## 0. Qué hay dentro

```
streetwear-store/
├── src/config/brand.js        ← FUENTE ÚNICA DE VERDAD (textos, envíos, legal, FAQ, paleta, brand book…)
├── src/config/fonts.js        ← cargador de Google Fonts (next/font exige literales)
├── src/data/catalog.json      ← productos + casting (`models`) + briefs de foto (`prompt`)
├── src/data/campaign.json     ← hero, banners, lookbook (con piezas por look), imagen de «Nosotros»
├── src/components/brand/      ← <Logo variant=…/> + logoData.js (generado)
├── src/app/(shop)/…           ← tienda: /, /tienda, /categoria, /producto, /cesta, /checkout, /lookbook, /nosotros, /ayuda, /legal, /cuenta, /favoritos
├── src/app/brand/             ← Brand Book (/brand); data.js deriva todo de brand.js
├── public/brand/              ← logotipos SVG (wordmark, monogram, graphic, emblem, seal) × currentColor / -black / -white
├── public/products/           ← (vacío) fotos de producto  /products/<slug>/<color>-<n>.jpg
├── public/campaign/           ← (vacío) campaña
└── scripts/
    ├── vectorize.py           ← PNG → SVG de un trazado (potrace). El mismo que se usó en MUSKETEER
    ├── placeholder-logos.py   ← logos provisionales con el nombre de la marca
    ├── build-logo-data.mjs    ← public/brand/*.svg → logoData.js + variantes -black/-white   (npm run logos)
    ├── images-status.mjs      ← qué fotos existen y cuáles faltan                              (npm run images:status)
    └── export-brandbook-pdf.mjs ← /brand → public/brand/brandbook.pdf                          (npm run brandbook:pdf)
```

La web funciona **sin ninguna imagen**: cada foto que falta cae a un placeholder con el emblema (tienda) o a «Imagen en producción» (brand book). Puedes desplegar desde el primer día e ir llenando.

Requisitos: Node 20+ (probado con 22), Python 3 con `pip install potracer pillow numpy` (logos), ImageMagick (`convert`, `montage`) para fotos y hojas de contacto, Playwright + Chromium para el PDF.

---

## a) Brief y `src/config/brand.js`

### 1. Copiar y arrancar

```bash
cp -r templates/streetwear-store <marca>          # sin node_modules/.next (están en .gitignore)
cd <marca>
# package.json → "name": "<marca>"
npm install
npm run dev                                       # http://localhost:3100
```

### 2. Brief (rellena `BRIEF.md` con el cliente)
Nombre, concepto en una frase, referentes (energía, no copia), público, cortes (por defecto **boxy recortado 2026 + color**, no oversize largo), categorías, rango de precios, tono de voz, 2–3 frases propias (en MUSKETEER: *Tous pour un* / *Un pour tous* / *En garde*), ciudad, presupuesto de créditos.

### 3. Editar `brand.js` (orden recomendado)
Las constantes de arriba (`NAME`, `TAGLINE`, `MOTTO`, `SIGNOFF`, `CITY`, `LINE`, envío gratis, precios de envío, devoluciones, código de descuento) se reutilizan en todos los textos: cámbialas primero y casi todo se actualiza solo.

| Sección | Qué controla |
|---|---|
| `name`, `displayName`, `shortName`, `skuPrefix`, `storageKey` | Nombre en títulos/SEO, en texto corrido, marca corta, referencia de producto (`BRD-001-NEGRO`) y nº de pedido, prefijo de localStorage |
| `tagline`, `motto`, `signoff`, `city`, `currentLine` | Lemas (barra, marquee, pie, 404, checkout, brand book), origen, línea actual (`"line": "2026"` en el catálogo) |
| `locale` | idioma, locale de precios, moneda, región del pie, IVA |
| `palette`, `tile`, `paletteProportions`, `palettePairs`, `productPalette` | Tokens CSS (`--ink --paper --fog --bone --steel --accent --alert`, inyectados en `<html>`) y capítulo 04 del brand book |
| `fonts` | Descripción de las fuentes para el brand book (el cargador está en `fonts.js`) |
| `seo` | `<title>`, plantilla de título y descripciones por página |
| `announcements` | Barra superior (la frase igual a `tagline` sale en serif) |
| `routes`, `nav`, `megaMenu` | Etiquetas del menú, ruta de «Nosotros», enlaces y banners del mega menú |
| `categories`, `relatedCategories` | Lista y orden de categorías + texto de cabecera; «Completa el look». **Deben coincidir con `category` del catálogo** (el build avisa si no) |
| `shipping`, `discount`, `payments`, `paymentBrands` | Envío estándar/express y umbral gratis, código de prueba del checkout, métodos de pago |
| `home` | Caption y CTA del hero, títulos de secciones, listas *Novedades* / *Best sellers* (vacías = se derivan del catálogo), banners del bloque doble, portadas de categoría, marquee, bloque destacado (MUSKETEER: «Plata 925»), lookbook, newsletter |
| `newsletter`, `shopPage`, `search`, `product`, `cart`, `checkout`, `account`, `contact`, `notFound`, `lookbook` | Microcopy de cada pantalla, mensaje del **modo demostración** del checkout, países |
| `about` | Página `/nosotros` (manifiesto, 4 valores, sello, enlaces). En MUSKETEER era `/la-maison` |
| `footer` | Columnas, redes (`href: "#"` = próximamente), copyright. El enlace al PDF solo aparece si el archivo existe |
| `legal` | Razón social, NIF, dirección, email, fecha |
| `faq`, `helpPage` | Secciones de `/ayuda` (los precios de envío se rellenan solos desde las constantes) |
| `sizeGuideNotes`, `fitNotes`, `care` | Notas de las tablas de tallas, nota de corte bajo las tallas (por tipo, línea o producto concreto), cuidados |
| `brandBook` | Todo el texto de los 11 capítulos de `/brand` (ver §h) |

Listas de la home sin escribir slugs: *Novedades* = productos con `"badge": "Nuevo"` o de la línea actual; *Best sellers* = `"featured": true`, luego `"badge": "Best seller"`; portada de categoría = primer producto `featured` de la categoría. Si prefieres control total, pon slugs en `home.newIn.slugs`, `home.bestSellers.slugs`, `home.categories.covers`, `home.feature.slugs`.

### 4. Lo que NO está en `brand.js` (a propósito)
- Nombres de carpeta de las rutas (`/tienda`, `/producto`, `/nosotros`…). Si cambias `/nosotros`, renombra `src/app/(shop)/nosotros` y `routes.about`.
- UI genérica en español dentro de los componentes («Añadir a la cesta», «Filtrar», validaciones del checkout, provincias de España).
- Tablas de medidas (`src/lib/sizeGuides.js`), familias de color para filtros y sinónimos de búsqueda (`src/lib/shop.js`).
- Escala tipográfica y layout (`src/app/globals.css`). El prefijo de clases `mk-` es histórico, no hace falta cambiarlo.

---

## b) Logo con Higgsfield

El sistema tiene 5 piezas, cada una una variante de `<Logo variant=…/>`:

| Variante | Archivo | Qué es | Ejemplo MUSKETEER |
|---|---|---|---|
| `wordmark` | `public/brand/wordmark.svg` | Logotipo principal (header, pie, etiquetas) | `musketeer™` |
| `monogram` | `monogram.svg` | Marca corta (bordados, joyería, avatar) | `msktr™` |
| `graphic` | `graphic.svg` | Marca gráfica, solo prenda/campaña | `msk✦tr` (en MUSKETEER se llamaba `gothic`) |
| `emblem` | `emblem.svg` | Símbolo sin texto (favicon, herrajes, placeholders, separadores) | estrella de estoques |
| `seal` | `seal.svg` | Sello circular (packaging, newsletter, «Nosotros») | sello MSKTR · Tous pour un · Madrid |

Mientras no hay logo: `npm run logos:placeholder` (o `python3 scripts/placeholder-logos.py --name NOMBRE --short NMBR --tagline "Lema" --year 2026 && npm run logos`) genera provisionales con el nombre real.

### Rondas de exploración
1. **Herramientas** (ToolSearch): `select:mcp__Higgsfield__generate_image_batch,mcp__Higgsfield__jobs_wait,mcp__Higgsfield__balance`. Mira `balance` antes y después de cada tanda y díselo al usuario.
2. **Lettering (wordmark, monogram, graphic) → GPT Image 2.6** (`model: "gpt_image_2_6"`): escribe bien el texto. Explora en `quality: "medium"`, `resolution: "2k"` (≈ 1 crédito); solo los finalistas en `high` (≈ 2,75). `aspect_ratio: "16:9"` o `"3:2"` para wordmarks, `"1:1"` para monogramas.
   > Logo design proposal for the streetwear brand "{NAME}": {dirección: p. ej. lowercase heavy extended italic sans with ™, Y2K sports energy}. Solid black logo on a pure white background, flat vector style, perfectly crisp edges, no gradients, no shadows, no mockup, no other text, centered with generous margins. Exact spelling: "{NAME}".
3. **Símbolos (emblem, seal) → Recraft V4.1, estilo `vector`** (busca el id exacto con `models_explore`). Es caro a 2k (**≈ 10 créditos por imagen**): **explora siempre a 1k** y deja 2k para el finalista. Devuelve SVG multicolor/multitrazo: no lo uses tal cual, pásalo por el vectorizador (abajo).
4. Rondas de 8–12 propuestas, **numeradas** en hojas de contacto para que el cliente elija por número:
   ```bash
   montage r1/*.png -tile 4x -geometry 480x480+12+12 -label '%t' -pointsize 22 contacto-r1.jpg
   ```
   Ronda 1 amplia (direcciones distintas) → ronda 2 variaciones de las 2–3 elegidas → ronda 3 finalistas en high. MUSKETEER necesitó 42 propuestas en 3 rondas.
5. Guarda las fuentes originales en `brand-source/` (no se despliega; no la subas a `public/`).

### Vectorizar y publicar
```bash
pip install potracer pillow numpy
curl -sSf -o raw.png "<result_url>"
convert raw.png -colorspace gray -threshold 55% clean.png      # B/N puro; recorta motas si hace falta
python3 scripts/vectorize.py clean.png public/brand/wordmark.svg   # [scale] opcional, p. ej. 2 para PNG pequeños
# logo blanco sobre negro: convert raw.png -negate raw-inv.png antes
# SVG de Recraft: rasteriza primero → rsvg-convert -w 2400 -b white in.svg > in.png  (o convert -density 300)
npm run logos      # normaliza a 1 trazado fill=currentColor, crea -black/-white y regenera logoData.js
```
`build-logo-data.mjs` rechaza `<text>`, `<rect>`, transformaciones…: todo lo que no sea `<path>` pasa antes por `vectorize.py`. El favicon (`emblem-black.svg`) y los separadores/placeholders (máscara CSS con `emblem-black.svg`) se actualizan solos.

Después ajusta en `brand.js → brandBook.wordmark`: `intro`, `construction`, `gridDiv`, `clearRatio` (x del área de respeto en múltiplos de la altura del logo: MUSKETEER 0,77), `minSizes`, `misuse` (efectos disponibles: `stretch rotate deslant notm retype offpalette shadow lowcontrast busy enclose`), y los textos de `brandBook.symbols`.

---

## c) Paleta y fuentes

- **Paleta:** `brand.palette` (7 tokens con nombre, rol, CMYK y Pantone para el brand book). Fondo siempre blanco y casi monocromo; un **acento** de marca (MUSKETEER: Azul Tabardo `#1F2B4D`) y una **alerta** rara (Lacre `#7A1F1F`). Comprueba contraste en el capítulo 04 del brand book (calcula AA/AAA solo). `productPalette` = colores de prenda de la línea (no de marca).
- **Fuentes:** edita `src/config/fonts.js` (cualquier Google Font de `next/font/google`; mantén las variables `--font-brand-sans` / `--font-brand-serif`) y describe la elección en `brand.fonts` (familia, fuente, ejes, rol, `widths` del eje de anchura o `[]`). La plantilla usa **Archivo** (sans con eje `wdth`: titulares en *expanded* 125 %) + **Instrument Serif** (lema y citas). Si la sans nueva no tiene eje de anchura, los titulares `font-stretch:125%` simplemente salen normales.

---

## d) Catálogo — `src/data/catalog.json`

```jsonc
{
  "categories": [{ "slug": "chaquetas", "name": "Chaquetas" }, …],   // espejo de brand.categories
  "models": {                                                       // casting fijo (§e)
    "alex": { "job_id": "<job de Higgsfield>", "desc": "young Mediterranean man, short dark hair" }
  },
  "products": [{
    "slug": "boxy-work-jacket",           // URL + carpeta de fotos
    "name": "Boxy Work Jacket",           // nombre comercial (en MUSKETEER, en inglés)
    "category": "chaquetas",
    "price": 240,                         // número, moneda de brand.locale
    "sizes": ["XS","S","M","L","XL","XXL"], // o ["28"…"36"], ["10"…"20"] anillos, ["Talla única"], ["45 cm"…]
    "model": "alex",                      // clave de `models`
    "description": "…", "details": ["…"], "composition": "100% algodón", "fit": "Boxy", "unisex": true,
    "badge": "Nuevo",                     // null | "Nuevo" | "Best seller" | "Edición limitada" | "Pieza rara"
    "featured": true,                     // opcional: best sellers, portadas de categoría, bloque destacado
    "kind": "garment",                    // garment | accessory | jewellery  (plantillas de foto y notas de talla)
    "line": "2026",                       // opcional: línea actual (protocolo 2026, nota de corte, brand book)
    "prompt": {                           // brief de generación — NUNCA se envía al navegador
      "garment": "a boxy cropped heavyweight cotton canvas work jacket in washed black, …",  // vista frontal, flat lay
      "back":    "the back of the cropped jacket, …",          // 3ª foto
      "detail":  "macro close-up of …",                        // 4ª foto ("" en el protocolo 2026)
      "pose":    "standing straight, jacket open over a plain white tee, …",  // 2ª foto (o encuadre para accesorios)
      "seed_job": ""                      // opcional: job ya generado que ES el flat lay principal
    },
    "colors": [
      { "name": "Washed Black", "slug": "washed-black", "hex": "#2A2A2A", "variant": null,
        "images": ["/products/boxy-work-jacket/washed-black-1.jpg", "…-2.jpg", "…-3.jpg"] },
      { "name": "Sand", "slug": "sand", "hex": "#CFC6B5",
        "variant": "the same cropped work jacket in sand beige washed canvas with a matching corduroy collar",
        "images": ["/products/boxy-work-jacket/sand-1.jpg", "/products/boxy-work-jacket/sand-2.jpg"] }
    ]
  }]
}
```

Reglas:
- **Imágenes:** `/products/<slug>/<color-slug>-<n>.jpg`, 1200 × 1500 (4:5). Color principal: 4 archivos (protocolo clásico) o 3 (línea 2026, sin detalle); colores extra: 2 (flat + modelo); accesorios de la línea en colores extra: 1. El orden es fijo: **1 flat lay → 2 con modelo → 3 espalda/otra vista → 4 detalle**. En la rejilla, hover = imagen 2.
- **`prompt.garment`** en inglés, concreto y visual: tipo de prenda, color exacto, tejido y gramaje, corte, largo, cuello, cierres, bolsillos, costuras, estampado/bordado y **dónde**. Si no hay texto en la prenda, dilo («no text anywhere»). Evita marcas reales.
- **Lenguaje de corte boxy 2026** (es lo que el cliente quería: recortado, no oversize largo): «short square body ending exactly at the waist, structured shoulders, full-length sleeves» en tops; «straight-leg / barrel leg with a clean break» en pantalones.
- **Colorways:** el primer color es el principal (de él salen las referencias). Cada color extra lleva `variant`: «the same {prenda} in {color y material}, {cambios de herrajes/bordado}».
- Diseño: piezas **originales y llevables** con un detalle de concepto claro (en MUSKETEER: cuello gorguera, mangas acuchilladas, capelina desmontable…), y que se lea en todas las fotos.
- Comprueba: `npm run build` (avisa de categorías huérfanas) y `npm run images:status`.

---

## e) Casting — 4 modelos fijos, generados una vez

La coherencia del catálogo depende de que siempre sean las mismas caras. Genera los 4 modelos **antes** de cualquier foto de producto, una sola vez, y reutiliza su `job_id` como referencia en cada foto con modelo.

Params: `gpt_image_2_6`, `quality: "high"`, `resolution: "2k"`, `aspect_ratio: "4:5"` (≈ 2,75 c/u). Genera 2 candidatos por perfil y elige.

> Full-body e-commerce casting photo of a {desc}, early 20s, natural face, neutral expression, standing straight facing camera, arms relaxed, wearing a plain white crew-neck t-shirt, straight black trousers and white sneakers. Seamless pure white background, soft high-key studio light, subtle floor shadow, head to toe in frame, sharp focus, no accessories, no text.

Diversidad (MUSKETEER: chico mediterráneo, chica asiática, chica afrolatina, chico negro). Guarda en `catalog.json → models[key].job_id` y asigna `model` a cada producto repartiendo por categoría. El capítulo 06 del brand book usa estos nombres (clave capitalizada).

---

## f) Fotos de producto — protocolo (generalizado de `IMAGE_PIPELINE.md` + `IMAGE_PIPELINE_2026.md` de MUSKETEER)

### Herramientas y reglas de uso
- `generate_image_batch`: hasta **12** peticiones independientes por llamada (`{index, params}`) → `job_id`s.
- `jobs_wait`: hasta 12 ids, `timeout_seconds ≤ 15`; repetir hasta `all_terminal`; da `result_url`.
- Referencias: `medias: [{ "role": "image_references", "value": "<job_id>" }]` (un job completado es una referencia válida).
- **Nunca** pases `folder_id`, `use_unlim`, `use_free_gens` ni `count`. **Nunca** reenvíes un job cuyo resultado no conoces (cobra dos veces).
- Archivos locales como referencia (p. ej. el logo para mockups): `media_upload` → `curl -X PUT` con cabeceras `Content-Type` e `If-None-Match: *` → `media_confirm`.

### Parámetros
| Uso | Params | Coste |
|---|---|---|
| Catálogo (recomendado) | `{ "model": "gpt_image_2_6", "quality": "medium", "resolution": "2k", "aspect_ratio": "4:5" }` | ≈ 1 crédito — **suficiente para catálogo** |
| Hero / campaña / piezas estrella | igual con `"quality": "high"` | ≈ 2,75 créditos |

### Plantillas (sustituye `{…}` por los campos del producto; la redacción está validada)
**n=1 — Flat lay frontal (color principal), sin referencias**
> Professional luxury e-commerce flat lay product photo shot from directly above. {garment}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric and material texture, high-end streetwear catalog, nothing else in frame.

Joyería: «…{garment}, placed on a seamless pure white surface… ultra detailed polished sterling silver, macro product photography…», también cenital. Añade siempre: «blank woven neck label with no text; no text anywhere except the garment's own print described above».

**n=2 — Con modelo**, refs `[flat n=1, models[model].job_id]`
- garment:
> Full-body e-commerce studio photo: the exact person from image 2 (same face, hair and skin tone) now wearing the exact item from image 1 (identical colour, cut, fabric, wash, prints, text and hardware), {pose}. Boxy fit as in the reference. Seamless pure white background, soft high-key studio light, subtle floor shadow, head to toe in frame, luxury streetwear lookbook.
- accessory / jewellery:
> Close-up e-commerce studio photo: the exact person from image 2 (same skin tone, and same face if visible) wearing the exact item from image 1 (identical colour, material, shape, engraving and hardware). Framing: {pose}. Seamless pure white background, soft high-key studio light, sharp focus on the item, luxury streetwear lookbook.

**n=3 — Otra vista de la prenda sola**, refs `[flat n=1]`
> Professional luxury e-commerce product photo on a seamless pure white surface, shot from directly above: {back}. It is the exact same item as the reference image (identical colour, fabric, cut, wash, prints and hardware). Soft natural contact shadow, even diffused studio light, nothing else in frame.

**n=4 — Detalle / macro**, refs `[flat n=1]` (no en la línea 2026)
> {detail}, of the exact same item as the reference image. Soft diffused studio light, clean white background where visible, shallow depth of field, luxury catalog detail shot.

**Colores extra n=1**, refs `[flat n=1 del color principal]`
> Professional luxury e-commerce flat lay product photo shot from directly above: {variant}. Identical design, cut, proportions, prints, text placement and hardware to the reference image — only the colourway changes. Laid perfectly flat and centered on a seamless pure white surface, soft natural contact shadow, even diffused high-key studio light, nothing else in frame.

**Colores extra n=2**: plantilla «con modelo» con refs `[flat n=1 de ESE color, models[model].job_id]`.

**Lenguaje de corte (añadir a todo n=1 y n=2 de la línea actual):**
> Contemporary 2026 boxy fit: the garment keeps a square, structured shape; tops end at the waist (cropped), shoulders sit only slightly dropped, sleeves end at the right length (no bunching). Trousers are relaxed straight or barrel leg with a clean break on the shoe — never puddling or oversized.

**`prompt.seed_job`:** si existe, ese job YA es el flat lay principal: no lo regeneres; descarga su resultado (`jobs_wait` sobre ese id) y úsalo como referencia.

### Orden (máximo paralelismo, ≤ 12 por tanda)
1. **Fase A** — todos los flat lays principales (n=1).
2. **QA de los flat lays** (hoja de contacto). Regenera los fallos una vez antes de seguir: todo lo demás depende de ellos.
3. **Fase B** — todos los n=2, n=3, n=4 y los n=1 de colores extra (solo necesitan el flat principal).
4. **Fase C** — n=2 de colores extra.
5. **QA final** y reintentos (máximo 1 reintento por imagen).

Con muchos productos, reparte por categorías entre subagentes, cada uno con un **tope de créditos** y su propio manifiesto.

### Descargar y convertir
```bash
OUT=public/products/<slug>; mkdir -p "$OUT"
curl -sSf -o /tmp/<scratch>/raw.png "<result_url>"          # PNG crudos fuera del repo
convert raw.png -resize 1200x1500^ -gravity center -extent 1200x1500 -strip -interlace JPEG -quality 82 "$OUT/<color>-<n>.jpg"
npm run images:status                                      # progreso
```

### QA (mira las imágenes de verdad)
```bash
montage public/products/*/*-1.jpg -tile 6x -geometry 300x375+4+4 -label '%d' -pointsize 12 qa-flats.jpg
```
Rechaza y regenera si: fondo no blanco · n=1 no es flat lay cenital · no coincide con la descripción · la prenda cambia entre fotos (color, estampado, corte, largo) · texto inventado o mal escrito · manos/extremidades de más, caras deformes · el modelo no es el del casting · prenda cortada en el flat lay · se pierde el detalle de concepto · en la línea 2026, prenda larga u oversize.

### Manifiestos
Tras cada fase, actualiza `scripts/manifests/<worker>.json`: `{ "<ruta pública>": { "job_id": "…", "result_url": "…", "note": "opcional" } }`. Campaña, mockups y regeneraciones reutilizan esos jobs como referencias. (La plantilla no trae manifiestos: se crean por marca.)

---

## g) Campaña — `src/data/campaign.json`

| Clave | Archivo | Tamaño final | Formato de generación |
|---|---|---|---|
| `hero.desktop` | `/campaign/hero.jpg` | 2400 × 1350 | 16:9, high |
| `hero.mobile` | `/campaign/hero-mobile.jpg` | 1200 × 1500 | 4:5, high |
| `banners[]` (ids `chaquetas`, `joyeria`, `punto`) | `/campaign/banner-<id>.jpg` | 1200 × 1500 | 4:5 |
| `banners[]` id `wide` | `/campaign/banner-wide.jpg` | 2400 × 1029 | 21:9 |
| `lookbook[]` (8, con `title` y `pieces` = slugs del look) | `/campaign/look-0N.jpg` | 1200 × 1500 | 4:5 |
| `maison` (imagen de `/nosotros`; la clave conserva el nombre de MUSKETEER) | `/campaign/about.jpg` | 1800 × 1200 | 3:2 |
| `heroClassic` | opcional, hero alternativo | — | — |

Los `id` de banners se usan en `brand.home.split`, `home.feature.banner`, `home.wide.banner` y `megaMenu.shopBanners`.

Refs: los 4 `models[].job_id` + los flat lays de las piezas que salen (máx. 4–5 refs por imagen; nombra cada una en el prompt: «the person from image 1 wears the jacket from image 3»).
> Editorial fashion campaign photo for a streetwear brand: {escena concreta: patio de piedra al sol, escalinata, azotea…}. The people from images 1–4 (same faces) wear the exact garments from images 5–8 ({quién lleva qué}). Natural light, 35 mm film look, candid but composed, contemporary boxy cropped fits, no logos except the garments' own, no text, no extra people.

Revisa gente de fondo, manos y que la ropa coincida con el catálogo (en MUSKETEER hubo que borrar dos figuras del fondo del hero). Hero de escritorio: deja aire abajo en el centro para el botón «Comprar».

---

## h) Brand Book (`/brand`) + PDF

Todo el texto está en `brand.brandBook` (portada, índice, manifiesto, principios, logotipo, símbolos, matriz de uso, color, tipografía, fotografía, voz, aplicaciones, web, contacto); `src/app/brand/data.js` solo lo deriva. Colores, contraste, paleta de producto (cruza con los `hex` del catálogo), casting y fotos salen solos del catálogo.

**Mockups** (`public/brand/mockups/<file>.jpg`, lista en `brandBook.applications.mockups`): storefront y garment-box 1800 × 1200 (3:2), el resto 1440 × 1800 (4:5). Genera con GPT Image 2.6 high usando como referencia el PNG del logo (rasteriza `wordmark-black.svg`, `wordmark-white.svg`, `emblem-black.svg`, `seal-black.svg`, `monogram-black.svg` y súbelos con `media_upload`). Frases que funcionaron:
> …apply the exact logo from the reference image, unchanged, same letterforms and proportions, no added or altered letters. No other text, no other logos. Seamless pure white background edge to edge, no vignette, no dark border, no frame.

**PDF** (A4 apaisado, una hoja por página; el CSS de impresión ya está):
```bash
NEXT_DIST_DIR=.next-pdf npx next build && NEXT_DIST_DIR=.next-pdf npx next start -p 3200   # servidor aparte
npm i -D playwright && npx playwright install chromium                                    # una vez
node scripts/export-brandbook-pdf.mjs http://localhost:3200/brand public/brand/brandbook.pdf
npm run build     # para que aparezcan los enlaces «PDF» del brand book y del pie
```

---

## i) Build, ejecución y despliegue

```bash
npm run build && npm start        # producción local en :3100
```
Antes de entregar: capturas a **1440 px y 390 px** de `/`, `/tienda`, una ficha y `/brand` (Playwright), y revísalas.

**Vercel:** proyecto nuevo importando el repo, **Root Directory = la carpeta de la marca** (p. ej. `nuevamarca/`), framework Next.js, comandos por defecto. Variable `NEXT_PUBLIC_SITE_URL=https://<dominio>` (canonical/OG). `next.config.mjs` ya fija `outputFileTracingRoot` y `postcss.config.mjs` vacío para no heredar la config del repo padre.

La tienda **nunca cobra**: el checkout valida todo y termina en el aviso de `brand.checkout` (modo demostración). Conectar pagos reales (Stripe, Shopify…) es un proyecto aparte.

---

## Costes reales (aprendidos en MUSKETEER) y presupuesto

| Modelo | Calidad / resolución | Créditos por imagen | Uso |
|---|---|---|---|
| GPT Image 2.6 | high · 2k | **≈ 2,75** | Casting, campaña, mockups, finalistas de logo |
| GPT Image 2.6 | medium · 2k | **≈ 1** | **Catálogo** (calidad suficiente) y exploración de lettering |
| Recraft V4.1 (vector) | 2k | **≈ 10** | Solo el símbolo finalista |
| Recraft V4.1 (vector) | 1k | bastante menos (compruébalo con `balance` en la 1ª tanda) | Exploración de símbolos |

**Fotos por producto** (2 colores de media): protocolo 2026 = 3 + 2 = **5 imágenes**; protocolo clásico = 4 + 2 = **6**. Cuenta un **+15 %** de reintentos.

| Catálogo | Protocolo 2026 · medium | Clásico 4+2 · medium | Clásico 4+2 · high |
|---|---|---|---|
| 20 productos | 100 img → ≈ 115 cr | 120 img → ≈ 140 cr | ≈ 380 cr |
| **40 productos** | **200 img → ≈ 230 cr** | 240 img → ≈ 275 cr | ≈ 760 cr |
| 60 productos | 300 img → ≈ 345 cr | 360 img → ≈ 415 cr | ≈ 1140 cr |

**Lanzamiento completo de 40 productos (orientativo):**

| Partida | Detalle | Créditos |
|---|---|---|
| Logo — lettering | 3 rondas × 12 en medium + 6 finalistas en high | ≈ 36 + 17 = 53 |
| Logo — símbolos | ~16 exploraciones Recraft a 1k + 2 finalistas a 2k | exploración + ≈ 20 |
| Casting | 8 candidatos high (se quedan 4) | ≈ 22 |
| Producto | 200 imágenes medium + 15 % | ≈ 230 |
| Campaña | 2 hero + 4 banners + 8 looks + nosotros = 15 high + reintentos | ≈ 50 |
| Mockups brand book | 8 high + reintentos | ≈ 28 |
| **Total** | | **≈ 400–450** |

Ahorros: catálogo en medium; detalle (n=4) solo en piezas que lo merecen; colores extra con 2 fotos; Recraft a 1k hasta el final; no regenerar más de una vez (si falla dos veces, reescribe el prompt).

---

## Checklist final
- [ ] `brand.js` sin «BRAND», «Your tagline», «Your motto», «Your sign-off», «Tu ciudad», `B00000000` ni `brand.example` (`grep -rn "Your tagline\|BRAND\b\|brand.example" src`).
- [ ] `campaign.json`: título del banner `wide` y `alt` reales.
- [ ] Logos reales en `public/brand/` + `npm run logos`; `brandBook.wordmark` ajustado.
- [ ] `npm run images:status` sin faltas (o asumidas).
- [ ] `npm run build` limpio, capturas revisadas a 1440/390.
- [ ] PDF exportado, mockups generados.
- [ ] Vercel: Root Directory correcto y `NEXT_PUBLIC_SITE_URL`.
