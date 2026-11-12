import { foodMacros, sumMacros, roundMacros } from './foods.js';

// Recetas. Las cantidades son por 1 ración (para ti). Los macros se calculan solos a partir de lib/foods.js.
// Regla de la casa: nada de verdura "slimy" ni crujiente. La verdura va TRITURADA en salsas,
// en crema/gazpacho/salmorejo o escondida en batidos. Sin fruta suelta, aguacate ni crema de cacahuete: la fibra viene de
// avena, legumbre, pan integral, patata y cremas; las vitaminas, de tomate/sofrito, cremas y el multivitamínico.
// steps[].timer = segundos (sale un botón de temporizador en el modo paso a paso).

export const RECIPES = [
  // ───────────── DESAYUNOS ─────────────
  {
    id: 'tortitas-avena-cacao',
    name: 'Tortitas de avena y proteína con crema de cacao',
    slot: 'desayuno',
    time: 12,
    tags: ['dulce', 'alto en proteína'],
    ingredients: [
      ['avena', 60], ['huevo', 60], ['claras', 150], ['whey', 20], ['batido0', 80], ['cacao', 6], ['miel', 6], ['chocolate85', 8],
      ['especias', 0, 'canela + 1/2 sobre de levadura química + vainilla'],
    ],
    steps: [
      { t: 'Mete en el vaso de la batidora la avena, el huevo, las claras, la whey, canela, vainilla y la levadura.' },
      { t: 'Tritura 30-40 segundos hasta tener una masa lisa. Déjala reposar 2 minutos (espesa un poco).', timer: 120 },
      { t: 'Calienta una sartén antiadherente a fuego medio con unas gotas de aceite (o spray) y extiéndelo con papel.' },
      { t: 'Echa un cucharón por tortita. Cuando salgan burbujas arriba (≈2 min), dale la vuelta y 1 min más.', timer: 180 },
      { t: 'Crema de cacao: mezcla el queso batido con el cacao y la mitad de la miel. Ponla por encima con el resto de miel y el chocolate rallado.' },
    ],
    tip: 'Haz doble de masa y guárdala en un bote en la nevera: mañana solo tienes que hacer las tortitas.',
  },
  {
    id: 'tostadas-pavo-huevo',
    name: 'Tostadas con tomate, pavo y huevos revueltos',
    slot: 'desayuno',
    time: 10,
    tags: ['salado', 'clásico español'],
    ingredients: [
      ['pan', 90], ['tomate', 80], ['aove', 5], ['huevo', 120], ['claras', 100], ['pavo', 50],
    ],
    steps: [
      { t: 'Tuesta el pan. Mientras, ralla el tomate (queda en crema lisa, sin trozos) con una pizca de sal.' },
      { t: 'Bate los 2 huevos con las claras y una pizca de sal.' },
      { t: 'Sartén a fuego medio-bajo con 2-3 gotas de aceite. Echa el huevo y remueve despacio con espátula 2-3 min hasta que cuaje cremoso.', timer: 150 },
      { t: 'Unta el tomate en el pan, el resto del aceite por encima, pon el pavo y el revuelto encima.' },
    ],
    tip: 'Si te sobra hambre por la mañana, sube a 3 huevos.',
  },
  {
    id: 'bol-batido-cacao',
    name: 'Bol de queso batido con avena, cacao y chocolate negro',
    slot: 'desayuno',
    time: 4,
    tags: ['sin cocinar', 'dulce'],
    ingredients: [
      ['batido0', 300], ['whey', 15], ['avena', 50], ['cacao', 8], ['chocolate85', 12], ['miel', 6], ['especias', 0, 'canela'],
    ],
    steps: [
      { t: 'Mezcla en un bol el queso batido con la whey y el cacao hasta que no queden grumos (queda tipo mousse de chocolate).' },
      { t: 'Añade la avena por encima (si la quieres más blanda, mézclala y deja 5 min).' },
      { t: 'Ralla o pica el chocolate negro por encima y termina con la miel. Canela al gusto.' },
    ],
    tip: 'Versión "overnight": déjalo montado la noche anterior en un tupper y desayunas en 1 minuto.',
  },
  {
    id: 'batido-choco-avena',
    name: 'Batido de chocolate y avena (con espinaca escondida)',
    slot: 'desayuno',
    time: 3,
    tags: ['para llevar', 'verdura escondida'],
    ingredients: [
      ['leche', 300], ['whey', 30], ['avena', 55], ['espinacaCong', 50], ['cacao', 6], ['miel', 12],
    ],
    steps: [
      { t: 'Mete todo en la batidora (las espinacas congeladas tal cual, hacen de hielo). Usa whey de chocolate. Si lo quieres más frío, añade 3-4 cubitos.' },
      { t: 'Tritura 45-60 segundos a tope hasta que quede totalmente liso.', timer: 60 },
      { t: 'Listo. Sabe a batido de chocolate: la espinaca no se nota ni en el color.' },
    ],
    tip: 'Es la forma más fácil de meter verdura sin notarla. Si lo quieres más espeso, avena en harina.',
  },

  // ───────────── MEDIA MAÑANA ─────────────
  {
    id: 'yogur-cacao-tortitas',
    name: 'Yogures proteicos con cacao y miel + tortitas',
    slot: 'media',
    time: 2,
    tags: ['sin cocinar', 'para llevar'],
    ingredients: [['yogurPro', 240], ['cacao', 5], ['miel', 5], ['tortitaArroz', 16]],
    steps: [
      { t: 'Mezcla los 2 yogures +proteínas con el cacao y la miel (queda tipo natillas de chocolate).' },
      { t: 'Acompáñalo con 2 tortitas de arroz o maíz (puedes mojarlas).' },
    ],
    tip: 'Perfecto para llevar en la mochila del trabajo o la uni.',
  },
  {
    id: 'bocadillo-atun',
    name: 'Bocadillo de atún con tomate',
    slot: 'media',
    time: 4,
    tags: ['para llevar', 'salado'],
    ingredients: [['pan', 60], ['atun', 110], ['tomate', 40], ['aove', 3]],
    steps: [
      { t: 'Abre el pan y unta el tomate rallado con el aceite y una pizca de sal.' },
      { t: 'Escurre bien el atún (2 latas) y repártelo. Pimienta u orégano al gusto.' },
      { t: 'Cierra y envuelve en papel de aluminio si te lo llevas.' },
    ],
    tip: 'Si te gusta, una loncha de queso light le va genial (+50 kcal).',
  },
  {
    id: 'batido-whey-avena',
    name: 'Batido de whey con leche y avena',
    slot: 'media',
    time: 2,
    tags: ['para llevar'],
    ingredients: [['whey', 30], ['leche', 200], ['avena', 25], ['cacao', 4]],
    steps: [
      { t: 'Batidora (o shaker fuerte): leche fría + whey + avena + cacao. 30 segundos.', timer: 30 },
    ],
    tip: 'Si vas con prisa: whey en el shaker con la leche y la avena en harina, agitar y listo.',
  },
  {
    id: 'tortitas-pavo-queso',
    name: 'Tortitas de arroz con pavo, queso batido y queso light',
    slot: 'media',
    time: 3,
    tags: ['sin cocinar', 'salado'],
    ingredients: [['tortitaArroz', 32], ['batido0', 60], ['pavo', 80], ['quesoLight', 20]],
    steps: [
      { t: 'Unta las 4 tortitas con el queso batido (hace de "crema de queso"), pimienta u orégano.' },
      { t: 'Reparte el pavo y la loncha de queso light en tiras por encima.' },
    ],
    tip: 'Las tortitas de maíz con sal marina tienen más sabor que las de arroz.',
  },

  // ───────────── COMIDAS ─────────────
  {
    id: 'pollo-curry',
    name: 'Pollo al curry suave con arroz basmati',
    slot: 'comida',
    time: 25,
    tags: ['meal prep', 'verdura escondida'],
    ingredients: [
      ['pollo', 180], ['arroz', 80], ['leCoco', 80], ['tomateTriturado', 100], ['cebolla', 50], ['zanahoria', 50], ['aove', 5],
      ['especias', 0, '1 cdta curry + 1/2 cúrcuma + ajo en polvo + sal'],
    ],
    steps: [
      { t: 'Pon a hervir agua con sal. Echa el arroz y cuécelo 11-12 min; escurre.', timer: 720 },
      { t: 'Mientras: pica la cebolla y la zanahoria (da igual cómo, luego se trituran). Rehógalas con el aceite a fuego medio 6 min hasta que estén blandas.', timer: 360 },
      { t: 'Añade el curry, la cúrcuma y el ajo, 30 segundos. Luego el tomate triturado y la leche de coco. 5 min a fuego suave.', timer: 300 },
      { t: 'TRITURA la salsa con la batidora hasta que quede lisa y cremosa. No vas a notar ni la cebolla ni la zanahoria.' },
      { t: 'Corta el pollo en dados, dóralo en otra sartén 5 min y échalo a la salsa. 5 min más juntos.', timer: 300 },
      { t: 'Sirve con el arroz.' },
    ],
    tip: 'Haz 3-4 raciones de golpe: aguanta 4 días en nevera y se congela perfecto.',
  },
  {
    id: 'lentejas-pollo',
    name: 'Lentejas "sin tropezones" con pollo',
    slot: 'comida',
    time: 25,
    tags: ['meal prep', 'verdura escondida', 'fibra'],
    ingredients: [
      ['lentejas', 250], ['pollo', 130], ['cebolla', 50], ['zanahoria', 50], ['pimientoRojo', 30], ['tomateTriturado', 60],
      ['aove', 8], ['caldo', 250], ['pan', 30], ['especias', 0, '1 cdta pimentón dulce + comino + laurel'],
    ],
    steps: [
      { t: 'Pica cebolla, zanahoria y pimiento. Sofríe con el aceite a fuego medio 8 min.', timer: 480 },
      { t: 'Añade el pimentón (fuera del fuego 10 s para que no se queme) y el tomate. 2 min.', timer: 120 },
      { t: 'Echa un chorro de caldo y TRITURA el sofrito hasta que sea una crema. Este es el truco: sabor de lenteja de la abuela sin verdura a la vista.' },
      { t: 'Añade las lentejas escurridas y lavadas, el pollo en dados, el laurel y el resto del caldo. 12-15 min a fuego suave.', timer: 840 },
      { t: 'Rectifica de sal y sirve con el pan.' },
    ],
    tip: 'Con lentejas de bote está lista en 25 min. Si te gustan más espesas, aplasta unas pocas con el tenedor.',
  },
  {
    id: 'bolonesa',
    name: 'Pasta boloñesa con verdura escondida',
    slot: 'comida',
    time: 25,
    tags: ['meal prep', 'verdura escondida'],
    ingredients: [
      ['pasta', 80], ['ternera5', 150], ['tomateTriturado', 150], ['zanahoria', 40], ['calabacin', 60], ['cebolla', 40],
      ['aove', 5], ['parmesano', 5], ['especias', 0, 'orégano + ajo en polvo + sal + pimienta'],
    ],
    steps: [
      { t: 'Pon agua a hervir para la pasta.' },
      { t: 'Ralla la zanahoria, el calabacín (sin piel si te da cosa) y la cebolla. Rehoga con el aceite 6 min.', timer: 360 },
      { t: 'Añade el tomate triturado y cocina 5 min. TRITURA para que la salsa quede lisa.', timer: 300 },
      { t: 'En otra sartén dora la carne picada 5-6 min, deshaciéndola bien. Échala a la salsa con el orégano. 5 min.', timer: 300 },
      { t: 'Cuece la pasta según el paquete (≈9-10 min), escurre y mezcla con la salsa.', timer: 570 },
      { t: 'Parmesano rallado por encima.' },
    ],
    tip: 'La salsa se congela en raciones. Pasta al dente = más saciante.',
  },
  {
    id: 'burrito-bowl',
    name: 'Burrito bowl de pollo con salsa de yogur y lima',
    slot: 'comida',
    time: 20,
    tags: ['estilo mexicano'],
    ingredients: [
      ['arroz', 65], ['pollo', 170], ['frijoles', 100], ['yogurNat', 60], ['aove', 8], ['tomateTriturado', 60], ['quesoRallado', 20],
      ['especias', 0, 'especias fajita (comino, pimentón, ajo) + lima + sal'],
    ],
    steps: [
      { t: 'Cuece el arroz 11-12 min (o usa arroz de vasito para ir rápido).', timer: 720 },
      { t: 'Corta el pollo en tiras, mézclalo con las especias y el aceite y hazlo a la plancha 6-7 min.', timer: 420 },
      { t: 'Salsa: yogur + unas gotas de lima + comino + sal. Queda cremosa y fresquita.' },
      { t: 'Calienta las alubias 1 min en el micro con el tomate triturado y una pizca de comino (salsa suave).', timer: 60 },
      { t: 'Monta el bowl: arroz, pollo, alubias con salsa, el queso rallado y la salsa de yogur por encima.' },
    ],
    tip: 'Si las alubias te dan textura rara, pásalas por la batidora con el tomate: queda tipo "frijoles refritos".',
  },
  {
    id: 'salmon-patatas',
    name: 'Salmón al horno con patatas y salsa de yogur',
    slot: 'comida',
    time: 30,
    tags: ['omega-3', 'horno'],
    ingredients: [
      ['salmon', 150], ['patata', 250], ['aove', 5], ['yogurNat', 80], ['cremaCalabaza', 200],
      ['especias', 0, 'eneldo o perejil + limón + ajo en polvo + sal'],
    ],
    steps: [
      { t: 'Horno a 200 °C. Corta las patatas en gajos, mézclalas con el aceite, sal y ajo. Hornea 15 min.', timer: 900 },
      { t: 'Saca la bandeja, pon el salmón con sal y limón al lado de las patatas y hornea 12 min más.', timer: 720 },
      { t: 'Salsa: yogur + eneldo + unas gotas de limón + sal. Remueve.' },
      { t: 'Calienta la crema de calabaza (micro 1-2 min) y tómatela de primero.', timer: 90 },
      { t: 'Sirve el salmón con las patatas y la salsa por encima.' },
    ],
    tip: 'Con airfryer: patatas 12 min a 200 °C, añade el salmón y 8 min más.',
  },
  {
    id: 'ternera-teriyaki',
    name: 'Ternera teriyaki con arroz',
    slot: 'comida',
    time: 20,
    tags: ['estilo asiático'],
    ingredients: [
      ['ternera', 170], ['arroz', 80], ['soja', 20], ['miel', 10], ['maicena', 5], ['sesamo', 3], ['aove', 5],
      ['especias', 0, 'ajo + jengibre en polvo'],
    ],
    steps: [
      { t: 'Cuece el arroz 11-12 min.', timer: 720 },
      { t: 'Salsa teriyaki: mezcla la soja, la miel, la maicena, ajo, jengibre y 40 ml de agua.' },
      { t: 'Corta la ternera en tiras finas. Sartén muy caliente con el aceite, 2-3 min vuelta y vuelta.', timer: 150 },
      { t: 'Echa la salsa y deja 1-2 min hasta que espese y brille.', timer: 90 },
      { t: 'Sirve sobre el arroz con el sésamo por encima.' },
    ],
    tip: 'Con pollo en vez de ternera también queda de 10.',
  },
  {
    id: 'arroz-pollo',
    name: 'Arroz con pollo estilo paella (sofrito triturado)',
    slot: 'comida',
    time: 35,
    tags: ['domingo', 'verdura escondida'],
    ingredients: [
      ['arroz', 75], ['pollo', 180], ['tomateTriturado', 60], ['pimientoRojo', 30], ['aove', 8], ['caldo', 300],
      ['especias', 0, 'pimentón + azafrán o colorante + ajo + sal'],
    ],
    steps: [
      { t: 'Dora el pollo en dados con el aceite en una paellera o sartén amplia 5 min. Reserva.', timer: 300 },
      { t: 'En el mismo aceite, sofríe el pimiento picado 4 min, añade el tomate y el pimentón 2 min. TRITURA el sofrito.', timer: 360 },
      { t: 'Vuelve a echar el pollo y el sofrito, añade el arroz y rehoga 1 min.' },
      { t: 'Añade el caldo caliente con el azafrán/colorante. Fuego fuerte 8 min y luego suave 8-10 min sin remover.', timer: 1080 },
      { t: 'Reposa 5 min tapado con un paño antes de comer.', timer: 300 },
    ],
    tip: 'Comida de domingo sin culpa. Si te gusta el socarrat, sube el fuego el último minuto.',
  },
  {
    id: 'hamburguesa-casera',
    name: 'Hamburguesa casera con patatas al airfryer',
    slot: 'cena',
    time: 25,
    tags: ['cena "libre" controlada', 'finde'],
    ingredients: [
      ['panBurger', 70], ['ternera5', 170], ['quesoLight', 20], ['ketchup', 15], ['patata', 250], ['aove', 5],
      ['especias', 0, 'sal, pimienta, ajo en polvo, pimentón (patatas)'],
    ],
    steps: [
      { t: 'Corta las patatas en bastones, sécalas con papel y mézclalas con el aceite y las especias.' },
      { t: 'Airfryer 200 °C 18-20 min, agitando a mitad (u horno 220 °C 25 min).', timer: 1140 },
      { t: 'Forma la burger con la carne salpimentada (aplástala más que el pan, encoge). Plancha muy caliente 3 min por lado.', timer: 360 },
      { t: 'Último minuto: loncha de queso encima y tapa para que se funda. Tuesta el pan.', timer: 60 },
      { t: 'Monta con ketchup y mostaza. A disfrutar.' },
    ],
    tip: 'Esta es tu "comida trampa" de la semana pero controlada: ~700 kcal en vez de 1.500 de un burger de cadena.',
  },

  // ───────────── MERIENDA / PRE-ENTRENO ─────────────
  {
    id: 'pre-tortitas-miel',
    name: 'Pre-entreno: tortitas con miel y chocolate negro + whey',
    slot: 'merienda',
    time: 3,
    tags: ['pre-entreno', 'energía'],
    ingredients: [['tortitaArroz', 32], ['miel', 15], ['chocolate85', 8], ['whey', 30]],
    steps: [
      { t: 'Unta las 4 tortitas con la miel y ralla el chocolate negro por encima.' },
      { t: 'Whey en el shaker con 250-300 ml de agua.' },
      { t: 'Tómatelo 60-90 min antes de entrenar.' },
    ],
    tip: 'Hidratos rápidos + proteína = más energía en las series y mejor recuperación.',
  },
  {
    id: 'pre-bocadillo-pavo',
    name: 'Pre-entreno: bocadillo de pavo y queso',
    slot: 'merienda',
    time: 3,
    tags: ['pre-entreno', 'para llevar'],
    ingredients: [['pan', 70], ['pavo', 80], ['batido0', 30], ['quesoLight', 20]],
    steps: [
      { t: 'Unta el pan con el queso batido (o tomate rallado) y rellena con el pavo y la loncha de queso.' },
      { t: 'Envuélvelo y cómetelo 60-90 min antes de entrenar.' },
    ],
    tip: 'Si entrenas justo al salir del curro, cómetelo a media tarde y bebe agua de camino al gym.',
  },
  {
    id: 'pre-yogur-avena',
    name: 'Pre-entreno: yogur proteico con avena y miel',
    slot: 'merienda',
    time: 2,
    tags: ['pre-entreno', 'sin cocinar'],
    ingredients: [['yogurPro', 240], ['avena', 40], ['miel', 10]],
    steps: [
      { t: 'Mezcla los yogures con la avena y la miel. Canela al gusto.' },
      { t: 'Si lo dejas 10 min, la avena se ablanda y queda tipo natillas.' },
    ],
    tip: 'Ligero de estómago: ideal si entrenas pronto después.',
  },
  {
    id: 'merienda-descanso-cacao',
    name: 'Merienda de descanso: mousse de queso batido y cacao',
    slot: 'merienda',
    time: 2,
    tags: ['día de descanso'],
    ingredients: [['batido0', 250], ['cacao', 8], ['miel', 10], ['chocolate85', 8]],
    steps: [
      { t: 'Bate el queso batido con el cacao y la miel con unas varillas o un tenedor 30 s (queda tipo mousse).', timer: 30 },
      { t: 'Ralla el chocolate negro por encima.' },
    ],
    tip: 'Los días que no entrenas bajamos hidratos: mismo volumen de comida, menos calorías.',
  },

  // ───────────── CENAS ─────────────
  {
    id: 'merluza-salmorejo',
    name: 'Merluza al horno con patatas panadera + salmorejo',
    slot: 'cena',
    time: 30,
    tags: ['ligera', 'verdura en crema'],
    ingredients: [
      ['merluza', 220], ['patata', 200], ['aove', 6], ['salmorejo', 120], ['especias', 0, 'ajo, perejil, limón, sal'],
    ],
    steps: [
      { t: 'Horno a 200 °C. Patatas en rodajas finas con la mitad del aceite y sal: 20 min.', timer: 1200 },
      { t: 'Pon la merluza encima de las patatas con ajo, perejil, sal y el resto del aceite. 10-12 min más.', timer: 690 },
      { t: 'Sirve el salmorejo bien frío en un bol de primero (es tomate triturado: verdura sin enterarte).' },
    ],
    tip: 'Si te sabe a poco el pescado blanco, pon pimentón de la Vera por encima.',
  },
  {
    id: 'tortilla-pavo-gazpacho',
    name: 'Tortilla francesa de pavo y queso + pan con tomate + gazpacho',
    slot: 'cena',
    time: 10,
    tags: ['rápida', 'verdura en crema'],
    ingredients: [
      ['huevo', 120], ['claras', 100], ['pavo', 50], ['quesoLight', 20], ['pan', 40], ['tomate', 40], ['aove', 3], ['gazpacho', 150],
    ],
    steps: [
      { t: 'Bate los 2 huevos con las claras y sal.' },
      { t: 'Sartén antiadherente fuego medio. Echa el huevo; cuando empiece a cuajar pon el pavo y el queso en una mitad.', timer: 90 },
      { t: 'Dobla la tortilla y deja 1 min más para que se funda el queso.', timer: 60 },
      { t: 'Pan tostado con tomate rallado y el aceite.' },
      { t: 'Un vaso de gazpacho frío de acompañante.' },
    ],
    tip: 'La cena de 10 minutos para cuando llegas reventado del gym.',
  },
  {
    id: 'pizza-wrap',
    name: 'Pizza wrap proteica (x2)',
    slot: 'cena',
    time: 12,
    tags: ['antojo', 'horno/airfryer'],
    ingredients: [
      ['wrap', 80], ['tomateTriturado', 80], ['mozzaLight', 70], ['pavo', 100], ['especias', 0, 'orégano'],
    ],
    steps: [
      { t: 'Horno a 220 °C (o airfryer 190 °C).' },
      { t: 'Extiende el tomate triturado (con sal y orégano) sobre las 2 tortillas.' },
      { t: 'Reparte el pavo (o pollo) troceado y la mozzarella.' },
      { t: 'Hornea 7-8 min hasta que el borde esté crujiente y el queso gratinado.', timer: 450 },
    ],
    tip: 'Pizza de ~550 kcal con 50 g de proteína. Puedes usar pollo desmigado o atún.',
  },
  {
    id: 'pechuga-pure',
    name: 'Pechuga a la plancha con puré de patata y crema de calabacín',
    slot: 'cena',
    time: 25,
    tags: ['verdura en crema', 'comfort food'],
    ingredients: [
      ['pollo', 200], ['patata', 200], ['leche', 50], ['aove', 5], ['calabacin', 200], ['quesito', 16], ['caldo', 150],
      ['especias', 0, 'sal, pimienta, nuez moscada'],
    ],
    steps: [
      { t: 'Crema: calabacín (pelado si quieres) troceado + caldo, cuece 10 min. Tritura con el quesito hasta que esté muy lisa.', timer: 600 },
      { t: 'Puré: patata pelada en dados cocida 15 min (o 8 min en el micro tapada). Aplasta con la leche, sal y nuez moscada.', timer: 900 },
      { t: 'Pechuga fileteada fina a la plancha con el aceite, 3 min por lado.', timer: 360 },
      { t: 'Sirve la crema de primero y la pechuga con el puré de segundo.' },
    ],
    tip: 'La crema de calabacín con quesito no tiene nada de "slimy": queda como un velouté.',
  },
  {
    id: 'wrap-pollo',
    name: 'Wraps de pollo con salsa de yogur y queso',
    slot: 'cena',
    time: 15,
    tags: ['rápida'],
    ingredients: [
      ['wrap', 80], ['pollo', 160], ['yogurNat', 60], ['quesoRallado', 25], ['aove', 5], ['especias', 0, 'pimentón, ajo, comino, sal, lima'],
    ],
    steps: [
      { t: 'Pollo en tiras con las especias y el aceite a la plancha 6-7 min.', timer: 420 },
      { t: 'Salsa: yogur con ajo en polvo, unas gotas de lima y sal.' },
      { t: 'Calienta las tortillas 20 s en la sartén.', timer: 20 },
      { t: 'Rellena: pollo, queso rallado y salsa de yogur. Enrolla bien apretado y, si quieres, 1 min en la sartén para que se funda el queso.' },
    ],
    tip: 'Si las tortillas se rompen, caliéntalas antes: se vuelven flexibles.',
  },
  {
    id: 'revuelto-gambas',
    name: 'Revuelto de gambas con patatas al micro',
    slot: 'cena',
    time: 15,
    tags: ['marisco', 'rápida'],
    ingredients: [
      ['huevo', 120], ['claras', 100], ['gambas', 150], ['patata', 200], ['aove', 5], ['especias', 0, 'ajo, perejil, sal'],
    ],
    steps: [
      { t: 'Patata en dados en un bol con un poco de agua, tapada, 6-7 min al micro (o airfryer 12 min).', timer: 420 },
      { t: 'Sartén con el aceite y ajo picado. Saltea las gambas 2 min.', timer: 120 },
      { t: 'Añade las patatas y luego los huevos batidos con las claras. Remueve suave hasta que cuaje jugoso.', timer: 120 },
      { t: 'Perejil y sal al final.' },
    ],
    tip: 'Gambas congeladas peladas = cena de 15 min y mucha proteína.',
  },
];

export const RECIPE_BY_ID = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
export const getRecipe = (id) => RECIPE_BY_ID[id];

export function recipeMacros(recipe) {
  return roundMacros(sumMacros(recipe.ingredients.map(([k, g]) => foodMacros(k, g))));
}

export const SLOTS = [
  { key: 'desayuno', label: 'Desayuno', time: '08:00', from: 5 * 60, to: 10 * 60 + 30, emoji: '🍳' },
  { key: 'media', label: 'Media mañana', time: '11:00', from: 10 * 60 + 30, to: 13 * 60 + 15, emoji: '🥪' },
  { key: 'comida', label: 'Comida', time: '14:00', from: 13 * 60 + 15, to: 16 * 60 + 30, emoji: '🍛' },
  { key: 'merienda', label: 'Merienda / pre-entreno', time: '17:30', from: 16 * 60 + 30, to: 19 * 60 + 45, emoji: '⚡' },
  { key: 'cena', label: 'Cena', time: '21:00', from: 19 * 60 + 45, to: 24 * 60, emoji: '🌙' },
];
export const SLOT_BY_KEY = Object.fromEntries(SLOTS.map((s) => [s.key, s]));

// Menú semanal: índice 0 = lunes … 6 = domingo
export const WEEK_MENU = [
  { desayuno: 'tortitas-avena-cacao', media: 'yogur-cacao-tortitas', comida: 'pollo-curry', merienda: 'pre-tortitas-miel', cena: 'merluza-salmorejo' },
  { desayuno: 'tostadas-pavo-huevo', media: 'bocadillo-atun', comida: 'lentejas-pollo', merienda: 'pre-yogur-avena', cena: 'pizza-wrap' },
  { desayuno: 'bol-batido-cacao', media: 'batido-whey-avena', comida: 'bolonesa', merienda: 'pre-bocadillo-pavo', cena: 'tortilla-pavo-gazpacho' },
  { desayuno: 'batido-choco-avena', media: 'tortitas-pavo-queso', comida: 'burrito-bowl', merienda: 'pre-tortitas-miel', cena: 'pechuga-pure' },
  { desayuno: 'tortitas-avena-cacao', media: 'yogur-cacao-tortitas', comida: 'salmon-patatas', merienda: 'pre-yogur-avena', cena: 'revuelto-gambas' },
  { desayuno: 'tostadas-pavo-huevo', media: 'batido-whey-avena', comida: 'ternera-teriyaki', merienda: 'pre-bocadillo-pavo', cena: 'hamburguesa-casera' },
  { desayuno: 'bol-batido-cacao', media: 'bocadillo-atun', comida: 'arroz-pollo', merienda: 'merienda-descanso-cacao', cena: 'wrap-pollo' },
];

export function dayMacros(dayIdx) {
  const menu = WEEK_MENU[dayIdx];
  const parts = SLOTS.map((s) => recipeMacros(getRecipe(menu[s.key])));
  return roundMacros(sumMacros(parts));
}

// Snack de emergencia si tienes hambre por la noche (no cuenta en el menú)
export const NIGHT_SNACK = {
  name: 'Snack de emergencia (si hay hambre de noche)',
  text: '200 g de queso batido 0% con canela y edulcorante, o 1 yogur +proteínas. ~100 kcal y 16 g de proteína.',
};
