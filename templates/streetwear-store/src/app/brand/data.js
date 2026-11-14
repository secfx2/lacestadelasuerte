/* ==========================================================================
   MUSKETEER — Brand Book content.
   Everything that describes the logo system lives here so the book can be
   updated when the marks change: edit WORDMARK / SYMBOLS / USAGE and the
   chapters 02–03 re-render. Logos are always drawn with <Logo variant=…/>
   (src/components/brand/Logo.js ← public/brand/*.svg); a variant listed here
   that no longer exists in logoData is skipped automatically.
   ========================================================================== */

export const EDITION = { name: "Édition 01", year: "2026", version: "1.0", date: "Noviembre 2026" };

export const CHAPTERS = [
  { id: "portada", num: "00", title: "Portada", short: "Portada" },
  { id: "manifiesto", num: "01", title: "Manifiesto", short: "Manifiesto", desc: "El código y los cuatro principios." },
  { id: "logotipo", num: "02", title: "Logotipo", short: "Logotipo", desc: "musketeer™: construcción, área de respeto, versiones." },
  { id: "simbolos", num: "03", title: "Sistema de símbolos", short: "Símbolos", desc: "msktr™, msk✦tr, la estrella de estoques y el sello." },
  { id: "color", num: "04", title: "Color", short: "Color", desc: "Paleta de marca, proporciones y paleta de producto 2026." },
  { id: "tipografia", num: "05", title: "Tipografía", short: "Tipografía", desc: "Archivo, Instrument Serif y la escala." },
  { id: "fotografia", num: "06", title: "Fotografía", short: "Fotografía", desc: "La secuencia de producto, el casting y la línea 2026." },
  { id: "voz", num: "07", title: "Tono de voz", short: "Voz", desc: "Cómo hablamos y cómo no." },
  { id: "aplicaciones", num: "08", title: "Aplicaciones", short: "Aplicaciones", desc: "Etiquetas, packaging, tienda." },
  { id: "web", num: "09", title: "Web / UI", short: "Web / UI", desc: "Componentes, retícula, tipo en pantalla." },
  { id: "contacto", num: "10", title: "Contacto", short: "Contacto", desc: "Archivos maestros y aprobaciones." },
];

/* ---------- 02 · Logotipo principal (sistema v2, 2026) ---------------------- */
export const WORDMARK = {
  variant: "wordmark",
  name: "musketeer™",
  intro:
    "musketeer™ es la firma de la casa: minúsculas, sans extendida de peso máximo e itálica, con su ™. Tiene la energía de una camiseta de club y la seguridad de un sello. Es la pieza principal del sistema y la única que puede representar a MUSKETEER sola.",
  notes: [
    { k: "Uso", v: "Cabecera y pie de la web, etiquetas, bolsas, cajas, fachada. Si solo cabe una marca, es esta." },
    { k: "Dibujo", v: "Minúsculas siempre. La inclinación y el ™ forman parte del logotipo: no se separan." },
    { k: "Archivos", v: "wordmark.svg · wordmark-black.svg · wordmark-white.svg" },
  ],
  construction:
    "Un dibujo cerrado, muy ancho y compacto. La retícula se construye con un módulo de un cuarto de su altura total (H). Las letras se tocan y la inclinación es constante; el ™ se alinea con la parte alta de la «k» y la «t». El archivo maestro no se redibuja, no se reespacia y no se recompone.",
  gridDiv: 4,
  /* Clear space: x = clearRatio × total logo height (≈ the height of the «m»), on all four sides. */
  clearRatio: 0.77,
  clearLabel: "x = altura de la «m»",
  clearText:
    "El área de respeto es x en los cuatro lados, donde x es la altura de la «m». Como el logotipo es muy ancho, esa distancia se mide siempre en vertical: ningún texto, borde ni imagen entra en la zona.",
  minSizes: [
    { k: "Digital", v: "120 px de ancho", css: "120px" },
    { k: "Impresión", v: "30 mm de ancho", css: "30mm" },
    { k: "Tejido / bordado", v: "45 mm de ancho", css: "45mm" },
  ],
  minNote:
    "Por debajo de estas medidas el ™ y los huecos de la «e» se cierran. En formatos más pequeños se usa msktr™.",
  versions: [
    { k: "Positivo", v: "Tinta sobre Papel. Versión por defecto.", bg: "var(--paper)", fg: "var(--ink)", border: true },
    { k: "Negativo", v: "Papel sobre Tinta. Packaging y piezas oscuras.", bg: "var(--ink)", fg: "var(--paper)" },
    { k: "Sobre Tabardo", v: "Papel sobre Azul Tabardo. Piezas especiales.", bg: "var(--accent)", fg: "var(--paper)" },
    { k: "Sobre Hueso", v: "Tinta sobre Hueso. Bloques editoriales.", bg: "var(--bone)", fg: "var(--ink)" },
  ],
  misuse: [
    { k: "No deformar", fx: "stretch" },
    { k: "No enderezar ni cambiar la inclinación", fx: "deslant" },
    { k: "No eliminar el ™", fx: "notm" },
    { k: "No recomponer ni pasar a mayúsculas", fx: "retype" },
    { k: "No usar colores fuera de paleta", fx: "offpalette" },
    { k: "No añadir contornos, sombras ni efectos", fx: "shadow" },
    { k: "No usar con poco contraste", fx: "lowcontrast" },
    { k: "No colocar sobre fondos con ruido", fx: "busy" },
  ],
};

/* ---------- 03 · Sistema de símbolos ---------------------------------------- */
export const SYMBOLS = [
  {
    variant: "monogram",
    name: "msktr™",
    alias: "Marca corta",
    when: "Bordados pequeños, joyería, botones, avatar en redes y cualquier formato donde musketeer™ no cabe.",
    never: "Nunca junto al wordmark en la misma cara. Nunca en mayúsculas ni sin su ™.",
    min: "40 px · 12 mm de ancho",
  },
  {
    variant: "gothic",
    name: "msk✦tr",
    alias: "Marca gráfica",
    when: "Solo gráficos de prenda y campañas: pecho, espalda, estampado, bordado grande. La estrella sustituye a la vocal.",
    never: "Nunca como firma institucional: ni en la web, ni en etiquetas, ni en packaging.",
    min: "30 mm de ancho",
  },
  {
    variant: "emblem",
    name: "Estrella de estoques",
    alias: "Símbolo",
    when: "Favicon, grabado en plata, herrajes, tiradores de cremallera y sellos pequeños. Dos estoques cruzados: la hermandad en una sola figura.",
    never: "Nunca girada ni recortada: los estoques se cruzan siempre en aspa.",
    min: "16 px · 5 mm",
  },
  {
    variant: "seal",
    name: "Sello MSKTR",
    alias: "Tous pour un · Madrid",
    when: "Pegatina de cierre, packaging, certificado de joyería y lacre. Firma el origen: Madrid.",
    never: "Nunca por debajo del tamaño en el que «Madrid» deja de leerse. Nunca recompuesto.",
    min: "64 px · 20 mm",
  },
];

/* 2 = soporte principal · 1 = permitido · 0 = no se usa */
export const USAGE_COLUMNS = ["Web / UI", "Etiqueta", "Packaging", "Bordado", "Joyería", "Prenda", "Redes"];
export const USAGE = {
  wordmark: [2, 2, 2, 1, 0, 1, 2],
  monogram: [1, 1, 1, 2, 2, 1, 2],
  gothic: [0, 0, 0, 1, 0, 2, 1],
  emblem: [1, 0, 1, 1, 2, 1, 1],
  seal: [0, 0, 2, 0, 2, 0, 1],
};
export const SYMBOL_RULES = [
  "Una sola pieza del sistema por cara visible. Nunca dos marcas juntas.",
  "musketeer™ manda: si el soporte lo admite, se usa el wordmark.",
  "msktr™ entra cuando el wordmark no cabe y en las piezas de oficio: bordado, plata, botones.",
  "msk✦tr es gráfico, no firma: vive en la prenda y en la campaña.",
  "El ™ acompaña siempre a musketeer™ y msktr™. msk✦tr, la estrella y el sello no lo llevan.",
];

/* ---------- 04 · Color ------------------------------------------------------ */
export const COLORS = [
  { name: "Tinta", token: "--ink", hex: "#0A0A0A", rgb: "10 · 10 · 10", cmyk: "60 · 40 · 40 · 100", pms: "Black 6 C", role: "Texto, logotipo, botones." },
  { name: "Papel", token: "--paper", hex: "#FFFFFF", rgb: "255 · 255 · 255", cmyk: "0 · 0 · 0 · 0", pms: "Papel sin estucar, blanco natural", role: "Fondo. Siempre blanco." },
  { name: "Niebla", token: "--fog", hex: "#F4F4F2", rgb: "244 · 244 · 242", cmyk: "3 · 2 · 3 · 0", pms: "—", role: "Superficies suaves, placeholders." },
  { name: "Hueso", token: "--bone", hex: "#ECE8E1", rgb: "236 · 232 · 225", cmyk: "6 · 7 · 10 · 0", pms: "—", role: "Bloques editoriales." },
  { name: "Acero", token: "--steel", hex: "#9A9DA1", rgb: "154 · 157 · 161", cmyk: "40 · 30 · 28 · 0", pms: "877 C (metálico)", role: "Plata. Texto secundario sobre oscuro." },
  { name: "Azul Tabardo", token: "--accent", hex: "#1F2B4D", rgb: "31 · 43 · 77", cmyk: "94 · 80 · 38 · 42", pms: "533 C", role: "Acento de marca: el tabardo." },
  { name: "Lacre", token: "--alert", hex: "#7A1F1F", rgb: "122 · 31 · 31", cmyk: "24 · 94 · 86 · 38", pms: "1815 C", role: "Acento raro: rebajas, avisos." },
];
export const PROPORTIONS = [
  { name: "Papel", token: "--paper", pct: 60 },
  { name: "Tinta", token: "--ink", pct: 28 },
  { name: "Niebla", token: "--fog", pct: 4 },
  { name: "Hueso", token: "--bone", pct: 3 },
  { name: "Acero", token: "--steel", pct: 2 },
  { name: "Tabardo", token: "--accent", pct: 2.5 },
  { name: "Lacre", token: "--alert", pct: 0.5 },
];
export const PAIRS = [
  { fg: "#0A0A0A", bg: "#FFFFFF", fgN: "Tinta", bgN: "Papel", note: "Por defecto" },
  { fg: "#FFFFFF", bg: "#0A0A0A", fgN: "Papel", bgN: "Tinta", note: "Packaging, cierre" },
  { fg: "#FFFFFF", bg: "#1F2B4D", fgN: "Papel", bgN: "Tabardo", note: "Piezas especiales" },
  { fg: "#0A0A0A", bg: "#ECE8E1", fgN: "Tinta", bgN: "Hueso", note: "Editorial" },
  { fg: "#9A9DA1", bg: "#0A0A0A", fgN: "Acero", bgN: "Tinta", note: "Plata, secundario" },
  { fg: "#FFFFFF", bg: "#7A1F1F", fgN: "Papel", bgN: "Lacre", note: "Solo avisos" },
];

/* Garment colours of the 2026 line (product, not brand): never used for UI or logo. */
export const PRODUCT_PALETTE = [
  { name: "Azul Tabardo", hex: "#2340A0" },
  { name: "Burdeos", hex: "#6E1423" },
  { name: "Verde Bosque", hex: "#1F4D3A" },
  { name: "Mantequilla", hex: "#F2D98A" },
  { name: "Azul Cielo", hex: "#A9C6E8" },
  { name: "Chocolate", hex: "#4A2C1F" },
  { name: "Cereza", hex: "#B3121B" },
  { name: "Crema", hex: "#EFE6D2" },
];

/* ---------- 05 · Tipografía ------------------------------------------------- */
export const TYPE_SCALE = [
  { k: "Display", token: "--fs-display", web: "48–140 px", spec: "Archivo Expanded 500 · 0,95 · −0,02 em", sample: "En garde.", cls: "tsDisplay" },
  { k: "XL", token: "--fs-xl", web: "28–44 px", spec: "Archivo Expanded 500 · 1,05 · −0,01 em", sample: "Chaquetas", cls: "tsXl" },
  { k: "LG", token: "--fs-lg", web: "20 px", spec: "Archivo 400 · 1,3", sample: "Felpa de 500 g/m², corte boxy.", cls: "tsLg" },
  { k: "MD", token: "--fs-md", web: "15 px", spec: "Archivo 400 · 1,45 · cuerpo", sample: "Nuestra sudadera insignia, siempre en catálogo.", cls: "tsMd" },
  { k: "SM", token: "--fs-sm", web: "13 px", spec: "Archivo 400 · 1,45", sample: "100 % algodón. Lavado vintage.", cls: "tsSm" },
  { k: "XS caps", token: "--fs-xs", web: "11 px", spec: "Archivo 400 · MAYÚSCULAS · +0,08 em", sample: "Añadir a la cesta", cls: "tsXs" },
  { k: "Micro caps", token: "--fs-micro", web: "10 px", spec: "Archivo 400 · MAYÚSCULAS · +0,22 em", sample: "Guía de tallas", cls: "tsMicro" },
];
export const TYPE_RULES = [
  { k: "Mayúsculas", v: "Siempre con tracking: +0,08 em en navegación y metadatos; +0,22 em en micro y legales. Nunca mayúsculas sin espaciar." },
  { k: "Expanded", v: "Solo titulares y frases cortas. Nunca en párrafos ni en botones." },
  { k: "Serif", v: "Instrument Serif para el lema, citas y acentos. Nunca en UI funcional ni en cuerpo largo." },
  { k: "Interlineado", v: "1,45 en cuerpo; 0,95–1,05 en titulares." },
  { k: "Alineación", v: "A la izquierda. Centrado solo en portadas, sellos y etiquetas." },
  { k: "Signos", v: "Sin signos de exclamación. Sin emojis. Comillas latinas « »." },
  { k: "Logotipo", v: "musketeer™ y msktr™ son dibujos, no tipografías. Nunca se escriben con Archivo ni con otra fuente." },
];

/* ---------- 06 · Fotografía ------------------------------------------------- */
export const PHOTO_SEQUENCE = [
  { k: "01", t: "Flat lay", v: "Siempre la primera. Prenda tendida plana, cenital, sobre superficie blanca. Sin arrugas forzadas." },
  { k: "02", t: "Con modelo", v: "Fondo blanco, casting fijo, luz difusa. La prenda manda, no la pose." },
  { k: "03", t: "Vista alternativa", v: "La prenda sola de nuevo: espalda, perfil o tres cuartos." },
  { k: "04", t: "Detalle", v: "Macro del tejido, el lavado, el bordado o la plata." },
];
export const PHOTO_RULES = [
  { k: "Fondo", v: "Blanco puro. Sin texturas, sin degradados, sin color." },
  { k: "Luz", v: "Difusa y cenital. Sombras suaves y cortas." },
  { k: "Formato", v: "4:5 · 1200 × 1500 px · sRGB." },
  { k: "Retoque", v: "Fiel al tejido y al lavado. No se corrige el color de la prenda." },
  { k: "Joyería", v: "Macro sobre blanco. Plata neutra, sin tintes cálidos." },
];
export const PHOTO_DONTS = ["Fondos de color o exteriores en ficha", "Filtros, grano añadido, viñeteado", "Atrezo y objetos de decoración", "Poses forzadas o gestos de catálogo"];
/* 2026 line: cropped boxy tops that end at the waist, straight / barrel trousers. */
export const LINE_2026 = {
  lead: "La línea 2026 cambia la silueta: arriba, boxy recortado que termina en la cintura, con hombro estructurado; abajo, pantalón recto o barril con caída limpia. Y entra el color.",
  rules: [
    { k: "Flat lay", v: "La prenda completa y cuadrada: el bajo recto, sin doblar, para que se lea el largo recortado." },
    { k: "Con modelo", v: "El bajo cae justo en la cintura y el hombro marca la línea. El pantalón llega al zapato sin acumularse." },
    { k: "Color", v: "Fiel a la paleta de producto. Se corrige la luz, nunca el tono de la prenda." },
  ],
  slugs: ["tabard-track-jacket", "boxy-emblem-tee", "brotherhood-varsity", "barrel-denim"],
};

export const CASTING = [
  { key: "marco", name: "Marco" },
  { key: "yuna", name: "Yuna" },
  { key: "nia", name: "Nia" },
  { key: "kofi", name: "Kofi" },
];

/* ---------- 07 · Tono de voz ------------------------------------------------ */
export const VOICE_PRINCIPLES = [
  { k: "Sobrio", v: "Decimos menos. Una frase bien puesta vale más que tres adjetivos." },
  { k: "Seguro", v: "Sin superlativos ni urgencia. Lo bueno no necesita insistir." },
  { k: "Literario", v: "Una imagen precisa, de vez en cuando. Un guiño en francés, nunca dos." },
  { k: "Fraterno", v: "Tuteamos. Hablamos como se habla entre los de la misma fila." },
];
export const VOICE_YES_NO = [
  { yes: "Felpa de 500 g/m². Hecha para durar.", no: "¡¡La sudadera más brutal del año!!" },
  { yes: "Siempre en catálogo.", no: "Últimas unidades, ¡corre!" },
  { yes: "En garde.", no: "No te lo pierdas." },
  { yes: "Plata 925, pulida a mano.", no: "Joyas top para tus outfits." },
];
export const VOCAB = {
  yes: ["catálogo", "pieza", "prenda", "oficio", "gramaje", "corte", "lavado", "plata 925", "hermandad", "las filas"],
  no: ["drop", "hype", "edición limitada", "must-have", "brutal", "chollo", "outfit", "¡!", "emojis"],
};
export const MICROCOPY = [
  { k: "Botón de compra", v: "Añadir a la cesta" },
  { k: "Cesta vacía", v: "Tu cesta está vacía. El catálogo sigue aquí." },
  { k: "Sin stock", v: "Agotado por ahora. Vuelve pronto: aquí no hay drops." },
  { k: "Newsletter", v: "Únete a las filas. Una carta al mes, nunca más." },
  { k: "Pedido confirmado", v: "Pedido confirmado. Tous pour un." },
  { k: "Error 404", v: "Esta página ha caído en duelo. Vuelve al catálogo." },
  { k: "Error de formulario", v: "Revisa el correo electrónico." },
];

/* ---------- 08 · Aplicaciones ----------------------------------------------- */
/* Files are generated with Higgsfield from the master SVGs into /public/brand/mockups/. */
export const MOCKUPS = [
  { file: "storefront", t: "Escaparate", v: "musketeer™ en vinilo blanco mate sobre vidrio. Bandera lisa en Azul Tabardo.", ratio: "3 / 2" },
  { file: "woven-label", t: "Etiqueta tejida y talla", v: "Damasco negro tejido en hilo crudo. Talla en raso blanco.", ratio: "4 / 5" },
  { file: "hang-tag", t: "Etiqueta colgante", v: "Papel de algodón grueso, impresión negra, cordón encerado.", ratio: "4 / 5" },
  { file: "shopping-bag", t: "Bolsa", v: "Papel negro soft-touch, asas de algodón, musketeer™ en blanco.", ratio: "4 / 5" },
  { file: "embroidered-patch", t: "Gráfico de prenda", v: "msk✦tr bordado en punto satén, hilo crudo sobre felpa lavada.", ratio: "4 / 5" },
  { file: "garment-box", t: "Caja de prenda", v: "Caja rígida negra, papel de seda y el sello MSKTR como cierre.", ratio: "3 / 2" },
  { file: "jewellery-box", t: "Joyería", v: "Estuche con msktr™ en plata; bolsa de ante Tabardo con la estrella de estoques.", ratio: "4 / 5" },
  { file: "sticker-sheet", t: "Pegatinas", v: "Vinilo mate troquelado: sello, estrella, msktr™ y musketeer™.", ratio: "4 / 5" },
];

/* ---------- 09 · Web / UI --------------------------------------------------- */
export const UI_TYPE = [
  { k: "Navegación", v: "Archivo 400 · caps", s: "11 px", t: "+0,08 em" },
  { k: "Nombre de producto", v: "Archivo 400", s: "13 px", t: "0" },
  { k: "Precio", v: "Archivo 400 · cifras tabulares", s: "13 px", t: "0" },
  { k: "Titular de categoría", v: "Archivo Expanded 500 · caps", s: "28–44 px", t: "−0,01 em" },
  { k: "Botón", v: "Archivo 500 · caps", s: "11 px", t: "+0,08 em" },
  { k: "Legal", v: "Archivo 400 · caps", s: "10 px", t: "+0,22 em" },
  { k: "Cita / lema", v: "Instrument Serif itálica", s: "20 px +", t: "0" },
];
