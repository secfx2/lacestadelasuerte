// Herramientas del asesor IA para CAMBIAR el plan (solo servidor).
// El servidor valida cada llamada, la simula sobre una copia de tus personalizaciones y devuelve el resultado a
// Claude; al terminar manda la lista de operaciones al móvil, que es quien las aplica (y las sincroniza).

import { EXERCISES, getExercise } from './exercises.js';
import { FOODS } from './foods.js';
import { SLOTS, WEEK_MENU, getRecipe } from './recipes.js';
import { WORKOUT_BY_KEY } from './program.js';
import { applyOps, newId } from './planOps.js';
import { recipeMacrosFor } from './plan.js';
import { addDays, weekdayIdx } from './dates.js';

const SLOT_KEYS = SLOTS.map((s) => s.key);
const SLOT_LABEL = Object.fromEntries(SLOTS.map((s) => [s.key, s.label]));
const DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const TRAIN_KEYS = Object.values(WORKOUT_BY_KEY)
  .filter((w) => !w.rest)
  .map((w) => w.key);
const EX_IDS = new Set(EXERCISES.map((e) => e.id));
const CATS = ['Carne y pescado', 'Huevos y lácteos', 'Fruta y verdura', 'Congelados', 'Refrigerados', 'Panadería', 'Despensa', 'Otros'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

const nul = (schema) => ({ anyOf: [schema, { type: 'null' }] });
const obj = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });

// ───────── Definiciones (JSON Schema estricto: todo obligatorio, lo opcional admite null) ─────────

export const TOOL_DEFS = [
  {
    name: 'cambiar_comida',
    description:
      'Cambia qué receta toca en una comida del menú. Úsala cuando el usuario te pida cambiar una comida (o acepte tu propuesta). scope "semana" cambia ese hueco para siempre los días de la semana indicados; scope "dia" solo para una fecha. recipe_id null vuelve a la receta original del plan. La receta debe existir (catálogo, recetas creadas antes o creada con crear_receta en esta conversación).',
    input_schema: obj({
      slot: { type: 'string', enum: SLOT_KEYS, description: 'Hueco: desayuno, media (media mañana), comida, merienda (pre-entreno) o cena.' },
      recipe_id: nul({ type: 'string', description: 'Id de la receta, p. ej. "pollo-curry" o "c-…". null = volver a la del plan.' }),
      scope: { type: 'string', enum: ['semana', 'dia'] },
      weekdays: nul({ type: 'array', items: { type: 'integer', enum: [0, 1, 2, 3, 4, 5, 6] }, description: 'Para scope "semana": 0 = lunes … 6 = domingo.' }),
      date: nul({ type: 'string', description: 'Para scope "dia": fecha YYYY-MM-DD.' }),
    }),
  },
  {
    name: 'crear_receta',
    description:
      'Crea una receta nueva para el usuario (por ración). Usa los alimentos del catálogo (food_key) siempre que puedas, con gramos; solo si no existe, pon food_key null con name y macros por 100 g. Devuelve el id y los macros calculados: ajústalos si no encajan con su objetivo. Después usa cambiar_comida para ponerla en el menú si el usuario lo quiere.',
    input_schema: obj({
      name: { type: 'string' },
      slot: { type: 'string', enum: SLOT_KEYS },
      emoji: nul({ type: 'string' }),
      minutes: { type: 'integer', description: 'Tiempo de preparación.' },
      ingredients: {
        type: 'array',
        items: obj({
          food_key: nul({ type: 'string', description: 'Clave del catálogo de alimentos, p. ej. "pollo", "arroz", "batido0".' }),
          grams: { type: 'number', description: 'Gramos (o ml) por ración.' },
          note: nul({ type: 'string' }),
          name: nul({ type: 'string', description: 'Solo si food_key es null.' }),
          per100: nul(
            obj({
              kcal: { type: 'number' },
              protein: { type: 'number' },
              carbs: { type: 'number' },
              fat: { type: 'number' },
              category: { type: 'string', enum: CATS },
            })
          ),
        }),
      },
      steps: { type: 'array', items: obj({ text: { type: 'string' }, timer_seconds: nul({ type: 'integer' }) }) },
      tip: nul({ type: 'string' }),
    }),
  },
  {
    name: 'editar_entreno',
    description:
      'Cambia la rutina de un día de entreno: "cambiar" un ejercicio por otro, "añadir", "quitar", "ajustar" series/reps/descanso/nota, o "restaurar" el día al plan original. Los ejercicios tienen que ser del catálogo (ids entre corchetes). El cambio es permanente para ese día de la semana.',
    input_schema: obj({
      workout: { type: 'string', enum: TRAIN_KEYS },
      action: { type: 'string', enum: ['cambiar', 'añadir', 'quitar', 'ajustar', 'restaurar'] },
      exercise_id: nul({ type: 'string', description: 'Ejercicio actual del día (para cambiar, quitar o ajustar).' }),
      new_exercise_id: nul({ type: 'string', description: 'Ejercicio nuevo (para cambiar o añadir).' }),
      sets: nul({ type: 'integer' }),
      rep_min: nul({ type: 'integer' }),
      rep_max: nul({ type: 'integer' }),
      rest_seconds: nul({ type: 'integer' }),
      note: nul({ type: 'string' }),
      position: nul({ type: 'integer', description: 'Para añadir: posición (1 = primero). null = al final.' }),
    }),
  },
  {
    name: 'actualizar_perfil',
    description: 'Cambia datos del perfil cuando el usuario lo pida: peso objetivo, hora del gym, hora a la que suele levantarse, altura, edad o doble sesión. Pon null en lo que no cambie.',
    input_schema: obj({
      goal_kg: nul({ type: 'number' }),
      gym_time: nul({ type: 'string', description: 'HH:MM' }),
      wake_time: nul({ type: 'string', description: 'HH:MM, hora habitual de levantarse.' }),
      height_cm: nul({ type: 'number' }),
      age: nul({ type: 'integer' }),
      double_session: nul({ type: 'boolean' }),
    }),
  },
  {
    name: 'recordar',
    description:
      'Guarda (o borra) una nota permanente sobre el usuario para tenerla en cuenta siempre: alimentos que no le gustan, molestias o lesiones, horarios, preferencias. Úsala cuando te cuente algo así que deba recordarse en futuras conversaciones.',
    input_schema: obj({
      action: { type: 'string', enum: ['guardar', 'borrar'] },
      text: nul({ type: 'string' }),
      note_id: nul({ type: 'string', description: 'Para borrar: id de la nota (aparece entre corchetes en sus notas).' }),
    }),
  },
  {
    name: 'restaurar_plan',
    description: 'Deshace TODOS los cambios de una parte del plan y vuelve al original. Solo si el usuario lo pide explícitamente.',
    input_schema: obj({ what: { type: 'string', enum: ['menu', 'entrenos', 'recetas', 'notas', 'todo'] } }),
  },
];

export const TOOLS = TOOL_DEFS.map((t) => ({ ...t, strict: true, eager_input_streaming: true }));
export const TOOLS_LOOSE = TOOL_DEFS; // por si la cuenta no admite strict o eager_input_streaming (se valida igual en runTool)

// ───────── Validación + ejecución ─────────

class Invalid extends Error {}
const fail = (msg) => {
  throw new Invalid(msg);
};
const isStr = (v) => typeof v === 'string' && v.trim().length > 0;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isInt = (v) => Number.isInteger(v);
const optStr = (v, name, max = 400) => {
  if (v == null) return null;
  if (typeof v !== 'string') fail(`${name} debe ser texto`);
  return v.trim().slice(0, max) || null;
};
const keysOnly = (input, allowed) => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Entrada no válida');
  for (const k of Object.keys(input)) if (!allowed.includes(k)) fail(`Campo desconocido: ${k}`);
};

// work = { custom, profile, today, ops: [], changes: [] }
function commit(work, op, change) {
  const next = applyOps(work.custom, work.profile, [op], work.today);
  work.custom = next.custom;
  work.profile = next.profile;
  work.ops.push(op);
  work.changes.push(change);
}

const recipeIn = (work, id) => work.custom?.recipes?.[id] || getRecipe(id) || null;
const itemText = ([id, sets, lo, hi, rest, note]) => `${getExercise(id)?.name || id} [${id}] ${sets}×${lo}-${hi}, descanso ${rest}s${note ? ` (${note})` : ''}`;

function toolCambiarComida(input, work) {
  keysOnly(input, ['slot', 'recipe_id', 'scope', 'weekdays', 'date']);
  const { slot, scope } = input;
  if (!SLOT_KEYS.includes(slot)) fail('slot no válido');
  if (scope !== 'semana' && scope !== 'dia') fail('scope no válido');
  const recipeId = input.recipe_id == null ? null : String(input.recipe_id).trim();
  let recipe = null;
  if (recipeId) {
    recipe = recipeIn(work, recipeId);
    if (!recipe) fail(`No existe la receta "${recipeId}". Créala antes con crear_receta o usa un id del catálogo.`);
  }
  if (scope === 'semana') {
    const days = [...new Set(input.weekdays || [])];
    if (!days.length || days.some((d) => !isInt(d) || d < 0 || d > 6)) fail('weekdays debe tener días del 0 (lunes) al 6 (domingo)');
    commit(
      work,
      { op: 'meal', scope: 'semana', keys: days.map((d) => `${d}.${slot}`), recipeId },
      recipeId
        ? `${SLOT_LABEL[slot]} de los ${days.map((d) => DAYS[d]).join(', ')} → ${recipe.name}`
        : `${SLOT_LABEL[slot]} de los ${days.map((d) => DAYS[d]).join(', ')} → la del plan original`
    );
    return `Hecho. ${work.changes[work.changes.length - 1]}.`;
  }
  const date = input.date;
  if (!isStr(date) || !DATE_RE.test(date) || Number.isNaN(Date.parse(date))) fail('date debe ser YYYY-MM-DD');
  if (work.today && (date < addDays(work.today, -7) || date > addDays(work.today, 60))) fail('La fecha tiene que estar entre hace 7 días y dentro de 60 días');
  const idx = weekdayIdx(date);
  let id = recipeId;
  // "Volver al plan" un día concreto cuando hay un cambio semanal: se fija la receta original solo ese día
  if (!id && work.custom?.menu?.[`${idx}.${slot}`]) id = WEEK_MENU[idx][slot];
  commit(work, { op: 'meal', scope: 'dia', keys: [`${date}.${slot}`], recipeId: id }, `${SLOT_LABEL[slot]} del ${DAYS[idx]} ${date.slice(8, 10)}/${date.slice(5, 7)} → ${recipe ? recipe.name : 'la del plan'}`);
  return `Hecho. ${work.changes[work.changes.length - 1]}.`;
}

function toolCrearReceta(input, work) {
  keysOnly(input, ['name', 'slot', 'emoji', 'minutes', 'ingredients', 'steps', 'tip']);
  if (!isStr(input.name)) fail('Falta el nombre');
  if (!SLOT_KEYS.includes(input.slot)) fail('slot no válido');
  if (!Array.isArray(input.ingredients) || !input.ingredients.length || input.ingredients.length > 25) fail('Hacen falta entre 1 y 25 ingredientes');
  if (!Array.isArray(input.steps) || !input.steps.length || input.steps.length > 15) fail('Hacen falta entre 1 y 15 pasos');
  const foods = {};
  const ingredients = input.ingredients.map((ing, i) => {
    if (!ing || typeof ing !== 'object') fail(`Ingrediente ${i + 1} no válido`);
    const grams = Number(ing.grams);
    if (!isNum(grams) || grams < 0 || grams > 2000) fail(`Ingrediente ${i + 1}: gramos no válidos`);
    const note = optStr(ing.note, 'note', 120);
    if (ing.food_key) {
      if (!FOODS[ing.food_key]) fail(`"${ing.food_key}" no está en el catálogo de alimentos. Usa otra clave o pon food_key null con name y per100.`);
      return note ? [ing.food_key, Math.round(grams), note] : [ing.food_key, Math.round(grams)];
    }
    if (!isStr(ing.name) || !ing.per100 || typeof ing.per100 !== 'object') fail(`Ingrediente ${i + 1}: sin food_key hacen falta name y per100`);
    const m = ing.per100;
    for (const k of ['kcal', 'protein', 'carbs', 'fat']) if (!isNum(m[k]) || m[k] < 0 || m[k] > 900) fail(`Ingrediente ${i + 1}: ${k} no válido`);
    const key = `x${i}-${ing.name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '').slice(0, 20) || 'item'}`;
    foods[key] = { name: ing.name.trim().slice(0, 80), kcal: m.kcal, p: m.protein, c: m.carbs, f: m.fat, fib: 0, cat: CATS.includes(m.category) ? m.category : 'Otros' };
    return note ? [key, Math.round(grams), note] : [key, Math.round(grams)];
  });
  const steps = input.steps.map((st, i) => {
    if (!st || !isStr(st.text)) fail(`Paso ${i + 1} sin texto`);
    const t = st.timer_seconds;
    return t != null && isInt(t) && t > 0 && t <= 7200 ? { t: st.text.trim().slice(0, 500), timer: t } : { t: st.text.trim().slice(0, 500) };
  });
  const recipe = {
    id: newId('c'),
    name: input.name.trim().slice(0, 90),
    slot: input.slot,
    time: isInt(input.minutes) && input.minutes > 0 ? Math.min(input.minutes, 300) : 15,
    emoji: optStr(input.emoji, 'emoji', 8),
    tags: ['tuya'],
    ingredients,
    ...(Object.keys(foods).length ? { foods } : {}),
    steps,
    tip: optStr(input.tip, 'tip', 300),
    custom: true,
    createdAt: Date.now(),
  };
  const m = recipeMacrosFor(recipe);
  commit(work, { op: 'recipe', recipe }, `Receta nueva: ${recipe.name} (${m.kcal} kcal, ${m.p} g proteína)`);
  return `Receta creada con id "${recipe.id}". Macros por ración: ${m.kcal} kcal, proteína ${m.p} g, hidratos ${m.c} g, grasa ${m.f} g, fibra ${m.fib} g. Si quieres que salga en el menú, llama a cambiar_comida con este id.`;
}

function toolEditarEntreno(input, work) {
  keysOnly(input, ['workout', 'action', 'exercise_id', 'new_exercise_id', 'sets', 'rep_min', 'rep_max', 'rest_seconds', 'note', 'position']);
  const w = WORKOUT_BY_KEY[input.workout];
  if (!w || w.rest) fail('workout no válido');
  const current = (work.custom?.workouts?.[w.key] || w.items).map((it) => [...it]);
  const { action } = input;
  if (action === 'restaurar') {
    commit(work, { op: 'workout', key: w.key, items: null }, `${w.name}: rutina original`);
    return `Hecho. ${w.name} vuelve a la rutina original:\n${w.items.map(itemText).join('\n')}`;
  }
  const num = (v, name, lo, hi) => {
    if (v == null) return null;
    if (!isInt(v) || v < lo || v > hi) fail(`${name} debe estar entre ${lo} y ${hi}`);
    return v;
  };
  const sets = num(input.sets, 'sets', 1, 8);
  const lo = num(input.rep_min, 'rep_min', 1, 50);
  const hi = num(input.rep_max, 'rep_max', 1, 60);
  const rest = num(input.rest_seconds, 'rest_seconds', 15, 300);
  const note = input.note == null ? undefined : optStr(input.note, 'note', 200);
  const findIdx = () => {
    const i = current.findIndex((it) => it[0] === input.exercise_id);
    if (i < 0) fail(`"${input.exercise_id}" no está en ${w.name}. Ejercicios del día: ${current.map((it) => it[0]).join(', ')}`);
    return i;
  };
  const checkNew = () => {
    const id = input.new_exercise_id;
    if (!id || !EX_IDS.has(id)) fail(`"${id}" no está en el catálogo de ejercicios`);
    if (getExercise(id)?.cardio) fail('Los ejercicios de cardio no van en la lista de pesas');
    if (current.some((it) => it[0] === id)) fail(`${getExercise(id).name} ya está en ${w.name}`);
    return id;
  };
  let change;
  if (action === 'cambiar') {
    const i = findIdx();
    const id = checkNew();
    const old = current[i];
    current[i] = [id, sets ?? old[1], lo ?? old[2], hi ?? old[3], rest ?? old[4], ...(note !== undefined ? (note ? [note] : []) : [])];
    change = `${w.name}: ${getExercise(old[0])?.name} → ${getExercise(id).name}`;
  } else if (action === 'añadir') {
    if (current.length >= 12) fail('Máximo 12 ejercicios por día');
    const id = checkNew();
    const item = [id, sets ?? 3, lo ?? 10, hi ?? 12, rest ?? 60, ...(note ? [note] : [])];
    const pos = input.position != null && isInt(input.position) ? Math.max(0, Math.min(current.length, input.position - 1)) : current.length;
    current.splice(pos, 0, item);
    change = `${w.name}: + ${getExercise(id).name}`;
  } else if (action === 'quitar') {
    const i = findIdx();
    if (current.length <= 2) fail('Deja al menos 2 ejercicios en el día');
    const [old] = current.splice(i, 1);
    change = `${w.name}: − ${getExercise(old[0])?.name}`;
  } else if (action === 'ajustar') {
    const i = findIdx();
    const old = current[i];
    if (sets == null && lo == null && hi == null && rest == null && note === undefined) fail('No has indicado qué ajustar');
    const nextNote = note !== undefined ? note : old[5];
    current[i] = [old[0], sets ?? old[1], lo ?? old[2], hi ?? old[3], rest ?? old[4], ...(nextNote ? [nextNote] : [])];
    change = `${w.name}: ${getExercise(old[0])?.name} ${current[i][1]}×${current[i][2]}-${current[i][3]}`;
  } else {
    fail('action no válida');
  }
  for (const it of current) if (it[2] > it[3]) fail('rep_min no puede ser mayor que rep_max');
  commit(work, { op: 'workout', key: w.key, items: current }, change);
  return `Hecho. ${w.name} queda así:\n${current.map(itemText).join('\n')}`;
}

function toolActualizarPerfil(input, work) {
  keysOnly(input, ['goal_kg', 'gym_time', 'wake_time', 'height_cm', 'age', 'double_session']);
  const patch = {};
  const parts = [];
  if (input.goal_kg != null) {
    if (!isNum(input.goal_kg) || input.goal_kg < 55 || input.goal_kg > 120) fail('goal_kg fuera de rango');
    patch.goalKg = Math.round(input.goal_kg * 10) / 10;
    parts.push(`objetivo ${patch.goalKg} kg`);
  }
  for (const [k, field, label] of [
    ['gym_time', 'gymTime', 'gym a las'],
    ['wake_time', 'wakeTime', 'te levantas a las'],
  ]) {
    if (input[k] != null) {
      if (!TIME_RE.test(input[k])) fail(`${k} debe ser HH:MM`);
      patch[field] = input[k];
      parts.push(`${label} ${input[k]}`);
    }
  }
  if (input.height_cm != null) {
    if (!isNum(input.height_cm) || input.height_cm < 140 || input.height_cm > 220) fail('height_cm fuera de rango');
    patch.heightCm = Math.round(input.height_cm);
    parts.push(`altura ${patch.heightCm} cm`);
  }
  if (input.age != null) {
    if (!isInt(input.age) || input.age < 14 || input.age > 90) fail('age fuera de rango');
    patch.age = input.age;
    parts.push(`${patch.age} años`);
  }
  if (input.double_session != null) {
    if (typeof input.double_session !== 'boolean') fail('double_session debe ser true o false');
    patch.doubleSession = input.double_session;
    parts.push(input.double_session ? 'doble sesión activada' : 'doble sesión desactivada');
  }
  if (!parts.length) fail('No hay nada que cambiar');
  commit(work, { op: 'profile', patch }, `Perfil: ${parts.join(', ')}`);
  return `Hecho. Perfil actualizado: ${parts.join(', ')}.`;
}

function toolRecordar(input, work) {
  keysOnly(input, ['action', 'text', 'note_id']);
  if (input.action === 'guardar') {
    const text = optStr(input.text, 'text', 300);
    if (!text) fail('Falta el texto de la nota');
    if (Object.keys(work.custom?.notes || {}).length >= 40) fail('Hay demasiadas notas: borra alguna antigua');
    const id = newId('n');
    commit(work, { op: 'note', id, text }, `Recordaré: ${text}`);
    return `Nota guardada [${id}].`;
  }
  if (input.action === 'borrar') {
    const id = input.note_id;
    if (!id || !work.custom?.notes?.[id]) fail('Esa nota no existe');
    const text = work.custom.notes[id];
    commit(work, { op: 'note', id, text: null }, `Olvidado: ${text}`);
    return 'Nota borrada.';
  }
  fail('action no válida');
}

function toolRestaurar(input, work) {
  keysOnly(input, ['what']);
  const labels = { menu: 'el menú', entrenos: 'los entrenos', recetas: 'tus recetas', notas: 'las notas', todo: 'todo el plan' };
  if (!labels[input.what]) fail('what no válido');
  commit(work, { op: 'reset', what: input.what }, `Restaurado ${labels[input.what]}`);
  return `Hecho: ${labels[input.what]} vuelve al original.`;
}

const RUNNERS = {
  cambiar_comida: toolCambiarComida,
  crear_receta: toolCrearReceta,
  editar_entreno: toolEditarEntreno,
  actualizar_perfil: toolActualizarPerfil,
  recordar: toolRecordar,
  restaurar_plan: toolRestaurar,
};

// → { content, isError }
export function runTool(name, input, work) {
  const fn = RUNNERS[name];
  if (!fn) return { content: `Herramienta desconocida: ${name}`, isError: true };
  try {
    return { content: fn(input, work), isError: false };
  } catch (e) {
    if (e instanceof Invalid) return { content: `No se ha aplicado: ${e.message}`, isError: true };
    console.error('advisor tool', name, e);
    return { content: 'Error interno al aplicar el cambio.', isError: true };
  }
}
