/* ==========================================================================
   src/config/brand.js — FUENTE ÚNICA DE VERDAD DE LA MARCA · PECADO
   --------------------------------------------------------------------------
   Todo lo que cambia de una marca a otra vive aquí: nombre, lemas, textos de
   la tienda, envíos, descuento, legal, FAQ, guía de tallas, paleta, fuentes y
   el contenido del Brand Book (/brand). Las páginas y componentes NO llevan
   texto de marca escrito a mano: leen este objeto.

   Reglas:
   - Sin imports (lo leen también los scripts de Node, p. ej. build-logo-data).
   - La UI de la tienda está en español de España: frases cortas, oscuras e
     irónicas, de calle. Sin emojis ni signos de exclamación.
   - La web es OSCURA: los tokens están invertidos respecto a la plantilla.
     --paper es el fondo (Asfalto, casi negro) y --ink el texto (Hueso).
   - Las fuentes se cargan en src/config/fonts.js (next/font exige literales);
     aquí solo se describen para el Brand Book.
   - Catálogo de producto: src/data/catalog.json · Campaña: src/data/campaign.json
   ========================================================================== */

/* ---------- Constantes básicas (se reutilizan en los textos de abajo) ------ */
const NAME = "PECADO"; //                         nombre en mayúsculas: títulos, SEO, alt
const DISPLAY = "Pecado"; //                      nombre en texto corrido
const SHORT = "PCD"; //                           marca corta / monograma
const TAGLINE = "Sin perdón"; //                  lema principal
const MOTTO = "Todos los santos tienen pasado"; // lema secundario
const SIGNOFF = "Reza lo que sepas"; //           tercera frase corta (cierre)
const CITY = "Madrid"; //                         origen (sello, legal)
const YEAR = "2026";
const LINE = "2026"; //                           línea/colección actual: productos con "line": "2026"

const LOCALE = "es-ES";
const CURRENCY = "EUR";
const FREE_FROM = 100; //                         envío estándar gratuito desde (€)
const STANDARD_PRICE = 4.95;
const EXPRESS_PRICE = 9.95;
const RETURN_DAYS = 30;
const DISCOUNT_CODE = "SINPERDON"; //             código de prueba del checkout
const DISCOUNT_RATE = 0.1; //                     10 %

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
  skuPrefix: "PCD", //          referencia de producto (PCD-001-WASHEDBLACK) y nº de pedido
  storageKey: "pecado", //      prefijo de localStorage (cesta, favoritos, densidad)
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
     Web oscura: paper = fondo (Asfalto), ink = texto y botones (Hueso).
     ash es un token extra de PECADO (--ash: texto secundario).
     ====================================================================== */
  palette: {
    ink: { hex: "#E9E2D3", name: "Hueso", role: "Texto, logotipo y botones sobre Asfalto. El color del pespunte grueso y de las cruces bordadas.", cmyk: "7 · 9 · 17 · 0", pms: "7527 C" },
    paper: { hex: "#0B0B0C", name: "Asfalto", role: "Fondo de la web, del packaging y de la etiqueta. Casi negro, nunca negro puro.", cmyk: "75 · 68 · 67 · 90", pms: "Black 6 C" },
    fog: { hex: "#18171A", name: "Hollín", role: "Superficies de la interfaz y placeholders: un paso por encima del Asfalto.", cmyk: "72 · 66 · 62 · 82", pms: "Neutral Black C" },
    bone: { hex: "#2B2A2D", name: "Negro lavado", role: "Bloques editoriales, newsletter y fondos de bloque. El negro de una sudadera lavada a la piedra.", cmyk: "68 · 62 · 56 · 62", pms: "419 C" },
    steel: { hex: "#BFC2C6", name: "Plata", role: "Metal, joyería y foil. Texto sobre Burdeos.", cmyk: "24 · 16 · 14 · 0", pms: "877 C (metálico)" },
    ash: { hex: "#8C8A88", name: "Ceniza", role: "Texto secundario, metadatos y precios tachados. El gris desteñido.", cmyk: "45 · 38 · 38 · 4", pms: "Cool Gray 8 C" },
    accent: { hex: "#4A1015", name: "Burdeos", role: "Acento de marca: insignias, la barra superior, confirmaciones y bloques de campaña. Un detalle, nunca el fondo general.", cmyk: "30 · 95 · 80 · 60", pms: "4975 C" },
    alert: { hex: "#E0574D", name: "Herida", role: "Solo errores y avisos en pantalla. La versión legible sobre Asfalto del rojo sangre del gráfico.", cmyk: "0 · 75 · 66 · 0", pms: "7416 C" },
  },
  /** Tinta de los logotipos -black.svg (favicon, máscaras, impresión): el Asfalto, no el Hueso. */
  logoInk: "#0B0B0C",
  /** Gris claro de la ficha de producto: los flat lays (foto 1, sobre blanco) se multiplican
   *  sobre él. Las fotos con modelo (foto 2, pared de hormigón) se muestran tal cual. */
  tile: "#E2E0DB",
  themeColor: "#0B0B0C",
  /** % de uso aproximado de cada token (Brand Book · Color). */
  paletteProportions: { paper: 58, ink: 22, fog: 6, bone: 6, ash: 4, accent: 2, steel: 1.5, alert: 0.5 },
  /** Combinaciones aprobadas (tokens de la paleta). */
  palettePairs: [
    { fg: "ink", bg: "paper", note: "Por defecto: la web" },
    { fg: "paper", bg: "ink", note: "Botones, etiqueta colgante" },
    { fg: "ink", bg: "accent", note: "Insignias, barra superior" },
    { fg: "ink", bg: "bone", note: "Bloques editoriales" },
    { fg: "steel", bg: "paper", note: "Metal, joyería" },
    { fg: "ash", bg: "paper", note: "Texto secundario" },
    { fg: "alert", bg: "paper", note: "Solo errores" },
  ],
  /** Colores de prenda de la línea actual (producto, no marca): nunca en UI ni logo. */
  productPalette: [
    { name: "Negro lavado", hex: "#2B2A2D" },
    { name: "Índigo crudo", hex: "#1F2A44" },
    { name: "Ceniza", hex: "#8C8A88" },
    { name: "Hueso", hex: "#E9E2D3" },
    { name: "Plata", hex: "#BFC2C6" },
    { name: "Rojo sangre", hex: "#B3121B" },
    { name: "Lima tóxica", hex: "#B6F20D" },
    { name: "Rosa bebé", hex: "#F6C6D6" },
    { name: "Azul hielo", hex: "#9DB8C9" },
  ],

  /* ======================================================================
     Fuentes (descripción). El cargador real está en src/config/fonts.js:
     display → var(--font-display) · sans → var(--font-sans) · serif (aquí,
     la fraktur del logotipo) → var(--font-serif). Los nombres de variable se
     conservan de la plantilla.
     ====================================================================== */
  fonts: {
    display: {
      family: "Grenze Gotisch",
      source: "Omnibus-Type · Google Fonts",
      axes: "variable: peso 100–900",
      role: "La voz de los titulares: secciones, categorías, nombres de pieza y campaña. Una gótica híbrida que se lee de un vistazo. Siempre en caja alta y baja, nunca en mayúsculas seguidas.",
      weights: [400, 600, 800],
    },
    sans: {
      family: "Archivo",
      source: "Omnibus-Type · Google Fonts",
      axes: "variable: peso 100–900, anchura 62–125",
      role: "La voz funcional: navegación, precios, tallas, botones y checkout. Mayúsculas espaciadas para las etiquetas; expanded para los gritos cortos.",
      /** Anchuras (eje wdth) que se muestran en el Brand Book; [] si la fuente no tiene eje de anchura. */
      widths: [62.5, 75, 87.5, 100, 112.5, 125],
      weights: [300, 400, 500, 600, 700],
    },
    serif: {
      family: "UnifrakturMaguntia",
      source: "Proyecto Unifraktur · Google Fonts",
      axes: "regular 400, sin cursiva ni negrita",
      role: "La voz del logotipo: lemas, frases propias y campaña. Solo en tamaños grandes. El logotipo nace de ella, pero no se escribe con ella: es un dibujo cerrado.",
    },
  },

  /* ======================================================================
     SEO
     ====================================================================== */
  seo: {
    title: `${NAME} — ${TAGLINE}`,
    titleTemplate: `%s — ${NAME}`,
    description: `${NAME}. Streetwear Y2K grunge desde ${CITY}: vaqueros ultra baggy bordados, sudaderas lavadas con el bajo deshilachado, chándal, camisetas gráficas, tachas y plata 925. Catálogo, no drops.`,
    home: `Vaqueros ultra baggy, sudaderas pesadas lavadas, conjuntos de chándal, camisetas gráficas, cinturones de tachas y plata 925. Catálogo permanente desde ${CITY}. Envío gratis desde ${eur(FREE_FROM)}.`,
    shop: `Todo el catálogo ${NAME}: vaqueros, sudaderas, chándal, camisetas, polos y camisas, chaquetas, capas, accesorios y joyería. Siempre disponible.`,
    about: `${NAME}: el manifiesto. Ropa de calle oscura, pesada y llevable, hecha en ${CITY}. ${TAGLINE}.`,
    lookbook: `Lookbook ${NAME}: cuatro caras, una pared de hormigón y el catálogo puesto.`,
    help: `Envíos, devoluciones, guía de tallas (cintura de vaquero, tops, anillos, cinturones y calzado), cuidado de las piezas y pagos en ${NAME}.`,
    legal: `Aviso legal, privacidad, cookies y condiciones de venta de ${NAME}.`,
    account: `Inicia sesión o crea tu cuenta ${NAME}.`,
    cart: `Tu cesta ${NAME}.`,
    checkout: `Finaliza tu compra en ${NAME}.`,
    favorites: `Tus piezas guardadas en ${NAME}.`,
    brandBook: `Manual de identidad de ${NAME}: logotipo blackletter, cruz alada y anillo de espinas, color, tipografía, fotografía, tono de voz, aplicaciones y web.`,
  },

  /* ======================================================================
     Barra de avisos (la frase igual a `tagline` se pinta en la fraktur)
     ====================================================================== */
  announcements: [
    `Envío gratis desde ${eur(FREE_FROM)}`,
    `Devoluciones gratis en ${RETURN_DAYS} días`,
    "Catálogo, no drops",
    TAGLINE,
  ],

  /* ======================================================================
     Navegación
     ====================================================================== */
  routes: { about: ABOUT_HREF },
  nav: {
    shop: "Tienda",
    collections: "Pecados",
    lookbook: "Lookbook",
    about: "Nosotros",
    brandBook: "Brand Book",
  },
  megaMenu: {
    /** ids de campaign.json → banners destacados en el menú «Tienda». */
    shopBanners: ["vaqueros", "sudaderas"],
    /** ids de banners del menú «Pecados» ([] = todos). */
    collectionBanners: ["chaquetas", "chandal", "camisetas", "joyeria"],
    selection: [
      { label: "Novedades", href: "/tienda?orden=novedades" },
      { label: "Top ventas", href: "/tienda" },
      { label: "Conjuntos", href: "/categoria/chandal" },
      { label: "Plata 925", href: "/categoria/joyeria" },
      { label: "Favoritos", href: "/favoritos" },
      { label: "Guía de tallas", href: "/ayuda#tallas" },
    ],
    note: "Catálogo, no drops: lo que ves sigue aquí mañana.",
  },

  /* ======================================================================
     Categorías (orden de la tienda). Deben coincidir con los `category` de
     catalog.json. `intro` = texto editorial de la cabecera de categoría.
     ====================================================================== */
  categories: [
    { slug: "vaqueros", name: "Vaqueros", intro: "Ultra baggy de verdad: pernera recta de 34 cm, bolsillos traseros XL y bordados que se ven desde la otra acera. Se comen la zapatilla." },
    { slug: "sudaderas", name: "Sudaderas", intro: "Felpa de 450 g/m², boxy y corta, con el bajo y los puños deshilachados. Lavadas a la piedra y estampadas con espinas, llamas y costillas." },
    { slug: "chandal", name: "Chándal", intro: "Pantalones de felpa anchos con el mismo lavado que su sudadera. El conjunto entero o la mitad, como quieras." },
    { slug: "camisetas", name: "Camisetas", intro: "Foil agrietado, rhinestones, malla y baby tees. Una encima de otra, como se lleva." },
    { slug: "polos-y-camisas", name: "Polos y camisas", intro: "Polos con cremallera, camisas bowling y de campamento con gráfico gótico. Lo más arreglado que vas a llevar." },
    { slug: "chaquetas", name: "Chaquetas", intro: "Biker, varsity, denim y plumífero. Cuero gastado, tachas y bordados en la espalda." },
    { slug: "capas", name: "Capas", intro: "Manga larga, térmicas, malla, rejilla y punto roto. Lo que va debajo y asoma por los agujeros." },
    { slug: "accesorios", name: "Accesorios", intro: "Cinturones de tachas, mochila, cadenas, gorros, gorras deshilachadas y zapatillas skate. Lo que remata el look." },
    { slug: "joyeria", name: "Joyería", intro: "Plata de ley 925, oxidada en los relieves. Cruces, espinas, alas y aros." },
  ],
  /** Categorías de parte de abajo: notas de corte y guía de tallas de pantalón (la plantilla usaba «pantalones»). */
  bottomCategories: ["vaqueros", "chandal"],
  /** «Completa el look»: categorías compatibles por categoría (orden de preferencia). */
  relatedCategories: {
    vaqueros: ["sudaderas", "camisetas", "accesorios", "joyeria"],
    sudaderas: ["vaqueros", "chandal", "accesorios", "joyeria"],
    chandal: ["sudaderas", "camisetas", "accesorios", "capas"],
    camisetas: ["vaqueros", "capas", "chaquetas", "joyeria"],
    "polos-y-camisas": ["vaqueros", "capas", "accesorios", "joyeria"],
    chaquetas: ["vaqueros", "camisetas", "sudaderas", "accesorios"],
    capas: ["camisetas", "vaqueros", "chaquetas", "joyeria"],
    accesorios: ["vaqueros", "sudaderas", "joyeria", "chaquetas"],
    joyeria: ["joyeria", "camisetas", "accesorios", "capas"],
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
     Home (sin fotos de campaña: el hero es una pared de fotos con modelo de
     catalog.json, ver campaign.json → hero.wall)
     ====================================================================== */
  home: {
    hero: {
      eyebrow: `Catálogo ${LINE} · ${CITY}`, //   texto pequeño arriba a la izquierda
      caption: "Vaqueros, sudaderas y plata", //  texto pequeño abajo
      cta: "Comprar",
      ctaHref: "/tienda",
      secondary: "Ver lookbook",
      secondaryHref: "/lookbook",
      srTitle: `${NAME} — ${TAGLINE}. Streetwear Y2K grunge desde ${CITY}: vaqueros ultra baggy, sudaderas lavadas, chándal y plata 925.`,
    },
    /** slugs explícitos: las piezas con la etiqueta «Nuevo» (toda la línea es 2026). */
    newIn: {
      title: "Novedades",
      slugs: ["wingspan-jean", "spine-hoodie", "thorn-vine-jean", "x-ray-storm-hoodie", "frost-thorn-hoodie", "thornstorm-sweatpant", "second-skin-tee", "requiem-varsity", "static-zip-polo", "fat-tongue-skate"],
      limit: 10,
    },
    /** slugs: [] → «featured», luego la etiqueta «Top». Aquí, a mano: vaqueros y sudaderas primero. */
    bestSellers: {
      title: "Top ventas",
      slugs: ["seraph-baggy", "blood-vine-hoodie", "cathedral-hoodie", "phantom-full-zip", "halo-foil-tee", "sinner-biker", "bone-pyramid-belt", "spike-ring", "relic-denim-jacket", "chapel-polo"],
      limit: 10,
    },
    /** ids de banners de campaign.json para el bloque doble (las dos estrellas). */
    split: ["vaqueros", "sudaderas"],
    splitCta: "Entrar",
    categories: {
      title: "Categorías",
      kicker: "Nueve formas de pecar",
      linkLabel: "Ver catálogo",
      /** Portada de cada categoría (se usa la foto con modelo). */
      covers: {
        vaqueros: "seraph-baggy",
        sudaderas: "blood-vine-hoodie",
        chandal: "spine-sweatpant",
        camisetas: "halo-foil-tee",
        "polos-y-camisas": "chapel-polo",
        chaquetas: "sinner-biker",
        capas: "ruin-knit",
        accesorios: "reliquary-backpack",
        joyeria: "filigree-cross",
      },
    },
    marquee: [TAGLINE, MOTTO, SIGNOFF],
    /** Bloque destacado: los conjuntos de chándal (sudadera + pantalón del mismo lavado). */
    feature: {
      category: "chandal",
      banner: "chandal",
      title: "Conjuntos",
      kicker: "Sudadera y pantalón, mismo baño",
      text: "Spine, X-Ray Storm, Frost Thorn y Flame Wash: la sudadera y su pantalón salen del mismo lavado. Juntos o por separado.",
      linkLabel: "Ver chándal",
      slugs: ["spine-sweatpant", "x-ray-storm-jogger", "frost-thorn-sweatpant", "ember-sweatpant"],
    },
    /** Banner ancho tipográfico (sin foto): título en dos líneas + texto + CTA. */
    wide: {
      banner: "wide",
      cta: "Ver catálogo",
      lines: ["Todos los santos", "tienen pasado"],
      text: "Un catálogo que no caduca. Sin drops, sin cuentas atrás, sin colas en la puerta: lo que ves sigue aquí mañana.",
      note: `${SIGNOFF}.`,
    },
    lookbook: { title: "Lookbook", kicker: "Cuatro caras, una pared", linkLabel: "Ver lookbook", count: 4 },
    newsletter: { title: "Entra en la lista", sealTitle: `Sello ${NAME}` },
  },

  /* ======================================================================
     Newsletter
     ====================================================================== */
  newsletter: {
    name: "La lista",
    lead: "Reposiciones, piezas nuevas y algún secreto. Un correo al mes. Ni uno más.",
    footerLead: "Reposiciones, piezas nuevas y algún secreto. Un correo al mes.",
    doneTitle: "Dentro. Ya no hay vuelta atrás.",
    doneText: "Un correo al mes. Ni uno más.",
    consent: `Acepto recibir comunicaciones de ${NAME}. Puedes darte de baja cuando quieras.`,
    checkoutOptIn: "Quiero entrar en la lista (novedades y reposiciones).",
  },

  /* ======================================================================
     Páginas de la tienda
     ====================================================================== */
  shopPage: {
    title: "Tienda",
    aside: "Catálogo, no drops. Todo sigue aquí mañana. Y pasado.",
  },
  search: {
    popular: ["Baggy", "Hoodie", "Cruz", "Chándal", "Tachas", "Plata"],
    emptyHint: "Prueba con «baggy», «hoodie» o «cruz», o mira el catálogo entero.",
  },
  product: {
    perks: [`Envío gratis desde ${eur(FREE_FROM)}`, `Devoluciones gratis en ${RETURN_DAYS} días`, "Catálogo permanente — no se agota por diseño"],
    relatedTitle: "Completa el look",
    relatedKicker: TAGLINE,
  },
  cart: {
    emptyDrawer: "nada que confesar todavía.",
    emptyPage: "el catálogo entero te está esperando.",
  },
  checkout: {
    /** La plantilla nunca cobra: el pago abre este aviso. */
    demoTitle: "Modo demostración",
    demoText: "Los pagos están desactivados. No se ha cobrado nada.",
    demoSub: `Esta tienda es una demostración del catálogo ${NAME}. Tu cesta sigue intacta.`,
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
      "Favoritos guardados en todos tus dispositivos.",
      "Aviso cuando vuelve tu talla.",
      "Direcciones y datos de envío guardados.",
    ],
    registerThanks: "Cuenta creada. Ya eres de los nuestros.",
  },
  contact: {
    hours: "Atención al cliente de lunes a viernes, de 10:00 a 18:00 (hora peninsular). Contestamos en 24–48 h laborables.",
  },
  notFound: {
    title: "Perdido",
    lead: "Esta página se fue de casa y no ha vuelto. Vuelve al catálogo.",
  },

  /* ---------- Lookbook (las piezas de cada look están en campaign.json) ---- */
  lookbook: {
    title: "Lookbook",
    aside: "Cuatro caras y una pared de hormigón. El catálogo puesto, sin atrezo.",
    /** Citas intercaladas: índice del look → frase. */
    quotes: { 2: MOTTO, 6: SIGNOFF },
    marquee: [TAGLINE, MOTTO, SIGNOFF],
  },

  /* ---------- Nosotros (manifiesto) ------------------------------------------ */
  about: {
    title: "Nosotros",
    aside: `${TAGLINE}. ${MOTTO}.`,
    eyebrow: "Manifiesto",
    lead: "Nadie sale del cuarto con los cascos puestos para pasar desapercibido.",
    paragraphs: [
      `${NAME} nace en ${CITY} para los que bajan al skatepark con la capucha puesta y suben al metro con dos camisetas, una encima de otra. Vaqueros que se comen la zapatilla, sudaderas lavadas hasta perder el color, un cinturón de tachas y una cruz de plata que pesa lo que tiene que pesar.`,
      "Cogemos la iconografía de cementerio y de catedral —cruces aladas, espinas, filigrana, ángeles de piedra, llamas— y la pasamos a gráfico de calle. Todo es nuestro y nada se lee: lo que parece texto es ornamento.",
      "No hacemos drops ni colas en la puerta. Hacemos un catálogo, organizado por categorías y siempre disponible. Si te gusta, sigue aquí la semana que viene.",
      "Rebelde pero no disfraz. Oscura pero no friki. Unisex, porque el negro le queda bien a todo el mundo.",
    ],
    sign: SIGNOFF,
    values: [
      { n: "I", title: "Calle", text: "Ropa para patinar, arrastrarla por el suelo y repetir. Si no aguanta un bordillo, no entra en el catálogo." },
      { n: "II", title: "Peso", text: "Felpa de 450 g/m², denim de 14 oz, plata maciza. Se nota al cogerla y se nota a los diez lavados." },
      { n: "III", title: "Catálogo", text: "Sin drops ni cuentas atrás. Las piezas se quedan, se reponen y se piden en tu talla cuando quieras." },
      { n: "IV", title: "Gráfico", text: "Espinas, alas, llamas y cruces dibujadas por nosotros. Nada de marcas, bandas ni personajes de otros." },
    ],
    sealText: `Cada pedido sale de ${CITY} cerrado con el sello. ${TAGLINE}.`,
    crewTitle: "La pared",
    crewText: "Rizo, Sombra, Vera y Lux visten todo el catálogo. Cuatro caras fijas, una pared de hormigón.",
    links: [
      { eyebrow: "Brand Book", title: "Identidad de marca", text: `Logotipo, cruz alada, paleta, tipografía y reglas de foto de ${NAME}.`, cta: "Abrir Brand Book", href: "/brand" },
      { eyebrow: "Campaña", title: "Lookbook", text: "El catálogo puesto, contra la pared.", cta: "Ver lookbook", href: "/lookbook" },
      { eyebrow: "Tienda", title: "Catálogo", text: "Vaqueros, sudaderas, chándal, camisetas, chaquetas, accesorios y joyería.", cta: "Ver catálogo", href: "/tienda" },
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
    taxId: "pendiente de asignación",
    address: `Dirección pendiente, ${CITY}, España`,
    email: "hola@pecado.example",
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
        ["¿Cuánto cuesta el envío?", `El envío estándar cuesta ${eur(STANDARD_PRICE)} y es gratis en pedidos desde ${eur(FREE_FROM)}. El envío express cuesta ${eur(EXPRESS_PRICE)}.`],
        ["¿Cuánto tarda mi pedido?", "Estándar: 2–4 días laborables. Express: 24–48 h laborables. Lo que pidas antes de las 13:00 sale el mismo día."],
        ["¿A dónde enviáis?", "A toda España peninsular, Baleares, Portugal y Andorra. Para Canarias, Ceuta y Melilla, escríbenos antes de pedir."],
        ["¿Puedo seguir mi pedido?", "Sí. Te llega un correo con el número de seguimiento en cuanto el pedido sale del almacén."],
      ],
    },
    {
      id: "devoluciones",
      title: "Devoluciones",
      faqs: [
        ["¿Cuánto tiempo tengo para devolver?", `${RETURN_DAYS} días desde la entrega. Las piezas tienen que estar sin usar, sin lavar y con sus etiquetas. El deshilachado y el lavado vienen de fábrica: eso no cuenta como uso.`],
        ["¿La devolución es gratis?", "Sí, dentro de España. Te mandamos una etiqueta prepagada."],
        ["¿Puedo cambiar de talla?", "Claro. Pide el cambio y te mandamos la nueva talla en cuanto recibamos la pieza original, sin coste."],
        ["¿Cuándo recibo el reembolso?", "En 5–7 días laborables desde que recibimos la devolución, en el mismo método de pago."],
      ],
    },
    {
      id: "tallas",
      title: "Tallas",
      faqs: [
        ["¿Cómo tallan los vaqueros?", "Por cintura, en pulgadas (28–38). Son ultra baggy: pernera recta de unos 34 cm que se amontona sobre la zapatilla. Pide tu talla de cintura habitual; si estás entre dos, la mayor y con cinturón."],
        ["¿Y las sudaderas y camisetas?", `Casi todo es unisex, de la XS a la XXL. Las sudaderas son boxy y cortas, con hombro caído: pide tu talla habitual, o una más si las quieres más anchas. Las baby tees y las capas ajustadas van pegadas al cuerpo.`],
        ["¿Cómo sé mi talla de anillo?", "Usamos tallaje español (12–22). Rodea la base del dedo con un hilo, mide la longitud en milímetros y réstale 40: ese número es tu talla. Si dudas entre dos, elige la mayor."],
        ["¿Qué talla de cinturón pido?", "La de tu cintura en centímetros medida sobre el pantalón: 80, 90, 100 o 110. Con los vaqueros baggy se lleva bajo, en la cadera: mídelo ahí."],
        ["¿Y las zapatillas?", "Tallaje europeo del 36 al 45, horma amplia. Pide tu número habitual."],
      ],
      tables: true,
    },
    {
      id: "cuidado",
      title: "Cuidado de las piezas",
      faqs: [
        ["¿Cómo lavo los vaqueros y las sudaderas?", "Del revés, en frío (30 °C como mucho) y con oscuros. Sin secadora: el lavado a la piedra y el deshilachado aguantan mucho más si secan tendidos."],
        ["¿El deshilachado sigue soltando hilos?", "Un poco, al principio. Es parte del acabado. Si algún hilo largo molesta, córtalo con tijera; nunca tires de él."],
        ["¿De qué es la joyería?", "Plata de ley 925, maciza, con los relieves oxidados a propósito para que el dibujo se lea."],
        ["¿Por qué se oscurece la plata?", "La plata reacciona con el aire y la humedad. Límpiala en seco con un paño de plata y evita perfume, cloro y agua salada. Lo oscuro de los relieves no se quita: es el acabado."],
      ],
    },
    {
      id: "pagos",
      title: "Pagos",
      faqs: [
        ["¿Qué métodos de pago aceptáis?", "Tarjeta (Visa, Mastercard, American Express), Apple Pay, PayPal y Bizum."],
        ["¿Es seguro pagar en la web?", "Todos los pagos van cifrados y nunca guardamos los datos de tu tarjeta."],
        ["¿Tenéis códigos de descuento?", `De vez en cuando, y siempre por la lista. Los códigos se aplican en el checkout.`],
        ["¿Los precios incluyen IVA?", "Sí, todos los precios incluyen el IVA (21 %)."],
      ],
    },
  ],

  /* ---------- Guía de tallas: nota de cada tabla (las medidas están en src/lib/sizeGuides.js) */
  sizeGuideNotes: {
    tops: "Medidas de la prenda en plano, en centímetros. Sudaderas y camisetas boxy: cuerpo cuadrado que termina en la cintura y hombro caído.",
    outer: "Medidas de la prenda en plano. Pensadas para llevar sobre una sudadera.",
    bottoms: "Chándal: cintura elástica medida en reposo, con cordón. Pernera ancha y recta.",
    waist: "Vaqueros ultra baggy: talla en pulgadas de cintura. Pernera recta de unos 34 cm que se amontona sobre la zapatilla. Pide tu talla habitual.",
    rings: "Rodea la base del dedo con un hilo, marca el punto de cruce y mide la longitud en milímetros. La talla española equivale a la circunferencia menos 40.",
    chains: "Longitud total con el cierre. Caída orientativa sobre un cuello medio.",
    bracelets: "Mide el contorno de la muñeca justo por encima del hueso.",
    socks: "Equivalencia con la talla de calzado europea.",
    belts: "Elige la talla que corresponde a tu cintura medida sobre el pantalón, a la altura a la que lo llevas.",
    shoes: "Tallaje europeo. Horma amplia de skate: pide tu número habitual.",
  },

  /* ---------- Nota de corte bajo el selector de talla ------------------------ */
  fitNotes: {
    jewelleryRing: "Plata 925 maciza — tallaje español de anillo. Si dudas entre dos tallas, elige la mayor.",
    jewellery: "Plata 925 maciza, oxidada en los relieves. Sin baños.",
    accessoryOneSize: "Talla única.",
    accessoryAdjustable: "Talla única ajustable.",
    belts: "Talla por cintura en centímetros, medida donde llevas el pantalón.",
    shoes: "Horma amplia de skate: pide tu número habitual.",
    lineTops: "Boxy y corto: termina en la cintura. Pide tu talla habitual; una más si la quieres más ancha.",
    lineBottoms: "Pernera ancha y recta — pide tu talla habitual.",
    bottomsWaist: "Corte ancho — pide tu talla habitual de cintura.",
    bottoms: "Corte ancho — pide tu talla habitual.",
    default: "Pide tu talla habitual. Una más para un volumen extra.",
    /** Notas por categoría (vaqueros y chándal tienen su propio corte). */
    byCategory: {
      vaqueros: "Ultra baggy: pernera recta de 34 cm que se amontona sobre la zapatilla. Pide tu talla de cintura habitual; si dudas, la mayor y con cinturón.",
      chandal: "Felpa ancha con cintura elástica y cordón, a juego con su sudadera. Pide tu talla habitual.",
    },
    /** Notas por corte (`fit` del catálogo); ganan a las de categoría. */
    byFit: {
      Jogger: "Jogger de felpa con puño en el bajo y cintura elástica. Pide tu talla habitual.",
      Ajustado: "Ajustado al cuerpo, como una segunda piel. Pide tu talla habitual; una más si lo quieres menos pegado.",
    },
    /** Notas para un producto concreto: { "slug-producto": "Texto." } */
    bySlug: {
      "gutter-jort": "Bermuda ultra baggy que cae por debajo de la rodilla. Pide tu talla de cintura habitual.",
      "ladder-arm-warmers": "Talla única elástica: del puño al codo.",
    },
  },

  /* ---------- Cuidado (acordeón de la ficha) --------------------------------- */
  care: {
    jewellery: [
      "Plata de ley 925. Evita el contacto con perfume, cloro y agua salada.",
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
      "Lavar del revés en frío (30 °C como mucho) con oscuros.",
      "No usar secadora: tender para que el lavado y el deshilachado aguanten.",
      "Planchar del revés a temperatura media. Nunca sobre bordados, foil ni rhinestones.",
    ],
    /** Por categoría: gana a `garment`. */
    byCategory: {
      vaqueros: [
        "Lavar del revés en frío y solo con oscuros: el denim lavado a la piedra destiñe al principio.",
        "No usar secadora. Tender colgado de la cintura.",
        "Planchar del revés y nunca sobre los bordados.",
      ],
    },
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
      meta: ["Streetwear Y2K grunge desde Madrid.", "Catálogo, no drops.", "Vaqueros, sudaderas, tachas y plata."],
    },
    indexNote: `Este manual fija las reglas de la identidad de ${NAME}. Es la referencia para quien diseñe, fotografíe, escriba o produzca en nombre de la marca. Ante la duda, más oscuro y menos palabras.`,
    chapters: [
      { id: "portada", num: "00", title: "Portada", short: "Portada" },
      { id: "manifiesto", num: "01", title: "Manifiesto", short: "Manifiesto", desc: "De dónde venimos y los cuatro principios." },
      { id: "logotipo", num: "02", title: "Logotipo", short: "Logotipo", desc: "La fraktur, el área de respeto, las versiones." },
      { id: "simbolos", num: "03", title: "Sistema de símbolos", short: "Símbolos", desc: "Monograma, marca alada, cruz y sello." },
      { id: "color", num: "04", title: "Color", short: "Color", desc: `Paleta oscura, proporciones y paleta de producto ${LINE}.` },
      { id: "tipografia", num: "05", title: "Tipografía", short: "Tipografía", desc: "Fraktur, gótica híbrida y grotesca." },
      { id: "fotografia", num: "06", title: "Fotografía", short: "Fotografía", desc: "Flat lay sobre blanco y la pared de hormigón." },
      { id: "voz", num: "07", title: "Tono de voz", short: "Voz", desc: "Cómo hablamos y cómo no." },
      { id: "aplicaciones", num: "08", title: "Aplicaciones", short: "Aplicaciones", desc: "Etiquetas, packaging, gráfico de prenda." },
      { id: "web", num: "09", title: "Web / UI", short: "Web / UI", desc: "Componentes, retícula, tipo en pantalla." },
      { id: "contacto", num: "10", title: "Contacto", short: "Contacto", desc: "Archivos maestros y aprobaciones." },
    ],

    /* 01 · Manifiesto */
    manifesto: {
      quote: `${TAGLINE}.`,
      sub: `${MOTTO}.`,
      lead: "Para los que salen del cuarto con los cascos puestos y acaban en el skatepark.",
      paragraphs: [
        `${NAME} es el revival Y2K grunge tal como se ve hoy, pero llevable: vaqueros ultra baggy que se comen la zapatilla, sudaderas pesadas lavadas con el bajo deshilachado y camisetas negras con prints góticos agrietados, una encima de otra.`,
        "El universo gráfico es iconografía de cementerio y de catedral pasada a calle: cruces aladas, espinas, filigrana, ángeles de piedra, llamas. Todo es nuestro y nada se lee.",
        "Rebelde pero no disfraz. Oscura pero no friki. Catálogo, no drops.",
      ],
      sign: `— ${SIGNOFF}.`,
    },
    concept: {
      title: "Cuatro principios",
      lead: `Todo lo que hace ${NAME} —un vaquero, una etiqueta, una frase— tiene que poder explicarse con uno de ellos.`,
      statement: ["Catálogo,", "no drops."],
      pillars: [
        { k: "Calle", v: "Ropa para patinar, sentarse en el bordillo y repetir. Si no aguanta, no entra." },
        { k: "Peso", v: "Felpa de 450 g/m², denim de 14 oz, plata maciza. El valor se nota en la mano." },
        { k: "Oscuridad", v: "Casi monocroma: negro lavado, ceniza, índigo crudo y hueso. Un solo chispazo de color por look." },
        { k: "Ironía", v: "Iconografía sagrada, actitud de calle. Nos tomamos en serio la ropa, no a nosotros mismos." },
      ],
      attributes: ["Unisex", "Ultra baggy", "Boxy y corto", "Deshilachado", "Lavado a la piedra", "Tachas", "Plata 925"],
    },

    /* 02 · Logotipo principal */
    wordmark: {
      variant: "wordmark",
      name: DISPLAY,
      intro: `El logotipo de ${NAME}: «Pecado» en fraktur, compuesto en UnifrakturMaguntia y cerrado como dibujo, con el espaciado apretado. Es la blackletter más clásica y afilada: la firma de la casa y la única pieza que puede representar a la marca sola.`,
      notes: [
        { k: "Uso", v: "Cabecera y pie de la web, etiqueta tejida, etiqueta colgante, bolsa, caja. Si solo cabe una marca, es esta." },
        { k: "Dibujo", v: "Caja alta y baja, nunca en mayúsculas. No se reescribe con la fuente ni se reespacia: el archivo maestro manda." },
        { k: "Archivos", v: "wordmark.svg · wordmark-black.svg · wordmark-white.svg" },
      ],
      construction:
        "La retícula se construye con un módulo de un cuarto de la altura total (H), de la punta de la P al final de su cola. El archivo maestro no se redibuja, no se reespacia y no se recompone.",
      gridDiv: 4,
      /** Área de respeto: x = clearRatio × altura total del logotipo, en los cuatro lados. */
      clearRatio: 0.5,
      clearLabel: "x = media altura del logotipo",
      clearText:
        "El área de respeto es x en los cuatro lados, donde x es la mitad de la altura total del logotipo. Ningún texto, borde ni imagen entra en la zona.",
      minSizes: [
        { k: "Digital", v: "90 px de ancho", css: "90px" },
        { k: "Impresión", v: "25 mm de ancho", css: "25mm" },
        { k: "Tejido / bordado", v: "45 mm de ancho", css: "45mm" },
      ],
      minNote: "Por debajo de estas medidas los perfiles finos de la fraktur desaparecen. En formatos más pequeños se usa el monograma.",
      versions: [
        { k: "Positivo", v: "Hueso sobre Asfalto. Versión por defecto.", bg: "var(--paper)", fg: "var(--ink)", border: true },
        { k: "Negativo", v: "Asfalto sobre Hueso. Etiqueta colgante, papel de seda.", bg: "var(--ink)", fg: "var(--paper)" },
        { k: "Sobre Burdeos", v: "Hueso sobre Burdeos. Insignias y piezas especiales.", bg: "var(--accent)", fg: "var(--ink)" },
        { k: "Sobre Negro lavado", v: "Hueso sobre Negro lavado. Bloques editoriales.", bg: "var(--bone)", fg: "var(--ink)" },
      ],
      /** fx disponibles en brand.module.css: stretch, rotate, deslant, notm, retype, offpalette, shadow, lowcontrast, busy, enclose */
      misuse: [
        { k: "No deformar", fx: "stretch" },
        { k: "No girar", fx: "rotate" },
        { k: "No recomponer con una fuente", fx: "retype" },
        { k: "No usar colores fuera de paleta", fx: "offpalette" },
        { k: "No añadir contornos, sombras ni brillos", fx: "shadow" },
        { k: "No encerrar en formas", fx: "enclose" },
        { k: "No usar con poco contraste", fx: "lowcontrast" },
        { k: "No colocar sobre fondos con ruido", fx: "busy" },
      ],
    },

    /* 03 · Sistema de símbolos (variantes de <Logo>) */
    symbolsLead: "Junto al logotipo viven un monograma, una marca alada, un símbolo y un sello. Comparten dos dibujos —el anillo de espinas y la cruz alada— y cada pieza tiene su territorio.",
    symbols: [
      {
        variant: "monogram",
        name: "P",
        alias: "Monograma",
        when: "Bordados pequeños, joyería, botones, remaches, avatar en redes y cualquier formato donde el logotipo no cabe.",
        never: "Nunca junto al logotipo en la misma cara.",
        min: "32 px · 10 mm",
      },
      {
        variant: "graphic",
        name: "Marca alada",
        alias: "Gráfico de prenda",
        when: "Solo gráficos de prenda y campaña: espalda, pecho, bordado grande, pegatinas.",
        never: "Nunca como firma institucional: ni en la web, ni en etiquetas, ni en packaging.",
        min: "40 mm de ancho",
      },
      {
        variant: "emblem",
        name: "Cruz alada",
        alias: "Símbolo",
        when: "Favicon, herrajes, tiradores de cremallera, etiqueta tejida pequeña, separadores y placeholders.",
        never: "Nunca girada, recortada ni sin su anillo de espinas.",
        min: "16 px · 6 mm",
      },
      {
        variant: "seal",
        name: "Sello",
        alias: `${TAGLINE} · ${CITY}`,
        when: "Pegatina de cierre, packaging, certificado de joyería y newsletter. Firma el origen.",
        never: "Nunca por debajo del tamaño en el que el texto deja de leerse. Nunca recompuesto.",
        min: "72 px · 22 mm",
      },
    ],
    /* 2 = soporte principal · 1 = permitido · 0 = no se usa */
    usageColumns: ["Web / UI", "Etiqueta", "Packaging", "Bordado", "Joyería", "Prenda", "Redes"],
    usage: {
      wordmark: [2, 2, 2, 1, 0, 1, 2],
      monogram: [1, 1, 1, 2, 2, 1, 2],
      graphic: [0, 0, 0, 2, 0, 2, 1],
      emblem: [1, 1, 1, 1, 2, 1, 1],
      seal: [1, 0, 2, 0, 2, 0, 1],
    },
    symbolRules: [
      "Una sola pieza del sistema por cara visible. Nunca dos marcas juntas.",
      "El logotipo manda: si el soporte lo admite, se usa la fraktur.",
      "El monograma entra cuando el logotipo no cabe y en las piezas de oficio: bordado, plata, remaches.",
      "La marca alada es gráfico, no firma: vive en la prenda y en la campaña.",
      "La cruz alada y el sello nunca se recomponen ni se combinan con texto nuevo.",
    ],

    /* 04 · Color */
    colorLead: "Una paleta oscura y casi monocroma. El Asfalto y el Hueso sostienen la marca; el Burdeos la firma; la plata la ponen los herrajes y la joyería. El color de verdad está en la ropa, y como mucho uno por look.",
    proportionsText: "Asfalto y Hueso dominan cualquier pieza. El Burdeos es un detalle: una insignia, una barra, un sello. Herida solo aparece cuando algo falla.",
    productPaletteText: "Los pops —rojo sangre, lima tóxica, rosa bebé, azul hielo— viven en la prenda, nunca en la marca: como mucho uno por pantalla o por look.",

    /* 05 · Tipografía */
    type: {
      rampSample: "Ultra baggy",
      weightSample: "Pecado",
      serifBig: [`${TAGLINE}.`, `${SIGNOFF}.`],
      displaySample: ["Todos los santos", "tienen pasado"],
      pairingQuote: "«Rebelde pero no disfraz. Oscura pero no friki.»",
      pairingCaption: "Manifiesto · 01",
      scale: [
        { k: "Display", token: "--fs-display", web: "48–140 px", spec: "Grenze Gotisch 800 · 0,95 · 0", sample: `${TAGLINE}.`, cls: "tsDisplay" },
        { k: "XL", token: "--fs-xl", web: "28–44 px", spec: "Grenze Gotisch 700 · 1,05 · 0", sample: "Vaqueros", cls: "tsXl" },
        { k: "LG", token: "--fs-lg", web: "20 px", spec: "Archivo 400 · 1,3", sample: "Felpa de 450 g/m², bajo deshilachado.", cls: "tsLg" },
        { k: "MD", token: "--fs-md", web: "15 px", spec: "Archivo 400 · 1,45 · cuerpo", sample: "Pernera recta de 34 cm que se come la zapatilla.", cls: "tsMd" },
        { k: "SM", token: "--fs-sm", web: "13 px", spec: "Archivo 400 · 1,45", sample: "100 % algodón. Lavado a la piedra.", cls: "tsSm" },
        { k: "XS caps", token: "--fs-xs", web: "11 px", spec: "Archivo 400 · MAYÚSCULAS · +0,08 em", sample: "Añadir a la cesta", cls: "tsXs" },
        { k: "Micro caps", token: "--fs-micro", web: "10 px", spec: "Archivo 400 · MAYÚSCULAS · +0,22 em", sample: "Guía de tallas", cls: "tsMicro" },
      ],
      rules: [
        { k: "Blackletter", v: "Solo logotipo, titulares de sección y campaña. Nunca en precios, tallas, navegación ni checkout." },
        { k: "Caja", v: "La gótica va siempre en caja alta y baja. Las mayúsculas seguidas son para Archivo, con tracking." },
        { k: "Fraktur", v: "UnifrakturMaguntia solo para lemas y frases propias, y siempre grande. Nunca en párrafos." },
        { k: "Interlineado", v: "1,45 en cuerpo; 0,95–1,05 en titulares." },
        { k: "Alineación", v: "A la izquierda. Centrado solo en portadas, sellos y etiquetas." },
        { k: "Signos", v: "Sin signos de exclamación. Sin emojis. Comillas latinas « »." },
        { k: "Logotipo", v: "El logotipo y el monograma son dibujos, no tipografías. Nunca se escriben con una fuente." },
      ],
      uiType: [
        { k: "Navegación", v: "Archivo 400 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Nombre de producto", v: "Archivo 500 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Precio", v: "Archivo 400 · cifras tabulares", s: "11–15 px", t: "0" },
        { k: "Titular de sección", v: "Grenze Gotisch 700", s: "28–44 px", t: "0" },
        { k: "Botón", v: "Archivo 500 · caps", s: "11 px", t: "+0,08 em" },
        { k: "Legal", v: "Archivo 400 · caps", s: "10 px", t: "+0,22 em" },
        { k: "Lema", v: "UnifrakturMaguntia", s: "20 px +", t: "0" },
      ],
    },

    /* 06 · Fotografía */
    photo: {
      lead: "La fotografía de producto es la tienda y también la campaña. Dos imágenes por pieza, siempre en el mismo orden: primero la prenda sola sobre blanco, después puesta, contra la pared.",
      /** Producto del que se muestran las fotos (slug). */
      heroSlug: "seraph-baggy",
      /** Con una secuencia de 2 fotos, la hoja muestra la secuencia de varios productos (slugs). */
      pairSlugs: ["seraph-baggy", "blood-vine-hoodie"],
      sequence: [
        { k: "01", t: "Flat lay", v: "Siempre la primera. Cenital, sobre blanco puro. Si el arte está detrás, se enseña la espalda; los vaqueros, con las perneras abiertas para que se lea el ancho." },
        { k: "02", t: "Contra la pared", v: "Cuerpo entero frente a la misma pared de hormigón gris, luz de día nublado, encuadre frontal. El look completo, con actitud de calle y no de disfraz." },
      ],
      castingText: "Cuatro caras para todo el catálogo: Rizo, Sombra, Vera y Lux. La repetición construye familia: el cliente reconoce las caras como reconoce el logotipo.",
      rules: [
        { k: "Fondo", v: "Foto 1: blanco puro. Foto 2: la pared de hormigón en bruto, siempre la misma." },
        { k: "Luz", v: "Foto 1: difusa y alta. Foto 2: día nublado, sombras suaves." },
        { k: "Formato", v: "4:5 · 1200 × 1500 px · sRGB." },
        { k: "Retoque", v: "Fiel al lavado y al deshilachado. No se corrige el color de la prenda." },
        { k: "Joyería", v: "Macro nítido de plata pulida y oxidada; con modelo, primer plano contra la pared." },
      ],
      donts: ["Atrezo de cementerio o de Halloween", "Filtros, grano añadido, viñeteado", "Vaqueros estrechos o con pitillo", "Logos, bandas o texto legible en la ropa"],
      line: {
        title: `Línea ${LINE}`,
        lead: "La silueta: abajo, vaquero ultra baggy de pernera recta que se amontona sobre la zapatilla; arriba, sudadera pesada boxy y corta o camiseta a la cadera, una encima de otra.",
        rules: [
          { k: "Flat lay", v: "Los vaqueros abiertos y planos: tiene que leerse el ancho de la pernera. Las sudaderas, con el bajo deshilachado a la vista." },
          { k: "Con modelo", v: "La pieza protagonista entera y sin tapar. El vaquero cae sobre la zapatilla; la sudadera termina en la cintura." },
          { k: "Estilismo", v: "El look de `pose` completo: cinturón de tachas, cadena, gorro, cascos. Nunca un outfit genérico." },
        ],
        /** Productos a mostrar primero (slugs); el resto se completa con la línea actual. */
        slugs: ["seraph-baggy", "blood-vine-hoodie", "wingspan-jean", "spine-hoodie", "phantom-full-zip", "frost-thorn-hoodie"],
      },
    },

    /* 07 · Tono de voz */
    voice: {
      lead: "Hablamos como vestimos: oscuro, corto y con un poco de guasa. Español de España, de calle, sin gritar.",
      principles: [
        { k: "Corto", v: "Frases cortas. Un punto donde otros ponen tres adjetivos." },
        { k: "Oscuro", v: "Pecado, santos, rezos y perdón: el vocabulario de la casa, siempre con ironía." },
        { k: "Concreto", v: "Gramaje, ancho de pernera, plata 925. Datos antes que adjetivos." },
        { k: "De tú", v: "Tuteamos. Como se habla en el skatepark, no como en una tienda de lujo." },
      ],
      yesNo: [
        { yes: "Felpa de 450 g/m². Aguanta lo que le eches.", no: "¡¡La sudadera más brutal del año!!" },
        { yes: "Sigue aquí mañana.", no: "Últimas unidades, ¡corre!" },
        { yes: `${SIGNOFF}.`, no: "No te lo pierdas." },
        { yes: "Plata 925, oxidada en los relieves.", no: "Joyas top para tus outfits." },
      ],
      vocab: {
        yes: ["catálogo", "pieza", "lavado", "deshilachado", "ultra baggy", "gramaje", "tachas", "plata 925", "sin perdón"],
        no: ["drop", "hype", "edición limitada", "must-have", "brutal", "chollo", "outfit", "¡!", "emojis"],
      },
      /** Frases propias de la marca. */
      expressions: [TAGLINE, MOTTO, SIGNOFF],
      expressionsNote: "Las frases propias son un guiño: una por pieza o por pantalla, nunca todas juntas.",
      microcopy: [
        { k: "Botón de compra", v: "Añadir a la cesta" },
        { k: "Cesta vacía", v: "Tu cesta está vacía. Nada que confesar todavía." },
        { k: "Sin stock", v: "Agotada por ahora. Vuelve: aquí no hay drops." },
        { k: "Newsletter", v: "Un correo al mes. Ni uno más." },
        { k: "Pedido confirmado", v: `Pedido confirmado. ${SIGNOFF}.` },
        { k: "Error 404", v: "Esta página se fue de casa y no ha vuelto." },
        { k: "Error de formulario", v: "Revisa el correo electrónico." },
      ],
    },

    /* 08 · Aplicaciones (mockups: public/brand/mockups/<file>.jpg)
       Sin mockups fotográficos: `mockups: []` → el capítulo muestra aplicaciones
       dibujadas con los logotipos (`typographic`). */
    applications: {
      lead: "El sistema en el mundo físico. Cartón negro, damasco tejido, cuero y plata; acabados mate y una sola tinta. La marca se toca antes de leerse.",
      specs: [
        { k: "Materiales", v: "Cartón negro, papel de seda, damasco tejido, cuero, plata 925." },
        { k: "Acabados", v: "Impresión mate en Hueso, stamping en plata, bordado en hilo crudo. Nunca brillo." },
        { k: "Color", v: "Asfalto y Hueso. El Burdeos solo en el precinto y en piezas especiales." },
      ],
      labelling: {
        title: "Etiquetado",
        text: "Lo primero que se toca. El monograma firma la etiqueta tejida, el logotipo la colgante y el sello el precinto. Siempre a una tinta.",
      },
      packaging: {
        title: "Packaging y gráfico",
        text: "Caja negra con el logotipo en Hueso, precinto burdeos y el sello como cierre. La marca alada vive en la prenda; la joyería viaja en estuche con el monograma.",
      },
      mockups: [],
      /** Aplicaciones dibujadas con los logotipos (se usan mientras `mockups` esté vacío). */
      typographic: [
        { kind: "box", t: "Caja de envío", v: "Cartón negro, logotipo en Hueso, precinto burdeos y el sello como cierre.", ratio: "3 / 2" },
        { kind: "woven", t: "Etiqueta tejida y talla", v: "Damasco negro con el monograma en hilo crudo. Talla en raso burdeos.", ratio: "4 / 5" },
        { kind: "hangtag", t: "Etiqueta colgante", v: "Cartulina Hueso, logotipo en Asfalto y los datos de la pieza en grotesca.", ratio: "4 / 5" },
        { kind: "patch", t: "Parche bordado", v: "El sello bordado en hilo crudo sobre sarga burdeos, con borde de cordón.", ratio: "4 / 5" },
        { kind: "graphic", t: "Gráfico de prenda", v: "La marca alada serigrafiada a una tinta en la espalda.", ratio: "4 / 5" },
        { kind: "tape", t: "Precinto", v: "Cinta burdeos con el logotipo y la cruz alada repetidos en Hueso.", ratio: "8 / 5" },
        { kind: "jewel", t: "Estuche de joyería", v: "Estuche en plata con el monograma en relieve.", ratio: "4 / 5" },
        { kind: "stickers", t: "Pegatinas", v: "Vinilo mate troquelado: sello, cruz alada, monograma y logotipo.", ratio: "4 / 5" },
      ],
    },

    /* 09 · Web / UI */
    web: {
      lead: "La web es un catálogo a oscuras: fondo Asfalto, texto Hueso, retícula estricta y esquinas rectas. Las fichas son claras para que la prenda se vea; todo lo demás se retira.",
      buttons: { primary: "Añadir a la cesta", secondary: "Guía de tallas", text: "Ver el catálogo", disabled: "Agotado" },
      field: { placeholder: "Correo electrónico", button: "Entrar", help: "Un correo al mes. Ni uno más." },
      rules: [
        "Radio 0. Sin sombras. Líneas de 1 px en Hueso al 14 %.",
        "Hover: subrayado o inversión Hueso / Asfalto. El Burdeos solo confirma y etiqueta.",
        "Foco siempre visible: contorno de 1 px en Hueso.",
      ],
      cardNote: "Hover: la ficha pasa del flat lay sobre blanco a la foto contra la pared.",
      browser: {
        announce: `Catálogo, no drops · ${TAGLINE}`,
        nav: "Tienda · Pecados · Lookbook · Nosotros",
        navRight: "Buscar · Cuenta · Cesta (0)",
        gridTitle: "Vaqueros",
      },
      grid: [
        { k: "Escritorio", v: "12 columnas · medianil y margen 24 px" },
        { k: "Móvil", v: "4 columnas · medianil y margen 12 px" },
        { k: "Producto", v: "4 por fila en escritorio, 2 en móvil · imagen 4:5" },
        { k: "Cabecera", v: "56 px, más barra burdeos de 30 px" },
      ],
    },

    /* 10 · Contacto */
    contact: {
      motto: [TAGLINE, SIGNOFF],
      cols: [
        { k: "Equipo de marca", v: "Cualquier uso no previsto en este manual se consulta antes de producir. Ninguna pieza se imprime ni se borda sin prueba aprobada." },
        { k: "Archivos maestros", v: "/public/brand — wordmark, monogram, graphic, emblem y seal, en Asfalto (-black), blanco (-white) y currentColor." },
      ],
    },
  },
};

export default brand;
