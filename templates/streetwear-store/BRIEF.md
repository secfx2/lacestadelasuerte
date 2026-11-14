# BRAND — Brief de marca y del proyecto

> Rellena este documento con el cliente antes de tocar `src/config/brand.js`. Ejemplo completo: `musketeer/BRIEF.md`.

## Concepto
- **Nombre:** BRAND · **marca corta:** BRND
- **En una frase:** …
- **Lemas:** *Your tagline* (principal) · *Your motto* (secundario) · *Your sign-off* (cierre)
- **Referentes de energía (no copiar):** …
- **Público:** …
- **Modelo de negocio:** catálogo permanente, sin drops (por defecto) / drops
- **Tono de voz:** sobrio, seguro… Sin emojis ni signos de exclamación.

## Producto
- **Cortes:** boxy recortado 2026 (tops que terminan en la cintura, hombro estructurado; pantalón recto/barril con caída limpia) + color.
- **Categorías:** chaquetas, punto, sudaderas, camisetas, camisas, pantalones, accesorios, joyería (ajusta `brand.categories`).
- **Rango de precios:** …
- **Detalle de concepto** que debe leerse en cada pieza: …

## Sistema de logo
| Pieza | Variante `<Logo>` | Archivo | Uso |
|---|---|---|---|
| Logotipo | `wordmark` | `public/brand/wordmark*.svg` | Header, pie, etiquetas, packaging |
| Marca corta | `monogram` | `public/brand/monogram*.svg` | Bordados pequeños, joyería, redes |
| Marca gráfica | `graphic` | `public/brand/graphic*.svg` | Solo prenda y campaña |
| Símbolo | `emblem` | `public/brand/emblem*.svg` | Favicon, herrajes, placeholders |
| Sello | `seal` | `public/brand/seal*.svg` | Packaging, newsletter, certificados |

Fuentes del logo y exploración: `brand-source/` (no se publica).

## Paleta
| Nombre | Hex | Rol |
|---|---|---|
| Tinta | `#0A0A0A` | Texto, logo, botones |
| Papel | `#FFFFFF` | Fondo |
| Niebla | `#F4F4F2` | Superficies suaves |
| Hueso | `#ECE8E1` | Bloques editoriales |
| Acero | `#9A9DA1` | Metal, secundario |
| Acento | `#33415C` | Acento de marca |
| Alerta | `#8E2A2A` | Rebajas, avisos |

## Tipografía
- Sans: Archivo (UI, titulares expanded) · Serif: Instrument Serif (lema, citas). Ver `src/config/fonts.js`.

## Fotografía
- 1ª flat lay cenital sobre blanco · 2ª con modelo sobre blanco · 3ª espalda/otra vista · 4ª detalle. 4:5, 1200 × 1500.
- Casting fijo de 4 modelos (`catalog.json → models`).

## Presupuesto de créditos Higgsfield
- Total aprobado: … créditos (ver tabla en `TEMPLATE.md`).
