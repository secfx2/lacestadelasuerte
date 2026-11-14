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
  { id: "logotipo", num: "02", title: "Logotipo", short: "Logotipo", desc: "Wordmark, construcción, área de respeto, versiones." },
  { id: "simbolos", num: "03", title: "Sistema de símbolos", short: "Símbolos", desc: "Emblema, monograma, gótico y sello." },
  { id: "color", num: "04", title: "Color", short: "Color", desc: "Paleta, valores y proporciones." },
  { id: "tipografia", num: "05", title: "Tipografía", short: "Tipografía", desc: "Archivo, Instrument Serif y la escala." },
  { id: "fotografia", num: "06", title: "Fotografía", short: "Fotografía", desc: "La secuencia de producto y el casting." },
  { id: "voz", num: "07", title: "Tono de voz", short: "Voz", desc: "Cómo hablamos y cómo no." },
  { id: "aplicaciones", num: "08", title: "Aplicaciones", short: "Aplicaciones", desc: "Etiquetas, packaging, tienda." },
  { id: "web", num: "09", title: "Web / UI", short: "Web / UI", desc: "Componentes, retícula, tipo en pantalla." },
  { id: "contacto", num: "10", title: "Contacto", short: "Contacto", desc: "Archivos maestros y aprobaciones." },
];

/* ---------- 02 · Logotipo principal ---------------------------------------- */
export const WORDMARK = {
  variant: "wordmark",
  name: "Wordmark",
  intro:
    "El wordmark es la firma de la casa. Es la pieza principal del sistema y la única que puede representar a MUSKETEER sola, en cualquier soporte institucional: cabecera y pie de la web, etiquetas, bolsas, cajas y fachada.",
  notes: [
    { k: "Uso", v: "Toda pieza institucional. Si solo cabe una marca, es esta." },
    { k: "Color", v: "Tinta sobre Papel o Papel sobre Tinta. Nada más por defecto." },
    { k: "Archivos", v: "wordmark.svg · wordmark-black.svg · wordmark-white.svg" },
  ],
  construction:
    "El logotipo se dibuja sobre una retícula modular cuadrada: un módulo equivale a un octavo de su altura total. Las proporciones son fijas; el archivo maestro no se redibuja, no se reespacia y no se recompone.",
  /* Clear space: x = clearRatio × total logo height, on all four sides. */
  clearRatio: 0.5,
  clearText:
    "El área de respeto es x en los cuatro lados, donde x equivale a la mitad de la altura total del logotipo. Ningún texto, borde de imagen ni otro elemento gráfico entra en esa zona.",
  minSizes: [
    { k: "Digital", v: "96 px de ancho", css: "96px" },
    { k: "Impresión", v: "25 mm de ancho", css: "25mm" },
    { k: "Tejido / bordado", v: "40 mm de ancho", css: "40mm" },
  ],
  versions: [
    { k: "Positivo", v: "Tinta sobre Papel. Versión por defecto.", bg: "var(--paper)", fg: "var(--ink)", border: true },
    { k: "Negativo", v: "Papel sobre Tinta. Packaging y piezas oscuras.", bg: "var(--ink)", fg: "var(--paper)" },
    { k: "Sobre Tabardo", v: "Papel sobre Azul Tabardo. Solo piezas especiales.", bg: "var(--tabard)", fg: "var(--paper)" },
    { k: "Sobre Hueso", v: "Tinta sobre Hueso. Bloques editoriales.", bg: "var(--bone)", fg: "var(--ink)" },
  ],
  misuse: [
    { k: "No deformar", fx: "stretch" },
    { k: "No girar", fx: "rotate" },
    { k: "No usar colores fuera de paleta", fx: "offpalette" },
    { k: "No añadir sombras ni efectos", fx: "shadow" },
    { k: "No recomponer con otra tipografía", fx: "retype" },
    { k: "No usar con poco contraste", fx: "lowcontrast" },
    { k: "No colocar sobre fondos con ruido", fx: "busy" },
    { k: "No encerrar en formas ni redondear", fx: "enclose" },
  ],
};

/* ---------- 03 · Sistema de símbolos --------------------------------------- */
export const SYMBOLS = [
  {
    variant: "emblem",
    name: "Emblema",
    alias: "Tres estoques",
    when: "Favicon, avatar, bordados, anillo de sello y sellos de pequeño formato.",
    never: "Nunca sustituye al wordmark en piezas institucionales.",
    min: "16 px · 6 mm",
    minCss: ["16px", "6mm"],
  },
  {
    variant: "monogram",
    name: "Monograma",
    alias: "La M",
    when: "Packaging, papel de seda, botones, herrajes y tiradores de cremallera.",
    never: "Nunca en la web como logotipo ni junto al wordmark en la misma cara.",
    min: "20 px · 8 mm",
    minCss: ["20px", "8mm"],
  },
  {
    variant: "gothic",
    name: "Gótico",
    alias: "Gráfico de prenda",
    when: "Exclusivamente gráficos de prenda: camisetas, estampados, strass.",
    never: "Nunca en web, packaging ni comunicación institucional.",
    min: "30 mm",
    minCss: [null, "30mm"],
  },
  {
    variant: "seal",
    name: "Sello",
    alias: "Tous pour un",
    when: "Pegatina de cierre, packaging, lacre y certificado de joyería.",
    never: "Nunca por debajo del tamaño en el que su texto deja de leerse.",
    min: "64 px · 18 mm",
    minCss: ["64px", "18mm"],
  },
];

/* 2 = soporte principal · 1 = permitido · 0 = no se usa */
export const USAGE_COLUMNS = ["Web / UI", "Etiqueta", "Packaging", "Bordado", "Joyería", "Prenda", "Redes"];
export const USAGE = {
  wordmark: [2, 2, 2, 1, 0, 1, 2],
  emblem: [1, 1, 1, 2, 2, 1, 2],
  monogram: [0, 1, 2, 1, 1, 1, 0],
  gothic: [0, 0, 0, 1, 0, 2, 0],
  seal: [0, 0, 2, 0, 2, 0, 1],
};
export const SYMBOL_RULES = [
  "Una sola pieza del sistema por cara visible. Nunca dos símbolos juntos.",
  "El wordmark manda: si el soporte lo admite, se usa el wordmark.",
  "El gótico vive solo en la prenda. Fuera de ella no existe.",
  "Los símbolos heredan las reglas de color y de área de respeto del wordmark.",
];

/* ---------- 04 · Color ------------------------------------------------------ */
export const COLORS = [
  { name: "Tinta", token: "--ink", hex: "#0A0A0A", rgb: "10 · 10 · 10", cmyk: "60 · 40 · 40 · 100", pms: "Black 6 C", role: "Texto, logotipo, botones." },
  { name: "Papel", token: "--paper", hex: "#FFFFFF", rgb: "255 · 255 · 255", cmyk: "0 · 0 · 0 · 0", pms: "Papel sin estucar, blanco natural", role: "Fondo. Siempre blanco." },
  { name: "Niebla", token: "--fog", hex: "#F4F4F2", rgb: "244 · 244 · 242", cmyk: "3 · 2 · 3 · 0", pms: "—", role: "Superficies suaves, placeholders." },
  { name: "Hueso", token: "--bone", hex: "#ECE8E1", rgb: "236 · 232 · 225", cmyk: "6 · 7 · 10 · 0", pms: "—", role: "Bloques editoriales." },
  { name: "Acero", token: "--steel", hex: "#9A9DA1", rgb: "154 · 157 · 161", cmyk: "40 · 30 · 28 · 0", pms: "877 C (metálico)", role: "Plata. Texto secundario sobre oscuro." },
  { name: "Azul Tabardo", token: "--tabard", hex: "#1F2B4D", rgb: "31 · 43 · 77", cmyk: "94 · 80 · 38 · 42", pms: "533 C", role: "Acento de marca: el tabardo." },
  { name: "Lacre", token: "--wax", hex: "#7A1F1F", rgb: "122 · 31 · 31", cmyk: "24 · 94 · 86 · 38", pms: "1815 C", role: "Acento raro: rebajas, avisos." },
];
export const PROPORTIONS = [
  { name: "Papel", token: "--paper", pct: 60 },
  { name: "Tinta", token: "--ink", pct: 28 },
  { name: "Niebla", token: "--fog", pct: 4 },
  { name: "Hueso", token: "--bone", pct: 3 },
  { name: "Acero", token: "--steel", pct: 2 },
  { name: "Tabardo", token: "--tabard", pct: 2.5 },
  { name: "Lacre", token: "--wax", pct: 0.5 },
];
export const PAIRS = [
  { fg: "#0A0A0A", bg: "#FFFFFF", fgN: "Tinta", bgN: "Papel", note: "Por defecto" },
  { fg: "#FFFFFF", bg: "#0A0A0A", fgN: "Papel", bgN: "Tinta", note: "Packaging, cierre" },
  { fg: "#FFFFFF", bg: "#1F2B4D", fgN: "Papel", bgN: "Tabardo", note: "Piezas especiales" },
  { fg: "#0A0A0A", bg: "#ECE8E1", fgN: "Tinta", bgN: "Hueso", note: "Editorial" },
  { fg: "#9A9DA1", bg: "#0A0A0A", fgN: "Acero", bgN: "Tinta", note: "Plata, secundario" },
  { fg: "#FFFFFF", bg: "#7A1F1F", fgN: "Papel", bgN: "Lacre", note: "Solo avisos" },
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
  { file: "storefront", t: "Escaparate", v: "Vinilo blanco mate sobre vidrio. Bandera en Azul Tabardo, lisa.", ratio: "3 / 2" },
  { file: "woven-label", t: "Etiqueta tejida y talla", v: "Damasco negro, hilo crudo. Talla en raso blanco.", ratio: "4 / 5" },
  { file: "hang-tag", t: "Etiqueta colgante", v: "Algodón 1200 g, impresión negra, cordón encerado.", ratio: "4 / 5" },
  { file: "shopping-bag", t: "Bolsa", v: "Papel negro soft-touch, asas de algodón, wordmark blanco.", ratio: "4 / 5" },
  { file: "embroidered-patch", t: "Bordado", v: "Emblema en hilo crudo, punto satén, sobre felpa lavada.", ratio: "4 / 5" },
  { file: "garment-box", t: "Caja de prenda", v: "Caja rígida negra, papel de seda y sello de cierre.", ratio: "3 / 2" },
  { file: "jewellery-box", t: "Joyería", v: "Estuche negro y bolsa de ante Tabardo con emblema en plata.", ratio: "4 / 5" },
  { file: "sticker-sheet", t: "Pegatinas", v: "Vinilo mate troquelado. Sello, emblema, monograma.", ratio: "4 / 5" },
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
