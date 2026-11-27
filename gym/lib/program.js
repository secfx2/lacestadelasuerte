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

// ───────── Gym básico: multipower (Smith) + banco + mancuernas hasta 25 kg ─────────
// Mismos días, mismos grupos musculares y misma lógica; solo cambian los ejercicios.
const noteOf = (key, id) => WORKOUT_BY_KEY[key].items.find((it) => it[0] === id)?.[5];

export const HOME_ITEMS = {
  empuje: [
    ['press-inclinado-mancuernas', 3, 8, 10, 120],
    ['press-hombro-mancuernas', 3, 8, 10, 120],
    ['elevacion-lateral-mancuerna', 4, 12, 15, 60, 'Última serie: drop set (baja 30% el peso y sigue hasta el fallo).'],
    ['aperturas-mancuernas', 3, 12, 15, 75],
    ['press-cerrado-smith', 3, 8, 10, 90],
    ['triceps-mancuerna-cabeza', 2, 12, 15, 60],
  ],
  tiron: [
    ['remo-invertido-smith', 4, 8, 12, 120, 'Barra a la altura de la cadera. Cuanto más vertical estés, más fácil; más horizontal, más difícil.'],
    ['remo-mancuerna', 3, 10, 12, 75, 'Reps por brazo.'],
    ['pullover-mancuerna', 3, 12, 15, 60],
    ['remo-smith', 3, 8, 10, 90],
    ['pajaros-mancuerna', 3, 15, 20, 60],
    ['curl-mancuernas', 3, 8, 12, 75],
    ['curl-martillo', 2, 10, 12, 60],
  ],
  piernaA: [
    ['sentadilla-hack', 3, 8, 10, 150, 'En el multipower.'],
    ['sentadilla-goblet', 3, 10, 12, 90, 'Con la de 25 kg. Si se queda corta, pausa de 2 s abajo.'],
    ['hip-thrust', 3, 8, 12, 120, 'En el multipower con la espalda apoyada en el banco. Pausa 1 s arriba.'],
    ['subida-banco', 2, 10, 12, 75, 'Reps por pierna.'],
    ['abduccion-tumbado', 3, 15, 20, 45, 'Reps por lado.'],
    ['elevacion-piernas-banco', 3, 10, 15, 60],
  ],
  hombroBrazo: [
    ['press-hombro-mancuernas', 3, 8, 10, 120],
    ['elevacion-lateral-mancuerna', 4, 12, 15, 60, noteOf('hombroBrazo', 'elevacion-lateral-maquina')],
    ['pajaros-mancuerna', 3, 15, 20, 60],
    ['curl-inclinado', 3, 10, 12, 75, 'Superserie con el press francés.'],
    ['press-frances-mancuernas', 3, 10, 12, 75],
    ['curl-martillo', 2, 12, 15, 60],
    ['fondos-banco', 2, 10, 15, 60],
    ['cuello-isometricos', 3, 1, 1, 30, noteOf('hombroBrazo', 'cuello-isometricos')],
  ],
  torso: [
    ['remo-invertido-smith', 3, 6, 10, 120, 'Sustituye a las dominadas. Barra a la altura de la cadera.'],
    ['press-banca-mancuernas', 3, 8, 10, 120],
    ['remo-mancuerna', 3, 10, 12, 75, 'Reps por brazo.'],
    ['press-inclinado-smith', 3, 8, 10, 120],
    ['pullover-mancuerna', 2, 12, 15, 60],
    ['elevacion-lateral-mancuerna', 3, 12, 15, 60, 'Última serie: drop set.'],
    ['curl-mancuernas', 2, 12, 15, 60, 'Superserie con el tríceps.'],
    ['triceps-mancuerna-cabeza', 2, 12, 15, 60],
  ],
  piernaB: [
    ['peso-muerto-rumano', 3, 8, 10, 150, 'Con las mancuernas de 25 kg, o en el multipower si se te quedan cortas.'],
    ['hip-thrust', 3, 8, 12, 120, 'Pausa 1 s arriba. Es tu ejercicio clave para el glúteo.'],
    ['sentadilla-bulgara', 2, 10, 12, 90, 'Reps por pierna. Torso algo inclinado y paso largo = más glúteo.'],
    ['puente-una-pierna', 2, 12, 15, 60, 'Reps por pierna. Sustituye al curl femoral.'],
    ['abduccion-tumbado', 3, 15, 20, 45, 'Reps por lado.'],
    ['gemelo-de-pie', 3, 12, 15, 60, 'En el multipower, con la punta de los pies sobre un step o un disco.'],
    ['elevacion-lateral-mancuerna', 3, 12, 15, 45],
    ['elevacion-piernas-banco', 3, 10, 15, 60],
  ],
};

export const GYM_HOME_NOTE =
  'Mancuernas hasta 25 kg: cuando se te queden cortas, no pasa nada. Sube repeticiones (hasta 20), baja en 3-4 s, haz una pausa de 1-2 s en la parte difícil o pasa el ejercicio al multipower, donde puedes cargar discos.';

export const GYM_OPTIONS = [
  { key: 'completo', label: 'Gym completo', sub: 'máquinas y poleas' },
  { key: 'basico', label: 'Gym básico', sub: 'multipower, banco y mancuernas' },
];

export const WARMUP = [
  '5 min de bici, cinta o escaleras suaves (que empieces a sudar).',
  'Movilidad de hombro: 10 rotaciones con banda, polea ligera o una mancuerna ligera de 2-4 kg + 10 face pulls o pájaros muy suaves.',
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
  if (workout.home) {
    const min = legDay ? Math.max(15, phase.cardioMin - 10) : phase.cardioMin;
    return {
      title: `${min}' paseo rápido o escaleras`,
      detail: 'Si el gym del edificio tiene cinta o bici, úsala. Si no: camina rápido fuera (que te cueste un poco hablar) o sube y baja escaleras a ritmo suave.',
      minutes: min,
      exerciseId: null,
    };
  }
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
// slot: con qué comida se toma (desayuno, comida, merienda, cena o 'noche' = al acostarte); chip: texto corto para la dieta.
// buy: qué comprar en concreto (HSN: todo en un pedido). Elegido por calidad, no por precio.
export const SUPPLEMENTS = [
  { key: 'creatina', slot: 'desayuno', chip: 'Creatina 5 g', name: 'Creatina monohidrato (Creapure)', dose: '5 g al día', when: 'Cualquier hora, todos los días (también en descanso), con una comida. Para notarla antes (opcional): las 2 primeras semanas 10 g al día (5 g en la comida + 5 g en la cena) y luego 5 g al día siempre.', daily: true, evidence: 'A', buy: 'HSN · Creatina Excell 100% Creapure® en polvo, 500 g (con la carga de 10 g dura ~2 meses). 5 g = 1 cacito de 5 ml colmado (o 1 y medio raso). El dosificador de 10 ml rasado son unos 6-8 g: un poco menos de lleno.', why: 'El suplemento con más evidencia: +fuerza, +rendimiento y +masa magra. Con la carga de 10 g el músculo se llena en ~2 semanas en vez de 3-4. Retienes 1-2 kg de agua DENTRO del músculo: no es grasa, se ve más lleno. Si los 10 g te sientan mal al estómago, quédate en 5 g.' },
  { key: 'whey', name: 'Proteína whey aislada', dose: '1-2 scoops (30-60 g)', when: 'Ya viene en el menú (desayuno, merienda).', daily: true, evidence: 'A', buy: 'HSN · Evolate 2.0 (whey isolate CFM, bajo en lactosa), 2 kg. Sabor chocolate blanco o chocolate: los dos quedan bien en las recetas.', why: 'Comida práctica para llegar a ~190 g de proteína al día sin cocinar más. La aislada tiene menos lactosa y grasa por scoop: menos gases e hinchazón. Para ganar músculo funciona igual que la normal a igualdad de proteína.' },
  { key: 'cafeina', slot: 'merienda', chip: 'Café (opcional)', name: 'Cafeína', dose: '~100 mg (1 café)', when: 'Antes de entrenar. Entrenando a las 18:30: un café a las 17:45 como máximo; si esa noche quieres acostarte pronto, sin cafeína. Si algún día entrenas por la mañana, hasta 200 mg.', training: true, evidence: 'A', buy: 'Café normal: no hace falta comprar nada.', why: 'Más rendimiento y menos sensación de esfuerzo. Tarda ~5 h en bajar a la mitad: tomada tarde te quita sueño, y el sueño pesa más que el café en tu progreso (y en el cuello).' },
  { key: 'vitd', slot: 'comida', chip: 'D3+K2 · 1 cápsula', name: 'Vitamina D3 + K2', dose: '1 cápsula (2.000 UI D3 + 100 mcg K2)', when: 'Con la comida principal (necesita grasa). Imprescindible de octubre a abril.', daily: true, evidence: 'B', buy: 'HSN · Vitaminas D3 2000 UI + K2 100 mcg (120 cápsulas: 4 meses).', why: 'Casi todo el mundo en España la tiene baja en invierno, y la vitamina D baja se asocia a peor rendimiento y testosterona más baja. 4.000 UI es el máximo diario seguro sin analítica: mejor hacerte una y ajustar.' },
  { key: 'vitc', slot: 'desayuno', chip: 'Vitamina C · 1 masticable', name: 'Vitamina C', dose: '500 mg (1 masticable)', when: 'Con el desayuno. Mastícala y bebe agua después: es ácida para los dientes.', daily: true, evidence: 'B', buy: 'Solgar Vitamina C masticable 500 mg (90 tabletas: 3 meses). Si la prefieres bebida: Juvamine Vitamina C 1000 mg efervescente, 1 cada 2 días. Evita las que llevan zinc o vitamina D añadida: ya los tienes cubiertos.', why: 'Sin fruta y con la verdura cocida en crema, la vitamina C es lo que más te falta. Sustituye al multivitamínico (se te repetía): el hierro, el zinc y la B12 ya los sacas de la carne, los huevos y los lácteos, y la vitamina D la tomas aparte. 500 mg es de sobra: más de 1 g al día no aporta nada y en hombres se asocia a más piedras en el riñón.' },
  { key: 'omega3', slot: 'comida', chip: 'Omega-3 · 1 perla', name: 'Omega-3 concentrado (EPA+DHA)', dose: '1 perla (750 mg de EPA+DHA)', when: 'Al principio de la comida. Si se te repite a pescado, guarda el bote en el congelador y tómala congelada.', daily: true, evidence: 'B', buy: 'HSN · Premium omega-3 TG (IFOS™) 1000 mg: 500 mg EPA + 250 mg DHA por perla (120 perlas: 4 meses). Muy concentrado: con 1 al día basta.', why: 'Comes poco pescado azul. Salud cardiovascular, articulaciones (entrenas 6 días) y algo de ayuda con la inflamación. El concentrado da la dosis con menos perlas y sin repetir a pescado.' },
  { key: 'magnesio', slot: 'noche', chip: 'PentaMag · 1 (+1 en la comida y +1 por la tarde)', name: 'Magnesio (PentaMag)', dose: '3 pastillas (~250 mg de magnesio)', when: 'Una con la comida, otra por la tarde (con el batido post-gym o la merienda) y otra 1 h antes de dormir. Separado del psyllium. Si se suelta el estómago, baja a 2.', daily: true, evidence: 'B', buy: 'HSN · PentaMag (5 sales de magnesio: citrato, L-treonato Magtein®, taurato, malato y bisglicinato; ~83 mg por pastilla). 3 al día, como dice la etiqueta (ya no tomas el multi, que llevaba 95 mg). Llevan ranura: se pueden partir o morder. Alternativa más suave para el estómago: bisglicinato de magnesio, 2-3 cápsulas.', why: 'Recomendado en tu caso: sin verdura de hoja ni frutos secos te quedas algo corto de los ~400 mg diarios, y entrenando pierdes más con el sudor. Ayuda al sueño y a los calambres cuando vas justo. Evita el óxido de magnesio (se absorbe mal y suelta el estómago) y no pases de 250 mg en suplemento.' },
  { key: 'ashwagandha', slot: 'noche', chip: 'Ashwagandha · 1 (30 min antes de dormir)', name: 'Ashwagandha (Shoden)', dose: '1 cápsula (240 mg de extracto)', when: '30 min antes de dormir. En tandas: 8 semanas tomándola y 2-4 de descanso.', daily: true, optional: true, evidence: 'C', buy: 'HSN · Ashwagandha Extract con Shoden® (40:1, 35 % glicósidos de withanólidos), 30 cápsulas: 1 mes. Es de raíz y hoja; si quieres seguir después del descanso, mejor un extracto solo de raíz (p. ej. KSM-66, 300-600 mg).', why: 'Lo más probado: menos estrés y algo mejor de sueño. En estudios cortos (8-16 semanas, pequeños y muchos pagados por el fabricante), algo más de fuerza y una subida modesta de testosterona. Déjala si notas más mareo o sueño de día, te sienta mal el estómago o ves la orina muy oscura o los ojos amarillentos (hígado, muy raro). No con problemas de tiroides ni con medicación para la tensión, la ansiedad, la depresión o para dormir.' },
  { key: 'psyllium', slot: 'cena', chip: 'Psyllium 5 g en agua', name: 'Psyllium (fibra)', dose: '5 g en un vaso grande de agua', when: 'Con la cena o antes de dormir. Empieza con 3 g la primera semana.', daily: true, evidence: 'B', buy: 'HSN · Cáscara de psyllium EN POLVO (RawSeries). No las cápsulas de 700 mg: para 5 g harían falta 7 al día.', why: 'Sin fruta ni verdura entera te quedas en 23-29 g de fibra al día. 5 g de psyllium te llevan a ~30 g: mejor digestión, más saciedad y ayuda con el colesterol. Bebe agua de sobra con él.' },
  { key: 'citrulina', slot: 'merienda', chip: 'Citrulina 6-8 g (45 min antes del gym)', name: 'Citrulina malato', dose: '6-8 g', when: '45-60 min antes de entrenar, en agua.', training: true, optional: true, evidence: 'C', buy: 'HSN · Citrulina malato 2:1 en polvo (RawSeries). Sabe ácida: mézclala con agua y un poco de zumo o con el pre-entreno.', why: 'Mejora el riego (se convierte en arginina y óxido nítrico): algo más de repeticiones y bombeo. En un estudio pequeño, 1,5 g/día de citrulina mejoró la firmeza de la erección en casos leves. Efecto modesto: el último de la lista, no imprescindible.' },
];

// Suplementos que van con una comida (los de entreno, solo los días que se entrena)
export function suppsForSlot(slot, { rest = false } = {}) {
  return SUPPLEMENTS.filter((x) => x.slot === slot && (!x.training || !rest));
}

export const NO_SUPPLEMENTS = [
  'Zinc extra o ZMA: con la carne, el marisco, los huevos y los lácteos ya llegas (~12-15 mg/día). Más de 25 mg/día durante meses baja el cobre, y no sube la testosterona ni la libido si no tienes déficit (solo ayuda a quien le falta).',
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
  'Si tienes hambre: más volumen con menos calorías → cremas de verdura, gelatina 0%, queso batido.',
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
