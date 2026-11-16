# ÓRBITA — Brief de marca y del proyecto

## Concepto
- **Nombre:** ÓRBITA · **marca corta:** ORB · **SKU:** `ORB-001-…` · **storage:** `orbita`
- **En una frase:** streetwear unisex inspirado en la carrera espacial de los sesenta (NASA y cosmonautas, control de misión, cápsulas, trajes espaciales), cortado en siluetas boxy de 2026 y con mucho color.
- **Lemas:** *Fuera de órbita* (principal) · *Misión permanente* (secundario) · *Diez, nueve, ocho…* (cuenta atrás) · *Cambio y corto* (cierre)
- **Ciudad:** Madrid (40°25′ N · 3°42′ O)
- **Modelo de negocio:** catálogo permanente, sin drops.
- **Tono de voz:** optimista, preciso, un poco poético con el espacio. Español, sin emojis ni signos de exclamación.

## Producto
- **Cortes:** boxy recortado 2026 (tops que terminan en la cintura, hombro estructurado; pantalón recto, barril o acampanado con caída limpia).
- **Categorías:** chaquetas, punto, sudaderas, camisetas, camisas, pantalones, accesorios, joyería (8 × 8 = 64 productos).
- **Detalle de concepto:** cada pieza lleva un elemento de la era espacial legible en la foto (bolsillos de bolígrafo, fuelles de traje EVA, parches de misión, planetas, constelaciones, plata lunar).
- **Fotos:** 2 por producto (1 flat lay · 2 con modelo), 4 modelos fijos (Astrid, Rohan, Ama, Kai). Ver `scripts/IMAGE_PIPELINE.md`.

## Sistema de logo (tipográfico, generado con `scripts/placeholder-logos.py` + Syncopate Bold)
| Pieza | Variante `<Logo>` | Qué es |
|---|---|---|
| Logotipo | `wordmark` | ÓRBITA con tilde, Syncopate Bold, tracking +0,02 em |
| Marca corta | `monogram` | ORB con un planeta (punto) dentro de la O |
| Marca gráfica | `graphic` | ÓRBITA rodeada por un anillo orbital con satélite (solo prenda/campaña) |
| Símbolo | `emblem` | Órbita elíptica a −24° con planeta y satélite (favicon, placeholders) |
| Sello | `seal` | ÓRBITA · FUERA DE ÓRBITA · MADRID · EST. 2026, con el símbolo en el centro |

Regenerar: `python3 scripts/placeholder-logos.py --name "ÓRBITA" --short ORB --tagline "Fuera de órbita" --year 2026 --city Madrid --font <Syncopate-Bold.ttf> && npm run logos`

## Paleta
| Token | Nombre | Hex | Rol |
|---|---|---|---|
| `ink` | Tinta Noche | `#0E1A3A` | Texto, logo, botones, hero |
| `paper` | Blanco Puro | `#FFFFFF` | Fondo |
| `fog` | Blanco Traje | `#F4F2EC` | Superficies suaves, placeholders |
| `bone` | Azul Cielo | `#A9C6E8` | Bloques editoriales, newsletter |
| `steel` | Plata | `#C3C7CC` | Metal, secundario |
| `accent` | Naranja Seguridad | `#FF5A1F` | Firma de la marca, CTA |
| `mustard` | Mostaza Cápsula | `#E2A72E` | Insignias, etiquetas |
| `alert` | Rojo Cósmico | `#D7263D` | Avisos |

Paleta de producto (brand book): las anteriores + Verde Vuelo `#6B7148` y Gris Lunar `#9EA1A5`.

## Tipografía
- Display: **Syncopate** 700 (titulares, siempre en mayúsculas) · UI/cuerpo: **Space Grotesk** · Acento/telemetría: **Space Mono**. Ver `src/config/fonts.js`.

## Campaña
- Sin presupuesto para fotos de campaña: hero tipográfico (wordmark naranja sobre Tinta Noche, cuenta atrás y una tira de «monitores» con fotos de producto con modelo); banners, lookbook y «Nosotros» usan las fotos `-2.jpg` del catálogo. Ver `src/data/campaign.json`.
- Brand book: sin mockups fotográficos; el capítulo 08 dibuja aplicaciones tipográficas con los SVG del logo (`brandBook.applications.typographic`).
