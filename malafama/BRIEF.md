# MALA FAMA — Brief de marca y del proyecto

## Concepto
- **Nombre:** MALA FAMA (texto corrido: Mala Fama) · **marca corta:** MF
- **En una frase:** conjuntos de chándal Y2K a juego —sudadera boxy recortada y pantalón extra ancho— en felpa lavada, con paneles tribales, aerógrafo, pedrería y colores de mono de carreras, hechos en Madrid.
- **Lemas:** *Que hablen* (principal) · *Mejor mala fama que ninguna* (secundario) · *Hecho en el barrio* (cierre)
- **Historia:** «Nos llamaban mala fama por cómo íbamos vestidos. Nos quedamos con el nombre.»
- **Referentes de energía (no copiar):** chándal a juego de plaza y cercanías, Y2K de principios de los 2000, tatuaje de flash antiguo (corazón en llamas, daga, espinas), tribal de los 90, monos de carreras, joyería de plata maciza.
- **Público:** 18–30, calle, unisex en casi todo.
- **Modelo de negocio:** catálogo permanente, sin drops ni cuentas atrás. Lo que funciona se repone.
- **Tono de voz:** calle, seguro, español de España, frases cortas. Tuteo. Sin emojis ni signos de exclamación. Sin jerga impostada («bro», «brutal», «outfit»).

## Producto
- **Pieza estrella:** el **conjunto** (sudadera/zip hoodie/chaqueta + pantalón en la misma felpa, lavado y detalle). Se vende completo, en una talla. Va primero en la navegación, en la home y en la tienda.
- **Cortes:** arriba boxy recortado (termina en la cintura, capucha alta, bajo fruncido); abajo extra ancho, balloon, acampanado o paracaídas, que cae sobre la zapatilla.
- **Categorías (slugs de `catalog.json`):** conjuntos, sudaderas, pantalones, camisetas, punto, chaquetas, accesorios, joyeria.
- **Rango de precios:** 22 € (calcetines) – 229 € (plumífero). Conjuntos 135–175 €.
- **Detalle de concepto** que debe leerse en cada pieza: paneles tribales/llamas, aerógrafo, pedrería, puff print, bordado en cadeneta, colour blocking racing, caligrafía «Mala Fama» o monograma gótico «MF».
- **Tallas:** tops XS–XXL; pantalones XS–XXL por cintura; anillos 10–20 (tallaje español); resto talla única.
- **Envíos:** estándar 4,95 €, gratis desde 100 €; express 9,95 €. Devoluciones gratuitas en 30 días. Código de bienvenida `QUEHABLEN` (10 %).

## Sistema de logo (tipográfico, dibujado en local)
| Pieza | Variante `<Logo>` | Archivo | Dibujo | Uso |
|---|---|---|---|---|
| Logotipo | `wordmark` | `public/brand/wordmark*.svg` | «Mala Fama» en Pinyon Script, perfiles finos engrosados | Header, pie, etiquetas, packaging |
| Marca corta | `monogram` | `public/brand/monogram*.svg` | «MF» en UnifrakturMaguntia | Bordado en el pecho, joyería, redes |
| Marca gráfica | `graphic` | `public/brand/graphic*.svg` | «Mala ✦ Fama» gótica en arco | Solo prenda (espalda) y campaña |
| Símbolo | `emblem` | `public/brand/emblem*.svg` | Daga tribal en llamas (sin texto) | Favicon, herrajes, separadores, placeholders |
| Sello | `seal` | `public/brand/seal*.svg` | «MALA FAMA ✦ MADRID ✦ 2026» alrededor del MF | Packaging, parche, newsletter, certificados |

Se generan con `scripts/placeholder-logos.py` (Pillow + potrace, fuentes en `brand-source/fonts/`) y `npm run logos`. Sin créditos de generación de imagen.

## Paleta
| Nombre | Hex | Token | Rol |
|---|---|---|---|
| Asfalto | `#111111` | `--ink` | Texto, logotipo, botones, bloques de noche |
| Papel | `#FFFFFF` | `--paper` | Fondo de la tienda (las fotos son sobre blanco) |
| Niebla | `#F4F2EE` | `--fog` | Superficies suaves |
| Crudo | `#EDE6DA` | `--bone` | Bloques editoriales, texto sobre Asfalto |
| Cromo | `#C7C9CC` | `--steel` | Plata 925, metal, secundario sobre oscuro |
| Burdeos | `#6E2430` | `--accent` | Acento de marca: barra de avisos, cintas, detalles |
| Cobalto | `#2E4FA3` | `--alert` | Segundo acento: avisos, errores, la pieza rara |

Fichas de producto en `#F2F2F2` con las fotos en *multiply*.

## Tipografía
- **UnifrakturMaguntia** (gótica): monograma y titulares grandes, siempre en minúscula con mayúscula inicial.
- **Archivo** (variable, eje `wdth`): interfaz y cuerpo; titulares de interfaz en condensada negra (anchura 70, peso 800) y mayúsculas.
- **Pinyon Script** (caligrafía copperplate): firma y lemas, frases cortas en tamaños generosos.
Cargadas con `next/font/google` en `src/config/fonts.js`.

## Fotografía (de `scripts/IMAGE_PIPELINE.md`)
- 64 productos × 2 fotos, un color cada uno, 4:5 · 1200 × 1500, GPT Image 2.6 medium 2k.
- **1ª flat lay** cenital sobre blanco puro (conjuntos: las dos piezas lado a lado) · **2ª con modelo** de cuerpo entero sobre blanco, con un look Y2K completo (zapatilla gorda, plata, gafas envolventes…).
- Casting fijo de 4 modelos: **Dani** (chico mediterráneo, rapado con línea), **Nia** (chica negra, trenzas), **Leo** (chico latino, mullet rizado), **Yuna** (chica asiática, flequillo cortina).
- Sin campaña generada: hero, banners, lookbook y «Nosotros» reutilizan las fotos con modelo (`-2.jpg`).
- QA: texto «Mala Fama», «MF» y «09» bien escrito; sin logos de terceros; la prenda idéntica entre fotos.

## Presupuesto de créditos Higgsfield
- Tope total de la marca: 160 créditos (4 castings + 128 fotos de producto + reintentos). Logos, campaña y mockups: 0 créditos (tipográficos / reutilizados).
