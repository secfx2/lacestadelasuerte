/* ==========================================================================
   src/config/brand.js — FUENTE ÚNICA DE VERDAD DE LA MARCA · ÓRBITA
   --------------------------------------------------------------------------
   Todo lo que cambia de una marca a otra vive aquí: nombre, lemas, textos de
   la tienda, envíos, descuento, legal, FAQ, guía de tallas, paleta, fuentes y
   el contenido del Brand Book (/brand). Las páginas y componentes NO llevan
   texto de marca escrito a mano: leen este objeto.

   Reglas:
   - Sin imports (lo leen también los scripts de Node, p. ej. build-logo-data).
   - La UI de la tienda está en español: tono optimista, preciso y un poco
     poético con el espacio. Sin emojis ni signos de exclamación.
   - Las fuentes se cargan en src/config/fonts.js (next/font exige literales);
     aquí solo se describen para el Brand Book.
   - Catálogo de producto: src/data/catalog.json · Campaña: src/data/campaign.json
   ========================================================================== */

/* ---------- Constantes básicas (se reutilizan en los textos de abajo) ------ */
const NAME = "ÓRBITA"; //               nombre en mayúsculas: títulos, SEO, alt
const DISPLAY = "Órbita"; //            nombre en texto corrido
const SHORT = "ORB"; //                 marca corta / monograma
const TAGLINE = "Fuera de órbita"; //   lema principal
const MOTTO = "Misión permanente"; //   lema secundario
const SIGNOFF = "Cambio y corto"; //    tercera frase corta (cierre)
const COUNTDOWN = "Diez, nueve, ocho…"; // guiño de cuenta atrás (hero, 404, marquee)
const CITY = "Madrid"; //               origen (sello, legal)
const COORDS = "40°25′ N · 3°42′ O"; // coordenadas de la base (hero, sello, brand book)
const YEAR = "2026";
const LINE = "2026"; //                 línea/colección actual: productos con "line": "2026"

const LOCALE = "es-ES";
const CURRENCY = "EUR";
const FREE_FROM = 150; //               envío estándar gratuito desde (€)
const STANDARD_PRICE = 4.95;
const EXPRESS_PRICE = 9.95;
const RETURN_DAYS = 30;
const DISCOUNT_CODE = "DESPEGUE"; //    código de prueba del checkout
const DISCOUNT_RATE = 0.1; //           10 %

/** Formato de precio local para los textos de este archivo ("150 €", "4,95 €"). */
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
// La página de marca/manifiesto vive en src/app/(shop)/nosotros. Si cambias la
// ruta, renombra también la carpeta.
const ABOUT_HREF = "/nosotros";

const brand = {
  /* ======================================================================
     Identidad
     ====================================================================== */
  name: NAME,
  displayName: DISPLAY,
  shortName: SHORT,
  skuPrefix: "ORB", //          referencia de producto (ORB-001-SAFETYORANGE) y nº de pedido
  storageKey: "orbita", //      prefijo de localStorage (cesta, favoritos, densidad)
  tagline: TAGLINE,
  motto: MOTTO,
  signoff: SIGNOFF,
  countdown: COUNTDOWN,
  city: CITY,
  coords: COORDS,
  year: YEAR,
  currentLine: LINE,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3100",

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
     ink/paper/fog/bone/steel/accent/alert son los tokens que usa todo el CSS;
     mustard es un token extra de ÓRBITA (--mustard).
     ====================================================================== */
  palette: {
    ink: { hex: "#0E1A3A", name: "Tinta Noche", role: "Texto, logotipo, botones y el cielo del hero. El azul de una noche de lanzamiento.", cmyk: "100 · 86 · 38 · 46", pms: "2767 C" },
    paper: { hex: "#FFFFFF", name: "Blanco Puro", role: "Fondo de la tienda y de la ficha. Siempre blanco.", cmyk: "0 · 0 · 0 · 0", pms: "Papel estucado mate, blanco extra" },
    fog: { hex: "#F4F2EC", name: "Blanco Traje", role: "Superficies suaves, placeholders. El blanco cálido de un traje de paseo espacial.", cmyk: "3 · 3 · 7 · 0", pms: "9224 C" },
    bone: { hex: "#A9C6E8", name: "Azul Cielo", role: "Bloques editoriales y newsletter. El cielo de la mañana del despegue.", cmyk: "32 · 12 · 0 · 0", pms: "543 C" },
    steel: { hex: "#C3C7CC", name: "Plata", role: "Metal, herrajes, plata 925. Texto secundario sobre Tinta Noche.", cmyk: "22 · 15 · 13 · 0", pms: "877 C (metálico)" },
    accent: { hex: "#FF5A1F", name: "Naranja Seguridad", role: "El color de la marca: el logotipo sobre Tinta Noche, acciones y señales. Como el traje de un piloto de pruebas.", cmyk: "0 · 78 · 95 · 0", pms: "Orange 021 C" },
    mustard: { hex: "#E2A72E", name: "Mostaza Cápsula", role: "Acento secundario: insignias, etiquetas y gráficos. El dorado del aislante de una cápsula.", cmyk: "10 · 36 · 92 · 0", pms: "7409 C" },
    alert: { hex: "#D7263D", name: "Rojo Cósmico", role: "Acento raro: avisos, errores y rebajas.", cmyk: "6 · 98 · 76 · 0", pms: "199 C" },
  },
  /** Gris de la ficha de producto en la rejilla (las fotos se multiplican sobre él). */
  tile: "#F2F3F5",
  themeColor: "#ffffff",
  /** % de uso aproximado de cada token (Brand Book · Color). */
  paletteProportions: { paper: 52, ink: 26, fog: 6, accent: 7, bone: 5, steel: 2, mustard: 1.5, alert: 0.5 },
  /** Combinaciones aprobadas (tokens de la paleta). */
  palettePairs: [
    { fg: "ink", bg: "paper", note: "Por defecto" },
    { fg: "accent", bg: "ink", note: "Hero, packaging, firma" },
    { fg: "paper", bg: "ink", note: "Cierre, etiquetas" },
    { fg: "ink", bg: "accent", note: "Bloques de campaña, botones" },
    { fg: "ink", bg: "bone", note: "Editorial, newsletter" },
    { fg: "ink", bg: "mustard", note: "Insignias" },
    { fg: "paper", bg: "alert", note: "Solo avisos" },
  ],
  /** Colores de prenda de la línea actual (producto, no marca): nunca en UI ni logo. */
  productPalette: [
    { name: "Naranja Seguridad", hex: "#FF5A1F" },
    { name: "Blanco Traje", hex: "#F4F2EC" },
    { name: "Tinta Noche", hex: "#0E1A3A" },
    { name: "Plata", hex: "#C3C7CC" },
    { name: "Mostaza Cápsula", hex: "#E2A72E" },
    { name: "Rojo Cósmico", hex: "#D7263D" },
    { name: "Azul Cielo", hex: "#A9C6E8" },
    { name: "Verde Vuelo", hex: "#6B7148" },
    { name: "Gris Lunar", hex: "#9EA1A5" },
  ],

  /* ======================================================================
     Fuentes (descripción). El cargador real está en src/config/fonts.js.
     display → var(--font-display) · sans → var(--font-sans) · serif (aquí,
     la mono de acento) → var(--font-serif). Los nombres de variable se
     conservan de la plantilla.
     ====================================================================== */
  fonts: {
    display: {
      family: "Syncopate",
      source: "Andreas Rasmussen · Google Fonts",
      axes: "regular 400 y bold 700",
      role: "La voz de la era espacial: titulares, marquesinas y cifras grandes. Ancha, geométrica, siempre en mayúsculas y en Bold. Es la tipografía del logotipo, pero el logotipo no se escribe con ella: es un dibujo cerrado.",
      weights: [400, 700],
    },
    sans: {
      family: "Space Grotesk",
      source: "Florian Karsten · Google Fonts",
      axes: "variable: peso 300–700",
      role: "La voz funcional: interfaz, navegación, precios y cuerpo de texto. Geometría técnica con detalles de los sesenta.",
      /** Anchuras (eje wdth) que se muestran en el Brand Book; [] si la fuente no tiene eje de anchura. */
      widths: [],
      weights: [300, 400, 500, 600, 700],
    },
    serif: {
      family: "Space Mono",
      source: "Colophon Foundry · Google Fonts",
      axes: "400 y 700, redonda e itálica",
      role: "La voz de la telemetría: lemas, coordenadas, datos técnicos y citas cortas, como una transcripción de control de misión. Nunca en párrafos largos.",
    },
  },

  /* ======================================================================
     SEO
     ====================================================================== */
  seo: {
    title: `${NAME} — ${TAGLINE}`,
    titleTemplate: `%s — ${NAME}`,
    description: `${NAME}. Ropa unisex inspirada en la carrera espacial de los sesenta, con corte boxy de 2026 y mucho color. Catálogo permanente desde ${CITY}.`,
    home: `Streetwear unisex de la era espacial: chaquetas de vuelo, punto de constelaciones, plata 925 y corte boxy de 2026. Catálogo permanente, sin drops. Envío gratuito desde ${eur(FREE_FROM)}.`,
    shop: `Todo el catálogo ${NAME}: chaquetas, punto, sudaderas, camisetas, camisas, pantalones, accesorios y joyería de la era espacial. Siempre disponible.`,
    about: `${NAME}: el manifiesto. La carrera espacial de los sesenta, cortada en 2026 y en color.`,
    lookbook: `Lookbook ${NAME}: ocho looks de la tripulación con el catálogo permanente.`,
    help: `Envíos, devoluciones, guía de tallas, cuidado de las piezas y métodos de pago en ${NAME}.`,
    legal: `Aviso legal, política de privacidad, cookies y condiciones de venta de ${NAME}.`,
    account: `Inicia sesión o crea tu cuenta ${NAME}.`,
    cart: `Tu cesta ${NAME}.`,
    checkout: `Finaliza tu compra en ${NAME}.`,
    favorites: `Tus piezas guardadas en ${NAME}.`,
    brandBook: `Manual de identidad de ${NAME}: logotipo, sistema de órbitas, color, tipografía, fotografía, tono de voz, aplicaciones y web.`,
  },

  /* ======================================================================
     Barra de avisos (la frase igual a `tagline` se pinta en la fuente de acento)
     ====================================================================== */
  announcements: [
    `Envío gratuito desde ${eur(FREE_FROM)}`,
    `Devoluciones gratuitas en ${RETURN_DAYS} días`,
    "Catálogo permanente — sin drops",
    TAGLINE,
  ],

  /* ======================================================================
     Navegación
     ====================================================================== */
  routes: { about: ABOUT_HREF },
  nav: {
    shop: "Tienda",
    collections: "Misiones",
    lookbook: "Lookbook",
    about: "Nosotros",
    brandBook: "Brand Book",
  },
  megaMenu: {
    /** ids de campaign.json → banners destacados en el menú «Tienda». */
    shopBanners: ["chaquetas", "punto"],
    /** ids de banners del menú «Misiones» ([] = todos). */
    collectionBanners: ["chaquetas", "camisas", "pantalones", "sudaderas"],
    selection: [
      { label: "Novedades", href: "/tienda?orden=novedades" },
      { label: "Best sellers", href: "/tienda" },
      { label: "Plata 925", href: "/categoria/joyeria" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Guía de tallas", href: "/ayuda#tallas" },
    ],
    note: "Catálogo permanente, sin drops: todo está siempre en órbita.",
  },

  /* ======================================================================
     Categorías (orden de la tienda). Deben coincidir con los `category` de
     catalog.json. `intro` = texto editorial de la cabecera de categoría.
     ====================================================================== */
  categories: [
    { slug: "chaquetas", name: "Chaquetas", intro: "Chaquetas de vuelo, plumíferos de paseo lunar y bombers de escudo térmico. Abrigo técnico con corte boxy recortado." },
    { slug: "punto", name: "Punto", intro: "Constelaciones en intarsia, cárdigans de Saturno y canalé de traje EVA. Tacto denso, colores de cápsula." },
    { slug: "sudaderas", name: "Sudaderas", intro: "Felpa pesada con parches de misión, cremalleras de plataforma y estampados en relieve. La base del uniforme." },
    { slug: "camisetas", name: "Camisetas", intro: "Algodón de gramaje alto, rayas de etapa de cohete y mapas estelares. Corte boxy, siempre en color." },
    { slug: "camisas", name: "Camisas", intro: "La camisa del ingeniero de 1969, la de la sala de control y la de satén cometa. La parte más precisa del armario." },
    { slug: "pantalones", name: "Pantalones", intro: "Traje de vuelo, plata lunar y cargo de equipo de tierra. Pierna recta, barril o acampanada, con caída limpia." },
    { slug: "accesorios", name: "Accesorios", intro: "Botas de cráter, bolsos de casco, cintas de anclaje y gafas de visor. El equipo que completa la misión." },
    { slug: "joyeria", name: "Joyería", intro: "Plata 925 maciza en órbita: anillos de Saturno, colgantes de cápsula y placas de carta estelar." },
  ],
  /** «Completa el look»: categorías compatibles por categoría (orden de preferencia). */
  relatedCategories: {
    chaquetas: ["pantalones", "punto", "accesorios", "joyeria"],
    punto: ["pantalones", "joyeria", "chaquetas", "accesorios"],
    sudaderas: ["pantalones", "accesorios", "joyeria", "chaquetas"],
    camisetas: ["pantalones", "chaquetas", "joyeria", "accesorios"],
    camisas: ["pantalones", "joyeria", "chaquetas", "accesorios"],
    pantalones: ["sudaderas", "punto", "chaquetas", "accesorios"],
    accesorios: ["chaquetas", "sudaderas", "joyeria", "pantalones"],
    joyeria: ["joyeria", "camisas", "punto", "accesorios"],
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
     Home (sin fotos de campaña: hero tipográfico + fotos de producto con modelo)
     ====================================================================== */
  home: {
    hero: {
      eyebrow: `${MOTTO} · Línea ${LINE}`, //   fila de telemetría (izquierda)
      caption: `Base ${CITY} · ${COORDS}`, //   fila de telemetría (derecha)
      countdown: COUNTDOWN,
      liftoff: TAGLINE, //                       lo que aparece al llegar a cero
      cta: "Comprar",
      ctaHref: "/tienda",
      secondary: "Ver lookbook",
      secondaryHref: "/lookbook",
      stripLabel: "Tripulación en directo", //   rótulo de la tira de monitores
      srTitle: `${NAME} — ${TAGLINE}. Ropa unisex de la era espacial, accesorios y joyería.`,
    },
    /** slugs: [] → se deriva del catálogo (badge "Nuevo" o línea actual). */
    newIn: {
      title: "Novedades",
      slugs: ["capsule-flight-jacket", "moonwalk-puffer", "mission-control-blouson", "starfield-knit", "saturn-cardigan", "mission-patch-hoodie", "engineer-shirt", "flight-suit-trouser", "crater-boot", "launchpad-zip-hoodie"],
      limit: 10,
    },
    /** slugs: [] → productos con "featured": true, luego badge "Best seller", luego orden del catálogo. */
    bestSellers: {
      title: "Best Sellers",
      slugs: ["orbit-varsity", "silver-moon-trouser", "constellation-cardigan", "blueprint-tee", "helmet-bag", "cosmonaut-quarter-zip", "orbital-stripe-shirt", "eva-quilted-trouser", "zero-g-crewneck", "saturn-spinner-ring"],
      limit: 10,
    },
    /** ids de banners de campaign.json para el bloque doble. */
    split: ["punto", "camisas"],
    splitCta: "Descubrir",
    categories: {
      title: "Categorías",
      kicker: "Todo, siempre en órbita",
      linkLabel: "Ver catálogo",
      /** Portada de cada categoría: { chaquetas: "slug-producto" }. Vacío → primer producto destacado. */
      covers: { chaquetas: "heat-shield-bomber", punto: "lunar-mohair-knit", sudaderas: "launchpad-zip-hoodie", camisetas: "rocket-stage-tee", camisas: "control-room-camp-shirt", pantalones: "orbit-barrel-denim", accesorios: "crater-boot", joyeria: "rocket-pendant" },
    },
    marquee: [TAGLINE, MOTTO, SIGNOFF],
    /** Bloque destacado de una categoría. category: null lo oculta. */
    feature: {
      category: "accesorios",
      banner: "accesorios",
      title: "Equipo de misión",
      kicker: "Lo que viaja contigo",
      text: "Bolso de casco, botas de cráter y gafas de visor. El equipo que convierte un look en una misión.",
      linkLabel: "Ver accesorios",
      slugs: ["crater-boot", "visor-shield-sunglasses", "ration-pouch-bag", "tether-belt"],
    },
    /** Banner ancho tipográfico (sin foto): título en dos líneas + texto + CTA. */
    wide: {
      banner: "wide",
      cta: "Ver catálogo",
      lines: ["Misión", "permanente"],
      text: "Un catálogo que no caduca. Sin drops ni prisas: cada pieza sigue en órbita, temporada tras temporada.",
      note: "La única cuenta atrás es la del despegue.",
    },
    lookbook: { title: "Lookbook", kicker: "La tripulación, de uniforme", linkLabel: "Ver lookbook", count: 4 },
    newsletter: { title: "Únete a la tripulación", sealTitle: `Sello ${NAME}` },
  },

  /* ======================================================================
     Newsletter
     ====================================================================== */
  newsletter: {
    name: "Transmisiones",
    lead: "Reposiciones, piezas nuevas y notas desde la base. Una transmisión al mes, nunca más.",
    footerLead: "Reposiciones, piezas nuevas y notas desde la base. Una transmisión al mes.",
    doneTitle: "Recibido. Ya formas parte de la tripulación.",
    doneText: "Una transmisión al mes, nunca más. Cambio y corto.",
    consent: `Acepto recibir comunicaciones de ${NAME}. Puedes darte de baja cuando quieras.`,
    checkoutOptIn: "Quiero recibir las transmisiones de la newsletter (novedades y reposiciones).",
  },

  /* ======================================================================
     Páginas de la tienda
     ====================================================================== */
  shopPage: {
    title: "Tienda",
    aside: "Catálogo permanente. Sin drops: cada pieza sigue en órbita. La única cuenta atrás es la del despegue.",
  },
  search: {
    popular: ["Chaqueta", "Plata", "Hoodie", "Punto", "Naranja", "Saturno"],
    emptyHint: "Prueba con «chaqueta», «plata» o «punto», o explora el catálogo completo.",
  },
  product: {
    perks: [`Envío gratuito desde ${eur(FREE_FROM)}`, `Devoluciones gratuitas en ${RETURN_DAYS} días`, "Catálogo permanente — siempre en órbita"],
    relatedTitle: "Completa el look",
    relatedKicker: TAGLINE,
  },
  cart: {
    emptyDrawer: "la cápsula espera su carga.",
    emptyPage: "el catálogo completo sigue en órbita.",
  },
  checkout: {
    /** La plantilla nunca cobra: el pago abre este aviso. */
    demoTitle: "Simulación de vuelo",
    demoText: "Los pagos están desactivados. Ningún cargo ha sido realizado.",
    demoSub: `Esta tienda es una demostración del catálogo ${NAME}. Tu cesta sigue intacta en órbita.`,
    countries: [
      { code: "ES", name: "España" },
      { code: "PT", name: "Portugal" },
      { code: "AD", name: "Andorra" },
    ],
  },
  account: {
    benefitsTitle: "Ventajas de la tripulación",
    benefits: [
      "Seguimiento de pedidos y devoluciones en un clic.",
      "Favoritos sincronizados entre dispositivos.",
      "Aviso de reposiciones y piezas nuevas.",
      "Direcciones y datos de envío guardados.",
    ],
    registerThanks: "Bienvenida a bordo. Tu cuenta está lista.",
  },
  contact: {
    hours: "Control de misión atiende de lunes a viernes, de 10:00 a 18:00 (hora peninsular). Respondemos en 24–48 h laborables.",
  },
  notFound: {
    title: "Fuera de órbita",
    lead: "Esta página se ha perdido en el espacio profundo. Volvemos a la base: el catálogo te espera.",
  },

  /* ---------- Lookbook (las piezas de cada look están en campaign.json) ---- */
  lookbook: {
    title: "Lookbook",
    aside: "Cuatro tripulantes, ocho misiones. El catálogo permanente, de uniforme y en color.",
    /** Citas intercaladas: índice del look → frase. */
    quotes: { 2: MOTTO, 6: SIGNOFF },
    marquee: [TAGLINE, MOTTO, SIGNOFF],
  },

  /* ---------- Nosotros (manifiesto) ---------- */
  about: {
    title: "Nosotros",
    aside: `${TAGLINE}. ${MOTTO}.`,
    eyebrow: "Manifiesto",
    lead: "En 1969 media humanidad miró hacia arriba a la vez. Nosotros seguimos mirando.",
    paragraphs: [
      `${NAME} nace en ${CITY} de una época en la que el futuro tenía fecha de lanzamiento. Las chaquetas naranjas de los pilotos de pruebas, los trajes blancos con fuelles en las rodillas, las camisas de manga corta de la sala de control, los parches bordados de cada misión. Ropa hecha para hacer algo que nunca se había hecho.`,
      "Cogemos ese archivo y lo cortamos en 2026: siluetas boxy recortadas que terminan en la cintura, hombro estructurado, pantalones rectos o de barril que caen limpios sobre el zapato. Y lo llenamos de color: naranja de seguridad, azul noche, plata lunar, mostaza de cápsula.",
      "No hacemos drops ni cuentas atrás de compra. La única cuenta atrás que nos interesa es la del despegue. Hacemos un catálogo permanente, organizado por categorías y siempre disponible, porque una buena prenda no caduca con la temporada: sigue en órbita.",
      "Unisex, porque la tripulación es de todos. Optimista, porque mirar hacia arriba sigue siendo la mejor idea que hemos tenido.",
    ],
    sign: SIGNOFF,
    values: [
      { n: "01", title: "Tripulación", text: "Ropa unisex pensada para compartirse. Los mismos cortes, las mismas tallas y cuatro caras fijas: una familia, no un casting." },
      { n: "02", title: "Precisión", text: "Nylon técnico, punto denso, felpa pesada y plata 925 maciza. Cada bolsillo, fuelle y cremallera tiene una función, como en una cápsula." },
      { n: "03", title: "Permanencia", text: "Un catálogo, no una carrera. Sin drops ni urgencia: cada pieza sigue disponible y se repone. Misión permanente." },
      { n: "04", title: "Color", text: "Naranja de seguridad, azul noche, plata, mostaza y rojo cósmico. El optimismo de los sesenta se viste en color." },
    ],
    crewTitle: "La tripulación",
    crewText: "Astrid, Rohan, Ama y Kai visten todo el catálogo. Cuatro caras, una misión.",
    sealText: "Cada pedido despega cerrado con el sello de la base.",
    links: [
      { eyebrow: "Brand Book", title: "Identidad de marca", text: `Logotipos, órbitas, paleta, tipografía y reglas fotográficas de ${NAME}.`, cta: "Abrir Brand Book", href: "/brand" },
      { eyebrow: "Lookbook", title: "Ocho misiones", text: "La tripulación, de uniforme y en color.", cta: "Ver lookbook", href: "/lookbook" },
      { eyebrow: "Tienda", title: "Catálogo", text: "Chaquetas, punto, sudaderas, pantalones, accesorios y plata 925.", cta: "Ver catálogo", href: "/tienda" },
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
    copyright: `© ${YEAR} ${NAME} · ${CITY}`,
  },

  /* ---------- Legal ----------------------------------------------------------- */
  legal: {
    entity: `${DISPLAY} Studio S.L. (razón social pendiente de registro)`,
    taxId: "pendiente de asignación",
    address: `domicilio social pendiente de publicar, ${CITY}, España`,
    email: "hola@orbita.example (provisional)",
    updated: "noviembre de 2026",
    notice: "Documento provisional. Esta tienda es una demostración y no realiza ventas.",
  },

  /* ---------- Ayuda / FAQ ---------------------------------------------------- */
  helpPage: {
    aside: "Respuestas claras, sin letra pequeña. Si no encuentras lo que buscas, escribe a control de misión.",
  },
  /** Secciones de /ayuda. `tables: true` añade las tablas de medidas. */
  faq: [
    {
      id: "envios",
      title: "Envíos",
      faqs: [
        ["¿Cuánto cuesta el envío?", `El envío estándar cuesta ${eur(STANDARD_PRICE)} y es gratuito en pedidos desde ${eur(FREE_FROM)}. El envío express cuesta ${eur(EXPRESS_PRICE)}.`],
        ["¿Cuánto tarda mi pedido?", "Estándar: 2–4 días laborables. Express: 24–48 h laborables. Los pedidos realizados antes de las 13:00 despegan el mismo día."],
        ["¿A dónde enviáis?", "A toda España peninsular, Baleares, Portugal y Andorra. Para Canarias, Ceuta y Melilla, consúltanos antes de realizar el pedido."],
        ["¿Puedo seguir mi pedido?", "Sí. Recibirás un correo con el número de seguimiento en cuanto tu pedido salga de la base."],
      ],
    },
    {
      id: "devoluciones",
      title: "Devoluciones",
      faqs: [
        ["¿Cuánto tiempo tengo para devolver?", `Dispones de ${RETURN_DAYS} días desde la entrega. Las piezas deben estar sin usar, sin lavar y con sus etiquetas.`],
        ["¿La devolución es gratuita?", "Sí, las devoluciones dentro de España son gratuitas. Te enviaremos una etiqueta prepagada."],
        ["¿Puedo cambiar de talla?", "Claro. Solicita un cambio y te enviamos la nueva talla en cuanto recibamos la pieza original, sin coste."],
        ["¿Cuándo recibiré el reembolso?", "En un plazo de 5–7 días laborables desde que recibimos la devolución, en el mismo método de pago."],
      ],
    },
    {
      id: "tallas",
      title: "Tallas",
      faqs: [
        ["¿Cómo tallan las prendas?", `Todo es unisex. La línea ${LINE} es boxy recortada: cuerpo cuadrado que termina en la cintura y hombro estructurado. Recomendamos tu talla habitual.`],
        ["¿Y los pantalones?", "Tallaje de cintura en pulgadas, del 28 al 36. Pierna recta, barril o acampanada con caída limpia sobre el zapato. Recomendamos tu talla habitual."],
        ["¿Cómo sé mi talla de anillo?", "Usamos tallaje español. Rodea la base del dedo con un hilo, mide la longitud en milímetros y réstale 40: ese número es tu talla. Si dudas entre dos, elige la mayor."],
        ["¿Qué largo de cadena elijo?", "50 cm queda sobre la clavícula, 55 cm por debajo y 60 cm en la parte alta del pecho."],
      ],
      tables: true,
    },
    {
      id: "cuidado",
      title: "Cuidado de las piezas",
      faqs: [
        ["¿Cómo lavo las prendas?", "Del revés, a 30 °C y con colores similares. Sin secadora: seca en plano o en percha para que conserven la forma boxy."],
        ["¿Y los tejidos metalizados y reflectantes?", "Lavado a mano en frío o en programa delicado, sin suavizante y sin plancha directa sobre el acabado plateado."],
        ["¿De qué es la joyería?", "Plata de ley 925: 92,5 % de plata pura aleada con cobre para darle dureza. Todas las piezas son macizas."],
        ["¿Por qué se oscurece la plata?", "La plata reacciona con el aire y la humedad. Límpiala en seco con un paño de plata y evita perfumes, cloro y agua salada."],
      ],
    },
    {
      id: "pagos",
      title: "Pagos",
      faqs: [
        ["¿Qué métodos de pago aceptáis?", "Tarjeta (Visa, Mastercard, American Express), Apple Pay, PayPal y Bizum."],
        ["¿Es seguro pagar en la web?", "Todos los pagos se procesan cifrados y nunca almacenamos los datos de tu tarjeta."],
        ["¿Tenéis códigos de descuento?", "Ocasionalmente: suscríbete a las transmisiones de la newsletter para recibirlos. Los códigos se aplican en el checkout."],
        ["¿Los precios incluyen IVA?", "Sí, todos los precios incluyen el IVA (21 %)."],
      ],
    },
  ],

  /* ---------- Guía de tallas: nota de cada tabla (las medidas están en src/lib/sizeGuides.js) */
  sizeGuideNotes: {
    tops: "Medidas de la prenda en plano, en centímetros. Corte boxy recortado: cuerpo cuadrado que termina en la cintura y hombro estructurado.",
    outer: "Medidas de la prenda en plano. Pensadas para llevar sobre punto o sudadera.",
    bottoms: "Cintura medida en reposo. Pierna recta de tiro relajado.",
    waist: "Talla en pulgadas de cintura. Pierna recta, barril o acampanada; recomendamos tu talla habitual.",
    rings: "Rodea la base del dedo con un hilo, marca el punto de cruce y mide la longitud en milímetros. La talla española equivale a la circunferencia menos 40.",
    chains: "Longitud total con el cierre. Caída orientativa sobre un cuello medio.",
    bracelets: "Mide el contorno de la muñeca justo por encima del hueso.",
    socks: "Equivalencia con la talla de calzado europea.",
    belts: "Elige la talla que corresponde a tu cintura medida sobre el pantalón.",
  },

  /* ---------- Nota de corte bajo el selector de talla ------------------------ */
  fitNotes: {
    jewelleryRing: "Plata 925 maciza — tallaje español de anillo. Si dudas entre dos tallas, elige la mayor.",
    jewellery: "Plata 925 maciza — hipoalergénica, sin baños.",
    accessoryOneSize: "Talla única.",
    accessoryAdjustable: "Talla única ajustable.",
    lineTops: "Boxy recortado: termina en la cintura — recomendamos tu talla habitual.",
    lineBottoms: "Caída limpia sobre el zapato — recomendamos tu talla habitual de cintura.",
    bottomsWaist: "Corte relajado — recomendamos tu talla habitual de cintura.",
    bottoms: "Corte relajado — recomendamos tu talla habitual.",
    default: "Corte boxy — recomendamos tu talla habitual. Una talla más para un volumen extra.",
    /** Notas para un producto concreto: { "slug-producto": "Texto." } */
    bySlug: {
      "crater-boot": "Talla europea de calzado. Horma amplia acolchada: si dudas entre dos, elige la menor.",
      "starfield-socks": "Talla de calzado europea: 36–40 o 41–46.",
      "astro-gloves": "S, M o L según el contorno de la mano: 19, 21 o 23 cm a la altura de los nudillos.",
    },
  },

  /* ---------- Cuidado (acordeón de la ficha) --------------------------------- */
  care: {
    jewellery: [
      "Plata de ley 925. Evita el contacto con perfumes, cloro y agua salada.",
      "Limpia con un paño suave de plata. La pátina oscura de los relieves es intencionada.",
      "Guárdala en su bolsa de algodón, separada de otras piezas.",
    ],
    leather: [
      "Limpieza en seco especializada en piel y ante.",
      "No mojar. Si se humedece, dejar secar a temperatura ambiente.",
      "Guardar en percha ancha, lejos de la luz directa.",
    ],
    accessory: ["Limpieza en seco o lavado a mano en frío.", "No usar secadora.", "Secar en plano."],
    garment: [
      "Lavar del revés a 30 °C con colores similares.",
      "No usar secadora. Secar en plano o en percha.",
      "Planchar a temperatura media del revés. No planchar bordados, parches ni acabados metalizados.",
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
      meta: ["Streetwear unisex de la era espacial.", "Catálogo permanente, sin drops.", `Base ${CITY} · ${COORDS}`],
    },
    indexNote: `Este manual fija las reglas de la identidad de ${NAME}. Es la referencia para quien diseñe, fotografíe, escriba o produzca en nombre de la marca. Como en control de misión: cada decisión, por escrito.`,
    chapters: [
      { id: "portada", num: "00", title: "Portada", short: "Portada" },
      { id: "manifiesto", num: "01", title: "Manifiesto", short: "Manifiesto", desc: "La misión y los cuatro principios." },
      { id: "logotipo", num: "02", title: "Logotipo", short: "Logotipo", desc: "Construcción, área de respeto, versiones." },
      { id: "simbolos", num: "03", title: "Sistema de órbitas", short: "Órbitas", desc: "Marca corta, marca gráfica, símbolo y sello." },
      { id: "color", num: "04", title: "Color", short: "Color", desc: `Paleta de marca, proporciones y paleta de producto ${LINE}.` },
      { id: "tipografia", num: "05", title: "Tipografía", short: "Tipografía", desc: "Tres voces: display, interfaz y telemetría." },
      { id: "fotografia", num: "06", title: "Fotografía", short: "Fotografía", desc: `La secuencia de producto, la tripulación y la línea ${LINE}.` },
      { id: "voz", num: "07", title: "Tono de voz", short: "Voz", desc: "Cómo hablamos y cómo no." },
      { id: "aplicaciones", num: "08", title: "Aplicaciones", short: "Aplicaciones", desc: "Etiquetas, parches, packaging." },
      { id: "web", num: "09", title: "Web / UI", short: "Web / UI", desc: "Componentes, retícula, tipo en pantalla." },
      { id: "contacto", num: "10", title: "Contacto", short: "Contacto", desc: "Archivos maestros y aprobaciones." },
    ],

    /* 01 · Manifiesto */
    manifesto: {
      quote: `${TAGLINE}.`,
      sub: `${MOTTO}.`,
      lead: "Julio de 1969. Un piloto con mono naranja, una sala de control llena de camisas blancas de manga corta y un traje con fuelles en las rodillas pisando polvo gris. Todo el mundo mirando hacia arriba a la vez.",
      paragraphs: [
        `${NAME} toma ese archivo —el de la carrera espacial, los parches de misión y las cápsulas— y lo corta en 2026: siluetas boxy recortadas, hombro estructurado, pantalón recto o de barril y mucho color.`,
        "No hacemos drops ni fabricamos urgencia. La única cuenta atrás que nos importa es la del despegue. Construimos un catálogo permanente: piezas que seguirán en órbita dentro de diez años.",
        "Unisex, porque la tripulación es de todos. Optimista, porque mirar hacia arriba sigue siendo una buena idea. Precisa, porque en el espacio no hay sitio para lo que sobra.",
      ],
      sign: `— ${SIGNOFF}.`,
    },
    concept: {
      title: "Cuatro principios",
      lead: `Todo lo que hace ${NAME} —una chaqueta, una etiqueta, una frase— debe poder explicarse con uno de ellos.`,
      statement: ["Misión,", "no drops."],
      pillars: [
        { k: "Tripulación", v: "Unisex en todo. Un casting fijo de cuatro caras. La marca es un nosotros que mira hacia arriba." },
        { k: "Precisión", v: "Nylon técnico, felpa pesada, punto denso, plata 925. Cada fuelle, bolsillo y cremallera tiene una función." },
        { k: "Permanencia", v: "Catálogo, no drops. Cada pieza sigue disponible, organizada por categorías, temporada tras temporada." },
        { k: "Optimismo", v: "Color de los sesenta sobre fondo blanco. La era espacial creía en el futuro; nosotros también." },
      ],
      attributes: ["Unisex", "Boxy", "Recortado", "Era espacial", "Nylon técnico", "Plata 925", "Color"],
    },

    /* 02 · Logotipo principal */
    wordmark: {
      variant: "wordmark",
      name: NAME,
      intro: `El logotipo de ${NAME} es la palabra completa, con su tilde, dibujada en una geometría ancha de la era espacial: mayúsculas extendidas, peso Bold, una O casi elíptica como una órbita y un espaciado abierto que deja respirar cada letra. La tilde es parte del dibujo: nunca se elimina.`,
      notes: [
        { k: "Uso", v: "Cabecera y pie de la web, etiquetas, bolsas, cajas, fachada. Si solo cabe una marca, es esta." },
        { k: "Dibujo", v: "El logotipo es un dibujo cerrado: no se reescribe con Syncopate ni con ninguna otra fuente, y no se reespacia." },
        { k: "Archivos", v: "wordmark.svg · wordmark-black.svg · wordmark-white.svg" },
      ],
      construction:
        "La retícula se construye con un módulo de un quinto de la altura total (H), tilde incluida. Las mayúsculas ocupan cuatro módulos y la tilde el quinto. El archivo maestro no se redibuja, no se reespacia y no se recompone.",
      gridDiv: 5,
      /** Área de respeto: x = clearRatio × altura total del logotipo, en los cuatro lados. */
      clearRatio: 0.8,
      clearLabel: "x = altura de la O",
      clearText:
        "El área de respeto es x en los cuatro lados, donde x es la altura de la O. Ningún texto, borde ni imagen entra en la zona.",
      minSizes: [
        { k: "Digital", v: "90 px de ancho", css: "90px" },
        { k: "Impresión", v: "22 mm de ancho", css: "22mm" },
        { k: "Tejido / bordado", v: "40 mm de ancho", css: "40mm" },
      ],
      minNote: "Por debajo de estas medidas la tilde y los huecos de la R y la B se cierran. En formatos más pequeños se usa la marca corta ORB o el símbolo.",
      versions: [
        { k: "Positivo", v: "Tinta Noche sobre Blanco. Versión por defecto.", bg: "var(--paper)", fg: "var(--ink)", border: true },
        { k: "Firma", v: "Naranja Seguridad sobre Tinta Noche. Hero, packaging y piezas de marca.", bg: "var(--ink)", fg: "var(--accent)" },
        { k: "Negativo", v: "Blanco sobre Tinta Noche. Etiquetas y piezas oscuras.", bg: "var(--ink)", fg: "var(--paper)" },
        { k: "Sobre Naranja", v: "Tinta Noche sobre Naranja Seguridad. Bloques de campaña.", bg: "var(--accent)", fg: "var(--ink)" },
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

    /* 03 · Sistema de órbitas (variantes de <Logo>) */
    symbolsLead: "Junto al logotipo gira un sistema de cuatro piezas unidas por la misma idea: un planeta y su órbita. La marca corta pone un planeta dentro de la O, la marca gráfica rodea la palabra con un anillo, el símbolo es la órbita sola y el sello firma el origen.",
    symbols: [
      {
        variant: "monogram",
        name: SHORT,
        alias: "Marca corta",
        when: "Bordados pequeños, etiquetas de talla, botones, joyería, avatar en redes y cualquier formato donde el logotipo no cabe. El punto dentro de la O es el planeta.",
        never: "Nunca junto al logotipo en la misma cara. Nunca sin el punto.",
        min: "36 px · 10 mm de ancho",
      },
      {
        variant: "graphic",
        name: "Marca gráfica",
        alias: "Palabra en órbita",
        when: "Solo gráficos de prenda y campañas: pecho, espalda, parches bordados, estampados grandes.",
        never: "Nunca como firma institucional: ni en la web, ni en etiquetas, ni en packaging.",
        min: "40 mm de ancho",
      },
      {
        variant: "emblem",
        name: "Símbolo",
        alias: "Órbita",
        when: "Favicon, grabados, tiradores de cremallera, herrajes, separadores y placeholders de imagen.",
        never: "Nunca girado: la órbita mantiene su inclinación de −24°. Nunca sin el satélite.",
        min: "16 px · 5 mm",
      },
      {
        variant: "seal",
        name: "Sello",
        alias: `${TAGLINE} · ${CITY}`,
        when: "Pegatina de cierre, packaging, parche de misión, certificado de joyería. Firma el origen.",
        never: "Nunca por debajo del tamaño en el que el texto deja de leerse. Nunca recompuesto.",
        min: "64 px · 20 mm",
      },
    ],
    /* 2 = soporte principal · 1 = permitido · 0 = no se usa */
    usageColumns: ["Web / UI", "Etiqueta", "Packaging", "Bordado", "Joyería", "Prenda", "Redes"],
    usage: {
      wordmark: [2, 2, 2, 1, 0, 1, 2],
      monogram: [1, 2, 1, 2, 2, 1, 2],
      graphic: [0, 0, 0, 2, 0, 2, 1],
      emblem: [2, 0, 1, 1, 2, 1, 1],
      seal: [0, 0, 2, 1, 1, 1, 1],
    },
    symbolRules: [
      "Una sola pieza del sistema por cara visible. Nunca dos marcas juntas.",
      "El logotipo manda: si el soporte lo admite, se usa el wordmark.",
      "La marca corta entra cuando el wordmark no cabe y en las piezas de oficio: bordado, plata, botones.",
      "La marca gráfica es gráfico, no firma: vive en la prenda y en la campaña.",
      "La órbita siempre inclinada a −24° y con su satélite. El sello nunca se recompone ni se combina con texto nuevo.",
    ],

    /* 04 · Color */
    colorLead: "El blanco y la Tinta Noche sostienen la marca; el Naranja Seguridad la firma. Azul Cielo, Plata y Mostaza Cápsula aportan el color de los sesenta en bloques editoriales y detalles. El Rojo Cósmico solo aparece cuando hay algo que avisar.",
    proportionsText: "Blanco y Tinta Noche dominan cualquier pieza. El Naranja es la señal: una por composición, nunca repartido en pequeños detalles. Azul Cielo y Mostaza entran en bloques enteros, no en tipografía pequeña. El Rojo es raro.",
    productPaletteText: "Nueve colores de prenda para la línea 2026: el traje blanco, el naranja de seguridad, el azul noche y la plata, con mostaza, rojo, azul cielo, verde vuelo y gris lunar. El color manda en la prenda; la interfaz sigue en blanco, Tinta Noche y Naranja.",

    /* 05 · Tipografía */
    type: {
      rampSample: TAGLINE,
      weightSample: "Misión",
      displaySample: ["Fuera de", "órbita"],
      sansSample: "Nylon técnico mate, bolsillos de bolígrafo en las mangas y paneles de parche lisos para tus propias misiones.",
      serifBig: [`${TAGLINE},`, `${MOTTO.toLowerCase()}.`],
      pairingQuote: "«T–10. Todo el mundo mirando hacia arriba a la vez.»",
      pairingCaption: "Transcripción · Manifiesto 01",
      scale: [
        { k: "Display", token: "--fs-display", web: "40–120 px", spec: "Syncopate Bold · 0,95 · 0 em", sample: `${SIGNOFF}.`, cls: "tsDisplay" },
        { k: "XL", token: "--fs-xl", web: "24–38 px", spec: "Syncopate Bold · 1,05 · 0 em", sample: "Chaquetas", cls: "tsXl" },
        { k: "LG", token: "--fs-lg", web: "20 px", spec: "Space Grotesk 400 · 1,3", sample: "Nylon técnico mate, corte boxy.", cls: "tsLg" },
        { k: "MD", token: "--fs-md", web: "15 px", spec: "Space Grotesk 400 · 1,45 · cuerpo", sample: "La chaqueta del piloto de cápsula, siempre en catálogo.", cls: "tsMd" },
        { k: "SM", token: "--fs-sm", web: "13 px", spec: "Space Grotesk 400 · 1,45", sample: "100 % nylon. Cremallera plateada.", cls: "tsSm" },
        { k: "XS caps", token: "--fs-xs", web: "11 px", spec: "Space Grotesk 500 · MAYÚSCULAS · +0,08 em", sample: "Añadir a la cesta", cls: "tsXs" },
        { k: "Micro mono", token: "--fs-micro", web: "10 px", spec: "Space Mono 400 · MAYÚSCULAS · +0,14 em", sample: "T–10 · 40°25′ N", cls: "tsMicro" },
      ],
      rules: [
        { k: "Display", v: "Syncopate solo en mayúsculas y en Bold. Titulares, marquesinas y cifras grandes. Nunca en párrafos ni en botones." },
        { k: "Mayúsculas", v: "Siempre con tracking: +0,08 em en navegación y botones; +0,14 em en la mono de telemetría. Nunca mayúsculas sin espaciar en tamaños pequeños." },
        { k: "Mono", v: "Space Mono para lemas, datos, coordenadas, horas y citas cortas. Nunca en cuerpo largo ni en interfaz funcional." },
        { k: "Interlineado", v: "1,45 en cuerpo; 0,95–1,05 en titulares." },
        { k: "Alineación", v: "A la izquierda. Centrado solo en portadas, sellos y etiquetas." },
        { k: "Signos", v: "Sin signos de exclamación. Sin emojis. Comillas latinas « ». La raya de la cuenta atrás es una raya: T–10." },
        { k: "Logotipo", v: "El logotipo y la marca corta son dibujos, no tipografías. Nunca se escriben con una fuente." },
      ],
      uiType: [
        { k: "Navegación", v: "Space Grotesk 400 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Nombre de producto", v: "Space Grotesk 400", s: "13 px", t: "0" },
        { k: "Precio", v: "Space Grotesk 400 · cifras tabulares", s: "13 px", t: "0" },
        { k: "Titular de categoría", v: "Syncopate Bold · caps", s: "24–38 px", t: "0" },
        { k: "Botón", v: "Space Grotesk 500 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Legal / telemetría", v: "Space Mono 400 · caps", s: "10 px", t: "+0,14 em" },
        { k: "Lema", v: "Space Mono 400", s: "15 px +", t: "0" },
      ],
    },

    /* 06 · Fotografía */
    photo: {
      lead: "La fotografía de producto es la tienda, y también la campaña. Dos imágenes por pieza, siempre en el mismo orden, siempre sobre blanco: primero la prenda, después la tripulación.",
      /** Producto del que se muestran las fotos (slug). null → el primero con 4 imágenes. */
      heroSlug: "capsule-flight-jacket",
      /** Con una secuencia de 2 fotos, la hoja muestra la secuencia de varios productos (slugs). */
      pairSlugs: ["capsule-flight-jacket", "silver-moon-trouser"],
      sequence: [
        { k: "01", t: "Flat lay", v: "Siempre la primera. Prenda tendida plana, cenital, sobre superficie blanca. El largo recortado se lee entero." },
        { k: "02", t: "Con la tripulación", v: "Fondo blanco, casting fijo, luz difusa. El look completo con piezas del catálogo y una pose con intención: heroica, de ingeniero o en gravedad cero." },
      ],
      castingText: "Cuatro tripulantes para todo el catálogo: Astrid, Rohan, Ama y Kai. La repetición construye familia: el cliente reconoce las caras como reconoce el logotipo.",
      rules: [
        { k: "Fondo", v: "Blanco puro. Sin texturas, sin degradados, sin color." },
        { k: "Luz", v: "Difusa y alta. Sombras suaves y cortas." },
        { k: "Formato", v: "4:5 · 1200 × 1500 px · sRGB." },
        { k: "Retoque", v: "Fiel al tejido y al color. El naranja se corrige con la carta, nunca a ojo." },
        { k: "Joyería", v: "Macro sobre blanco o sobre la piel. Metal neutro, sin tintes cálidos." },
      ],
      donts: ["Fondos de estrellas, planetas o efectos espaciales", "Filtros, grano añadido, viñeteado", "Cascos o disfraces de astronauta", "Poses de catálogo sin intención"],
      line: {
        title: `Línea ${LINE}`,
        lead: "La silueta actual: arriba, boxy recortado que termina en la cintura, con hombro estructurado; abajo, pantalón recto, barril o acampanado con caída limpia. Y todo el color de la era espacial.",
        rules: [
          { k: "Flat lay", v: "La prenda completa y cuadrada: el bajo recto, sin doblar, para que se lea el largo recortado." },
          { k: "Con modelo", v: "El bajo cae justo en la cintura y el hombro marca la línea. El pantalón llega al zapato sin acumularse." },
          { k: "Color", v: "Fiel a la paleta de producto. Se corrige la luz, nunca el tono de la prenda." },
        ],
        /** Productos a mostrar primero (slugs); el resto se completa con la línea actual. */
        slugs: ["moonwalk-puffer", "orbit-varsity", "silver-moon-trouser", "eva-rib-knit"],
      },
    },

    /* 07 · Tono de voz */
    voice: {
      lead: "Escribimos como control de misión: frases cortas, datos exactos y, de vez en cuando, una línea que mira hacia arriba. Español optimista, preciso y un poco poético con el espacio.",
      principles: [
        { k: "Optimista", v: "Hablamos del futuro con ganas. Sin cinismo ni ironía fácil." },
        { k: "Preciso", v: "Material, gramaje, corte y función. Datos antes que adjetivos, como en una lista de comprobación." },
        { k: "Poético", v: "Una imagen del espacio por texto, nunca dos. El cielo es el contexto, no el chiste." },
        { k: "Tranquilo", v: "Sin urgencia ni superlativos. Lo bueno sigue en órbita: no hace falta correr." },
      ],
      yesNo: [
        { yes: "Nylon técnico mate. Bolsillos de bolígrafo en las mangas.", no: "¡¡La chaqueta más galáctica del universo!!" },
        { yes: "Siempre en catálogo.", no: "Últimas unidades, ¡corre!" },
        { yes: `${SIGNOFF}.`, no: "No te lo pierdas." },
        { yes: "Plata 925, como un anillo de Saturno.", no: "Joyas top para tus outfits espaciales." },
      ],
      vocab: {
        yes: ["misión", "tripulación", "órbita", "catálogo", "pieza", "corte", "nylon técnico", "plata 925", "despegue"],
        no: ["drop", "hype", "galáctico", "must-have", "brutal", "chollo", "outfit", "¡!", "emojis"],
      },
      /** Frases propias de la marca. */
      expressions: [TAGLINE, MOTTO, COUNTDOWN, SIGNOFF],
      expressionsNote: "Las frases propias son señales de radio: una por pieza, nunca encadenadas. «Cambio y corto» solo cierra.",
      microcopy: [
        { k: "Botón de compra", v: "Añadir a la cesta" },
        { k: "Cesta vacía", v: "Tu cesta está vacía: la cápsula espera su carga." },
        { k: "Sin stock", v: "Agotado por ahora. Vuelve pronto: aquí no hay drops." },
        { k: "Newsletter", v: "Una transmisión al mes, nunca más." },
        { k: "Pedido confirmado", v: `Pedido confirmado. Despegue en 24 h. ${SIGNOFF}.` },
        { k: "Error 404", v: "Esta página está fuera de órbita. Volvemos a la base." },
        { k: "Error de formulario", v: "Revisa el correo electrónico." },
      ],
    },

    /* 08 · Aplicaciones (mockups: public/brand/mockups/<file>.jpg)
       Sin mockups fotográficos: `mockups: []` → el capítulo muestra aplicaciones
       tipográficas dibujadas con los logotipos (etiquetas, parche, cinta, caja). */
    applications: {
      lead: "El sistema en el mundo físico. Nylon, algodón grueso y plata; acabados mate y un solo color de señal. La marca se toca antes de leerse, como el equipo de una misión.",
      specs: [
        { k: "Materiales", v: "Papel de algodón, cartón kraft blanco, nylon técnico, damasco tejido, plata 925." },
        { k: "Acabados", v: "Impresión mate en Tinta Noche, stamping en plata, bordado en hilo naranja. Nunca brillo." },
        { k: "Color", v: "Blanco y Tinta Noche, con el Naranja Seguridad como señal. Azul Cielo y Mostaza en piezas especiales." },
      ],
      labelling: {
        title: "Etiquetado",
        text: "Lo primero que se toca. La marca corta firma la etiqueta tejida, el logotipo la etiqueta colgante y el sello la cinta de cierre. Siempre a una tinta, con el naranja como única señal.",
      },
      packaging: {
        title: "Packaging y parches",
        text: "Caja blanca con el logotipo en Tinta Noche y cinta naranja. La marca gráfica vive bordada en parches de misión; la joyería viaja en estuche con la marca corta.",
      },
      mockups: [],
      /** Aplicaciones dibujadas con los logotipos (se usan mientras `mockups` esté vacío). */
      typographic: [
        { kind: "box", t: "Caja de envío", v: "Cartón blanco, logotipo en Tinta Noche, cinta de cierre naranja y el sello como precinto.", ratio: "3 / 2" },
        { kind: "woven", t: "Etiqueta tejida y talla", v: "Damasco Tinta Noche con la marca corta en hilo blanco. Talla en raso naranja.", ratio: "4 / 5" },
        { kind: "hangtag", t: "Etiqueta colgante", v: "Cartulina de algodón Tinta Noche, logotipo naranja y los datos de la pieza en mono.", ratio: "4 / 5" },
        { kind: "patch", t: "Parche de misión", v: "El sello bordado en hilo Tinta Noche sobre sarga naranja, con borde de cordón.", ratio: "4 / 5" },
        { kind: "graphic", t: "Gráfico de prenda", v: "La palabra en órbita, serigrafiada a una tinta en la espalda.", ratio: "4 / 5" },
        { kind: "tape", t: "Cinta de cierre", v: "Cinta naranja con el logotipo y la órbita repetidos en Tinta Noche.", ratio: "8 / 5" },
        { kind: "jewel", t: "Estuche de joyería", v: "Estuche en Plata con la marca corta en relieve.", ratio: "4 / 5" },
        { kind: "stickers", t: "Pegatinas", v: "Vinilo mate troquelado: sello, órbita, marca corta y logotipo.", ratio: "4 / 5" },
      ],
    },

    /* 09 · Web / UI */
    web: {
      lead: "La web es un panel de control: fondo blanco, retícula estricta, esquinas rectas y un solo color de señal. La interfaz se retira para que hable la prenda.",
      buttons: { primary: "Añadir a la cesta", secondary: "Guía de tallas", text: "Ver el catálogo", disabled: "Agotado" },
      field: { placeholder: "Correo electrónico", button: "Unirme", help: "Una transmisión al mes, nunca más." },
      rules: [
        "Radio 0. Sin sombras. Líneas de 1 px.",
        "Hover: subrayado o inversión Tinta Noche / Blanco. El naranja solo confirma acciones.",
        "Foco siempre visible: contorno de 1 px en Tinta Noche.",
      ],
      cardNote: "Hover: la imagen pasa del flat lay a la foto con la tripulación.",
      browser: {
        announce: `Catálogo permanente · Sin drops · ${TAGLINE}`,
        nav: "Tienda · Misiones · Lookbook · Nosotros",
        navRight: "Buscar · Cuenta · Cesta (0)",
        gridTitle: "Catálogo",
      },
      grid: [
        { k: "Escritorio", v: "12 columnas · medianil y margen 24 px" },
        { k: "Móvil", v: "4 columnas · medianil y margen 12 px" },
        { k: "Producto", v: "4 por fila en escritorio, 2 en móvil · imagen 4:5" },
        { k: "Cabecera", v: "56 px, más barra de aviso de 30 px" },
      ],
    },

    /* 10 · Contacto */
    contact: {
      motto: [TAGLINE, SIGNOFF],
      cols: [
        { k: "Control de misión", v: "Cualquier uso no previsto en este manual se consulta antes de producir. Ninguna pieza se imprime sin prueba de color aprobada contra la carta del Naranja Seguridad." },
        { k: "Archivos maestros", v: "/public/brand — wordmark, monogram, graphic, emblem y seal, en Tinta Noche, blanco y currentColor." },
      ],
    },
  },
};

export default brand;
