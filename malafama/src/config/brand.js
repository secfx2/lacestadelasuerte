/* ==========================================================================
   src/config/brand.js — FUENTE ÚNICA DE VERDAD DE LA MARCA · MALA FAMA
   --------------------------------------------------------------------------
   Todo lo que cambia de una marca a otra vive aquí: nombre, lemas, textos de
   la tienda, envíos, descuento, legal, FAQ, guía de tallas, paleta, fuentes y
   el contenido del Brand Book (/brand). Las páginas y componentes NO llevan
   texto de marca escrito a mano: leen este objeto.

   Reglas:
   - Sin imports (lo leen también los scripts de Node, p. ej. build-logo-data).
   - Voz de MALA FAMA: calle, segura, español de España, frases cortas. Sin
     emojis ni signos de exclamación.
   - Las fuentes se cargan en src/config/fonts.js (next/font exige literales);
     aquí solo se describen para el Brand Book.
   - Catálogo de producto: src/data/catalog.json (generado por
     scripts/build_catalog.py) · Campaña: src/data/campaign.json
   ========================================================================== */

/* ---------- Constantes básicas (se reutilizan en los textos de abajo) ------ */
const NAME = "MALA FAMA"; //                        nombre en mayúsculas: títulos, SEO, alt
const DISPLAY = "Mala Fama"; //                     nombre en texto corrido (y el logotipo caligráfico)
const SHORT = "MF"; //                              marca corta / monograma gótico
const TAGLINE = "Que hablen"; //                    lema principal
const MOTTO = "Mejor mala fama que ninguna"; //     lema secundario
const SIGNOFF = "Hecho en el barrio"; //            cierre
const CITY = "Madrid"; //                           origen (sello, legal)
const YEAR = "2026";
const LINE = "2026"; //                             línea actual: productos con "line": "2026"

const LOCALE = "es-ES";
const CURRENCY = "EUR";
const FREE_FROM = 100; //                           envío estándar gratuito desde (€)
const STANDARD_PRICE = 4.95;
const EXPRESS_PRICE = 9.95;
const RETURN_DAYS = 30;
const DISCOUNT_CODE = "QUEHABLEN"; //               código de prueba del checkout
const DISCOUNT_RATE = 0.1; //                       10 %

/** Formato de precio local para los textos de este archivo ("100 €", "4,95 €"). */
const eur = (n) => {
  const whole = Math.abs(n - Math.round(n)) < 0.005;
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  }).format(whole ? Math.round(n) : n);
};
const pct = (r) => `${Math.round(r * 100)} %`;

/* ---------- Rutas propias de la plantilla --------------------------------- */
// La página de marca/manifiesto vive en src/app/(shop)/nosotros.
const ABOUT_HREF = "/nosotros";

const brand = {
  /* ======================================================================
     Identidad
     ====================================================================== */
  name: NAME,
  displayName: DISPLAY,
  shortName: SHORT,
  skuPrefix: "MF", //           referencia de producto (MF-001-NEGRO) y nº de pedido
  storageKey: "malafama", //    prefijo de localStorage (cesta, favoritos, densidad)
  tagline: TAGLINE,
  motto: MOTTO,
  signoff: SIGNOFF,
  city: CITY,
  year: YEAR,
  currentLine: LINE,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3300",

  locale: {
    lang: "es",
    locale: LOCALE,
    ogLocale: "es_ES",
    currency: CURRENCY,
    region: "España · EUR €",
    vatRate: 0.21,
  },

  /* ======================================================================
     Paleta → variables CSS (se inyectan en <html> desde src/app/layout.js)
     ink/paper/fog/bone/steel/accent/alert son los tokens que usa todo el CSS.
     MALA FAMA: Asfalto, Crudo, Burdeos lavado, Cromo y Cobalto lavado. El
     papel sigue en blanco porque las fotos de producto son sobre blanco.
     ====================================================================== */
  palette: {
    ink: { hex: "#111111", name: "Asfalto", role: "Texto, logotipo, botones y bloques de noche: pie, hero, cinta.", cmyk: "70 · 60 · 55 · 90", pms: "Black 6 C" },
    paper: { hex: "#FFFFFF", name: "Papel", role: "Fondo de la tienda. Blanco, porque las fotos son sobre blanco.", cmyk: "0 · 0 · 0 · 0", pms: "Papel estucado mate, blanco" },
    fog: { hex: "#F4F2EE", name: "Niebla", role: "Superficies suaves, resúmenes, placeholders.", cmyk: "3 · 3 · 5 · 0", pms: "—" },
    bone: { hex: "#EDE6DA", name: "Crudo", role: "Bloques editoriales, texto sobre Asfalto, papel de seda.", cmyk: "6 · 8 · 14 · 0", pms: "9224 C" },
    steel: { hex: "#C7C9CC", name: "Cromo", role: "Plata 925, herrajes, acentos sobre fondo oscuro.", cmyk: "22 · 16 · 15 · 0", pms: "877 C (metálico)" },
    accent: { hex: "#6E2430", name: "Burdeos", role: "Acento de marca: barra de avisos, cintas, detalles. Lavado, nunca chillón.", cmyk: "25 · 92 · 62 · 42", pms: "7421 C" },
    alert: { hex: "#2E4FA3", name: "Cobalto", role: "Segundo acento: avisos, errores y la pieza rara. Nunca junto al Burdeos en grande.", cmyk: "92 · 72 · 0 · 0", pms: "7686 C" },
  },
  /** Gris de la ficha de producto en la rejilla (las fotos se multiplican sobre él). */
  tile: "#F2F2F2",
  themeColor: "#6E2430",
  /** % de uso aproximado de cada token (Brand Book · Color). */
  paletteProportions: { paper: 44, ink: 32, bone: 9, fog: 4, steel: 3, accent: 7, alert: 1 },
  /** Combinaciones aprobadas (tokens de la paleta). */
  palettePairs: [
    { fg: "ink", bg: "paper", note: "Por defecto" },
    { fg: "bone", bg: "ink", note: "Noche: pie, hero, packaging" },
    { fg: "bone", bg: "accent", note: "Avisos, cintas, piezas especiales" },
    { fg: "ink", bg: "bone", note: "Editorial" },
    { fg: "steel", bg: "ink", note: "Cromo sobre noche" },
    { fg: "paper", bg: "alert", note: "La pieza rara" },
  ],
  /** Colores de prenda de la línea actual (producto, no marca): nunca en UI ni logo. */
  productPalette: [
    { name: "Burdeos lavado", hex: "#6E2430" },
    { name: "Negro lavado", hex: "#2B2A2A" },
    { name: "Carbón lavado", hex: "#4A4A4C" },
    { name: "Cobalto lavado", hex: "#2E4FA3" },
    { name: "Crudo racing", hex: "#E6DFD1" },
    { name: "Chocolate", hex: "#4B2E22" },
    { name: "Oliva desteñido", hex: "#5E5F45" },
    { name: "Azul cielo", hex: "#8DB7E0" },
  ],

  /* ======================================================================
     Fuentes (descripción). El cargador real está en src/config/fonts.js.
     ====================================================================== */
  fonts: {
    sans: {
      family: "Archivo",
      source: "Omnibus-Type · Google Fonts",
      axes: "variable: peso 100–900, anchura 62–125",
      role: "La voz de la calle: interfaz, precios, cuerpo y titulares cortos. Los titulares van en condensada negra (anchura 70, peso 800) y en mayúsculas.",
      /** Anchuras (eje wdth) que se muestran en el Brand Book. */
      widths: [62.5, 70, 87.5, 100, 125],
      /** Etiqueta de uso de cada anchura en el Brand Book. */
      widthUse: { 70: "Titulares", 100: "Cuerpo" },
      weights: [400, 500, 600, 700, 800],
    },
    serif: {
      family: "Pinyon Script",
      source: "Nicole Fally · Google Fonts",
      axes: "caligráfica de copperplate, regular",
      role: "La firma: el logotipo y el lema. Frases cortas en tamaños generosos; nunca en interfaz, botones ni párrafos.",
    },
    display: {
      family: "UnifrakturMaguntia",
      source: "Peter Wiegel · Google Fonts",
      axes: "gótica fraktur, regular",
      role: "El tatuaje: la marca corta MF y los titulares grandes. Siempre en minúscula con mayúscula inicial; nunca en mayúsculas seguidas.",
      weights: [400],
    },
  },

  /* ======================================================================
     SEO
     ====================================================================== */
  seo: {
    title: `${NAME} — ${TAGLINE}`,
    titleTemplate: `%s — ${NAME}`,
    description: `${NAME}. Conjuntos de chándal Y2K hechos en ${CITY}: sudadera recortada y pantalón extra ancho a juego, felpa lavada, paneles tribales, aerógrafo y pedrería. Catálogo permanente, sin drops.`,
    home: `Conjuntos de chándal a juego, sudaderas, pantalones extra anchos, polos de punto, chaquetas, accesorios y plata 925. Catálogo permanente. Envío gratuito desde ${eur(FREE_FROM)}.`,
    shop: `Todo el catálogo ${NAME}: conjuntos, sudaderas, pantalones, camisetas, punto, chaquetas, accesorios y joyería. Siempre disponible.`,
    about: `${NAME}: de dónde venimos, qué hacemos y por qué preferimos que hablen.`,
    lookbook: `Lookbook ${NAME}: los conjuntos, puestos.`,
    help: `Envíos, devoluciones, guía de tallas, cuidado de las piezas y métodos de pago en ${NAME}.`,
    legal: `Aviso legal, política de privacidad, cookies y condiciones de venta de ${NAME}.`,
    account: `Inicia sesión o crea tu cuenta ${NAME}.`,
    cart: `Tu cesta ${NAME}.`,
    checkout: `Finaliza tu compra en ${NAME}.`,
    favorites: `Tus piezas guardadas en ${NAME}.`,
    brandBook: `Manual de identidad de ${NAME}: logotipo caligráfico, monograma gótico, símbolos, color, tipografía, fotografía, tono de voz, aplicaciones y web.`,
  },

  /* ======================================================================
     Barra de avisos (la frase igual a `tagline` se pinta en caligráfica)
     ====================================================================== */
  announcements: [
    `Envío gratuito desde ${eur(FREE_FROM)}`,
    `Código ${DISCOUNT_CODE}: ${pct(DISCOUNT_RATE)} en tu primer pedido`,
    TAGLINE,
    `Devoluciones gratuitas en ${RETURN_DAYS} días`,
    "Conjuntos a juego — siempre en catálogo",
  ],

  /* ======================================================================
     Navegación
     ====================================================================== */
  routes: { about: ABOUT_HREF },
  nav: {
    /** Enlace directo antes de «Tienda»: los conjuntos son la pieza estrella. */
    featured: { label: "Conjuntos", href: "/categoria/conjuntos" },
    shop: "Tienda",
    collections: "Colecciones",
    lookbook: "Lookbook",
    about: "Nosotros",
    brandBook: "Brand Book",
  },
  megaMenu: {
    /** ids de campaign.json → banners destacados en el menú «Tienda». */
    shopBanners: ["conjuntos", "joyeria"],
    /** ids de banners del menú «Colecciones» ([] = todos). */
    collectionBanners: ["conjuntos", "sudaderas", "pantalones", "punto"],
    selection: [
      { label: "Conjuntos a juego", href: "/categoria/conjuntos" },
      { label: "Novedades", href: "/tienda?orden=novedades" },
      { label: "Plata 925", href: "/categoria/joyeria" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Guía de tallas", href: "/ayuda#tallas" },
    ],
    note: "Catálogo, no drops. Lo que ves está siempre disponible.",
  },

  /* ======================================================================
     Categorías (orden de la tienda). Deben coincidir con los `category` de
     catalog.json. `intro` = texto editorial de la cabecera de categoría.
     ====================================================================== */
  categories: [
    { slug: "conjuntos", name: "Conjuntos", intro: "Sudadera recortada y pantalón extra ancho, a juego. Felpa lavada, paneles tribales, aerógrafo y pedrería. Se venden juntos, en una talla." },
    { slug: "sudaderas", name: "Sudaderas", intro: "Boxy, recortadas y pesadas. Capuchas dobles, cremalleras hasta arriba y gráficos que no piden permiso." },
    { slug: "pantalones", name: "Pantalones", intro: "Extra anchos, balloon, acampanados y paracaídas. Caen sobre la zapatilla y hacen ruido al andar." },
    { slug: "camisetas", name: "Camisetas", intro: "Baby tees, jerseys de carreras y camisetas lavadas. Estampados agrietados y pedrería." },
    { slug: "punto", name: "Punto", intro: "Polos de jacquard, mohair y cremalleras de punto. Lo más fino del armario, sin dejar de ser calle." },
    { slug: "chaquetas", name: "Chaquetas", intro: "Plumíferos de hielo, cuero racing, denim con pedrería y varsity. Para que se vea de lejos." },
    { slug: "accesorios", name: "Accesorios", intro: "Pasamontañas, truckers, gafas envolventes, cinturones de tachuelas y charms. El remate del conjunto." },
    { slug: "joyeria", name: "Joyería", intro: "Plata de ley 925 maciza. Dagas, espinas, llamas y cadenas tenis. Sin baños, sin atajos." },
  ],
  /** «Completa el look»: categorías compatibles por categoría (orden de preferencia). */
  relatedCategories: {
    conjuntos: ["joyeria", "accesorios", "camisetas", "chaquetas"],
    sudaderas: ["pantalones", "joyeria", "accesorios", "camisetas"],
    pantalones: ["sudaderas", "camisetas", "punto", "accesorios"],
    camisetas: ["pantalones", "chaquetas", "joyeria", "accesorios"],
    punto: ["pantalones", "joyeria", "accesorios", "chaquetas"],
    chaquetas: ["pantalones", "sudaderas", "camisetas", "accesorios"],
    accesorios: ["conjuntos", "sudaderas", "joyeria", "pantalones"],
    joyeria: ["joyeria", "conjuntos", "punto", "accesorios"],
  },

  /* ======================================================================
     Envíos, impuestos y descuento
     ====================================================================== */
  shipping: {
    freeFrom: FREE_FROM,
    methods: [
      { id: "estandar", name: "Estándar", eta: "2–4 días laborables", price: STANDARD_PRICE, freeFrom: FREE_FROM },
      { id: "express", name: "Express", eta: "24–48 h", price: EXPRESS_PRICE, freeFrom: null },
    ],
    zones: "Enviamos a toda España peninsular y Baleares.",
    returnDays: RETURN_DAYS,
  },
  discount: { code: DISCOUNT_CODE, rate: DISCOUNT_RATE, label: `${DISCOUNT_CODE} — ${pct(DISCOUNT_RATE)}` },
  /** Métodos de pago mostrados en checkout (tags = logos en texto). */
  payments: [
    { id: "tarjeta", name: "Tarjeta de crédito o débito", tags: ["Visa", "Mastercard", "Amex"] },
    { id: "applepay", name: "Apple Pay", tags: [] },
    { id: "paypal", name: "PayPal", tags: [] },
    { id: "bizum", name: "Bizum", tags: [] },
  ],
  /** Lista corta para pie, cesta y cajón. */
  paymentBrands: ["Visa", "Mastercard", "Amex", "Apple Pay", "PayPal", "Bizum"],

  /* ======================================================================
     Home
     ====================================================================== */
  home: {
    /** Hero tipográfico + alineación de conjuntos con modelo (campaign.hero.strip). */
    hero: {
      eyebrow: `Catálogo ${LINE} · ${CITY}`,
      caption: "Conjuntos a juego · Felpa lavada",
      kicker: MOTTO,
      cta: "Comprar conjuntos",
      ctaHref: "/categoria/conjuntos",
      secondary: "Ver todo el catálogo",
      secondaryHref: "/tienda",
      stripLabel: "La alineación",
      srTitle: `${NAME} — ${TAGLINE}. Conjuntos de chándal, sudaderas, pantalones, accesorios y plata 925.`,
    },
    /** Primera sección: los conjuntos (chips por tipo; slugs de catalog.json). */
    sets: {
      title: "Conjuntos",
      kicker: "Arriba y abajo, a juego",
      cols: 4,
      chips: [
        { id: "todos", label: "Todos", slugs: ["tribal-panel-set", "script-zip-set", "halo-airbrush-set", "thorn-crystal-set", "paddock-fleece-set", "thorn-eyelet-set", "wing-puff-set", "velour-piping-set", "barbwire-set", "bleach-splatter-set", "rust-canvas-set", "flame-track-set"] },
        { id: "cremallera", label: "Con cremallera", slugs: ["script-zip-set", "halo-airbrush-set", "thorn-crystal-set", "thorn-eyelet-set"] },
        { id: "capucha", label: "Con capucha", slugs: ["tribal-panel-set", "paddock-fleece-set", "wing-puff-set", "velour-piping-set", "barbwire-set", "bleach-splatter-set"] },
        { id: "nylon-lona", label: "Nylon y lona", slugs: ["flame-track-set", "rust-canvas-set"] },
      ],
      href: "/categoria/conjuntos",
      more: "Ver todos los conjuntos",
    },
    /** slugs: [] → se deriva del catálogo (badge "Nuevo" o línea actual). */
    newIn: {
      title: "Novedades",
      slugs: ["thorn-crystal-set", "velour-piping-set", "sunfade-double-zip", "side-stripe-pant", "pit-jersey", "stripe-knit-polo", "fama-varsity", "crystal-balaclava", "charm-crossbody", "star-tennis-chain"],
      limit: 10,
    },
    /** slugs: [] → productos con "featured": true, luego badge, luego orden del catálogo. */
    bestSellers: { title: "Los que más suenan", slugs: [], limit: 10 },
    /** ids de banners de campaign.json para el bloque doble. */
    split: ["sudaderas", "punto"],
    splitCta: "Descubrir",
    categories: {
      title: "Categorías",
      kicker: "Todo, siempre disponible",
      linkLabel: "Ver catálogo",
      /** Portada de cada categoría: { conjuntos: "slug-producto" }. Vacío → primer producto destacado. */
      covers: { conjuntos: "script-zip-set", joyeria: "star-tennis-chain", accesorios: "crystal-balaclava" },
    },
    marquee: [TAGLINE, MOTTO],
    /** Bloque destacado de una categoría. category: null lo oculta. */
    feature: {
      category: "joyeria",
      banner: "joyeria",
      title: "Plata 925",
      kicker: "Para los que se lo ganaron",
      text: "Dagas, espinas, llamas y cadenas tenis en plata de ley maciza. Sin baños, sin atajos.",
      linkLabel: "Ver joyería",
      slugs: ["star-tennis-chain", "dagger-pendant", "flame-signet", "thorn-ring"],
    },
    /** Banner ancho tipográfico (sin foto): bloque Burdeos con el lema en gótica. */
    wide: {
      banner: "wide",
      cta: "Ver catálogo",
      lines: ["Mejor mala fama", "que ninguna"],
      text: "No hacemos drops ni cuentas atrás. Hacemos conjuntos que se quedan en catálogo y se reponen. Si te gusta hoy, seguirá aquí mañana.",
      note: `${SIGNOFF} · ${CITY}`,
    },
    lookbook: { title: "Lookbook", kicker: "Cuatro caras, un barrio", linkLabel: "Ver lookbook", count: 4 },
    newsletter: { title: "Que te lo cuenten antes", sealTitle: `Sello ${NAME}` },
  },

  /* ======================================================================
     Newsletter
     ====================================================================== */
  newsletter: {
    name: "La lista",
    lead: "Reposiciones, piezas nuevas y lo que se cuece en el taller. Un correo al mes, nunca más.",
    footerLead: "Reposiciones, piezas nuevas y lo que se cuece en el taller. Un correo al mes.",
    doneTitle: "Hecho. Ya estás en la lista.",
    doneText: "Un correo al mes, nunca más.",
    consent: `Acepto recibir comunicaciones de ${NAME}. Puedes darte de baja cuando quieras.`,
    checkoutOptIn: "Quiero entrar en la lista (novedades y reposiciones).",
  },

  /* ======================================================================
     Páginas de la tienda
     ====================================================================== */
  shopPage: {
    title: "Tienda",
    aside: "Catálogo, no drops. Sin cuentas atrás ni últimas unidades: cada pieza está siempre disponible y se repone.",
  },
  search: {
    popular: ["Conjunto", "Zip hoodie", "Tribal", "Pedrería", "Polo", "Plata"],
    emptyHint: "Prueba con «conjunto», «tribal» o «pedrería», o mira el catálogo completo.",
  },
  product: {
    perks: [`Envío gratuito desde ${eur(FREE_FROM)}`, `Devoluciones gratuitas en ${RETURN_DAYS} días`, "Siempre en catálogo — se repone"],
    relatedTitle: "Completa el look",
    relatedKicker: TAGLINE,
  },
  cart: {
    emptyDrawer: "empieza por un conjunto.",
    emptyPage: "el catálogo entero sigue aquí.",
  },
  checkout: {
    /** La plantilla nunca cobra: el pago abre este aviso. */
    demoTitle: "Modo demostración",
    demoText: "Los pagos están desactivados. No se ha hecho ningún cargo.",
    demoSub: `Esta tienda es una demostración del catálogo ${NAME}. Tu cesta sigue intacta.`,
    countries: [
      { code: "ES", name: "España" },
      { code: "PT", name: "Portugal" },
      { code: "AD", name: "Andorra" },
    ],
  },
  account: {
    benefitsTitle: "Lo que ganas con cuenta",
    benefits: [
      "Pedidos y devoluciones en un clic.",
      "Favoritos guardados en todos tus dispositivos.",
      "Aviso cuando vuelve tu talla.",
      "Direcciones y datos de envío guardados.",
    ],
    registerThanks: "Cuenta creada. Bienvenido al barrio.",
  },
  contact: {
    hours: "Atención al cliente de lunes a viernes, de 10:00 a 18:00 (hora peninsular). Respondemos en 24–48 h laborables.",
  },
  notFound: {
    title: "Ni rastro",
    lead: "Esta página no existe o se la han llevado. Vuelve al catálogo.",
  },

  /* ---------- Lookbook (las piezas de cada look están en campaign.json) ---- */
  lookbook: {
    title: "Lookbook",
    aside: "Cuatro caras, un barrio. Los conjuntos puestos, de arriba abajo, con la plata y los accesorios que los rematan.",
    /** Citas intercaladas: índice del look → frase. */
    quotes: { 2: MOTTO, 6: SIGNOFF },
    marquee: [TAGLINE, MOTTO],
  },

  /* ---------- Nosotros (manifiesto) ------------------------------------------ */
  about: {
    title: "Nosotros",
    aside: `${TAGLINE}. ${MOTTO}.`,
    eyebrow: "Manifiesto",
    crewTitle: "El barrio",
    crewText: "Cuatro caras para todo el catálogo. Siempre las mismas.",
    lead: "Nos llamaban mala fama por cómo íbamos vestidos. Nos quedamos con el nombre.",
    paragraphs: [
      `${NAME} nace en ${CITY}, entre plazas, portales y trenes de cercanías. Hacemos lo que llevábamos: el chándal a juego. Sudadera recortada y pantalón extra ancho, en felpa lavada, con paneles tribales, aerógrafo, pedrería y colores de mono de carreras.`,
      "No hacemos drops. No fabricamos colas ni cuentas atrás. Hacemos un catálogo que se queda: si un conjunto funciona, se repone. Lo que te pones hoy tiene que seguir contigo cuando cambie la moda.",
      "Lo demás es remate: polos de punto, chaquetas que se ven de lejos, accesorios y plata de ley maciza. Que hablen. Nosotros seguimos a lo nuestro.",
    ],
    sign: TAGLINE,
    values: [
      { n: "I", title: "El conjunto", text: "Arriba y abajo a juego, en la misma felpa y el mismo lavado. Es nuestra pieza y la defendemos." },
      { n: "II", title: "El barrio", text: `Hecho en ${CITY}, con la gente de aquí. Un casting fijo, unisex en casi todo. La marca es un nosotros.` },
      { n: "III", title: "Catálogo", text: "Sin drops ni últimas unidades. Cada pieza sigue disponible y se repone. Aquí nadie te mete prisa." },
      { n: "IV", title: "El remate", text: "Pedrería aplicada a mano, bordado en cadeneta y plata 925 maciza. El detalle es lo que se recuerda." },
    ],
    sealText: "Cada pedido sale cerrado con el sello del barrio.",
    links: [
      { eyebrow: "Brand Book", title: "Identidad de marca", text: `Logotipos, paleta, tipografía y reglas de foto de ${NAME}.`, cta: "Abrir Brand Book", href: "/brand" },
      { eyebrow: "Campaña", title: "Lookbook", text: "Los conjuntos, puestos.", cta: "Ver lookbook", href: "/lookbook" },
      { eyebrow: "Tienda", title: "Catálogo", text: "Conjuntos, sudaderas, pantalones, punto, chaquetas, accesorios y plata.", cta: "Ver catálogo", href: "/tienda" },
    ],
  },

  /* ---------- Pie ----------------------------------------------------------- */
  footer: {
    /** Columna «Tienda» = categorías (automática). Después, estas columnas: */
    columns: [
      {
        title: "Ayuda",
        links: [
          { label: "Envíos", href: "/ayuda#envios" },
          { label: "Devoluciones", href: "/ayuda#devoluciones" },
          { label: "Guía de tallas", href: "/ayuda#tallas" },
          { label: "Cuidado de las piezas", href: "/ayuda#cuidado" },
          { label: "Pagos", href: "/ayuda#pagos" },
          { label: "Contacto", href: "/ayuda#contacto" },
        ],
      },
      {
        title: "Nosotros",
        links: [
          { label: "Manifiesto", href: ABOUT_HREF },
          { label: "Lookbook", href: "/lookbook" },
          { label: "Cuenta", href: "/cuenta" },
          { label: "Cesta", href: "/cesta" },
        ],
        sub: {
          title: "Brand Book",
          links: [
            { label: "Identidad de marca", href: "/brand" },
            // Solo se muestra si el archivo existe en /public (ver brandBook.pdfHref)
            { label: "Descargar PDF", href: "/brand/brandbook.pdf", file: true },
          ],
        },
      },
    ],
    socialsTitle: "Síguenos",
    /** href "#" = «próximamente». */
    socials: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
      { label: "Pinterest", href: "#" },
      { label: "YouTube", href: "#" },
    ],
    copyright: `© ${YEAR} ${NAME}`,
  },

  /* ---------- Legal ----------------------------------------------------------- */
  legal: {
    entity: `${NAME} S.L. (razón social pendiente de constitución)`,
    taxId: "pendiente de asignación",
    address: `domicilio social pendiente de publicar, ${CITY}, España`,
    email: "hola@malafama.example (provisional)",
    updated: "noviembre de 2026",
    notice: "Documento provisional. Esta tienda es una demostración y no realiza ventas.",
  },

  /* ---------- Ayuda / FAQ ---------------------------------------------------- */
  helpPage: {
    aside: "Respuestas claras, sin letra pequeña. Si no encuentras lo tuyo, escríbenos.",
  },
  /** Secciones de /ayuda. `tables: true` añade las tablas de medidas. */
  faq: [
    {
      id: "envios",
      title: "Envíos",
      faqs: [
        ["¿Cuánto cuesta el envío?", `El envío estándar cuesta ${eur(STANDARD_PRICE)} y es gratuito en pedidos desde ${eur(FREE_FROM)}. El envío express cuesta ${eur(EXPRESS_PRICE)}.`],
        ["¿Cuánto tarda mi pedido?", "Estándar: 2–4 días laborables. Express: 24–48 h laborables. Lo que pides antes de las 13:00 sale el mismo día."],
        ["¿A dónde enviáis?", "A toda España peninsular, Baleares, Portugal y Andorra. Para Canarias, Ceuta y Melilla, escríbenos antes de pedir."],
        ["¿Puedo seguir mi pedido?", "Sí. Te llega un correo con el número de seguimiento en cuanto el paquete sale del almacén."],
      ],
    },
    {
      id: "devoluciones",
      title: "Devoluciones",
      faqs: [
        ["¿Cuánto tiempo tengo para devolver?", `${RETURN_DAYS} días desde la entrega. Las piezas tienen que estar sin usar, sin lavar y con sus etiquetas.`],
        ["¿La devolución es gratuita?", "Sí, dentro de España. Te mandamos una etiqueta prepagada."],
        ["¿Puedo devolver solo una parte del conjunto?", "No. Los conjuntos se venden y se devuelven completos: sudadera y pantalón juntos."],
        ["¿Puedo cambiar de talla?", "Claro. Pide el cambio y te enviamos la talla nueva en cuanto nos llegue la original, sin coste."],
        ["¿Cuándo recibo el reembolso?", "En 5–7 días laborables desde que recibimos la devolución, en el mismo método de pago."],
      ],
    },
    {
      id: "tallas",
      title: "Tallas",
      faqs: [
        ["¿Cómo tallan las prendas?", `Casi todo es unisex. La línea ${LINE} va boxy y recortada arriba (termina en la cintura) y extra ancha abajo. Pide tu talla habitual; una más si quieres más volumen.`],
        ["¿Los conjuntos van en una sola talla?", "Sí: sudadera y pantalón llegan en la misma talla. Si necesitas tallas distintas arriba y abajo, escríbenos antes de pedir y lo preparamos."],
        ["¿Cómo elijo la talla del pantalón?", "Los pantalones van de XS a XXL por cintura. Mide tu cintura y busca la fila en la tabla: el ancho de pierna ya viene de serie."],
        ["¿Cómo sé mi talla de anillo?", "Tallaje español, del 10 al 20. Rodea la base del dedo con un hilo, mide la longitud en milímetros y réstale 40: ese número es tu talla. Si dudas entre dos, elige la mayor."],
      ],
      tables: true,
    },
    {
      id: "cuidado",
      title: "Cuidado de las piezas",
      faqs: [
        ["¿Cómo lavo la felpa lavada?", "Del revés, a 30 °C y con colores parecidos. Sin secadora. El lavado está hecho de fábrica: no destiñe más de la cuenta, pero las primeras veces lávala sola."],
        ["¿Y la pedrería, el puff print y el aerógrafo?", "Siempre del revés, en frío y sin secadora. No planches encima: plancha por dentro y a temperatura baja. Los cristales van aplicados a mano y aguantan, si los tratas bien."],
        ["¿De qué es la joyería?", "Plata de ley 925: 92,5 % de plata pura aleada con cobre para darle dureza. Todas las piezas son macizas, sin baños."],
        ["¿Por qué se oscurece la plata?", "La plata reacciona con el aire y la humedad. Límpiala en seco con un paño de plata y evita perfumes, cloro y agua salada. La pátina en los relieves es intencionada."],
      ],
    },
    {
      id: "pagos",
      title: "Pagos",
      faqs: [
        ["¿Qué métodos de pago aceptáis?", "Tarjeta (Visa, Mastercard, American Express), Apple Pay, PayPal y Bizum."],
        ["¿Es seguro pagar en la web?", "Todos los pagos van cifrados y nunca guardamos los datos de tu tarjeta."],
        ["¿Tenéis códigos de descuento?", `Para tu primer pedido, ${DISCOUNT_CODE}: ${pct(DISCOUNT_RATE)} de descuento. Los demás llegan por la lista. Se aplican en el checkout.`],
        ["¿Los precios incluyen IVA?", "Sí, todos los precios incluyen el IVA (21 %)."],
      ],
    },
  ],

  /* ---------- Guía de tallas: nota de cada tabla (las medidas están en src/lib/sizeGuides.js) */
  sizeGuideNotes: {
    tops: "Medidas de la prenda en plano, en centímetros. Corte boxy recortado: el cuerpo es cuadrado, termina en la cintura y el hombro cae lo justo.",
    outer: "Medidas de la prenda en plano. Pensadas para llevar encima de una sudadera.",
    bottoms: "Talla por cintura (XS–XXL), medida en reposo sobre la cintura elástica. Pierna extra ancha: el ancho de bajo ya viene de serie.",
    waist: "Talla en pulgadas de cintura.",
    rings: "Rodea la base del dedo con un hilo, marca el punto de cruce y mide la longitud en milímetros. La talla española equivale a la circunferencia menos 40.",
    chains: "Longitud total con el cierre. Caída orientativa sobre un cuello medio.",
    bracelets: "Mide el contorno de la muñeca justo por encima del hueso.",
    socks: "Equivalencia con la talla de calzado europea.",
    belts: "Elige la talla que corresponde a tu cintura medida sobre el pantalón.",
  },

  /* ---------- Nota de corte bajo el selector de talla ------------------------ */
  fitNotes: {
    jewelleryRing: "Plata 925 maciza — tallaje español de anillo (10–20). Si dudas entre dos tallas, elige la mayor.",
    jewellery: "Plata 925 maciza — hipoalergénica, sin baños.",
    accessoryOneSize: "Talla única.",
    accessoryAdjustable: "Talla única ajustable.",
    lineTops: "Boxy recortado: termina en la cintura — pide tu talla habitual.",
    lineBottoms: "Pierna extra ancha que cae sobre la zapatilla — pide tu talla habitual de cintura.",
    bottomsWaist: "Corte amplio — pide tu talla habitual de cintura.",
    bottoms: "Corte amplio — pide tu talla habitual.",
    default: "Corte boxy — pide tu talla habitual. Una más para más volumen.",
    /** Notas por categoría: { conjuntos: "Texto." } */
    byCategory: {
      conjuntos: "Conjunto: sudadera boxy recortada y pantalón extra ancho, los dos en la misma talla. Pide tu talla habitual.",
    },
    /** Notas para un producto concreto: { "slug-producto": "Texto." } */
    bySlug: {
      "stud-line-flare": "Acampanado largo que cubre la zapatilla — pide tu talla habitual de cintura.",
      "wing-jort": "Bermuda vaquera por debajo de la rodilla — pide tu talla habitual de cintura.",
    },
  },

  /* ---------- Cuidado (acordeón de la ficha) --------------------------------- */
  care: {
    jewellery: [
      "Plata de ley 925. Evita perfumes, cloro y agua salada.",
      "Limpia con un paño suave de plata. La pátina oscura de los relieves es intencionada.",
      "Guárdala en su bolsa, separada de otras piezas.",
    ],
    leather: [
      "Limpieza en seco especializada en piel.",
      "No mojar. Si se humedece, dejar secar a temperatura ambiente.",
      "Guardar en percha ancha, lejos de la luz directa.",
    ],
    accessory: ["Limpieza en seco o lavado a mano en frío.", "No usar secadora.", "Secar en plano."],
    garment: [
      "Lavar del revés a 30 °C con colores parecidos. Las primeras veces, sola.",
      "No usar secadora. Secar en plano o en percha.",
      "Planchar por dentro a temperatura baja. Nunca encima de pedrería, puff print o aerógrafo.",
    ],
  },

  /* ======================================================================
     BRAND BOOK (/brand) — copy de cada capítulo
     Los logotipos se pintan siempre con <Logo variant=…/> (logoData.js).
     ====================================================================== */
  brandBook: {
    edition: { name: "Edición 01", year: YEAR, version: "1.0", date: "Noviembre 2026" },
    /** PDF exportado con scripts/export-brandbook-pdf.mjs (el enlace se oculta si no existe). */
    pdfHref: "/brand/brandbook.pdf",
    cover: {
      motto: `${TAGLINE}.`,
      meta: ["Conjuntos de chándal a juego.", "Catálogo permanente, sin drops.", `Hecho en ${CITY}.`],
    },
    indexNote: `Este manual fija las reglas de la identidad de ${NAME}. Es la referencia para quien diseñe, fotografíe, escriba o produzca en nombre de la marca. Ante la duda: más barrio, menos adorno.`,
    chapters: [
      { id: "portada", num: "00", title: "Portada", short: "Portada" },
      { id: "manifiesto", num: "01", title: "Manifiesto", short: "Manifiesto", desc: "De dónde venimos y los cuatro principios." },
      { id: "logotipo", num: "02", title: "Logotipo", short: "Logotipo", desc: "La firma caligráfica: construcción, respeto, versiones." },
      { id: "simbolos", num: "03", title: "Sistema de símbolos", short: "Símbolos", desc: "Monograma gótico, marca en arco, daga y sello." },
      { id: "color", num: "04", title: "Color", short: "Color", desc: `Asfalto, Crudo, Burdeos, Cromo y Cobalto. Paleta de producto ${LINE}.` },
      { id: "tipografia", num: "05", title: "Tipografía", short: "Tipografía", desc: "Gótica, caligráfica y grotesca condensada." },
      { id: "fotografia", num: "06", title: "Fotografía", short: "Fotografía", desc: `Flat lay y modelo sobre blanco, el casting y la línea ${LINE}.` },
      { id: "voz", num: "07", title: "Tono de voz", short: "Voz", desc: "Cómo hablamos y cómo no." },
      { id: "aplicaciones", num: "08", title: "Aplicaciones", short: "Aplicaciones", desc: "Etiquetas, packaging, parches y pegatinas." },
      { id: "web", num: "09", title: "Web / UI", short: "Web / UI", desc: "Componentes, retícula, tipo en pantalla." },
      { id: "contacto", num: "10", title: "Contacto", short: "Contacto", desc: "Archivos maestros y aprobaciones." },
    ],

    /* 01 · Manifiesto */
    manifesto: {
      quote: `${TAGLINE}.`,
      sub: `${MOTTO}.`,
      lead: "Nos llamaban mala fama por cómo íbamos vestidos: el chándal a juego, la plata, la capucha. Nos quedamos con el nombre y lo bordamos en el pecho.",
      paragraphs: [
        `${NAME} hace conjuntos. Sudadera recortada y pantalón extra ancho, en la misma felpa y el mismo lavado, con paneles tribales, aerógrafo, pedrería y colores de mono de carreras. Todo lo demás —punto, chaquetas, accesorios, plata 925— existe para rematarlos.`,
        "No hacemos drops. No fabricamos colas ni prisas. Hacemos un catálogo que se queda: si un conjunto funciona, se repone. La reputación se gana con lo que dura.",
        `Somos de ${CITY} y hablamos como se habla en la calle: corto, claro y sin pedir permiso.`,
      ],
      sign: `— ${SIGNOFF}.`,
    },
    concept: {
      title: "Cuatro principios",
      lead: `Todo lo que hace ${NAME} —un conjunto, una etiqueta, una frase— tiene que poder explicarse con uno de ellos.`,
      statement: ["Que", "hablen."],
      pillars: [
        { k: "A juego", v: "El conjunto es la pieza. Arriba y abajo en la misma felpa, el mismo lavado y el mismo detalle." },
        { k: "Barrio", v: `Hecho en ${CITY}, con un casting fijo de cuatro caras. Unisex en casi todo. La marca es un nosotros.` },
        { k: "Catálogo", v: "Sin drops, sin cuentas atrás, sin últimas unidades. Lo que funciona se repone." },
        { k: "Remate", v: "Pedrería, cadeneta, puff print y plata 925 maciza. El detalle se lee de lejos y se toca de cerca." },
      ],
      attributes: ["Y2K", "A juego", "Boxy recortado", "Extra ancho", "Felpa lavada", "Tribal", "Pedrería", "Plata 925"],
    },

    /* 02 · Logotipo principal */
    wordmark: {
      variant: "wordmark",
      name: NAME,
      intro: `El logotipo de ${NAME} es una firma: «${DISPLAY}» en caligrafía de copperplate (Pinyon Script), con los perfiles finos engrosados para que la firma aguante en una cabecera, en un bordado y en una etiqueta tejida. Elegante a propósito: el contraste con la gótica y la felpa lavada es la marca.`,
      notes: [
        { k: "Uso", v: "Cabecera y pie de la web, etiquetas, bolsas, cajas, fachada. Si solo cabe una marca, es esta." },
        { k: "Dibujo", v: "Es un dibujo cerrado, trazado a partir de la fuente y engrosado: no se reescribe con la fuente ni se reespacia." },
        { k: "Archivos", v: "wordmark.svg · wordmark-black.svg · wordmark-white.svg" },
      ],
      construction:
        "La retícula usa un módulo de un cuarto de la altura total (H): las mayúsculas M y F ocupan la altura completa, las minúsculas un tercio. El archivo maestro no se redibuja, no se reespacia y no se recompone.",
      gridDiv: 4,
      /** Área de respeto: x = clearRatio × altura total del logotipo, en los cuatro lados. */
      clearRatio: 0.5,
      clearLabel: "x = media altura del logotipo",
      clearText:
        "El área de respeto es x en los cuatro lados, donde x es la mitad de la altura total de la firma. Ningún texto, borde ni imagen entra en la zona.",
      minSizes: [
        { k: "Digital", v: "120 px de ancho", css: "120px" },
        { k: "Impresión", v: "30 mm de ancho", css: "30mm" },
        { k: "Tejido / bordado", v: "50 mm de ancho", css: "50mm" },
      ],
      minNote: "Por debajo de estas medidas los perfiles finos de la caligrafía se pierden. En formatos más pequeños se usa el monograma MF.",
      versions: [
        { k: "Positivo", v: "Asfalto sobre Papel. Versión por defecto.", bg: "var(--paper)", fg: "var(--ink)", border: true },
        { k: "Noche", v: "Crudo sobre Asfalto. Pie, hero y packaging.", bg: "var(--ink)", fg: "var(--bone)" },
        { k: "Sobre Burdeos", v: "Crudo sobre Burdeos. Cintas y piezas especiales.", bg: "var(--accent)", fg: "var(--bone)" },
        { k: "Sobre Crudo", v: "Asfalto sobre Crudo. Bloques editoriales.", bg: "var(--bone)", fg: "var(--ink)" },
      ],
      /** fx disponibles en brand.module.css: stretch, rotate, deslant, notm, retype, offpalette, shadow, lowcontrast, busy, enclose */
      misuse: [
        { k: "No deformar", fx: "stretch" },
        { k: "No girar", fx: "rotate" },
        { k: "No recomponer con una fuente", fx: "retype" },
        { k: "No usar colores fuera de paleta", fx: "offpalette" },
        { k: "No añadir contornos, sombras ni efectos", fx: "shadow" },
        { k: "No encerrar en formas", fx: "enclose" },
        { k: "No usar con poco contraste", fx: "lowcontrast" },
        { k: "No colocar sobre fondos con ruido", fx: "busy" },
      ],
    },

    /* 03 · Sistema de símbolos (variantes de <Logo>) */
    symbolsLead: "Junto a la firma viven un monograma gótico, una marca en arco, un símbolo y un sello. Cada pieza tiene su territorio y no lo abandona.",
    symbols: [
      {
        variant: "monogram",
        name: SHORT,
        alias: "Monograma gótico",
        when: "Bordado en el pecho, joyería, botones, tiradores, avatar en redes y cualquier formato donde la firma no cabe.",
        never: "Nunca junto al logotipo en la misma cara. Nunca en mayúsculas de otra fuente.",
        min: "32 px · 10 mm de ancho",
      },
      {
        variant: "graphic",
        name: "Marca en arco",
        alias: "Mala ✦ Fama",
        when: "Solo gráficos de prenda y campañas: espalda, pecho grande, pernera, serigrafía, puff print y pedrería.",
        never: "Nunca como firma institucional: ni en la web, ni en etiquetas, ni en packaging.",
        min: "40 mm de ancho",
      },
      {
        variant: "emblem",
        name: "La daga",
        alias: "Daga tribal en llamas",
        when: "Favicon, grabados, herrajes, tiradores, separadores y sellos pequeños.",
        never: "Nunca girada, invertida ni recortada.",
        min: "16 px · 5 mm",
      },
      {
        variant: "seal",
        name: "Sello",
        alias: `${NAME} · ${CITY} · ${YEAR}`,
        when: "Pegatina de cierre, packaging, parche, certificado de joyería. Firma el origen.",
        never: "Nunca por debajo del tamaño en el que el texto deja de leerse. Nunca recompuesto.",
        min: "64 px · 20 mm",
      },
    ],
    /* 2 = soporte principal · 1 = permitido · 0 = no se usa */
    usageColumns: ["Web / UI", "Etiqueta", "Packaging", "Bordado", "Joyería", "Prenda", "Redes"],
    usage: {
      wordmark: [2, 2, 2, 1, 0, 1, 2],
      monogram: [1, 1, 1, 2, 2, 2, 2],
      graphic: [0, 0, 0, 1, 0, 2, 1],
      emblem: [1, 0, 1, 1, 2, 1, 1],
      seal: [0, 0, 2, 1, 2, 0, 1],
    },
    symbolRules: [
      "Una sola pieza del sistema por cara visible. Nunca dos marcas juntas.",
      "La firma manda: si el soporte la admite, se usa el logotipo.",
      "El monograma MF entra cuando la firma no cabe y en las piezas de oficio: bordado, plata, botones.",
      "La marca en arco es gráfico, no firma: vive en la prenda y en la campaña.",
      "La daga y el sello nunca se recomponen ni se combinan con texto nuevo.",
    ],

    /* 04 · Color */
    colorLead: "Cinco colores con calle: Asfalto y Crudo sostienen la marca, el Burdeos lavado la firma, el Cromo es la plata y el Cobalto aparece cuando hay algo que avisar.",
    proportionsText: "Papel y Asfalto dominan. El Burdeos marca la barra de avisos, las cintas y los detalles; nunca un fondo de página entero. El Cobalto es raro.",
    productPaletteText: "Los lavados viven en la prenda: burdeos, carbón, cobalto, crudo racing. Logotipo, web y packaging siguen en Asfalto, Crudo y Burdeos.",

    /* 05 · Tipografía */
    type: {
      rampSample: TAGLINE,
      weightSample: "Barrio",
      serifBig: [`${TAGLINE},`, `${MOTTO.toLowerCase()}.`],
      displaySample: ["Mala Fama", "Conjuntos"],
      pairingQuote: "«Mejor mala fama que ninguna.»",
      pairingCaption: "Manifiesto · 01",
      scale: [
        { k: "Display", token: "--fs-display", web: "48–140 px", spec: "Gótica UnifrakturMaguntia · 0,95 · minúscula", sample: `${SIGNOFF}.`, cls: "tsDisplay" },
        { k: "XL", token: "--fs-xl", web: "28–44 px", spec: "Archivo condensada 800 · 1,0 · MAYÚSCULAS", sample: "Conjuntos", cls: "tsXl" },
        { k: "LG", token: "--fs-lg", web: "20 px", spec: "Archivo 400 · 1,3", sample: "Felpa lavada de 420 g/m², corte boxy.", cls: "tsLg" },
        { k: "MD", token: "--fs-md", web: "15 px", spec: "Archivo 400 · 1,45 · cuerpo", sample: "Sudadera recortada y pantalón extra ancho, a juego.", cls: "tsMd" },
        { k: "SM", token: "--fs-sm", web: "13 px", spec: "Archivo 400 · 1,45", sample: "100 % algodón. Lavado a la piedra.", cls: "tsSm" },
        { k: "XS caps", token: "--fs-xs", web: "11 px", spec: "Archivo 400 · MAYÚSCULAS · +0,08 em", sample: "Añadir a la cesta", cls: "tsXs" },
        { k: "Micro caps", token: "--fs-micro", web: "10 px", spec: "Archivo 400 · MAYÚSCULAS · +0,22 em", sample: "Guía de tallas", cls: "tsMicro" },
      ],
      rules: [
        { k: "Gótica", v: "Solo titulares grandes y el monograma. Mayúscula inicial y minúsculas: nunca palabras enteras en mayúsculas góticas." },
        { k: "Caligráfica", v: "La firma y el lema. Frases cortas en tamaños generosos. Nunca en interfaz, botones ni párrafos." },
        { k: "Condensada", v: "Archivo condensada negra en mayúsculas para titulares de interfaz, nombres de producto y etiquetas." },
        { k: "Mayúsculas", v: "Siempre con tracking: +0,08 em en navegación y metadatos; +0,22 em en micro y legales." },
        { k: "Interlineado", v: "1,45 en cuerpo; 0,95–1,05 en titulares." },
        { k: "Signos", v: "Sin signos de exclamación. Sin emojis. Comillas latinas « »." },
        { k: "Logotipo", v: "La firma y el monograma son dibujos, no tipografías. Nunca se escriben con una fuente." },
      ],
      uiType: [
        { k: "Navegación", v: "Archivo 400 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Nombre de producto", v: "Archivo 400", s: "13 px", t: "0" },
        { k: "Precio", v: "Archivo 400 · cifras tabulares", s: "13 px", t: "0" },
        { k: "Titular de página", v: "Gótica", s: "48–124 px", t: "0" },
        { k: "Titular de sección", v: "Gótica", s: "32–52 px", t: "0" },
        { k: "Ficha de producto", v: "Archivo condensada 800 · caps", s: "22–30 px", t: "0" },
        { k: "Botón", v: "Archivo 500 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Lema / acento", v: "Caligráfica", s: "20 px +", t: "0" },
      ],
    },

    /* 06 · Fotografía */
    photo: {
      lead: "La fotografía de producto es la tienda. Dos imágenes por pieza, siempre en el mismo orden, siempre sobre blanco: la prenda tendida y la prenda puesta.",
      /** Producto del que se muestran las fotos (slug). null → el primero con 4 imágenes. */
      heroSlug: "tribal-panel-set",
      /** Con secuencias de 2 fotos, el capítulo muestra estos productos en pareja. */
      pairSlugs: ["tribal-panel-set", "script-zip-set"],
      sequence: [
        { k: "01", t: "Flat lay", v: "Siempre la primera. El conjunto tendido plano, cenital, sobre blanco: sudadera y pantalón lado a lado." },
        { k: "02", t: "Con modelo", v: "Fondo blanco, casting fijo, cuerpo entero. El conjunto puesto con la plata y la zapatilla gorda." },
      ],
      castingText: "Cuatro caras para todo el catálogo: Dani, Nia, Leo y Yuna. La repetición construye barrio: el cliente reconoce las caras como reconoce el logotipo.",
      rules: [
        { k: "Fondo", v: "Blanco puro. Sin texturas, sin degradados, sin color." },
        { k: "Luz", v: "Difusa, de estudio. Sombras suaves y cortas." },
        { k: "Formato", v: "4:5 · 1200 × 1500 px · sRGB." },
        { k: "Retoque", v: "Fiel al lavado y a la pedrería. No se corrige el color de la prenda." },
        { k: "Joyería", v: "Macro sobre blanco. Plata neutra, sin tintes cálidos." },
      ],
      donts: ["Fondos de color o exteriores en ficha", "Filtros, grano añadido, viñeteado", "Atrezo, coches, motos y decorado", "Poses de catálogo forzadas o gestos de banda"],
      line: {
        title: `Línea ${LINE}`,
        lead: "La silueta actual: arriba, boxy recortado que termina en la cintura; abajo, pierna extra ancha que cae sobre la zapatilla. Y a juego.",
        rules: [
          { k: "Flat lay", v: "Sudadera y pantalón completos, lado a lado. El bajo recto, sin doblar, para que se lea el largo recortado." },
          { k: "Con modelo", v: "El bajo cae justo en la cintura y el pantalón se apoya en la zapatilla. Cuerpo entero, siempre." },
          { k: "Color", v: "Fiel a la paleta de producto. Se corrige la luz, nunca el lavado." },
        ],
        /** Productos a mostrar primero (slugs); el resto se completa con la línea actual. */
        slugs: ["tribal-panel-set", "halo-airbrush-set", "script-zip-set", "thorn-crystal-set"],
      },
    },

    /* 07 · Tono de voz */
    voice: {
      lead: "Hablamos como se habla en la calle: frases cortas, español de aquí, seguridad sin chulería. Decimos lo que es y nos callamos.",
      principles: [
        { k: "Corto", v: "Una frase, un golpe. Si sobra una palabra, se va." },
        { k: "Seguro", v: "Sin superlativos ni urgencia. Lo bueno no necesita gritar." },
        { k: "Del barrio", v: "Tuteamos. Español de España, con alguna frase propia. Nunca jerga impostada." },
        { k: "Concreto", v: "Felpa, lavado, gramaje, pedrería, plata 925. Datos antes que adjetivos." },
      ],
      yesNo: [
        { yes: "Felpa lavada de 420 g/m². A juego.", no: "¡¡El chándal más brutal del año!!" },
        { yes: "Siempre en catálogo.", no: "Últimas unidades, ¡corre!" },
        { yes: `${TAGLINE}.`, no: "No te lo pierdas, bro." },
        { yes: "Plata 925 maciza, sin baños.", no: "Joyas top para tus outfits." },
      ],
      vocab: {
        yes: ["conjunto", "a juego", "pieza", "felpa", "lavado", "pedrería", "barrio", "catálogo", "plata 925"],
        no: ["drop", "hype", "edición limitada", "must-have", "brutal", "bro", "outfit", "¡!", "emojis"],
      },
      /** Frases propias de la marca. */
      expressions: [TAGLINE, MOTTO, SIGNOFF],
      expressionsNote: "Las frases propias son un guiño: una por pieza o por pantalla, nunca todas a la vez.",
      microcopy: [
        { k: "Botón de compra", v: "Añadir a la cesta" },
        { k: "Cesta vacía", v: "Tu cesta está vacía. Empieza por un conjunto." },
        { k: "Sin stock", v: "Agotado por ahora. Vuelve: aquí no hay drops." },
        { k: "Newsletter", v: "Un correo al mes, nunca más." },
        { k: "Pedido confirmado", v: `Pedido confirmado. ${TAGLINE}.` },
        { k: "Error 404", v: "Ni rastro. Vuelve al catálogo." },
        { k: "Error de formulario", v: "Revisa el correo electrónico." },
      ],
    },

    /* 08 · Aplicaciones
       mockups: fotos en public/brand/mockups/<file>.jpg (no hay todavía).
       typographic: aplicaciones dibujadas con los SVG del logo mientras no hay mockups. */
    applications: {
      lead: "El sistema en el mundo físico. Felpa, cartón negro, papel de seda crudo y plata: la marca se toca antes de leerse.",
      specs: [
        { k: "Materiales", v: "Cartón rígido negro, papel de seda crudo, damasco tejido, felpa lavada, vinilo mate." },
        { k: "Acabados", v: "Stamping en plata, bordado en cadeneta, serigrafía a una tinta. Nunca brillo plástico." },
        { k: "Color", v: "Asfalto y Crudo. El Burdeos en cintas, tiras y piezas especiales." },
      ],
      labelling: {
        title: "Etiquetado y bolsa",
        text: "Lo primero que se toca. La firma va en la etiqueta colgante y en la bolsa; el monograma MF en la etiqueta tejida; la marca en arco, en la prenda. Siempre en una sola tinta.",
      },
      packaging: {
        title: "Packaging y joyería",
        text: "Caja negra, papel de seda crudo, cinta Burdeos y el sello como cierre. La plata viaja en estuche con el monograma.",
      },
      mockups: [],
      typographic: [
        { kind: "box", t: "Caja de conjunto", v: "Cartón negro, firma en Crudo, cinta Burdeos y el sello de cierre.", ratio: "3 / 2" },
        { kind: "woven", t: "Etiqueta tejida y talla", v: "Damasco negro con el monograma MF en hilo crudo. Talla en Burdeos.", ratio: "4 / 5" },
        { kind: "hangtag", t: "Etiqueta colgante", v: "Cartón negro grueso, firma en plata, datos de la pieza.", ratio: "4 / 5" },
        { kind: "patch", t: "Parche", v: "El sello bordado en cadeneta sobre fieltro Burdeos.", ratio: "4 / 5" },
        { kind: "graphic", t: "Gráfico de espalda", v: "Marca en arco a una tinta: serigrafía, puff print o pedrería.", ratio: "4 / 5" },
        { kind: "tape", t: "Cinta de embalaje", v: "Cinta Burdeos y Asfalto con firma y daga.", ratio: "3 / 2" },
        { kind: "jewel", t: "Joyería", v: "Monograma grabado en plata 925.", ratio: "4 / 5" },
        { kind: "stickers", t: "Pegatinas", v: "Vinilo mate troquelado: sello, daga, monograma y firma.", ratio: "4 / 5" },
      ],
    },

    /* 09 · Web / UI */
    web: {
      lead: "La web es un catálogo: fondo blanco, fotos sobre gris claro, retícula estricta y esquinas rectas. La noche entra en bloques: hero, cinta y pie.",
      buttons: { primary: "Añadir a la cesta", secondary: "Guía de tallas", text: "Ver el catálogo", disabled: "Agotado" },
      field: { placeholder: "Correo electrónico", button: "Unirme", help: "Un correo al mes, nunca más." },
      rules: [
        "Radio 0. Sin sombras. Líneas de 1 px.",
        "Hover: subrayado, inversión Asfalto / Papel o el botón en Burdeos. Sin animación decorativa.",
        "Foco siempre visible: contorno de 1 px en Asfalto.",
      ],
      cardNote: "Hover: la imagen pasa del flat lay a la foto con modelo.",
      browser: {
        announce: `Envío gratuito desde ${eur(FREE_FROM)} · ${TAGLINE}`,
        nav: "Conjuntos · Tienda · Colecciones · Lookbook",
        navRight: "Buscar · Cuenta · Cesta (0)",
        gridTitle: "Conjuntos",
      },
      grid: [
        { k: "Escritorio", v: "12 columnas · medianil y margen 24 px" },
        { k: "Móvil", v: "4 columnas · medianil y margen 12 px" },
        { k: "Producto", v: "4–5 por fila en escritorio, 2 en móvil · imagen 4:5" },
        { k: "Cabecera", v: "56 px, más barra de aviso Burdeos de 30 px" },
      ],
    },

    /* 10 · Contacto */
    contact: {
      motto: [TAGLINE, MOTTO],
      cols: [
        { k: "Equipo de marca", v: "Cualquier uso no previsto en este manual se consulta antes de producir. Ninguna pieza se imprime ni se borda sin prueba aprobada." },
        { k: "Archivos maestros", v: "/public/brand — wordmark, monogram, graphic, emblem y seal, en negro, blanco y currentColor. Fuentes y script de dibujo: brand-source/ y scripts/placeholder-logos.py." },
      ],
    },
  },
};

export default brand;
