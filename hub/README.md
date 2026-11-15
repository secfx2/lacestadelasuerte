# hub — todas las propuestas en un solo proyecto de Vercel

Un portal en `/` donde el cliente elige marca, y la tienda Next.js completa de cada marca bajo su propia ruta:

```
/                     portal «Propuestas» (HTML estático, sin framework)
/musketeer/…          tienda + brand book de MUSKETEER
/orbita/…             tienda + brand book de ÓRBITA
/malafama/…           …
/pecado/…             …
```

Cada marca sigue siendo una app independiente (su carpeta, su `package.json`, su despliegue normal intacto). El hub solo la **compila como export estático con `basePath`** y junta los resultados en una carpeta.

## Cómo funciona

`hub/build.sh`, para cada marca de `BRANDS` (por defecto `musketeer orbita malafama pecado`) que exista como carpeta hermana de `hub/`:

1. `npm ci --no-audit --no-fund` (o `npm install` si no hay lockfile).
2. `NEXT_OUTPUT=export NEXT_PUBLIC_BASE_PATH=/<marca> npx next build` → `<marca>/out/`.
3. Copia `out/` a `hub/dist/<marca>/` y borra `out/`.
4. Copia `dist/<marca>/index.txt` a `dist/<marca>.txt`: en modo export, el router de Next pide `<ruta>.txt` al navegar en cliente, y la portada de la marca es `/<marca>` (sin barra final), así que pide `/<marca>.txt`.

Después genera `dist/index.html` (portal) y `dist/404.html` con `scripts/render-portal.mjs` a partir de `portal/index.html`, `portal/404.html`, `portal/portal.css` y `brands.json`, **solo con las marcas que se han compilado**, y copia las fuentes y el favicon a `dist/_hub/`.

```
hub/
├── build.sh               ← build completo (local y Vercel)
├── brands.json            ← tarjetas del portal
├── vercel.json            ← cleanUrls + caché inmutable de /_next/static
├── brand-export.patch     ← cambios por marca (ver «Aplicar a otra marca»)
├── portal/                ← plantillas HTML, CSS, fuentes (Archivo + Instrument Serif, OFL) y favicon
└── scripts/render-portal.mjs
```

Variables de `build.sh`:

| Variable | Efecto |
|---|---|
| `BRANDS="musketeer orbita"` | Marcas a compilar (las que no existan se saltan con aviso). |
| `HUB_SKIP_INSTALL=1` | Reutiliza el `node_modules` existente en vez de `npm ci` (iteraciones locales). |
| `HUB_CONTINUE_ON_ERROR=1` | Si una marca falla, se salta y el resto se publica. Por defecto un fallo para el build entero. |
| `NEXT_PUBLIC_SITE_URL` | URL absoluta para canonical/OG. Si no está, en Vercel se usa `https://$VERCEL_PROJECT_PRODUCTION_URL`. |

**Servir las rutas:** con `cleanUrls`, `/musketeer/tienda` sirve `musketeer/tienda.html` y `/musketeer/` (o `/musketeer`) sirve `musketeer/index.html`. Los payloads RSC (`*.txt`) se sirven como archivos estáticos `text/plain`, que es lo que el router de Next acepta en modo export. Una ruta inexistente devuelve `dist/404.html` (404 real); si empieza por una marca, ofrece «Volver a MARCA».

## Uso local

```bash
BRANDS=musketeer bash hub/build.sh             # ~30 s para MUSKETEER (npm ci + build)
npx -y serve@14 hub/dist -l 4600               # serve aplica cleanUrls y 404.html como Vercel
# http://localhost:4600/  ·  http://localhost:4600/musketeer/
```

`hub/dist/` está en `.gitignore`. No lances el build de una marca mientras tengas su `next dev` en marcha: con `output: "export"` Next 15 compila siempre en `<marca>/.next` (un `distDir` propio solo cambia el nombre de la carpeta exportada). `build.sh` aparta un `.next` existente y lo restaura al terminar.

## Vercel (un proyecto para todo)

Proyecto nuevo importando este repo:

| Ajuste | Valor |
|---|---|
| Root Directory | `hub` |
| Include files outside the Root Directory in the Build Step | activado (por defecto): el build lee `../musketeer`, `../orbita`… |
| Framework Preset | **Other** |
| Install Command | `true` (override; cada marca instala lo suyo dentro de `build.sh`) |
| Build Command | `bash build.sh` |
| Output Directory | `dist` |
| Node.js Version | 22.x |
| Variables (opcionales) | `NEXT_PUBLIC_SITE_URL=https://<dominio>`, `BRANDS="…"`, `HUB_CONTINUE_ON_ERROR=1` |

Los proyectos de Vercel de cada marca (p. ej. MUSKETEER con Root Directory `musketeer`) siguen funcionando igual: sin `NEXT_OUTPUT` ni `NEXT_PUBLIC_BASE_PATH` el build es el de siempre (servidor Next, `next/image` optimizado).

Tamaño: cada marca ocupa lo que su `public/` más ~30 MB de HTML/RSC (MUSKETEER: 119 MB, de ellos 66 MB de fotos). Los build de Vercel no cachean el `node_modules` de las marcas, así que cada despliegue reinstala (unos segundos por marca).

## Portal: `brands.json`

Una entrada por marca, en el orden de las tarjetas:

```jsonc
{
  "slug": "orbita",                       // carpeta de la marca = ruta /orbita
  "name": "ÓRBITA",
  "tagline": "Fuera de órbita",
  "concept": "Una frase en español.",
  "hero": "products/capsule-flight-jacket/safety-orange-2.jpg",
  "heroPosition": "50% 18%",              // opcional: object-position del recorte 4:5
  "accent": "#FF5A1F"
}
```

- `hero` es una ruta **dentro del `public/` de la marca**. Puede ser una lista de candidatas: gana la primera que exista en el export (MUSKETEER usa `campaign/hero-mobile.jpg`, vertical, y cae a `campaign/hero.jpg`). Si no existe ninguna, la tarjeta pasa a un panel tipográfico con el color de acento (también si la imagen falla al cargar).
- Una marca compilada que no esté en `brands.json` aparece con valores neutros (y un aviso en el log).
- Pendiente de cerrar: el hero y el lema de PECADO (`campaign/hero.jpg` y «Y2K grunge · mall goth» son provisionales; mientras no exista la foto, panel tipográfico).

## Aplicar a otra marca (orbita, malafama, pecado…)

MUSKETEER y `templates/streetwear-store` ya están adaptados. Las marcas copiadas de la plantilla necesitan los mismos cambios. Desde la carpeta de la marca:

```bash
cd orbita

# 1) Cambios JS + src/lib/asset.js (comprueba primero que no haya "FAILED")
patch -p1 --dry-run < ../hub/brand-export.patch
patch -p1 --no-backup-if-mismatch < ../hub/brand-export.patch

# 2) CSS: las máscaras con el emblema pasan a una variable que fija el layout raíz
grep -rl 'url("/brand/emblem-black.svg")' src --include=*.css | xargs -r sed -i \
  '/--mk-emblem-url/!s#url("/brand/emblem-black.svg")#var(--mk-emblem-url, url("/brand/emblem-black.svg"))#g'

# 3) Revisión: no debe quedar ninguna URL a /public sin asset() (ver «Reglas»)
grep -rnE '<img|<video|poster=|backgroundImage|getImageProps' src --include=*.js
grep -rn 'url("/' src --include=*.css            # solo los fallbacks dentro de var(--mk-emblem-url, …)
grep -rnE '"/(products|campaign|brand|lookbook)/' src --include=*.js | grep -v 'src/data/'
```

`--dry-run` contra orbita, malafama y pecado (15-nov-2026) aplica todos los fragmentos, algunos con *fuzz* (los `layout.js` con fuente `display`). Si alguno falla por cambios posteriores, aplica el fragmento a mano; son estos:

| Archivo | Cambio |
|---|---|
| `next.config.mjs` | `NEXT_OUTPUT=export` → `output: "export"` + `images.unoptimized: true`; `basePath` desde `NEXT_PUBLIC_BASE_PATH` si no está vacío. Resto igual. |
| `src/lib/asset.js` (nuevo) | `BASE_PATH`, `asset(src)` y `assetCssVars`. |
| `src/components/shop/SmartImage.js` | `src={asset(src)}` en `<Image>`. |
| `src/components/shop/Lightbox.js` | `src={asset(src)}` y `src={asset(im)}` en los dos `<Image>`. |
| `src/components/shop/HeroImage.js` | `asset()` en los dos `getImageProps`; los `<source>` caen al `src` cuando no hay `srcSet` (imágenes sin optimizar). |
| `src/app/brand/components/SafeImage.js` | `src={asset(src)}` en `<img>`. |
| `src/app/brand/components/ChapterNav.js` | `href={asset(pdfHref)}` (PDF del brand book). |
| `src/components/shop/Footer.js` | `href={asset(l.href)}` en `FooterLink` (enlaces `file: true` y externos; `asset()` no toca `https://`). |
| `src/app/layout.js` | `icons: { icon: asset("/brand/emblem-black.svg") }` y `...assetCssVars` dentro de `paletteVars`. |
| `src/app/(shop)/layout.js` | `metadataBase: new URL(\`${brand.siteUrl.replace(/\/+$/, "")}${BASE_PATH}\`)` → canonical y `og:image` llevan `/<marca>`. |
| `src/app/(shop)/producto/[slug]/page.js` | JSON-LD: `image: product.colors[0].images.map(asset)`. |
| `*.module.css` con `url("/brand/emblem-black.svg")` | `var(--mk-emblem-url, url("/brand/emblem-black.svg"))` (paso 2; malafama tiene además `LineupHero.module.css`). |

Y además, en cada marca:

- **`storageKey` único en `src/config/brand.js`.** En el portal todas las tiendas comparten dominio y, por tanto, `localStorage`: con la misma clave, la cesta de una marca aparecería en otra. Hoy pecado sigue con `"brand"`.
- `.gitignore` de la marca con `out` y `.next-*` (la plantilla ya los tiene).
- Añadir/ajustar su entrada en `hub/brands.json`.
- Verificar: `BRANDS=<marca> bash hub/build.sh`, servir `hub/dist` y recorrer `/`, `/tienda`, una categoría, una ficha, `/brand`, `/cesta`, `/checkout` sin 404 en la consola de red (salvo fotos que aún no existan), navegar con los enlaces (sin recarga completa) y añadir a la cesta. Y que el build normal siga pasando: `NEXT_DIST_DIR=.next-check npx next build && rm -rf .next-check`.

### Reglas para código nuevo

- **`asset()`** en toda URL a `/public` que no pase por `next/link` / `router.push` / `router.replace`: `src` de `next/image` (en export las imágenes van sin optimizar y Next no antepone el `basePath` a un `src` de texto), `<img>`, `<video poster>`, `<a href>` a PDF/SVG/ZIP, `style={{ backgroundImage }}`, iconos/imágenes de metadata fuera de `metadataBase`. `asset()` no hace nada sin `basePath`, deja intactas las URL externas/`data:` y no duplica el prefijo.
- **Nunca** envuelvas en `asset()` los `href` de `next/link` ni las rutas de `router.push`: Next ya les añade el `basePath`.
- **CSS:** `url("/…")` en un CSS module no recibe el prefijo. Usa una variable fijada en el layout raíz (patrón de `--mk-emblem-url` en `assetCssVars`) o pasa la imagen como `style` desde JS con `asset()`.
- **Export estático:** nada de route handlers, middleware, `headers()`/`cookies()`, server actions, `redirects`/`rewrites`/`headers` en `next.config`, ni `searchParams` en páginas de servidor. Rutas dinámicas con `generateStaticParams` + `export const dynamicParams = false`. `useSearchParams` dentro de `<Suspense>` (como en `ShopCatalog`).
