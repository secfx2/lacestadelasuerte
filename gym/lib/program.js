// Programa de entrenamiento "V-taper": especialización hombro (deltoide lateral), espalda (dorsal) y brazos,
// en déficit calórico para definir lo más rápido posible sin perder músculo.
// 6 días/semana + domingo de descanso activo. Cada sesión: 8' calentamiento + ~60' pesas + cardio.

// item: [exerciseId, sets, repsLow, repsHigh, restSec, nota?]
export const WORKOUTS = [
  {
    key: 'empuje',
    weekday: 0, // lunes
    name: 'Empuje',
    subtitle: 'Pecho superior · Hombro · Tríceps',
    emoji: '🔥',
    focus: 'Hombros anchos y pecho alto: el "marco" del V-taper.',
    items: [
      ['press-inclinado-mancuernas', 3, 8, 10, 120],
      ['press-hombro-maquina', 3, 8, 10, 120],
      ['elevacion-lateral-mancuerna', 4, 12, 15, 60, 'Última serie: drop set (baja 30% el peso y sigue hasta el fallo).'],
      ['contractor-pecho', 3, 12, 15, 75],
      ['elevacion-lateral-polea', 3, 12, 15, 45, 'Reps por brazo. Sin descanso entre brazos.'],
      ['triceps-polea-cuerda', 3, 10, 12, 60],
      ['triceps-sobre-cabeza', 2, 12, 15, 60],
    ],
  },
  {
    key: 'tiron',
    weekday: 1,
    name: 'Tirón',
    subtitle: 'Espalda ancha · Deltoide posterior · Bíceps',
    emoji: '🦅',
    focus: 'Dorsales anchos = cintura que parece más estrecha.',
    items: [
      ['jalon-agarre-ancho', 4, 8, 12, 120],
      ['remo-maquina', 3, 8, 10, 120],
      ['pullover-polea', 3, 12, 15, 60],
      ['remo-polea-baja', 3, 10, 12, 90],
      ['pajaros-contractor', 3, 15, 20, 60],
      ['curl-barra-z', 3, 8, 12, 75],
      ['curl-martillo', 2, 10, 12, 60],
    ],
  },
  {
    key: 'piernaA',
    weekday: 2,
    name: 'Pierna A',
    subtitle: 'Cuádriceps · Glúteo · Abdomen',
    emoji: '🦵',
    focus: 'Piernas proporcionadas, glúteo para rellenar la zona de los michelines y mucho gasto calórico.',
    items: [
      ['sentadilla-hack', 3, 8, 10, 150],
      ['prensa', 3, 10, 12, 120, 'Pies altos y algo abiertos en la plataforma: más glúteo.'],
      ['hip-thrust', 3, 8, 12, 120, 'Pausa 1 s arriba apretando el glúteo.'],
      ['extension-cuadriceps', 2, 12, 15, 75],
      ['curl-femoral-sentado', 3, 10, 12, 75],
      ['abduccion-cadera', 3, 15, 20, 60, 'Inclínate un poco hacia delante: trabaja la parte alta del glúteo.'],
      ['crunch-polea', 3, 12, 15, 60],
      ['elevacion-piernas', 3, 10, 15, 60],
    ],
  },
  {
    key: 'hombroBrazo',
    weekday: 3,
    name: 'Hombro + Brazo',
    subtitle: 'El día "aesthetic": deltoides 3D y brazos',
    emoji: '💎',
    focus: 'Deltoides redondos y brazos que llenan la camiseta. Al final, cuello suave (sin peso) para la mandíbula y la tensión de oficina.',
    items: [
      ['press-hombro-mancuernas', 3, 8, 10, 120],
      ['elevacion-lateral-maquina', 4, 12, 15, 60, 'Última serie: myo-reps (fallo, 5 respiraciones, +3-5 reps, repetir 3 veces).'],
      ['face-pull', 3, 15, 20, 60],
      ['curl-inclinado', 3, 10, 12, 75, 'Superserie con el press francés.'],
      ['press-frances', 3, 10, 12, 75],
      ['curl-predicador', 2, 12, 15, 60],
      ['fondos-maquina', 2, 10, 12, 60],
      ['cuello-isometricos', 3, 1, 1, 30, 'Opcional y suave: 1 serie = 1 vuelta (delante, atrás y lados, 10 s cada uno). Sin aguantar la respiración. Si notas mareo, para.'],
    ],
  },
  {
    key: 'torso',
    weekday: 4,
    name: 'Espalda + Pecho',
    subtitle: 'Torso completo · Más anchura',
    emoji: '🛡️',
    focus: 'Segunda dosis semanal de espalda y pecho para crecer más rápido.',
    items: [
      ['dominadas-asistidas', 3, 6, 10, 120],
      ['press-pecho-maquina', 3, 8, 10, 120],
      ['remo-mancuerna', 3, 10, 12, 75, 'Reps por brazo.'],
      ['press-inclinado-smith', 3, 8, 10, 120],
      ['elevacion-lateral-mancuerna', 3, 12, 15, 60, 'Última serie: drop set.'],
      ['curl-polea', 2, 12, 15, 60, 'Superserie con tríceps en polea.'],
      ['triceps-polea-cuerda', 2, 12, 15, 60],
    ],
  },
  {
    key: 'piernaB',
    weekday: 5,
    name: 'Pierna B',
    subtitle: 'Femoral · Glúteo · Hombro lateral',
    emoji: '🍑',
    focus: 'Cadena posterior, glúteo (tu punto a mejorar) y una dosis extra de deltoide lateral.',
    items: [
      ['peso-muerto-rumano', 3, 8, 10, 150],
      ['hip-thrust', 3, 8, 12, 120, 'Pausa 1 s arriba. Es tu ejercicio clave para el glúteo.'],
      ['sentadilla-bulgara', 2, 10, 12, 90, 'Reps por pierna. Torso algo inclinado y paso largo = más glúteo.'],
      ['curl-femoral-tumbado', 3, 10, 12, 75],
      ['abduccion-cadera', 3, 15, 20, 60, 'Última serie: aguanta 10 s abierto al final.'],
      ['gemelo-sentado', 2, 12, 15, 60],
      ['elevacion-lateral-polea', 3, 12, 15, 45, 'Reps por brazo.'],
      ['rueda-abdominal', 3, 8, 12, 60, 'Si no puedes con la rueda: plancha 3 × 30-45 s.'],
    ],
  },
  {
    key: 'descanso',
    weekday: 6,
    name: 'Descanso activo',
    subtitle: 'Paseo largo · Movilidad · Recarga',
    emoji: '🌿',
    focus: 'El músculo crece cuando descansas. Hoy solo pasos y movilidad.',
    rest: true,
    items: [],
  },
];

export const WORKOUT_BY_KEY = Object.fromEntries(WORKOUTS.map((w) => [w.key, w]));

export const WARMUP = [
  '5 min de bici o cinta suave (que empieces a sudar).',
  'Movilidad de hombro: 10 rotaciones con banda o polea ligera + 10 face pulls muy suaves.',
  '2 series de aproximación del primer ejercicio: 10 reps al 50% y 5 reps al 75% del peso de trabajo.',
];

// Fases: semana (1-index) → parámetros
export const PHASES = [
  { from: 1, to: 2, key: 'adaptacion', name: 'Adaptación', rir: '3', setsDelta: -1, cardioMin: 20, steps: 8000, note: 'Aprende la técnica y encuentra tus pesos. Deja 3 reps en recámara. Una serie menos en cada ejercicio.' },
  { from: 3, to: 7, key: 'construccion', name: 'Construcción', rir: '1-2', setsDelta: 0, cardioMin: 30, steps: 10000, note: 'Doble progresión: cuando hagas el tope de reps en todas las series, sube peso.' },
  { from: 8, to: 8, key: 'descarga', name: 'Descarga', rir: '3-4', setsHalf: true, cardioMin: 25, steps: 10000, note: 'Semana de descarga: la mitad de series y mismo peso. Recuperas articulaciones y vuelves más fuerte.' },
  { from: 9, to: 14, key: 'intensificacion', name: 'Intensificación', rir: '0-1', setsDelta: 0, cardioMin: 35, steps: 11000, note: 'Última serie de aislamientos al fallo técnico. Drop sets y myo-reps donde se indica.' },
  { from: 15, to: 15, key: 'dietBreak', name: 'Descarga + diet break', rir: '3', setsHalf: true, cardioMin: 20, steps: 9000, dietBreak: true, note: 'Una semana a calorías de mantenimiento (+400 kcal, sobre todo hidratos). Baja el estrés, sube la leptina y vuelves con ganas.' },
  { from: 16, to: 22, key: 'afinado', name: 'Afinado', rir: '0-1', setsDelta: 0, cardioMin: 40, steps: 12000, note: 'Recta final de definición: mantén fuerza, sube pasos y cardio. Aquí sale la mandíbula y el abdomen.' },
  { from: 23, to: 999, key: 'mantenimiento', name: 'Mantenimiento / volumen limpio', rir: '1-2', setsDelta: 0, cardioMin: 25, steps: 10000, note: 'Objetivo conseguido. Sube a mantenimiento y luego a un superávit pequeño (+200 kcal) para seguir ganando músculo sin perder la definición.' },
];

export function phaseForWeek(week) {
  return PHASES.find((p) => week >= p.from && week <= p.to) || PHASES[PHASES.length - 1];
}

export function setsForPhase(baseSets, phase) {
  if (phase.setsHalf) return Math.max(1, Math.ceil(baseSets / 2));
  return Math.max(2, baseSets + (phase.setsDelta || 0));
}

// Cardio del día según fase
export function cardioForDay(workout, phase) {
  if (workout.rest) {
    return { title: 'Paseo largo', detail: '45-60 min a paso ligero (o 12.000 pasos). Al aire libre si puedes.', minutes: 50, exerciseId: null };
  }
  const legDay = workout.key === 'piernaA' || workout.key === 'piernaB';
  if (legDay) {
    return {
      title: `${Math.max(15, phase.cardioMin - 10)}' bici suave`,
      detail: 'Zona 2: puedes hablar pero no cantar. Cadencia 80-90 rpm, resistencia media. Las piernas ya trabajaron.',
      minutes: Math.max(15, phase.cardioMin - 10),
      exerciseId: 'bici-estatica',
    };
  }
  return {
    title: `${phase.cardioMin}' cinta inclinada`,
    detail: 'Inclinación 8-12%, velocidad 5-5,5 km/h, sin agarrarte. Justo después de las pesas.',
    minutes: phase.cardioMin,
    exerciseId: 'cinta-inclinada',
  };
}

export const DOUBLE_SESSION = {
  title: 'Doble sesión (opcional, si quieres ir 2 veces)',
  text: 'Por la mañana: 30-40 min de cardio zona 2 (cinta inclinada, bici o escaladora 20 min). Por la tarde: pesas + el cardio del día. Así aprovechas las 2 h sin machacar la recuperación. Más pesas NO = más músculo; más cardio suave SÍ = más grasa quemada.',
};

// Pesajes y medidas
export const WEIGH_DAYS = [0, 2, 4]; // lunes, miércoles, viernes
export function isWeighDay(dayIdx) {
  return WEIGH_DAYS.includes(dayIdx);
}
// Medidas + fotos: lunes de semanas impares (1, 3, 5…)
export function isMeasureDay(dayIdx, week) {
  return dayIdx === 0 && week % 2 === 1;
}

export const WEIGH_HOWTO = 'Nada más levantarte, después de ir al baño, sin ropa y antes de beber o comer. Misma báscula, mismo sitio. Lo que importa es la MEDIA semanal, no el número de un día.';
export const MEASURE_HOWTO = [
  'Cintura: a la altura del ombligo, relajado, sin meter tripa.',
  'Hombros: perímetro por la parte más ancha de los deltoides, brazos relajados.',
  'Pecho: a la altura de los pezones.',
  'Brazo: bíceps contraído, punto más grueso.',
  'Cuello: justo debajo de la nuez.',
  'Fotos: frente, perfil y espalda. Misma luz, misma hora, mismo sitio. En bañador/calzoncillo.',
];

// Suplementos (todos legales y con evidencia; nada hormonal)
export const SUPPLEMENTS = [
  { key: 'creatina', name: 'Creatina monohidrato', dose: '5 g', when: 'Cualquier momento, todos los días (incluido descanso). Con una comida.', daily: true, evidence: 'A', why: 'El suplemento con más evidencia: +fuerza, +rendimiento y +masa magra. Ojo: retienes 1-2 kg de agua DENTRO del músculo las primeras 2-3 semanas. No es grasa, se ve más lleno.' },
  { key: 'whey', name: 'Proteína whey', dose: '1-2 scoops (30-60 g)', when: 'Ya viene en el menú (desayuno, merienda). Isolate si te sienta mal la lactosa.', daily: true, evidence: 'A', why: 'No es magia: es comida práctica para llegar a ~190 g de proteína al día sin cocinar más.' },
  { key: 'cafeina', name: 'Cafeína (café o pre-entreno simple)', dose: '100-200 mg (1-2 cafés)', when: '30-45 min antes de entrenar. Nunca después de las 17:00.', training: true, evidence: 'A', why: 'Más rendimiento y menos sensación de esfuerzo. Si tomas tarde, destroza el sueño (y el sueño es fat loss).' },
  { key: 'vitd', name: 'Vitamina D3', dose: '2.000 UI', when: 'Con la comida (necesita grasa). Sobre todo de octubre a abril.', daily: true, evidence: 'B', why: 'Casi todo el mundo en España la tiene baja en invierno. Ideal hacerte una analítica.' },
  { key: 'multi', name: 'Multivitamínico básico', dose: '1 comprimido', when: 'Con el desayuno.', daily: true, evidence: 'B', why: 'Como comes poca verdura entera, es un seguro barato para micronutrientes. Ya suele llevar ~10 mg de zinc: con eso y la carne vas sobrado (mira que no pase de 15 mg).' },
  { key: 'omega3', name: 'Omega-3 (EPA+DHA)', dose: '1-2 g de EPA+DHA', when: 'Con la comida.', daily: true, evidence: 'B', why: 'Si comes pescado azul menos de 2 veces/semana. Salud cardiovascular y articular.' },
  { key: 'magnesio', name: 'Magnesio (bisglicinato o citrato)', dose: '200-250 mg de magnesio elemental', when: 'Por la noche, antes de dormir.', daily: true, evidence: 'B', why: 'Recomendado en tu caso: sin verdura de hoja ni frutos secos te quedas algo corto de los ~400 mg diarios, y entrenando 2 h al día pierdes más con el sudor. Ayuda al sueño y a los calambres cuando vas justo. Evita el óxido de magnesio (se absorbe mal y suelta el estómago) y no pases de 250 mg en suplemento.' },
  { key: 'psyllium', name: 'Psyllium (fibra)', dose: '5 g en un vaso grande de agua', when: 'Con la cena o antes de dormir. Recomendado.', daily: true, evidence: 'B', why: 'Sin fruta ni verdura entera te quedas en 23-29 g de fibra al día. 5 g de psyllium te llevan a ~30 g: mejor digestión, más saciedad y ayuda con el colesterol. Bebe agua de sobra con él.' },
];

export const NO_SUPPLEMENTS = [
  'Zinc extra o ZMA: con la carne, el marisco, los huevos y el multi ya llegas (~12-15 mg/día). Más de 25 mg/día durante meses baja el cobre, y no sube la testosterona si no tienes déficit.',
  'Quemagrasas / "fat burners": cafeína cara + riesgo. El déficit es el quemagrasas.',
  'BCAAs / EAAs: inútiles si llegas a tu proteína (y vas a llegar).',
  'Potenciadores de testosterona (tribulus, etc.): no funcionan.',
  'SARMs, prohormonas, clembuterol…: NO son suplementos. Riesgo hepático, cardíaco y hormonal real.',
];

// Hábitos clave
export const DAILY_TARGETS = {
  waterMl: 3500,
  glassMl: 250,
  sleepH: 8,
  proteinG: 190,
};

export const RULES = [
  'Proteína en cada comida: es lo que protege el músculo mientras bajas grasa.',
  'Doble progresión: cuando completes TODAS las series en el tope del rango, sube el peso la siguiente vez (+2,5 kg máquinas/barra, +1-2 kg mancuernas).',
  'Técnica > peso. Baja siempre en 2-3 segundos.',
  'Duerme 7,5-9 h. Con menos de 6 h pierdes más músculo y menos grasa en el mismo déficit.',
  'Pasos diarios: el cardio que más grasa quema sin tocar la recuperación.',
  'Alcohol mínimo: frena la pérdida de grasa y retiene agua en la cara (adiós mandíbula).',
  'Una comida libre a la semana (la hamburguesa del sábado o similar), no un día libre.',
  'Si un día fallas, no compenses: vuelve al plan en la siguiente comida.',
];

export const JAWLINE = {
  intro: 'La mandíbula marcada es en un 80% bajar grasa corporal. Por debajo de ~15% empieza a aparecer y por debajo de ~12% se marca de verdad. El resto suma, pero poco.',
  items: [
    { t: 'Grasa corporal', d: 'Lo principal. Todo este plan va de esto: al bajar de 94 a ~80 kg la cara cambia muchísimo.' },
    { t: 'Sodio, alcohol y sueño', d: 'Mucha sal procesada, alcohol y dormir poco = cara hinchada por retención. Bebe tus 3,5 L de agua.' },
    { t: 'Cuello fuerte (sin peso)', d: 'Un cuello más fuerte enmarca la mandíbula. Como se te carga con el trabajo, nada de discos: isométricos suaves con la mano el jueves y estiramientos a diario. Mira la guía de cuello.' },
    { t: 'Postura', d: 'La cabeza adelantada crea papada visual. Haz 2 × 10 chin tucks al día (meter barbilla hacia atrás, como haciendo papada, 3 s) y face pulls en el gym.' },
    { t: 'Masticar', d: 'El chicle duro (tipo mastic) puede hipertrofiar un poco el masetero. Máx. 20-30 min al día y para si te duele la articulación (ATM).' },
    { t: 'Barba y corte de pelo', d: 'Una barba corta perfilada en la línea mandibular y laterales cortos visualmente marcan más el ángulo. Efecto inmediato.' },
    { t: 'Mewing', d: 'Poner la lengua en el paladar ayuda a la postura, pero en adultos no cambia el hueso. No esperes milagros.' },
  ],
};

// Cuello: tensión por trabajo sentado (a veces con náuseas o sensación de que todo se mueve)
export const NECK_CARE = {
  intro:
    'Lo que describes (cuello tenso por estar sentado y a veces náuseas o la sensación de que todo se mueve) es bastante común y suele estar relacionado con la tensión de la musculatura del cuello y de la parte alta de la espalda; a veces se llama mareo cervicogénico. Aquí no se puede diagnosticar: coméntalo con tu médico o un fisio, sobre todo si se repite. Mientras, el plan está adaptado para no cargarte el cuello.',
  items: [
    { t: 'En el gym', d: 'Nada de cuello con disco ni encogimientos pesados. El jueves, isométricos suaves con la mano (opcionales). Respira en cada repetición: aguantar el aire en esfuerzos fuertes sube la tensión. Cabeza neutra: no mires al espejo girando el cuello ni al techo en el hip thrust, y no tires de la cabeza en los abdominales.' },
    { t: 'Si te da en mitad del entreno', d: 'Para, siéntate, respira lento y bebe agua. No sigas con ejercicios pesados ese día: termina con algo suave o vete a casa. Levántate despacio de los bancos y de la prensa.' },
    { t: 'En el trabajo', d: 'Pantalla a la altura de los ojos y a un brazo de distancia; codos apoyados; los pies en el suelo. Cada 45-60 min levántate 2 minutos: 10 chin tucks, hombros atrás y el estiramiento de trapecio (30 s por lado).' },
    { t: 'Cada día (3 minutos)', d: 'Chin tucks 2 × 10, estiramiento de trapecio y del elevador de la escápula 2 × 30 s por lado y face pulls / remos en el gym para la espalda alta. Calor local (ducha caliente) por la noche si lo notas cargado.' },
    { t: 'Ayuda también', d: 'Dormir bien (almohada que deje el cuello recto, no dos almohadas), beber tus 3,5 L, no estar muchas horas sin comer y ir con la cafeína con calma (máx. 1-2 cafés).' },
    { t: 'Ve al médico ya si…', d: 'el mareo es fuerte o dura, o aparece con dolor de cabeza muy intenso y brusco, visión doble, dificultad para hablar o tragar, hormigueo o debilidad en brazos o cara, o tras un golpe. Eso no es tensión: es urgencia.' },
  ],
};

export const LOVE_HANDLES = {
  intro:
    'Eso que tienes son los michelines (love handles): grasa en los costados y la zona lumbar, justo encima de la goma del calzoncillo. En los hombres es de los últimos sitios de los que se va la grasa, así que es normal que sea lo que más tarde cambie. La grasa no se quema por zonas (hacer oblicuos no la quita), pero sí puedes cambiar mucho cómo se ve la zona.',
  items: [
    { t: 'Bajar grasa total (lo principal)', d: 'Es lo que ya hace el plan. Primero bajan cara, pecho y brazos; los michelines suelen empezar a reducirse de verdad entre las semanas 10 y 16 y casi desaparecen hacia el 12-13% de grasa. No cambies la dieta por esto: el déficit ya es el correcto.' },
    { t: 'Más glúteo (tu caso)', d: 'Con poco glúteo, la grasa de encima "cuelga" sobre el corte del calzoncillo. Más glúteo (sobre todo el glúteo medio, la parte alta y lateral) rellena la zona y la transición cintura-cadera se ve limpia. Por eso ahora hay hip thrust 2 días y abducción de cadera 2 días.' },
    { t: 'Nada de oblicuos con peso', d: 'Las inclinaciones laterales con mancuerna pesada engordan el oblicuo y ensanchan la cintura: justo lo contrario del V-taper. Core sí, pero de estabilidad: rueda, plancha y vacío abdominal.' },
    { t: 'Vacío abdominal cada mañana', d: '3 × 20-30 s en ayunas. Entrena el transverso, tu faja natural: la cintura se ve más recogida en reposo. Lo tienes en el día de descanso y en la ficha del ejercicio.' },
    { t: 'Postura de la pelvis', d: 'Si la pelvis se te va hacia delante (culo hacia fuera, lumbar muy arqueada), la tripa y los michelines sobresalen más. Estira el flexor de cadera (lo tienes en la movilidad del domingo) y aprieta un poco el glúteo cuando estés de pie.' },
    { t: 'Pasos, sueño y alcohol', d: 'Los pasos diarios queman grasa total sin fatigar. Dormir poco y el alcohol favorecen acumular grasa abdominal. Cumple tus pasos y tus 8 h.' },
    { t: 'Truco inmediato: la ropa', d: 'Una goma estrecha y apretada "corta" y marca el michelín. Usa bóxer de cintura ancha en tu talla real (no una menos) y pantalón de tiro medio que no apriete justo ahí. Se nota desde hoy.' },
  ],
};

export const TIPS = [
  'Las elevaciones laterales son el ejercicio nº1 para verte ancho. Peso ligero, técnica perfecta, sin balanceo.',
  'Hoy bebe un vaso de agua nada más levantarte. Llevas 8 h sin beber.',
  'La báscula sube y baja por agua, sal y glucógeno. Mira la media semanal, no el número de hoy.',
  'Si tienes hambre: más volumen con menos calorías → gazpacho, cremas, gelatina 0%, queso batido.',
  'Haz meal prep el domingo: curry o boloñesa para 3 días y la semana se hace sola.',
  'Apunta los pesos de cada serie. Lo que no se mide no progresa.',
  'Cardio en cinta inclinada sin agarrarte. Si necesitas agarrarte, baja la inclinación.',
  'Duerme en una habitación fresca y oscura. El sueño es tu mejor suplemento.',
  'En el jalón, piensa "codos al bolsillo trasero", no "tirar con las manos".',
  'La creatina retiene agua dentro del músculo: si subes 1 kg la primera semana, es normal.',
  'Postura: chin tucks 2 × 10 hoy. Tu mandíbula te lo agradecerá.',
  'Un día malo no arruina nada. Una semana mala tampoco. Lo que cuenta es el mes.',
  'Pásate a la sal yodada y limita ultraprocesados: menos retención en la cara.',
  'Face pull = hombros hacia atrás = postura de "aesthetic" en las fotos.',
  'Vacío abdominal al levantarte: 3 × 20-30 s con el ombligo hacia la columna. Cintura más recogida.',
  'Los michelines son de lo último en irse. Si ves la cara y los brazos más definidos, vas por buen camino: luego vienen los costados.',
];
