# ESTUDIO — taller privado de marcas

App web (Next.js 15.5, React 19, JS, CSS Modules), protegida con contraseña y en español, para crear marcas de ropa: nombres, logos, ideas de prendas, fotos de producto (flat lay y con modelo), la vista previa en la tienda de la marca y propuestas para el catálogo. Está pensada para el móvil y también va bien en escritorio.

Se despliega como un proyecto de Vercel independiente, con **Root Directory = `estudio`**.

## Qué hace

| Herramienta | Qué hace | Coste |
|---|---|---|
| **Nombres de marca** | Idea + referencias + cantidad (8/12/20) + idioma + estilo → fichas con nombre, por qué funciona, ambiente, lema, @usuario, dominio y aviso de registro. Historial, favoritos y «Generar logo con este nombre». | Texto (Claude) |
| **Logos** | Nombre + estilos (wordmark, monograma, emblema, gótico, script…) + referencias → logo plano sobre blanco, 1:1, 1–4 variantes. Opción vectorial (Recraft). | ≈0,5 créditos (vector ≈10) |
| **Ideas de ropa** | Tema + número + mezcla de categorías → Claude propone fichas editables (nombre, categoría, descripción, prompt en inglés) → «Generar imágenes» de las elegidas (2K, 4:5). | Ideas: texto · fotos ≈1 crédito |
| **Prenda concreta** | Descripción libre + referencias + tipo (flat lay / con modelo / ambas). «Mejorar prompt» (Claude) lo pasa a un prompt preciso en inglés. La foto con modelo usa el flat lay + un casting (8 castings fijos en `public/castings`). | ≈1 crédito por foto |
| **Vista en la web** | Maqueta fiel a la ficha de producto y a la rejilla de la tienda de cada marca (paleta, tipografías, logotipo real), con tu prenda entre productos reales. Campos editables y vista escritorio/móvil. | Gratis |
| **Galería** | Todo lo generado: filtros por herramienta, marca y favoritos, notas, descarga, borrar (también del almacén) y «usar como referencia». | — |
| **Propuestas** | Propuestas para el catálogo de una marca (estado nueva/aprobada/descartada) y exportación a JSON con el esquema de `<marca>/src/data/catalog.json`. | — |
| **Guía** | Cómo pedir buenas imágenes, ejemplos y cómo funcionan los créditos. | — |
| **Uso y límite** · **Ajustes** | Consumo de hoy y de los últimos 7 días, saldo del plan · conexión con Higgsfield, modelos por tipo de imagen y estado del servidor. | — |

El selector **Marca** (MUSKETEER, ÓRBITA, MALA FAMA, PECADO, Marca nueva) añade a los prompts el estilo de la marca: paleta, corte y dirección de foto (PECADO: flat lay en blanco y modelo frente a pared de hormigón; el resto, estudio blanco).

Cada resultado tiene: descargar, favorito, usar como referencia, ver en la web y proponer al catálogo (y «Foto con modelo» para los flat lays).

## Cómo se generan las imágenes

**Por defecto: la cuenta de Higgsfield del propietario por MCP (créditos de su plan).**

1. El propietario entra en **Ajustes → Conectar Higgsfield** (una sola vez).
2. Se abre el inicio de sesión de Higgsfield, aprueba el acceso y vuelve a Ajustes con la cuenta conectada.
3. A partir de ahí, la otra persona solo usa la app: cada imagen se paga con los créditos del plan de esa cuenta.

Detalles técnicos: registro dinámico de cliente OAuth en `https://mcp.higgsfield.ai/oauth2/register`, código de autorización con PKCE (S256), scopes `openid email offline_access`. Los tokens se guardan **cifrados (AES-256-GCM, clave derivada de `SESSION_SECRET`)** en `secure/hf-oauth.json` del almacén y se renuevan solos antes de caducar o tras un 401. Nunca llegan al navegador. «Desconectar» los borra.

Herramientas del MCP que se usan: `generate_image` con `get_cost: true` (coste sin generar), `generate_image_batch` (envío, siempre con `use_unlim: false` para gastar créditos), `jobs_wait` (sondeo, 10 s por llamada), `media_import_url` (referencias subidas y castings, que se importan una vez y se cachean) y `balance` (saldo). Los resultados se copian a nuestro almacén al terminar (Higgsfield los borra a los 7 días) y guardan su `job_id`, que se reutiliza directamente como referencia (flat lay → foto con modelo).

Parámetros por defecto (los de las fotos de las marcas): prendas y fotos con modelo `gpt_image_2_6`, calidad `medium`, `2k`, 4:5; logos `gpt_image_2_6`, `medium`, `1k`, 1:1; logo vectorial `recraft_v4_1`, `2k`. Se pueden cambiar por tipo de imagen en Ajustes.

**Alternativa opcional: API pública de pago por uso.** Solo se usa si existen `HF_API_KEY` + `HF_API_SECRET` y la cuenta no está conectada por MCP. Factura en USD aparte del plan. Su catálogo de modelos depende de la cuenta (ver «Comprobar modelos»).

## Créditos y límite diario

- Antes de generar se muestra el coste en créditos (Higgsfield lo calcula con `get_cost`; se cachea por día y configuración).
- **`DAILY_CREDIT_LIMIT`** (por defecto 500) en créditos reales del plan. Cada envío reserva sus créditos en `usage/<AAAA-MM-DD>.json` (día de Madrid) **antes** de llamar a Higgsfield; si el total superase el límite, se rechaza con un mensaje claro. La comprobación es atómica (ETag) para que dos envíos simultáneos no se cuelen.
- Los trabajos que terminan en `failed` / `nsfw` o que Higgsfield rechaza al enviarlos **devuelven sus créditos** en el libro.
- `DAILY_USD_LIMIT` (opcional) limita además el gasto en USD estimado (solo aplica a la API de pago por uso, que tiene `/estimate`).
- El texto con Claude no gasta créditos; su coste aproximado en USD (por tokens) aparece en «Uso y límite».
- Máximo 4 imágenes por petición y 8 prendas por envío.

## Variables de entorno

| Variable | Obligatoria | Para qué |
|---|---|---|
| `STUDIO_PASSWORD` | Sí | Contraseña de acceso (pantalla `/login`). |
| `SESSION_SECRET` | Muy recomendable | Firma la cookie de sesión y cifra los tokens de Higgsfield. Una cadena larga aleatoria (`openssl rand -hex 32`). Si falta se deriva de `STUDIO_PASSWORD`; entonces cambiar la contraseña obliga a reconectar Higgsfield. |
| `BLOB_READ_WRITE_TOKEN` | Sí en producción | Vercel Blob (almacén **público**): referencias, imágenes, trabajos, propuestas, uso, ajustes y tokens cifrados. Sin él se usa `.mockdata/` en local (solo pruebas). |
| `ANTHROPIC_API_KEY` | Para las funciones de texto | Nombres de marca, ideas de ropa y «Mejorar prompt» (modelo `claude-opus-5-5`). |
| `PUBLIC_BASE_URL` | Recomendable | URL pública fija (p. ej. `https://estudio.vercel.app`). Se usa para el `redirect_uri` de OAuth y las URLs absolutas de los castings. Si falta se usa el host de la petición. |
| `DAILY_CREDIT_LIMIT` | No (500) | Límite diario en créditos. |
| `DAILY_USD_LIMIT` | No | Límite diario en USD estimados (solo API de pago por uso). |
| `ADMIN_PASSWORD` | No | Si se define, conectar Higgsfield y cambiar modelos en Ajustes exige esta segunda contraseña (solo propietario). |
| `HF_API_KEY`, `HF_API_SECRET` | No | Alternativa: API pública de Higgsfield (pago por uso en USD). |
| `MOCK_MODE` | No | `1` = todo simulado (Higgsfield y Claude), sin coste. Solo para pruebas. |
| `HF_MCP_URL`, `HF_MCP_AUTH_ISSUER` | No | Para cambiar el servidor MCP (`https://mcp.higgsfield.ai/mcp`) o el emisor OAuth (`https://mcp.higgsfield.ai`). |

## Despliegue en Vercel

1. Nuevo proyecto desde este repositorio, **Root Directory: `estudio`**, framework Next.js.
2. Storage → crea un **Blob store público** y conéctalo (añade `BLOB_READ_WRITE_TOKEN`).
3. Añade `STUDIO_PASSWORD`, `SESSION_SECRET`, `ANTHROPIC_API_KEY`, `PUBLIC_BASE_URL` (y opcionalmente `ADMIN_PASSWORD`, `DAILY_CREDIT_LIMIT`).
4. Despliega, entra con la contraseña y ve a **Ajustes → Conectar Higgsfield**.
5. Pulsa **Comprobar modelos**: debe salir el coste (✓) de cada tipo de imagen. Si algo sale ✗, se muestra el error exacto de Higgsfield.

Las rutas de generación y texto declaran `maxDuration` de 60–120 s (Fluid compute, por defecto en proyectos nuevos).

## Comprobar modelos (Ajustes)

- **Cuenta conectada (MCP):** «Comprobar modelos» pide a Higgsfield el coste de la configuración de cada tipo de imagen y de cada modelo conocido (2K, 4:5) con `get_cost`: no genera ni gasta. Puedes elegir otro modelo (o escribir el ID de uno nuevo), la calidad, la resolución y añadir parámetros extra en JSON. En «Depuración» se ve la lista de herramientas (`tools/list`) del servidor MCP.
- **API de pago por uso:** llama a `POST /estimate/<modelo>` de cada candidato con un cuerpo de ejemplo y marca disponible ✓ / no disponible ✗ con su precio en USD y el texto de error crudo (útil para corregir nombres de parámetros). Se elige el modelo activo por tipo y se pueden añadir modelos propios (ruta, nombre de los parámetros de imagen/aspecto/resolución, JSON extra, créditos por imagen).

## Estructura

```
estudio/
  middleware.js (en src/)        puerta de contraseña: cookie HMAC en todas las páginas y /api/*
  public/castings/*.jpg          8 castings (1200x1500): dani, nia, leo, yuna (estudio blanco, MALA FAMA)
                                 · rizo, sombra, vera, lux (pared de hormigón, PECADO)
  src/config/
    brands.js                    marcas: paleta, fuentes, estilo para prompts, tallas, productos reales de muestra
    brandFonts.js                fuentes de las 4 marcas (next/font) para la vista previa
    castings.js · prompts.js     castings y plantillas de prompt (protocolo IMAGE_PIPELINE de las marcas)
    models.js                    roles, modelos del MCP y registro de la API alternativa
  src/lib/
    hf/index.js                  elección de proveedor (simulado · MCP · API) — único punto de entrada
    hf/mcp.js · hf/oauth.js      cliente MCP (SDK oficial) y OAuth con PKCE + tokens cifrados
    hf/api.js · hf/mock.js       API pública alternativa · simulación (MOCK_MODE)
    generation.js                coste → límite → trabajos → referencias → envío → sondeo → copia → devoluciones
    claude.js · mockText.js      texto con Claude (salidas estructuradas zod) · simulación
    storage.js                   Vercel Blob o .mockdata local (misma interfaz, escrituras con ETag)
    usage.js · settings.js · jobs.js · proposals.js · catalogExport.js
  src/app/(studio)/              páginas: nombres, logos, ideas, prenda, vista, galeria, propuestas, guia, uso, ajustes
  src/app/api/                   rutas del servidor
```

Datos en el almacén: `refs/` (referencias subidas, redimensionadas en el navegador a 2048 px JPEG 0,9), `outputs/` (resultados copiados), `jobs/<ts>_<tipo>_<id>.json`, `proposals/<id>.json`, `usage/<AAAA-MM-DD>.json`, `config/settings.json`, `cache/` (costes y media_ids) y `secure/hf-oauth.json` (cifrado).

## Pruebas en local

```bash
cd estudio
npm install
MOCK_MODE=1 STUDIO_PASSWORD=prueba SESSION_SECRET=algo-largo npm run dev   # http://localhost:3600
```

En `MOCK_MODE` Higgsfield y Claude devuelven resultados simulados (fotos reales de las tiendas del hub, nombres de una lista fija) y, sin `BLOB_READ_WRITE_TOKEN`, todo se guarda en `.mockdata/` (ignorado por git). En Ajustes, «Conectar Higgsfield» simula la conexión. Un prompt con la palabra `FALLO` termina en error (para probar la devolución de créditos) y uno con `NSFW` en moderación.

## Notas de coste

- **Imágenes (por defecto):** créditos del **plan** de Higgsfield del propietario (≈1 crédito por foto 2K con `gpt_image_2_6` medium, ≈0,5 por logo 1K, ≈10 por logo vectorial con Recraft 2K). El coste exacto lo da la propia cuenta antes de generar.
- **API pública de Higgsfield (opcional):** saldo en **USD** aparte del plan, pago por uso; los fallidos no se cobran.
- **Claude (texto):** factura de Anthropic en USD por tokens (`claude-opus-5-5`, esfuerzo medio). Una tanda de nombres o ideas cuesta céntimos.

## Pendiente de verificar con la cuenta real

- La forma exacta de las respuestas de las herramientas del MCP (`jobs`, `result_url`, coste de `get_cost`, `media_id`) se ha programado a partir de sus esquemas y se lee de forma tolerante; cualquier respuesta inesperada se muestra tal cual en «Detalle técnico».
- Modelos del MCP distintos de `gpt_image_2_6` y `recraft_v4_1` están marcados «sin verificar».
- En la API pública, los modelos «documentados» salen de docs.higgsfield.ai (no garantiza acceso de la cuenta); los «sin verificar» son nombres supuestos. Usa «Comprobar modelos».
