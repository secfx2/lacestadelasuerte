/* ==========================================================================
   src/config/brand.js — FUENTE ÚNICA DE VERDAD DE LA MARCA
   --------------------------------------------------------------------------
   Todo lo que cambia de una marca a otra vive aquí: nombre, lemas, textos de
   la tienda, envíos, descuento, legal, FAQ, guía de tallas, paleta, fuentes y
   el contenido del Brand Book (/brand). Las páginas y componentes NO llevan
   texto de marca escrito a mano: leen este objeto.

   Reglas:
   - Sin imports (lo leen también los scripts de Node, p. ej. build-logo-data).
   - La UI de la tienda está en español: mantén el tono sobrio, sin emojis ni
     signos de exclamación.
   - Las fuentes se cargan en src/config/fonts.js (next/font exige literales);
     aquí solo se describen para el Brand Book.
   - Catálogo de producto: src/data/catalog.json · Campaña: src/data/campaign.json
   - Ejemplo real rellenado: la web de MUSKETEER (musketeer/), con
     name "MUSKETEER", tagline "Tous pour un", motto "Un pour tous".
   ========================================================================== */

/* ---------- Constantes básicas (se reutilizan en los textos de abajo) ------ */
const NAME = "BRAND"; //              nombre en mayúsculas: títulos, SEO, alt
const DISPLAY = "Brand"; //           nombre en texto corrido
const SHORT = "BRND"; //              marca corta / monograma
const TAGLINE = "Your tagline"; //    lema principal (MUSKETEER: «Tous pour un»)
const MOTTO = "Your motto"; //        lema secundario (MUSKETEER: «Un pour tous»)
const SIGNOFF = "Your sign-off"; //   tercera frase corta (MUSKETEER: «En garde»)
const CITY = "Tu ciudad"; //          origen (sello, legal)
const YEAR = "2026";
const LINE = "2026"; //               línea/colección actual: productos con "line": "2026"

const LOCALE = "es-ES";
const CURRENCY = "EUR";
const FREE_FROM = 150; //             envío estándar gratuito desde (€)
const STANDARD_PRICE = 4.95;
const EXPRESS_PRICE = 9.95;
const RETURN_DAYS = 30;
const DISCOUNT_CODE = "BIENVENIDA"; //código de prueba del checkout
const DISCOUNT_RATE = 0.1; //         10 %

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
  skuPrefix: "BRD", //          referencia de producto (BRD-001-NEGRO) y nº de pedido
  storageKey: "brand", //       prefijo de localStorage (cesta, favoritos, densidad)
  tagline: TAGLINE,
  motto: MOTTO,
  signoff: SIGNOFF,
  city: CITY,
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
     ink/paper/fog/bone/steel/accent/alert son los tokens que usa todo el CSS.
     ====================================================================== */
  palette: {
    ink: { hex: "#0A0A0A", name: "Tinta", role: "Texto, logotipo, botones.", cmyk: "60 · 40 · 40 · 100", pms: "Black 6 C" },
    paper: { hex: "#FFFFFF", name: "Papel", role: "Fondo. Siempre blanco.", cmyk: "0 · 0 · 0 · 0", pms: "Papel sin estucar, blanco natural" },
    fog: { hex: "#F4F4F2", name: "Niebla", role: "Superficies suaves, placeholders.", cmyk: "3 · 2 · 3 · 0", pms: "—" },
    bone: { hex: "#ECE8E1", name: "Hueso", role: "Bloques editoriales.", cmyk: "6 · 7 · 10 · 0", pms: "—" },
    steel: { hex: "#9A9DA1", name: "Acero", role: "Metal. Texto secundario sobre oscuro.", cmyk: "40 · 30 · 28 · 0", pms: "877 C (metálico)" },
    accent: { hex: "#33415C", name: "Acento", role: "Acento de marca: un detalle, nunca un fondo general.", cmyk: "84 · 68 · 34 · 22", pms: "7699 C" },
    alert: { hex: "#8E2A2A", name: "Alerta", role: "Acento raro: rebajas, avisos y errores.", cmyk: "24 · 92 · 82 · 30", pms: "7623 C" },
  },
  /** Gris de la ficha de producto en la rejilla (las fotos se multiplican sobre él). */
  tile: "#F2F2F2",
  themeColor: "#ffffff",
  /** % de uso aproximado de cada token (Brand Book · Color). */
  paletteProportions: { paper: 60, ink: 28, fog: 4, bone: 3, steel: 2, accent: 2.5, alert: 0.5 },
  /** Combinaciones aprobadas (tokens de la paleta). */
  palettePairs: [
    { fg: "ink", bg: "paper", note: "Por defecto" },
    { fg: "paper", bg: "ink", note: "Packaging, cierre" },
    { fg: "paper", bg: "accent", note: "Piezas especiales" },
    { fg: "ink", bg: "bone", note: "Editorial" },
    { fg: "steel", bg: "ink", note: "Metal, secundario" },
    { fg: "paper", bg: "alert", note: "Solo avisos" },
  ],
  /** Colores de prenda de la línea actual (producto, no marca): nunca en UI ni logo. */
  productPalette: [
    { name: "Negro lavado", hex: "#2A2A2A" },
    { name: "Crudo", hex: "#EFE6D2" },
    { name: "Gris jaspeado", hex: "#9C9C9C" },
    { name: "Azul medio", hex: "#4A6FA5" },
    { name: "Verde oliva", hex: "#5B5E3A" },
    { name: "Chocolate", hex: "#4A2C1F" },
    { name: "Arena", hex: "#CFC6B5" },
    { name: "Plata", hex: "#C0C0C0" },
  ],

  /* ======================================================================
     Fuentes (descripción). El cargador real está en src/config/fonts.js.
     ====================================================================== */
  fonts: {
    sans: {
      family: "Archivo",
      source: "Omnibus-Type · Google Fonts",
      axes: "variable: peso 100–900, anchura 62–125",
      role: "La voz funcional: interfaz, navegación, precios y cuerpo de texto. Dos anchuras en uso: normal y expanded.",
      /** Anchuras (eje wdth) que se muestran en el Brand Book; [] si la fuente no tiene eje de anchura. */
      widths: [62.5, 75, 87.5, 100, 112.5, 125],
      weights: [300, 400, 500, 600, 700],
    },
    serif: {
      family: "Instrument Serif",
      source: "Instrument · Google Fonts",
      axes: "regular e itálica",
      role: "La voz editorial: el lema, las citas y los acentos. Siempre en tamaños generosos; nunca en interfaz funcional ni en cuerpo largo.",
    },
  },

  /* ======================================================================
     SEO
     ====================================================================== */
  seo: {
    title: `${NAME} — ${TAGLINE}`,
    titleTemplate: `%s — ${NAME}`,
    description: `${NAME}. Ropa unisex de corte boxy, punto, chaquetas, accesorios y joyería. Catálogo permanente, sin drops.`,
    home: `Ropa unisex de corte boxy, color, chaquetas, punto, accesorios y joyería. Catálogo permanente, sin drops. Envío gratuito desde ${eur(FREE_FROM)}.`,
    shop: `Todo el catálogo ${NAME}: chaquetas, punto, sudaderas, camisetas, camisas, pantalones, accesorios y joyería. Siempre disponible.`,
    about: `${NAME}: el concepto, el oficio y la permanencia detrás de la marca.`,
    lookbook: `Lookbook ${NAME}: el catálogo permanente fotografiado en la ciudad.`,
    help: `Envíos, devoluciones, guía de tallas, cuidado de las piezas y métodos de pago en ${NAME}.`,
    legal: `Aviso legal, política de privacidad, cookies y condiciones de venta de ${NAME}.`,
    account: `Inicia sesión o crea tu cuenta ${NAME}.`,
    cart: `Tu cesta ${NAME}.`,
    checkout: `Finaliza tu compra en ${NAME}.`,
    favorites: `Tus piezas guardadas en ${NAME}.`,
    brandBook: `Manual de identidad de ${NAME}: logotipo, sistema de símbolos, color, tipografía, fotografía, tono de voz, aplicaciones y web.`,
  },

  /* ======================================================================
     Barra de avisos (la frase igual a `tagline` se pinta en serif)
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
    collections: "Colecciones",
    lookbook: "Lookbook",
    about: "Nosotros",
    brandBook: "Brand Book",
  },
  megaMenu: {
    /** ids de campaign.json → banners destacados en el menú «Tienda». */
    shopBanners: ["chaquetas", "joyeria"],
    /** ids de banners del menú «Colecciones» ([] = todos). */
    collectionBanners: [],
    selection: [
      { label: "Novedades", href: "/tienda?orden=novedades" },
      { label: "Best sellers", href: "/tienda" },
      { label: "Joyería", href: "/categoria/joyeria" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Guía de tallas", href: "/ayuda#tallas" },
    ],
    note: "Catálogo permanente, sin drops: todo está siempre disponible.",
  },

  /* ======================================================================
     Categorías (orden de la tienda). Deben coincidir con los `category` de
     catalog.json. `intro` = texto editorial de la cabecera de categoría.
     ====================================================================== */
  categories: [
    { slug: "chaquetas", name: "Chaquetas", intro: "Bombers, chaquetas de trabajo y lona pesada. Abrigo con oficio, hecho para durar temporadas." },
    { slug: "punto", name: "Punto", intro: "Punto pesado y de galga gruesa. Volumen boxy y tacto denso." },
    { slug: "sudaderas", name: "Sudaderas", intro: "Felpa gruesa, lavados vintage y bordados. La base del uniforme." },
    { slug: "camisetas", name: "Camisetas", intro: "Algodón de gramaje alto, corte boxy y gráficos limpios." },
    { slug: "camisas", name: "Camisas", intro: "Camisas y sobrecamisas. La parte más pulida del armario." },
    { slug: "pantalones", name: "Pantalones", intro: "Pierna recta, barril y pinzas. Denim, lona y lana fría con caída limpia." },
    { slug: "accesorios", name: "Accesorios", intro: "Gorras, cinturones, bolsas y calcetines. Los detalles que completan el uniforme." },
    { slug: "joyeria", name: "Joyería", intro: "Plata 925 maciza. Sellos, cadenas y aros, sin baño ni atajos." },
  ],
  /** «Completa el look»: categorías compatibles por categoría (orden de preferencia). */
  relatedCategories: {
    chaquetas: ["pantalones", "camisetas", "joyeria", "accesorios"],
    punto: ["pantalones", "joyeria", "chaquetas", "accesorios"],
    sudaderas: ["pantalones", "accesorios", "joyeria", "chaquetas"],
    camisetas: ["pantalones", "chaquetas", "joyeria", "accesorios"],
    camisas: ["pantalones", "joyeria", "chaquetas", "accesorios"],
    pantalones: ["sudaderas", "camisetas", "chaquetas", "accesorios"],
    accesorios: ["sudaderas", "chaquetas", "joyeria", "pantalones"],
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
     Home
     ====================================================================== */
  home: {
    hero: {
      caption: `Nueva línea ${LINE}`, // texto pequeño abajo a la izquierda (+ el tagline en serif)
      cta: "Comprar",
      ctaHref: "/tienda",
      srTitle: `${NAME} — ${TAGLINE}. Ropa unisex, accesorios y joyería.`,
    },
    /** slugs: [] → se deriva del catálogo (badge "Nuevo" o línea actual). */
    newIn: { title: "Novedades", slugs: [], limit: 10 },
    /** slugs: [] → productos con "featured": true, luego badge "Best seller", luego orden del catálogo. */
    bestSellers: { title: "Best Sellers", slugs: [], limit: 10 },
    /** ids de banners de campaign.json para el bloque doble. */
    split: ["chaquetas", "punto"],
    splitCta: "Descubrir",
    categories: {
      title: "Categorías",
      kicker: "Todo, siempre disponible",
      linkLabel: "Ver catálogo",
      /** Portada de cada categoría: { chaquetas: "slug-producto" }. Vacío → primer producto destacado. */
      covers: {},
    },
    marquee: [TAGLINE, MOTTO],
    /** Bloque destacado de una categoría (MUSKETEER: «Plata 925»). category: null lo oculta. */
    feature: {
      category: "joyeria",
      banner: "joyeria",
      title: "Joyería",
      kicker: "Hecha para durar más que la moda",
      text: "Sellos, cadenas y aros en plata de ley maciza. Sin baños, sin atajos.",
      linkLabel: "Ver joyería",
      slugs: [], // [] → primeros 4 productos de la categoría
    },
    wide: { banner: "wide", cta: "Ver catálogo" },
    lookbook: { title: "Lookbook", kicker: "Cuatro modelos, un uniforme", linkLabel: "Ver lookbook", count: 4 },
    newsletter: { title: "Únete a la lista", sealTitle: `Sello ${NAME}` },
  },

  /* ======================================================================
     Newsletter
     ====================================================================== */
  newsletter: {
    name: "La newsletter",
    lead: "Reposiciones, piezas nuevas y notas del taller. Un correo al mes, nunca más.",
    footerLead: "Reposiciones, piezas nuevas y notas del taller. Un correo al mes.",
    doneTitle: "Gracias. Ya estás en la lista.",
    doneText: "Recibirás un correo al mes, nunca más.",
    consent: `Acepto recibir comunicaciones de ${NAME}. Puedes darte de baja cuando quieras.`,
    checkoutOptIn: "Quiero recibir la newsletter (novedades y reposiciones).",
  },

  /* ======================================================================
     Páginas de la tienda
     ====================================================================== */
  shopPage: {
    title: "Tienda",
    aside: "Catálogo permanente. Sin drops, sin cuentas atrás: cada pieza está siempre disponible.",
  },
  search: {
    popular: ["Hoodie", "Denim", "Punto", "Chaqueta", "Anillo", "Gorra"],
    emptyHint: "Prueba con «hoodie», «denim» o «punto», o explora el catálogo completo.",
  },
  product: {
    perks: [`Envío gratuito desde ${eur(FREE_FROM)}`, `Devoluciones gratuitas en ${RETURN_DAYS} días`, "Catálogo permanente — siempre disponible"],
    relatedTitle: "Completa el look",
    relatedKicker: TAGLINE,
  },
  cart: {
    emptyDrawer: "empieza por lo esencial.",
    emptyPage: "el catálogo completo está siempre disponible.",
  },
  checkout: {
    /** La plantilla nunca cobra: el pago abre este aviso. */
    demoTitle: "Modo demostración",
    demoText: "Los pagos están desactivados. Ningún cargo ha sido realizado.",
    demoSub: `Esta tienda es una demostración del catálogo ${NAME}. Tu cesta se conserva intacta.`,
    countries: [
      { code: "ES", name: "España" },
      { code: "PT", name: "Portugal" },
      { code: "AD", name: "Andorra" },
    ],
  },
  account: {
    benefitsTitle: "Ventajas de tener cuenta",
    benefits: [
      "Seguimiento de pedidos y devoluciones en un clic.",
      "Favoritos sincronizados entre dispositivos.",
      "Aviso de reposiciones y piezas nuevas.",
      "Direcciones y datos de envío guardados.",
    ],
    registerThanks: "Gracias por crear tu cuenta.",
  },
  contact: {
    hours: "Atención al cliente de lunes a viernes, de 10:00 a 18:00 (hora peninsular). Respondemos en 24–48 h laborables.",
  },
  notFound: {
    title: "Perdido",
    lead: "Esta página se ha perdido por el camino. Vuelve al catálogo.",
  },

  /* ---------- Lookbook (las piezas de cada look están en campaign.json) ---- */
  lookbook: {
    title: "Lookbook",
    aside: "Cuatro modelos, un uniforme. El catálogo permanente, fotografiado en la ciudad.",
    /** Citas intercaladas: índice del look → frase. */
    quotes: { 2: MOTTO, 6: SIGNOFF },
    marquee: [TAGLINE, MOTTO],
  },

  /* ---------- Nosotros (manifiesto; en MUSKETEER era /la-maison) ---------- */
  about: {
    title: "Nosotros",
    aside: `${TAGLINE}. ${MOTTO}.`,
    eyebrow: "Manifiesto",
    lead: "Escribe aquí la frase que explica la marca en una sola línea. Lo que la hace distinta y por qué existe.",
    paragraphs: [
      `${NAME} traduce un código propio a la ropa de calle de hoy: cortes boxy, tejidos pesados, lavados que cuentan una historia y accesorios hechos para durar.`,
      "No hacemos drops. Hacemos un catálogo permanente, organizado por categorías y siempre disponible, porque creemos que una buena prenda no caduca con la temporada. Lo que te pones hoy debería seguir contigo dentro de diez años.",
    ],
    sign: TAGLINE,
    values: [
      { n: "I", title: "Comunidad", text: "Ropa unisex pensada para compartirse. Los mismos cortes, las mismas tallas, el mismo uniforme para todos." },
      { n: "II", title: "Oficio", text: "Lona pesada, felpa gruesa, punto denso. Bordados, herrajes y acabados pensados para envejecer bien." },
      { n: "III", title: "Permanencia", text: "Un catálogo, no una carrera. Sin drops ni cuentas atrás: cada pieza está siempre disponible y se repone." },
      { n: "IV", title: "Detalle", text: "Joyería maciza y accesorios con carácter. Sin baños ni atajos. Hechos para heredarse." },
    ],
    sealText: "Cada pedido llega cerrado con el sello de la casa.",
    links: [
      { eyebrow: "Brand Book", title: "Identidad de marca", text: `Logotipos, paleta, tipografía y reglas fotográficas de ${NAME}.`, cta: "Abrir Brand Book", href: "/brand" },
      { eyebrow: "Campaña", title: "Lookbook", text: "El catálogo en la ciudad.", cta: "Ver lookbook", href: "/lookbook" },
      { eyebrow: "Tienda", title: "Catálogo", text: "Chaquetas, punto, sudaderas, pantalones, accesorios y joyería.", cta: "Ver catálogo", href: "/tienda" },
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
    entity: `${NAME} S.L. (razón social pendiente)`,
    taxId: "B00000000",
    address: `Calle Ejemplo 1, 28000 ${CITY}, España`,
    email: "hola@brand.example",
    updated: "noviembre de 2026",
    notice: "Documento provisional. Esta tienda es una demostración y no realiza ventas.",
  },

  /* ---------- Ayuda / FAQ ---------------------------------------------------- */
  helpPage: {
    aside: "Respuestas claras, sin letra pequeña. Si no encuentras lo que buscas, escríbenos.",
  },
  /** Secciones de /ayuda. `tables: true` añade las tablas de medidas. */
  faq: [
    {
      id: "envios",
      title: "Envíos",
      faqs: [
        ["¿Cuánto cuesta el envío?", `El envío estándar cuesta ${eur(STANDARD_PRICE)} y es gratuito en pedidos desde ${eur(FREE_FROM)}. El envío express cuesta ${eur(EXPRESS_PRICE)}.`],
        ["¿Cuánto tarda mi pedido?", "Estándar: 2–4 días laborables. Express: 24–48 h laborables. Los pedidos realizados antes de las 13:00 salen el mismo día."],
        ["¿A dónde enviáis?", "A toda España peninsular, Baleares, Portugal y Andorra. Para Canarias, Ceuta y Melilla, consúltanos antes de realizar el pedido."],
        ["¿Puedo seguir mi pedido?", "Sí. Recibirás un correo con el número de seguimiento en cuanto tu pedido salga del almacén."],
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
        ["¿Cómo tallan las prendas?", `Casi todo es unisex. La línea ${LINE} es boxy recortada: cuerpo cuadrado que termina en la cintura y hombro estructurado. Recomendamos tu talla habitual.`],
        ["¿Cómo sé mi talla de anillo?", "Usamos tallaje español. Rodea la base del dedo con un hilo, mide la longitud en milímetros y réstale 40: ese número es tu talla. Si dudas entre dos, elige la mayor."],
        ["¿Qué largo de cadena elijo?", "45 cm queda en la base del cuello, 50 cm sobre la clavícula, 55 cm por debajo y 60 cm en la parte alta del pecho."],
      ],
      tables: true,
    },
    {
      id: "cuidado",
      title: "Cuidado de las piezas",
      faqs: [
        ["¿Cómo lavo las prendas?", "Del revés, a 30 °C y con colores similares. Sin secadora: seca en plano o en percha para que conserven la forma."],
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
        ["¿Tenéis códigos de descuento?", "Ocasionalmente: suscríbete a la newsletter para recibirlos. Los códigos se aplican en el checkout."],
        ["¿Los precios incluyen IVA?", "Sí, todos los precios incluyen el IVA (21 %)."],
      ],
    },
  ],

  /* ---------- Guía de tallas: nota de cada tabla (las medidas están en src/lib/sizeGuides.js) */
  sizeGuideNotes: {
    tops: "Medidas de la prenda en plano, en centímetros. Corte boxy: cuerpo cuadrado y hombro ligeramente caído.",
    outer: "Medidas de la prenda en plano. Pensadas para llevar sobre punto o sudadera.",
    bottoms: "Cintura elástica medida en reposo. Pierna recta de tiro relajado.",
    waist: "Talla en pulgadas de cintura. Pierna recta o barril; recomendamos tu talla habitual.",
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
    lineBottoms: "Pierna recta con caída limpia — recomendamos tu talla habitual.",
    bottomsWaist: "Corte relajado — recomendamos tu talla habitual de cintura.",
    bottoms: "Corte relajado — recomendamos tu talla habitual.",
    default: "Corte boxy — recomendamos tu talla habitual. Una talla más para un volumen extra.",
    /** Notas para un producto concreto: { "slug-producto": "Texto." } */
    bySlug: {},
  },

  /* ---------- Cuidado (acordeón de la ficha) --------------------------------- */
  care: {
    jewellery: [
      "Plata de ley 925. Evita el contacto con perfumes, cloro y agua salada.",
      "Limpia con un paño suave de plata. La pátina oscura de los relieves es intencionada.",
      "Guárdala en su bolsa de algodón, separada de otras piezas.",
    ],
    leather: [
      "Limpieza en seco especializada en piel.",
      "No mojar. Si se humedece, dejar secar a temperatura ambiente.",
      "Guardar en percha ancha, lejos de la luz directa.",
    ],
    accessory: ["Limpieza en seco o lavado a mano en frío.", "No usar secadora.", "Secar en plano."],
    garment: [
      "Lavar del revés a 30 °C con colores similares.",
      "No usar secadora. Secar en plano o en percha.",
      "Planchar a temperatura media del revés. No planchar bordados ni estampados.",
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
      meta: ["Ropa unisex de calle.", "Catálogo permanente, sin drops.", "Accesorios y joyería."],
    },
    indexNote: `Este manual fija las reglas de la identidad de ${NAME}. Es la referencia para quien diseñe, fotografíe, escriba o produzca en nombre de la marca. Ante la duda, menos.`,
    chapters: [
      { id: "portada", num: "00", title: "Portada", short: "Portada" },
      { id: "manifiesto", num: "01", title: "Manifiesto", short: "Manifiesto", desc: "El código y los cuatro principios." },
      { id: "logotipo", num: "02", title: "Logotipo", short: "Logotipo", desc: "Construcción, área de respeto, versiones." },
      { id: "simbolos", num: "03", title: "Sistema de símbolos", short: "Símbolos", desc: "Marca corta, marca gráfica, símbolo y sello." },
      { id: "color", num: "04", title: "Color", short: "Color", desc: `Paleta de marca, proporciones y paleta de producto ${LINE}.` },
      { id: "tipografia", num: "05", title: "Tipografía", short: "Tipografía", desc: "Las dos familias y la escala." },
      { id: "fotografia", num: "06", title: "Fotografía", short: "Fotografía", desc: `La secuencia de producto, el casting y la línea ${LINE}.` },
      { id: "voz", num: "07", title: "Tono de voz", short: "Voz", desc: "Cómo hablamos y cómo no." },
      { id: "aplicaciones", num: "08", title: "Aplicaciones", short: "Aplicaciones", desc: "Etiquetas, packaging, tienda." },
      { id: "web", num: "09", title: "Web / UI", short: "Web / UI", desc: "Componentes, retícula, tipo en pantalla." },
      { id: "contacto", num: "10", title: "Contacto", short: "Contacto", desc: "Archivos maestros y aprobaciones." },
    ],

    /* 01 · Manifiesto */
    manifesto: {
      quote: `${TAGLINE}.`,
      sub: `${MOTTO}.`,
      lead: "Escribe aquí el arranque del manifiesto: una imagen concreta que explique de dónde viene la marca y qué defiende.",
      paragraphs: [
        `${NAME} nace de un código —comunidad, oficio, permanencia— y lo traduce a la ropa de calle de hoy: cortes boxy, tejidos pesados, lavados que parecen vividos y piezas que se heredan.`,
        "No hacemos drops. No fabricamos urgencia. Construimos un catálogo que permanece: prendas que podrás volver a comprar dentro de diez años, porque seguirán aquí.",
        "Unisex, porque el uniforme es de todos. Silenciosa, porque no hace falta gritar.",
      ],
      sign: `— ${SIGNOFF}.`,
    },
    concept: {
      title: "Cuatro principios",
      lead: `Todo lo que hace ${NAME} —una sudadera, una etiqueta, una frase— debe poder explicarse con uno de ellos.`,
      statement: ["Catálogo,", "no drops."],
      pillars: [
        { k: "Comunidad", v: "Unisex en casi todo. Un casting fijo, una misma familia. La marca es un nosotros." },
        { k: "Oficio", v: "Felpas pesadas, denim grueso, plata 925. El valor está en el material y en el acabado." },
        { k: "Permanencia", v: "Catálogo, no drops. Cada pieza sigue disponible, organizada por categorías, temporada tras temporada." },
        { k: "Silencio", v: "Fondo blanco, mucho aire, ninguna estridencia. La seguridad no levanta la voz." },
      ],
      attributes: ["Unisex", "Boxy", "Recortado", "Gramajes pesados", "Lavados vintage", "Color", "Plata 925"],
    },

    /* 02 · Logotipo principal */
    wordmark: {
      variant: "wordmark",
      name: NAME,
      intro: `El logotipo de ${NAME}: la firma de la casa. Es la pieza principal del sistema y la única que puede representar a la marca sola. Sustituye este texto por la descripción del logotipo definitivo (dibujo, peso, inclinación, detalles).`,
      notes: [
        { k: "Uso", v: "Cabecera y pie de la web, etiquetas, bolsas, cajas, fachada. Si solo cabe una marca, es esta." },
        { k: "Dibujo", v: "El logotipo es un dibujo cerrado: no se reescribe con una fuente ni se reespacia." },
        { k: "Archivos", v: "wordmark.svg · wordmark-black.svg · wordmark-white.svg" },
      ],
      construction:
        "La retícula se construye con un módulo de un cuarto de la altura total (H). El archivo maestro no se redibuja, no se reespacia y no se recompone.",
      gridDiv: 4,
      /** Área de respeto: x = clearRatio × altura total del logotipo, en los cuatro lados. */
      clearRatio: 1,
      clearLabel: "x = altura de las letras",
      clearText:
        "El área de respeto es x en los cuatro lados, donde x es la altura de las letras. Ningún texto, borde ni imagen entra en la zona.",
      minSizes: [
        { k: "Digital", v: "100 px de ancho", css: "100px" },
        { k: "Impresión", v: "25 mm de ancho", css: "25mm" },
        { k: "Tejido / bordado", v: "40 mm de ancho", css: "40mm" },
      ],
      minNote: "Por debajo de estas medidas los huecos de las letras se cierran. En formatos más pequeños se usa la marca corta.",
      versions: [
        { k: "Positivo", v: "Tinta sobre Papel. Versión por defecto.", bg: "var(--paper)", fg: "var(--ink)", border: true },
        { k: "Negativo", v: "Papel sobre Tinta. Packaging y piezas oscuras.", bg: "var(--ink)", fg: "var(--paper)" },
        { k: "Sobre Acento", v: "Papel sobre Acento. Piezas especiales.", bg: "var(--accent)", fg: "var(--paper)" },
        { k: "Sobre Hueso", v: "Tinta sobre Hueso. Bloques editoriales.", bg: "var(--bone)", fg: "var(--ink)" },
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
    symbolsLead: "Junto al logotipo viven una marca corta, una marca gráfica, un símbolo y un sello. Cada pieza tiene su territorio y no lo abandona.",
    symbols: [
      {
        variant: "monogram",
        name: SHORT,
        alias: "Marca corta",
        when: "Bordados pequeños, joyería, botones, avatar en redes y cualquier formato donde el logotipo no cabe.",
        never: "Nunca junto al logotipo en la misma cara.",
        min: "40 px · 12 mm de ancho",
      },
      {
        variant: "graphic",
        name: "Marca gráfica",
        alias: "Gráfico de prenda",
        when: "Solo gráficos de prenda y campañas: pecho, espalda, estampado, bordado grande.",
        never: "Nunca como firma institucional: ni en la web, ni en etiquetas, ni en packaging.",
        min: "30 mm de ancho",
      },
      {
        variant: "emblem",
        name: "Símbolo",
        alias: "Emblema",
        when: "Favicon, grabados, herrajes, tiradores de cremallera y sellos pequeños.",
        never: "Nunca girado ni recortado.",
        min: "16 px · 5 mm",
      },
      {
        variant: "seal",
        name: "Sello",
        alias: `${TAGLINE} · ${CITY}`,
        when: "Pegatina de cierre, packaging, certificado de joyería. Firma el origen.",
        never: "Nunca por debajo del tamaño en el que el texto deja de leerse. Nunca recompuesto.",
        min: "64 px · 20 mm",
      },
    ],
    /* 2 = soporte principal · 1 = permitido · 0 = no se usa */
    usageColumns: ["Web / UI", "Etiqueta", "Packaging", "Bordado", "Joyería", "Prenda", "Redes"],
    usage: {
      wordmark: [2, 2, 2, 1, 0, 1, 2],
      monogram: [1, 1, 1, 2, 2, 1, 2],
      graphic: [0, 0, 0, 1, 0, 2, 1],
      emblem: [1, 0, 1, 1, 2, 1, 1],
      seal: [0, 0, 2, 0, 2, 0, 1],
    },
    symbolRules: [
      "Una sola pieza del sistema por cara visible. Nunca dos marcas juntas.",
      "El logotipo manda: si el soporte lo admite, se usa el wordmark.",
      "La marca corta entra cuando el wordmark no cabe y en las piezas de oficio: bordado, plata, botones.",
      "La marca gráfica es gráfico, no firma: vive en la prenda y en la campaña.",
      "El símbolo y el sello nunca se recomponen ni se combinan con texto nuevo.",
    ],

    /* 04 · Color */
    colorLead: "Una paleta corta y casi monocroma. El blanco y el negro sostienen la marca; el Acento la firma; la Alerta aparece solo cuando hay algo que avisar.",
    proportionsText: "Papel y Tinta dominan cualquier pieza. El Acento es un detalle, nunca un fondo general. La Alerta es rara: rebajas, avisos y errores.",
    productPaletteText: "El color entra en la prenda, no en la marca: logotipo, web y packaging siguen en Tinta y Papel.",

    /* 05 · Tipografía */
    type: {
      rampSample: TAGLINE,
      weightSample: "Oficio",
      serifBig: [`${TAGLINE},`, `${MOTTO.toLowerCase()}.`],
      pairingQuote: "«Una frase bien puesta vale más que tres adjetivos.»",
      pairingCaption: "Manifiesto · 01",
      scale: [
        { k: "Display", token: "--fs-display", web: "48–140 px", spec: "Sans Expanded 500 · 0,95 · −0,02 em", sample: `${SIGNOFF}.`, cls: "tsDisplay" },
        { k: "XL", token: "--fs-xl", web: "28–44 px", spec: "Sans Expanded 500 · 1,05 · −0,01 em", sample: "Chaquetas", cls: "tsXl" },
        { k: "LG", token: "--fs-lg", web: "20 px", spec: "Sans 400 · 1,3", sample: "Felpa de 500 g/m², corte boxy.", cls: "tsLg" },
        { k: "MD", token: "--fs-md", web: "15 px", spec: "Sans 400 · 1,45 · cuerpo", sample: "Nuestra sudadera insignia, siempre en catálogo.", cls: "tsMd" },
        { k: "SM", token: "--fs-sm", web: "13 px", spec: "Sans 400 · 1,45", sample: "100 % algodón. Lavado vintage.", cls: "tsSm" },
        { k: "XS caps", token: "--fs-xs", web: "11 px", spec: "Sans 400 · MAYÚSCULAS · +0,08 em", sample: "Añadir a la cesta", cls: "tsXs" },
        { k: "Micro caps", token: "--fs-micro", web: "10 px", spec: "Sans 400 · MAYÚSCULAS · +0,22 em", sample: "Guía de tallas", cls: "tsMicro" },
      ],
      rules: [
        { k: "Mayúsculas", v: "Siempre con tracking: +0,08 em en navegación y metadatos; +0,22 em en micro y legales. Nunca mayúsculas sin espaciar." },
        { k: "Expanded", v: "Solo titulares y frases cortas. Nunca en párrafos ni en botones." },
        { k: "Serif", v: "Para el lema, citas y acentos. Nunca en UI funcional ni en cuerpo largo." },
        { k: "Interlineado", v: "1,45 en cuerpo; 0,95–1,05 en titulares." },
        { k: "Alineación", v: "A la izquierda. Centrado solo en portadas, sellos y etiquetas." },
        { k: "Signos", v: "Sin signos de exclamación. Sin emojis. Comillas latinas « »." },
        { k: "Logotipo", v: "El logotipo y la marca corta son dibujos, no tipografías. Nunca se escriben con una fuente." },
      ],
      uiType: [
        { k: "Navegación", v: "Sans 400 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Nombre de producto", v: "Sans 400", s: "13 px", t: "0" },
        { k: "Precio", v: "Sans 400 · cifras tabulares", s: "13 px", t: "0" },
        { k: "Titular de categoría", v: "Sans Expanded 500 · caps", s: "28–44 px", t: "−0,01 em" },
        { k: "Botón", v: "Sans 500 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Legal", v: "Sans 400 · caps", s: "10 px", t: "+0,22 em" },
        { k: "Cita / lema", v: "Serif itálica", s: "20 px +", t: "0" },
      ],
    },

    /* 06 · Fotografía */
    photo: {
      lead: "La fotografía de producto es la tienda. Cuatro imágenes por prenda, siempre en el mismo orden, siempre sobre blanco.",
      /** Producto del que se muestran las 4 fotos (slug). null → el primero con 4 imágenes. */
      heroSlug: null,
      sequence: [
        { k: "01", t: "Flat lay", v: "Siempre la primera. Prenda tendida plana, cenital, sobre superficie blanca. Sin arrugas forzadas." },
        { k: "02", t: "Con modelo", v: "Fondo blanco, casting fijo, luz difusa. La prenda manda, no la pose." },
        { k: "03", t: "Vista alternativa", v: "La prenda sola de nuevo: espalda, perfil o tres cuartos." },
        { k: "04", t: "Detalle", v: "Macro del tejido, el lavado, el bordado o el metal." },
      ],
      castingText: "Cuatro modelos para todo el catálogo. La repetición construye familia: el cliente reconoce las caras como reconoce el logotipo.",
      rules: [
        { k: "Fondo", v: "Blanco puro. Sin texturas, sin degradados, sin color." },
        { k: "Luz", v: "Difusa y cenital. Sombras suaves y cortas." },
        { k: "Formato", v: "4:5 · 1200 × 1500 px · sRGB." },
        { k: "Retoque", v: "Fiel al tejido y al lavado. No se corrige el color de la prenda." },
        { k: "Joyería", v: "Macro sobre blanco. Metal neutro, sin tintes cálidos." },
      ],
      donts: ["Fondos de color o exteriores en ficha", "Filtros, grano añadido, viñeteado", "Atrezo y objetos de decoración", "Poses forzadas o gestos de catálogo"],
      line: {
        title: `Línea ${LINE}`,
        lead: "La silueta actual: arriba, boxy recortado que termina en la cintura, con hombro estructurado; abajo, pantalón recto o barril con caída limpia. Y entra el color.",
        rules: [
          { k: "Flat lay", v: "La prenda completa y cuadrada: el bajo recto, sin doblar, para que se lea el largo recortado." },
          { k: "Con modelo", v: "El bajo cae justo en la cintura y el hombro marca la línea. El pantalón llega al zapato sin acumularse." },
          { k: "Color", v: "Fiel a la paleta de producto. Se corrige la luz, nunca el tono de la prenda." },
        ],
        /** Productos a mostrar primero (slugs); el resto se completa con la línea actual. */
        slugs: [],
      },
    },

    /* 07 · Tono de voz */
    voice: {
      lead: "Escribimos como vestimos: pocas piezas, bien elegidas. Español sobrio, directo, con alguna frase propia de la marca.",
      principles: [
        { k: "Sobrio", v: "Decimos menos. Una frase bien puesta vale más que tres adjetivos." },
        { k: "Seguro", v: "Sin superlativos ni urgencia. Lo bueno no necesita insistir." },
        { k: "Preciso", v: "Hablamos de material, corte y acabado. Datos antes que adjetivos." },
        { k: "Cercano", v: "Tuteamos. Hablamos como se habla entre amigos que saben de ropa." },
      ],
      yesNo: [
        { yes: "Felpa de 500 g/m². Hecha para durar.", no: "¡¡La sudadera más brutal del año!!" },
        { yes: "Siempre en catálogo.", no: "Últimas unidades, ¡corre!" },
        { yes: `${SIGNOFF}.`, no: "No te lo pierdas." },
        { yes: "Plata 925, pulida a mano.", no: "Joyas top para tus outfits." },
      ],
      vocab: {
        yes: ["catálogo", "pieza", "prenda", "oficio", "gramaje", "corte", "lavado", "plata 925", "uniforme"],
        no: ["drop", "hype", "edición limitada", "must-have", "brutal", "chollo", "outfit", "¡!", "emojis"],
      },
      /** Frases propias de la marca (MUSKETEER: sus guiños en francés). */
      expressions: [TAGLINE, MOTTO, SIGNOFF],
      expressionsNote: "Las frases propias son un guiño: una por pieza, nunca una frase entera.",
      microcopy: [
        { k: "Botón de compra", v: "Añadir a la cesta" },
        { k: "Cesta vacía", v: "Tu cesta está vacía. El catálogo sigue aquí." },
        { k: "Sin stock", v: "Agotado por ahora. Vuelve pronto: aquí no hay drops." },
        { k: "Newsletter", v: "Un correo al mes, nunca más." },
        { k: "Pedido confirmado", v: `Pedido confirmado. ${TAGLINE}.` },
        { k: "Error 404", v: "Esta página se ha perdido. Vuelve al catálogo." },
        { k: "Error de formulario", v: "Revisa el correo electrónico." },
      ],
    },

    /* 08 · Aplicaciones (mockups: public/brand/mockups/<file>.jpg) */
    applications: {
      lead: "El sistema en el mundo físico. Materiales nobles, acabados mate, ningún brillo innecesario: la marca se toca antes de leerse.",
      specs: [
        { k: "Materiales", v: "Papel de algodón, cartón rígido soft-touch, damasco tejido, ante." },
        { k: "Acabados", v: "Impresión mate, stamping en plata o blanco. Nunca brillo." },
        { k: "Color", v: "Negro y blanco. El Acento solo en piezas especiales." },
      ],
      labelling: {
        title: "Etiquetado y bolsa",
        text: "Lo primero que se toca. El logotipo firma la etiqueta tejida, la colgante y la bolsa; la marca gráfica vive en la prenda. Siempre en una sola tinta.",
      },
      packaging: {
        title: "Packaging y joyería",
        text: "Caja rígida negra, papel de seda blanco y el sello como cierre. La joyería viaja en estuche con la marca corta.",
      },
      mockups: [
        { file: "storefront", t: "Escaparate", v: "Logotipo en vinilo blanco mate sobre vidrio.", ratio: "3 / 2" },
        { file: "woven-label", t: "Etiqueta tejida y talla", v: "Damasco negro tejido en hilo crudo. Talla en raso blanco.", ratio: "4 / 5" },
        { file: "hang-tag", t: "Etiqueta colgante", v: "Papel de algodón grueso, impresión negra, cordón encerado.", ratio: "4 / 5" },
        { file: "shopping-bag", t: "Bolsa", v: "Papel negro soft-touch, asas de algodón, logotipo en blanco.", ratio: "4 / 5" },
        { file: "embroidered-patch", t: "Gráfico de prenda", v: "Marca gráfica bordada en punto satén sobre felpa lavada.", ratio: "4 / 5" },
        { file: "garment-box", t: "Caja de prenda", v: "Caja rígida negra, papel de seda y el sello como cierre.", ratio: "3 / 2" },
        { file: "jewellery-box", t: "Joyería", v: "Estuche con la marca corta en plata.", ratio: "4 / 5" },
        { file: "sticker-sheet", t: "Pegatinas", v: "Vinilo mate troquelado: sello, símbolo, marca corta y logotipo.", ratio: "4 / 5" },
      ],
    },

    /* 09 · Web / UI */
    web: {
      lead: "La web es un catálogo: fondo blanco, retícula estricta, esquinas rectas. La interfaz se retira para que hable la prenda.",
      buttons: { primary: "Añadir a la cesta", secondary: "Guía de tallas", text: "Ver el catálogo", disabled: "Agotado" },
      field: { placeholder: "Correo electrónico", button: "Unirme", help: "Un correo al mes, nunca más." },
      rules: [
        "Radio 0. Sin sombras. Líneas de 1 px.",
        "Hover: subrayado o inversión Tinta / Papel. Sin animación decorativa.",
        "Foco siempre visible: contorno de 1 px en Tinta.",
      ],
      cardNote: "Hover: la imagen pasa del flat lay a la foto con modelo.",
      browser: {
        announce: `Catálogo permanente · Sin drops · ${TAGLINE}`,
        nav: "Catálogo · Sudaderas · Chaquetas · Joyería",
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
      motto: [TAGLINE, MOTTO],
      cols: [
        { k: "Equipo de marca", v: "Cualquier uso no previsto en este manual se consulta antes de producir. Ninguna pieza se imprime sin prueba de color aprobada." },
        { k: "Archivos maestros", v: "/public/brand — wordmark, monogram, graphic, emblem y seal, en negro, blanco y currentColor." },
      ],
    },
  },
};

export default brand;
