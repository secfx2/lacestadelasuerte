// Suelo pélvico (Kegel): programa progresivo de 12 semanas + guía.
// Los músculos isquiocavernoso y bulboesponjoso rodean la base del pene: al contraerse comprimen las venas de
// salida y ayudan a que la sangre se quede dentro (erección más firme y que aguanta más). Entrenarlos 3 veces al
// día durante 3 meses mejora la erección en muchos hombres (ensayo de Dorey et al., 2005), además del control
// de la eyaculación y de las últimas gotas al orinar.

export const KEGEL_SESSIONS_PER_DAY = 3;

// Nivel según los días que llevas haciéndolo (no según la semana del plan)
export const KEGEL_LEVELS = [
  {
    n: 1,
    fromDay: 0,
    name: 'Aprende a encontrarlo',
    where: 'Tumbado boca arriba o sentado',
    slow: { reps: 10, hold: 3, rest: 3 },
    fast: null,
    tip: 'Contrae solo el suelo pélvico: glúteos, abdomen y muslos relajados. Respira normal durante toda la contracción.',
  },
  {
    n: 2,
    fromDay: 14,
    name: 'Fuerza',
    where: 'Sentado o de pie',
    slow: { reps: 10, hold: 6, rest: 6 },
    fast: { reps: 10, hold: 1, rest: 1 },
    tip: 'Aprieta fuerte y sube, aguanta, y suelta del todo. Las rápidas entrenan la respuesta: aprieta y suelta sin pausa.',
  },
  {
    n: 3,
    fromDay: 42,
    name: 'Resistencia',
    where: 'De pie (y luego caminando)',
    slow: { reps: 10, hold: 10, rest: 10 },
    fast: { reps: 15, hold: 1, rest: 1 },
    tip: 'De pie es más difícil. Cuando te salga bien, añade apretar al 50 % unos segundos en momentos del día (en el semáforo, en la cola…).',
  },
];

// Días con al menos una sesión
export function kegelDays(state) {
  return Object.values(state.days || {}).filter((d) => Number(d?.kegel) > 0).length;
}

export function kegelLevel(state) {
  const days = kegelDays(state);
  let lvl = KEGEL_LEVELS[0];
  for (const l of KEGEL_LEVELS) if (days >= l.fromDay) lvl = l;
  return { ...lvl, days };
}

// Pasos de una sesión guiada: [{ kind: 'prep'|'hold'|'rest'|'break', label, secs, rep, of, set }]
export function kegelSteps(level) {
  const steps = [{ kind: 'prep', label: 'Prepárate', secs: 5, sub: level.where }];
  const block = (set, cfg, name) => {
    for (let i = 1; i <= cfg.reps; i++) {
      steps.push({ kind: 'hold', label: cfg.hold > 1 ? 'Aprieta y aguanta' : 'Aprieta', secs: cfg.hold, rep: i, of: cfg.reps, set: name });
      steps.push({ kind: 'rest', label: 'Suelta del todo', secs: cfg.rest, rep: i, of: cfg.reps, set: name });
    }
  };
  block(1, level.slow, 'Lentas');
  if (level.fast) {
    steps.push({ kind: 'break', label: 'Descansa', secs: 10, sub: 'Ahora, rápidas: aprieta y suelta' });
    block(2, level.fast, 'Rápidas');
  }
  return steps;
}

export const sessionSeconds = (level) => kegelSteps(level).reduce((a, s) => a + s.secs, 0);

export const PELVIC = {
  intro:
    'El suelo pélvico es el grupo de músculos que sostiene la base del pene. Dos de ellos (isquiocavernoso y bulboesponjoso) aprietan las venas de salida durante la erección: si están fuertes, la sangre se queda dentro y la erección es más firme, aguanta más y baja menos en las pausas. Entrenarlos 3 veces al día durante 3 meses mejora la erección en muchos hombres; también ayuda a controlar la eyaculación. Se nota a partir de las 6-12 semanas.',
  find: [
    'Haz como si quisieras aguantar un gas o cortar el pis a la mitad: eso que aprietas es el suelo pélvico.',
    'Bien hecho, la base del pene sube un poco y los testículos se elevan. Delante de un espejo se ve.',
    'Corta el pis de verdad solo una vez, para identificarlo. No lo uses como ejercicio: puede vaciar mal la vejiga.',
    'Glúteos, abdomen y muslos, sueltos. Y respira normal: nada de aguantar el aire (también por el cuello).',
  ],
  rules: [
    '3 sesiones al día (mañana, tarde y noche). Cada una dura 2-5 minutos y se puede hacer en cualquier sitio.',
    'Soltar del todo es tan importante como apretar: un suelo pélvico siempre tenso también da problemas.',
    'Si notas dolor en la pelvis, los testículos o al eyacular, para y consúltalo con un fisio de suelo pélvico.',
    'El nivel sube solo según los días que lo hagas: 2 semanas aprendiendo, luego fuerza y luego resistencia.',
  ],
  erection: {
    intro:
      'Que la erección baje en las pausas (al poner el condón o al cambiar de postura) es muy habitual, también en hombres jóvenes y sanos: al parar la estimulación la sangre sale y, si las venas no cierran bien o la cabeza se va al "a ver si se baja", se nota. Casi siempre es una mezcla de físico y situación, y casi todo se puede mejorar.',
    items: [
      { t: 'Que no pare la estimulación', d: 'Mientras te pones el condón o cambiáis de postura, que tu pareja siga tocándote, o tócate tú. El bajón viene sobre todo de la pausa.' },
      { t: 'Condón de tu talla', d: 'Uno que aprieta demasiado corta el riego y quita sensibilidad; uno grande se mueve. Prueba varias marcas y tallas (ajustado, normal, XL) y los finos. Practica ponértelo solo, sin presión, para hacerlo rápido.' },
      { t: 'Anillo de constricción', d: 'Un anillo elástico en la base retiene la sangre en las pausas. De farmacia o sex-shop, de silicona y ajustable. Máximo 30 minutos y nunca si duele u hormiguea.' },
      { t: 'Kegel (arriba)', d: 'Es justo el músculo que mantiene la sangre dentro. Es lo que más ayuda a medio plazo.' },
      { t: 'Bajar grasa y cardio', d: 'La erección es salud vascular. Con sobrepeso, adelgazar con ejercicio devolvió la erección normal a 1 de cada 3 hombres en un ensayo. El plan ya va de eso: cada kilo cuenta.' },
      { t: 'Sueño, alcohol y tabaco', d: 'Dormir 5-6 h baja la testosterona. El alcohol (más de 2 copas) y el tabaco empeoran mucho el riego. Si hay plan, ese día duerme bien y bebe poco.' },
      { t: 'Una prueba útil', d: 'Si por la mañana sueles despertarte con erecciones firmes y al masturbarte va bien, el mecanismo funciona: lo que falla es la pausa o los nervios, y los consejos de arriba suelen bastar. Si las erecciones matutinas son raras o flojas, conviene ir al médico.' },
    ],
    doctor:
      'Ve al médico de cabecera o a un urólogo/andrólogo si dura más de 2-3 meses, si las erecciones matutinas son raras o flojas, o si te preocupa. En hombres jóvenes puede ser la primera señal de tensión alta, azúcar, colesterol o testosterona baja, así que merece una analítica. Existen pastillas (tadalafilo, sildenafilo) muy eficaces y seguras para la mayoría, pero son con receta: que te las paute el médico y nunca compradas por internet.',
  },
};
