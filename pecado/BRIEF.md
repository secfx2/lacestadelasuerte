# PECADO — Brief de marca y del proyecto (borrador)

> Nombre: **PECADO** · display **Pecado** · marca corta **PCD**. Catálogo: `drafts/marca-calle/catalog.json` (lo genera `build_catalog.py`). Sin texto de marca en las prendas, salvo un monograma «P» blackletter pequeño si se decide añadirlo más adelante.

## Concepto

Ropa de calle para los que salen del cuarto con los cascos puestos y acaban en el skatepark. Es el revival Y2K grunge / mall-goth tal como se ve hoy en TikTok, pero llevable: vaqueros ultra baggy que se comen la zapatilla, sudaderas pesadas lavadas con el bajo deshilachado y camisetas negras con prints góticos agrietados, una encima de otra. Rebelde pero no disfraz, oscura pero no friki.

El universo gráfico es iconografía de cementerio y de catedral reinterpretada como gráfico de calle: cruces aladas, filigrana, enredaderas de espinas, ángeles de piedra, llamas, calaveras con rosas y formas de logo espinosas que no se pueden leer. Todo es original y nada lleva texto legible. La paleta es casi monocroma (negro lavado, gris desteñido, índigo crudo, hueso), la plata la ponen los herrajes y la joyería, y hay un único chispazo de color por look.

## Paleta

| Nombre | Hex | Rol |
|---|---|---|
| Asfalto | `#0B0B0C` | Negro base: texto, logo, botones |
| Negro lavado | `#2B2A2D` | Superficies oscuras, denim, fondos de bloque |
| Ceniza | `#8C8A88` | Gris desteñido, texto secundario |
| Índigo crudo | `#1F2A44` | Denim crudo, acento frío |
| Hueso | `#E9E2D3` | Fondo editorial, pespunte, packaging |
| Burdeos | `#4A1015` | Acento de marca (enlaces, etiquetas, rebajas) |
| Plata | `#BFC2C6` | Metal, joyería, foil |
| *Pop* Rojo sangre | `#B3121B` | Solo en gráfico (llamas), nunca en UI |
| *Pop* Lima tóxica | `#B6F20D` | Uno o dos productos y algún sticker; nunca en texto |
| *Pop* Rosa bebé | `#F6C6D6` | Baby tee, polo; contraste puntual |
| *Pop* Azul hielo | `#9DB8C9` | Solo el conjunto Frost Thorn |

Regla: como mucho un *pop* por pantalla o por look. Fondo de la web blanco o hueso, como pide la plantilla.

## Tipografía (Google Fonts)

- **Logo y titulares:** *UnifrakturMaguntia* para el wordmark (la blackletter más clásica y afilada). *Grenze Gotisch* (variable, 100–900) para titulares grandes, porque se lee mejor y aguanta varios pesos. Alternativa más cruda: *Pirata One*.
- **UI y texto:** *Archivo* (grotesca limpia con eje `wdth`; la plantilla ya la usa para titulares en *expanded*). Alternativa: *Inter Tight*.
- La blackletter va solo en logo, titulares de sección y campaña. Precios, tallas, navegación y checkout van siempre en la grotesca.

## Logo (sin Higgsfield)

- **Wordmark:** «Pecado» compuesto en UnifrakturMaguntia y retocado a mano en vector: astas más largas, una espina en el remate de la «P» y la «d», y espaciado apretado. Versiones negra, hueso y plata.
- **Emblema:** cruz alada dentro de un anillo de espinas, construida geométricamente en SVG (cruz de brazos apuntados y dos alas simétricas de 5 plumas). Sirve para favicon, herrajes, etiqueta tejida y placeholders.
- **Monograma / marca corta:** «P» blackletter dentro del anillo de espinas, más «PCD» en grotesca expanded para etiquetas pequeñas.
- **Sello:** emblema + «PECADO» en círculo, para packaging y newsletter.
- Todo se construye con fuentes y SVG en código (`scripts/vectorize.py` / `build-logo-data.mjs` de la plantilla), sin créditos de imagen.

## Producto

- **Cortes:** vaqueros *ultra baggy* (pernera recta muy ancha, bajo de 32–36 cm, tiro medio-bajo, bolsillos traseros XL, pespunte grueso en contraste). Sudaderas pesadas de 450 g/m², boxy y cortas, con hombro caído y bajo y puños deshilachados. Tops boxy o regular a la cadera, nunca largos oversize.
- **Precios:** camisetas 35–45 €, polos y camisas 45–55 €, vaqueros 79–110 €, sudaderas 75–89 €, chándal 65–72 €, chaquetas 120–240 €, capas 22–79 €, cinturones 35–39 €, mochila 89 €, joyería 35–69 €.
- **Gráfico:** 100 % original. Nada de marcas, logos, bandas ni personajes reales. Lo que parezca texto se describe como *illegible ornamental calligraphic flourishes* o *thorny illegible death-metal style logo shapes*.

### Categorías (72 productos)

| Slug | Nombre | Nº |
|---|---|---|
| `vaqueros` | Vaqueros | 8 |
| `sudaderas` | Sudaderas | 12 |
| `chandal` | Chándal | 6 |
| `camisetas` | Camisetas | 8 |
| `polos-y-camisas` | Polos y camisas | 6 |
| `chaquetas` | Chaquetas | 8 |
| `capas` | Capas | 8 |
| `accesorios` | Accesorios | 10 |
| `joyeria` | Joyería | 6 |

- **Vaqueros:** Seraph Baggy · Thorn Vine Jean · Limbo Jean · Pyre Baggy · Rosary Jean · Crypt Double Knee · Wingspan Jean · Gutter Jort
- **Sudaderas:** Spine Hoodie · X-Ray Storm Hoodie · Flame Wash Hoodie · Frost Thorn Hoodie · Blood Vine Hoodie · Barbwire Sand Hoodie · Bleach Wing Hoodie · Phantom Full-Zip · Cathedral Hoodie · Spike Hoodie · Nightmoth Hoodie · Iron Gate Hoodie
- **Chándal:** Thornstorm Sweatpant · Bleed Marble Jogger · Ember Sweatpant · Spine Sweatpant · X-Ray Storm Jogger · Frost Thorn Sweatpant
- **Camisetas:** Second Skin Tee · Thorned Heart Baby Tee · Rosebone Raglan · Bramble Mesh Tee · Halo Foil Tee · Ashfall Tee · Venom Cross Tee · Stone Angel Tee
- **Polos y camisas:** Chapel Polo · Static Zip Polo · Lullaby Polo · Sanctuary Bowling Shirt · Vigil Camp Shirt · Veil Mesh Shirt
- **Chaquetas:** Sinner Biker · Relic Denim Jacket · Nocturne Track Jacket · Howl Collar Jacket · Briar Puffer · Sexton Work Jacket · Burnout Racer · Requiem Varsity
- **Capas:** Insomnia Stripe LS · Altar Longsleeve · Ruin Knit · Wraith Thermal · Ladder Arm Warmers · Snare Fishnet Top · Lattice Knit Vest · Litany Longsleeve
- **Accesorios:** Bone Pyramid Belt · Twin Grommet Belt · Reliquary Backpack · Grave Chain · Lurk Beanie · Acid Flame Beanie · Frayed Thorn Cap · Talisman Charm Set · Scorch Trucker · Fat Tongue Skate
- **Joyería:** Filigree Cross · Barb Chain · Spike Ring · Fallen Wing Ring · Wingheart Choker · Crosshang Hoops

Conjuntos (sudadera + chándal del mismo lavado): Spine, X-Ray Storm, Frost Thorn y Flame Wash + Ember.

## Casting fijo (4)

`rizo` (chico, rizos oscuros enormes) · `sombra` (andrógino, flequillo emo sobre un ojo, aro en el labio) · `vera` (chica, flequillo recto negro, septum) · `lux` (chica, wolf cut platino con raíz oscura, tatuajes finos). Cada uno lleva 18 productos. Todos posan con camiseta y vaquero negros lisos delante de la misma pared de hormigón (`models[key].casting_prompt`). El `job_id` se rellena al aprobar el casting.

## Dirección de foto

- **Foto 1 — flat lay** cenital sobre blanco puro sin costuras, igual que el resto de la plantilla. Si el arte está detrás (vaqueros con bolsillos traseros, Cathedral, Iron Gate, Bleach Wing, Sanctuary, Relic), el flat lay enseña la **espalda**. Los vaqueros se extienden con las perneras abiertas para que se lea el ancho.
- **Foto 2 — con modelo**, cuerpo entero contra una **pared de hormigón gris en bruto con suelo de hormigón**, luz natural suave de día nublado, encuadre frontal a la altura de los ojos, como un lookbook de calle contra la pared. Se reproduce el look completo de `prompt.pose`. Las piezas con arte trasero van de espaldas o girando la cabeza por encima del hombro.
- 4:5, 1200 × 1500, `/products/<slug>/<color>-1.jpg` y `-2.jpg`.

### Plantilla 1 — flat lay (sin referencias)

> Professional e-commerce flat lay product photo shot from directly above. {garment}, laid perfectly flat and centered on a seamless pure white surface, neatly arranged with natural soft folds. Blank woven neck label with no text; no text, numbers or logos anywhere except the design described, and any lettering-like shapes stay illegible ornamental graphics. Soft natural contact shadow, even diffused high-key studio light, ultra detailed fabric, wash, fraying and stitching texture, contemporary 2026 streetwear catalog, nothing else in frame.

Accesorios y calzado: «…{garment}, placed on a seamless pure white surface, shot from directly above / slightly above…». Joyería: macro nítido de plata de ley pulida y oxidada.
Reglas de corte: los vaqueros mantienen la pernera ultra ancha recta (bajo ≈ 34 cm, el bajo se amontona un poco, **nunca** estrechos). Los tops van boxy o regular a la cadera y las sudaderas pesadas son cortas con hombro caído, nunca largas oversize.

### Plantilla 2 — con modelo (refs: `[flat-lay job, models[model].job_id]`)

Prendas:
> Full-body street-style lookbook photo: the exact person from image 2 (same face, hair and skin tone) wearing the exact item from image 1 (identical colour, wash, cut, fabric, fraying, stitching and artwork placement) as the hero piece of a real 2026 Y2K grunge street look: {pose}. The hero piece stays fully visible and unobstructed; jeans keep their ultra-wide leg with hems stacking over the shoes; tops stay boxy or regular at the hip, never long oversized. Standing in front of a raw grey concrete wall with a concrete floor, soft overcast daylight, straight-on eye-level framing, head to toe in frame, natural soft shadows, candid street lookbook attitude, not costume. No logos, brand marks or legible text on any garment, shoe or accessory.

Accesorios / joyería (y los calentadores de `capas`, que son `kind: accessory`):
> Close-up street-style lookbook photo: the exact person from image 2 (same skin tone, and same face/hair if visible) wearing the exact item from image 1 (identical colour, material, shape and details). Framing: {pose}. Raw grey concrete wall background, soft overcast daylight, sharp focus on the item, shallow depth of field. No logos or legible text.

Parámetros fijos: `{ "model": "gpt_image_2_6", "quality": "medium", "resolution": "2k", "aspect_ratio": "4:5" }`. Hasta 12 peticiones por lote y `jobs_wait` hasta estado terminal (ver `orbita/scripts/IMAGE_PIPELINE.md`).
QA: se rechaza si el fondo no es blanco (foto 1) o no es la pared de hormigón (foto 2), si los vaqueros salen estrechos, si aparece texto o logos inventados, si se pierde el deshilachado o el lavado, si el modelo no es el del casting o si el look es genérico.

## Presupuesto de créditos (GPT Image 2.6 · medium · 2k ≈ 1 crédito/imagen)

| Partida | Imágenes | Créditos |
|---|---|---|
| Casting | 4 | ≈ 4 |
| Producto (72 × 2) | 144 | ≈ 144 |
| Reintentos | ~10 | ≈ 10 |
| **Total** | **≈ 158** | **≈ 158** |

(Con el catálogo original de 64 productos eran 4 + 128 + 10 ≈ 142. Si el casting se hace en `high`, a ≈ 2,75 por imagen, suma unos 7 créditos más.)
