---
name: nueva-marca-tienda
description: Monta una tienda online de ropa high-end para una marca nueva (logo, catálogo, fotos de producto con Higgsfield, campaña, brand book y web) a partir de la plantilla probada con MUSKETEER. Úsala cuando el usuario pida crear otra marca de ropa, otra tienda "como la de MUSKETEER / Cold Culture", o reutilizar la plantilla de la web.
---

# Nueva marca desde la plantilla `templates/streetwear-store`

La web de MUSKETEER (`musketeer/`) es la referencia viva; la plantilla neutra está en `templates/streetwear-store/` y su guía completa en `templates/streetwear-store/TEMPLATE.md`. Léela entera antes de empezar.

## Flujo
1. **Copiar la plantilla** a una carpeta nueva con el nombre de la marca (`cp -r templates/streetwear-store <marca>`; sin `node_modules`/`.next`). Nunca edites `musketeer/` ni la plantilla para una marca nueva.
2. **Brief** con el usuario: nombre, concepto, referentes, cortes (por defecto boxy recortado 2026 + color, no oversize largo), categorías y presupuesto de créditos. Rellena `src/config/brand.js` y `BRIEF.md`.
3. **Logo** con Higgsfield: rondas de exploración numeradas en hojas de contacto (GPT Image 2.6 para tipografía, Recraft V4.1 `vector` para símbolos — a 2k cuesta ~10 créditos, explora a 1k). El usuario elige; vectoriza con `scripts/vectorize.py` y regenera `logoData.js` con `scripts/build-logo-data.mjs`.
4. **Catálogo** en `src/data/catalog.json` (schema y campos `prompt` en TEMPLATE.md). Prioriza piezas originales y llevables con un detalle de concepto claro.
5. **Casting fijo** de 4 modelos (una vez) y **fotos de producto** según el protocolo de TEMPLATE.md: 1ª flat lay cenital sobre blanco, 2ª con modelo, 3ª espalda, 4ª detalle. GPT Image 2.6 `medium` 2k (~1 crédito) basta para catálogo; `high` (~2.75) para campaña/hero. Paraleliza con subagentes por categoría, cada uno con tope de créditos, y revisa siempre hojas de contacto antes de dar nada por bueno.
6. **Campaña** (hero escritorio + móvil, banners, lookbook) usando el casting y los flat lays como referencias.
7. **Brand book** (`/brand`) + mockups con el logo real como referencia + export PDF con Playwright en un servidor aparte.
8. `npm run build`, capturas a 1440/390, commit, y despliegue (proyecto Vercel con Root Directory = carpeta de la marca).

## Reglas aprendidas
- Controla el gasto con `balance` antes y después de cada tanda y díselo al usuario.
- Nunca subas piezas con texto mal escrito, manos deformes o prendas que cambian entre fotos: regenera una vez.
- La web nunca cobra: el checkout está en modo demostración.
